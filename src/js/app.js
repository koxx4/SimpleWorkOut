import mainController from "./controller/mainController";
import demoController from "./controller/demoController";
import "regenerator-runtime";
import "core-js";

mainController.registerEventHandlers();
demoController.registerEventHandlers();

mainController.showInitialPage();
