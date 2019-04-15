(function () {
    const socket = io();

    let user;

    const usernameForm = document.querySelector('.username-form');
    const usernameInput = document.getElementById('username');
    const messageForm = document.querySelector('.messages-form');
    const messageInput = document.getElementById('message-input');
    const overlay = document.querySelector('.overlay');
    const messages = document.getElementById('messages');
    const feedback = document.getElementById('feedback');

    usernameForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if(usernameInput.value.length > 0) {        
            socket.emit('new user', usernameInput.value, function(username) {

            });

            user = usernameInput.value;

            usernameForm.parentNode.removeChild(usernameForm);
            overlay.parentNode.removeChild(overlay);

            messageForm.addEventListener('submit', function(e) {
                e.preventDefault();
                let msg = document.querySelector('#message-input').value;
                socket.emit('chat', msg);
                document.querySelector('#message-input').value = "";
                return false;
            });
        }
    });

    socket.on('chat', function (data) {
        const li = document.createElement('li')
        const msgtext = document.createTextNode(`${data.username}: ${data.message}`);
        li.appendChild(msgtext);
        messages.appendChild(li);
        feedback.innerHTML = '';
    });
    
    messageInput.addEventListener('keypress', function() {
        socket.emit('typing', user);
    });
    
    socket.on('typing', function(data) {
        feedback.innerHTML = `<p><em>${data} is typing a message...</em></p>`;
    });
}());