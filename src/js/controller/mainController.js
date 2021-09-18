import mainView from "../view/mainView";
import {
    IS_FADE_ANIMATION_ACTIVE,
    INITIAL_PAGE_POSITION,
} from "../config/configuration";

let userPagePosition = INITIAL_PAGE_POSITION;

const homePageButtonAction = function () {
    if (userPagePosition === "home") return;

    mainView.renderHomePage(IS_FADE_ANIMATION_ACTIVE);
    userPagePosition = "home";
};

const demoPageButtonAction = function () {
    if (userPagePosition === "demo") return;

    mainView.renderDemoPage(IS_FADE_ANIMATION_ACTIVE);
    userPagePosition = "demo";
};

const registerEventHandlers = function () {
    mainView.addEventHandlerHomeButton("click", homePageButtonAction);
    mainView.addEventHandlerDemoButton("click", demoPageButtonAction);
};

const showInitialPage = function () {
    debugger;
    switch (INITIAL_PAGE_POSITION) {
        case "demo":
            mainView.renderDemoPage(IS_FADE_ANIMATION_ACTIVE);
            break;
        case "home":
            mainView.renderHomePage(IS_FADE_ANIMATION_ACTIVE);
            break;
        case "login":
            mainView.renderLoginPage(IS_FADE_ANIMATION_ACTIVE);
            break;
    }
};

registerEventHandlers();
showInitialPage();
