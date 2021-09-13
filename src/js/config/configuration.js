export const LEAFLET_CONFIG = {
    CONTAINER_ID: "map",
    MAP_CONFIG: {
        attributionControl: true,
    },
    MAP_INITIAL_ZOOM: 13,
    MAP_INITIAL_CENTER: [51.505, -0.09],
    MAIN_TILE_PROVIDER: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    FALLBACK_TILE_PROVIDER: "",
    LAYER_CONFIGURATION: {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
};

export const INITIAL_PAGE_POSITION = "demo";
