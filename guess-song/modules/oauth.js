const express = require('express');
const router = express.Router();
const request = require('request');
const querystring = require('querystring');
const port = 3000 || process.env.PORT;

let redirect_uri = process.env.REDIRECT_URI || `http://localhost:${port}/callback`;

router.get('/login/spotify', function (req, res) {
	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
			response_type: 'code',
			client_id: process.env.SPOTIFY_CLIENT_ID,
			scope: 'user-read-private user-read-email',
			redirect_uri
		}));
});

router.get('/callback', function (req, res) {
	let code = req.query.code || null;
	let authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			code: code,
			redirect_uri,
			grant_type: 'authorization_code'
		},
		headers: {
			'Authorization': 'Basic ' + (new Buffer(
				process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
			).toString('base64'))
		},
		json: true
	};
	request.post(authOptions, function (error, response, body) {
		var access_token = body.access_token;
		let uri = process.env.FRONTEND_URI || `http://localhost:${port}/`;
		req.session.accessToken = access_token;
		res.redirect(uri);
	});
});

module.exports = router;