document.addEventListener('DOMContentLoaded', () => {
  const muteButton = document.getElementById('mute-toggle');
  const audio = document.getElementById('bg-audio');
  const icon = muteButton.querySelector('i');

  const initializeAudio = () => {
    audio.currentTime = 0;
    audio.volume = 0;
    updateIcon(false);
  };

  const updateIcon = (isUnmuted) => {
    icon.classList.toggle('fa-volume-up', isUnmuted);
    icon.classList.toggle('fa-volume-mute', !isUnmuted);
  };

  muteButton.addEventListener('click', () => {
    const isMuted = audio.volume === 0;
    audio.volume = isMuted ? 1 : 0;
    if (isMuted) audio.play();

    updateIcon(!isMuted);
  });

  initializeAudio();
});