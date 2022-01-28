import mainView from "../view/mainView";
import {
    FADE_BETWEEN_PAGE_SECTIONS,
    INITIAL_SECTION,
    INITIAL_SECTION_DEBUG,
} from "../config/configuration";
import navigationModel from "../model/navigationModel";
import Controller from "./controller";

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
            location.hash = INITIAL_SECTION_DEBUG;
        else location.hash = INITIAL_SECTION;
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
