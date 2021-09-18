import demoView from "../view/demoView";
import mainView from "../view/mainView";

let leafletMap;

const getUserGeolocationAndApplyToMap = function () {
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            this._leafletMap.updateMapPosition(
                pos.coords.latitude,
                pos.coords.longitude
            );
        },
        (error) => {
            alert(error.message);
        }
    );
};

mainView.addEventHandlerOnDemoSectionLoad(() => {
    demoView.renderMapLoadingIcon();
});

mainView.addEventHandlerOnHomeSectionLoad(() => {
    demoView.deleteMapLoadingIcon();
});

const loadLeafletMap = function () {};
