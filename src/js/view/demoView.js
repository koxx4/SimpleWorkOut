import { View } from "./view";
import { HIDDEN_ELEMENT_CLASS_NAME } from "../config/configuration";
import { faderUtility } from "../helpers/helpers";

class DemoView extends View {
    #mapElement;
    #workoutSection;
    #addWorkoutButton;
    #cancelWorkoutFormButton;
    #workoutHTMLForm;
    #inputGroups;

    constructor() {
        super(document.querySelector("#demo-section"));
        this.#mapElement = this._rootElement.querySelector("#map");
        this.#workoutSection = this._rootElement.querySelector(
            "#demo__workout-area"
        );
        this.#addWorkoutButton = this._rootElement.querySelector(
            ".button--add-workout"
        );
        this.#workoutHTMLForm = this._rootElement.querySelector(
            "#demo__workout-area__workout-form form"
        );
        this.#cancelWorkoutFormButton = this._rootElement.querySelector(
            "#demo__workout-area__workout-form .button--cancel-form"
        );
        this.#inputGroups = this._rootElement
            .querySelectorAll("#demo__workout-area__workout-form form .input-group");
    }

    addEventHandlerAddWorkoutButton(eventType, callback) {
        this.#addWorkoutButton.addEventListener(eventType, callback);
    }

    addEventHandlerCancelWorkoutFormButton(eventType, callback) {
        this.#cancelWorkoutFormButton.addEventListener(eventType, callback);
    }

    renderWorkoutForm() {
        this.#addWorkoutButton.classList.add(HIDDEN_ELEMENT_CLASS_NAME);
        this.#workoutHTMLForm.classList.remove(HIDDEN_ELEMENT_CLASS_NAME);
        this.#workoutHTMLForm.scrollIntoView({ behavior: "smooth" });
    }

    clearAndHideWorkoutForm() {
        //TODO: clearing form ...
        this.#mapElement.scrollIntoView({ behavior: "smooth" });
        faderUtility.fadeOut(this.#workoutHTMLForm, 600).then(() => {
            this.#addWorkoutButton.classList.remove(HIDDEN_ELEMENT_CLASS_NAME);
        });
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

    setSmallTextWorkoutDistance(text){
        this.#inputGroups.querySelector(".input-group--workout-distance small").textContent = text;
    }

    getInputGroups(){
        return this.#inputGroups;
    }
}

export default new DemoView();
