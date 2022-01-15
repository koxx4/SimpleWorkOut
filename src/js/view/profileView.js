import { View } from "./view";
import { createAlertCard } from "../helpers/helpers";

class ProfileView extends View {
    #workoutsButton;
    #changePasswordButton;
    #changeNicknameButton;
    #deleteAccountButton;
    #logoutButton;
    #profileDescription;
    #profileStats;
    #updatePasswordArea;
    #updateNicknameArea;

    constructor() {
        super(document.querySelector("#profile-overview-section"));
        this.#workoutsButton = this.rootElement.querySelector(
            ".profile-overview__actions__workouts-button"
        );
        this.#changePasswordButton = this.rootElement.querySelector(
            ".profile-overview__actions__change-pass-button"
        );
        this.#changeNicknameButton = this.rootElement.querySelector(
            ".profile-overview__actions__change-nick-button"
        );
        this.#deleteAccountButton = this.rootElement.querySelector(
            ".profile-overview__actions__delete-account-button"
        );
        this.#profileDescription = this.rootElement.querySelector(
            ".profile-overview__content__info"
        );
        this.#profileStats = this.rootElement.querySelector(
            ".profile-overview__stats"
        );
        this.#logoutButton = this.rootElement.querySelector(
            ".profile-overview__actions__logout-button"
        );
    }

    clearUserInfoAndStats() {
        this.#profileStats.innerHTML = "";
        this.#profileDescription.innerHTML = "";
    }

    showPasswordUpdateForm(confirmCallback, cancelCallback) {
        this.rootElement.insertAdjacentHTML(
            "beforeend",
            `<div class="text-card change-password-card m1">
    <h3>Change your password:</h3>
    <form class="change-password-form flex-form">
        <div class="input-group">
            <label for="current-pass">Type in your current password</label>
            <input type="password" class="input-alphanumeric" name="current-pass"/>
        </div>
        <div class="input-group">
            <label for="new-pass">Type in your new password</label>
            <input type="password" class="input-alphanumeric" name="new-pass"/>
        </div>
        <input type="submit" class="button-warning password-confirm" value="Confirm"/>
        <button class="button-warning password-cancel">Cancel</button>
    </form>
</div>`
        );
        this.#updatePasswordArea = this.rootElement.querySelector(
            ".change-password-card"
        );
        this.#updatePasswordArea
            .querySelector(".password-confirm")
            .addEventListener("click", confirmCallback);
        this.#updatePasswordArea
            .querySelector(".password-cancel")
            .addEventListener("click", cancelCallback);
    }

    closePasswordUpdateForm() {
        this.removeElementFromThisView(".change-password-card");
    }

    showNicknameUpdateForm(confirmCallback, cancelCallback) {
        this.rootElement.insertAdjacentHTML(
            "beforeend",
            `
<div class="text-card change-nickname-card m1">
    <h3>Change your nickname:</h3>
    <form class="change-nickname-form flex-form">
        <div class="input-group">
            <label for="new-nickname">Type in your new username</label>
            <input type="text" class="input-alphanumeric" name="new-nickname"/>
        </div>
        <input type="submit" class="button-warning nickname-confirm" value="Confirm"/>
        <button class="button-warning nickname-cancel">Cancel</button>
    </form>
</div>
`
        );
        this.#updateNicknameArea = this.rootElement.querySelector(
            ".change-nickname-card"
        );
        this.#updateNicknameArea
            .querySelector(".nickname-confirm")
            .addEventListener("click", confirmCallback);
        this.#updateNicknameArea
            .querySelector(".nickname-cancel")
            .addEventListener("click", cancelCallback);
    }

    closeNicknameUpdateForm() {
        this.removeElementFromThisView(".change-nickname-card");
    }

    showErrorMessage(title, msg) {
        this.rootElement
            .querySelector(".profile-text-card")
            .insertAdjacentElement(
                "afterend",
                createAlertCard(title, msg, "error")
            );
    }

    showSuccessMessage(title, msg) {
        this.rootElement
            .querySelector(".profile-text-card")
            .insertAdjacentElement(
                "afterend",
                createAlertCard(title, msg, "success")
            );
    }

    get oldPassValue() {
        return this.updatePasswordForm?.elements["current-pass"].value;
    }

    get newPassValue() {
        return this.updatePasswordForm?.elements["new-pass"].value;
    }

    get newNicknameValue() {
        return this.updateNicknameForm?.elements["new-nickname"].value;
    }

    get workoutsButton() {
        return this.#workoutsButton;
    }

    get changePasswordButton() {
        return this.#changePasswordButton;
    }

    get changeNicknameButton() {
        return this.#changeNicknameButton;
    }

    get deleteAccountButton() {
        return this.#deleteAccountButton;
    }

    get profileDescription() {
        return this.#profileDescription;
    }

    get profileStats() {
        return this.#profileStats;
    }

    get logoutButton() {
        return this.#logoutButton;
    }

    get updatePasswordForm() {
        return this.#updatePasswordArea?.querySelector(".change-password-form");
    }

    get updateNicknameForm() {
        return this.#updateNicknameArea?.querySelector(".change-nickname-form");
    }
}

export default new ProfileView();
