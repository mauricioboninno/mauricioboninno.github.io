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

    #elements = {
        statusText: null,
    };

    #userId;
    #intervalId = null;
    #currentStatus = null;

    constructor(
        userId = "1245158014969974930",
        statusTextId = "status-text",
    ) {
        this.#userId = userId;
        this.#elements = {
            statusText: document.getElementById(statusTextId),
        };

        if(!this.#elements.statusText) {
            throw new Error(`Element with ID '${statusTextId}' not found`);
        }
    }

    async #fetchData() {
        try {
            const response = await fetch(`${Discord.#API_ENDPOINT}/${this.#userId}`);
            if(!response.ok) throw new Error("API request failed");
            
            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    #updateUI(data) {
        if(!data) {
            this.#elements.statusText.textContent = Discord.#FETCH_FAIL_TEXT;
            return;
        }

        this.#updateStatus(data.discord_status || 'offline');
    }

    #updateStatus(status) {
        status = status.toLowerCase();
        const { statusText } = this.#elements;

        if(status === this.#currentStatus) return;

        statusText.classList.remove(...Discord.#ANIMATION_CLASSES.states);
        void statusText.offsetWidth;

        statusText.textContent = Discord.#STATUS_MAP[status] || Discord.#FETCH_FAIL_TEXT;
        statusText.classList.add(status, ...Discord.#ANIMATION_CLASSES.base.split(' '));

        this.#currentStatus = status;
    }

    async #checkAndUpdate() {
        const data = await this.#fetchData();
        this.#updateUI(data);
    }

    startTracking() {
        if(this.#intervalId) return;
        
        this.#checkAndUpdate();
        this.#intervalId = setInterval(() => this.#checkAndUpdate(), Discord.#UPDATE_INTERVAL);
    }

    stopTracking() {
        if(!this.#intervalId) return;

        clearInterval(this.#intervalId);
        this.#intervalId = null;
    }

    destroy() {
        this.stopTracking();
        this.#elements = {
            statusText: null,
        };
    }
}