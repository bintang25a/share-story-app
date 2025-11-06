import * as ShareStoryAPI from "../../data/api.js";
import BookmarkPresenter from "./bookmark-presenter.js";
import Database from "../../data/database.js";

export default class BookmarkPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <h1 class="section-title">Daftar Cerita Orang-orang</h1>

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
      model: ShareStoryAPI,
      dbModel: Database,
    });
    await this.#presenter.initialGalleryAndMap();
  }

  async populateReportsList(stories) {
    const container = document.querySelector("#reports-list");
    container.innerHTML = "";

    stories.forEach((story) => {
      const card = document.createElement("div");
      card.className = "report-card";
      card.innerHTML = `
        <img src="${story.photoUrl}" alt="${story.name}" />
        <div class="text-container">
          <h2>${story.name}</h2>
          <p>${story.description}</p>
          <small>${story.createdAt}</small>
        </div href="/detail/${story.id}">
        <button id="report-detail-save" class="detail-button">
          Save this
        </button>
      `;
      container.appendChild(card);
    });

    await this.addMarkersToMap(stories);
  }

  async populateReportsListError(errorMessage) {
    const container = document.querySelector("#reports-list");

    if (container) {
      container.innerHTML = `<p class="error">${errorMessage}</p>`;
    }
  }

  saveButton() {
    const button = document.getElementById("report-detail-save");

    button.addEventListener("click", async (e) => {
      await this.#presenter.saveReport();
      await this.#presenter.showSaveButton();
    });
  }
}
