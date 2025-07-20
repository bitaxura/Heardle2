# Heardle 2

Heardle 2 is a web-based music guessing game inspired by the popular Heardle game. Players listen to short snippets of songs and try to guess the song title and artist. It integrates with Spotify to fetch playlist tracks and play snippets.

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
requirements.txt # Python dependencies for the project
get_playlist.py  # Python script to fetch playlist tracks  
index.html       # Main HTML file for the game interface  
main.js          # JavaScript logic for the game  
README.md        # Project documentation  
style.css        # Stylesheet for the game interface  
tracks.json      # JSON file containing playlist tracks (generated)
```
---
## Setup

### Prerequisites

* Python 3.x
* Spotify Developer Account
* Spotify Premium Account (required for playback)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/heardle-2.git
   cd heardle-2
   ```

2. Install Python dependencies:

   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the root directory:

   ```env
   CLIENT_ID=your_spotify_client_id
   CLIENT_SECRET=your_spotify_client_secret
   PLAYLIST_ID=your_spotify_playlist_id
   ```

   * Get your **Client ID** and **Client Secret** from the (see the next section)
   * To get your custom playlist, read here: [How to Set Your Playlist](#how-to-get-a-spotify-playlist-and-playlist-id)

4. **Configure the Spotify Developer Dashboard:**

   * Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
   * Click **Create an App** (or choose an existing app).
   * Under your app’s settings:

     * Set the **Redirect URI** based on the local server you are using:

       * If using **Live Server** (VS Code extension):
         `http://127.0.0.1:5500/`
       * If using **Python HTTP server**:
         `http://127.0.0.1:8000/`
     * Add the redirect URI under **Edit Settings → Redirect URIs**.
   * Scroll down to **User Management** and add the email addresses of other Spotify users who should be able to use the app (see note below).
   * Confirm that the following **APIs** are enabled in your app’s authorization flow:

     * `Web API`

     * `Web Playback SDK`

   > **Note:** This game will only work with the Spotify account used to create the app unless you add additional users via the **User Management** section on the Spotify Developer Dashboard.

5. Fetch playlist tracks:

   ```
   python get_playlist.py
   ```

   This will generate a `tracks.json` file containing tracks from the specified playlist.

6. Run a local server to serve the game:

   * **Live Server** (recommended with VS Code):

     * Right-click `index.html` and choose **Open with Live Server**.
     * This usually runs on:
       `http://127.0.0.1:5500/`
   * **Python HTTP Server** (if you prefer terminal):

     ```
     python -m http.server
     ```
     Make sure to run this in the project directory.

     Then open:
     `http://127.0.0.1:8000/`

---

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

- When you open the game, you will be redirected to Spotify's authentication page.
- Log in with your Spotify account and grant the necessary permissions for the game to access your playlist and playback features.
- After successful authentication, you will be redirected back to the game interface.
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

---

## Future Plans

- Add a give up button
- Add artist image and song/album cover popup at the end of the round

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/)
- Inspired by the original **Heardle** game