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
            this.saveWorkoutToDatabse(JSWorkoutToDatabase(workoutEntry))
                .then(() => resolve(true))
                .catch(() => reject(false));
        });
    }

    deleteWorkoutEntry(workoutEntry: WorkoutEntry) {
        const workoutIndex = this.appUser.workoutEntries.indexOf(workoutEntry);
        this.appUser.workoutEntries.splice(workoutIndex, 1);
    }

    deleteWorkoutEntryByID(id: string) {
        const entry = this.appUser.workoutEntries.find(element => {
            return element.localID === id;
        });
        this.deleteWorkoutEntry(entry);
    }

    deleteAllWorkoutEntries() {
        this.appUser.workoutEntries.splice(0);
    }

    getWorkoutEntryByID(id: string): WorkoutEntry | undefined {
        return this.appUser.workoutEntries.find(entry => entry.localID === id);
    }

    generateWorkoutLocalID(): number {
        return 0;
    }

    private async saveWorkoutToDatabse(workoutToSave: DatabaseWorkout) {
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
        });
    }
}
export default new RealUserModel();
