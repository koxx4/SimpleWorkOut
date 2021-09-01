import "core-js";
import "regenerator-runtime";
import {initializeLeafletMap} from "./leafletMap";


const map = initializeLeafletMap();
map.invalidateSize();