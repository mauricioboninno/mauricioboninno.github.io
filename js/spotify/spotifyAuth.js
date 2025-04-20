const client_id = '07fd50af50a34e5ab4f587afb4cd4962'; // Tu Client ID de Spotify
const redirect_uri = 'https://boninno.com.ar'; // Tu URI de redirección

// Solicitar autorización de acceso a la API de Spotify
function authorizeSpotify() {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}&scope=user-read-currently-playing`;
  window.location.href = authUrl;
}

// Obtener el token de acceso desde la URL
function getAccessTokenFromUrl() {
  const hash = window.location.hash.substring(1); // Eliminar el primer carácter "#"
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  
  if (accessToken) {
    localStorage.setItem('spotifyAccessToken', accessToken);
    return accessToken;
  }

  return null;
}

// Verificar si ya tenemos un token
function checkAccessToken() {
  let token = localStorage.getItem('spotifyAccessToken');
  if (!token) {
    token = getAccessTokenFromUrl();
  }
  return token;
}

// Llamar a la función para autorizar Spotify (si el token no está disponible)
if (!checkAccessToken()) {
  authorizeSpotify();
}
