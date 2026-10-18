"use strict";

const progress = document.querySelector(".scroll-progress");
const revealElements = document.querySelectorAll(".reveal");

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
