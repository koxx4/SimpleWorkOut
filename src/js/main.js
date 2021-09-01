import {App} from "./app";


const app = new App();

const options = {
    mapOptions: {},
    mapZoom: 13,
    mapCenter: [51.505, -0.09],
    tileProvider: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
};

navigator.geolocation.getCurrentPosition(
    (location) => {
        options.mapCenter[0] = location.coords.latitude;
        options.mapCenter[1] = location.coords.longitude;
        app.initializeMap(options);
    },
    () => alert(`Could not get your position! Using default ${userInitialPosition}`)
);




