import { map } from "leaflet/src/map";
import { Icon, tileLayer } from "leaflet/src/layer";
import { control } from "leaflet/src/control";
import "leaflet.locatecontrol";
import { LEAFLET_CONFIG } from "../config/configuration";

/**
 * LeafletMap is a wrapper of leaflet's library map object.
 * It simplifies creation of map and interaction with it.
 * @class
 */
export class LeafletMap {
    /**
     * Creates this wrapper and saves leaflet configuration for later.
     * To initialize map use initialize() method.
     * @param initOptions
     * @constructor
     * @public
     */
    constructor(initOptions) {
        this._initOptions = initOptions;
        this._mapInitialized = false;
    }

    initialize() {
        return new Promise((resolve, reject) => {
            try {
                this._leafletIconWorkaround();
                this._createMapAndAttachTileLayer();
                this._mapInitialized = true;
                resolve("Leaflet map initialized properly");
            } catch (error) {
                console.error(error.message);
                this._leafletMap = null;
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

    updateMapPosition(latitude, longitude) {
        this._leafletMap.setView([latitude, longitude]);
    }

    onMapClick(callback) {
        if (!this._mapInitialized)
            throw new Error(
                "Tried to add map callback but map wasn't initialized"
            );

        this._leafletMap.on("click", callback);
    }

    _createMapAndAttachTileLayer() {
        this._leafletMap = map(
            this._initOptions.CONTAINER_ID,
            this._initOptions.MAP_CONFIG
        ).setView(
            this._initOptions.MAP_INITIAL_CENTER,
            this._initOptions.MAP_INITIAL_ZOOM
        );
        tileLayer(
            this._initOptions.MAIN_TILE_PROVIDER,
            this._initOptions.LAYER_CONFIGURATION
        ).addTo(this._leafletMap);
        control.scale().addTo(this._leafletMap);
        L.control
            .locate(LEAFLET_CONFIG.LOCATE_CONTROL_CONFIG)
            .addTo(this._leafletMap);
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
