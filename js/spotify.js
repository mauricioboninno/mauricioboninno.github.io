export class Spotify {
  static DEFAULT_IMAGE = 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';
  static LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';
  static LOCALSTORAGE_KEY = 'lastPlayedTrack';
  static CHECK_INTERVAL = 10000;

  constructor() {
    this.config = {
      lastfmApiKey: 'c068cf877f2cb307c1b0dca2a056f10e',
      lastfmUser: 'MauricioBonino'
    };

    this.elements = {
      spotifyMenu: document.getElementById('spotify-menu'),
      trackImage: document.getElementById('spotify-track-image'),
      trackName: document.getElementById('spotify-track-name'),
      trackArtist: document.getElementById('spotify-track-artist'),
      menuHeader: document.getElementById('spotify-menu-header')
    };

    this.state = {
      currentTrack: null,
      checkInterval: null,
      isFetching: false
    };
  }

  startChecking() {
    this.init();
  }

  init() {
    this.checkSpotifyStatus();
    this.state.checkInterval = setInterval(() => this.checkSpotifyStatus(), Spotify.CHECK_INTERVAL);
    this.showLastPlayed();
  }

  async checkSpotifyStatus() {
    if(this.state.isFetching) return;
    this.state.isFetching = true;
    
    try {
      const url = new URL(Spotify.LASTFM_API_URL);
      url.searchParams.append('method', 'user.getrecenttracks');
      url.searchParams.append('user', this.config.lastfmUser);
      url.searchParams.append('api_key', this.config.lastfmApiKey);
      url.searchParams.append('format', 'json');
      url.searchParams.append('limit', '1');

      const response = await fetch(url.toString());
      
      if(!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const track = this.parseTrackData(data);
      
      this.state.currentTrack = track;
      this.updateDisplay(track);
      this.cacheTrack(track);

    } catch (error) {
      console.error('Failed to fetch Spotify data:', error);
      this.showLastPlayed();
    } finally {
      this.state.isFetching = false;
    }
  }

  parseTrackData(data) {
    if(!data?.recenttracks?.track?.length) {
      throw new Error('No recent tracks found in response');
    }

    const track = data.recenttracks.track[0];
    const isNowPlaying = track['@attr']?.nowplaying === "true";

    return {
      name: track.name || 'Unknown Track',
      artist: track.artist['#text'] || 'Unknown Artist',
      image: track.image?.find(img => img.size === "medium")?.["#text"] || 
            track.image?.find(img => img.size === "large")?.["#text"] ||
            Spotify.DEFAULT_IMAGE,
      url: track.url || this.generateTrackUrl(track),
      isPlaying: isNowPlaying,
      timestamp: Date.now()
    };
  }

  generateTrackUrl(track) {
    const artist = encodeURIComponent(track.artist['#text'] || 'Unknown Artist');
    const name = encodeURIComponent(track.name || 'Unknown Track');
    return `https://www.last.fm/music/${artist}/_/${name}`;
  }

  cacheTrack(track) {
    try {
      localStorage.setItem(
        Spotify.LOCALSTORAGE_KEY, 
        JSON.stringify(track)
      );
    } catch (error) {
      console.error('Failed to cache track:', error);
    }
  }

  showLastPlayed() {
    try {
      const lastPlayed = localStorage.getItem(Spotify.LOCALSTORAGE_KEY);
      if(lastPlayed) {
        const track = JSON.parse(lastPlayed);
        this.updateDisplay(track);
      } else {
        this.updateDisplay(this.getEmptyTrack());
      }
    } catch (error) {
      console.error('Failed to load last played track:', error);
      this.updateDisplay(this.getEmptyTrack());
    }
  }

  getEmptyTrack() {
    return {
      name: 'Not available',
      artist: '',
      image: '',
      isPlaying: false
    };
  }

  updateDisplay(track) {
    const { menuHeader, trackName, trackArtist, trackImage } = this.elements;
    
    menuHeader.textContent = track.isPlaying ? 'Listening to' : 'Last song';
    trackName.textContent = track.name;
    trackArtist.textContent = track.artist;
    
    if(track.image) {
      trackImage.style.backgroundImage = `url('${track.image}')`;
      trackImage.style.display = 'block';
    } else {
      trackImage.style.backgroundImage = 'none';
      trackImage.style.display = 'none';
    }
  }

  destroy() {
    if(this.state.checkInterval) {
      clearInterval(this.state.checkInterval);
    }
  }
}