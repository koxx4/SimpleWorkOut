import mainView from "../view/mainView";
import {
    FADE_BETWEEN_PAGE_SECTIONS,
    INITIAL_PAGE_POSITION,
    INITIAL_PAGE_POSITION_DEBUG,
} from "../config/configuration";

class MainController {
    constructor() {}

    #showAppropriatePageContent() {
        switch (location.hash) {
            case "#home":
                debugger;
                mainView.switchViewToHomeSection(
                    FADE_BETWEEN_PAGE_SECTIONS,
                    250
                );
                break;
            case "#demo":
                mainView.switchViewToDemoSection(
                    FADE_BETWEEN_PAGE_SECTIONS,
                    250
                );
                break;
            case "#login":
                mainView.switchViewToLoginPage(FADE_BETWEEN_PAGE_SECTIONS, 250);
                break;
            case "#register":
                mainView.switchViewToRegistrationPage(
                    FADE_BETWEEN_PAGE_SECTIONS,
                    250
                );
                break;
        }
    }

    registerEventHandlers() {
        window.addEventListener("hashchange", this.#showAppropriatePageContent);
    }

    showInitialPage() {
        if (process.env.NODE_ENV === "development")
            location.hash = INITIAL_PAGE_POSITION_DEBUG;
        else location.hash = INITIAL_PAGE_POSITION;
    }
}
export default new MainController();
