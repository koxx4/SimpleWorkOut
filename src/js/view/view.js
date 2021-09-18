export class View {
    _rootElement;

    constructor(rootElement) {
        this._rootElement = rootElement;
    }

    render(data) {
        const newHTML = this._generateChangedHTML(data);
        this._updateControlledHTML(newHTML);
    }

    //Function to override
    _generateChangedHTML(data) {}

    _updateControlledHTML(newHTML) {}
}
