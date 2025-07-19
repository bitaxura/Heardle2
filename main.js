let playlist = [];
let currentTrack;
let currentAnswer;
let tryCount = 1;
let snippetDuration = 1000;
const MAX_TRIES = 4;
let player = null;
let deviceID = null;
let shouldBePaused = false;
let snippetTimeoutId = null;
let progressIntervalId = null;
let correct = 0;
let total = 1;

const guessList = document.getElementById('guess-list');
const guessesUl = document.getElementById('guesses');
const guessInput = document.getElementById('guess');
const submitBtn = document.getElementById('submit-guess');
const result = document.getElementById('result');
const progressBar = document.getElementById('progress-bar');
const count = document.getElementById('count');

const redirectUri = `${window.location.origin}/`;

(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
    
    if (!code) {
      const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
      };
  
      const sha256 = async (plain) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest('SHA-256', data);
      };
  
      const base64encode = (input) => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
          .replace(/=/g, '')
          .replace(/\+/g, '-')
          .replace(/\//g, '_');
      };
  
      const codeVerifier = generateRandomString(64);
      const hashed = await sha256(codeVerifier);
      const codeChallenge = base64encode(hashed);
  
      localStorage.setItem('code_verifier', codeVerifier);
  
      const clientId = 'YOUR_CLIENT_ID_HERE'; // Replace with your actual client ID
      const scope = 'user-read-private user-read-email streaming user-read-playback-state user-modify-playback-state';
  
      const authUrl = new URL("https://accounts.spotify.com/authorize");
      const params = {
        response_type: 'code',
        client_id: clientId,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
      };
  
      authUrl.search = new URLSearchParams(params).toString();
      window.location.href = authUrl.toString();
      return;
    } else {
      await getToken(code);
      
      window.history.replaceState({}, document.title, redirectUri);
    }
  })();
  
  async function getToken(code) {
    const clientId = 'YOUR_CLIENT_ID_HERE';
    const codeVerifier = localStorage.getItem('code_verifier');
  
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });
  
    const data = await response.json();
  
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('expires_at', Date.now() + data.expires_in * 1000);
  
    console.log('Access Token:', data.access_token);
  }
  
async function loadPlaylist() {
    const res = await fetch('tracks.json');
    playlist = await res.json();

    const datalist = document.getElementById('suggestions');
    datalist.innerHTML = '';

    playlist.forEach(track => {
        const option = document.createElement('option');
        option.value = `${track.name} - ${track.artist}`;
        datalist.appendChild(option);
    });
}

function pickRandomTrack() {
    const randomIndex = Math.floor(Math.random() * playlist.length);
    currentTrack = playlist[randomIndex];
    currentAnswer = `${currentTrack.name} - ${currentTrack.artist}`;

    tryCount = 1;
    snippetDuration = 1000;
    console.log('Now Playing: ', currentTrack.name);
}

