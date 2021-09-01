import "core-js";
import "regenerator-runtime";
import "../../scss/style.scss";
import "leaflet/dist/leaflet.css"
import {initializeLeafletMap} from "./leafletMap";

export class App {

    constructor() {

    }

    initializeMap(options){
        this.map = initializeLeafletMap(options);
    }
}
