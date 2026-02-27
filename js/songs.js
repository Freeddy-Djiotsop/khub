let currentSong = null;
let currentMode = "lyrics";

function initSongs() {

    fetch("data/songs.json")
        .then(res => res.json())
        .then(data => renderSongList(data.songs));

}

function renderSongList(songs) {

    const list = document.getElementById("song-list");

    songs.forEach(song => {

        const card = document.createElement("div");

        card.classList.add("song-card");

        card.innerHTML = `
            <h3>${song.title}</h3>
            <p>${song.artist}</p>
        `;

        card.addEventListener("click", () => openSong(song));

        list.appendChild(card);

    });

}

// function openSong(song) {
//
//     document.getElementById("song-title").innerText = song.title;
//
//     loadSongFile(song.folder, "lyrics");
//
// }

function openSong(song){

    currentSong = song;

    document.getElementById("song-title").innerText = song.title;

    loadSongFile(song.folder, currentMode);

    document.querySelectorAll(".song-card").forEach(c=>c.classList.remove("active"));
    event.currentTarget.classList.add("active");

}

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

document.querySelectorAll(".mode-btn").forEach(btn=>{

    btn.addEventListener("click",()=>{

        document.querySelectorAll(".mode-btn").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");

        currentMode = btn.dataset.mode;

        if(currentSong){
            loadSongFile(currentSong.folder,currentMode);
        }

    });

});

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