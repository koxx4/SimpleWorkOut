import { View } from "./view";

class HomeView extends View {
    constructor() {
        super(document.querySelector("#home-section"));
    }
}
export default new HomeView();
