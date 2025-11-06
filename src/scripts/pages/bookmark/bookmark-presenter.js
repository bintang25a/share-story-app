import { loaderCircleTemplate } from "../../template";

export default class BookmarkPresenter {
  #view;
  #model;
  #dbModel;
  #reportId;

  constructor({ view, model, dbModel }, reportId) {
    this.#view = view;
    this.#model = model;
    this.#dbModel = dbModel;
    this.#reportId = reportId;
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

  async saveReport() {
    try {
      const report = await this.#model.getDetailStory(this.#reportId);
      await this.#dbModel.putReport(report.data);
      this.#view.saveToBookmarkSuccessfully("Success to save to bookmark");
    } catch (error) {
      console.error("saveReport: error:", error);
      this.#view.saveToBookmarkFailed(error.message);
    }
  }

  async showSaveButton() {
    if (await this.#isReportSaved()) {
      this.#view.removeButton();
      return;
    }
    this.#view.saveButton();
  }
  async #isReportSaved() {
    return !!(await this.#dbModel.getReportById(this.#reportId));
  }
}
