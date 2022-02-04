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

    deleteWorkoutEntry(workoutEntry: WorkoutEntry) {
        const workoutIndex = this.appUser.workoutEntries.indexOf(workoutEntry);
        if (workoutIndex < 0) return Promise.reject();

        return this.deleteWorkoutFromDatabase(workoutEntry.dbID).then(
            () => {
                this.appUser.workoutEntries.splice(workoutIndex, 1);
                return Promise.resolve();
            },
            reason => Promise.reject()
        );
    }

    deleteWorkoutEntryByLocalID(localId: string): Promise<void> {
        const entry = this.appUser.workoutEntries.find(element => {
            return element.localID === localId;
        });
        if (!entry) return Promise.reject();
        return this.deleteWorkoutEntry(entry);
    }

    deleteAllWorkoutEntries() {
        return new Promise<void>(() => {
            this.appUser.workoutEntries.forEach(async value => {
                await this.deleteWorkoutFromDatabase(value.dbID);
            });
            this.appUser.workoutEntries.splice(0);
            return Promise.resolve();
        });
    }

    addWorkoutEntry(workoutEntry: WorkoutEntry) {
        return this.saveWorkoutToDatabase(JSWorkoutToDatabase(workoutEntry))
            .then(persistedWorkout => {
                workoutEntry.dbID = persistedWorkout.id;
                this.appUser.workoutEntries.push(workoutEntry);
                return Promise.resolve();
            })
            .catch(notPersistedWorkout => {
                return Promise.reject();
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
            if (!response.ok) return Promise.reject();
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
