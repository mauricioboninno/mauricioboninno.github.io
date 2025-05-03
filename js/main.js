  import { Audio } from './audio.js';
  import { Quotes } from './quotes.js';
  import { Footer } from './footer.js';
  import { Discord } from './apps/discord.js';
  import { Spotify } from './apps/spotify.js';

  function initializeApp() {
    const modules = [
        { instance: new Audio(), method: 'startAudio' },
        { instance: new Quotes(), method: 'startCycling' },
        { instance: new Footer(), method: 'startCycling' },
        { instance: new Discord(), method: 'startTracking' },
        { instance: new Spotify(), method: 'startChecking' },
    ];

    modules.forEach(({ instance, method }) => {
        if(typeof instance[method] === 'function') {
            instance[method]();
        }
    });
  }

  initializeApp();

  document.getElementById('enter-button').addEventListener('click', () => {
    document.getElementById('blur-overlay').style.display = 'none';
  
    const audio = document.getElementById('bg-audio');
    audio.volume = 0.5;
    audio.play().catch(err => {
      console.error("No se pudo reproducir el audio automáticamente:", err);
    });
  });

