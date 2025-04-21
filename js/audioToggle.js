  const audio = document.getElementById("bg-audio");
  const muteBtn = document.getElementById("mute-toggle");
  const volumeSlider = document.getElementById("volume-slider");

  const savedVolume = localStorage.getItem("bg-volume");
  const initialVolume = savedVolume !== null ? parseFloat(savedVolume) : 0.3;
  audio.volume = initialVolume;
  volumeSlider.value = initialVolume;

  updateIcon();

  muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    updateIcon();
  });

  volumeSlider.addEventListener("input", () => {
    const newVolume = parseFloat(volumeSlider.value);
    audio.volume = newVolume;
    audio.muted = newVolume === 0;
    localStorage.setItem("bg-volume", newVolume.toString());
    updateIcon();
  });

  function updateIcon() {
    const icon = muteBtn.querySelector("i");
    if (audio.muted || audio.volume === 0) {
      icon.classList.remove("fa-volume-up");
      icon.classList.add("fa-volume-mute");
    } else {
      icon.classList.remove("fa-volume-mute");
      icon.classList.add("fa-volume-up");
    }
  }
