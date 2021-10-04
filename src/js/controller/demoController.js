import demoView from "../view/demoView";
import mainView from "../view/mainView";
import { LeafletMap } from "../helpers/leafletMap";
import { LEAFLET_CONFIG } from "../config/configuration";
import { WorkoutEntry } from "../data/workoutEntry";
import demoModel from "../model/demoModel";

class DemoController {
    /**
     *
     * @type {LeafletMap}
     * @private
     */
    #leafletMap = new LeafletMap(LEAFLET_CONFIG);
    #isUserAddingNewWorkout = false;
    #userWorkoutTrail;
    #userWorkoutTrailDistance = 0;

    constructor() {
        demoView.renderWorkoutEntries(demoModel.getWorkoutEntries());
    }

    #createLeafletMap() {
        this.#leafletMap.initialize().then((msg) => {
            demoView.deleteMapLoadingIcon();
            this.#leafletMap.refreshMap();
            this.#registerMapEventHandlers();
        });
    }

    #startWorkoutForm(event) {
        event.preventDefault();
        demoView.renderWorkoutForm();
        this.#isUserAddingNewWorkout = true;
    }

    #exitWorkoutForm(event) {
        event.preventDefault();
        demoView.clearAndHideWorkoutForm();
        this.#isUserAddingNewWorkout = false;
        this.#deleteUserWorkoutTrail();
        this.#userWorkoutTrailDistance = 0;
    }

    #submitWorkout(event) {
        event.preventDefault();
        const newWorkoutEntry = this.#constructWorkoutEntry();
        demoModel.addWorkoutEntry(newWorkoutEntry);
        demoView.renderWorkoutEntries(demoModel.getWorkoutEntries());
        this.#exitWorkoutForm(event);
    }

    #constructWorkoutEntry() {
        let workoutType = demoView.getWorkoutTypeInput().value;
        let workoutDistance = demoView.getWorkoutDistanceInput().value;
        let workoutDate = demoView.getWorkoutDateInput().value;
        let workoutNote = demoView.getWorkoutNoteInput().value;

        workoutDistance =
            workoutDistance > 0
                ? workoutDistance
                : this.#userWorkoutTrailDistance;
        workoutDate = workoutDate ? workoutDate : "some beautiful day";

        return new WorkoutEntry(
            workoutType,
            workoutDistance,
            workoutDate,
            workoutNote,
            this.#userWorkoutTrail
        );
    }

    registerEventHandlers() {
        demoView.addEventHandlerAddWorkoutButton(
            "click",
            this.#startWorkoutForm.bind(this)
        );

        demoView.addEventHandlerCancelWorkoutFormButton(
            "click",
            this.#exitWorkoutForm.bind(this)
        );

        demoView.addEventHandlerSubmitWorkoutForm(
            this.#submitWorkout.bind(this)
        );

        demoView.addEventHandlerWorkoutList(
            "click",
            this.#handleWorkoutEntryInteraction.bind(this)
        );

        mainView.addEventHandlerOnDemoSectionLoad(() => {
            if (!this.#leafletMap.isInitialized()) {
                demoView.renderMapLoadingIcon();
                this.#createLeafletMap();
            }
        });

        mainView.addEventHandlerOnDemoSectionExit(() => {
            demoView.deleteMapLoadingIcon();
        });
    }

    #registerMapEventHandlers() {
        this.#leafletMap.addEventHandlerOnMapClick((event) => {
            if (this.#isUserAddingNewWorkout) {
                if (!this.#userWorkoutTrail) {
                    this.#createNewUserWorkoutTrail(event.latlng);
                }
                this.#userWorkoutTrail.addLatLng(event.latlng);
                this.#updateTrailDistance();
            }
        });
    }

    #createNewUserWorkoutTrail(latlng) {
        const { lat, lng } = latlng;
        this.#userWorkoutTrail = this.#leafletMap.createNewLine([[lat, lng]], {
            color: "red",
        });
    }

    #deleteUserWorkoutTrail() {
        this.#leafletMap.deleteLine(this.#userWorkoutTrail);
        this.#userWorkoutTrail = null;
    }

    #updateTrailDistance() {
        this.#userWorkoutTrailDistance = Math.round(
            this.#leafletMap.lineDistance(this.#userWorkoutTrail)
        );
        const text = `${this.#userWorkoutTrailDistance} meters calculated`;
        demoView.setSmallTextWorkoutDistance(text);
    }

    #handleWorkoutEntryInteraction(event) {
        const targetButtonValue = event.target.value;
        const targetWorkoutEntryID =
            event.target.parentElement.dataset.workoutId;
        switch (targetButtonValue) {
            case "show":
                this.#showWorkoutEntryOnMap(targetWorkoutEntryID);
                break;
            case "delete":
                this.#deleteWorkoutEntry(targetWorkoutEntryID);
                break;
            case "note":
                this.#showWorkoutEntryNote(targetWorkoutEntryID);
                break;
        }
    }

    #deleteWorkoutEntry(workoutID) {
        demoModel.deleteWorkoutEntryByID(workoutID);
        demoView.renderWorkoutEntries(demoModel.getWorkoutEntries());
    }

    #showWorkoutEntryOnMap(workoutID) {}

    #showWorkoutEntryNote(workoutID) {
        const workout = demoModel.getWorkoutEntryByID(workoutID);
        if (workout) demoView.toggleWorkoutEntryNote(workoutID);
    }
}
export default new DemoController();
