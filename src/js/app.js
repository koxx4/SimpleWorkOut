import * as bootstrap from "bootstrap";
import "core-js";
import "regenerator-runtime";
import Leaflet from "leaflet";

let map = Leaflet
    .map('map')
    .setView([51.505, -0.09], 13);

Leaflet.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoia294eDQiLCJhIjoiY2t0MDBtbWw0MDhmNjJvcXQ3Z3d3MHBnNSJ9.r5HuTy5Sq1H49DD4fit1tA',
}).addTo(map);

Leaflet.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();
