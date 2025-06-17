import os
import json
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
PLAYLIST_ID = os.getenv('PLAYLIST_ID')

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET))

results = sp.playlist_tracks(PLAYLIST_ID)

tracks = []

for item in results['items']:
    track = item['track']
    tracks.append({
        'name': track['name'],
        'artist': track['artists'][0]['name'],
        'uri': track['uri'],
        'album_art': track['album']['images'][0]['url']
    })

with open('tracks.json', 'w') as f:
    json.dump(tracks, f, indent=2)
