import mainController from "./controller/mainController";
import demoController from "./controller/demoController";
import "regenerator-runtime";
import "core-js";
import "font-awesome/css/font-awesome.min.css";
import "leaflet/dist/leaflet.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import loginController from "./controller/loginController";

mainController.registerEventHandlers();
demoController.registerEventHandlers();
loginController.registerEventHandlers();

mainController.showInitialPage();
