import { INITIAL_SECTION_ELEMENT } from "../config/configuration";

class NavigationModel {
    #activeSection;

    constructor(initialSection) {
        this.#activeSection = initialSection;
    }

    set activeSection(value) {
        this.#activeSection = value;
    }

    get activeSection() {
        return this.#activeSection;
    }
}
export default new NavigationModel(
    document.querySelector(INITIAL_SECTION_ELEMENT)
);
