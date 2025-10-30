import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { generateNavbarListTemplate } from "../template";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  async renderPage({ withTransition = true } = {}) {
    const url = getActiveRoute();
    const pageFactory = routes[url];
    const page = pageFactory();

    const route = getActiveRoute();
    const navigationDrawer = document.getElementById("navigation-drawer");
    navigationDrawer.innerHTML = generateNavbarListTemplate(route);

    const renderContent = async () => {
      this.#content.innerHTML = await page.render();
      await page.afterRender();

      // Logout handler
      document
        .getElementById("logout-button")
        ?.addEventListener("click", (e) => {
          setTimeout(() => {
            localStorage.removeItem("loginResult");
            navigationDrawer.innerHTML = generateNavbarListTemplate(route);
            window.location.hash = "#/login";
          }, 500);
        });
    };

    // Hanya jalankan transisi jika bukan refresh pertama
    if (withTransition && document.startViewTransition) {
      document.startViewTransition(renderContent);
    } else {
      await renderContent();
    }
  }
}

export default App;
