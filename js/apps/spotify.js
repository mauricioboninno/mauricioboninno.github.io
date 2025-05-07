  export class Spotify {
  static DEFAULT_IMAGE = 'img/image-error.png';
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
      menuHeader: document.getElementById('spotify-menu-header'),
      lastPlayedTime: document.getElementById('spotify-track-last-played-time')
    };

    this.state = {
      track: null,
      interval: null,
      fetching: false
    };
  }

  startChecking() {
    this.init();
  }

  init() {
    this.checkSpotifyStatus();
    this.state.interval = setInterval(() => this.checkSpotifyStatus(), 1000);
    this.showLastPlayed();
  }

  async checkSpotifyStatus() {
    if(this.state.fetching) return;

    this.state.fetching = true;
    
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
      
      if(track.isPlaying || !this.state.track?.isPlaying) {
        this.state.track = track;
        this.updateDisplay(track);
        this.cacheTrack(track);
      }

    } catch (error) {
      console.error(error);
      this.showLastPlayed();
    } finally {
      clearTimeout(timeoutId);
      this.state.fetching = false;
    }
  }

  parseTrackData(data) {
    if(!data?.recenttracks?.track?.length) {
      throw new Error('No recent tracks found in response');
    }

    const track = data.recenttracks.track[0];
    const isNowPlaying = track['@attr']?.nowplaying === "true";

    return {
      name: track.name || '',
      artist: track.artist['#text'] || '',
      image: this.getBestAvailableImage(track.image),
      url: track.url || this.generateTrackUrl(track),
      isPlaying: isNowPlaying,
      timestamp: isNowPlaying ? Date.now() : (track.date?.uts ? track.date.uts * 1000 : Date.now())
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
    if(!url || url.includes('2a96cbd8b46e442fc41c2b86b821562f')) return false;
    
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  generateTrackUrl(track) {
    const artist = track.artist?.['#text'] ?? 'Unknown Artist';
    const name = track.name ?? 'Unknown Track';
  
    const encodedArtist = encodeURIComponent(artist);
    const encodedName = encodeURIComponent(name);

    return `https://www.last.fm/music/${encodedArtist}/_/${encodedName}`;
  }

  cacheTrack(track) {
    try {
      localStorage.setItem(
        Spotify.LOCALSTORAGE_KEY, 
        JSON.stringify(track)
      );
    } catch (error) {
      console.error(error);
    }
  }

  showLastPlayed() {
    try {
      const lastPlayed = localStorage.getItem(Spotify.LOCALSTORAGE_KEY);

      if(lastPlayed) {
        const track = JSON.parse(lastPlayed);

        this.updateDisplay(track);
        this.updateLastPlayedTime(track.timestamp);
      } else {
        this.updateDisplay(this.emptyTrack());
        this.elements.lastPlayedTime.textContent = '';
      }
    } catch (error) {
      console.error(error);
      this.updateDisplay(this.emptyTrack());
      this.elements.lastPlayedTime.textContent = '';
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

  updateLastPlayedTime(timestamp) {
    if(!timestamp) return;

    const pluralize = (value, unit) => `${value} ${unit}${value !== 1 ? 's' : ''} ago`;

    const parseTimeUnit = (ms) => ({
      minute: Math.floor(ms / 60000),
      hour: Math.floor(ms / 3600000),
      day: Math.floor(ms / 86400000)
    });

    const { minute, hour, day } = parseTimeUnit(Date.now() - timestamp);

    let timeStampText;

    switch(true) {
      case day > 0: timeStampText = pluralize(day, 'day'); break;
      case hour > 0: timeStampText = pluralize(hour, 'hour'); break;
      case minute > 0: timeStampText = pluralize(minute, 'minute'); break;
      default: timeStampText = 'Just now'; 
    }

    this.elements.lastPlayedTime.textContent = timeStampText
  }

  updateDisplay(track) {
    const { menuHeader, trackName, trackArtist, trackImage } = this.elements;
    const { isPlaying, name, artist, image } = track;

    const statusText = isPlaying ? 'Listening to' : 'Last song';
    menuHeader.textContent = statusText;
    menuHeader.setAttribute('data-status', statusText);

    trackName.textContent = name || 'Failed to load track name';
    trackArtist.textContent = artist || 'Failed to load artist name';

    this.loadTrackImage(trackImage, image);

    if(!isPlaying && track.timestamp) {
      this.updateLastPlayedTime(track.timestamp);
    } else {
      this.elements.lastPlayedTime.textContent = '';
    }
  }

  loadTrackImage(element, url) {
    const effectiveUrl = url || Spotify.DEFAULT_IMAGE;
    const img = new Image();

    const updateImage = (imageUrl) => {
        element.style.backgroundImage = `url('${imageUrl}')`;
        element.style.display = 'block';
    };

    img.onload = () => updateImage(effectiveUrl);
    img.onerror = () => updateImage(Spotify.DEFAULT_IMAGE);

    img.src = effectiveUrl;
  }

  destroy() {
    if(this.state.interval) {
      clearInterval(this.state.interval);
    }
  }
}