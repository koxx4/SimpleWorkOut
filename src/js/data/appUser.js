export default class AppUser {
    #username;
    #email;
    #password;
    #workoutEntries = [];

    constructor(username, password, workoutEntries) {
        this.#username = username;
        this.#password = password;
        this.#workoutEntries = workoutEntries;
    }

    /**
     *
     * @returns {WorkoutEntry[]}
     */
    get workoutEntries() {
        return this.#workoutEntries;
    }

    get username() {
        return this.#username;
    }

    get password() {
        return this.#password;
    }

    set username(value) {
        this.#username = value;
    }

    set password(value) {
        this.#password = value;
    }

    set workoutEntries(value) {
        this.#workoutEntries = value;
    }

    set email(value) {
        this.#email = value;
    }

    get email() {
        return this.#email;
    }
}
