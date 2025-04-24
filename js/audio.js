  export class Audio {
    #elements = {
      muteToggle: document.getElementById('mute-toggle'),
      audio: document.getElementById('bg-audio'),
      volumeMenu: document.getElementById('volume-menu'),
      volumeSlider: document.getElementById('volume-slider')
    };
  
    #state = {
      isPlaying: false,
      initialTime: 126,
      loopStart: 127,
      loopEnd: 194,
      defaultVolume: 0.5,
      wasEverPlayed: false
    };
  
    constructor() {
      this.#init();
    }

    #updateState(newState) {
      this.#state = { ...this.#state, ...newState };
    }  
  
    async #init() {
      const { audio, volumeMenu, volumeSlider } = this.#elements;
      const { defaultVolume } = this.#state;
  
      volumeMenu.classList.add('hidden');
      audio.volume = defaultVolume;
      volumeSlider.value = defaultVolume;
  
      this.#setupEventListeners();
      this.#updateButtonIcon();

      audio.load()
    }
  
    #setupEventListeners() {
      const { muteToggle, audio, volumeSlider } = this.#elements;
  
      muteToggle.addEventListener('click', this.#handleMuteToggle.bind(this));
      volumeSlider.addEventListener('input',  this.#handleVolumeChange.bind(this));
      document.addEventListener('click', this.#handleDocumentClick.bind(this));

      audio.addEventListener('timeupdate', () => requestAnimationFrame(() => this.#handleAudioLoop()));
    }
  
    async #handleMuteToggle(e) {
      e.stopPropagation();

      const { audio, muteToggle } = this.#elements;
      const { initialTime } = this.#state;

      muteToggle.disabled = true;
  
      try {
        if(audio.paused || audio.ended) {
          audio.currentTime = initialTime;
          await audio.play();
          this.#updateState({ isPlaying: true });
          audio.muted = false;
        } else {
          audio.muted = !audio.muted;
        }
  
        this.#updateButtonIcon();
        this.#toggleVolumeMenu();
      } catch (error) {
        console.error('Failed to load the audio => ', error);
      } finally {
        muteToggle.disabled = false;
      }
    }
  
    #handleVolumeChange() {
      const { audio, volumeSlider } = this.#elements;
      audio.volume = parseFloat(volumeSlider.value);
      audio.muted = false;
      this.#updateButtonIcon();
    }
  
    #handleDocumentClick(event) {
      const { volumeMenu, muteToggle } = this.#elements;

      const shouldHideVolumeMenu = (
        volumeMenu && 
        muteToggle &&
        !volumeMenu.contains(event.target) && 
        event.target !== muteToggle
      );

      if(shouldHideVolumeMenu) {
        volumeMenu.classList.add('hidden');
      }
    }
  
    async #handleAudioLoop() {
      const { audio } = this.#elements;
      const { loopEnd, loopStart } = this.#state;

      if(audio.currentTime < loopEnd) return;

      audio.currentTime = loopStart;

      try {
        await audio.play();
        this.#updateState({ isPlaying: true });
      } catch (error) {
        console.error('Audio loop playback failed => ', error.message);
        this.#updateState({ isPlaying: false });
      }
    }
  
    #updateButtonIcon() {
      const { muteToggle, audio } = this.#elements;
      const { isPlaying } = this.#state;
      const icon = muteToggle.querySelector('i');
  
      icon.classList.toggle('fa-volume-mute', audio.muted || !isPlaying);
      icon.classList.toggle('fa-volume-up', !audio.muted && isPlaying);
    }
  
    #toggleVolumeMenu() {
      this.#elements.volumeMenu.classList.toggle('hidden');
    }
  
    async startAudio() {
      if(this.#state.wasEverPlayed) return;

      const { audio } = this.#elements;

      try {
        audio.currentTime = this.#state.initialTime;
        await audio.play();
        this.#updateState({ isPlaying: true, wasEverPlayed: true });
      } catch (error) {
        console.error('Audio playback failed => ', error.message);
        this.#updateState({ isPlaying: false });
      } finally {
        this.#updateButtonIcon();
      }
    }
  }