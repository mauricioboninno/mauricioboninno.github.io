  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  const profileImage = document.getElementById('profile-image');
  const username = document.getElementById('profile-username');
  const activity = document.getElementById('profile-activity');

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

      profileImage.src = data.discord_user.avatar_url ? `https://cdn.discordapp.com/avatars/${userId}/${data.discord_user.avatar}.png` : "";
      username.textContent = data.discord_user.username;
      activity.textContent = data.listening_to_music ? `Listening to ${data.listening_to_music.name}` : "No activity";
    } catch (error) {
      statusText.textContent = "Failed to fetch status";
    }
  }

  updateDiscordStatus();
  setInterval(updateDiscordStatus, 1000);