"use strict";

const progress = document.querySelector(".scroll-progress");
const revealElements = document.querySelectorAll(".reveal");
const music = document.querySelector("#wedding-music");
const musicToggle = document.querySelector(".music-toggle");
const musicLabel = document.querySelector(".music-label");

const updateMusicButton = (isPlaying) => {
  musicToggle.classList.toggle("is-playing", isPlaying);
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute("aria-label", isPlaying ? "Pause wedding music" : "Play wedding music");
  musicLabel.textContent = isPlaying ? "Music on" : "Play music";
};

const playMusic = () => {
  music.play()
    .then(() => updateMusicButton(true))
    .catch(() => updateMusicButton(false));
};

musicToggle.addEventListener("click", () => {
  if (music.paused) {
    playMusic();
  } else {
    music.pause();
    updateMusicButton(false);
  }
});

window.addEventListener("load", playMusic, { once: true });
document.addEventListener("pointerdown", (event) => {
  if (event.target !== musicToggle && !musicToggle.contains(event.target)) {
    playMusic();
  }
}, { once: true });

const updateProgress = () => {
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${pageHeight > 0 ? (window.scrollY / pageHeight) * 100 : 0}%`;
};

const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.16 }
);

revealElements.forEach((element) => observer.observe(element));
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();
