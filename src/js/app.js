import "regenerator-runtime";
import "core-js";
import "font-awesome/css/font-awesome.min.css";
import "leaflet/dist/leaflet.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import router from "./controller/router";
import homeController from "./controller/homeController";
import demoController from "./controller/demoController";
import loginController from "./controller/loginController";
import profileController from "./controller/profileController";
import registerController from "./controller/registerController";

router.registerController(homeController);
router.registerController(demoController);
router.registerController(loginController);
router.registerController(profileController);
router.registerController(registerController);

router.showInitialPage();
