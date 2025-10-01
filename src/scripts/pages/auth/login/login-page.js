import * as ShareStoryAPI from "../../../data/api.js";
import LoginPresenter from "./login-presenter.js";

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
      <section>
        <div class="login-container">
          <form id="login-form" class="login-form">
            <div class="input-container">
              <label for="email-input">Email</label>
              <input type="text" id="email-input" required>
            </div>

            <div class="input-container">
              <label for="password-input">Password</label>
              <input type="password" id="password-input" required>
            </div>

            <div class="input-container">
              <button>Login</button>
            </div>
          </form>

          <span>Dont have account? <a href="#/register">Register here</a></span>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: ShareStoryAPI,
    });

    this.#setupForm();
  }

  #setupForm() {
    document
      .getElementById("login-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
          email: document.getElementById("email-input").value,
          password: document.getElementById("password-input").value,
        };

        await this.#presenter.getLoginData(data);
      });
  }

  loginSuccessfully(message) {
    console.log(message);

    location.hash = "/";
  }

  loginFailed(message) {
    alert(message);
  }
}
