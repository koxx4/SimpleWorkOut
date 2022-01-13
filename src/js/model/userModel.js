import AppUser from "../data/appUser";

export class UserModel {
    #appUser;

    constructor(appUser) {
        this.#appUser = appUser;
    }

    getWorkoutEntriesSize() {
        return this.#appUser.workoutEntries.length;
    }

    addWorkoutEntry(workoutEntry) {
        workoutEntry.id = this.#appUser.workoutEntries.length;
        this.#appUser.workoutEntries.push(workoutEntry);
    }

    deleteWorkoutEntry(workoutEntry) {
        const workoutIndex = this.#appUser.workoutEntries.indexOf(workoutEntry);
        this.#appUser.workoutEntries.splice(workoutIndex, 1);
    }

    deleteWorkoutEntryByID(id) {
        const entry = this.#appUser.workoutEntries.find(element => {
            return element.id === id;
        });
        this.deleteWorkoutEntry(entry);
    }

    deleteAllWorkoutEntries() {
        this.#appUser.workoutEntries.splice(0);
    }

    getWorkoutEntryByID(id) {
        return this.#appUser.workoutEntries.at(id);
    }

    set appUser(value) {
        this.#appUser = value;
    }

    get appUser() {
        return this.#appUser;
    }
}
export default new UserModel(new AppUser("unknown", "", []));
