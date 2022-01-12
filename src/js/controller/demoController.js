import demoView from "../view/demoView";
import mainView from "../view/mainView";
import { LeafletMap } from "../helpers/leafletMap";
import { LEAFLET_CONFIG } from "../config/configuration";
import WorkoutEntry from "../data/workoutEntry";
import demoModel from "../model/demoModel";
import { stripHTML } from "../helpers/helpers";
import { layerGroup, marker } from "leaflet";

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
    #workoutEntryLayerGroup;

    constructor() {
        demoView.renderWorkoutEntries(demoModel.appUser.workoutEntries);
        this.#workoutEntryLayerGroup = layerGroup();
    }

    #createLeafletMap() {
        this.#leafletMap.initialize().then((msg) => {
            demoView.deleteMapLoadingIcon();
            this.#leafletMap.add(this.#workoutEntryLayerGroup);
            this.#registerMapEventHandlers();
        });
    }

    #startWorkoutForm(event) {
        event.preventDefault();
        demoView.renderWorkoutForm();
        this.#workoutEntryLayerGroup.clearLayers();
        this.#isUserAddingNewWorkout = true;
    }

    #exitWorkoutForm(event) {
        event.preventDefault();
        demoView.hideWorkoutForm();
        this.#isUserAddingNewWorkout = false;
        this.#userWorkoutTrailDistance = 0;
        this.#userWorkoutTrail = null;
        this.#workoutEntryLayerGroup.clearLayers();
        this.#clearWorkoutFormValues();
    }

    #submitWorkout(event) {
        event.preventDefault();
        const newWorkoutEntry = this.#constructWorkoutEntry();
        demoModel.addWorkoutEntry(newWorkoutEntry);
        demoView.renderWorkoutEntries(demoModel.appUser.workoutEntries);
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
        this.#userWorkoutTrail = this.#leafletMap.createNewLine([[lat, lng]], {
            color: "red",
            opacity: 0.9,
            weight: 6,
        });
        this.#workoutEntryLayerGroup.addLayer(this.#userWorkoutTrail);

        this.#updateTrailDistanceUI();
        this.#workoutEntryLayerGroup.addLayer(
            this.#createTrailMarker(latlng, "Starting point of this workout")
        );
    }

    #createTrailMarker(latlng, msg) {
        const newMarker = marker(latlng, {
            title: "End point of the workout",
            riseOnHover: true,
        });

        this.#workoutEntryLayerGroup.addLayer(newMarker);
        newMarker.bindPopup(msg, { autoClose: false }).openPopup();

        return newMarker;
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
        demoView.renderWorkoutEntries(demoModel.appUser.workoutEntries);
        this.#workoutEntryLayerGroup.clearLayers();
    }

    #showWorkoutEntryOnMap(workoutID) {
        //We don't want to mix showing other workouts
        //with adding one
        if (this.#isUserAddingNewWorkout) return;

        const workout = demoModel.getWorkoutEntryByID(workoutID);

        if (!workout) return;
        if (!workout.trail) {
            alert("No trail was saved for this workout!");
            return;
        }
        this.#workoutEntryLayerGroup.clearLayers();

        const trailPoints = workout.trail.getLatLngs();
        const startingLatlng = trailPoints[0];
        const endingLatlng = trailPoints[trailPoints.length - 1];

        this.#workoutEntryLayerGroup.addLayer(
            this.#createTrailMarker(
                startingLatlng,
                `${workout.type} started here...`
            )
        );
        this.#workoutEntryLayerGroup.addLayer(
            this.#createTrailMarker(endingLatlng, `... and ended there.`)
        );

        this.#workoutEntryLayerGroup.addLayer(workout.trail);
        this.#leafletMap.fitLine(workout.trail);
    }

    #showWorkoutEntryNote(workoutID) {
        const workout = demoModel.getWorkoutEntryByID(workoutID);
        if (workout) demoView.toggleWorkoutEntryNote(workoutID);
    }
}
export default new DemoController();
