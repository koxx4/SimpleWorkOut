import demoView from "../view/demoView";
import mainView from "../view/mainView";
import { LeafletMap } from "../helpers/leafletMap";
import { LEAFLET_CONFIG } from "../config/configuration";
import { WorkoutEntry } from "../data/workoutEntry";

class DemoController {
    /**
     *
     * @type {LeafletMap}
     * @private
     */
    #leafletMap = new LeafletMap(LEAFLET_CONFIG);
    #isUserAddingNewWorkout = false;
    #userWorkoutTrail;
    #userWorkoutTrailDistance;

    constructor() {
    }

    #getUserGeolocationAndApplyToMap() {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                this.#leafletMap.updateMapPosition(
                    pos.coords.latitude,
                    pos.coords.longitude
                );
            },
            (error) => {
                alert(error.message);
            }
        );
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
    }

    #submitWorkout(event){
        event.preventDefault();
        const workoutType = demoView.getWorkoutTypeInput().value;
        const workoutManuallDistance = demoView.getWorkoutDistanceInput().value;
        const workoutDate = demoView.getWorkoutDateInput().value;
        const workoutNote = demoView.getWorkoutNoteInput().value;
        const workoutDistance = workoutManuallDistance ? workoutManuallDistance : this.#userWorkoutTrailDistance;
        const newWorkoutEntry = new WorkoutEntry(workoutType, workoutDistance, workoutDate, workoutNote, this.#userWorkoutTrail);
        console.log(newWorkoutEntry);
        this.#exitWorkoutForm(event);
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
        )

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
        this.#userWorkoutTrailDistance = Math.round(this.#leafletMap.lineDistance(this.#userWorkoutTrail));
        const text = `${this.#userWorkoutTrailDistance} meters calculated`;
        demoView.setSmallTextWorkoutDistance(text);
    }
}
export default new DemoController();
