module.exports = function index(req, res, spotifyGame) {
	// const users = req.session.users ? req.session.users : false;
	// console.log(req.session);

	spotifyGame.users.push('test');
	console.log(spotifyGame, 'index');

	// res.render('index', {
	// 	users,
	// 	username: undefined
	// });
}