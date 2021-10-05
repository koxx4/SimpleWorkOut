import { View } from "./view";
import { faderUtility } from "../helpers/helpers";
import {
    HIDDEN_ELEMENT_CLASS_NAME,
    INITIAL_PAGE_POSITION,
} from "../config/configuration";

class MainView extends View {
    #homeButton;
    #demoButton;
    #loginButton;
    #homeSection;
    #demoSection;
    #loginSection;
    #sectionLoadEvent = new Event("sectionload");
    #sectionExitEvent = new Event("sectionexit");
    #lastPagePosition;

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
        this.#homeSection.addEventListener("sectionload", callback);
    }

    addEventHandlerOnDemoSectionLoad(callback) {
        this.#demoSection.addEventListener("sectionload", callback);
    }

    addEventHandlerOnLoginSectionLoad(callback) {
        this.#loginSection.addEventListener("sectionload", callback);
    }

    addEventHandlerOnHomeSectionExit(callback) {
        this.#homeSection.addEventListener("sectionexit", callback);
    }

    addEventHandlerOnDemoSectionExit(callback) {
        this.#demoSection.addEventListener("sectionexit", callback);
    }

    addEventHandlerOnLoginSectionExit(callback) {
        this.#loginSection.addEventListener("sectionexit", callback);
    }

    #dispatchSectionExitEvents() {
        switch (this.#lastPagePosition) {
            case "#home":
                this.#homeSection.dispatchEvent(this.#sectionExitEvent);
                break;
            case "#demo":
                this.#demoSection.dispatchEvent(this.#sectionExitEvent);
                break;
            case "#login":
                this.#loginSection.dispatchEvent(this.#sectionExitEvent);
                break;
        }
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
        this.#dispatchSectionExitEvents();
        this.#lastPagePosition = location.hash;
    }

    renderHomePage(fadeTransition) {
        if (fadeTransition) {
            faderUtility
                .fadeOut(this.#demoSection, 600)
                .then(() => faderUtility.fadeIn(this.#homeSection, 600));
        } else {
            this.#demoSection.classList.add(HIDDEN_ELEMENT_CLASS_NAME);
            this.#homeSection.classList.remove(HIDDEN_ELEMENT_CLASS_NAME);
        }
        this.#homeSection.dispatchEvent(this.#sectionLoadEvent);
        this.#dispatchSectionExitEvents();
        this.#lastPagePosition = location.hash;
    }

    renderLoginPage(fadeTransition) {}

    _generateChangedHTML(data) {
        return "";
    }
}

export default new MainView();
