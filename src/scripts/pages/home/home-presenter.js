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
    try {
      await this.showReportsListMap();

      const stories = await this.#model.getStories();

      if (!stories || stories.length === 0) {
        this.#view.populateReportsListError("Tidak ada cerita ditemukan.");
        return;
      }

      this.#view.populateReportsList("Stories fetched successfully", stories);
    } catch (error) {
      console.error("initialGalleryAndMap: error:", error);
      this.#view.populateReportsListError(error.message);
    }
  }
}
