import { View } from "./view";
import { createAlertCard } from "../helpers/helpers";

class LoginView extends View {
    #loginForm;
    #loginSubmitButton;

    constructor() {
        super(document.querySelector("#login-section"));
        this.#loginForm = this.rootElement.querySelector(
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

    showLoginErrorInfo(msg, callbackOnConfirm) {
        this.rootElement.insertAdjacentElement(
            "afterbegin",
            createAlertCard(
                "There were some errors while logging in!",
                msg,
                "error",
                callbackOnConfirm
            )
        );
    }

    closeAnyLoginErrorInfo() {
        this.removeAllElementsFromThisView(".error-card");
    }
}
export default new LoginView();
