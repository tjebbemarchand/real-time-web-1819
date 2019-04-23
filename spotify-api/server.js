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
    axios = require('axios'),
    db = require('diskdb'),
    dataBases = ['currentRandomSong', 'historySongs', 'users'];
    databases = db.connect('./database/', dataBases),
    uuidv4 = require('uuid/v4'),
    port = 3000;

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// Remove all databases.
// dataBases.forEach(function(dataBase) {
//     databases[dataBase].remove();
// });

// Setup databases.
// databases.loadCollections(dataBases)


/////////// SESSION ///////////
app.use(session({
    secret: "spotify",
    cookie: {
        secure: false
    },
    resave: false,
    saveUninitialized: true
}));

/////////// OAUTH ///////////
app.use(oauth);

/////////// ROUTES ///////////
app.get('/', async function (req, res) {
    if(!req.session.accessToken) {
        res.redirect('login/spotify');
    } else {
        res.sendFile(__dirname + '/views/game.html');
    }

    const randomSong = await getSong(req, res);
    io.emit('song', {previewURL: randomSong.preview_url});
});






io.on('connection', function (socket) {
    /////////// WEBSOCKETS ///////////
    socket.on('new user', function (username) {
        const userExists = databases.users.find().find(function(user) {
            return user.username === username;
        });
        if(userExists) {

        } else {
            
        }

        let user = {
            username,
            score: 0
        };

        socket.user = user;
        // databases.users.save([user])
        
        // const users = databases.users.find().map(function(user) {
        //     return {
        //         username: user.username,
        //         score: user.score
        //     }
        // });
        
        io.emit('new user', [user]);
    });

    socket.on('guess', function (guess) {
        let correctAnswer;
        let song;

        if (spotifyGame.currentRandomSong.name.includes(guess)) {
            correctAnswer = true;
            song = spotifyGame.currentRandomSong;
        } else {
            correctAnswer = false;
            song = {};
        }

        io.emit('guess', {
            username: socket.username,
            guess,
            correctAnswer,
            song
        });
    });

    socket.on('typing', function (username) {
        socket.broadcast.emit('typing', username);
    });

    // socket.on('disconnect', function(){
    //     console.log('user disconnected');
    // });
});








/////////// HELPER FUNCTIONS ///////////
function getPlaylistTracksURL(trackID) {
    return `https://api.spotify.com/v1/playlists/${trackID}/tracks`;
}

function pickRandomSong(songs) {
    let randomSong = songs[Math.floor(Math.random() * songs.length)];

    while (randomSong.preview_url === null) {
        randomSong = songs[Math.floor(Math.random() * songs.length)];
    }

    return randomSong;
}

function filterPlaylistData(data) {
    return data.map(function (item) {
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

async function getSong(req, res) {
    // let randomSongDB = databases.currentRandomSong.find();

    // if(randomSongDB.length > 0) {
    //     console.log('Database:', randomSongDB[0].song.preview_url);
    //     return randomSongDB[0].song;
    // } else {
        
    // }

    try {
        const songs = await axios.get(getPlaylistTracksURL('1DTzz7Nh2rJBnyFbjsH1Mh?si=aIHWLEtVRLmCNLC5ys9Yiw'), {
            headers: {
                'Authorization': 'Bearer ' + req.session.accessToken
            }
        });
    
        const filteredSongs = filterPlaylistData(songs.data.tracks.items);
        randomSong = pickRandomSong(filteredSongs);
        databases.currentRandomSong.remove(); // Remove current db
        databases.loadCollections(['currentRandomSong']); // Make new db
        databases.currentRandomSong.save({ song: randomSong });
        return randomSong
    } catch(error) {
        console.log(error);
    }
}






/////////// SERVER STARTUP ///////////
server.listen(port, function () {
    console.log(`Server listening on port: ${port}`);
});


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