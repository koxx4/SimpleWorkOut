import { map } from "leaflet/src/map";
import { Icon, tileLayer } from "leaflet/src/layer";

export class LeafletMap {
    constructor(initOptions) {
        this._initOptions = initOptions;
        this._mapInitialized = false;
    }

    initializeLeafletMap() {
        return new Promise((resolve, reject) => {
            try {
                this._leafletIconWorkaround();
                this._createMapAndAttachTileLayer();
                this._mapInitialized = true;
                resolve("Leaflet map initialized properly");
            } catch (error) {
                console.error(error.message);
                throw new Error("Failed to load the leaflet map!");
            }
        });
    }

    refreshMap() {
        this._leafletMap.invalidateSize();
    }

    isInitialized() {
        return this._mapInitialized;
    }

    _createMapAndAttachTileLayer() {
        this._leafletMap = map(
            this._initOptions.containerId,
            this._initOptions.mapOptions
        ).setView(this._initOptions.mapCenter, this._initOptions.mapZoom);
        tileLayer(this._initOptions.tileProvider).addTo(this._leafletMap);
    }

    _leafletIconWorkaround() {
        //Known leaflet bug that prevents from proper rendering of markers on the map
        //https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-483402699
        delete Icon.Default.prototype._getIconUrl;
        Icon.Default.mergeOptions({
            iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
            iconUrl: require("leaflet/dist/images/marker-icon.png"),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
        });
    }
}
