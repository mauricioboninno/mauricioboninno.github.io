// js/spotifyStatus.js
const clientId = '07fd50af50a34e5ab4f587afb4cd4962';
const redirectUri = 'https://boninno.com.ar';
const authEndpoint = 'https://accounts.spotify.com/authorize';
const scopes = ['user-read-currently-playing'];

const accessToken = new URLSearchParams(window.location.hash.substring(1)).get('access_token');

async function fetchCurrentlyPlaying() {
  if (!accessToken) return;

  try {
    const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.status === 204) return;

    const data = await res.json();

    const songName = data.item?.name || 'Unknown';
    const artistName = data.item?.artists?.map(a => a.name).join(', ') || 'Unknown Artist';
    const albumImage = data.item?.album?.images[0]?.url || '';

    document.getElementById('spotify-card').innerHTML = `
      <img src="${albumImage}" alt="Album Cover">
      <div class="track-info">
        <div class="track-name">${songName}</div>
        <div class="track-artist">${artistName}</div>
      </div>
    `;
  } catch (err) {
    console.error('Error fetching Spotify data:', err);
  }
}

if (accessToken) {
  fetchCurrentlyPlaying();
  setInterval(fetchCurrentlyPlaying, 10000); // refresh every 10 seconds
} else {
  const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=token&scope=${scopes.join('%20')}`;

  document.getElementById('spotify-card').innerHTML = `
    <a class="spotify-login" href="${authUrl}">
      <i class="fab fa-spotify"></i> Conectar Spotify
    </a>
  `;
}
