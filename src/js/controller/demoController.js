import demoView from "../view/demoView";
import mainView from "../view/mainView";

class DemoController {
    #leafletMap;

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

    registerEventHandlers() {
        mainView.addEventHandlerOnDemoSectionLoad(() => {
            debugger;
            demoView.renderMapLoadingIcon();
        });

        mainView.addEventHandlerOnDemoSectionExit(() => {
            demoView.deleteMapLoadingIcon();
        });
    }
}
export default new DemoController();
