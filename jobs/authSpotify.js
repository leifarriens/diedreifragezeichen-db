const Axios = require('axios');
require('dotenv').config();

const authSpotify = async () => {
  const response = await Axios('https://accounts.spotify.com/api/token', {
    method: 'POST',
    data: { 'grant_type': 'client_credentials' },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + process.env.SPOTIFY_TOKEN
    }
  });
  console.log(response.data);

  return response.data.access_token;
}

console.log(await authSpotify());