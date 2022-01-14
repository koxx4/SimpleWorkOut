import { View } from "./view";
import { faderUtility } from "../helpers/helpers";
import { HIDDEN_ELEMENT_CLASS_NAME } from "../config/configuration";

class MainView extends View {
    #homeButton;
    #demoButton;
    #loginButton;
    #myProfileButton;

    constructor() {
        super(document.querySelector("body"));
        this.#homeButton = this.rootElement.querySelector("#nav__button-home");
        this.#demoButton = this.rootElement.querySelector("#nav__button-demo");
        this.#loginButton =
            this.rootElement.querySelector("#nav__button-login");
        this.#myProfileButton = this.rootElement.querySelector(
            "#nav__button-profile"
        );
    }

    showSection(section, fadeActive = false, duration) {
        if (fadeActive) return faderUtility.fadeIn(section, duration);
        else section.classList.remove(HIDDEN_ELEMENT_CLASS_NAME);
    }

    hideSection(section, fadeActive = false, duration) {
        if (fadeActive) return faderUtility.fadeOut(section, duration);
        else section.classList.add(HIDDEN_ELEMENT_CLASS_NAME);
    }

    hideProfileButton(fade) {
        return this.hideSection(this.#myProfileButton, fade, 250);
    }

    showProfileButton(fade) {
        return this.showSection(this.#myProfileButton, fade, 250);
    }
}
export default new MainView();
