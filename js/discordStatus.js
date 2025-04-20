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

  function timeSince(date) {
    const seconds = Math.floor((Date.now() - date) / 1000);
    const intervals = [
      { label: 'year', secs: 31536000 },
      { label: 'month', secs: 2592000 },
      { label: 'day', secs: 86400 },
      { label: 'hour', secs: 3600 },
      { label: 'minute', secs: 60 },
      { label: 'second', secs: 1 }
    ];
  
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.secs);
      if (count > 0) {
        return `Offline ago ${count} ${interval.label}${count !== 1 ? 's' : ''}`;
      }
    }
    return "Just went offline";
  }

  async function updateDiscordStatus() {
    const userId = "1245158014969974930";
  
    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
      const { data } = await response.json();
      const status = data.discord_status;

      let newText = statusMap[status] || "Unknown status";

      if (status === "offline" && data.last_online) {
        const timeText = timeSince(new Date(data.last_online));
        newText = `${statusMap[status]}, ${timeText}`;
      }

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