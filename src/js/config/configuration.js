import { Browser } from "leaflet";

export const LEAFLET_CONFIG = {
    CONTAINER_ID: "map",
    MAP_CONFIG: {
        attributionControl: true,
        touchZoom: true,
    },
    MAP_INITIAL_ZOOM: 13,
    MAP_INITIAL_CENTER: [51.505, -0.09],
    MAIN_TILE_PROVIDER: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    FALLBACK_TILE_PROVIDER: "",
    LAYER_CONFIGURATION: {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    LOCATE_CONTROL_CONFIG: {
        position: "topright",
        setView: "once",
        drawCircle: true,
        showPopup: false,
    },
    MAP_AUTOMATIC_SIZE_REFRESH: true,
    MAP_AUTOMATIC_SIZE_REFRESH_INTERVAL: 5000,
};

export const INITIAL_PAGE_POSITION = "#home";
export const INITIAL_PAGE_POSITION_DEBUG = "#home";
export const HIDDEN_ELEMENT_CLASS_NAME = "hidden";
export const FADEOUT_ELEMENT_CLASS_NAME = "element-fade-out";
export const FADEIN_ELEMENT_CLASS_NAME = "element-fade-in";
export const FADE_BETWEEN_PAGE_SECTIONS = true;
