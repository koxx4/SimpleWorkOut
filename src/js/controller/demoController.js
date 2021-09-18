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
            console.log(msg);
        });
    }

    #showWorkoutForm() {
        demoView.renderWorkoutForm();
    }

    registerEventHandlers() {
        demoView.addEventHandlerAddWorkoutButton(
            "click",
            this.#showWorkoutForm
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
}
export default new DemoController();
