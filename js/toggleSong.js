  const audioControls = {
    elements: {
      muteToggle: document.getElementById('mute-toggle'),
      audio: document.getElementById('bg-audio'),
      volumeMenu: document.getElementById('volume-menu'),
      volumeSlider: document.getElementById('volume-slider')
    },
    state: {
      isPlaying: false,
      initialTime: 126,
      loopStart: 127,
      loopEnd: 194,
      defaultVolume: 0.5
    },

    init() {
      const { audio, volumeMenu, volumeSlider } = this.elements;
      const { defaultVolume } = this.state;

      volumeMenu.classList.add('hidden');
      audio.volume = defaultVolume;
      volumeSlider.value = defaultVolume;

      this.setupEventListeners();
      this.updateButtonIcon();
    },

    setupEventListeners() {
      const { muteToggle, audio, volumeSlider, volumeMenu } = this.elements;

      muteToggle.addEventListener('click', (e) => this.handleMuteToggle(e));
      volumeSlider.addEventListener('input', () => this.handleVolumeChange());
      document.addEventListener('click', (e) => this.handleDocumentClick(e));
      audio.addEventListener('timeupdate', () => this.handleAudioLoop());
    },

    handleMuteToggle(e) {
      e.stopPropagation();
      const { audio } = this.elements;
      const { isPlaying, initialTime } = this.state;

      if (!isPlaying) {
        audio.currentTime = initialTime;
        audio.play()
          .then(() => {
            this.state.isPlaying = true;
            audio.muted = false;
            this.updateButtonIcon();
            this.toggleVolumeMenu();
          })
          .catch(console.error);
      } else {
        audio.muted = !audio.muted;
        this.updateButtonIcon();
        this.toggleVolumeMenu();
      }
    },

  handleVolumeChange() {
    const { audio, volumeSlider } = this.elements;
    audio.volume = parseFloat(volumeSlider.value);
    audio.muted = false;
    this.updateButtonIcon();
  },

  handleDocumentClick(e) {
    const { volumeMenu, muteToggle } = this.elements;
    if (!volumeMenu.contains(e.target) && e.target !== muteToggle) {
      volumeMenu.classList.add('hidden');
    }
  },

  handleAudioLoop() {
    const { audio } = this.elements;
    const { loopEnd, loopStart } = this.state;
    
    if (audio.currentTime >= loopEnd) {
      audio.currentTime = loopStart;
      audio.play().catch(console.error);
    }
  },

    updateButtonIcon() {
      const { muteToggle, audio } = this.elements;
      const { isPlaying } = this.state;
      const icon = muteToggle.querySelector('i');
    
      icon.classList.toggle('fa-volume-mute', audio.muted || !isPlaying);
      icon.classList.toggle('fa-volume-up', !audio.muted && isPlaying);
    },

    toggleVolumeMenu() {
      this.elements.volumeMenu.classList.toggle('hidden');
    }
  };

  audioControls.init();