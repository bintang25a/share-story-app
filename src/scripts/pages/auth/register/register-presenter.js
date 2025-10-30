import { fullscreenLoaderTemplate } from "../../../template";

export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async getRegisterData({ name, email, password }) {
    document.body.insertAdjacentHTML("beforeend", fullscreenLoaderTemplate());

    try {
      const response = await this.#model.setRegister({
        name,
        email,
        password,
      });

      if (!response.success) {
        console.error("getRegisterData: response:", response);
        this.#view.registeredFailed(response.message);
        return;
      }

      this.#view.registeredSuccessfully(response.message, response.data);
    } catch (error) {
      console.error("getRegisterData: error:", error);
      this.#view.registeredFailed(error.message);
    } finally {
      document.getElementById("fullscreen-loader")?.remove();
    }
  }
}
