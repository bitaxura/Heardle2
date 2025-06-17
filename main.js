const clientId = window.config.CLIENT_ID;
const clientSecret = window.config.CLIENT_SECRET;
const token = window.config.TOKEN;

let playlist = [];
let currentTrack;
let currentAnswer;
let tryCount = 1;
let snippetDuration = 1000;
const MAX_TRIES = 4;
let player = null
let deviceID = null;

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

function setupUI(){
    const startBtn = document.getElementById('start-btn');
    const playBtn = document.getElementById('play-snippet');
    const skipBtn = document.getElementById('skip-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-guess');
    const result = document.getElementById('result');
    const guessInput = document.getElementById('guess');

    startBtn.addEventListener('click', () => {
        document.getElementById('player-controls').classList.remove('hidden');
        startBtn.classList.add('hidden');
        pickRandomTrack();
        playSnippet();
    });

    playBtn.addEventListener('click', playSnippet);

    skipBtn.addEventListener('click', () => {
        handleWrongAnswer();
    });

    nextBtn.addEventListener('click', () => {
        pickRandomTrack();
        playSnippet();
    });

    submitBtn.addEventListener('click', () =>{
        const guess = guessInput.value.trim().toLowerCase();
        if (!guess) return;

        if (guess === currentAnswer){
            result.textContent = 'Correct!'
            player.pause();
        }
        else{
            handleWrongAnswer();
        }
        guessInput.value = '';
    })

    function handleWrongAnswer(){
        tryCount++;
        snippetDuration += (tryCount ** 2) * 1000;

        if (tryCount > MAX_TRIES) {
            result.textContent = `Out of Tries! It was: ${currentAnswer}`;
            player.pause();
        }
        else {
            result.textContent = `Playing ${snippetDuration / 1000}s snippet.`; 
            playSnippet();
        }
    }
}

function pickRandomTrack() {
    const randomIndex = Math.floor(Math.random() * playlist.length);
    currentTrack = playlist[randomIndex];
    currentAnswer = currentTrack.name.toLowerCase();
    tryCount = 1;
    snippetDuration = 1000;
    console.log('Now Playing: ', currentTrack.name)
}

window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
        name: 'Heardle Player',
        getOAuthToken: cb => { cb(token)},
        volume: 0.8
    });

    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
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
}

function playSnippet() {
    if (!player || !currentTrack) return;

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
            setTimeout(() => {
                player.pause();
            }, snippetDuration);
        });
    });
}

loadPlaylist();
setupUI();