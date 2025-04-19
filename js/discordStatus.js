const userId = "1245158014969974930";

fetch(`https://api.lanyard.rest/v1/users/${userId}`)
  .then(res => res.json())
  .then(data => {
    const status = data.data.discord_status;
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');

    dot.className = 'dot ' + status;

    const statusMap = {
      online: "En línea",
      idle: "Ausente",
      dnd: "No molestar",
      offline: "Desconectado"
    };

    text.textContent = statusMap[status] || "Desconocido";
  })
  .catch(() => {
    document.getElementById('status-text').textContent = "Error";
  });