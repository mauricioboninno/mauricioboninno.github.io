const userId = "1245158014969974930";

fetch(`https://api.lanyard.rest/v1/users/${userId}`)
  .then(res => res.json())
  .then(data => {
    const status = data.data.discord_status;
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');

    dot.className = 'dot ' + status;

    const statusMap = {
      online: "Online",
      idle: "Idle",
      dnd: "Do not Disturb",
      offline: "Offline"
    };

    text.textContent = statusMap[status] || "Failed to fetch status";
  })
  .catch(() => {
    document.getElementById('status-text').textContent = "Error";
  });