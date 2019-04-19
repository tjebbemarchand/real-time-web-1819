/* 
export SPOTIFY_CLIENT_ID=632929177f1d41e2b520c76bc28790ef
export SPOTIFY_CLIENT_SECRET=b8600bd2effc4cb8a58572f6858f7d88
*/

const express = require('express'),
      app = express(),
      server = require('http').createServer(app),
      io = require('socket.io')(server),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      oauth = require('./modules/oauth'),
      fetch = require('node-fetch'),
      uuidv4 = require('uuid/v4'),
      port = 3000;

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
	secret: "spotify",
	cookie: {
		secure: false
	},
	resave: false,
	saveUninitialized: true
}));

app.use(oauth);

io.on('connection', function (socket) {
    // socket.on('new user', function(user) {
    //     socket.users.push({
    //         id: uuidv4(),
    //         username: user
    //     });
    //     console.log(socket);
    // });
});

app.get('/', function(req, res) {
    fetch(getPlaylistTracksURL('37i9dQZF1DWTwCImwcYjDL?si=GvEGM8HKRCuT-ztkziaCuQ'), {
        headers: {
            'Authorization': 'Bearer ' + req.session.accessToken
        }
    }).then(function(response) {
        // return response.json();
        // console.log(req.session.accessToken);
        // console.log(req.session.accessToken);
        // console.log(response);
    }).then(function(data) {
        // const filteredSongs = filterPlaylistData(data.tracks.items);
        // req.session.randomSong = pickRandomSong(filteredSongs);
        // io.emit('song', req.session.randomSong.preview_url);
    });
    res.sendFile(__dirname + '/views/index.html');
});

// app.get('/', function(req, res) {
//     res.sendFile(__dirname + '/views/login.html');
// });

function getPlaylistTracksURL(trackID) {
    return `https://api.spotify.com/v1/playlists/${trackID}/tracks`;
}

function pickRandomSong(songs) {
    return songs[Math.floor(Math.random() * songs.length)];
}

function filterPlaylistData(data) {
    return data.map(function(item) {
        return {
            album_name: item.track.album.name,
            artist: item.track.artists,
            length: item.track.duration_ms,
            href: item.track.href,
            id: item.track.id,
            name: item.track.name,
            popularity: item.track.popularity,
            preview_url: item.track.preview_url,
            release_date: item.track.album.release_date,
            images: item.track.album.images
        }
    });
}

/* { album:
    { album_type: 'single',
      artists: [Array],
      available_markets: [Array],
      external_urls: [Object],
      href: 'https://api.spotify.com/v1/albums/7iranJF3kftVpGKc9yL21K',
      id: '7iranJF3kftVpGKc9yL21K',
      images: [Array],
      name: 'Distance',
      release_date: '2019-01-25',
      release_date_precision: 'day',
      total_tracks: 1,
      type: 'album',
      uri: 'spotify:album:7iranJF3kftVpGKc9yL21K' },
   artist: [ [Object], [Object] ],
   length: 168000,
   external_id: undefined,
   external_url: undefined,
   href: 'https://api.spotify.com/v1/tracks/2vMeBPjULSBy2kY2f9ocAj',
   id: '2vMeBPjULSBy2kY2f9ocAj',
   name: 'Distance',
   popularity: 64,
   preview_url:
    'https://p.scdn.co/mp3-preview/7bd939659ee86d219c2fac09816bf49c411d45e3?cid=632929177f1d41e2b520c76bc28790ef' }, */

server.listen(port, function() {
    console.log(`Server listening on port: ${port}`);
});