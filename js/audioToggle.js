  const muteButton = document.getElementById('mute-toggle');
  const audio = document.getElementById('bg-audio');
  const icon = muteButton.querySelector('i');
  const volumeSliderContainer = document.getElementById('volume-slider-container');
  const volumeSlider = document.getElementById('volume-slider');

  const savedVolume = localStorage.getItem('audioVolume');
  if (savedVolume !== null) {
    audio.volume = parseFloat(savedVolume);
    volumeSlider.value = savedVolume;
    if (audio.volume > 0) {
     icon.classList.remove('fa-volume-mute');
      icon.classList.add('fa-volume-up');
    }
  } else {
    audio.volume = 0;
    volumeSlider.value = 0;
    icon.classList.remove('fa-volume-up');
    icon.classList.add('fa-volume-mute');
}

  const savedTime = localStorage.getItem('audioCurrentTime');
  if (savedTime !== null) {
    audio.currentTime = parseFloat(savedTime);
  }

  let sliderVisible = false;

  muteButton.addEventListener('click', () => {
    sliderVisible = !sliderVisible;
    volumeSliderContainer.style.display = sliderVisible ? 'block' : 'none';

    if (audio.volume === 0) {
      audio.volume = 1;
      audio.play();
      icon.classList.remove('fa-volume-mute');
      icon.classList.add('fa-volume-up');
      volumeSlider.value = 1;
    } else {
      audio.volume = 0;
      icon.classList.remove('fa-volume-up');
      icon.classList.add('fa-volume-mute');
      volumeSlider.value = 0;
    }

    localStorage.setItem('audioVolume', audio.volume);
  });

  volumeSlider.addEventListener('input', (event) => {
    audio.volume = event.target.value;

    if (audio.volume > 0) {
      icon.classList.remove('fa-volume-mute');
      icon.classList.add('fa-volume-up');
    } else {
      icon.classList.remove('fa-volume-up');
      icon.classList.add('fa-volume-mute');
    }

    localStorage.setItem('audioVolume', audio.volume);
  });

  audio.addEventListener('timeupdate', () => {
    localStorage.setItem('audioCurrentTime', audio.currentTime);
  });
