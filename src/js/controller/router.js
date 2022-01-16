import mainView from "../view/mainView";
import {
    FADE_BETWEEN_PAGE_SECTIONS,
    INITIAL_SECTION_ELEMENT,
    INITIAL_SECTION_ELEMENT_DEBUG,
} from "../config/configuration";
import navigationModel from "../model/navigationModel";

class Router {
    #sectionFocusGainEvent;
    #sectionFocusLoseEvent;
    /**
     *
     * @type {Controller[]}
     */
    #registeredControllers = [];

    constructor() {
        this.#sectionFocusGainEvent = new Event("sectionfocus");
        this.#sectionFocusLoseEvent = new Event("sectionexit");
        this.#registerEventHandlers();
    }

    /**
     *
     * @param{Controller} controller
     */
    registerController(controller) {
        controller.initialize();
        this.#registeredControllers.push(controller);
    }

    async #showAppropriatePageContent() {
        const appropriateView = this.#registeredControllers.find(
            controller => controller.controlledHash === location.hash
        ).view;

        if (appropriateView === undefined) return;

        await this.#switchFromActiveSectionTo(
            appropriateView.rootElement,
            FADE_BETWEEN_PAGE_SECTIONS,
            250
        );
    }

    #registerEventHandlers() {
        window.addEventListener(
            "hashchange",
            this.#showAppropriatePageContent.bind(this)
        );
    }

    async showInitialPage() {
        if (process.env.NODE_ENV === "development")
            await this.#switchFromActiveSectionTo(
                document.querySelector(INITIAL_SECTION_ELEMENT_DEBUG)
            );
        else
            await this.#switchFromActiveSectionTo(
                document.querySelector(INITIAL_SECTION_ELEMENT)
            );
    }

    async #switchFromActiveSectionTo(section, fade = false, fadeDuration = 0) {
        if (navigationModel.activeSection === section) return;

        navigationModel.activeSection.dispatchEvent(
            this.#sectionFocusLoseEvent
        );
        await mainView.hideSection(
            navigationModel.activeSection,
            fade,
            fadeDuration
        );

        section.dispatchEvent(this.#sectionFocusGainEvent);
        await mainView.showSection(section, fade, fadeDuration);

        navigationModel.activeSection = section;
    }
}
export default new Router();
