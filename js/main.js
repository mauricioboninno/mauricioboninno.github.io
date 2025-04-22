  import { Quotes } from './quotes.js';
  import { Footer } from './footer.js';
  import { Discord } from './app/discord.js';
  import { Spotify } from './app/spotify.js';
  import { Audio } from './audio.js';

  function initializeApp() {
    const modules = [
        { instance: new Quotes(), method: 'startCycling' },
        { instance: new Footer(), method: 'startCycling' },
        { instance: new Discord(), method: 'startTracking' },
        { instance: new Spotify(), method: 'startChecking' },
        { instance: new Audio(), method: 'startAudio' },
    ];

    modules.forEach(({ instance, method }) => {
        if(typeof instance[method] === 'function') {
            instance[method]();
        }
    });
  }
  initializeApp();

