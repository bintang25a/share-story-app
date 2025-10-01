import * as ShareStoryAPI from "../../data/api.js";
import HomePresenter from "./home-presenter";
import Map from "../../utils/map";

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section>
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
    this.#presenter = new HomePresenter({ view: this, model: ShareStoryAPI });

    // await this.#presenter.initialGalleryAndMap();
  }

  async showStoryCard() {}

  async initialMap() {
    this.#map = await Map.build("#map", { zoom: 10, locate: true });
  }
}
