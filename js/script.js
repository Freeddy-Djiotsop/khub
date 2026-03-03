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

