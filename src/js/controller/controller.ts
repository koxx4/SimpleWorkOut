import { View } from "../view/view";

export default abstract class Controller {
    readonly controlledHash: string;
    readonly rootView: View;

    protected constructor(controlledHash: string, rootView: View) {
        this.controlledHash = controlledHash;
        this.rootView = rootView;
    }

    abstract initialize();
}
