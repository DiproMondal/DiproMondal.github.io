// Theme toggle
document.getElementById("theme-toggle")?.addEventListener("click", () => {
  const root = document.documentElement;
  const theme = root.getAttribute("data-theme");
  root.setAttribute("data-theme", theme === "dark" ? "light" : "dark");
  localStorage.setItem("theme", root.getAttribute("data-theme"));
});

console.log("main.js loaded ✅");

// Insert year in footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Restore saved theme
const saved = localStorage.getItem("theme");
if (saved) document.documentElement.setAttribute("data-theme", saved);

// Attach toggle listeners
document.querySelectorAll(".cv-toggle").forEach(toggle => {
  toggle.addEventListener("click", () => {
    const card = toggle.closest(".cv-item");
    card.classList.toggle("open");
  });
});
