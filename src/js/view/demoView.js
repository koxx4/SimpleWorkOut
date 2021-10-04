import { View } from "./view";
import { HIDDEN_ELEMENT_CLASS_NAME } from "../config/configuration";
import { faderUtility } from "../helpers/helpers";
import { retina } from "leaflet/src/core/Browser";

class DemoView extends View {
    #mapElement;
    #workoutSection;
    #addWorkoutButton;
    #cancelWorkoutFormButton;
    #submitWorkoutFormButton;
    #workoutHTMLForm;
    #workoutEntryList;
    #workoutHistoryArea;

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
        );
        this.#workoutHTMLForm = this._rootElement.querySelector(
            "#demo__workout-area__workout-form form"
        );
        this.#cancelWorkoutFormButton = this._rootElement.querySelector(
            "#demo__workout-area__workout-form .button--cancel-workout-form"
        );
        this.#workoutEntryList = this._rootElement.querySelector(
            ".workout-history-list"
        );
        this.#workoutHistoryArea = this._rootElement.querySelector(
            "#demo__workout-area__workout-history"
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

    addEventHandlerWorkoutList(eventType, callback) {
        this.#workoutEntryList.addEventListener(eventType, callback, false);
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

    setSmallTextWorkoutDistance(text) {
        this.#workoutHTMLForm.querySelector(
            ".input-group--workout-distance small"
        ).textContent = text;
    }

    getWorkoutTypeInput() {
        return this.#workoutHTMLForm.querySelector("#workout-type-select");
    }

    getWorkoutDistanceInput() {
        return this.#workoutHTMLForm.querySelector("#workout-distance-input");
    }

    getWorkoutDateInput() {
        return this.#workoutHTMLForm.querySelector("#workout-date-input");
    }

    getWorkoutNoteInput() {
        return this.#workoutHTMLForm.querySelector("#workout-note-input");
    }

    #generateWorkoutEntryMarkup(workoutEntry) {
        //Convert m to km
        const distance =
            workoutEntry.distance >= 1000
                ? (workoutEntry.distance / 1000).toFixed(3) + " km"
                : workoutEntry.distance + " m";

        return `
            <li data-workout-id="${workoutEntry.id}" class="workout-history-list__entry">                   
                <p>${workoutEntry.type} on ${workoutEntry.date}. Total of ${distance}.</p>
                <button value="show" class="button--show-workout-on-map">Show on map</button>
                <button value="delete" class="button--delete-workout-entry">Delete entry</button>
                <button value="note" class="button--delete-workout-note">Show note</button>
                <p class="workout-history-list__entry-note ${HIDDEN_ELEMENT_CLASS_NAME}">${workoutEntry.notes}</p>
            </li>`;
    }

    renderWorkoutEntries(workoutEntries) {
        if (!workoutEntries.length) {
            this.#workoutEntryList.innerHTML = "";
            this.hideWorkoutHistoryArea();
        } else {
            const workoutEntryMarkups = [];
            workoutEntries.forEach((entry) => {
                workoutEntryMarkups.push(
                    this.#generateWorkoutEntryMarkup(entry)
                );
            });
            this.#workoutEntryList.innerHTML = "";
            this.#workoutEntryList.insertAdjacentHTML(
                "afterbegin",
                workoutEntryMarkups.join("")
            );
            this.showWorkoutHistoryArea();
        }
    }

    hideWorkoutHistoryArea() {
        this.#workoutHistoryArea.classList.add(HIDDEN_ELEMENT_CLASS_NAME);
    }

    showWorkoutHistoryArea() {
        this.#workoutHistoryArea.classList.remove(HIDDEN_ELEMENT_CLASS_NAME);
    }

    toggleWorkoutEntryNote(id) {
        const workoutEntryHTMLElement = this.#workoutEntryList.querySelector(
            `.workout-history-list__entry[data-workout-id="${id}"]`
        );
        const noteElement = workoutEntryHTMLElement.querySelector(
            ".workout-history-list__entry-note"
        );

        if (noteElement.classList.contains(HIDDEN_ELEMENT_CLASS_NAME)) {
            faderUtility.fadeIn(noteElement, 600);
        } else {
            faderUtility.fadeOut(noteElement, 600);
        }
    }
}

export default new DemoView();
