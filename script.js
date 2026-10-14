const audio = document.querySelector("#wedding-song");
const musicToggle = document.querySelector("#music-toggle");
const musicLabel = musicToggle.querySelector(".music-toggle__label");

function updateMusicControl(isPlaying) {
  musicToggle.classList.toggle("music-toggle--playing", isPlaying);
  musicToggle.setAttribute("aria-label", isPlaying ? "Pause wedding music" : "Play wedding music");
  musicLabel.textContent = isPlaying ? "Music on" : "Play music";
}

function startMusic() {
  audio.play().then(() => updateMusicControl(true)).catch(() => updateMusicControl(false));
}

function startMusicFromFirstInteraction() {
  if (audio.paused) startMusic();
  document.removeEventListener("pointerdown", startMusicFromFirstInteraction);
  document.removeEventListener("keydown", startMusicFromFirstInteraction);
  document.removeEventListener("wheel", startMusicFromFirstInteraction);
  document.removeEventListener("touchstart", startMusicFromFirstInteraction);
}

musicToggle.addEventListener("click", () => {
  if (audio.paused) {
    startMusic();
  } else {
    audio.pause();
    updateMusicControl(false);
  }
});

audio.addEventListener("ended", () => updateMusicControl(false));
audio.addEventListener("play", () => updateMusicControl(true));
audio.addEventListener("pause", () => updateMusicControl(false));

document.addEventListener("pointerdown", startMusicFromFirstInteraction, { once: true });
document.addEventListener("keydown", startMusicFromFirstInteraction, { once: true });
document.addEventListener("wheel", startMusicFromFirstInteraction, { once: true, passive: true });
document.addEventListener("touchstart", startMusicFromFirstInteraction, { once: true, passive: true });
startMusic();

const scratchCard = document.querySelector(".scratch-card");
const scratchCanvas = scratchCard.querySelector(".scratch-card__canvas");
const scratchContext = scratchCanvas.getContext("2d", { willReadFrequently: true });
let isScratching = false;
let scratchRevealed = false;
let scratchMarks = 0;

function resizeScratchCard() {
  const bounds = scratchCard.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  scratchCanvas.width = Math.round(bounds.width * scale);
  scratchCanvas.height = Math.round(bounds.height * scale);
  scratchCanvas.style.width = `${bounds.width}px`;
  scratchCanvas.style.height = `${bounds.height}px`;
  scratchContext.setTransform(scale, 0, 0, scale, 0, 0);
  paintScratchSurface(bounds.width, bounds.height);
}

function paintScratchSurface(width, height) {
  const gradient = scratchContext.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#b88d4d");
  gradient.addColorStop(0.45, "#e4c37c");
  gradient.addColorStop(1, "#a9783d");
  scratchContext.globalCompositeOperation = "source-over";
  scratchContext.fillStyle = gradient;
  scratchContext.fillRect(0, 0, width, height);
  scratchContext.fillStyle = "rgba(255, 244, 200, 0.2)";
  for (let i = 0; i < 90; i += 1) {
    scratchContext.beginPath();
    scratchContext.arc(Math.random() * width, Math.random() * height, Math.random() * 1.4, 0, Math.PI * 2);
    scratchContext.fill();
  }
}

function scratchAt(event) {
  if (scratchRevealed) return;
  const bounds = scratchCanvas.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;
  scratchContext.globalCompositeOperation = "destination-out";
  scratchContext.beginPath();
  scratchContext.arc(x, y, 21, 0, Math.PI * 2);
  scratchContext.fill();
  scratchMarks += 1;
  checkScratchProgress();
}

function checkScratchProgress() {
  const pixels = scratchContext.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
  let transparent = 0;
  for (let i = 3; i < pixels.length; i += 32) {
    if (pixels[i] < 80) transparent += 1;
  }
  if (transparent / (pixels.length / 32) > 0.18 || scratchMarks > 55) revealScratchCard();
}

function revealScratchCard() {
  scratchRevealed = true;
  scratchCard.classList.add("is-revealed");
  const symbols = ["✿", "❀", "✦", "✽", "❁", "✧"];
  symbols.forEach((symbol, index) => {
    const flower = document.createElement("span");
    flower.textContent = symbol;
    flower.style.setProperty("--flower-x", `${Math.cos(index) * 120}px`);
    flower.style.setProperty("--flower-y", `${Math.sin(index) * 75}px`);
    flower.style.setProperty("--flower-r", `${index * 45 - 20}deg`);
    flower.style.animationDelay = `${index * 55}ms`;
    scratchCard.querySelector(".flower-burst").appendChild(flower);
  });
}

scratchCanvas.addEventListener("pointerdown", (event) => {
  isScratching = true;
  scratchCanvas.setPointerCapture(event.pointerId);
  scratchAt(event);
});
scratchCanvas.addEventListener("pointermove", (event) => {
  if (isScratching) scratchAt(event);
});
scratchCanvas.addEventListener("pointerup", () => { isScratching = false; });
scratchCanvas.addEventListener("pointercancel", () => { isScratching = false; });
window.addEventListener("resize", resizeScratchCard);
resizeScratchCard();
