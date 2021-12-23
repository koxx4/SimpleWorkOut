class DemoModel {
    #workoutEntries = [];

    constructor() {}

    getWorkoutEntriesSize() {
        return this.#workoutEntries.length;
    }

    addWorkoutEntry(workoutEntry) {
        workoutEntry.id = this.#workoutEntries.length;
        this.#workoutEntries.push(workoutEntry);
    }

    deleteWorkoutEntry(workoutEntry) {
        const workoutIndex = this.#workoutEntries.indexOf(workoutEntry);
        this.#workoutEntries.splice(workoutIndex, 1);
    }

    deleteWorkoutEntryByID(id) {
        const entry = this.#workoutEntries.find((element) => {
            return element.id === id;
        });
        this.deleteWorkoutEntry(entry);
        console.log(this);
    }

    deleteAllWorkoutEntries() {
        this.#workoutEntries.splice(0);
    }

    getWorkoutEntries() {
        return this.#workoutEntries;
    }

    getWorkoutEntryByID(id) {
        return this.#workoutEntries.at(id);
    }
}
export default new DemoModel();
