import mainView from "../view/mainView";
import {
    IS_FADE_ANIMATION_ACTIVE,
    INITIAL_PAGE_POSITION,
} from "../config/configuration";

class MainController {
    constructor() {}

    #homeButtonAction() {
        if (location.hash === "#home") return;
        location.hash = "#home";
    }

    #demoButtonAction() {
        if (location.hash === "#demo") return;
        location.hash = "#demo";
    }

    #loginButtonAction() {
        if (location.hash === "#login") return;
        location.hash = "#login";
    }

    #showAppropriatePageContent() {
        switch (location.hash) {
            case "#home":
                mainView.renderHomePage(IS_FADE_ANIMATION_ACTIVE);
                break;
            case "#demo":
                mainView.renderDemoPage(IS_FADE_ANIMATION_ACTIVE);
                break;
            case "#login":
                mainView.renderLoginPage(IS_FADE_ANIMATION_ACTIVE);
                break;
        }
    }

    registerEventHandlers() {
        mainView.addEventHandlerHomeButton("click", this.#homeButtonAction);
        mainView.addEventHandlerDemoButton("click", this.#demoButtonAction);
        mainView.addEventHandlerLoginButton("click", this.#loginButtonAction);
        window.addEventListener("hashchange", this.#showAppropriatePageContent);
    }

    showInitialPage() {
        location.hash = INITIAL_PAGE_POSITION;
    }
}
export default new MainController();
