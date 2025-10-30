import * as ShareStoryAPI from "../../data/api.js";
import HomePresenter from "./home-presenter.js";
import Map from "../../utils/map.js";

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
    });
    await this.#presenter.initialGalleryAndMap();
  }

  async initialMap() {
    this.#map = await Map.build("#map", { zoom: 5, locate: true });
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
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <small>${story.createdAt}</small>
        </div href="/detail/${story.id}">
        <a class="detail-button" href="/detail/${story.id}">
          Go to Detail
        </a>
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
