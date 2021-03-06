import { View } from "./view";
import {
    HIDDEN_ELEMENT_CLASS_NAME,
    WORKOUT_ENTRY_DATE_FORMAT,
} from "../config/configuration";
import {
    createLoadingSpinnerElement,
    faderUtility,
    metersToKilometersFormatted,
    showModal,
} from "../helpers/helpers";
import WorkoutEntry from "../data/workoutEntry";
import { DomUtil } from "leaflet";
import remove = DomUtil.remove;

export class WorkoutsView extends View {
    private _mapElement;
    private _workoutSection;
    private _addWorkoutButton;
    private _cancelWorkoutFormButton;
    private _submitWorkoutFormButton;
    private _workoutHTMLForm: HTMLFormElement;
    private _workoutEntryList: HTMLElement;
    private _workoutHistoryArea;
    private _workoutTrailHint;

    constructor() {
        super(document.querySelector("#workouts-section"));
        this._mapElement = this.rootElement.querySelector("#map");
        this._workoutSection = this.rootElement.querySelector(
            "#workouts__workout-area"
        );
        this._addWorkoutButton = this.rootElement.querySelector(
            ".button--add-workout"
        );
        this._submitWorkoutFormButton = this.rootElement.querySelector(
            ".button--submit-workout-form"
        );
        this._workoutHTMLForm = this.rootElement.querySelector(
            "#workouts__workout-area__workout-form form"
        );
        this._cancelWorkoutFormButton = this.rootElement.querySelector(
            "#workouts__workout-area__workout-form .button--cancel-workout-form"
        );
        this._workoutEntryList = this.rootElement.querySelector(
            ".workout-history-list"
        );
        this._workoutHistoryArea = this.rootElement.querySelector(
            "#workouts__workout-area__workout-history"
        );
        this._workoutTrailHint = this.rootElement.querySelector(
            ".workouts__workout-area__workout-form__trail-hint"
        );
    }

    addEventHandlerAddWorkoutButton(eventType, callback) {
        this._addWorkoutButton.addEventListener(eventType, callback);
    }

    addEventHandlerCancelWorkoutFormButton(eventType, callback) {
        this._cancelWorkoutFormButton.addEventListener(eventType, callback);
    }

    addEventHandlerSubmitWorkoutFormButton(eventType, callback) {
        this._submitWorkoutFormButton.addEventListener(eventType, callback);
    }

    addEventHandlerSubmitWorkoutForm(callback) {
        this._workoutHTMLForm.addEventListener("submit", callback);
    }

    addEventHandlerWorkoutList(eventType, callback) {
        this._workoutEntryList.addEventListener(eventType, callback, false);
    }

    renderWorkoutForm() {
        this._addWorkoutButton.classList.add(HIDDEN_ELEMENT_CLASS_NAME);
        this._workoutHTMLForm.classList.remove(HIDDEN_ELEMENT_CLASS_NAME);
        this._workoutHTMLForm.scrollIntoView({ behavior: "smooth" });
    }

    hideWorkoutForm() {
        this._mapElement.scrollIntoView({ behavior: "smooth" });
        faderUtility.fadeOut(this._workoutHTMLForm, 600).then(() => {
            this._addWorkoutButton.classList.remove(HIDDEN_ELEMENT_CLASS_NAME);
        });
    }

    showNoPathSavedInfo() {
        showModal("Nope", "No trail was saved for this workout!");
    }

    scrollToMap() {
        this._mapElement.scrollIntoView({ behavior: "smooth" });
    }

    renderMapLoadingIcon() {
        this._mapElement.insertAdjacentHTML(
            "afterbegin",
            `<div class="loading-card m1">
                        <p>Loading...</p>       
                        <div class='loading-spinner m1'></div>
                  </div>`
        );
    }

    deleteMapLoadingIcon() {
        this._mapElement.querySelector(".loading-card")?.remove();
    }

    setSmallTextWorkoutDistance(text) {
        this._workoutHTMLForm.querySelector(
            ".input-group--workout-distance small"
        ).textContent = text;
    }

    getWorkoutForm() {
        return this._workoutHTMLForm;
    }

