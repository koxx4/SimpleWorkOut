import {map} from "leaflet/src/map"
import {tileLayer, marker, popup} from "leaflet/src/layer"



export const initializeLeafletMap = function () {
    debugger;
    let leafletMap = map('map').setView([51.505, -0.09], 13);

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(leafletMap);

    marker([51.5, -0.09]).addTo(leafletMap)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup();

    return leafletMap;
}