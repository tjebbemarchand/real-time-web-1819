(function () {
    const socket = io();

    let currentUser;

    const usernameForm = document.querySelector('.username-form');
    const usernameFormInput = document.querySelector('.username-form #username');
    const overlay = document.querySelector('.overlay');
    const chatForm = document.querySelector('.chat__input');
    const chatFormInput = document.querySelector('#make-guess');
    const chatGuessess = document.querySelector('.chat .chat__guessess');
    const feedback = document.querySelector('.chat .chat__guessess #feedback');

    usernameForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (usernameFormInput.value.length > 0) {
            socket.emit('new user', usernameFormInput.value);
            currentUser = usernameFormInput.value;
            usernameForm.parentNode.removeChild(usernameForm);
            overlay.parentNode.removeChild(overlay);
        }
    });

    chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const guess = chatFormInput.value;
        socket.emit('guess', guess);
        chatFormInput.value = '';
        return false;
    });

    socket.on('song', function (song) {
        const audio = `
            <audio controls class="song__player">
                <source src="${song.previewURL}" type="audio/mpeg">
            </audio>
            <h2>?</h2>
        `;

        document.querySelector('.game .song').insertAdjacentHTML('afterbegin', audio);
    });

    socket.on('new user', function (users) {
        const usersList = document.querySelector('.users .users__list');

        users.forEach(function(user) {
            const html = `<li>${user.username} - ${user.score} punten</li>`;
            usersList.insertAdjacentHTML('afterbegin', html);
        });
    });

    socket.on('guess', function(guess) {
        const li = document.createElement('li');
        console.log(guess.song.name);
        
        if(guess.correctAnswer) {
            li.setAttribute('class', 'correct-answer');
            document.querySelector('.song h2').textContent = guess.song.name;
        }

        const guessText = document.createTextNode(`${guess.username}: ${guess.guess}`);
        li.appendChild(guessText);
        chatGuessess.appendChild(li);
        // feedback.innerHTML = '';
    });

    chatFormInput.addEventListener('keypress', function() {
        socket.emit('typing', currentUser);
    });

    socket.on('typing', function(username) {
        feedback.innerHTML = `<p><em>${username} is guessing</em></p>`;
    });
}());