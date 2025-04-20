  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');

  const statusMap = {
    online: "I'm currently online",
    idle: "Idle",
    dnd: "Please, Do not disturb",
    offline: "I'm currently offline",
  };

  function fetchStatus(newText, status) {
    statusText.classList.remove("animate__fadeIn");

    void statusText.offsetWidth;

    statusText.textContent = newText;
    statusText.classList.add("animate__animated", "animate__fadeIn");

    statusDot.className = `dot ${status}`;
    statusDot.classList.remove("animate__pulse");
    
    void statusDot.offsetWidth;

    statusDot.classList.add("animate__animated", "animate__pulse");
  }

  async function updateDiscordStatus() {
    const userId = "1245158014969974930";
  
    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
      const { data } = await response.json();
      const status = data.discord_status;

      const newText = statusMap[status] || "Unknown status";

      statusDot.className = `dot ${status}`;

      if(statusText.textContent !== newText) {
        fetchStatus(newText, status);
      }

    } catch (error) {
      statusText.textContent = "Failed to fetch status";
    }
  }

  updateDiscordStatus();
  setInterval(updateDiscordStatus, 3000);