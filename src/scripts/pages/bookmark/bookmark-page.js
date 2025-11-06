import BookmarkPresenter from "./bookmark-presenter.js";
import Database from "../../data/database.js";

export default class BookmarkPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <h1 class="section-title">Bookmark story</h1>

        <div class="reports-list__container">
          <div id="reports-list"></div>
          <div id="reports-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });
    await this.#presenter.initialGalleryAndMap();
  }

  async populateReportsList(stories) {
    const container = document.querySelector("#reports-list");
    container.innerHTML = "";

    for (const story of stories) {
      const card = document.createElement("div");
      card.className = "report-card";
      card.innerHTML = `
        <img src="${story.photoUrl}" alt="${story.name}" />
        <div class="text-container">
          <h2>${story.name}</h2>
          <p>${story.description}</p>
          <small>${story.createdAt}</small>
        </div href="/detail/${story.id}">
        <button class="detail-button" data-id="${story.id}">
          Saved
        </button>
      `;

      const button = card.querySelector(".detail-button");

      button.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        const deleted = await this.#presenter.removeStory(id);

        if (deleted) {
          await this.#presenter.initialGalleryAndMap();
        }
      });

      container.appendChild(card);
    }
  }

  async populateReportsListError(errorMessage) {
    const container = document.querySelector("#reports-list");

    if (container) {
      container.innerHTML = `<p class="error">${errorMessage}</p>`;
    }
  }
}
