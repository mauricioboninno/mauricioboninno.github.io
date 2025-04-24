  export class Footer {
    static #INTERVALS = {
      ANIMATION_DURATION: 500,
      CYCLE_INTERVAL: 15000
    };
  
    #element;
    #showDefaultText = true;
    #intervalId = null;

    constructor(elementId = "footer-text") {
      this.#element = document.getElementById(elementId);

      if(!this.#element) {
        throw new Error(`Element with ID '${elementId}' not found`);
      }
    }

    #getFormattedDate() {
      const now = new Date();
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      }).format(now);
    }

    #toggleContent() {
      this.#element.classList.replace("animate__fadeIn", "animate__fadeOut");

      const defaultText = `Developed by <a href="mailto:mauricio@boninno.com.ar">@mauricio</a>`;
    
      setTimeout(() => {
        this.#element.innerHTML = this.#showDefaultText ? defaultText : this.#getFormattedDate();
      
        this.#element.classList.replace("animate__fadeOut", "animate__fadeIn");
        this.#showDefaultText = !this.#showDefaultText;
      }, Footer.#INTERVALS.ANIMATION_DURATION);
    }

    startCycling() {
      if(this.#intervalId) return;
    
      this.#toggleContent();
      this.#intervalId = setInterval(() => this.#toggleContent(), Footer.#INTERVALS.CYCLE_INTERVAL);
    }

    stopCycling() {
      if(this.#intervalId) {
        clearInterval(this.#intervalId);
        this.#intervalId = null;
      }
    }

    destroy() {
      this.stopCycling();
      this.#element = null;
    }
  }