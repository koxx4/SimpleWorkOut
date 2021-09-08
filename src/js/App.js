import "core-js";
import "regenerator-runtime";
import "../scss/style.scss";
import "leaflet/dist/leaflet.css";
import { LeafletMap } from "./LeafletMap";
import { Fader } from "./Fader";

export class App {
    constructor() {
        this._userPagePosition = "home";
        this._homeButton = document.querySelector("#nav__button-home");
        this._demoButton = document.querySelector("#nav__button-demo");
        this._loginButton = document.querySelector("#nav__button-login");
        this._mapSection = document.querySelector("#map-section");
        this._presentationSection = document.querySelector("#presentation");
        this._fader = new Fader(
            "hidden",
            "element-fade-in",
            "element-fade-out"
        );
        this._mapInitialOptions = {
            containerId: "map",
            mapOptions: {},
            mapZoom: 13,
            mapCenter: [51.505, -0.09],
            tileProvider: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        };
        this._leafletMap = new LeafletMap(this._mapInitialOptions);
        this._initializeEventListeners();
    }

    _initializeEventListeners() {
        this._homeButton.addEventListener(
            "click",
            this.handleHomePageButton.bind(this)
        );
        this._demoButton.addEventListener(
            "click",
            this.handleDemoButton.bind(this)
        );
        this._loginButton.addEventListener(
            "click",
            this.handleLoginButton.bind(this)
        );
    }

    handleHomePageButton(event) {
        if (this._userPagePosition === "home") return;

        this._fader
            .fadeOut(this._mapSection, 600)
            .then(() => this._fader.fadeIn(this._presentationSection, 600));

        this._userPagePosition = "home";
    }

    async handleDemoButton(event) {
        if (this._userPagePosition === "demo") return;

        if (!this._leafletMap.isInitialized()) {
            await this._leafletMap.initializeLeafletMap();
        }

        this.getUserGeolocation();

        this._fader
            .fadeOut(this._presentationSection, 600)
            .then(() => this._fader.fadeIn(this._mapSection, 600))
            .then(() => this._leafletMap.refreshMap());

        this._userPagePosition = "demo";
    }

    handleLoginButton(event) {}

    getUserGeolocation() {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                this._leafletMap.updateMapPosition(
                    pos.coords.latitude,
                    pos.coords.longitude
                );
            },
            (error) => {
                alert(error.message);
            }
        );
    }
}
