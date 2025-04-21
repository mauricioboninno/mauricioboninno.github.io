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

    #spotifyElement;
    #spotifyImageElement;
    #element;
    #userId;
    #intervalId = null;
    #currentStatus = null;

    constructor(
      userId = "1245158014969974930", 
      elementId = "status-text",
      spotifyElementId = "spotify-info",
      spotifyImageElementId = "spotify-image"
  ) {
      this.#userId = userId;
      this.#element = document.getElementById(elementId);
      this.#spotifyElement = document.getElementById(spotifyElementId);
      this.#spotifyImageElement = document.getElementById(spotifyImageElementId);
    
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

    #updateUI(data) {
      if (data.listening_to_spotify && data.spotify) {
        const song = data.spotify.song;
        const artist = data.spotify.artist;
        const albumArt = data.spotify.album_art_url;
        
        if (this.#spotifyElement) {
            this.#spotifyElement.textContent = `Listening to ${song} by ${artist}`;
            this.#spotifyElement.style.display = "block";
        }
        
        if (this.#spotifyImageElement) {
            this.#spotifyImageElement.src = albumArt;
            this.#spotifyImageElement.style.display = "block";
        }
        
        const status = data.discord_status?.toLowerCase() || "online";
        this.#element.classList.remove(...Discord.#ANIMATION_CLASSES.states);
        void this.#element.offsetWidth;
        this.#element.textContent = Discord.#STATUS_MAP[status] || Discord.#FETCH_FAIL_TEXT;
        this.#element.classList.add(status, ...Discord.#ANIMATION_CLASSES.base.split(" "));
        
        this.#currentStatus = "spotify";
      } else {
        if (this.#spotifyElement) this.#spotifyElement.style.display = "none";
            if (this.#spotifyImageElement) this.#spotifyImageElement.style.display = "none";
            
            // Update normal status
            const status = data.discord_status?.toLowerCase() || "offline";
            if (status !== this.#currentStatus) {
                this.#element.classList.remove(...Discord.#ANIMATION_CLASSES.states);
                void this.#element.offsetWidth;
                this.#element.textContent = Discord.#STATUS_MAP[status] || Discord.#FETCH_FAIL_TEXT;
                this.#element.classList.add(status, ...Discord.#ANIMATION_CLASSES.base.split(" "));
                this.#currentStatus = status;
      }
    }
      /*this.#element.classList.remove(...Discord.#ANIMATION_CLASSES.states);
    
      void this.#element.offsetWidth;
    
      this.#element.textContent = Discord.#STATUS_MAP[status] || Discord.#FETCH_FAIL_TEXT;
      this.#element.classList.add(status, ...Discord.#ANIMATION_CLASSES.base.split(" "));
    
      this.#currentStatus = status;*/
    }

    async #checkAndUpdate() {
      const data = await this.#fetchStatus();
      if(data) {
          this.#updateUI(data);
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
      this.#spotifyElement = null;
      this.#spotifyImageElement = null;
    }
  }