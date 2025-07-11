# Heardle 2

**Heardle 2** is a web-based music guessing game inspired by the popular Heardle game. Players listen to short snippets of songs and try to guess the song title and artist. It integrates with Spotify to fetch playlist tracks and play snippets.

## Features

- Fetches tracks from a Spotify playlist
- Plays short audio snippets for guessing
- Tracks player progress (correct guesses, total attempts)
- Dynamic UI updates for game state and feedback
- Fully responsive, clean, and modern interface

## Project Structure

```
.env             # Environment variables for Spotify API credentials  
.gitignore       # Files and directories to ignore in version control  
config.js        # Configuration file for Spotify token  
get_playlist.py  # Python script to fetch playlist tracks  
index.html       # Main HTML file for the game interface  
main.js          # JavaScript logic for the game  
README.md        # Project documentation  
style.css        # Stylesheet for the game interface  
tracks.json      # JSON file containing playlist tracks (generated)
```

## Setup

### Prerequisites

- Python 3.x
- Spotify Developer Account
- Spotify Premium Account (required for playback)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/heardle-2.git
   cd heardle-2
   ```

2. Install Python dependencies:

   ```
   pip install spotipy python-dotenv
   ```

3. Create a `.env` file in the root directory:

   ```env
   CLIENT_ID=your_spotify_client_id
   CLIENT_SECRET=your_spotify_client_secret
   PLAYLIST_ID=your_spotify_playlist_id
   ```

   - Get your **Client ID** and **Client Secret** from the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

4. Fetch playlist tracks:

   ```
   python get_playlist.py
   ```

   This will generate a `tracks.json` file containing tracks from the specified playlist.

5. Open `index.html` in your browser to play the game.

6. You will also need to manually get an **OAuth token** for testing and paste it in `config.js`. Get the token [here](https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started#:~:text=Since%20this%20tutorial%20doesn%27t%20cover%20the%20authorization%20flow%2C%20we%20will%20provide%20your%20access%20token%20here%3A).

## How to Get a Spotify Playlist and Playlist ID

To use Heardle 2, you'll need to fetch tracks from a Spotify playlist. Here's how to create a playlist and get its ID:

### 1. Create or Choose a Playlist

* Go to [Spotify Web](https://open.spotify.com/) or use the Spotify desktop/mobile app.
* Create a new playlist or use an existing one.
* Add songs you'd like to use in your game.

### 2. Copy the Playlist Link

1. Open the playlist in Spotify.
2. Click the **three dots** (`...`) next to the playlist title or under the playlist name.
3. Hover over **Share**.
4. Click **Copy link to playlist**.

   Example link:

   ```
   https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
   ```

### 3. Extract the Playlist ID

* The **Playlist ID** is the part after `/playlist/` and before any `?` or parameters.

  Example:

  ```
  Playlist link: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=abc123
  Playlist ID:   37i9dQZF1DXcBWIGoYBM5M
  ```

### 3. Paste the Playlist ID in Your `.env` File

Your `.env` file should look like this:

```env
CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
PLAYLIST_ID=37i9dQZF1DXcBWIGoYBM5M
```

> Tip: Make sure the playlist is public or shared with your Spotify account to ensure it can be accessed by the API.

---

## How to Play

- Click the **Start Game** button to begin.
- Listen to the snippet and enter your guess for the song title and artist.
- Submit your guess to check if it's correct.
- Use the **Skip** button to hear a longer snippet.
- Click **Next Song** to move to the next track.

---

## Development Notes

### JavaScript (`main.js`)

- Loads playlist from `tracks.json`
- Plays snippets via Spotify Web Playback SDK
- Manages gameplay logic and user interactions

### Python Script (`get_playlist.py`)

- Fetches track data using the Spotify Web API
- Requires `.env` configuration for credentials

### Styling (`style.css`)

- Clean, mobile-friendly responsive design

---

## Environment Variables

Set these in your `.env` file:

- `CLIENT_ID`: Spotify API Client ID  
- `CLIENT_SECRET`: Spotify API Client Secret  
- `PLAYLIST_ID`: Spotify Playlist ID to fetch tracks from  

---

## Known Issues

- Spotify playback requires a **Premium** account.
- `config.js` uses a hardcoded token — in production, use dynamic token refreshing for security.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/)
- Inspired by the original **Heardle** game