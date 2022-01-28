import userModel from "../model/userModel";
import mainView from "../view/mainView";
import { fetchWithUserCredentials, getUserStats } from "../helpers/helpers";
import { USER_DATA_ENDPOINT } from "../config/configuration";
import Controller from "./controller";
import profileView from "../view/profileView";
import realUserModel from "../model/realUserModel";

class ProfileController extends Controller {
    private _isInfoFilled = false;
    private _isPasswordAreaShown = false;
    private _isNicknameAreaShown = false;

    constructor() {
        super("#profile-overview", profileView);
    }

    initialize() {
        profileView.rootElement.addEventListener("sectionfocus", e => {
            if (this._isInfoFilled) return;
            this.filloutUserInfo();
            this.filloutUserStats();
            this._isInfoFilled = true;
        });
        profileView.logoutButton.addEventListener("click", e =>
            this.logoutUser()
        );
        profileView.deleteAccountButton.addEventListener("click", e =>
            this.deleteAccount()
        );
        profileView.changePasswordButton.addEventListener("click", e =>
            this.changePassword()
        );
        profileView.changeNicknameButton.addEventListener("click", e =>
            this.changeNickname()
        );
        profileView.workoutsButton.addEventListener("click", e => {
            location.hash = "#workouts";
        });
    }

    private logoutUser() {
        profileView.clearUserInfoAndStats();
        this._isInfoFilled = false;
        realUserModel.appUser = null;
        realUserModel.isUserLoggedIn = false;
        mainView.hideProfileButton(true);
        mainView.showLoginButton(true);
        mainView.showDemoButton(true);
        location.hash = "#home";
    }

    private deleteAccount() {
        fetchWithUserCredentials(
            `${USER_DATA_ENDPOINT}/${realUserModel.appUser.username}/data`,
            realUserModel.appUser.username,
            realUserModel.appUser.password,
            { method: "delete", mode: "cors" }
        )
            .then(result => {
                if (!result.ok)
                    throw new Error("Couldn't delete this account now");
                alert("Account successfully deleted!");
                this.logoutUser();
            })
            .catch(reason => profileView.showErrorMessage(reason.message));
    }

    private changePassword() {
        if (this._isPasswordAreaShown || this._isNicknameAreaShown) return;
        profileView.showPasswordUpdateForm(
            e => {
                e.preventDefault();

                if (
                    profileView.oldPassValue !== realUserModel.appUser.password
                ) {
                    profileView.showErrorMessage(
                        "Error",
                        "Current password value isn't correct"
                    );
                    return;
                } else if (
                    profileView.newPassValue === profileView.oldPassValue
                ) {
                    profileView.showErrorMessage(
                        "Error",
                        "New password cannot be the same as the previous one"
                    );
                    return;
                }

                this.savePasswordChange()
                    .then(_ => {
                        profileView.closePasswordUpdateForm();
                        profileView.showSuccessMessage("Success!");
                        this._isPasswordAreaShown = false;
                    })
                    .catch(reason =>
                        profileView.showErrorMessage("Error", reason.message)
                    );
            },
            e => {
                e.preventDefault();
                profileView.closePasswordUpdateForm();
                this._isPasswordAreaShown = false;
            }
        );
        this._isPasswordAreaShown = true;
    }

    private changeNickname() {
        if (this._isNicknameAreaShown || this._isPasswordAreaShown) return;
        profileView.showNicknameUpdateForm(
            e => {
                e.preventDefault();

                if (
                    profileView.newNicknameValue ===
                    realUserModel.appUser.username
                ) {
                    profileView.closeNicknameUpdateForm();
                    return;
                }

                this.saveNicknameChange()
                    .then(_ => {
                        this.filloutUserInfo();
                        profileView.closeNicknameUpdateForm();
                        profileView.showSuccessMessage("Success!");
                        this._isNicknameAreaShown = false;
                    })
                    .catch(reason =>
                        profileView.showErrorMessage("Error", reason.message)
                    );
            },
            e => {
                e.preventDefault();
                profileView.closeNicknameUpdateForm();
                this._isNicknameAreaShown = false;
            }
        );
        this._isNicknameAreaShown = true;
    }

    private savePasswordChange() {
        const payload = new FormData();
        payload.set("password", profileView.newPassValue);

        return fetchWithUserCredentials(
            `${USER_DATA_ENDPOINT}/${realUserModel.appUser.username}/password`,
            realUserModel.appUser.username,
            realUserModel.appUser.password,
            { method: "post", mode: "cors", body: payload }
        ).then(response => {
            if (!response.ok)
                throw new Error(
                    "There were some problems while saving your new password"
                );
            realUserModel.appUser.password = profileView.newPassValue;
        });
    }

    private saveNicknameChange() {
        const payload = new FormData();
        payload.set("newNickname", profileView.newNicknameValue);

        return fetchWithUserCredentials(
            `${USER_DATA_ENDPOINT}/${realUserModel.appUser.username}/nickname`,
            realUserModel.appUser.username,
            realUserModel.appUser.password,
            { method: "post", mode: "cors", body: payload }
        ).then(response => {
            if (!response.ok)
                throw new Error(
                    "There were some problems while saving your new nickname"
                );
            realUserModel.appUser.username = profileView.newNicknameValue;
        });
    }

    private filloutUserInfo() {
        profileView.profileDescription.insertAdjacentHTML(
            "afterbegin",
            `Hello, <b>${realUserModel.appUser.username}</b>. You should add some workouts!`
        );
    }

    private filloutUserStats() {
        const userStats = getUserStats(realUserModel.appUser);

        if (userStats.workoutCount === 0) {
            profileView.profileStats.insertAdjacentHTML(
                "afterbegin",
                `<h2>Your stats:</h2>
                      <ul><li>You don't have any workouts saved yet.</li></ul>`
            );
            return;
        }

        profileView.profileStats.insertAdjacentHTML(
            "afterbegin",
            `<h2>Your stats:</h2>
                <ul>
                    <li>You had ${userStats.workoutCount} workouts total</li> 
                    <li>${
                        userStats.workoutTotalDistance
                    }[m] is total distance you have accumulated while doing your workouts</li> 
                    <li>Your most active month was ${new Date(
                        0,
                        userStats.mostActiveMonth - 1
                    ).toLocaleDateString(undefined, {
                        month: "long",
                    })}</li> 
              </ul>`
        );
    }
}
export default new ProfileController();
