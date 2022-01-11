import { Fader } from "./fader";
import {
    FADEIN_ELEMENT_CLASS_NAME,
    FADEOUT_ELEMENT_CLASS_NAME,
    HIDDEN_ELEMENT_CLASS_NAME,
} from "../config/configuration";
import WorkoutEntry from "../data/workoutEntry";

export const domParser = new DOMParser();
export const faderUtility = new Fader(
    HIDDEN_ELEMENT_CLASS_NAME,
    FADEIN_ELEMENT_CLASS_NAME,
    FADEOUT_ELEMENT_CLASS_NAME
);

export const stripHTML = function (text) {
    let doc = new DOMParser().parseFromString(text, "text/html");
    return doc.body.textContent || "";
};

export const dbWorkoutToJS = function (dbWorkoutJson) {
    const trail = dbWorkoutJson.trail
        ? dbWorkoutJson.trail.trailPoints.map((value) => [
              value.latitude,
              value.longitude,
          ])
        : [];

    return new WorkoutEntry(
        dbWorkoutJson.workoutType,
        dbWorkoutJson.distance,
        new Date(dbWorkoutJson.date),
        dbWorkoutJson.note,
        trail,
        dbWorkoutJson.id
    );
};
