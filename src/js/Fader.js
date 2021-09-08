export class Fader {
    constructor(
        hiddenClassName = "hidden",
        fadeInClassName = "fade-in",
        fadeOutClassName = "fade-out"
    ) {
        this._hiddenClassName = hiddenClassName;
        this._fadeInClassName = fadeInClassName;
        this._fadeOutClassName = fadeOutClassName;
    }

    fadeIn(element, duration) {
        element.classList.add(this._fadeInClassName);
        element.classList.remove(this._hiddenClassName);

        return new Promise((resolve) => {
            setTimeout(() => {
                element.classList.remove(this._fadeInClassName);
                resolve();
            }, duration + 50);
        });
    }

    fadeOut(element, duration) {
        element.classList.add(this._fadeOutClassName);

        return new Promise((resolve) => {
            setTimeout(() => {
                element.classList.add(this._hiddenClassName);
                element.classList.remove(this._fadeOutClassName);
                resolve();
            }, duration + 50);
        });
    }
}
