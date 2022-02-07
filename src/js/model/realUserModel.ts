import AppUser from "../data/appUser";
import UserModel from "./userModel";
import WorkoutEntry from "../data/workoutEntry";
import {
    DatabaseWorkout,
    TokenNotValidError,
    USER_DATA_ENDPOINT,
} from "../config/configuration";
import { fetchWithUserToken, JSWorkoutToDatabase } from "../helpers/helpers";

class RealUserModel extends UserModel {
    isUserLoggedIn;

    constructor() {
        super(new AppUser("unknown", []));
    }

    public set token(value: string) {
        localStorage.setItem("token", value);
    }

    public get token(): string | null {
        return localStorage.getItem("token");
    }

    getWorkoutEntriesSize(): number {
        return this.appUser.workoutEntries.length;
    }

    deleteWorkoutEntry(workoutEntry: WorkoutEntry) {
        const workoutIndex = this.appUser.workoutEntries.indexOf(workoutEntry);
        if (workoutIndex < 0) return Promise.reject();

        return this.deleteWorkoutFromDatabase(workoutEntry.dbID).then(() => {
            this.appUser.workoutEntries.splice(workoutIndex, 1);
            return Promise.resolve();
        });
    }

    deleteWorkoutEntryByLocalID(localId: string): Promise<void> {
        const entry = this.appUser.workoutEntries.find(element => {
            return element.localID === localId;
        });
        if (!entry) return Promise.reject();
        return this.deleteWorkoutEntry(entry);
    }

    deleteAllWorkoutEntries() {
        return new Promise<void>(resolve => {
            this.appUser.workoutEntries.forEach(async value => {
                await this.deleteWorkoutFromDatabase(value.dbID);
            });
            this.appUser.workoutEntries.splice(0);
            return resolve();
        });
    }

    addWorkoutEntry(workoutEntry: WorkoutEntry) {
        return this.saveWorkoutToDatabase(
            JSWorkoutToDatabase(workoutEntry)
        ).then(persistedWorkout => {
            workoutEntry.dbID = persistedWorkout.id;
            this.appUser.workoutEntries.push(workoutEntry);
            return Promise.resolve();
        });
    }

    getWorkoutEntryByID(id: string): WorkoutEntry | undefined {
        return this.appUser.workoutEntries.find(entry => entry.localID === id);
    }

    generateWorkoutLocalID(): number {
        return 0;
    }

    private saveWorkoutToDatabase(
        workoutToSave: DatabaseWorkout
    ): Promise<DatabaseWorkout> {
        return fetchWithUserToken(`${USER_DATA_ENDPOINT}/workout`, this.token, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(workoutToSave),
        }).then(response => {
            if (!response.ok) throw new Error("Problem with saving workout");

            return response.json();
        });
    }

    private deleteWorkoutFromDatabase(workoutDbIdToDelete: number) {
        const payload = new FormData();
        payload.set("id", workoutDbIdToDelete.toString());
        return fetchWithUserToken(`${USER_DATA_ENDPOINT}/workout`, this.token, {
            method: "DELETE",
            body: payload,
        }).then(response => {
            if (!response.ok) throw new Error("Problem with saving workout");
            return Promise.resolve();
        });
    }
}
export default new RealUserModel();
