  const muteButton = document.getElementById('mute-toggle');
  const audio = document.getElementById('bg-audio');
  const icon = muteButton.querySelector('i');

  audio.volume = 0;
  icon.classList.remove('fa-volume-up');
  icon.classList.add('fa-volume-mute');

  muteButton.addEventListener('click', () => {
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
