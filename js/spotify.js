  export class Spotify {
  static DEFAULT_IMAGE = 'img/defaultImage.jpg';
  static LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';
  static LOCALSTORAGE_KEY = 'lastPlayedTrack';

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
    this.state.checkInterval = setInterval(() => this.checkSpotifyStatus(), 1000);
    this.showLastPlayed();
  }

  async checkSpotifyStatus() {
    if(this.state.isFetching) return;

    this.state.isFetching = true;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const { LASTFM_API_URL: apiUrl } = Spotify;
      const { lastfmUser: user, lastfmApiKey: apiKey } = this.config;

      const url = new URL(apiUrl);
      const params = {
        method: 'user.getrecenttracks',
        user,
        api_key: apiKey,
        format: 'json',
        limit: '1'
      };

      Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

      const response = await fetch(url.toString(), {
        signal: controller.signal
      });
      
      if(!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const track = this.parseTrackData(data);
      
      if(track.isPlaying || !this.state.currentTrack?.isPlaying) {
        this.state.currentTrack = track;
        this.updateDisplay(track);
        this.cacheTrack(track);
      }

    } catch (error) {
      console.error('Failed to fetch Spotify data:', error);
      this.showLastPlayed();
    } finally {
      clearTimeout(timeoutId);
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
      image: this.getBestAvailableImage(track.image),
      url: track.url || this.generateTrackUrl(track),
      isPlaying: isNowPlaying,
      timestamp: Date.now()
    };
  }

  getBestAvailableImage(images) {
    if(!images || !Array.isArray(images)) return Spotify.DEFAULT_IMAGE;
    
    const preferredSizes = ['extralarge', 'large', 'medium', 'small'];
    
    for(const size of preferredSizes) {
      const image = images.find(img => img.size === size);

      if(image && image["#text"] && this.isValidImageUrl(image["#text"])) {
        return image["#text"];
      }
    }
    
    return Spotify.DEFAULT_IMAGE;
  }

  isValidImageUrl(url) {
    if(!url) return false;
    if(url.includes('2a96cbd8b46e442fc41c2b86b821562f')) return false;
    
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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
        this.updateDisplay(this.emptyTrack());
      }
    } catch (error) {
      console.error('Failed to load last played track:', error);
      this.updateDisplay(this.emptyTrack());
    }
  }

  emptyTrack() {
    return {
      name: '',
      artist: '',
      image: Spotify.DEFAULT_IMAGE,
      isPlaying: false
    };
  }

  updateDisplay(track) {
    const { menuHeader, trackName, trackArtist, trackImage } = this.elements;
    
    menuHeader.textContent = track.isPlaying ? 'Listening to' : 'Last song';
    trackName.textContent = track.name;
    trackArtist.textContent = track.artist;
    
    const img = new Image();
    img.onload = () => {
      trackImage.style.backgroundImage = `url('${track.image}')`;
      trackImage.style.display = 'block';
    };
    img.onerror = () => {
      trackImage.style.backgroundImage = `url('${Spotify.DEFAULT_IMAGE}')`;
      trackImage.style.display = 'block';
    };
    img.src = track.image || Spotify.DEFAULT_IMAGE;
  }

  destroy() {
    if(this.state.checkInterval) {
      clearInterval(this.state.checkInterval);
    }
  }
}