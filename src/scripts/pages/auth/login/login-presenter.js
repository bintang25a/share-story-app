export default class LoginPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async getLoginData({ email, password }) {
    try {
      const response = await this.#model.setLogin({
        email,
        password,
      });

      if (!response.success) {
        console.error("getLoginData: response:", response);
        this.#view.loginFailed(response.message);
        return;
      }

      this.#view.loginSuccessfully(response.message, response.data);
    } catch (error) {
      console.error("getLoginData: error:", error);
      this.#view.loginFailed(error.message);
    }
  }
}
