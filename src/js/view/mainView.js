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
    #registerSection;
    #sectionLoadEvent = new Event("sectionload");
    #sectionExitEvent = new Event("sectionexit");
    #lastPagePosition;

    constructor() {
        super(document.querySelector("body"));
        this.#lastPagePosition = location.hash;
        this.#homeButton = this._rootElement.querySelector("#nav__button-home");
        this.#demoButton = this._rootElement.querySelector("#nav__button-demo");
        this.#loginButton =
            this._rootElement.querySelector("#nav__button-login");
        this.#demoSection = this._rootElement.querySelector("#demo-section");
        this.#homeSection = this._rootElement.querySelector("#home-section");
        this.#loginSection = this._rootElement.querySelector("#login-section");
        this.#registerSection =
            this._rootElement.querySelector("#register-section");
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
        this.getLastActiveSection().dispatchEvent(this.#sectionExitEvent);
    }

    async switchViewToDemoSection(fadeActive = false, duration) {
        await this.hideLastActiveSection(fadeActive, duration);
        if (fadeActive) await faderUtility.fadeIn(this.#demoSection, duration);
        else this.#demoSection.classList.remove(HIDDEN_ELEMENT_CLASS_NAME);
        this.#dispatchSectionEventsAndUpdateLastPagePosition();
    }

    async switchViewToHomeSection(fadeActive = false, duration) {
        await this.hideLastActiveSection(fadeActive, duration);
        if (fadeActive) await faderUtility.fadeIn(this.#homeSection, duration);
        else this.#homeSection.classList.remove(HIDDEN_ELEMENT_CLASS_NAME);
        this.#dispatchSectionEventsAndUpdateLastPagePosition();
    }

    async switchViewToLoginPage(fadeActive = false, duration) {
        await this.hideLastActiveSection(fadeActive, duration);
        if (fadeActive) await faderUtility.fadeIn(this.#loginSection, duration);
        else this.#loginSection.classList.remove(HIDDEN_ELEMENT_CLASS_NAME);
        this.#dispatchSectionEventsAndUpdateLastPagePosition();
    }

    async switchViewToRegistrationPage(fadeActive = false, duration) {
        await this.hideLastActiveSection(fadeActive, duration);
        if (fadeActive)
            await faderUtility.fadeIn(this.#registerSection, duration);
        else this.#registerSection.classList.remove(HIDDEN_ELEMENT_CLASS_NAME);
        this.#dispatchSectionEventsAndUpdateLastPagePosition();
    }

    async hideLastActiveSection(fadeActive = false, duration) {
        const activeSection = this.getLastActiveSection();
        if (fadeActive)
            await faderUtility.fadeOut(this.getLastActiveSection(), duration);
        else activeSection.classList.add(HIDDEN_ELEMENT_CLASS_NAME);
    }

    getLastActiveSection() {
        switch (this.#lastPagePosition) {
            case "#home":
                return this.#homeSection;
            case "#demo":
                return this.#demoSection;
            case "#login":
                return this.#loginSection;
            case "#register":
                return this.#registerSection;
        }
    }

    getActiveSection() {
        switch (location.hash) {
            case "#home":
                return this.#homeSection;
            case "#demo":
                return this.#demoSection;
            case "#login":
                return this.#loginSection;
            case "#register":
                return this.#registerSection;
        }
    }

    #dispatchSectionEventsAndUpdateLastPagePosition() {
        this.getActiveSection().dispatchEvent(this.#sectionLoadEvent);
        this.#dispatchSectionExitEvents();
        this.#lastPagePosition = location.hash;
    }

    _generateChangedHTML(data) {
        return "";
    }
}

export default new MainView();
