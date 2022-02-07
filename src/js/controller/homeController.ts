import Controller from "./controller";
import homeView from "../view/homeView";
import realUserModel from "../model/realUserModel";
import { fetchAndConvertAppUserData } from "../helpers/helpers";
import { AUTO_LOGIN_IN_DEV } from "../config/configuration";

class HomeController extends Controller {
    constructor() {
        super("#home", homeView);
    }

    initialize() {}
}
export default new HomeController();
