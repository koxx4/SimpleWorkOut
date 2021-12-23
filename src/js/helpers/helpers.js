import { Fader } from "./fader";
import {
    FADEIN_ELEMENT_CLASS_NAME,
    FADEOUT_ELEMENT_CLASS_NAME,
    HIDDEN_ELEMENT_CLASS_NAME,
} from "../config/configuration";

export const domParser = new DOMParser();
export const faderUtility = new Fader(
    HIDDEN_ELEMENT_CLASS_NAME,
    FADEIN_ELEMENT_CLASS_NAME,
    FADEOUT_ELEMENT_CLASS_NAME
);

export const stripHTML = function (text) {
    let doc = new DOMParser().parseFromString(text, "text/html");
    return doc.body.textContent || "";
};
