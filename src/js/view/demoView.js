import { View } from "./view";
import { HIDDEN_ELEMENT_CLASS_NAME } from "../config/configuration";
import { faderUtility } from "../helpers/helpers";

class DemoView extends View {
    #mapElement;
    #workoutSection;
    #addWorkoutButton;
    #cancelWorkoutFormButton;
    #submitWorkoutFormButton;
    #workoutHTMLForm;


    constructor() {
        super(document.querySelector("#demo-section"));
        this.#mapElement = this._rootElement.querySelector("#map");
        this.#workoutSection = this._rootElement.querySelector(
            "#demo__workout-area"
        );
        this.#addWorkoutButton = this._rootElement.querySelector(
            ".button--add-workout"
        );
        this.#submitWorkoutFormButton = this._rootElement.querySelector(
            ".button--submit-workout-form"
        )
        this.#workoutHTMLForm = this._rootElement.querySelector(
            "#demo__workout-area__workout-form form"
        );
        this.#cancelWorkoutFormButton = this._rootElement.querySelector(
            "#demo__workout-area__workout-form .button--cancel-workout-form"
        );

    }

    addEventHandlerAddWorkoutButton(eventType, callback) {
        this.#addWorkoutButton.addEventListener(eventType, callback);
    }

    addEventHandlerCancelWorkoutFormButton(eventType, callback) {
        this.#cancelWorkoutFormButton.addEventListener(eventType, callback);
    }

    addEventHandlerSubmitWorkoutFormButton(eventType, callback) {
        this.#submitWorkoutFormButton.addEventListener(eventType, callback);
    }

    addEventHandlerSubmitWorkoutForm(callback) {
        this.#workoutHTMLForm.addEventListener("submit", callback);
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
        this.#workoutHTMLForm.querySelector(".input-group--workout-distance small").textContent = text;
    }

    getWorkoutTypeInput(){
        return this.#workoutHTMLForm.querySelector("#workout-type-select");
    }

    getWorkoutDistanceInput(){
        return this.#workoutHTMLForm.querySelector("#workout-distance-input");
    }

    getWorkoutDateInput(){
        return this.#workoutHTMLForm.querySelector("#workout-date-input");
    }

    getWorkoutNoteInput(){
        return this.#workoutHTMLForm.querySelector("#workout-note-input");
    }

}

export default new DemoView();
