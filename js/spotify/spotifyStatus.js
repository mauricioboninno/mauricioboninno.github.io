async function fetchCurrentlyPlaying() {
    const accessToken = localStorage.getItem('spotifyAccessToken');
    if (!accessToken) {
      console.error('No se encontró el token de acceso');
      return;
    }
  
    try {
      const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!res.ok || res.status === 204) {
        document.getElementById('spotify-card').innerHTML = '<div class="track-info">Nada sonando</div>';
        return;
      }
  
      const data = await res.json();
  
      const song = data?.item?.name || 'Desconocido';
      const artist = data?.item?.artists.map(a => a.name).join(', ') || 'Desconocido';
      const image = data?.item?.album?.images[0]?.url || '';
  
      document.getElementById('spotify-card').innerHTML = `
        <img src="${image}" alt="Portada" />
        <div class="track-info">
          <div class="track-name">${song}</div>
          <div class="track-artist">${artist}</div>
        </div>
      `;
    } catch (err) {
      console.error('Error al consultar Spotify:', err);
    }
  }
  
  // Ejecutar cada 10 segundos
  fetchCurrentlyPlaying();
  setInterval(fetchCurrentlyPlaying, 10000);
  