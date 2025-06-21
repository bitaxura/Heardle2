const token = window.config.TOKEN;

let playlist = [];
let currentTrack;
let currentAnswer;
let tryCount = 1;
let snippetDuration = 2000;
const MAX_TRIES = 4;
let player = null;
let deviceID = null;
let shouldBePaused = false;
let snippetTimeoutId = null;
let progressIntervalId = null;

const guessList = document.getElementById('guess-list');
const guessesUl = document.getElementById('guesses');
const guessInput = document.getElementById('guess');
const submitBtn = document.getElementById('submit-guess');
const result = document.getElementById('result');
const progressBar = document.getElementById('progress-bar');

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
        guessList.classList.add('hidden');
        result.textContent = `Playing ${snippetDuration / 1000}s snippet.`;
        skipBtn.disabled = false;
        skipBtn.textContent = "Skip (+2s)";
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
        getOAuthToken: cb => { cb(token); },
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

    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    player.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('account_error', ({ message }) => {
        console.error(message);
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
            'Authorization': `Bearer ${token}`
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
