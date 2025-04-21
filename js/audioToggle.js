const muteButton = document.getElementById('mute-toggle');
const audio = document.getElementById('bg-audio');
const icon = muteButton.querySelector('i');
const volumeSliderContainer = document.getElementById('volume-slider-container');
const volumeSlider = document.getElementById('volume-slider');

const savedTime = localStorage.getItem('audioCurrentTime');
if (savedTime !== null) {
  audio.currentTime = parseFloat(savedTime);
}

audio.volume = 0;
icon.classList.remove('fa-volume-up');
icon.classList.add('fa-volume-mute');

let closeVolumeMenuTimeout;
const closeVolumeMenu = () => {
  volumeSliderContainer.style.display = 'none';
};

muteButton.addEventListener('click', () => {
  if (audio.volume === 0) {
    audio.volume = 1;
    audio.play();
    icon.classList.remove('fa-volume-mute');
    icon.classList.add('fa-volume-up');

    volumeSliderContainer.style.display = 'block';

    clearTimeout(closeVolumeMenuTimeout);
    closeVolumeMenuTimeout = setTimeout(closeVolumeMenu, 3000);
  } else {
    audio.volume = 0;
    icon.classList.remove('fa-volume-up');
    icon.classList.add('fa-volume-mute');

    closeVolumeMenu();
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

  clearTimeout(closeVolumeMenuTimeout);
  closeVolumeMenuTimeout = setTimeout(closeVolumeMenu, 3000);

  localStorage.setItem('audioVolume', audio.volume);
});

audio.addEventListener('timeupdate', () => {
  localStorage.setItem('audioCurrentTime', audio.currentTime);
});