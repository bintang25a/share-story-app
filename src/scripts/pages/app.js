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

  async renderPage() {
    const url = getActiveRoute();
    const pageFactory = routes[url];
    const page = pageFactory();

    const route = getActiveRoute();
    const navigationDrawer = document.getElementById("navigation-drawer");
    navigationDrawer.innerHTML = generateNavbarListTemplate(route);

    this.#content.classList.add("page-exit");
    await new Promise((resolve) => setTimeout(resolve, 200));

    this.#content.classList.remove("page-exit");
    this.#content.innerHTML = await page.render();
    await page.afterRender();

    this.#content.classList.add("page-enter");

    requestAnimationFrame(() => {
      this.#content.classList.add("page-enter-active");
      this.#content.classList.remove("page-enter");
    });

    setTimeout(() => {
      this.#content.classList.remove("page-enter-active");
    }, 200);

    document.getElementById("logout-button")?.addEventListener("click", () => {
      setTimeout(() => {
        localStorage.removeItem("loginResult");
        navigationDrawer.innerHTML = generateNavbarListTemplate(route);
        window.location.hash = "#/login";
      }, 500);
    });
  }
}

export default App;
