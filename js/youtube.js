// =============================
// YOUTUBE VIDEOS
// =============================

function initYouTubeVideos() {

    fetch("data/tutorials.json")
        .then(response => response.json())
        .then(data => renderVideos(data.videos))
        .catch(error => console.error("Failed to load tutorials:", error));

}

function renderVideos(videos) {
    videos.forEach(video => renderVideo(video.url));
}

function renderVideo(url) {
    const container = document.getElementById("video-list");
    if (!container) return;

    const videoId = extractVideoId(url);

    const videoElement = document.createElement("div");

    videoElement.classList.add("youtube-video");

    videoElement.dataset.url = url;

    container.appendChild(videoElement);

    renderSingleVideo(videoElement, videoId, url);

}

function renderSingleVideo(video, videoId, url) {

    if (!videoId) return;

    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const oEmbedUrl =
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

    fetch(oEmbedUrl)
        .then(res => res.json())
        .then(data => renderVideoCard(video, videoId, thumbnail, data.title))
        .catch(() => renderFallback(video, url, thumbnail));

}

function renderVideoCard(container, videoId, thumbnail, title) {

    container.innerHTML = `
        <div class="video-card">
            <div class="thumbnail-container">
                <img src="${thumbnail}" alt="${title}">
                <div class="play-button">▶</div>
            </div>
            <h3>${title}</h3>
        </div>
    `;

    container.querySelector(".video-card")
        .addEventListener("click", () => playVideo(videoId));

}

function renderFallback(container, url, thumbnail) {

    container.innerHTML = `
        <a href="${url}" target="_blank">
            <img src="${thumbnail}">
        </a>
    `;

}


// =============================
// VIDEO MODAL
// =============================

function initVideoModal() {

    const modal = document.getElementById("video-modal");
    const frame = document.getElementById("video-frame");
    const closeBtn = document.querySelector(".close-modal");

    if (!modal || !frame) return;

    // close with the ✖ button
    if (closeBtn) {
        closeBtn.addEventListener("click", () => closeModal(modal, frame));
    }

    // close by clicking on the background
    modal.addEventListener("click", (e) => {

        if (e.target === modal) {
            closeModal(modal, frame);
        }

    });

    // close with the ESC key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.style.display === "flex") {
            closeModal(modal, frame);
        }
    });

}

function playVideo(videoId) {

    const modal = document.getElementById("video-modal");
    const frame = document.getElementById("video-frame");

    frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

    modal.style.display = "flex";

}

function closeModal(modal, frame) {

    modal.style.display = "none";
    frame.src = "";

}


// =============================
// UTILS
// =============================

function extractVideoId(url) {

    const regExp = /(?:youtube\.com.*v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regExp);

    return match ? match[1] : null;

}