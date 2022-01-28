import { View } from "./view";
import { faderUtility } from "../helpers/helpers";
import { HIDDEN_ELEMENT_CLASS_NAME } from "../config/configuration";

class MainView extends View {
    private _homeButton;
    private _demoButton;
    private _loginButton;
    private _myProfileButton;

    constructor() {
        super(document.querySelector("body"));
        this._homeButton = this.rootElement.querySelector("#nav__button-home");
        this._demoButton = this.rootElement.querySelector("#nav__button-demo");
        this._loginButton =
            this.rootElement.querySelector("#nav__button-login");
        this._myProfileButton = this.rootElement.querySelector(
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
        return this.hideSection(this._myProfileButton, fade, 250);
    }

    showProfileButton(fade) {
        return this.showSection(this._myProfileButton, fade, 250);
    }

    hideLoginButton(fade) {
        return this.hideSection(this._loginButton, fade, 250);
    }

    showLoginButton(fade) {
        return this.showSection(this._loginButton, fade, 250);
    }

    showDemoButton(fade) {
        return this.showSection(this._demoButton, fade, 250);
    }

    hideDemoButton(fade) {
        return this.hideSection(this._demoButton, fade, 250);
    }
}
export default new MainView();
