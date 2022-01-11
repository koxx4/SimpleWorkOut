import { View } from "./view";

class LoginView extends View {
    #loginForm;
    #loginSubmitButton;

    constructor() {
        super(document.querySelector("#login-section"));
        this.#loginForm = this._rootElement.querySelector(
            ".login-section__form"
        );
        this.#loginSubmitButton = this.#loginForm.elements["login-submit"];
    }

    addEventListenerLoginSubmitButton(event, callback) {
        this.#loginSubmitButton.addEventListener(event, callback);
    }

    clearLoginForm() {
        this.#loginForm.reset();
    }

    /**
     *
     * @returns {FormData}
     */
    getLoginFormData() {
        return new FormData(this.#loginForm);
    }
}
export default new LoginView();
