import { View } from "./view";
import { createAlertCard, showModal } from "../helpers/helpers";

class ProfileView extends View {
    private _workoutsButton;
    private _changePasswordButton;
    private _changeNicknameButton;
    private _deleteAccountButton;
    private _logoutButton;
    private _profileDescription;
    private _profileStats;
    private _updatePasswordArea;
    private _updateNicknameArea;

    constructor() {
        super(document.querySelector("#profile-overview-section"));
        this._workoutsButton = this.rootElement.querySelector(
            ".profile-overview__actions__workouts-button"
        );
        this._changePasswordButton = this.rootElement.querySelector(
            ".profile-overview__actions__change-pass-button"
        );
        this._changeNicknameButton = this.rootElement.querySelector(
            ".profile-overview__actions__change-nick-button"
        );
        this._deleteAccountButton = this.rootElement.querySelector(
            ".profile-overview__actions__delete-account-button"
        );
        this._profileDescription = this.rootElement.querySelector(
            ".profile-overview__content__info"
        );
        this._profileStats = this.rootElement.querySelector(
            ".profile-overview__stats"
        );
        this._logoutButton = this.rootElement.querySelector(
            ".profile-overview__actions__logout-button"
        );
    }

    clearUserInfoAndStats() {
        this._profileStats.innerHTML = "";
        this._profileDescription.innerHTML = "";
    }

    clearUserInfo() {
        this._profileDescription.innerHTML = "";
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
        this._updatePasswordArea = this.rootElement.querySelector(
            ".change-password-card"
        );
        this._updatePasswordArea.scrollIntoView({ behavior: "smooth" });
        this._updatePasswordArea
            .querySelector(".password-confirm")
            .addEventListener("click", confirmCallback);
        this._updatePasswordArea
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
        this._updateNicknameArea = this.rootElement.querySelector(
            ".change-nickname-card"
        );
        this._updateNicknameArea.scrollIntoView({ behavior: "smooth" });
        this._updateNicknameArea
            .querySelector(".nickname-confirm")
            .addEventListener("click", confirmCallback);
        this._updateNicknameArea
            .querySelector(".nickname-cancel")
            .addEventListener("click", cancelCallback);
    }

    closeNicknameUpdateForm() {
        this.removeElementFromThisView(".change-nickname-card");
    }

    showErrorMessage(title: string, msg?: string) {
        showModal(title, msg ? msg : title, "error");
    }

    showSuccessMessage(title: string, msg?: string) {
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
        return this._workoutsButton;
    }

    get changePasswordButton() {
        return this._changePasswordButton;
    }

    get changeNicknameButton() {
        return this._changeNicknameButton;
    }

    get deleteAccountButton() {
        return this._deleteAccountButton;
    }

    get profileDescription() {
        return this._profileDescription;
    }

    get profileStats() {
        return this._profileStats;
    }

    get logoutButton() {
        return this._logoutButton;
    }

    get updatePasswordForm() {
        return this._updatePasswordArea?.querySelector(".change-password-form");
    }

    get updateNicknameForm() {
        return this._updateNicknameArea?.querySelector(".change-nickname-form");
    }
}

export default new ProfileView();
