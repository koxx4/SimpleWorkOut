import "regenerator-runtime";
import "core-js";
import "font-awesome/css/font-awesome.min.css";
import "leaflet/dist/leaflet.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import router from "./controller/router";
import homeController from "./controller/homeController";
import loginController from "./controller/loginController";
import profileController from "./controller/profileController";
import registerController from "./controller/registerController";
import workoutsController from "./controller/workoutsController";

router.registerController(homeController);
router.registerController(workoutsController);
router.registerController(loginController);
router.registerController(profileController);
router.registerController(registerController);

router.showInitialPage();
