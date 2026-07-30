const form = document.getElementById("form");
const urlInput = document.getElementById("urlInput");
const fetchBtn = document.getElementById("fetchBtn");
const statusLine = document.getElementById("statusLine");
const preview = document.getElementById("preview");
const previewCover = document.getElementById("previewCover");
const previewTitle = document.getElementById("previewTitle");
const previewAuthor = document.getElementById("previewAuthor");
const previewDuration = document.getElementById("previewDuration");
const dlMp4 = document.getElementById("dlMp4");
const dlMp3 = document.getElementById("dlMp3");
const clockEl = document.getElementById("clock");

// HUD clock kecil, sekedar aksen "camcorder" — jalan dari 0 tiap load halaman
let seconds = 0;
setInterval(() => {
  seconds++;
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  clockEl.textContent = `${h}:${m}:${s}`;
}, 1000);

function formatDuration(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function setStatus(text, kind) {
  statusLine.textContent = text;
  statusLine.className = "status-line" + (kind ? ` ${kind}` : "");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = urlInput.value.trim();
  if (!url) return;

  fetchBtn.disabled = true;
  setStatus("MENGANALISIS LINK...");
  preview.hidden = true;

  try {
    const res = await fetch("/api/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const json = await res.json();

    if (!json.ok) throw new Error(json.error || "Gagal ambil data.");

    const data = json.data;
    previewCover.src = data.cover || "";
    previewTitle.textContent = data.title || "TikTok Video";
    previewAuthor.textContent = `@${data.author}`;
    previewDuration.textContent = formatDuration(data.durationSec || 0);

    dlMp4.href = `/api/download?url=${encodeURIComponent(url)}&format=mp4`;
    dlMp3.href = `/api/download?url=${encodeURIComponent(url)}&format=mp3`;

    preview.hidden = false;
    setStatus("SIAP — pilih format download di bawah", "ok");
  } catch (err) {
    setStatus(`ERROR — ${err.message}`, "error");
  } finally {
    fetchBtn.disabled = false;
  }
});
