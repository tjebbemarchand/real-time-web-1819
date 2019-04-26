/* 
export SPOTIFY_CLIENT_ID=632929177f1d41e2b520c76bc28790ef
export SPOTIFY_CLIENT_SECRET=b8600bd2effc4cb8a58572f6858f7d88
*/

// Packages
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const uuidv4 = require('uuid');

// Express
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Middleware
app.use(session({
    secret: 'spotify',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 365 * 24 * 60 * 60 * 1000
    }
}));

// Database
const spotifyGame = {
    users: [],
    songs: []
};

// Modules
const oauth = require('./modules/oauth');
const spotifyApiClass = require('./modules/controllers/spotify-api');

// Routes
const index = require('./routes/index');
const game = require('./routes/game');
const info = require('./routes/info');

const config = {
    port: 3000
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(oauth);

// Template engine
app.set('view engine', 'ejs');

// Static files
app.use(express.static(__dirname + '/static'));

// Pages
app.set('views', path.join(__dirname, 'views'));

// Bodyparser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Routes
function buildRoute(route, ...args) {
    return function (req, res) {
        route(req, res, ...args);
    }
}

app.get('/game', game);
app.get('/getuserinfo', info);
app.get('/', buildRoute(index, spotifyGame));

// function getUserNames() {
//     if (users.length > 0) {
//         return users.map(user => user.name);
//     }

//     return 'no users available';
// }

// Sockets
io.on('connection', function (socket) {
    // io.emit('get users', getUserNames());

    // socket.on('new user', function(username) {
    //     spotifyGame.users.push({
    //         id: uuidv4(),
    //         username,
    //         score: 0
    //     });
    //     socket.emit('new user', username);
    // });
});

http.listen(config.port, function () {
    console.log(`Server listening on port: ${config.port}`);
});











// Launch the spotify API
// let spotifyApi = new spotifyApiClass({
//     clientId: process.env.SPOTIFY_clientId,
//     clientSecret: process.env.SPOTIFY_clientSecret,
//     playlistId: '3WFMtlxT9NW5rgkZCpbxKG'
// }).then(scope => {
//     // console.log(chalk.yellow('Finished getting playlist'))
//     // Start loop
//     // trackLoop(scope, app, io, config)
//     //getLoopTracks(scope)
//     console.log('scope: ', scope)
//     // return scope;
// })

// console.log(spotifyApi);