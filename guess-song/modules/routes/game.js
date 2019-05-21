const database = require('../controllers/database');
const { getData, filterData, getRandomSongs } = require('../controllers/spotify-api');

module.exports = async function game(req, res) {
	const io = req.app.get('io');

	const accessToken = req.session.accessToken;

	if(accessToken && database.spotifyGame.songs.length === 0) {
		await getSongs(accessToken);
	}

	const users = database.spotifyGame.users.map(function(user) {
		return {
			id: user.id,
			username: user.username,
			score: user.score
		}
	});

	res.render('game', {
		users,
		accessToken: accessToken ? true : false
	});
}

async function getSongs(accessToken) {
	const tracks = await getData({
		endpoint: 'playlists/2f6tXtN0XesjONxicAzMIw/tracks',
		acces_token: accessToken
	});

	const filteredData = await filterData(tracks);
	const randomSongs = getRandomSongs(filteredData, database.spotifyGame.totalNumberOfSongs);
	database.spotifyGame.songs = [...randomSongs];
}