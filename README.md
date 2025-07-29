# Heardle 2

Heardle 2 is a web-based music guessing game inspired by the popular Heardle game. Players listen to short snippets of songs and try to guess the song title and artist. It integrates with Spotify to fetch playlist tracks and play snippets.

## Features

- Fetches tracks from a Spotify playlist
- Plays short audio snippets for guessing
- Tracklist selection via dropdown
- Tracks player progress (correct guesses, total attempts)
- Dynamic UI updates for game state and feedback
---

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
data/            # Folder containing one or more playlist track JSON files

```

Each playlist you want to use is stored as a separate `.json` file inside the `data/` folder (e.g. `spotify-2020s.json`, `taylor-swift.json`).

---

## Setup

### Prerequisites

* Python 3.x
* Spotify Developer Account
* Spotify Premium Account (required for playback)

### Installation

1. Clone the repository:

    ```bash
   git clone https://github.com/your-username/heardle-2.git
   cd heardle-2
    ```

2. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the root directory:

   ```env
   CLIENT_ID=your_spotify_client_id
   CLIENT_SECRET=your_spotify_client_secret
   PLAYLIST_ID=your_spotify_playlist_id
   ```

   See [How to Get a Spotify Playlist and Playlist ID](#how-to-get-a-spotify-playlist-and-playlist-id) for instructions.

4. **Configure the Spotify Developer Dashboard:**

   * Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

   * Create an app and set the **Redirect URI**:

     * **Live Server**: `http://127.0.0.1:5500/`
     * **Python HTTP Server**: `http://127.0.0.1:8000/`

   * Enable `Web API` and `Web Playback SDK` in the app’s permissions.

   * Add users (emails) under **User Management** if you want others to play.
   > **Note:** This game will only work with the Spotify account used to create the app unless you add additional users via the **User Management** section on the Spotify Developer Dashboard.

5. Fetch playlist tracks:

  ```bash
   python get_playlist.py
  ```

This will generate a JSON file (e.g., `spotify-2020s.json`) **in the project root directory**.

>You will need to manually move this file into the `data/` folder.

You can repeat this process with different `.env` configurations to generate multiple playlist files.

6. Run a local server to serve the game:

   * **Live Server** (VS Code):

     Right-click `index.html` and select **Open with Live Server**
     URL: `http://127.0.0.1:5500/`

   * **Python HTTP Server** (Terminal):

     ```bash
     python -m http.server
     ```
     Open in browser at: `http://127.0.0.1:8000/`

---

## How to Get a Spotify Playlist and Playlist ID

1. Open Spotify, find a playlist.

2. Click the three dots → Share → Copy link to playlist.

   Example:

   ```
   https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
   ```

3. Extract the playlist ID:

   ```
   Playlist ID: 37i9dQZF1DXcBWIGoYBM5M
   ```

4. Paste into `.env`:

   ```env
   PLAYLIST_ID=37i9dQZF1DXcBWIGoYBM5M
   ```

---

## Adding More Tracklists

To add more playlists:

1. Update `.env` with a new `PLAYLIST_ID`.

2. Run:

   ```bash
   python get_playlist.py
   ```

3. Move the generated JSON file from the project root into the `data/` folder.

3. Rename the generated file in `data/`, e.g.:

   ```
   data/taylor-swift.json
   data/90s-hits.json
   ```

5. Add the new option to the dropdown in `index.html`:

   ```html
   <select id="jsonSelector">
     <option value="" disabled selected>Select a tracklist</option>
     <option value="spotify-2020s.json">Spotify 2020s Mix</option>
     <option value="taylor-swift.json">Taylor Swift Complete</option>
     <option value="90s-hits.json">90s Hits</option>
   </select>
   ```

---

## How to Play

* Open the game in your browser.
* Use the dropdown to select a tracklist (the **Start Game** button will appear).
* Click **Start Game** to begin.
* Listen to the snippet and enter your guess (title and artist).
  > Warning: If a song does not seem to play or is silent at the start, use the Skip button to move to a longer snippet.
* Use **Skip** to increase snippet length if needed.
* Click **Next Song** to move to the next track.

---

## Development Notes

### JavaScript (`main.js`)

* Loads the selected playlist from `data/{filename}.json`
* Plays snippets via Spotify Web Playback SDK
* Handles gameplay logic and user interactions

### Python Script (`get_playlist.py`)

* Fetches track data using the Spotify Web API
* Generates a `.json` file for each playlist

### Styling (`style.css`)

* Fully responsive
* Styled dropdown and buttons with game-themed colors

---

## Environment Variables

Your `.env` file must include:

```env
CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
PLAYLIST_ID=spotify_playlist_id
```

---

## Known Issues

* Requires Spotify Premium for playback.
* Some tracks may begin with silence (use **Skip**).
* Playback might not work if Spotify is not open in another tab or device.

---

## Future Plans

* Add a “Give Up” button
* Show album art and artist details at the end of each round
* Local high score tracking

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file.

---

## Acknowledgments

* [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
* [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/)
* Inspired by the original **Heardle** game