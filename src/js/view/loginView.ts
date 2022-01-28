import { View } from "./view";
import { createAlertCard } from "../helpers/helpers";

class LoginView extends View {
    private _loginForm;
    private _loginSubmitButton;

    constructor() {
        super(document.querySelector("#login-section"));
        this._loginForm = this.rootElement.querySelector(
            ".login-section__form"
        );
        this._loginSubmitButton = this._loginForm.elements["login-submit"];
    }

    addEventListenerLoginSubmitButton(event, callback) {
        this._loginSubmitButton.addEventListener(event, callback);
    }

    clearLoginForm() {
        this._loginForm.reset();
    }

    getLoginFormData(): FormData {
        return new FormData(this._loginForm);
    }

    showLoginErrorInfo(
        msg: string,
        callbackOnConfirm?: (e: MouseEvent) => any
    ) {
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
