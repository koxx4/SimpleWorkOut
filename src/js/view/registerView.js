import { View } from "./view";

class RegisterView extends View {
    #registrationForm;

    constructor() {
        super(document.querySelector("#register-section"));
        this.#registrationForm = this._rootElement.querySelector(
            ".register-section__form"
        );
    }

    getRegistrationForm() {
        return this.#registrationForm;
    }

    addEventListenerSubmitRegistration(event, callback) {
        this.#registrationForm.elements["register-submit"].addEventListener(
            event,
            callback
        );
    }

    clearRegistrationForm() {
        this.#registrationForm.reset();
    }

    showRegistrationSuccessfulInfo(msg, callbackOnConfirm) {
        this._rootElement.insertAdjacentHTML(
            "afterbegin",
            `<div class="register-section__register-success success-card m1">
                <h3>Registration successful!</h3>
                <p>${msg ? msg : ""}</p>
                <button class="button button-primary">Super!</button>
            </div>`
        );
        this._rootElement
            .querySelector(".register-section__register-success button")
            .addEventListener(
                "click",
                callbackOnConfirm
                    ? callbackOnConfirm
                    : (e) => this.closeRegistrationSuccessfulInfo()
            );
    }

    showRegistrationFailureInfo(msg, callbackOnConfirm) {
        this._rootElement.insertAdjacentHTML(
            "afterbegin",
            `<div class="register-section__register-failure warning-card m1">
                <h3>Registration failure!</h3>
                <p>${msg ? msg : ""}</p>
                <button class="button button-warning">Uh...</button>
            </div>`
        );
        this._rootElement
            .querySelector(".register-section__register-failure button")
            .addEventListener(
                "click",
                callbackOnConfirm
                    ? callbackOnConfirm
                    : (e) => this.closeRegistrationFailureInfo()
            );
    }

    showRegistrationWarning(msg, callbackOnConfirm) {
        this._rootElement.insertAdjacentHTML(
            "afterbegin",
            `<div class="register-section__register-warning warning-card m1">
                <h3>Please read before registering!</h3>
                <p>${msg ? msg : ""}</p>
                <button class="button button-primary">Okay, I get it!</button>
            </div>`
        );
        this._rootElement
            .querySelector(".register-section__register-warning button")
            .addEventListener(
                "click",
                callbackOnConfirm
                    ? callbackOnConfirm
                    : (e) => this.closeRegistrationWarningInfo()
            );
    }

    closeRegistrationSuccessfulInfo() {
        this._removeElementFromThisView(".register-section__register-success");
    }

    closeRegistrationFailureInfo() {
        this._removeElementFromThisView(".register-section__register-failure");
    }

    closeRegistrationWarningInfo() {
        this._removeElementFromThisView(".register-section__register-warning");
    }
}
export default new RegisterView();
