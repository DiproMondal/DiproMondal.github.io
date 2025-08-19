document.getElementById("theme-toggle")?.addEventListener("click", () => {
  const root = document.documentElement;
  const theme = root.getAttribute("data-theme");
  root.setAttribute("data-theme", theme === "dark" ? "light" : "dark");
  localStorage.setItem("theme", root.getAttribute("data-theme"));
});

document.getElementById("year").textContent = new Date().getFullYear();

window.onload = () => {
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
};
