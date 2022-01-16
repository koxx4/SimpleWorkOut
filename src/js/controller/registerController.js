import registerView from "../view/registerView";
import { REGISTRATION_ENDPOINT } from "../config/configuration";
import Controller from "./controller";

class RegisterController extends Controller {
    #isSecurityWarningShown;

    constructor() {
        super("#register", registerView);
        this.#isSecurityWarningShown = false;
    }

    initialize() {
        this.view.addEventListenerSubmitRegistration("click", event => {
            event.preventDefault();
            this.#registerUserUsingFormData();
        });

        this.view.registrationForm.addEventListener("mouseenter", () => {
            if (this.#isSecurityWarningShown) return;

            this.view.showRegistrationWarning(
                `For now, this service is still under active development, and it still may
        have serious security bugs. Because of that, it is strongly recommended
        that you don't provide real info about your workout paths
        or use a password that you can already be using in other accounts!`
            );
            this.#isSecurityWarningShown = true;
        });
    }

    #registerUserUsingFormData() {
        const inputs = this.view.registrationForm.elements;

        const usrBody = new FormData();
        usrBody.append("username", inputs["username"].value);
        usrBody.append("email", inputs["email"].value);
        usrBody.append("password", inputs["password"].value);

        fetch(REGISTRATION_ENDPOINT, {
            method: "POST",
            body: usrBody,
            mode: "cors",
        }).then(response => {
            if (response.ok) {
                this.view.showRegistrationSuccessfulInfo(
                    `Hello, ${usrBody.get(
                        "username"
                    )}. You're now registered and you can login at any time`
                );
                this.view.clearRegistrationForm();
            } else
                this.view.showRegistrationFailureInfo(
                    "Something went wrong while registering you chef... maybe try again later?"
                );
        });
    }
}
export default new RegisterController();
