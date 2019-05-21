function renderLogin(users) {
    const loginHTML = `
        <h1 class="title">Guess a random song</h1>
        <div class="sign-in">
            <!-- <form class="sign-in__form">
                <h3>Search or create a lobby</h3>
                <input type="text" name="lobby-name" placeholder="Search or create a lobby">
                <button type="submit">Search or create a room</button>
            </form> -->

            <!-- <form class="sign-in__form">
                <h3>Join the game</h3>
                <input type="text" name="username" placeholder="Enter your username?">
                <button type="submit">Join game</button>
            </form> -->

            <form action="/login/spotify" class="sign-in__form">
                <h3>Join this lobby with Spotify</h3>
                <button type="submit">Join</button>
            </form>

            <div class="users">
                <h3>Current users in lobby</h3>
                <ul class="users__list">
                    ${users.map((user) => `<li>${user}</li>`).join('')}
                </ul>
            </div>

            <form class="play">
                <button class="play__btn" type="submit">Play game</button>
            </form>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', loginHTML);
}

function renderGame() {
    const gameHTML = `
        <div class="round-number">
            <p>Round: <span id="current-round">1</span> / <span id="total-rounds"></span></p>
        </div>
        <div class="game">
            <div class="song-panel">
                <progress value="0" max="10" id="progress-bar"></progress>

                <p class="song-panel__song-name" style="text-align:center"></p>
            </div>
            <div class="users-panel">
                <h3>Players in game</h3>
                <ul class="users-panel__list">
                    
                </ul>
            </div>
            <div class="guess-panel">
                <div class="guess-panel__form">
                    <input type="text" placeholder="Artist name" id="artist" autofocus>
                    <input type="text" placeholder="Song name" id="name">
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', gameHTML);
}

function clearPage() {
    while (document.body.hasChildNodes()) {
        document.body.removeChild(document.body.firstChild);
    }
}

export {
    renderLogin,
    renderGame,
    clearPage
};