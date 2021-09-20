import demoView from "../view/demoView";
import mainView from "../view/mainView";
import { LeafletMap } from "../helpers/leafletMap";
import { LEAFLET_CONFIG } from "../config/configuration";

class DemoController {
    /**
     *
     * @type {LeafletMap}
     * @private
     */
    #leafletMap = new LeafletMap(LEAFLET_CONFIG);
    #isUserAddingNewWorkout = false;
    #userWorkoutTrail;

    constructor() {}

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

    #cancelWorkoutForm(event) {
        event.preventDefault();
        demoView.clearAndHideWorkoutForm();
        this.#isUserAddingNewWorkout = false;
        this.#deleteUserWorkoutTrail();
    }

    registerEventHandlers() {
        demoView.addEventHandlerAddWorkoutButton(
            "click",
            this.#startWorkoutForm.bind(this)
        );

        demoView.addEventHandlerCancelWorkoutFormButton(
            "click",
            this.#cancelWorkoutForm.bind(this)
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
}
export default new DemoController();
