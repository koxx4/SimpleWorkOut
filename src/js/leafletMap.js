import {map} from "leaflet/src/map"
import {tileLayer, marker} from "leaflet/src/layer"
import {Icon} from "leaflet/src/layer";



const leafletIconWorkaround = function (){
    //Known leaflet bug that prevents from proper rendering of markers on the map
    //https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-483402699
    delete Icon.Default.prototype._getIconUrl;
    Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
}

export const initializeLeafletMap = function (options) {
    leafletIconWorkaround();
    const {mapOptions, mapCenter, mapZoom, tileProvider} = options;
    let leafletMap = map('map', mapOptions).setView(mapCenter, mapZoom);

    tileLayer(tileProvider, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(leafletMap);

    return leafletMap;
}

