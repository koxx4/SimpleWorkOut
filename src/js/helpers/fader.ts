export class Fader {
    private readonly _hiddenClassName;

    constructor(hiddenClassName: string = "hidden") {
        this._hiddenClassName = hiddenClassName;
    }

    fadeIn(element, duration) {
        element.style.animationFillMode = "forwards";
        element.style.animation = `fade-in ${duration}ms ease-out`;
        element.classList.remove(this._hiddenClassName);

        return new Promise<void>(resolve => {
            setTimeout(() => {
                element.style.removeProperty("animation-fill-mode");
                element.style.removeProperty("animation");
                resolve();
            }, duration);
        });
    }

    fadeOut(element, duration) {
        element.style.animationFillMode = "forwards";
        element.style.animation = `fade-out ${duration}ms ease-out`;

        return new Promise<void>(resolve => {
            setTimeout(() => {
                element.classList.add(this._hiddenClassName);
                element.style.removeProperty("animation-fill-mode");
                element.style.removeProperty("animation");
                resolve();
            }, duration);
        });
    }
}
