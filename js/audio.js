  export class AudioPlayer {
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
      defaultVolume: 0.5
    };
  
    constructor() {
      this.#init();
    }
  
    async #init() {
      const { audio, volumeMenu, volumeSlider } = this.#elements;
      const { defaultVolume } = this.#state;
  
      volumeMenu.classList.add('hidden');
      audio.volume = defaultVolume;
      volumeSlider.value = defaultVolume;
  
      this.#setupEventListeners();
      this.#updateButtonIcon();
    }
  
    #setupEventListeners() {
      const { muteToggle, audio, volumeSlider } = this.#elements;
  
      muteToggle.addEventListener('click', (e) => this.#handleMuteToggle(e));
      volumeSlider.addEventListener('input', () => this.#handleVolumeChange());
      document.addEventListener('click', (e) => this.#handleDocumentClick(e));
      audio.addEventListener('timeupdate', () => this.#handleAudioLoop());
    }
  
    async #handleMuteToggle(e) {
      e.stopPropagation();
      const { audio } = this.#elements;
      const { isPlaying, initialTime } = this.#state;
  
      if(!isPlaying) {
        audio.currentTime = initialTime;
        try {
          await audio.play();
          this.#state.isPlaying = true;
          audio.muted = false;
          this.#updateButtonIcon();
          this.#toggleVolumeMenu();
        } catch (error) {
          console.error(error);
        }
      } else {
        audio.muted = !audio.muted;
        this.#updateButtonIcon();
        this.#toggleVolumeMenu();
      }
    }
  
    #handleVolumeChange() {
      const { audio, volumeSlider } = this.#elements;
      audio.volume = parseFloat(volumeSlider.value);
      audio.muted = false;
      this.#updateButtonIcon();
    }
  
    #handleDocumentClick(e) {
      const { volumeMenu, muteToggle } = this.#elements;
      if(!volumeMenu.contains(e.target) && e.target !== muteToggle) {
        volumeMenu.classList.add('hidden');
      }
    }
  
    async #handleAudioLoop() {
      const { audio } = this.#elements;
      const { loopEnd, loopStart } = this.#state;
  
      if(audio.currentTime >= loopEnd) {
        audio.currentTime = loopStart;
        try {
          await audio.play();
        } catch (error) {
          console.log(error);
        }
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
      const { audio } = this.#elements;
      const { initialTime } = this.#state;

      audio.currentTime = initialTime;
      await audio.play();
      this.#state.isPlaying = true;
      this.#updateButtonIcon();
  
      /*try {
        audio.currentTime = initialTime;
        await audio.play();
        this.#state.isPlaying = true;
        this.#updateButtonIcon();
      } catch (error) {
        console.log(error);
      }*/
    }
  }