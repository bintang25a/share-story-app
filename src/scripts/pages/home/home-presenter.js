export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showReportsListMap() {
    // try {
    //   await this.#view.initialMap();
    // } catch (error) {
    //   console.error("showReportsListMap: error:", error);
    // }
  }

  async initialGalleryAndMap() {
    try {
      await this.showReportsListMap();

      const response = await this.#model.getStories();
      console.log(response);

      if (!response.ok) {
        console.error("initialGalleryAndMap: response:", response);
        // this.#view.populateReportsListError(response.message);
        return;
      }

      this.#view.populateReportsList(response.message, response.data);
    } catch (error) {
      console.error("initialGalleryAndMap: error:", error);
      this.#view.populateReportsListError(error.message);
    }
  }
}
