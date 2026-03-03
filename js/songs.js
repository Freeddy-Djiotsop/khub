let currentSong = null;
let currentMode = "lyrics";
let modeBtnList = document.querySelectorAll(".mode-btn");


function initSongs() {

    fetch("data/songs.json")
        .then(res => res.json())
        .then(data => renderSongList(data.songs));

}

function renderSongList(songs) {

    const list = document.getElementById("song-list")
    list.innerHTML = ""

    songs.sort((a,b)=>a.title.localeCompare(b.title))
        .forEach(song => {

        const card = document.createElement("div")

        card.className = "song-card"

        card.innerHTML = `
            <div class="song-row">
            <span class="song-icon">${getSongIcon(song.type)}</span>
                <div>
                    <strong>${song.title}</strong>
                    <br>
                    <small>${song.artist}</small>
                </div>
            </div>
            `;

        card.addEventListener("click", () => openSong(song, card))

        list.appendChild(card)

    })

}

function getSongIcon(type) {

    if (type === "heralders") return "🎼"
    if (type === "community") return "🎤"
    if (type === "international") return "🌍"

    return "🎵"

}

//
// function renderSongList(songs) {
//
//     const list = document.getElementById("song-list");
//
//     songs.forEach(song => {
//
//         const card = document.createElement("div");
//
//         card.classList.add("song-card");
//
//         card.innerHTML = `
//             <h3>${song.title}</h3>
//             <p>${song.artist}</p>
//         `;
//
//         card.addEventListener("click", () => openSong(song));
//
//         list.appendChild(card);
//
//     });
//
// }

// function openSong(song) {
//
//     document.getElementById("song-title").innerText = song.title;
//
//     loadSongFile(song.folder, "lyrics");
//
// }

function openSong(song, card) {

    currentSong = song

    document.getElementById("song-title").innerText = song.title

    document.querySelectorAll(".song-card")
        .forEach(c => c.classList.remove("active"))

    card.classList.add("active")

    loadSongFile(song.folder, currentMode)

    setupMedia(song)

}

// function openSong(song){
//
//     currentSong = song;
//
//     document.getElementById("song-title").innerText = song.title;
//
//     loadSongFile(song.folder, currentMode);
//
//     document.querySelectorAll(".song-card").forEach(c=>c.classList.remove("active"));
//     event.currentTarget.classList.add("active");
//
// }

function loadSongFile(folder, mode) {

    let file = "lyrics.txt";

    if (mode === "alpha") file = "chords-alpha.txt";
    if (mode === "number") file = "chords-number.txt";

    fetch(`songs/${folder}/${file}`)
        .then(res => res.text())
        .then(text => {

            document.getElementById("song-content").textContent = text;

        });

}

function setupMedia(song) {

    const youtubeBtn = document.getElementById("youtube-btn")
    const audioBtn = document.getElementById("audio-btn")
    const audioContainer = document.getElementById("audio-container")

    youtubeBtn.classList.remove("active")
    audioBtn.classList.remove("active")
    youtubeBtn.classList.add("hidden")
    audioBtn.classList.add("hidden")
    audioContainer.innerHTML = ""

    if (song.youtube) {

        youtubeBtn.classList.remove("hidden")

        youtubeBtn.onclick = () => {
            removeActive();
            youtubeBtn.classList.add("active")

            // window.open(song.youtube,"_blank")
            document.getElementById("song-content").innerHTML = `
                <div class="video-list">
                    <div class="video-list" id="video-list"></div>
                </div>
                <div id="video-player-container"></div>
            `;
            renderVideo(song.youtube)
        }

    }

    if (song.audio) {

        audioBtn.classList.remove("hidden")

        audioBtn.onclick = () => {
            audioBtn.classList.add("active")

            audioContainer.innerHTML =
                `<audio controls src="${song.audio}" style="width:100%"></audio>`
        }

    }


}

modeBtnList.forEach(btn => {

    btn.addEventListener("click", () => {

        removeActive();
        btn.classList.add("active");

        currentMode = btn.dataset.mode;

        if (currentSong) {
            loadSongFile(currentSong.folder, currentMode);
        }

    });

});

function removeActive() {
    modeBtnList.forEach(b => b.classList.remove("active"));
}

document
    .getElementById("song-search")
    .addEventListener("input", function () {

        const value = this.value.toLowerCase();

        const cards = document.querySelectorAll(".song-card");

        cards.forEach(card => {

            const title = card.innerText.toLowerCase();

            card.style.display = title.includes(value)
                ? "block"
                : "none";

        });

    });