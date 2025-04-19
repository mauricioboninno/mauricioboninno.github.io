const clientId = "aa855a0e6c5b40eb93019801d444f9e9";
const redirectUri = "https://boninno.com.ar";
const scopes = "user-read-currently-playing";

const container = document.getElementById("spotify-now-playing");
const songTitle = document.getElementById("song-title");

function getAccessToken() {
  const hash = window.location.hash;
  if (hash) {
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get("access_token");

    if (token) {
      localStorage.setItem("spotify_access_token", token);
      window.history.replaceState({}, document.title, window.location.pathname);
      return token;
    }
  }

  const savedToken = localStorage.getItem("spotify_access_token");
  if (savedToken) return savedToken;

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scopes)}`;
  window.location.href = authUrl;
  return null;
}

const accessToken = getAccessToken();

if (accessToken) {
  fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  .then(res => {
    if (res.status === 204 || res.status === 202 || res.status === 401) {
      throw new Error("No se está reproduciendo nada o el token es inválido.");
    }
    return res.json();
  })
  .then(data => {
    if (!data || !data.item) return;

    const songName = data.item.name;
    const artist = data.item.artists.map(a => a.name).join(", ");
    const spotifyUrl = data.item.external_urls.spotify;
    const songImage = data.item.album.images[0].url;

    container.innerHTML = `
      <div id="spotify-logo" class="dot"></div>
      <a href="${spotifyUrl}" target="_blank">
        <img src="${songImage}" alt="Cover Image">
        ${songName} — ${artist}
      </a>
    `;
  })
  .catch(err => {
    console.error("Failed to load the song:", err);
    songTitle.innerText = "No music playing";
  });
}