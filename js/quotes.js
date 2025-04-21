export class Quotes {
  static #DEFAULT_CONFIG = {
    selector: '#text',
    quotes: [
      "How far would you go to fulfill your dream?",
      "How much does it mean to you?",
      "How far would you go for what you desire?"
    ],
    finalMessage: "Good luck!",
    typingOptions: {
      typeSpeed: 75,
      startDelay: 1500,
      backSpeed: 75,
      smartBackspace: true,
      shuffle: false,
      backDelay: 1500,
      showCursor: true,
      cursorChar: '|'
    }
  };

  #typedInstance = null;

  constructor(config = {}) {
    this.config = { ...Quotes.#DEFAULT_CONFIG, ...config };
    this.#init();
  }

  #init() {
    try {
      const allStrings = [...this.config.quotes, this.config.finalMessage];
      this.#typedInstance = new Typed(this.config.selector, {
        strings: allStrings,
        ...this.config.typingOptions
      });
    } catch (error) {
      console.error('Error initializing Typed.js:', error);
    }
  }

  destroy() {
    if (this.#typedInstance) {
      this.#typedInstance.destroy();
      this.#typedInstance = null;
    }
  }

  updateQuotes(newQuotes) {
    if (this.#typedInstance) {
      this.destroy();
      this.config.quotes = newQuotes;
      this.#init();
    }
  }
}