(function () {
    const socket = io();

    const usernameForm = document.querySelector('.username-form');
    const usernameInput = document.getElementById('username');

    usernameForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if(usernameInput.value.length > 0) {        
            socket.emit('new user', usernameInput.value, function(username) {
                // Show username on client side.
            });

            const chat = `
                <ul id="messages"></ul>
                <form class="messages-form" action="">
                    <input id="input" autocomplete="off">
                    <button>Send</button>
                </form>
            `;

            document.querySelector('body').insertAdjacentHTML('afterbegin', chat);
            usernameForm.parentNode.removeChild(usernameForm);

            document.querySelector('.messages-form').addEventListener('submit', function(e) {
                e.preventDefault();
                let msg = document.querySelector('#input').value;
                socket.emit('chat', msg);
                document.querySelector('#input').value = "";
                return false;
            });
        }
    });

    socket.on('chat', function (data) {
        const li = document.createElement('li')
        const msgtext = document.createTextNode(`${data.username}: ${data.message}`);
        li.appendChild(msgtext);
        document.querySelector('#messages').appendChild(li);
    });
}());