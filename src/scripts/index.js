import "../styles/styles.css";
import "leaflet/dist/leaflet.css";

import App from "./pages/app";
import { registerServiceWorker } from "./utils";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.bundle.js");
  }

  console.log("Berhasil mendaftarkan service worker.");

  await app.renderPage({ withTransition: false });

  window.addEventListener("hashchange", async () => {
    await app.renderPage({ withTransition: true });
  });
});
