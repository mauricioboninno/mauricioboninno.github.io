  const muteButton = document.getElementById('mute-toggle');
  const audio = document.getElementById('bg-audio');
  const icon = muteButton.querySelector('i');
  const volumeSliderContainer = document.getElementById('volume-slider-container');
  const volumeSlider = document.getElementById('volume-slider');

  audio.volume = 0;
  icon.classList.remove('fa-volume-up');
  icon.classList.add('fa-volume-mute');

  muteButton.addEventListener('click', () => {
    if (volumeSliderContainer.style.display === 'none' || volumeSliderContainer.style.display === '') {
      volumeSliderContainer.style.display = 'block';
    } else {
      volumeSliderContainer.style.display = 'none';
    }

    if (audio.volume === 0) {
      audio.volume = 1;
      audio.play();
      icon.classList.remove('fa-volume-mute');
      icon.classList.add('fa-volume-up');
    } else {
      audio.volume = 0;
      icon.classList.remove('fa-volume-up');
      icon.classList.add('fa-volume-mute');
    }
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
  });