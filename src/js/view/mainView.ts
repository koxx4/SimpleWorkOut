import { View } from "./view";
import { faderUtility } from "../helpers/helpers";
import { HIDDEN_ELEMENT_CLASS_NAME } from "../config/configuration";

class MainView extends View {
    private _homeButton: HTMLElement;
    private _demoButton: HTMLElement;
    private _loginButton: HTMLElement;
    private _myProfileButton: HTMLElement;
    private _hamburgerButton: HTMLElement;
    private _hamburgerMenuShown = false;

    constructor() {
        super(document.querySelector("body"));
        this._homeButton = this.rootElement.querySelector("#nav__button-home");
        this._demoButton = this.rootElement.querySelector("#nav__button-demo");
        this._loginButton =
            this.rootElement.querySelector("#nav__button-login");
        this._myProfileButton = this.rootElement.querySelector(
            "#nav__button-profile"
        );
        this._hamburgerButton = document.querySelector("#nav__hamburger");

        this._hamburgerButton.addEventListener("click", e => {
            e.preventDefault();
            const navMenu: HTMLElement = document.querySelector(
                ".app-bar__nav__menu"
            );
            if (this._hamburgerMenuShown) {
                navMenu.style.flexBasis = "15em";
                this._hamburgerButton.innerHTML = "Menu &uArr;";
            } else {
                navMenu.style.flexBasis = "0";
                this._hamburgerButton.innerHTML = "Menu &dArr;";
            }
            this._hamburgerMenuShown = !this._hamburgerMenuShown;
        });
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
