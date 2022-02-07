import AppUser from "../data/appUser";
import UserModel from "./userModel";
import WorkoutEntry from "../data/workoutEntry";

class DemoUserModel extends UserModel {
    constructor() {
        super(new AppUser("demo-user", []));
    }

    getWorkoutEntriesSize(): number {
        return this.appUser.workoutEntries.length;
    }

    async addWorkoutEntry(workoutEntry: WorkoutEntry) {
        return new Promise<void>(resolve => {
            this.appUser.workoutEntries.push(workoutEntry);
            return resolve();
        });
    }

    deleteWorkoutEntry(workoutEntry: WorkoutEntry) {
        const workoutIndex = this.appUser.workoutEntries.indexOf(workoutEntry);
        if (workoutIndex < 0) return Promise.reject();
        this.appUser.workoutEntries.splice(workoutIndex, 1);
        return Promise.resolve();
    }

    deleteWorkoutEntryByLocalID(localId: string) {
        const entry = this.appUser.workoutEntries.find(element => {
            return element.localID === localId;
        });
        if (!entry) return Promise.reject();
        return this.deleteWorkoutEntry(entry);
    }

    deleteAllWorkoutEntries() {
        return new Promise<void>(resolve => {
            this.appUser.workoutEntries.splice(0);
            return resolve();
        });
    }

    getWorkoutEntryByID(id: string): WorkoutEntry | undefined {
        return this.appUser.workoutEntries.find(entry => entry.localID === id);
    }

    generateWorkoutLocalID(): number {
        return 0;
    }
}
export default new DemoUserModel();
