import { Fader } from "./fader";
import {
    FADEIN_ELEMENT_CLASS_NAME,
    FADEOUT_ELEMENT_CLASS_NAME,
    HIDDEN_ELEMENT_CLASS_NAME,
} from "../config/configuration";
import WorkoutEntry from "../data/workoutEntry";
import userModel from "../model/userModel";

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
        ? dbWorkoutJson.trail.trailPoints.map(value => [
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

export const getUserStats = function (user) {
    const workoutCount = user.workoutEntries.length;

    if (workoutCount === 0)
        return {
            workoutCount: 0,
            workoutTotalDistance: 0,
            mostActiveMonth: 0,
        };

    const workoutTotalDistance = user.workoutEntries.reduce(
        (previousValue, currentValue) => {
            previousValue += currentValue.distance;
            return previousValue;
        },
        0
    );

    const months = new Array(12);
    user.workoutEntries.forEach(value => {
        months[value.date?.getMonth()]++;
    });
    let mostActiveMonthIndex = 0;
    months.forEach((currentMonthValue, currentIndex) => {
        if (currentMonthValue > months[mostActiveMonthIndex])
            mostActiveMonthIndex = currentIndex;
    });

    return {
        workoutCount: workoutCount,
        workoutTotalDistance: workoutTotalDistance,
        mostActiveMonth: mostActiveMonthIndex + 1,
    };
};

export const fetchWithUserCredentials = function (
    endpoint,
    username,
    password,
    callOptions
) {
    const httpBasicHeaderValue =
        "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

    if (callOptions.headers === undefined) {
        const reqHeaders = new Headers();
        reqHeaders.set("Authorization", httpBasicHeaderValue);
        callOptions.headers = reqHeaders;
    } else callOptions.headers.set("Authorization", httpBasicHeaderValue);

    return fetch(endpoint, callOptions);
};
