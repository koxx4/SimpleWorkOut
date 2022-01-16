import Controller from "./controller";
import homeView from "../view/homeView";

class HomeController extends Controller {
    constructor() {
        super("#home", homeView);
    }

    initialize() {}
}
export default new HomeController();
