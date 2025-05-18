  import { Audio } from './component/audio.js';
  import { Quotes } from './component/quotes.js';
  import { Footer } from './component/footer.js';
  import { Discord } from './apps/discord.js';
  import { Spotify } from './apps/spotify.js';
  import { Github } from './apps/github.js';

  function initializeApp() {
    const modules = [
        { instance: new Audio(), method: 'startAudio' },
        { instance: new Quotes(), method: 'startCycling' },
        { instance: new Footer(), method: 'startCycling' },
        { instance: new Discord(), method: 'startTracking' },
        { instance: new Spotify(), method: 'startChecking' },
        { instance: new Github(), method: 'startFetching' }
    ];

    modules.forEach(({ instance, method }) => {
        if(typeof instance[method] === 'function') {
            instance[method]();
        }
    });
  }

  initializeApp();
