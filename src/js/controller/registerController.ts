import registerView from "../view/registerView";
import { REGISTRATION_ENDPOINT } from "../config/configuration";
import Controller from "./controller";

class RegisterController extends Controller {
    private _isSecurityWarningShown: boolean;

    constructor() {
        super("#register", registerView);
        this._isSecurityWarningShown = false;
    }

    initialize() {
        registerView.addEventListenerSubmitRegistration("click", event => {
            event.preventDefault();
            this.registerUserUsingFormData();
        });

        registerView.registrationForm.addEventListener("mouseenter", () => {
            if (this._isSecurityWarningShown) return;

            registerView.showRegistrationWarning(
                `For now, this service is still under active development, and it still may
        have serious security bugs. Because of that, it is strongly recommended
        that you don't provide real info about your workout paths
        or use a password that you can already be using in other accounts!`
            );
            this._isSecurityWarningShown = true;
        });
    }

    private registerUserUsingFormData() {
        const inputs = registerView.registrationForm.elements;

        const usrBody = new FormData();
        usrBody.append("username", inputs["username"].value);
        usrBody.append("email", inputs["email"].value);
        usrBody.append("password", inputs["password"].value);

        const abortController = new AbortController();
        const timeout = setTimeout(() => {
            abortController.abort();
            registerView.showRegistrationFailureInfo("Timed out");
        }, 5000);

        fetch(REGISTRATION_ENDPOINT, {
            method: "POST",
            body: usrBody,
            mode: "cors",
            signal: abortController.signal,
        }).then(response => {
            if (response.ok) {
                registerView.showRegistrationSuccessfulInfo(
                    `Hello, ${usrBody.get(
                        "username"
                    )}. You're now registered and you can login at any time`
                );
                registerView.clearRegistrationForm();
            } else
                registerView.showRegistrationFailureInfo(
                    "Something went wrong while registering you chef... maybe try again later?"
                );
        });
    }
}
export default new RegisterController();
