import { View } from "./view";

class DemoView extends View {
    #mapElement;
    #workoutSection;

    constructor() {
        super(document.querySelector("#demo-section"));
        this.#mapElement = this._rootElement.querySelector("#map");
        this.#workoutSection = this._rootElement.querySelector(
            "#demo__workout-area"
        );
    }

    renderMapLoadingIcon() {
        this.#mapElement.insertAdjacentHTML(
            "afterbegin",
            `<div class="loading-card m1">
                        <p>Loading...</p>       
                        <div class='loading-spinner m1'></div>
                  </div>`
        );
    }

    deleteMapLoadingIcon() {
        while (this.#mapElement.firstChild) {
            this.#mapElement.removeChild(this.#mapElement.lastChild);
        }
    }
}

export default new DemoView();
