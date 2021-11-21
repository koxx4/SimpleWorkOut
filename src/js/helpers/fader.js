export class Fader {
    constructor(hiddenClassName = "hidden") {
        this._hiddenClassName = hiddenClassName;
    }

    fadeIn(element, duration) {
        element.style.animationFillMode = "forwards";
        element.style.animation = `fade-in ${duration}ms ease-out`;
        element.classList.remove(this._hiddenClassName);

        return new Promise((resolve) => {
            setTimeout(() => {
                element.style.removeProperty("animation-fill-mode");
                element.style.removeProperty("animation");
                resolve();
            }, duration + 10);
        });
    }

    fadeOut(element, duration) {
        element.style.animationFillMode = "forwards";
        element.style.animation = `fade-out ${duration}ms ease-out`;

        return new Promise((resolve) => {
            setTimeout(() => {
                element.classList.add(this._hiddenClassName);
                element.style.removeProperty("animation-fill-mode");
                element.style.removeProperty("animation");
                resolve();
            }, duration + 10);
        });
    }
}
