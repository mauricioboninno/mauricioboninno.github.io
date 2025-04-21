  export class Spotify {
  constructor() {
    this.lastfmApiKey = 'c068cf877f2cb307c1b0dca2a056f10e';
    this.lastfmUser = 'MauricioBonino';
    
    this.spotifyMenu = document.getElementById('spotify-menu');
    this.trackImage = document.getElementById('spotify-track-image');
    this.trackName = document.getElementById('spotify-track-name');
    this.trackArtist = document.getElementById('spotify-track-artist');
    this.menuHeader = document.getElementById('spotify-menu-header');
    
    this.currentTrack = null;
    this.checkInterval = null;
    
    this.init();
  }

  init() {
    this.checkSpotifyStatus();
    
    this.checkInterval = setInterval(() => this.checkSpotifyStatus(), 1000);
    
    this.showLastPlayed();
  }

  async checkSpotifyStatus() {
    try {
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${this.lastfmUser}&api_key=${this.lastfmApiKey}&format=json&limit=1`
      );
      
      if(!response.ok) throw new Error('Failed to fetch the API');

      const data = await response.json();
      
      if(!data?.recenttracks?.track?.length) {
        throw new Error('No hay datos de canciones');
      }

      const track = data.recenttracks.track[0];
      const isNowPlaying = track['@attr']?.nowplaying === "true";

      const trackData = {
        name: track.name,
        artist: track.artist['#text'],
        image: track.image?.find(img => img.size === "medium")?.["#text"] || 
              track.image?.find(img => img.size === "large")?.["#text"] ||
              'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png',
        url: track.url || `https://www.last.fm/music/${encodeURIComponent(track.artist['#text'])}/_/${encodeURIComponent(track.name)}`,
        isPlaying: isNowPlaying
      };
      
      this.currentTrack = trackData;
      this.updateDisplay(trackData);
      
      localStorage.setItem('lastPlayedTrack', JSON.stringify({
        ...trackData,
        timestamp: new Date().getTime()
      }));

    } catch (error) {
      console.error('Failed to fetch the data from Spotify => ', error);
      this.showLastPlayed();
    }
  }

  showLastPlayed() {
    const lastPlayed = localStorage.getItem('lastPlayedTrack');
    if (lastPlayed) {
      const track = JSON.parse(lastPlayed);
      this.updateDisplay(track);
    } else {
      this.updateDisplay({
        name: '',
        artist: '',
        image: '',
        isPlaying: false
      });
    }
  }

  updateDisplay(track) {
    this.menuHeader.textContent = track.isPlaying ? 'Listening to' : 'Last song';
    this.trackName.textContent = track.name;
    this.trackArtist.textContent = track.artist;
    this.trackImage.style.backgroundImage = track.image ? `url('${track.image}')` : 'none';
  }
}