import { Fader } from "./fader";
import {
    DatabaseWorkout,
    HIDDEN_ELEMENT_CLASS_NAME,
    SimpleLatLngArray,
    TokenNotValidError,
    USER_DATA_ENDPOINT,
    USER_LOGIN_ENDPOINT,
    UserStats,
} from "../config/configuration";
import WorkoutEntry from "../data/workoutEntry";
import AppUser from "../data/appUser";
import UserModel from "../model/userModel";
import * as Process from "process";
import realUserModel from "../model/realUserModel";
import loginView from "../view/loginView";
import registerView from "../view/registerView";

export const faderUtility = new Fader(HIDDEN_ELEMENT_CLASS_NAME);

export const stripHTML = function (text: string) {
    let doc = new DOMParser().parseFromString(text, "text/html");
    return doc.body.textContent || "";
};

export const dbWorkoutToJS = function (
    databseWorkout: DatabaseWorkout,
    localID: number
) {
    const coordsArray: SimpleLatLngArray = databseWorkout.trail
        ? databseWorkout.trail.trailPoints.map(value => [
              value.latitude,
              value.longitude,
          ])
        : [];

    return new WorkoutEntry(
        databseWorkout.workoutType.toLowerCase(),
        databseWorkout.distance,
        new Date(databseWorkout.date),
        databseWorkout.note,
        coordsArray,
        UserModel.generateWorkoutLocalID(),
        databseWorkout.id
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

export const fetchWithUserToken = function (
    endpoint: RequestInfo,
    token: string,
    callOptions: RequestInit,
    timeoutSec = 60000
): Promise<Response | any> {
    const httpBasicHeaderValue = `Bearer ${token}`;

    const reqHeaders = new Headers(callOptions.headers);
    reqHeaders.set("Authorization", httpBasicHeaderValue);

    callOptions.headers = reqHeaders;

    const abortController = new AbortController();
    const failTimeout = setTimeout(() => {
        abortController.abort();
    }, timeoutSec);
    callOptions.signal = abortController.signal;

    return fetch(endpoint, callOptions).then(response => {
        clearTimeout(failTimeout);
        if (response.status === 401 || response.status === 403)
            throw new TokenNotValidError("Token is not longer valid");

        return response;
    });
};

export const fetchUserToken = async function (
    username: string,
    password: string
): Promise<string> {
    const payload = new FormData();
    payload.set("password", password);

    const response = await fetch(`${USER_LOGIN_ENDPOINT}/${username}`, {
        method: "POST",
        body: payload,
    });

    if (!response.ok) return Promise.reject("Couldn't login");

    return await response.text();
};

export const dbUserDataToAppUser = function (userData): AppUser {
    const jsWorkouts = userData.workouts
        ? userData.workouts.map((value, index) => dbWorkoutToJS(value, index))
        : [];

    return new AppUser(userData.nickname, jsWorkouts, userData.email);
};

export const fetchAndConvertAppUserData = async function (
    token: string,
    timeoutSec = 60000
) {
    const response = await fetchWithUserToken(
        `${USER_DATA_ENDPOINT}/data`,
        token,
        {
            method: "GET",
        },
        timeoutSec
    );
    if (!response.ok) throw new Error(response.statusText);
    const userData = await response.json();
    return dbUserDataToAppUser(userData);
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

export const showModal = function (
    title: string,
    msg: string,
    type: "info" | "error" = "info",
    onClose?: Function
): HTMLElement {
    document.body.insertAdjacentHTML(
        "afterbegin",
        `
        <div class="modal">
            <div class="modal-text-card-${type}">
                <div class="close-modal">&times;</div>
                <h3>${title}</h3>
                <p>${msg}</p>
            </div>
        </div>
    `
    );
    const modalElement = document.body.firstElementChild;
    modalElement.querySelector(".close-modal").addEventListener("click", e => {
        if (onClose) onClose();
        modalElement.remove();
    });

    return <HTMLElement>modalElement;
};

export const metersToKilometersFormatted = function (
    meters: number,
    fractionDigits: number
): string {
    return meters >= 1000
        ? (meters / 1000).toFixed(fractionDigits) + " km"
        : meters + " m";
};
