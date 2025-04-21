  export class Overlay {
    constructor() {
      this.overlay = document.getElementById('overlay');
      this.confirmationButton = document.getElementById('confirmation-button');
      this.confirmationText = document.getElementById('confirmation-text');
      this.onCloseCallback = null;
      this.typed = null;
    }
  
    initialize(callback) {
      this.onCloseCallback = callback;
      
      this.confirmationButton.disabled = true;
      this.confirmationButton.style.pointerEvents = 'none';
      
      this.typed = new Typed(this.confirmationText, {
        strings: ['Are you sure?'],
        typeSpeed: 50,
        showCursor: false,
        onComplete: () => {
          this.confirmationButton.disabled = false;
          this.confirmationButton.style.pointerEvents = 'auto';
          
          this.confirmationButton.addEventListener('click', () => {
            this.hideOverlay();
            if(this.onCloseCallback) this.onCloseCallback();
          });
        }
      });
    }
  
    hideOverlay() {
      if(this.typed) {
        this.typed.destroy();
      }
      
      this.overlay.style.opacity = '0';
      setTimeout(() => {
        this.overlay.style.display = 'none';
      }, 300);
    }
  }