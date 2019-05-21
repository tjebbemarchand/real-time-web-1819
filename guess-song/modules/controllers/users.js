const database = require('../controllers/database');
const uuidv4 = require('uuid');

module.exports = {
    saveUser: function(username) {
        database.spotifyGame.users.push({
            id: uuidv4(),
            username,
            score: 0
        });
    },
    deleteUser: function(id) {
        const userFound = database.spotifyGame.users.findIndex(function(user) {
            return user.id === id;
        });

        if(userFound) database.spotifyGame.users.splice(userFound, 1);
    },
    updateScore: function(username, score) {
        const userIndex = database.spotifyGame.users.findIndex(function(user) {
            return user.username === username;
        });

        if(userIndex > -1) database.spotifyGame.users[userIndex].score += score;
    },
    getUsernames: function() {
        return database.spotifyGame.users.map(function(user) {
            return user.username
        });
    }
}