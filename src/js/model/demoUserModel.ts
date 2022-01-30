import AppUser from "../data/appUser";
import UserModel from "./userModel";
import WorkoutEntry from "../data/workoutEntry";

class DemoUserModel extends UserModel {
    constructor() {
        super(new AppUser("demo-user", "", []));
    }

    getWorkoutEntriesSize(): number {
        return this.appUser.workoutEntries.length;
    }

    async addWorkoutEntry(workoutEntry: WorkoutEntry) {
        return new Promise<boolean>(resolve => {
            this.appUser.workoutEntries.push(workoutEntry);
            return resolve(true);
        });
    }

    deleteWorkoutEntry(workoutEntry: WorkoutEntry) {
        const workoutIndex = this.appUser.workoutEntries.indexOf(workoutEntry);
        if (workoutIndex < 0) return Promise.reject(false);
        this.appUser.workoutEntries.splice(workoutIndex, 1);
        return Promise.resolve(true);
    }

    deleteWorkoutEntryByLocalID(localId: string) {
        const entry = this.appUser.workoutEntries.find(element => {
            return element.localID === localId;
        });
        if (!entry) return Promise.reject(false);
        return this.deleteWorkoutEntry(entry);
    }

    deleteAllWorkoutEntries() {
        return new Promise<boolean>(() => {
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
}
export default new DemoUserModel();
