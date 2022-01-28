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

    addWorkoutEntry(workoutEntry: WorkoutEntry) {
        this.appUser.workoutEntries.push(workoutEntry);
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
}
export default new DemoUserModel();
