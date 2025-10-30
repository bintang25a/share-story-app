import { fullscreenLoaderTemplate } from "../../template";

export default class AddStoryPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async sendStoryData(formData) {
    document.body.insertAdjacentHTML("beforeend", fullscreenLoaderTemplate());

    try {
      const description = formData.get("description");
      const photo = formData.get("photo");
      const lat = formData.get("lat");
      const lon = formData.get("lon");

      const response = await this.#model.setStory({
        description,
        photo,
        lat,
        lon,
      });

      if (!response || response.error) {
        console.error("sendStoryData: response:", response);
        this.#view.addStoryFailed(response.message || "Terjadi kesalahan.");
        return;
      }

      this.#view.addStorySuccessfully(
        response.message || "Berhasil menambahkan cerita!"
      );
    } catch (error) {
      console.error("sendStoryData: error:", error);
      this.#view.addStoryFailed(error.message);
    } finally {
      document.getElementById("fullscreen-loader")?.remove();
    }
  }
}
