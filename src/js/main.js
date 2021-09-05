import {App} from "./app";

const mapInitialOptions = {
    mapOptions: {},
    mapZoom: 13,
    mapCenter: [51.505, -0.09],
    tileProvider: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
};

let userPositionObtained = false;
let userPositionLeftTries = 5;
let userGeolocationIntervalID;

const app = new App();
app.initializeMap(mapInitialOptions);


const getUserGeolocationSuccess = function (location){
    app.updateMapPosition(location.coords.latitude,
        location.coords.longitude);
    userPositionObtained = true;
    clearInterval(userGeolocationIntervalID);
}

const getUserGeolocationFallback = function (){

    if(userPositionLeftTries <= 0) {
        clearInterval(userGeolocationIntervalID);
        return;
    }

    console.log(userPositionLeftTries);
    userPositionLeftTries--;
    alert(`${6 - userPositionLeftTries}.Could not get your position! Using defaults! (${mapInitialOptions.mapCenter})`)
}

const tryGetUsersGeolocation = function (){
    navigator.geolocation.getCurrentPosition(getUserGeolocationSuccess, getUserGeolocationFallback);
};


userGeolocationIntervalID = setInterval(tryGetUsersGeolocation, 3000);










