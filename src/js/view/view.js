export class View {
    #rootElement;

    constructor(rootElement) {
        this.#rootElement = rootElement;
    }

    render(data) {
        const newHTML = this._generateChangedHTML(data);
        this._updateControlledHTML(newHTML);
    }

    _generateChangedHTML(data) {}

    _updateControlledHTML(newHTML) {}

    removeElementFromThisView(query) {
        this._rootElement.removeChild(this._rootElement.querySelector(query));
    }

    get rootElement() {
        return this.#rootElement;
    }

    set rootElement(value) {
        this.#rootElement = value;
    }
}
