import { View } from "./view";
import { faderUtility } from "../helpers/helpers";
import { HIDDEN_ELEMENT_CLASS_NAME } from "../config/configuration";

class MainView extends View {
    #homeButton;
    #demoButton;
    #loginButton;
    #homeSection;
    #demoSection;
    #sectionLoadEvent = new Event("sectionLoadEvent");

    constructor() {
        super(document.querySelector("body"));
        this.#homeButton = this._rootElement.querySelector("#nav__button-home");
        this.#demoButton = this._rootElement.querySelector("#nav__button-demo");
        this.#loginButton =
            this._rootElement.querySelector("#nav__button-login");
        this.#demoSection = this._rootElement.querySelector("#demo-section");
        this.#homeSection = this._rootElement.querySelector("#home-section");
    }

    addEventHandlerHomeButton(eventType, callback) {
        this.#homeButton.addEventListener(eventType, callback);
    }
    addEventHandlerDemoButton(eventType, callback) {
        this.#demoButton.addEventListener(eventType, callback);
    }
    addEventHandlerLoginButton(eventType, callback) {
        this.#loginButton.addEventListener(eventType, callback);
    }

    addEventHandlerOnHomeSectionLoad(callback) {
        this.#homeSection.addEventListener("sectionLoadEvent", callback);
    }

    addEventHandlerOnDemoSectionLoad(callback) {
        this.#demoSection.addEventListener("sectionLoadEvent", callback);
    }

    renderDemoPage(fadeTransition) {
        if (fadeTransition) {
            faderUtility
                .fadeOut(this.#homeSection, 600)
                .then(() => faderUtility.fadeIn(this.#demoSection, 600));
        } else {
            this.#demoSection.classList.remove(HIDDEN_ELEMENT_CLASS_NAME);
            this.#homeSection.classList.add(HIDDEN_ELEMENT_CLASS_NAME);
        }
        this.#demoSection.dispatchEvent(this.#sectionLoadEvent);
    }

    renderHomePage(fadeTransition) {
        if (fadeTransition) {
            faderUtility
                .fadeOut(this._demoSection, 600)
                .then(() =>
                    faderUtility.fadeIn(this._presentationSection, 600)
                );
        } else {
            this.#demoSection.classList.add(HIDDEN_ELEMENT_CLASS_NAME);
            this.#homeSection.classList.remove(HIDDEN_ELEMENT_CLASS_NAME);
        }
        this.#homeSection.dispatchEvent(this.#sectionLoadEvent);
    }

    renderLoginPage(fadeTransition) {}

    _generateChangedHTML(data) {
        return "";
    }
}

export default new MainView();
