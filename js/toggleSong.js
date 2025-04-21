const muteToggle = document.getElementById('mute-toggle');
const audio = document.getElementById('bg-audio');
const volumeMenu = document.getElementById('volume-menu');
const volumeSlider = document.getElementById('volume-slider');

let isPlaying = false;

volumeMenu.classList.add('hidden');

audio.volume = 0.5;
volumeSlider.value = audio.volume;

muteToggle.addEventListener('click', function (e) {
  e.stopPropagation();
  if (!isPlaying) {
    audio.currentTime = 126;
    audio.play().then(() => {
      isPlaying = true;
      audio.muted = false;
      updateButtonIcon();
      toggleVolumeMenu();
    }).catch(e => console.log("Error al reproducir audio:", e));
  } else {
    audio.muted = !audio.muted;
    updateButtonIcon();
    toggleVolumeMenu();
  }
});

volumeSlider.addEventListener('input', function () {
  audio.volume = parseFloat(this.value);
  audio.muted = false;
  updateButtonIcon();
  console.log("Volume changed to:", audio.volume);
});

function updateButtonIcon() {
  const icon = muteToggle.querySelector('i');
  icon.classList.toggle('fa-volume-mute', audio.muted || !isPlaying);
  icon.classList.toggle('fa-volume-up', !audio.muted && isPlaying);
}

function toggleVolumeMenu() {
  volumeMenu.classList.toggle('hidden');
}

document.addEventListener('click', (e) => {
  if (!volumeMenu.contains(e.target) && e.target !== muteToggle) {
    volumeMenu.classList.add('hidden');
  }
});

updateButtonIcon();

audio.addEventListener('ended', function () {
  audio.currentTime = 127;
  audio.play();
});