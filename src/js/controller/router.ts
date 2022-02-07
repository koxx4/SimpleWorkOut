import mainView from "../view/mainView";
import {
    AUTO_LOGIN_IN_DEV,
    FADE_BETWEEN_PAGE_SECTIONS,
    INITIAL_SECTION_DEV,
} from "../config/configuration";
import navigationModel from "../model/navigationModel";
import Controller from "./controller";
import { LoginController } from "./loginController";

class Router {
    private readonly _sectionFocusGainEvent: Event;
    private readonly _sectionFocusLoseEvent: Event;
    private _registeredControllers: Controller[] = [];

    constructor() {
        this._sectionFocusGainEvent = new Event("sectionfocus");
        this._sectionFocusLoseEvent = new Event("sectionexit");
        this.registerEventHandlers();
    }

    registerController(controller: Controller) {
        controller.initialize();
        this._registeredControllers.push(controller);
    }

    private async showAppropriatePageContent() {
        const appropriateView = this._registeredControllers.find(
            controller => controller.controlledHash === location.hash
        ).rootView;

        if (appropriateView === undefined) return;

        await this.switchFromActiveSectionTo(
            appropriateView.rootElement,
            FADE_BETWEEN_PAGE_SECTIONS,
            250
        );
    }

    private registerEventHandlers() {
        window.addEventListener(
            "hashchange",
            this.showAppropriatePageContent.bind(this)
        );
    }

    async showInitialPage() {
        if (process.env.NODE_ENV === "development")
            location.hash = INITIAL_SECTION_DEV;
        else location.hash = "#home";

        if (
            (process.env.NODE_ENV === "development" && AUTO_LOGIN_IN_DEV) ||
            process.env.NODE_ENV !== "development"
        )
            LoginController.tryToAutoLogin().catch(() => {});
    }

    private async switchFromActiveSectionTo(
        section: HTMLElement,
        fade = false,
        fadeDuration = 0
    ) {
        if (
            navigationModel.activeSection === section &&
            !navigationModel.activeSection.classList?.contains("hidden")
        )
            return;

        if (navigationModel.activeSection) {
            navigationModel.activeSection.dispatchEvent(
                this._sectionFocusLoseEvent
            );

            await mainView.hideSection(
                navigationModel.activeSection,
                fade,
                fadeDuration
            );
        }

        section.dispatchEvent(this._sectionFocusGainEvent);
        navigationModel.activeSection = section;

        await mainView.showSection(section, fade, fadeDuration);
    }
}
export default new Router();
