const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const port = process.env.PORT || 3000;

const dictionary = {
	alphabet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
};

const users = {
    usernames: []
};

app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
	socket.on('chat', function (msg) {
		const msgArray = msg.toLowerCase().split('');
		const alphabetWord = [];
		
		msgArray.forEach(function(wordChar, alphaIndex) {
            if(wordChar === ' ') {
                alphabetWord.push('---');
            } else {
                const index = dictionary.alphabet.indexOf(wordChar);

                if(index > -1) {
                    alphabetWord.push(index + 1);
                } else {
                    alphabetWord.push(wordChar);
                }
            }
        });

        msg = alphabetWord.join('-');

		io.emit('chat', {
            username: socket.username,
            message: msg
        });
    });
    
    socket.on('new user', function(username) {
        socket.username = username;
        users.usernames.push(username);
    });
});

io.on('disconnect', function() {
    console.log('test');
});

http.listen(port, function () {
	console.log(`listening on ${port}`);
});