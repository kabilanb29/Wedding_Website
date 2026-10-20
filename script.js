"use strict";

const progress = document.querySelector(".scroll-progress");
const revealElements = document.querySelectorAll(".reveal");
const music = document.querySelector("#wedding-music");
const welcomeScreen = document.querySelector(".welcome-screen");
const openInvitation = document.querySelector(".open-invitation");
const scratchCard = document.querySelector(".scratch-card");
const scratchCanvas = document.querySelector(".scratch-surface");
const scratchContext = scratchCanvas.getContext("2d");
let scratching = false;
let scratchAmount = 0;

const playMusic = () => {
  music.play()
    .catch(() => {});
};

const sizeScratchCard = () => {
  const bounds = scratchCard.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  scratchCanvas.width = bounds.width * scale;
  scratchCanvas.height = bounds.height * scale;
  scratchCanvas.style.width = `${bounds.width}px`;
  scratchCanvas.style.height = `${bounds.height}px`;
  scratchContext.setTransform(scale, 0, 0, scale, 0, 0);
  scratchContext.fillStyle = "#a17a2b";
  scratchContext.fillRect(0, 0, bounds.width, bounds.height);
  scratchContext.fillStyle = "#d5ad5e";
  scratchContext.font = "600 10px Cinzel, serif";
  scratchContext.textAlign = "center";
  scratchContext.fillText("SCRATCH HERE", bounds.width / 2, bounds.height / 2 + 4);
};

const createScratchEffect = (x, y) => {
  const sparkle = document.createElement("span");
  sparkle.className = "scratch-sparkle";
  sparkle.textContent = Math.random() > .5 ? "✦" : "✧";
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  scratchCard.append(sparkle);
  window.setTimeout(() => sparkle.remove(), 850);
};

const createFlowerEffect = () => {
  const flower = document.createElement("span");
  flower.className = "scratch-flower";
  flower.textContent = Math.random() > .5 ? "✿" : "❀";
  flower.style.left = `${Math.random() * 100}%`;
  flower.style.animationDelay = `${Math.random() * .25}s`;
  scratchCard.append(flower);
  window.setTimeout(() => flower.remove(), 1800);
};

const scratch = (event) => {
  if (!scratching) return;
  const bounds = scratchCanvas.getBoundingClientRect();
  const point = event.touches ? event.touches[0] : event;
  const x = point.clientX - bounds.left;
  const y = point.clientY - bounds.top;
  scratchContext.globalCompositeOperation = "destination-out";
  scratchContext.beginPath();
  scratchContext.arc(x, y, 18, 0, Math.PI * 2);
  scratchContext.fill();
  scratchAmount += 1;
  if (scratchAmount % 3 === 0) {
    createScratchEffect(x, y);
    createFlowerEffect();
  }
  if (scratchAmount > 28) {
    scratchCard.classList.add("revealed");
    scratchContext.clearRect(0, 0, bounds.width, bounds.height);
  }
};

scratchCanvas.addEventListener("pointerdown", (event) => {
  scratching = true;
  scratchCanvas.setPointerCapture(event.pointerId);
  scratch(event);
});
scratchCanvas.addEventListener("pointermove", scratch);
scratchCanvas.addEventListener("pointerup", () => { scratching = false; });
scratchCanvas.addEventListener("pointercancel", () => { scratching = false; });
window.addEventListener("resize", sizeScratchCard);
sizeScratchCard();

openInvitation.addEventListener("click", () => {
  playMusic();
  document.body.classList.add("invitation-open");
  welcomeScreen.remove();
});

document.addEventListener("pointerdown", (event) => {
  if (document.body.classList.contains("invitation-open")) {
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

const scrollHero = document.querySelector(".scroll-hero");
const brideWrapper = document.querySelector(".bride-wrapper");
const groomWrapper = document.querySelector(".groom-wrapper");
const finalWrapper = document.querySelector(".final-wrapper");
let scrollHeroMedia;

const initScrollHero = () => {
  if (!scrollHero || !brideWrapper || !groomWrapper || !finalWrapper) return;

  gsap.registerPlugin(ScrollTrigger);
  scrollHeroMedia = gsap.matchMedia();

  scrollHeroMedia.add("(max-width: 700px)", () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([brideWrapper, groomWrapper], { xPercent: 0 });
      gsap.set(finalWrapper, { opacity: 1 });
      return;
    }

    gsap.set(brideWrapper, { xPercent: -100 });
    gsap.set(groomWrapper, { xPercent: 100 });

    gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: scrollHero,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true
      }
    })
      .to([brideWrapper, groomWrapper], {
        xPercent: 0,
        duration: 0.62
      })
      .to(finalWrapper, {
        opacity: 1,
        duration: 0.28
      }, 0.66);
  });
};

if (window.gsap && window.ScrollTrigger) {
  initScrollHero();
} else {
  console.error("The scroll hero could not initialize because GSAP or ScrollTrigger failed to load.");
}

openInvitation.addEventListener("click", () => {
  window.requestAnimationFrame(() => {
    if (scrollHeroMedia && window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  });
});
