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

tracks = []
limit = 100
offset = 0

while True:
    results = sp.playlist_tracks(PLAYLIST_ID, limit=limit, offset=offset)
    items = results['items']
    if not items:
        break
    
    for item in items:
        track = item['track']
        artists = [artist['name'] for artist in track['artists']]
        tracks.append({
            'name': track['name'],
            'artists': artists,
            'uri': track['uri'],
            'album_art': track['album']['images'][0]['url']
        })
    
    offset += limit

with open('tracks.json', 'w') as f:
    json.dump(tracks, f, indent=2)