    private generateWorkoutEntryMarkup(
        workoutEntry: WorkoutEntry,
        id: string | number
    ) {
        const formattedDate = workoutEntry.date.toLocaleString(
            undefined,
            WORKOUT_ENTRY_DATE_FORMAT
        );
        return `
            <li data-workout-id="${id}" class="workout-history-list__entry">                   
                <p>${
                    workoutEntry.type
                } on ${formattedDate}. Total of ${metersToKilometersFormatted(
            workoutEntry.distance,
            3
        )}.</p>
                <button value="show" class="button--show-workout-on-map">Show on map</button>
                <button value="delete" class="button--delete-workout-entry">Delete entry</button>
                <button value="note" class="button--delete-workout-note">Show note</button>
                <p class="workout-history-list__entry-note ${HIDDEN_ELEMENT_CLASS_NAME}">${
            workoutEntry.notes
        }</p>
            </li>`;
    }

    clearAllWorkoutEntries() {
        this._workoutEntryList.innerHTML = "";
    }

    renderWorkoutEntry(workoutEntry) {
        this.renderWorkoutEntries(Array.of(workoutEntry));
    }

    renderWorkoutEntries(workoutEntries) {
        if (!workoutEntries.length) {
            this._workoutEntryList.innerHTML = "";
            this.hideWorkoutHistoryArea();
        } else {
            const workoutEntryMarkups = [];
            workoutEntries.forEach(entry => {
                workoutEntryMarkups.push(
                    this.generateWorkoutEntryMarkup(entry, entry.localID)
                );
            });
            this._workoutEntryList.insertAdjacentHTML(
                "afterbegin",
                workoutEntryMarkups.join("")
            );
            this.showWorkoutHistoryArea();
        }
    }

    hideWorkoutHistoryArea() {
        this._workoutHistoryArea.classList.add(HIDDEN_ELEMENT_CLASS_NAME);
    }

    showWorkoutHistoryArea() {
        this._workoutHistoryArea.classList.remove(HIDDEN_ELEMENT_CLASS_NAME);
    }

    toggleWorkoutEntryNote(localId) {
        const workoutEntryHTMLElement = this.getWorkoutEntry(localId);
        const noteElement = workoutEntryHTMLElement.querySelector(
            ".workout-history-list__entry-note"
        );

        if (noteElement.classList.contains(HIDDEN_ELEMENT_CLASS_NAME)) {
            faderUtility.fadeIn(noteElement, 600);
        } else {
            faderUtility.fadeOut(noteElement, 600);
        }
    }

    addLoadingSpinnerToWorkoutEntry(localId: string) {
        const entry = this.getWorkoutEntry(localId);
        if (!entry) return;

        entry.insertAdjacentElement(
            "afterbegin",
            createLoadingSpinnerElement()
        );
    }

    showWorkoutSubmitRetryButton(localId: string) {
        const buttonAlreadyExists =
            this.getWorkoutEntry(localId).querySelector(
                `button[value="submit-retry"]`
            ) !== null;

        if (buttonAlreadyExists) return;

        this.getWorkoutEntry(localId)
            .querySelector("button")
            .insertAdjacentHTML(
                "beforebegin",
                `<button value="submit-retry" class="button--delete-workout-note">Retry saving</button>`
            );
    }

    hideWorkoutSubmitRetryButton(localId: string) {
        this.getWorkoutEntry(localId)
            .querySelector(`button[value="submit-retry"]`)
            ?.remove();
    }

    private getWorkoutEntry(localId: string): HTMLElement | null {
        return this._workoutEntryList.querySelector(
            `.workout-history-list__entry[data-workout-id="${localId}"]`
        );
    }

    addStatusToWorkoutEntry(localId: string, status: string, color = "green") {
        const entry = this.getWorkoutEntry(localId);
        if (!entry) return;

        entry.insertAdjacentHTML(
            "afterbegin",
            `<p class="m1 workout-status" style="color: ${color}"><i>${status}</i></p>`
        );
    }

    removeStatusFromWorkoutEntry(localId: string) {
        const entry = this.getWorkoutEntry(localId)
            .querySelector(".workout-status")
            ?.remove();
    }

    removeLoadingSpinnerFromWorkoutEntry(localID: string) {
        const entry = this._workoutEntryList
            .querySelector(
                `.workout-history-list__entry[data-workout-id="${localID}"] .loading-spinner`
            )
            ?.remove();
    }

    hideTrailDrawingHint() {
        this._workoutTrailHint.classList.add(HIDDEN_ELEMENT_CLASS_NAME);
    }

    showTrailDrawingHint() {
        this._workoutTrailHint.classList.remove(HIDDEN_ELEMENT_CLASS_NAME);
    }
}

export const workoutsView = new WorkoutsView();
