const muteToggle = document.getElementById('mute-toggle');
const audio = document.getElementById('bg-audio');
let isPlaying = false;

muteToggle.addEventListener('click', function() {
  if (!isPlaying) {
    audio.play()
      .then(() => {
        isPlaying = true;
        audio.muted = false;
        updateButtonIcon();
      })
      .catch(e => console.log("Error al reproducir audio:", e));
  } else {
    audio.muted = !audio.muted;
    updateButtonIcon();
  }
});

function updateButtonIcon() {
  const icon = muteToggle.querySelector('i');
  icon.classList.toggle('fa-volume-mute', audio.muted || !isPlaying);
  icon.classList.toggle('fa-volume-up', !audio.muted && isPlaying);
}

updateButtonIcon();