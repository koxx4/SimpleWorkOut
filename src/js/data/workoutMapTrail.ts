import {
    circle,
    polyline,
    latLng,
    Polyline,
    Circle,
    PolylineOptions,
    CircleMarkerOptions,
    LayerGroup,
    Map,
    Marker,
    LatLng,
    LatLngExpression,
    Popup,
} from "leaflet";
import { LeafletMap } from "../helpers/leafletMap";
import { SimpleLatLngArray } from "../config/configuration";

export default class WorkoutMapTrail {
    private _path: Polyline;
    private _nodes: Circle[];
    private readonly _pathOptions: PolylineOptions;
    private readonly _nodeOptions: CircleMarkerOptions;
    private _layerGroupTarget: LayerGroup | Map;
    private _startMarker: Marker;
    public isEditable: boolean;

    constructor(
        startingPoints: SimpleLatLngArray,
        pathOptions: PolylineOptions,
        nodeOptions: CircleMarkerOptions
    ) {
        this._pathOptions = pathOptions;
        this._nodeOptions = nodeOptions;
        this._path = polyline(startingPoints, pathOptions);
        this._nodes = [];
        this.isEditable = true;
        if (startingPoints.length > 1) this.recreateNodes(startingPoints);
    }

    addTo(layerGroup: LayerGroup | Map) {
        this._layerGroupTarget = layerGroup;
        this._path.addTo(layerGroup);
        this._nodes.forEach(node => node.addTo(layerGroup));
    }

    get distance(): number {
        return this.calculateDistance();
    }

    addPoint(point: LatLng) {
        this._path.addLatLng(point);
        const node = this.createNode(point);
        this._nodes.push(node);
        if (this._layerGroupTarget) {
            node.addTo(this._layerGroupTarget);
            if (this._nodes.length === 1)
                this.createStartMarker(point).addTo(this._layerGroupTarget);
        }
    }

    removePoint(point: LatLng) {
        const currentLatLangs: any = this._path.getLatLngs();

        const pointToDelete: LatLng = currentLatLangs.find(
            (value: LatLng) =>
                value.lat === point.lat && value.lng === point.lng
        );

        if (!pointToDelete) return;

        currentLatLangs.splice(currentLatLangs.indexOf(pointToDelete), 1);
        this._path.setLatLngs(currentLatLangs);
    }

    bindPopup(popup: Popup | string) {
        this._path.bindPopup(popup);
    }

    removeFromBoundLayer() {
        this._path.remove();
        this._nodes.forEach(node => node.remove());
        this._startMarker?.remove();
    }

    reset() {
        this._path.setLatLngs([]);
        this._nodes.forEach(node => node.remove());
        this._nodes.splice(0);
        this._startMarker?.remove();
    }

    get path() {
        return this._path;
    }

    get trailStartingLatLang() {
        if (this._nodes.length === 0) return undefined;
        return this._nodes[0].getLatLng();
    }

    get trailEndingLatLang() {
        if (this._nodes.length === 0) return undefined;
        return this._nodes[this._nodes.length - 1].getLatLng();
    }

    get listOfCoordinates(): SimpleLatLngArray {
        const latlngs: any = this._path.getLatLngs();
        if (latlngs.length <= 1) return [];

        return latlngs.map(latlng => [latlng.lat, latlng.lng]);
    }

    private recreateNodes(latlngs: SimpleLatLngArray) {
        this._nodes = [];
        latlngs.forEach(point =>
            this._nodes.push(this.createNode(latLng(point[0], point[1])))
        );
    }

    private createStartMarker(point: LatLng) {
        const newMarker = LeafletMap.createBasicMarker(
            point,
            "Staring point",
            "Your starting point"
        );
        newMarker.on("contextmenu", event => {
            event.sourceTarget.remove();
            this.reset();
        });
        return newMarker;
    }

    private createNode(center: LatLng) {
        const node = circle(center, this._nodeOptions);
        node.on("contextmenu", event => {
            if (!this.isEditable) return;
            const target = event.sourceTarget;
            this.removePoint(target.getLatLng());
            target.remove();
        });
        return node;
    }

    private calculateDistance() {
        let totalDistance = 0;
        const linePoints: any = this._path.getLatLngs();

        if (!linePoints || linePoints.length < 2) return totalDistance;

        linePoints.reduce((previousPoint, point) => {
            totalDistance += previousPoint.distanceTo(point);
            return point;
        });

        return totalDistance;
    }
}
