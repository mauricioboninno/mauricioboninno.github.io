  import { Quotes } from './quotes.js';
  import { Footer } from './footer.js';
  import { Discord } from './discord.js';
  import { Audio } from './audio.js';
  import { Spotify } from './spotify.js';

  function initializeApp() {
    const modules = [
        { instance: new Quotes(), method: 'startCycling' },
        { instance: new Footer(), method: 'startCycling' },
        { instance: new Discord(), method: 'startTracking' },
        { instance: new Audio(), method: 'startAudio' },
        { instance: new Spotify(), method: 'startChecking' },
    ];

    modules.forEach(({ instance, method }) => {
        if(typeof instance[method] === 'function') {
            instance[method]();
        }
    });
  }
  initializeApp();

