import { map, Icon, tileLayer, control, polyline } from "leaflet";
import "leaflet.locatecontrol";
import { LEAFLET_CONFIG } from "../config/configuration";

/**
 * LeafletMap is a wrapper of leaflet's library map object.
 * It simplifies creation of map and interaction with it.
 * @class
 */
export class LeafletMap {
    #lines = [];

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

        // // create a red polyline from an array of LatLng points
        // let latlngs = [
        //     [45.51, -122.68],
        //     [37.77, -122.43],
        //     [34.04, -118.2],
        // ];
        //
        // let poly = polyline(latlngs, { color: "red" }).addTo(this._leafletMap);
        // poly.addLatLng([39, -112]);
        //
        // // zoom the map to the polyline
        // this._leafletMap.fitBounds(poly.getBounds());
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

    createNewLine(initialCoords, lineOptions) {
        const newLine = polyline(initialCoords, lineOptions).addTo(
            this._leafletMap
        );
        this.#lines.push(newLine);
        return newLine;
    }

    deleteLine(line) {
        const foundLineIndex = this.#lines.indexOf(line);
        //If element was present in array
        if (foundLineIndex > -1) {
            line.removeFrom(this._leafletMap);
            this.#lines.splice(foundLineIndex, 1);
        }
    }

    addEventHandlerOnMapClick(callback) {
        this._leafletMap.on("click", callback);
    }

    distanceBetweenPoints(latlng1, latlng2){
        return this._leafletMap.distance(latlng1, latlng2);
    }

    lineDistance(line){
        let totalDistance = 0;
        const linePoints = line.getLatLngs();

        if (linePoints.length < 2) return;

        linePoints.reduce((previousPoint, point) => {
            totalDistance += this._leafletMap.distance(previousPoint, point);
            return point;
        });

        return totalDistance;
    }

}
