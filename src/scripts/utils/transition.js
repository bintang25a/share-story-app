export function fadeIn(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.style.opacity = 0;
  el.style.transition = "opacity 0.5s ease";
  requestAnimationFrame(() => {
    el.style.opacity = 1;
  });
}

export function fadeOut(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.style.transition = "opacity 0.5s ease";
  el.style.opacity = 0;
}
