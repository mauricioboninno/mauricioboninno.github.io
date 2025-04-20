const statusText = document.getElementById('status-text');

const statusMap = {
  online: "I'm currently online",
  idle: "Idle",
  dnd: "Please, Do not disturb",
  offline: "I'm currently offline",
};

function fetchStatus(newText, newClass) {
  statusText.classList.remove("online", "idle", "dnd", "offline");
  statusText.classList.add(newClass);

  void statusText.offsetWidth;

  statusText.textContent = newText;
  statusText.classList.add("animate__animated", "animate__fadeIn");
}

async function updateDiscordStatus() {
  const userId = "1245158014969974930";
  const fetchFailText = "Failed to fetch status";

  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);    
    const { data } = await response.json();
    const status = data.discord_status;

    const newText = statusMap[status] || fetchFailText;
    const newClass = status.toLowerCase(); 

    if(statusText.textContent !== newText) {
      fetchStatus(newText, newClass);
    }

  } catch (error) {
    statusText.textContent = fetchFailText;
  }
}

updateDiscordStatus();
setInterval(updateDiscordStatus, 3000);