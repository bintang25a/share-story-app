import * as ShareStoryAPI from "../../data/api.js";
import HomePresenter from "./home-presenter.js";
import Map from "../../utils/map.js";
import Database from "../../data/database.js";

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section class="map">
        <div class="reports-list__map__container">
          <div id="map" class="reports-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>

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
    this.#presenter = new HomePresenter({
      view: this,
      model: ShareStoryAPI,
      dbModel: Database,
    });
    await this.#presenter.initialGalleryAndMap();
  }

  async initialMap() {
    this.#map = await Map.build("#map", { zoom: 5, locate: true });
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
        </div>
        <button class="detail-button" data-id="${story.id}">
          Save this
        </button>
      `;

      const button = card.querySelector(".detail-button");

      if (await this.#presenter.isStorySaved(story.id)) {
        button.textContent = "Saved";
        button.disabled = true;
      }

      button.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        const saved = await this.#presenter.saveStory(id);

        if (saved) {
          button.textContent = "Saved";
          button.disabled = true;
        }
      });

      container.appendChild(card);
    }

    await this.addMarkersToMap(stories);
  }

  async populateReportsListError(errorMessage) {
    const container = document.querySelector("#reports-list");

    if (container) {
      container.innerHTML = `<p class="error">${errorMessage}</p>`;
    }
  }

  async addMarkersToMap(stories) {
    if (!this.#map) {
      await this.initialMap();
    }

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const popupContent = `
          <strong>${story.name}</strong><br/>
          ${story.description}<br/>
          <img src="${story.photoUrl}" alt="${story.name}" width="100" />
        `;

        this.#map.addMarker(
          [story.lat, story.lon],
          {},
          { content: popupContent }
        );
      }
    });
  }
}
