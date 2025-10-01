// CSS imports
import "../styles/styles.css";

import App from "./pages/app";
import { navbarList } from "./template.js";

document.addEventListener("DOMContentLoaded", async () => {
  navbarList();

  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });
  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });
});
