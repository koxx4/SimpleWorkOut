import AppUser from "../data/appUser";
import UserModel from "./userModel";
import WorkoutEntry from "../data/workoutEntry";
import { DatabaseWorkout, USER_DATA_ENDPOINT } from "../config/configuration";
import {
    fetchWithUserCredentials,
    JSWorkoutToDatabase,
} from "../helpers/helpers";

class RealUserModel extends UserModel {
    isUserLoggedIn;

    constructor() {
        super(new AppUser("unknown", "", []));
    }

    getWorkoutEntriesSize(): number {
        return this.appUser.workoutEntries.length;
    }

    addWorkoutEntry(workoutEntry: WorkoutEntry) {
        return new Promise<boolean>((resolve, reject) => {
            this.appUser.workoutEntries.push(workoutEntry);
            this.saveWorkoutToDatabase(JSWorkoutToDatabase(workoutEntry))
                .then(persistedWorkout => {
                    workoutEntry.dbID = persistedWorkout.id;
                    return Promise.resolve(true);
                })
                .catch(() => Promise.reject(false));
        });
    }

    deleteWorkoutEntry(workoutEntry: WorkoutEntry) {
        const workoutIndex = this.appUser.workoutEntries.indexOf(workoutEntry);
        if (workoutIndex < 0) return Promise.reject(false);

        return this.deleteWorkoutFromDatabase(workoutEntry.dbID).then(
            () => {
                this.appUser.workoutEntries.splice(workoutIndex, 1);
                return Promise.resolve(true);
            },
            reason => Promise.reject(false)
        );
    }

    deleteWorkoutEntryByLocalID(localId: string): Promise<boolean> {
        console.log("a");
        const entry = this.appUser.workoutEntries.find(element => {
            return element.localID === localId;
        });
        console.log("b");
        if (!entry) return Promise.reject(false);
        return this.deleteWorkoutEntry(entry);
    }

    deleteAllWorkoutEntries() {
        return new Promise<boolean>(() => {
            this.appUser.workoutEntries.forEach(async value => {
                await this.deleteWorkoutFromDatabase(value.dbID);
            });
            this.appUser.workoutEntries.splice(0);
            return Promise.resolve(true);
        });
    }

    getWorkoutEntryByID(id: string): WorkoutEntry | undefined {
        return this.appUser.workoutEntries.find(entry => entry.localID === id);
    }

    generateWorkoutLocalID(): number {
        return 0;
    }

    private async saveWorkoutToDatabase(
        workoutToSave: DatabaseWorkout
    ): Promise<DatabaseWorkout> {
        return fetchWithUserCredentials(
            `${USER_DATA_ENDPOINT}/${this.appUser.username}/workout`,
            this.appUser.username,
            this.appUser.password,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(workoutToSave),
            }
        ).then(response => {
            if (!response.ok)
                throw new Error(
                    "Couldn't persist newly added workout! " +
                        response.statusText
                );
            return response.json();
        });
    }

    private async deleteWorkoutFromDatabase(workoutDbIdToDelete: number) {
        const payload = new FormData();
        payload.set("id", workoutDbIdToDelete.toString());
        return fetchWithUserCredentials(
            `${USER_DATA_ENDPOINT}/${this.appUser.username}/workout`,
            this.appUser.username,
            this.appUser.password,
            {
                method: "DELETE",
                body: payload,
            }
        ).then(response => {
            if (!response.ok)
                return Promise.reject(
                    "Couldn't delete workout! " + response.statusText
                );
            return Promise.resolve();
        });
    }
}
export default new RealUserModel();
