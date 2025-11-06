import { loaderCircleTemplate } from "../../template";

export default class BookmarkPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async initialGalleryAndMap() {
    const loadingContainer = document.getElementById(
      "reports-list-loading-container"
    );

    try {
      loadingContainer.innerHTML = loaderCircleTemplate();

      const stories = await this.#model.getAllReports();

      if (!stories || stories.length === 0) {
        this.#view.populateReportsListError(
          "Tidak ada cerita ditemukan pada bookmark."
        );
        return;
      }

      this.#view.populateReportsList(stories);
    } catch (error) {
      console.error("initialGalleryAndMap: error:", error);
      this.#view.populateReportsListError(error.message);
    } finally {
      loadingContainer.innerHTML = "";
    }
  }

  async removeStory(storyId) {
    try {
      await this.#model.removeReport(storyId);
      alert("Success to remove from bookmark");

      return true;
    } catch (error) {
      console.error("removeReport: error:", error);
      this.#view.populateReportsListError(error.message);

      return false;
    }
  }
}
