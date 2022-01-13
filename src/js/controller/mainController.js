import mainView from "../view/mainView";
import {
    FADE_BETWEEN_PAGE_SECTIONS,
    INITIAL_SECTION_ELEMENT,
    INITIAL_SECTION_ELEMENT_DEBUG,
} from "../config/configuration";
import navigationModel from "../model/navigationModel";
import demoView from "../view/demoView";
import loginView from "../view/loginView";
import registerView from "../view/registerView";
import profileView from "../view/profileView";
import homeView from "../view/homeView";

class MainController {
    #sectionFocusGainEvent;
    #sectionFocusLoseEvent;

    constructor() {
        this.#sectionFocusGainEvent = new Event("sectionfocus");
        this.#sectionFocusLoseEvent = new Event("sectionexit");
    }

    async #showAppropriatePageContent() {
        switch (location.hash) {
            case "#home":
                await this.#switchFromActiveSectionTo(
                    homeView.rootElement,
                    FADE_BETWEEN_PAGE_SECTIONS,
                    250
                );
                break;
            case "#demo":
                await this.#switchFromActiveSectionTo(
                    demoView.rootElement,
                    FADE_BETWEEN_PAGE_SECTIONS,
                    250
                );
                break;
            case "#login":
                await this.#switchFromActiveSectionTo(
                    loginView.rootElement,
                    FADE_BETWEEN_PAGE_SECTIONS,
                    250
                );
                break;
            case "#register":
                await this.#switchFromActiveSectionTo(
                    registerView.rootElement,
                    FADE_BETWEEN_PAGE_SECTIONS,
                    250
                );
                break;
            case "#profile-overview":
                await this.#switchFromActiveSectionTo(
                    profileView.rootElement,
                    FADE_BETWEEN_PAGE_SECTIONS,
                    250
                );
                break;
            default:
                break;
        }
    }

    registerEventHandlers() {
        window.addEventListener(
            "hashchange",
            this.#showAppropriatePageContent.bind(this)
        );
    }

    showInitialPage() {
        if (process.env.NODE_ENV === "development")
            this.#switchFromActiveSectionTo(
                document.querySelector(INITIAL_SECTION_ELEMENT_DEBUG)
            );
        else
            this.#switchFromActiveSectionTo(
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
export default new MainController();