function playSnippet() {
    progressBar.style.width = '0%';

    if (progressIntervalId) {
        clearInterval(progressIntervalId);
        progressIntervalId = null;
    }

    const intervalMs = 100;
    let elapsed = 0;

    progressIntervalId = setInterval(() => {
        elapsed += intervalMs;
        const percent = Math.min((elapsed / snippetDuration) * 100, 100);
        progressBar.style.width = `${percent}%`;

        if (elapsed >= snippetDuration) {
            clearInterval(progressIntervalId);
            progressIntervalId = null;
        }
    }, intervalMs);

    shouldBePaused = false;
    clearSnippetTimeout();

    player._options.getOAuthToken(token => {
        fetch(`https://api.spotify.com/v1/me/player/play`, {
            method: 'PUT',
            body: JSON.stringify({
                uris: [currentTrack.uri],
                position_ms: 0
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(() => {
            snippetTimeoutId = setTimeout(() => {
                player.pause();
                shouldBePaused = true;
            }, snippetDuration);
        });
    });
}

function addGuessToList(guessText, isCorrect) {
    guessList.classList.remove('hidden');
    const li = document.createElement('li');
    li.textContent = guessText;
    li.style.color = isCorrect ? '#a0d2a0' : '#d2a0a0';
    guessesUl.appendChild(li);
}

function setupUI() {
    const startBtn = document.getElementById('start-btn');
    const playBtn = document.getElementById('play-snippet');
    const skipBtn = document.getElementById('skip-btn');
    const nextBtn = document.getElementById('next-btn');

    startBtn.addEventListener('click', () => {
        document.getElementById('player-controls').classList.remove('hidden');
        startBtn.classList.add('hidden');
        pickRandomTrack();
        playSnippet();
        count.textContent = `${correct}/${total} correct so far`;
    });

    playBtn.addEventListener('click', playSnippet);

    skipBtn.addEventListener('click', () => {
        handleWrongAnswer('Skipped');
    });

    nextBtn.addEventListener('click', () => {
        if (currentTrack) {
          playlist = playlist.filter(track => track.uri !== currentTrack.uri);
      
          const datalist = document.getElementById('suggestions');
          datalist.innerHTML = '';
          playlist.forEach(track => {
            const option = document.createElement('option');
            option.value = `${track.name} - ${track.artist}`;
            datalist.appendChild(option);
          });
        }
      
        if (playlist.length === 0) {
          result.textContent = 'No more songs left!';
          guessInput.disabled = true;
          submitBtn.disabled = true;
          skipBtn.disabled = true;
          nextBtn.disabled = true;
          return;
        }
      
        pickRandomTrack();
        playSnippet();
        guessesUl.innerHTML = '';
        result.textContent = `Playing ${snippetDuration / 1000}s snippet.`;
        skipBtn.disabled = false;
        skipBtn.textContent = "Skip (+2s)";
        total++;
        count.textContent = `${correct}/${total} correct so far`;
      });
      
    submitBtn.addEventListener('click', () => {
        const guess = guessInput.value.trim();
        if (!guess) return;

        const isCorrect = guess === currentAnswer;

        if (isCorrect) {
            result.textContent = `Correct! Now Playing ${guess}`;
            player.pause();
            snippetDuration = 30000;
            playSnippet();
            correct++;
            count.textContent = `${correct}/${total} correct so far`;
        } else {
            handleWrongAnswer(guess);
        }

        guessInput.value = '';
    });

    function handleWrongAnswer(guess) {
        player.pause();
        tryCount++;
        snippetDuration += (tryCount ** 2) * 1000;
    
        const nextTryCount = tryCount + 1;
        const nextIncrementSeconds = ((nextTryCount ** 2) * 1000) / 1000;
    
        const skipBtn = document.getElementById('skip-btn');
        skipBtn.textContent = `Skip (+${nextIncrementSeconds}s)`;
    
        if (tryCount > MAX_TRIES) {
            result.textContent = `Out of Tries! It was: ${currentAnswer}`;
            player.pause();
            snippetDuration = 30000;
            playSnippet();
            skipBtn.disabled = true;
        } else {
            result.textContent = `Playing ${snippetDuration / 1000}s snippet.`;
            playSnippet();
        }
    
        progressBar.style.width = '0%';
    
        addGuessToList(guess, false);
    }
}

function clearSnippetTimeout() {
    if (snippetTimeoutId) {
        clearTimeout(snippetTimeoutId);
        snippetTimeoutId = null;
    }
}

window.onSpotifyWebPlaybackSDKReady = () => {
    player = new Spotify.Player({
        name: 'Heardle Player',
        getOAuthToken: cb => { 
            const token = localStorage.getItem('access_token');
            cb(token);
         },
        volume: 0.9
    });

    player.addListener('player_state_changed', state => {
        if (!state.paused && shouldBePaused) player.pause();
    });

    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        deviceID = device_id;
        transferPlaybackHere();
    });

    player.connect();
};

function transferPlaybackHere() {
    fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        body: JSON.stringify({
            device_ids: [deviceID],
            play: false
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    }).then(res => {
        if (res.ok) {
            console.log('Playback transferred to Web Player.');
        } else {
            console.error('Failed to transfer playback.');
        }
    });
}

loadPlaylist();
setupUI();
