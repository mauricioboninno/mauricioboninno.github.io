  export class Discord {
    static #STATUS_MAP = {
      online: "I'm currently online",
      idle: "Idle",
      dnd: "Please, do not disturb",
      offline: "I'm currently offline"
    };
    
    static #ANIMATION_CLASSES = {
      base: "animate__animated animate__fadeIn",
      states: ["online", "idle", "dnd", "offline"]
    };

    static #API_ENDPOINT = "https://api.lanyard.rest/v1/users";
    static #UPDATE_INTERVAL = 3000;
    static #FETCH_FAIL_TEXT = "Failed to fetch status";

    #element;
    #userId;
    #intervalId = null;
    #currentStatus = null;

    constructor(userId = "1245158014969974930", elementId = "status-text") {
      this.#userId = userId;
      this.#element = document.getElementById(elementId);
    
      if(!this.#element) {
        throw new Error(`Element with ID '${elementId}' not found`);
      }
    }

    async #fetchStatus() {
      try {
        const response = await fetch(`${Discord.#API_ENDPOINT}/${this.#userId}`);
      
        if(!response.ok) throw new Error("API request failed");
      
        const { data } = await response.json();
        return data.discord_status?.toLowerCase() || null;
      } catch (error) {
        console.log(error);
        return null;
      }
    }

    #updateUI(status) {
      this.#element.classList.remove(...Discord.#ANIMATION_CLASSES.states);
    
      void this.#element.offsetWidth;
    
      this.#element.textContent = Discord.#STATUS_MAP[status] || Discord.#FETCH_FAIL_TEXT;
      this.#element.classList.add(status, ...Discord.#ANIMATION_CLASSES.base.split(" "));
    
      this.#currentStatus = status;
    }

    async #checkAndUpdate() {
      const newStatus = await this.#fetchStatus();
    
      if(newStatus && newStatus !== this.#currentStatus) {
        this.#updateUI(newStatus);
      }
    }

    startTracking() {
      if(this.#intervalId) return;
    
      this.#checkAndUpdate();
    
      this.#intervalId = setInterval(() => this.#checkAndUpdate(), Discord.#UPDATE_INTERVAL);
    }

    stopTracking() {
      if(this.#intervalId) {
        clearInterval(this.#intervalId);
        this.#intervalId = null;
      }
    }

    destroy() {
      this.stopTracking();
      this.#element = null;
    }
  }