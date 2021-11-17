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
                mainView.renderHomePage(FADE_BETWEEN_PAGE_SECTIONS);
                break;
            case "#demo":
                mainView.renderDemoPage(FADE_BETWEEN_PAGE_SECTIONS);
                break;
            case "#login":
                mainView.renderLoginPage(FADE_BETWEEN_PAGE_SECTIONS);
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
