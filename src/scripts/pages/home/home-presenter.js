import { loaderCircleTemplate } from "../../template";

export default class HomePresenter {
  #view;
  #model;
  #dbModel;

  constructor({ view, model, dbModel }) {
    this.#view = view;
    this.#model = model;
    this.#dbModel = dbModel;
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

  async saveStory(storyId) {
    try {
      const report = await this.#model.getDetailStory(storyId);
      await this.#dbModel.putReport(report);

      alert("Berhasil menyimpan ke bookmark!");

      return true;
    } catch (error) {
      console.error("saveStory: error:", error);
      this.#view.populateReportsListError(error.message);

      return false;
    }
  }

  async isStorySaved(storyId) {
    return !!(await this.#dbModel.getReportById(storyId));
  }
}
