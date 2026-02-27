// =============================
// ENTRY POINT
// =============================

document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initYouTubeVideos();
    initVideoModal();
    initImageGallery();
    initDocuments();
    initSongs()

});


// =============================
// TABS
// =============================

function initTabs() {

    const buttons = document.querySelectorAll(".tab-button");

    buttons.forEach(button => {

        button.addEventListener("click", (event) => {

            openTab(event, button.dataset.tab);

        });

    });

}

function openTab(event, tabId) {

    const contents = document.querySelectorAll(".tab-content");
    const buttons = document.querySelectorAll(".tab-button");

    contents.forEach(c => c.classList.remove("active"));
    buttons.forEach(b => b.classList.remove("active"));

    document.getElementById(tabId).classList.add("active");
    event.target.classList.add("active");

}


// =============================
// IMAGE GALLERY
// =============================
function initImageGallery() {

    fetch("data/images.json")
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("image-list");
            data.images.forEach(img => {
                const el = document.createElement("img");
                el.src = img.src;
                el.alt = img.alt || "";
                container.appendChild(el);
            });
        })
        .catch(err => console.error("Failed to load images:", err));

}

// =============================
// DOCUMENTS
// =============================

function initDocuments() {
    fetch("data/documents.json")
        .then(res => res.json())
        .then(data => renderDocuments(data.documents))
        .catch(err => console.error("Failed to load documents:", err));
}

function renderDocuments(docs) {
    const container = document.getElementById("document-list");
    if (!container) return;

    docs.forEach(doc => {
        const card = document.createElement("div");
        card.classList.add("document-card");

        // choix icône selon type
        let icon = "";
        if (doc.type === "pdf") icon = "📄";
        else if (doc.type === "doc") icon = "📝";
        else icon = "📁";

        card.innerHTML = `
            <a href="${doc.src}" target="_blank" class="doc-link">
                <div class="doc-icon">${icon}</div>
                <div class="doc-title">${doc.title}</div>
            </a>
        `;

        container.appendChild(card);
    });
}

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

    const container = document.getElementById("video-list");

    if (!container) return;

    videos.forEach(video => {

        const videoId = extractVideoId(video.url);

        const videoElement = document.createElement("div");

        videoElement.classList.add("youtube-video");

        videoElement.dataset.url = video.url;

        container.appendChild(videoElement);

        renderSingleVideo(videoElement, videoId, video.url);

    });

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