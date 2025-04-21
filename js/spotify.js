  export class Spotify {
    constructor() {
      this.lastfmApiKey = 'c068cf877f2cb307c1b0dca2a056f10e';
      this.lastfmUser = 'MauricioBonino';
      this.widgetContainer = null;
      this.progressInterval = null;
      this.createWidget();
      this.startChecking();
    }
  
    createWidget() {
      this.widgetContainer = document.createElement('div');
      this.widgetContainer.className = 'spotify-widget animate__animated animate__fadeIn inactive';
      
      const spotifyIcon = document.createElement('i');
      spotifyIcon.className = 'fab fa-spotify spotify-icon';
      
      const infoContainer = document.createElement('div');
      infoContainer.className = 'track-info-container';
      
      this.trackName = document.createElement('div');
      this.trackName.className = 'track-name';
      this.trackName.textContent = 'No hay música reproduciéndose';
      
      this.trackArtist = document.createElement('div');
      this.trackArtist.className = 'track-artist';
      this.trackArtist.textContent = 'Conectado a Last.fm';
      
      const progressContainer = document.createElement('div');
      progressContainer.className = 'track-progress-container';
      
      this.currentTime = document.createElement('div');
      this.currentTime.className = 'track-progress-time';
      this.currentTime.textContent = '0:00';
      
      const progressBar = document.createElement('div');
      progressBar.className = 'track-progress-bar';
      
      this.progressFilled = document.createElement('div');
      this.progressFilled.className = 'track-progress-filled';
      
      this.durationTime = document.createElement('div');
      this.durationTime.className = 'track-progress-time';
      this.durationTime.textContent = '0:00';
      
      progressBar.appendChild(this.progressFilled);
      progressContainer.appendChild(this.currentTime);
      progressContainer.appendChild(progressBar);
      progressContainer.appendChild(this.durationTime);
      
      infoContainer.appendChild(this.trackName);
      infoContainer.appendChild(this.trackArtist);
      infoContainer.appendChild(progressContainer);
      
      this.widgetContainer.appendChild(spotifyIcon);
      this.widgetContainer.appendChild(infoContainer);
      
      this.widgetContainer.addEventListener('click', () => {
        window.open(`https://www.last.fm/user/${this.lastfmUser}`, '_blank');
      });
      
      document.body.appendChild(this.widgetContainer);
    }
  
    async checkSpotifyStatus() {
      try {
        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${this.lastfmUser}&api_key=${this.lastfmApiKey}&format=json&limit=1`
        );
        
        if (!response.ok) throw new Error('Error en la API');
  
        const data = await response.json();
        
        if (!data?.recenttracks?.track?.length) {
          throw new Error('Estructura de datos inválida');
        }
  
        const track = data.recenttracks.track[0];
        const isNowPlaying = track['@attr']?.nowplaying === "true";
  
        if (isNowPlaying || track.date) {
          const trackName = track.name;
          const artistName = track.artist['#text'];
          
          this.trackName.textContent = trackName;
          this.trackArtist.textContent = artistName;
          this.widgetContainer.classList.remove('inactive');
          
          this.simulateProgress();
          
          localStorage.setItem('lastPlayedTrack', JSON.stringify({
            name: trackName,
            artist: artistName,
            timestamp: new Date().getTime()
          }));
        } else {
          this.showLastPlayed();
        }
  
      } catch (error) {
        console.error('Error con Last.fm:', error);
        this.showLastPlayed();
      }
    }
  
    showLastPlayed() {
      const lastPlayed = localStorage.getItem('lastPlayedTrack');
      if (lastPlayed) {
        const track = JSON.parse(lastPlayed);
        this.trackName.textContent = track.name;
        this.trackArtist.textContent = track.artist;
        this.widgetContainer.classList.add('inactive');
      } else {
        this.trackName.textContent = 'No hay música reciente';
        this.trackArtist.textContent = 'Conectado a Last.fm';
        this.widgetContainer.classList.add('inactive');
      }
    }
  
    simulateProgress() {
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }

      const duration = 180;
      let current = 0;
      
      this.currentTime.textContent = this.formatTime(0);
      this.durationTime.textContent = this.formatTime(duration);
      this.progressFilled.style.width = '0%';
      
      this.progressInterval = setInterval(() => {
        current += 1;
        if (current > duration) {
          clearInterval(this.progressInterval);
          this.showLastPlayed();
          return;
        }
        
        this.currentTime.textContent = this.formatTime(current);
        this.progressFilled.style.width = `${(current / duration) * 100}%`;
      }, 1000);
    }
  
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
  
    startChecking() {
      this.checkSpotifyStatus();
      this.checkInterval = setInterval(() => this.checkSpotifyStatus(), 10000);
    }
  
    stopChecking() {
      clearInterval(this.checkInterval);
      clearInterval(this.progressInterval);
    }
  }