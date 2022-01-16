import userModel from "../model/userModel";
import mainView from "../view/mainView";
import { fetchWithUserCredentials, getUserStats } from "../helpers/helpers";
import { USER_DATA_ENDPOINT } from "../config/configuration";
import Controller from "./controller";
import profileView from "../view/profileView";

class ProfileController extends Controller {
    #isInfoFilled = false;
    #isPasswordAreaShown = false;
    #isNicknameAreaShown = false;

    constructor() {
        super("#profile-overview", profileView);
    }

    registerEventHandlers() {
        this.view.rootElement.addEventListener("sectionfocus", e => {
            if (this.#isInfoFilled) return;
            this.#filloutUserInfo();
            this.#filloutUserStats();
            this.#isInfoFilled = true;
        });
        this.view.logoutButton.addEventListener("click", e =>
            this.#logoutUser()
        );
        this.view.deleteAccountButton.addEventListener("click", e =>
            this.#deleteAccount()
        );
        this.view.changePasswordButton.addEventListener("click", e =>
            this.#changePassword()
        );
        this.view.changeNicknameButton.addEventListener("click", e =>
            this.#changeNickname()
        );
    }

    #logoutUser() {
        this.view.clearUserInfoAndStats();
        this.#isInfoFilled = false;
        userModel.appUser = null;
        userModel.isLoggedIn = false;
        mainView.hideProfileButton(true);
        mainView.showLoginButton(true);
        location.hash = "#home";
    }

    #deleteAccount() {
        fetchWithUserCredentials(
            `${USER_DATA_ENDPOINT}/${userModel.appUser.username}/data`,
            userModel.appUser.username,
            userModel.appUser.password,
            { method: "delete", mode: "cors" }
        )
            .then(result => {
                if (!result.ok)
                    throw new Error("Couldn't delete this account now");
                alert("Account successfully deleted!");
                this.#logoutUser();
            })
            .catch(reason => this.view.showErrorMessage(reason.message));
    }

    #changePassword() {
        if (this.#isPasswordAreaShown || this.#isNicknameAreaShown) return;
        this.view.showPasswordUpdateForm(
            e => {
                e.preventDefault();

                if (this.view.oldPassValue !== userModel.appUser.password) {
                    this.view.showErrorMessage(
                        "Error",
                        "Current password value isn't correct"
                    );
                    return;
                } else if (this.view.newPassValue === this.view.oldPassValue) {
                    this.view.showErrorMessage(
                        "Error",
                        "New password cannot be the same as the previous one"
                    );
                    return;
                }

                this.#savePasswordChange()
                    .then(_ => {
                        this.view.closePasswordUpdateForm();
                        this.view.showSuccessMessage("Success!");
                        this.#isPasswordAreaShown = false;
                    })
                    .catch(reason =>
                        this.view.showErrorMessage("Error", reason.message)
                    );
            },
            e => {
                e.preventDefault();
                this.view.closePasswordUpdateForm();
                this.#isPasswordAreaShown = false;
            }
        );
        this.#isPasswordAreaShown = true;
    }

    #changeNickname() {
        if (this.#isNicknameAreaShown || this.#isPasswordAreaShown) return;
        this.view.showNicknameUpdateForm(
            e => {
                e.preventDefault();

                if (this.view.newNicknameValue === userModel.appUser.username) {
                    this.view.closeNicknameUpdateForm();
                    return;
                }

                this.#saveNicknameChange()
                    .then(_ => {
                        this.#filloutUserInfo();
                        this.view.closeNicknameUpdateForm();
                        this.view.showSuccessMessage("Success!");
                        this.#isNicknameAreaShown = false;
                    })
                    .catch(reason =>
                        this.view.showErrorMessage("Error", reason.message)
                    );
            },
            e => {
                e.preventDefault();
                this.view.closeNicknameUpdateForm();
                this.#isNicknameAreaShown = false;
            }
        );
        this.#isNicknameAreaShown = true;
    }

    #savePasswordChange() {
        const payload = new FormData();
        payload.set("password", this.view.newPassValue);

        return fetchWithUserCredentials(
            `${USER_DATA_ENDPOINT}/${userModel.appUser.username}/password`,
            userModel.appUser.username,
            userModel.appUser.password,
            { method: "post", mode: "cors", body: payload }
        ).then(response => {
            if (!response.ok)
                throw new Error(
                    "There were some problems while saving your new password"
                );
            userModel.appUser.password = this.view.newPassValue;
        });
    }

    #saveNicknameChange() {
        const payload = new FormData();
        payload.set("newNickname", this.view.newNicknameValue);

        return fetchWithUserCredentials(
            `${USER_DATA_ENDPOINT}/${userModel.appUser.username}/nickname`,
            userModel.appUser.username,
            userModel.appUser.password,
            { method: "post", mode: "cors", body: payload }
        ).then(response => {
            if (!response.ok)
                throw new Error(
                    "There were some problems while saving your new nickname"
                );
            userModel.appUser.username = this.view.newNicknameValue;
        });
    }

    #filloutUserInfo() {
        this.view.profileDescription.insertAdjacentHTML(
            "afterbegin",
            `Hello, <b>${userModel.appUser.username}</b>. You should add some workouts!`
        );
    }

    #filloutUserStats() {
        const userStats = getUserStats(userModel.appUser);

        if (userStats.workoutCount === 0) {
            this.view.profileStats.insertAdjacentHTML(
                "afterbegin",
                `<h2>Your stats:</h2>
                      <ul><li>You don't have any workouts saved yet.</li></ul>`
            );
            return;
        }

        this.view.profileStats.insertAdjacentHTML(
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
