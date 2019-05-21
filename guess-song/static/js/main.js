import {
    clearPage,
    renderGame,
    renderLogin
} from './modules/render.js';

window.addEventListener('load', function (event) {
    const socket = io();
    let allSongs = [];
    let currentSong;
    let songIndex = 0;

    const signInFormUsername = document.querySelector('.sign-in__form--username') || false;
    const playForm = document.querySelector('.play') || false;

    if (signInFormUsername) {
        signInFormUsername.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = e.target[0].value;
            if (username && username.length >= 3) {
                socket.emit('new user', username);
                e.target[0].value = '';

                socket.on('user succes', function () {
                    signInFormUsername.parentNode.removeChild(signInFormUsername);
                });

                socket.on('user failed', function() {
                    console.log('Username already exists');
                });
            }
        });
    }

    if (playForm) {
        playForm.addEventListener('submit', function (e) {
            e.preventDefault();

            socket.emit('play game');
        });
    }

    socket.on('all users', function (users) {
        const usersList = document.querySelector('.users-panel .users-panel__list');

        if (users) {
            while (usersList.firstChild) {
                usersList.removeChild(usersList.firstChild);
            }
            users.forEach(function (user) {
                usersList.insertAdjacentHTML('afterbegin', `<li>${user.username} - ${user.score} points</li>`);
            });
        }
    });

    socket.on('all songs', function (songs) {
        allSongs = songs;
        document.querySelector('.round-number #total-rounds').innerHTML = allSongs.length;
    });

    socket.on('play game', function () {
        clearPage();
        renderGame();

        counter(5);
    });

    socket.on('play song', function () {
        if(songIndex < allSongs.length) {
            currentSong = allSongs[songIndex];
    
            console.log(currentSong.artist.name);
            console.log(currentSong.name);
    
            setupSong(currentSong);
    
            counter(6);
            const audio = playSong(currentSong.preview_url);
    
            socket.on('stop song', function () {
                counter(9);
                stopSong(audio);
    
                socket.on('get results', function () {
                    const artistNameInput = document.querySelector('.guess-panel .guess-panel__form #artist');
                    const songNameInput = document.querySelector('.guess-panel .guess-panel__form #name');
    
                    const guessedArtistName = artistNameInput.value;
                    const guessedSongName = songNameInput.value;
    
                    artistNameInput.value = '';
                    songNameInput.value = '';
    
                    checkResults(guessedArtistName, guessedSongName);
                    revealSong();
                    counter(4);
                });
            });
            songIndex++;
            document.querySelector('.round-number #current-round').innerHTML = songIndex;
        }
    });

    socket.on('game started', function() {
        alert('The game already started. Wait for it to be finished');
    });

    socket.on('game done', function (users) {
        /* const userss = [
            {
                username: 'Karin',
                score: 50
            },
            {
                username: 'Tjebbe',
                score: 100
            },
            {
                username: 'Tim',
                score: 0
            }
        ]; */
        const sortedUsers = sort(users); // Check with dummy data

        const popup = `
            <div class="popup">
                <div class="popup__content">
                    <h3>Game done. Check on who has won</h3>
                    <ul class="popup__users">
                        ${generateUsersPopupList(sortedUsers).join('')}    
                    </ul>
                    <form class="form-game-done">
                        <button class="form-game-done__button" type="submit">Back to lobby</button>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('afterbegin', popup);

        document.querySelector('.form-game-done').addEventListener('submit', function(e) {
            e.preventDefault();

            socket.emit('game done');
            window.location.href = "/";
        });
    });

    socket.on('new user', function (username) {
        document.querySelector('.users__list').insertAdjacentHTML('beforeend', `<li>${username}</li>`);
    });

    socket.on('delete user', function (username) {
        const usersList = document.querySelectorAll('.users__list li') || document.querySelectorAll('.users-panel__list li');
        usersList.forEach(function (user) {
            if (user.textContent === username) {
                user.parentNode.removeChild(user);
            }
        });
    });

    function generateUsersPopupList(users) {
        return users.map(function (user, i) {
            return `<li class="popup__user ${i === 0 ? 'popup__user--winner' : ''}">${i + 1}: ${user.username} - ${user.score} punten</li>`
        });
    }

    function sort(data) {
        return data.sort(function(a, b) {
            if (a.score > b.score) {
                return -1;
            } else if (a.score < b.score) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    function counter(timeLeft) {
        const max = timeLeft + 1;
        const progressBar = document.getElementById("progress-bar");
        const counterInterval = setInterval(function () {
            progressBar.max = max;
            progressBar.value = progressBar.max - timeLeft;
            timeLeft -= 1;
            if (timeLeft < 0)
                clearInterval(counterInterval);
        }, 1000);
    }

    function setupSong() {
        removeCurrentSong();

        const albumCover = `
            <img src="${allSongs[songIndex].images[0].url}" class="album-cover" alt="Album cover">
        `;

        const songPanelSongName = document.querySelector('.song-panel__song-name');
        songPanelSongName.insertAdjacentHTML('beforebegin', albumCover);
        // songPanel.insertAdjacentHTML('beforeend', progressBar);
    }

    function playSong(url) {
        let audio = undefined;
        audio = document.createElement('audio');
        audio.src = url;
        audio.play();
        return audio;
    }

    function stopSong(audio) {
        audio.pause();
    }

    /* function startProgressBar() {
        const percent = document.querySelector('.progress-wrap').dataset.progressPercent / 100;
        const progressBarWidth = document.querySelector('.progress-wrap').offsetWidth;
        const progressTotal = percent * progressBarWidth;
        const animationLength = 7500;

        $('.progress-bar').stop().animate({
            left: progressTotal
        }, animationLength);
    }

    function resetProgressBar() {
        $('.progress-bar').css({
            left: 0
        });
    } */

    function removeCurrentSong() {
        const albumCover = document.querySelector('.album-cover') || false;
        const songName = document.querySelector('.song-panel__song-name') || false;

        console.log(songName, '  Remove current song functie');

        if (albumCover) {
            albumCover.parentNode.removeChild(albumCover);
        }

        if (songName) {
            songName.textContent = "";
        }
    }

    function checkResults(guessedArtistName, guessedSongName) {
        let score = 0;

        if (guessedArtistName.length > 0) {
            const artistNameCorrect = currentSong.artist.name.toLowerCase().replace(/[^a-zA-Z ]/g, "").includes(guessedArtistName.toLowerCase().replace(/[^a-zA-Z ]/g, ""));

            if (artistNameCorrect) {
                score += 50;
            }
        }

        if (guessedSongName.length > 0) {
            const songNameCorrect = currentSong.name.toLowerCase().replace(/[^a-zA-Z ]/g, "").includes(guessedSongName.toLowerCase().replace(/[^a-zA-Z ]/g, ""));

            if (songNameCorrect) {
                score += 50;
            }    
        }

        socket.emit('update score', score);
    }

    function revealSong() {
        const albumCover = document.querySelector('.song-panel .album-cover');
        albumCover.style.filter = 'none';
        const songName = document.querySelector('.song-panel__song-name') || false;

        document.querySelector('.song-panel__song-name').innerHTML = `${currentSong.name} - ${currentSong.artist.name}`;
    }

    /* function renderPopup() {
        clearPage();

        const html = `
            <div class="popup">
                <div class="popup__content">
                    <h2>Results</h2>
                    <ul class="popup__users">
                        <li class="popup__user popup__user--winner">1: Tjebbe - 100 punten</li>      
                        <li class="popup__user">2: Karin - 100 punten</li>      
                        <li class="popup__user">3: Tjebbe - 100 punten</li>      
                    </ul>
                    <form class="form-game-done">
                        <button class="form-game-done__button" type="submit">Back to lobby</button>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('afterbegin', html);
    }

    renderPopup(); */
});