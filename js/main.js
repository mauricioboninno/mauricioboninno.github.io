  import { Quotes } from './quotes.js';
  import { Footer } from './footer.js';
  import { Discord } from './discord.js';
  import { AudioPlayer } from './audio.js';
  import { Overlay } from './overlay.js';

  const quotes = new Quotes();
  quotes.startCycling

  const footer = new Footer();
  footer.startCycling();

  const discord = new Discord();
  discord.startTracking()

  const audio = new AudioPlayer();
  const overlay = new Overlay();

  overlay.initialize(() => audio.startAudio());

