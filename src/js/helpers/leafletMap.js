import { map, Icon, tileLayer, control, polyline, Control } from "leaflet";
import "leaflet.locatecontrol";
import { LEAFLET_CONFIG } from "../config/configuration";

/**
 * LeafletMap is a wrapper of leaflet's library map object.
 * It simplifies creation of map and interaction with it.
 * @class
 */
export class LeafletMap {
    #lines = new Set();
    #initOptions;
    #mapInitialized = false;
    #leafletMap;

    /**
     * Creates this wrapper and saves leaflet configuration for later.
     * To initialize map use initialize() method.
     * @param initOptions
     * @constructor
     * @public
     */
    constructor(initOptions) {
        this.#initOptions = initOptions;
    }

    initialize() {
        return new Promise((resolve, reject) => {
            try {
                this.#leafletIconWorkaround();
                this.#createMapAndAttachTileLayer();
                this.#mapInitialized = true;
                resolve("Leaflet map initialized properly");
            } catch (error) {
                console.error(error.message);
                this.#leafletMap = null;
                throw new Error("Failed to load the leaflet map!");
            }
        });
    }

    refreshMap() {
        this.#leafletMap.invalidateSize();
    }

    isInitialized() {
        return this.#mapInitialized;
    }

    updateMapPosition(latitude, longitude) {
        this.#leafletMap.setView([latitude, longitude]);
    }

    onMapClick(callback) {
        if (!this.#mapInitialized)
            throw new Error(
                "Tried to add map callback but map wasn't initialized"
            );

        this.#leafletMap.on("click", callback);
    }

    #createMapAndAttachTileLayer() {
        this.#leafletMap = map(
            this.#initOptions.CONTAINER_ID,
            this.#initOptions.MAP_CONFIG
        ).setView(
            this.#initOptions.MAP_INITIAL_CENTER,
            this.#initOptions.MAP_INITIAL_ZOOM
        );
        tileLayer(
            this.#initOptions.MAIN_TILE_PROVIDER,
            this.#initOptions.LAYER_CONFIGURATION
        ).addTo(this.#leafletMap);
        control.scale().addTo(this.#leafletMap);

        //I used this by global L variable
        //because couldn't get this working
        //with importing module
        L.control
            .locate(LEAFLET_CONFIG.LOCATE_CONTROL_CONFIG)
            .addTo(this.#leafletMap);
    }

    #leafletIconWorkaround() {
        //Known leaflet bug that prevents from proper rendering of markers on the map
        //https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-483402699
        delete Icon.Default.prototype._getIconUrl;
        Icon.Default.mergeOptions({
            iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
            iconUrl: require("leaflet/dist/images/marker-icon.png"),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
        });
    }

    createAndRegisterNewLine(initialCoords, lineOptions) {
        const newLine = polyline(initialCoords, lineOptions).addTo(
            this.#leafletMap
        );
        this.#lines.add(newLine);
        return newLine;
    }

    registerLine(line) {
        line.addTo(this.#leafletMap);
        this.#lines.add(line);
    }

    unregisterLine(line) {
        //If line was not registered
        if (!this.#lines.has(line)) return;

        line.removeFrom(this.#leafletMap);
        this.#lines.delete(line);
    }

    addEventHandlerOnMapClick(callback) {
        this.#leafletMap.on("click", callback);
    }

    distanceBetweenPoints(latlng1, latlng2) {
        return this.#leafletMap.distance(latlng1, latlng2);
    }

    lineDistance(line) {
        let totalDistance = 0;
        const linePoints = line.getLatLngs();

        if (linePoints.length < 2) return;

        linePoints.reduce((previousPoint, point) => {
            totalDistance += this.#leafletMap.distance(previousPoint, point);
            return point;
        });

        return totalDistance;
    }

    fitLine(line) {
        if (!this.#lines.has(line)) return;

        this.#leafletMap.fitBounds(line.getBounds());
    }
}
