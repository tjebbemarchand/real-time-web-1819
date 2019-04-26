const axios = require('axios');

module.exports = async function info(req, res) {
	const accessToken = req.session.accessToken;
	const info = await axios.get('https://api.spotify.com/v1/me', {
		headers: {
			'Authorization': 'Bearer ' + accessToken
		}
	});

	const username = info.data.display_name;
	res.render('index', {
		username
	});
}