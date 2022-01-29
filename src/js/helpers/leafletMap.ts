import { Icon, map, tileLayer, marker, Map, control, Control } from "leaflet";
import { LEAFLET_CONFIG, LeafletConfiguration } from "../config/configuration";
import "leaflet.locatecontrol";
import scale = control.scale;
import locate = control.locate;
/**
 * LeafletMap is a wrapper of leaflet's library map object.
 * It simplifies creation of map and interaction with it.
 * @class
 */
export class LeafletMap {
    private _initOptions: LeafletConfiguration;
    private _mapInitialized = false;
    private _leafletMap: Map;

    /**
     * Creates this wrapper and saves leaflet configuration for later.
     * To initialize map use initialize() method.
     * @param initOptions
     * @constructor
     * @public
     */
    constructor(initOptions: LeafletConfiguration) {
        this._initOptions = initOptions;
    }

    initialize() {
        return new Promise<string>((resolve, reject) => {
            try {
                this.leafletIconWorkaround();
                this.createMapAndAttachTileLayer();
                this._mapInitialized = true;
                resolve("Leaflet map initialized properly");
            } catch (error) {
                console.error(error.message);
                this._leafletMap = null;
                throw new Error("Failed to load the leaflet map!");
            }
        });
    }

    destroy() {
        this._leafletMap.off();
        this._leafletMap.remove();
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

    private createMapAndAttachTileLayer() {
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
        this._leafletMap.addControl(scale());
        this._leafletMap.addControl(
            locate(this._initOptions.LOCATE_CONTROL_CONFIG)
        );

        if (LEAFLET_CONFIG.MAP_AUTOMATIC_SIZE_REFRESH)
            this.applyAutomaticMapRefresh();
    }

    private leafletIconWorkaround() {
        //Known leaflet bug that prevents from proper rendering of markers on the map
        //https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-483402699
        // @ts-ignore
        delete Icon.Default.prototype._getIconUrl;
        Icon.Default.mergeOptions({
            iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
            iconUrl: require("leaflet/dist/images/marker-icon.png"),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
        });
    }

    private applyAutomaticMapRefresh() {
        setInterval(
            this._leafletMap.invalidateSize.bind(this._leafletMap),
            LEAFLET_CONFIG.MAP_AUTOMATIC_SIZE_REFRESH_INTERVAL
        );
    }

    addEventHandlerOnMapClick(callback) {
        this._leafletMap.on("click", callback);
    }

    addEventHandlerOnMapRightClick(callback) {
        this._leafletMap.on("contextmenu", callback);
    }

    fitLine(line) {
        this._leafletMap.fitBounds(line.getBounds());
    }

    add(leafletElement) {
        leafletElement.addTo(this._leafletMap);
    }

    remove(leafletElement) {
        leafletElement.removeFrom(this._leafletMap);
    }

    static createBasicMarker(latlng, title = "Title", msg = "Message") {
        const newMarker = marker(latlng, {
            title: title,
            riseOnHover: true,
        });
        newMarker.bindPopup(msg, { autoClose: false }).openPopup();

        return newMarker;
    }
}
