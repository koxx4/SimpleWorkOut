import {
    CircleMarkerOptions,
    LayerOptions,
    MapOptions,
    PolylineOptions,
} from "leaflet";

export interface LeafletConfiguration {
    CONTAINER_ID: string;
    MAP_CONFIG: MapOptions;
    MAP_INITIAL_ZOOM: number;
    MAP_INITIAL_CENTER: [number, number];
    MAIN_TILE_PROVIDER: string;
    FALLBACK_TILE_PROVIDER: string;
    LAYER_CONFIGURATION: LayerOptions;
    LOCATE_CONTROL_CONFIG: {
        position: string;
        setView: string;
        drawCircle: boolean;
        showPopup: boolean;
    };
    MAP_AUTOMATIC_SIZE_REFRESH: boolean;
    MAP_AUTOMATIC_SIZE_REFRESH_INTERVAL: number;
}

export const LEAFLET_CONFIG: LeafletConfiguration = {
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
    MAP_AUTOMATIC_SIZE_REFRESH_INTERVAL: 2000,
};

export const INITIAL_SECTION = "#home";
export const INITIAL_SECTION_DEBUG = "#workouts";
export const HIDDEN_ELEMENT_CLASS_NAME = "hidden";
export const FADEOUT_ELEMENT_CLASS_NAME = "element-fade-out";
export const FADEIN_ELEMENT_CLASS_NAME = "element-fade-in";
export const FADE_BETWEEN_PAGE_SECTIONS = true;
export const API_HOST = "https://sws-server.koxx4.me:8080";
export const REGISTRATION_ENDPOINT = `${API_HOST}/register/user`;
export const USER_DATA_ENDPOINT = `${API_HOST}/user/actions`;
export const PATH_OPTIONS: PolylineOptions = {
    color: "red",
    opacity: 0.9,
    weight: 6,
    lineCap: "round",
    lineJoin: "round",
};
export const PATH_NODES_OPTIONS: CircleMarkerOptions = {
    radius: 4,
    color: "#3961ec",
    fill: true,
    fillColor: "#3961ec",
    fillOpacity: 1,
    opacity: 1,
};
export type WorkoutType = "walking" | "cycling" | "running" | "hiking" | string;
export type SimpleLatLngArray = Array<[number, number]>;

export interface DatabaseWorkout {
    id?: number;
    workoutType: WorkoutType;
    date: string;
    note: string;
    distance: number;
    trail: {
        trailPoints: Array<{ latitude: number; longitude: number }>;
    };
}

export interface UserStats {
    workoutCount: number;
    workoutTotalDistance: number;
    mostActiveMonth: number;
}
export const WORKOUT_ENTRY_DATE_FORMAT: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
};
