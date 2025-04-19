  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');

  const statusMap = {
    online: "I'm currently online",
    idle: "Idle",
    dnd: "Please, Do not disturb",
    offline: "I'm currently offline",
  };

  async function updateDiscordStatus() {
    const userId = "1245158014969974930";
  
    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
      const { data } = await response.json();
      const status = data.discord_status;
  
      statusDot.className = `dot ${status}`;
      statusText.textContent = statusMap[status] || "Unknown status";
    } catch (error) {
      statusText.textContent = "Failed to fetch status";
    }
  }

  updateDiscordStatus();
  setInterval(updateDiscordStatus, 1000);