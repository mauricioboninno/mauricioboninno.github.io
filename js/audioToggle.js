const audioToggleModule = (function() {
  let audioElement;
  let muteButton;
  let iconElement;
  
  let isMuted = false;
  
  function handle(audioId, buttonId) {
      audioElement = document.getElementById(audioId);
      muteButton = document.getElementById(buttonId);
      iconElement = muteButton.querySelector('i');
      
      if (!audioElement || !muteButton || !iconElement) {
          console.error('Elementos no encontrados');
          return;
      }
      
      muteButton.addEventListener('click', toggleMute);
      
      updateUI();
  }
  
  function toggleMute() {
      isMuted = !isMuted;
      
      if (isMuted) {
          audioElement.pause();
      } else {
          audioElement.play().catch(e => console.log('Autoplay prevenido:', e));
      }
      
      updateUI();
  }
  
  function updateUI() {
      if (isMuted) {
          iconElement.classList.remove('fa-volume-up');
          iconElement.classList.add('fa-volume-mute');
      } else {
          iconElement.classList.remove('fa-volume-mute');
          iconElement.classList.add('fa-volume-up');
      }
  }
  
  return {
      init: init,
      toggleMute: toggleMute
  };
})();

document.addEventListener('DOMContentLoaded', function() {
  audioToggleModule.handle('bg-audio', 'mute-toggle');
});