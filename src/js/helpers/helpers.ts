import { Fader } from "./fader";
import {
    DatabaseWorkout,
    HIDDEN_ELEMENT_CLASS_NAME,
    SimpleLatLngArray,
    UserStats,
} from "../config/configuration";
import WorkoutEntry from "../data/workoutEntry";
import AppUser from "../data/appUser";
import UserModel from "../model/userModel";

export const faderUtility = new Fader(HIDDEN_ELEMENT_CLASS_NAME);

export const stripHTML = function (text: string) {
    let doc = new DOMParser().parseFromString(text, "text/html");
    return doc.body.textContent || "";
};

export const dbWorkoutToJS = function (
    dbWorkoutJson: DatabaseWorkout,
    localID: number
) {
    const coordsArray: SimpleLatLngArray = dbWorkoutJson.trail
        ? dbWorkoutJson.trail.trailPoints.map(value => [
              value.latitude,
              value.longitude,
          ])
        : [];

    return new WorkoutEntry(
        dbWorkoutJson.workoutType.toLowerCase(),
        dbWorkoutJson.distance,
        new Date(dbWorkoutJson.date),
        dbWorkoutJson.note,
        coordsArray,
        UserModel.generateWorkoutLocalID()
    );
};

export const JSWorkoutToDatabase = function (
    workout: WorkoutEntry
): DatabaseWorkout {
    const convertedPoints = workout.trailCoordinates.map(value => {
        return { latitude: value[0], longitude: value[1] };
    });
    return {
        workoutType: workout.type.toUpperCase(),
        date: workout.date.toISOString(),
        note: workout.notes,
        distance: workout.distance,
        trail: { trailPoints: convertedPoints },
    };
};

export const getUserStats = function (user: AppUser): UserStats {
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

    const months = new Array<number>(12).fill(0);
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
    endpoint: RequestInfo,
    username: string,
    password: string,
    callOptions: RequestInit
) {
    const httpBasicHeaderValue =
        "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

    const reqHeaders = new Headers(callOptions.headers);
    reqHeaders.set("Authorization", httpBasicHeaderValue);
    callOptions.headers = reqHeaders;

    return fetch(endpoint, callOptions);
};

export const createAlertCard = function (
    title: string,
    msg: string,
    type = "text",
    callbackOnConfirm?: any,
    idClass?: string
) {
    const card = document.createElement("div");
    card.classList.add(`${type}-card`);
    card.classList.add("m1");
    if (idClass) card.classList.add(idClass);

    card.insertAdjacentHTML(
        "afterbegin",
        `  <h3>${title ? title : ""}</h3>
                <p>${msg ? msg : ""}</p>
                <button class="button button-primary">Okay</button>`
    );

    card.querySelector("button").addEventListener(
        "click",
        callbackOnConfirm ? callbackOnConfirm : ev => card.remove()
    );
    return card;
};

export const createLoadingSpinnerElement = function (): HTMLElement {
    const loadingSpinner = document.createElement("div");
    loadingSpinner.classList.add("loading-spinner", "centered", "m1");
    return loadingSpinner;
};

export const metersToKilometersFormatted = function (
    meters: number,
    fractionDigits: number
): string {
    return meters >= 1000
        ? (meters / 1000).toFixed(fractionDigits) + " km"
        : meters + " m";
};
