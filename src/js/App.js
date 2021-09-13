import "core-js";
import "regenerator-runtime";
import "../scss/style.scss";
import "leaflet/dist/leaflet.css";
import { LeafletMap } from "./LeafletMap";
import { Fader } from "./Fader";
import { INITIAL_PAGE_POSITION, LEAFLET_CONFIG } from "./config/configuration";

export class App {
    constructor() {
        this._leafletMap = new LeafletMap(LEAFLET_CONFIG);
        this._tryToInitializeLeafletMap();
        this._initializeDOMHooks();
        this._fader = new Fader(
            "hidden",
            "element-fade-in",
            "element-fade-out"
        );
        this._initializeEventListeners();

        this._userPagePosition = INITIAL_PAGE_POSITION;
        this._renderDemoPage();
        this._getUserGeolocationAndApplyToMap();
    }

    async _tryToInitializeLeafletMap() {
        const resultMsg = await this._leafletMap.initializeLeafletMap();
        this._leafletMap.onMapClick();
    }

    _initializeDOMHooks() {
        this._homeButton = document.querySelector("#nav__button-home");
        this._demoButton = document.querySelector("#nav__button-demo");
        this._loginButton = document.querySelector("#nav__button-login");
        this._demoSection = document.querySelector("#demo-section");
        console.log(this._demoSection);
        this._presentationSection = document.querySelector("#presentation");
    }

    _initializeEventListeners() {
        this._homeButton.addEventListener(
            "click",
            this._handleHomePageButton.bind(this)
        );
        this._demoButton.addEventListener(
            "click",
            this._handleDemoButton.bind(this)
        );
        this._loginButton.addEventListener(
            "click",
            this._handleLoginButton.bind(this)
        );
    }

    _handleHomePageButton(event) {
        if (this._userPagePosition === "home") return;
        this._renderHomePage();
        this._userPagePosition = "home";
    }

    async _handleDemoButton(event) {
        if (this._userPagePosition === "demo") return;

        if (!this._leafletMap.isInitialized()) {
            await this._tryToInitializeLeafletMap();
        }

        this._getUserGeolocationAndApplyToMap();
        this._renderDemoPage();
        this._userPagePosition = "demo";
    }

    _handleLoginButton(event) {}

    _getUserGeolocationAndApplyToMap() {
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

    _renderDemoPage() {
        this._fader
            .fadeOut(this._presentationSection, 600)
            .then(() => this._fader.fadeIn(this._demoSection, 600))
            .then(() => this._leafletMap.refreshMap());
    }

    _renderHomePage() {
        this._fader
            .fadeOut(this._demoSection, 600)
            .then(() => this._fader.fadeIn(this._presentationSection, 600));
    }
}
