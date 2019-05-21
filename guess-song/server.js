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
app.set('io', io);

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
const database = require('./modules/controllers/database');
let round = 1;

// Users
const users = require('./modules/controllers/users');
const getUsernames = users.getUsernames;
const saveUser = users.saveUser;
const updateScore = users.updateScore;

// Modules
const oauth = require('./modules/oauth');
const spotifyApiClass = require('./modules/controllers/spotify-api');

// Utilities
const utilities = require('./modules/utils');
const buildRoute = utilities.buildRoute;

// Routes
const game = require('./modules/routes/game');

const config = {
    port: process.env.PORT || 3000
};

// Oauth
app.use(oauth);

// Template engine
app.set('view engine', 'ejs');

// Static files
app.use(express.static(__dirname + '/static'));

// Pages
app.set('views', path.join(__dirname, 'views'));

// Bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Routes
app.get('/', game);

// Sockets
io.on('connection', function (socket) {
    socket.on('new user', function (username) {
        if(database.spotifyGame.gameStarted === false) {
            const foundUser = database.spotifyGame.users.findIndex(function (user) {
                return user.username === username;
            });
    
            if (foundUser === -1) {
                socket.username = username;
                saveUser(username);
                socket.emit('user succes');
                io.emit('new user', username);
            } else {
                socket.emit('user failed');
            }
        } else {
            socket.emit('game started');
        }
    });

    socket.on('play game', function () {
        if(database.spotifyGame.users.length > 0 && database.spotifyGame.gameStarted === false) {
            io.emit('play game');
            io.emit('all users', allUsers());
            io.emit('all songs', database.spotifyGame.songs);
            database.spotifyGame.gameStarted = true;
            playGame();
        }
    });

    socket.on('update score', function (score) {
        updateScore(socket.username, score);
        io.emit('all users', database.spotifyGame.users);
    });

    socket.on('game done', function() {
        database.spotifyGame.users = [];
        database.spotifyGame.songs = [];
        database.spotifyGame.gameStarted = false;
    });

    socket.on('disconnect', function () {
        const disconnectedUserIndex = database.spotifyGame.users.findIndex(function(user) {
            return user.username === socket.username;
        });

        if(disconnectedUserIndex > -1) {
            const username = database.spotifyGame.users[disconnectedUserIndex].username;
            io.emit('delete user', username);
            database.spotifyGame.users.splice(disconnectedUserIndex, 1);  
        }
    });
});

function allUsers() {
    return database.spotifyGame.users.map(function (user) {
        return {
            username: user.username,
            score: user.score
        }
    });
}

function playGame() {
    if(round <= database.spotifyGame.totalNumberOfSongs) {
        // Refactor
        const playSongTimeout = setTimeout(function () {
            io.emit('play song');
            const stopSongTimeout = setTimeout(function () {
                io.emit('stop song');
                const getResultsTimeout = setTimeout(function () {
                    clearTimeout(getResultsTimeout);
                    io.emit('get results');
                    round++;
                    playGame();
                }, 10000); // Time to guess
                clearTimeout(stopSongTimeout);
            }, 7500) // Songs stops
            clearTimeout(playSongTimeout);
        }, 5000); // Songs plays
    } else {
        setTimeout(function() {
            io.emit('game done', allUsers());
        }, 5000);
    }
}

http.listen(config.port, function () {
    console.log(`Server listening on port: ${config.port}`);
});