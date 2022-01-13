import { View } from "./view";

class ProfileView extends View {
    constructor() {
        super(document.querySelector("#profile-overview-section"));
    }
}

export default new ProfileView();
