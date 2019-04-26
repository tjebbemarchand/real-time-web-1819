(function() {
    const socket = io();

    const signInForm = document.querySelector('.sign-in .sign-in__form');
    const signInFormInput = signInForm.querySelector('input');
    const currentLobby = document.querySelector('.sign-in .sign-in__users ul');
    
    // Event listeners
    signInForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if(signInFormInput.value.length > 0) {
            const username = signInFormInput.value;
            signInForm.parentNode.removeChild(signInForm);
            socket.emit('new user', username);
        }
    });
    
    // Sockets
    socket.on('new user', function(username) {
        currentLobby.insertAdjacentHTML('beforeend', `<li>${username}</li>`);

        const playButton = `
            <a class="sign-in__play-btn" href="/game">Play</a>
        `;
    });

    socket.on('get users', function(users) {
        if(typeof users === 'string') {
            currentLobby.innerHTML = users;
            return;
        }
        users.forEach(function(username) {
            currentLobby.insertAdjacentHTML('beforeend', `<li>${username}</li>`);
        });
    })
})();