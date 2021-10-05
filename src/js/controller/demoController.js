import demoView from "../view/demoView";
import mainView from "../view/mainView";
import { LeafletMap } from "../helpers/leafletMap";
import { LEAFLET_CONFIG } from "../config/configuration";
import { WorkoutEntry } from "../data/workoutEntry";
import demoModel from "../model/demoModel";
import { stripHTML } from "../helpers/helpers";

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
        this.#deleteUserWorkoutTrail();
        this.#isUserAddingNewWorkout = true;
    }

    #exitWorkoutForm(event) {
        event.preventDefault();
        demoView.hideWorkoutForm();
        this.#isUserAddingNewWorkout = false;
        this.#deleteUserWorkoutTrail();
        this.#clearWorkoutFormValues();
    }

    #submitWorkout(event) {
        event.preventDefault();
        const newWorkoutEntry = this.#constructWorkoutEntry();
        demoModel.addWorkoutEntry(newWorkoutEntry);
        demoView.renderWorkoutEntries(demoModel.getWorkoutEntries());
        this.#exitWorkoutForm(event);
    }

    #clearWorkoutFormValues() {
        demoView.getWorkoutForm().reset();
    }

    #constructWorkoutEntry() {
        const workoutForm = demoView.getWorkoutForm();
        let workoutType = workoutForm.type.value;
        let workoutDistance = workoutForm.distance.value;
        let workoutDate = workoutForm.date.value;
        let workoutNote = workoutForm.note.value;

        workoutDistance =
            workoutDistance > 0
                ? workoutDistance
                : this.#userWorkoutTrailDistance;
        workoutDate = workoutDate ? workoutDate : "some beautiful day";
        workoutNote = stripHTML(workoutNote);

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
                this.#updateTrailDistanceUI();
            }
        });
    }

    #createNewUserWorkoutTrail(latlng) {
        const { lat, lng } = latlng;
        this.#userWorkoutTrail = this.#leafletMap.createAndRegisterNewLine(
            [[lat, lng]],
            {
                color: "red",
                opacity: 0.9,
                weight: 6,
            }
        );
        this.#updateTrailDistanceUI();
    }

    #deleteUserWorkoutTrail() {
        this.#leafletMap.unregisterLine(this.#userWorkoutTrail);
        this.#userWorkoutTrail = null;
        this.#userWorkoutTrailDistance = 0;
    }

    #updateTrailDistance() {
        this.#userWorkoutTrailDistance = Math.round(
            this.#leafletMap.lineDistance(this.#userWorkoutTrail)
        );
    }

    #updateTrailDistanceUI() {
        const text = `${this.#userWorkoutTrailDistance} meters calculated`;
        demoView.setSmallTextWorkoutDistance(text);
        this.#userWorkoutTrail.bindPopup(
            `Workout trail. <b style="background-color: #77aa7744">Calculated distance: ${
                this.#userWorkoutTrailDistance
            } m.</b>`
        );
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

    #showWorkoutEntryOnMap(workoutID) {
        console.log("map show line");
        //We don't want to mix showing other workouts
        //with adding one
        if (this.#isUserAddingNewWorkout) return;

        const workout = demoModel.getWorkoutEntryByID(workoutID);

        if (!workout) return;
        if (!workout.trail) {
            alert("No trail was saved for this workout!");
            return;
        }

        this.#deleteUserWorkoutTrail();
        this.#userWorkoutTrail = workout.trail;
        this.#leafletMap.registerLine(this.#userWorkoutTrail);
        this.#leafletMap.fitLine(this.#userWorkoutTrail);
    }

    #showWorkoutEntryNote(workoutID) {
        const workout = demoModel.getWorkoutEntryByID(workoutID);
        if (workout) demoView.toggleWorkoutEntryNote(workoutID);
    }
}
export default new DemoController();
