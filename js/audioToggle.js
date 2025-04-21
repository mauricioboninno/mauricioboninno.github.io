  const muteButton = document.getElementById('mute-toggle');
  const audio = document.getElementById('bg-audio');
  const icon = muteButton.querySelector('i');
  const volumeSliderContainer = document.getElementById('volume-slider-container');
  const volumeSlider = document.getElementById('volume-slider');

  const initializeAudio = () => {
    const savedTime = localStorage.getItem('audioCurrentTime');
    
    if(savedTime) audio.currentTime = parseFloat(savedTime);
  
    audio.volume = 0;
    updateIcon(false);
    volumeSlider.value = 0;
  }

  const updateIcon = (isUnmuted) => {
    icon.classList.toggle('fa-volume-up', isUnmuted);
    icon.classList.toggle('fa-volume-mute', !isUnmuted);
  };

  const toggleVolumeMenu = (show) => {
    volumeSliderContainer.style.display = show ? 'block' : 'none';
  };

  const saveAudioState = () => {
    localStorage.setItem('audioVolume', audio.volume);
    localStorage.setItem('audioCurrentTime', audio.currentTime);
  };

  muteButton.addEventListener('click', () => {
    const isMuted = audio.volume === 0;
    audio.volume = isMuted ? 1 : 0;
    if(isMuted) audio.play();
  
    updateIcon(!isMuted);
    toggleVolumeMenu(isMuted);
  
    saveAudioState();
  });

  volumeSlider.addEventListener('input', (event) => {
    audio.volume = parseFloat(event.target.value);
    updateIcon(audio.volume > 0);
  
    saveAudioState();
  });

  audio.addEventListener('timeupdate', saveAudioState);
  initializeAudio();