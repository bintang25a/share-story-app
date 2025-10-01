import * as ShareStoryAPI from "../../../data/api.js";
import RegisterPresenter from "./register-presenter.js";

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section>
        <div class="login-container">
          <form id="register-form" class="register-form">
            <div class="input-container">
              <label for="name-input">Name</label>
              <input type="text" id="name-input" required>
            </div>

            <div class="input-container">
              <label for="email-input">Email</label>
              <input type="text" id="email-input" required>
            </div>

            <div class="input-container">
              <label for="password-input">Password</label>
              <input type="password" id="password-input" required>
            </div>

            <div class="input-container">
              <button>Submit form</button>
            </div>
          </form>

          <span>Already have account? <a href="#/login">Login here</a></span>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: ShareStoryAPI,
    });

    this.#setupForm();
  }

  #setupForm() {
    document
      .getElementById("register-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
          name: document.getElementById("name-input").value,
          email: document.getElementById("email-input").value,
          password: document.getElementById("password-input").value,
        };

        await this.#presenter.getRegisterData(data);
      });
  }

  registeredSuccessfully(message) {
    console.log(message);

    location.hash = "/login";
  }

  registeredFailed(message) {
    alert(message);
  }
}
