export default class Controller {
    #controlledHash = "#";
    #view;

    constructor(controlledHash, view) {
        this.#controlledHash = controlledHash;
        this.#view = view;
    }

    initialize() {}

    get controlledHash() {
        return this.#controlledHash;
    }

    get view() {
        return this.#view;
    }
}
