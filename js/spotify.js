 export class Spotify {
    constructor() {
      this.lastfmApiKey = 'c068cf877f2cb307c1b0dca2a056f10e'; // Reemplaza con tu API Key
      this.lastfmUser = 'MauricioBonino';   // Tu usuario de Last.fm
      this.widgetContainer = null;
      this.lastPlayed = localStorage.getItem('lastPlayedTrack') || null;
      this.createWidget();
      this.startChecking();
    }
  
    createWidget() {
      this.widgetContainer = document.createElement('div');
      this.widgetContainer.className = 'spotify-widget animate__animated animate__fadeIn';
      // ... (estilos igual que antes)
  
      const spotifyIcon = document.createElement('i');
      spotifyIcon.className = 'fab fa-spotify';
      spotifyIcon.style.color = '#1DB954';
  
      this.trackInfo = document.createElement('span');
      this.trackInfo.textContent = this.lastPlayed ? `Última: ${this.lastPlayed}` : 'Conectando...';
  
      this.widgetContainer.appendChild(spotifyIcon);
      this.widgetContainer.appendChild(this.trackInfo);
  
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
        
        // Verificación exhaustiva de datos
        if (!data?.recenttracks?.track?.length) {
          throw new Error('Estructura de datos inválida');
        }
  
        const track = data.recenttracks.track[0];
        const isNowPlaying = track['@attr']?.nowplaying === "true";
  
        if (isNowPlaying || track.date) { // Si está sonando o es histórica
          const trackName = `${track.name} - ${track.artist['#text']}`;
          
          if (isNowPlaying) {
            this.trackInfo.textContent = trackName;
            this.lastPlayed = trackName;
            localStorage.setItem('lastPlayedTrack', trackName);
          } else if (this.lastPlayed) {
            this.trackInfo.textContent = `Última: ${this.lastPlayed}`;
          }
        } else {
          throw new Error('No hay datos de reproducción');
        }
  
      } catch (error) {
        console.error('Error con Last.fm:', error);
        
        // Manejo elegante de errores
        if (this.lastPlayed) {
          this.trackInfo.textContent = `Última: ${this.lastPlayed}`;
        } else {
          this.trackInfo.textContent = 'No hay datos recientes';
          this.widgetContainer.style.opacity = '0.7'; // Feedback visual
        }
        
        // Reintentar después de 30 segundos si hay error
        this.stopChecking();
        setTimeout(() => this.startChecking(), 30000);
      }
    }
  
    startChecking() {
      this.checkSpotifyStatus();
      this.checkInterval = setInterval(() => this.checkSpotifyStatus(), 10000);
    }
  
    stopChecking() {
      clearInterval(this.checkInterval);
    }
  }