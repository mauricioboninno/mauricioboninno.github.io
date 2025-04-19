const accessToken = "aa855a0e6c5b40eb93019801d444f9e9";  // Sustituye por el token que obtuviste

const container = document.getElementById("spotify-now-playing");
const songTitle = document.getElementById("song-title");

fetch("https://api.spotify.com/v1/me/player/currently-playing", {
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
})
.then(res => {
  if (res.status === 204 || res.status === 202 || res.status === 401) {
    return null;
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
  container.innerHTML = `<span>Could not fetch the playing song.</span>`;
});