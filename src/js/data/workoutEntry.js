export class WorkoutEntry {
    type;
    distance;
    date;
    notes;
    trail;
    id;

    constructor(type, distance, date, notes, trail, id) {
        this.type = type;
        this.distance = distance;
        this.date = date;
        this.notes = notes;
        this.trail = trail;
    }
}
