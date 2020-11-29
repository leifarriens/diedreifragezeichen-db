const Axios = require('axios');
const qs = require('qs');
require('dotenv').config();

// (async () => {
  // try {
  //   const response = await Axios('https://accounts.spotify.com/api/token', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       'Authorization': 'Basic ' + process.env.SPOTIFY_TOKEN
  //     },
  //     data: qs.stringify({
  //       'grant_type': 'client_credentials'
  //     })
  //   });

  //   console.log(response.data);
  //   return response.data.access_token;
  // } catch (error) {
  //   console.log(error.response);
  // }
// })();

const getBearerToken = async () => {
  try {
    const response = await Axios('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + process.env.SPOTIFY_TOKEN
      },
      data: qs.stringify({
        'grant_type': 'client_credentials'
      })
    })

    return response.data.access_token;
  } catch (error) {
    console.log(error.response);
  }
}

module.exports = {
  getBearerToken
}