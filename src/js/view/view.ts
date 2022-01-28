export abstract class View {
    readonly rootElement: HTMLElement;

    protected constructor(rootElement: HTMLElement) {
        this.rootElement = rootElement;
    }

    // _generateChangedHTML(data) {}
    //
    // _updateControlledHTML(newHTML) {}

    removeElementFromThisView(query) {
        this.rootElement.removeChild(this.rootElement.querySelector(query));
    }

    removeAllElementsFromThisView(query) {
        this.rootElement
            .querySelectorAll(query)
            .forEach(value => value.remove());
    }
}
