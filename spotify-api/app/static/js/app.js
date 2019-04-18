(function () {
    const socket = io();

    const dom = {
        usernameForm: document.querySelector('.username-form'),
        usernameInput: document.querySelector('#username'),
        overlay: document.querySelector('.overlay')
    };

    dom.usernameForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if(dom.usernameInput.value.length > 0) {        
            socket.emit('new user', dom.usernameInput.value);
            dom.usernameForm.parentNode.removeChild(dom.usernameForm);
            dom.overlay.parentNode.removeChild(dom.overlay);
        }
    });

    socket.on('song', function(song) {
        console.log(song);
        const audio = `
            <audio controls>
                <source src="${song}" type="audio/mpeg">
            </audio>
        `;

        document.querySelector('.game .song').insertAdjacentHTML('afterbegin', audio);
    });

    function makeUser() {

    }
}());