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

    showRegistrationErrorInfo(msg, callbackOnConfirm) {
        this._rootElement.insertAdjacentHTML(
            "afterbegin",
            `<div class="login-section__login-error error-card m1">
                <h3>There were some errors while logging in!</h3>
                <p>${msg ? msg : ""}</p>
                <button class="button button-primary">Okay</button>
            </div>`
        );

        this._rootElement
            .querySelector(".login-section__login-error button")
            .addEventListener(
                "click",
                callbackOnConfirm
                    ? callbackOnConfirm
                    : (e) => this.closeLoginErrorInfo()
            );
    }

    closeLoginErrorInfo() {
        this._removeElementFromThisView(".login-section__login-error");
    }
}
export default new LoginView();
