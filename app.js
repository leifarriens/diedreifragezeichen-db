const APIController = (function () {
	const client_id = '79857f84dc1e40699c3be93ef5c0c9f1';
	const client_secret = '4d1efc94594c49739f9c2c0d755a2fc6';

	// private methods

	const _getToken = async () => {

		const result = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
			},
			body: 'grant_type=client_credentials'
		});

		const data = await result.json();
		return data.access_token;
	}

	const _getArtist = async (token, artistId) => {
		const result = await fetch(`https://api.spotify.com/v1/artists/3meJIgRw7YleJrmbpbJK6S/`, {
			method: 'GET',
			headers: { 'Authorization': 'Bearer ' + token}
		});

		const data = await result.json();
		return data;
	}

	return 
})();