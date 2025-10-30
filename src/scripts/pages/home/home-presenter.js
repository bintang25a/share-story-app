import { loaderCircleTemplate } from "../../template";

export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showReportsListMap() {
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error("showReportsListMap: error:", error);
    }
  }

  async initialGalleryAndMap() {
    const loadingContainer = document.getElementById(
      "reports-list-loading-container"
    );
    const mapLoadingContainer = document.getElementById(
      "map-loading-container"
    );

    try {
      loadingContainer.innerHTML = loaderCircleTemplate();
      mapLoadingContainer.innerHTML = loaderCircleTemplate();

      await this.showReportsListMap();

      const stories = await this.#model.getStories();

      if (!stories || stories.length === 0) {
        this.#view.populateReportsListError("Tidak ada cerita ditemukan.");
        return;
      }

      this.#view.populateReportsList(stories);
    } catch (error) {
      console.error("initialGalleryAndMap: error:", error);
      this.#view.populateReportsListError(error.message);
    } finally {
      loadingContainer.innerHTML = "";
      mapLoadingContainer.innerHTML = "";
    }
  }
}
