import mainView from "../view/mainView";
import { fetchWithUserToken, getUserStats, metersToKilometersFormatted } from "../helpers/helpers";
import {
    TokenNotValidError,
    USER_DATA_ENDPOINT,
} from "../config/configuration";
import Controller from "./controller";
import profileView from "../view/profileView";
import realUserModel from "../model/realUserModel";
import { LoginController } from "./loginController";

class ProfileController extends Controller {
    private _isInfoFilled = false;
    private _isPasswordAreaShown = false;
    private _isNicknameAreaShown = false;

    constructor() {
        super("#profile-overview", profileView);
    }

    initialize() {
        profileView.rootElement.addEventListener("sectionfocus", e => {
            if (!realUserModel.isUserLoggedIn) location.hash = "#home";
            profileView.clearUserInfoAndStats();
            this.filloutUserInfo();
            this.filloutUserStats();
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
        realUserModel.token = "";
        mainView.hideProfileButton(true);
        mainView.showLoginButton(true);
        mainView.showDemoButton(true);
        location.hash = "#home";
    }

    private deleteAccount() {
        fetchWithUserToken(`${USER_DATA_ENDPOINT}/data`, realUserModel.token, {
            method: "delete",
            mode: "cors",
        })
            .then(result => {
                if (!result.ok)
                    throw new Error("Couldn't delete this account now");

                alert("Account successfully deleted!");
                this.logoutUser();
            })
            .catch(reason => {
                if (reason instanceof TokenNotValidError)
                    this.tokenErrorRoutine();
                profileView.showErrorMessage(reason.message);
            });
    }

    private changePassword() {
        if (this._isPasswordAreaShown || this._isNicknameAreaShown) return;
        profileView.showPasswordUpdateForm(
            e => {
                e.preventDefault();

                if (profileView.newPassValue === profileView.oldPassValue) {
                    profileView.showErrorMessage(
                        "Error",
                        "New password cannot be the same as the previous one"
                    );
                    return;
                }

                this.savePasswordChange().then(_ => {
                    profileView.closePasswordUpdateForm();
                    profileView.showSuccessMessage("Success!");
                    this._isPasswordAreaShown = false;
                });
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

                this.saveNicknameChange().then(_ => {
                    this.filloutUserInfo();
                    profileView.closeNicknameUpdateForm();
                    profileView.showSuccessMessage("Success!");
                    this._isNicknameAreaShown = false;
                });
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
        payload.set("oldPassword", profileView.oldPassValue);
        payload.set("newPassword", profileView.newPassValue);

        return fetchWithUserToken(
            `${USER_DATA_ENDPOINT}/password`,
            realUserModel.token,
            { method: "post", mode: "cors", body: payload }
        )
            .then(response => {
                if (response.status === 400)
                    throw new Error("You provided wrong old password");
                if (!response.ok)
                    throw new Error(
                        "There were some problems while saving your new password"
                    );
            })
            .catch(reason => {
                if (reason instanceof TokenNotValidError) {
                    this.tokenErrorRoutine();
                    return Promise.reject(reason);
                }
                profileView.showErrorMessage(reason.message);
                return Promise.reject(reason);
            });
    }

    private saveNicknameChange() {
        const payload = new FormData();
        payload.set("newNickname", profileView.newNicknameValue);

        return fetchWithUserToken(
            `${USER_DATA_ENDPOINT}/nickname`,
            realUserModel.token,
            { method: "post", mode: "cors", body: payload }
        )
            .then(response => {
                if (!response.ok)
                    throw new Error(
                        "There were some problems while saving your new nickname"
                    );
                realUserModel.appUser.username = profileView.newNicknameValue;
            })
            .catch(reason => {
                if (reason instanceof TokenNotValidError) {
                    this.tokenErrorRoutine();
                    return Promise.reject(reason);
                }
                profileView.showErrorMessage(reason.message);
                return Promise.reject(reason);
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

        let distance: any = userStats.workoutTotalDistance;
        if (distance >= 10000) distance = metersToKilometersFormatted(distance, 3);

        profileView.profileStats.insertAdjacentHTML(
            "afterbegin",
            `<h2>Your stats:</h2>
                <ul>
                    <li>You had ${userStats.workoutCount} workouts total</li> 
                    <li>${
                        distance
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

    private tokenErrorRoutine() {
        profileView.clearUserInfoAndStats();
        this._isInfoFilled = false;
        LoginController.relogin();
    }
}
export default new ProfileController();
