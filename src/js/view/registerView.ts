import { View } from "./view";
import { createAlertCard } from "../helpers/helpers";

class RegisterView extends View {
    readonly registrationForm: HTMLFormElement;

    constructor() {
        super(document.querySelector("#register-section"));
        this.registrationForm = this.rootElement.querySelector(
            ".register-section__form"
        );
    }

    addEventListenerSubmitRegistration(event, callback) {
        this.registrationForm.elements["register-submit"].addEventListener(
            event,
            callback
        );
    }

    clearRegistrationForm() {
        this.registrationForm.reset();
    }

    showRegistrationSuccessfulInfo(
        msg: string,
        callbackOnConfirm?: (e: MouseEvent) => any
    ) {
        this.rootElement.insertAdjacentElement(
            "afterbegin",
            createAlertCard(
                "Registration successful!",
                msg,
                "success",
                null,
                "registration-success"
            )
        );
    }

    showRegistrationFailureInfo(
        msg: string,
        callbackOnConfirm?: (e: MouseEvent) => any
    ) {
        this.rootElement.insertAdjacentElement(
            "afterbegin",
            createAlertCard(
                "Registration failure!",
                msg,
                "error",
                null,
                "registration-failure"
            )
        );
    }

    showRegistrationWarning(
        msg: string,
        callbackOnConfirm?: (e: MouseEvent) => any
    ) {
        this.rootElement.insertAdjacentElement(
            "afterbegin",
            createAlertCard(
                "Please read before registering!",
                msg,
                "warning",
                null,
                "registration-warning"
            )
        );
    }

    closeRegistrationSuccessfulInfo() {
        this.removeAllElementsFromThisView(".registration-success");
    }

    closeRegistrationFailureInfo() {
        this.removeAllElementsFromThisView(".registration-failure");
    }

    closeRegistrationWarningInfo() {
        this.removeAllElementsFromThisView(".registration-warning");
    }
}
export default new RegisterView();
