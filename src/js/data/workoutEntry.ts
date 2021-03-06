import { SimpleLatLngArray, WorkoutType } from "../config/configuration";

export default class WorkoutEntry {
    type: WorkoutType;
    distance: number;
    date: Date;
    notes: string;
    trailCoordinates: SimpleLatLngArray;
    readonly localID: string;
    dbID: number;

    constructor(
        type: WorkoutType,
        distance: number,
        date: Date,
        notes: string,
        trailCoordinates: SimpleLatLngArray,
        localID: string,
        dbID?: number
    ) {
        this.type = type;
        this.distance = distance;
        this.date = date;
        this.notes = notes;
        this.trailCoordinates = trailCoordinates;
        this.localID = localID;
        this.dbID = dbID;
    }
}
