import { View } from "./view";
import { HIDDEN_ELEMENT_CLASS_NAME } from "../config/configuration";

class DemoView extends View {
    #mapElement;
    #workoutSection;
    #addWorkoutButton;
    #workoutForm;

    constructor() {
        super(document.querySelector("#demo-section"));
        this.#mapElement = this._rootElement.querySelector("#map");
        this.#workoutSection = this._rootElement.querySelector(
            "#demo__workout-area"
        );
        this.#addWorkoutButton = this._rootElement.querySelector(
            ".button--add-workout"
        );
        this.#workoutForm = this._rootElement.querySelector(
            "#demo__workout-area__workout-form form"
        );
    }

    addEventHandlerAddWorkoutButton(eventType, callback) {
        this.#addWorkoutButton.addEventListener(eventType, callback);
    }

    renderWorkoutForm() {
        this.#addWorkoutButton.classList.add(HIDDEN_ELEMENT_CLASS_NAME);
        this.#workoutForm.classList.remove(HIDDEN_ELEMENT_CLASS_NAME);
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
        this.#mapElement.querySelector(".loading-card")?.remove();
    }
}

export default new DemoView();
