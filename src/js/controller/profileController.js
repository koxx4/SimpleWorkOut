import profileView from "../view/profileView";
import userModel from "../model/userModel";
import mainView from "../view/mainView";
import { fetchWithUserCredentials, getUserStats } from "../helpers/helpers";
import { USER_DATA_ENDPOINT } from "../config/configuration";

class ProfileController {
    #isInfoFilled = false;
    #isPasswordAreaShown = false;
    #isNicknameAreaShown = false;

    constructor() {}

    registerEventHandlers() {
        profileView.rootElement.addEventListener("sectionfocus", e => {
            if (this.#isInfoFilled) return;
            this.#filloutUserInfo();
            this.#filloutUserStats();
            this.#isInfoFilled = true;
        });
        profileView.logoutButton.addEventListener("click", e =>
            this.#logoutUser()
        );
        profileView.deleteAccountButton.addEventListener("click", e =>
            this.#deleteAccount()
        );
        profileView.changePasswordButton.addEventListener("click", e =>
            this.#changePassword()
        );
        profileView.changeNicknameButton.addEventListener("click", e =>
            this.#changeNickname()
        );
    }

    #logoutUser() {
        profileView.clearUserInfoAndStats();
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
            .catch(reason => profileView.showErrorMessage(reason.message));
    }

    #changePassword() {
        if (this.#isPasswordAreaShown || this.#isNicknameAreaShown) return;
        profileView.showPasswordUpdateForm(
            e => {
                e.preventDefault();

                if (profileView.oldPassValue !== userModel.appUser.password) {
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

                this.#savePasswordChange()
                    .then(_ => {
                        profileView.closePasswordUpdateForm();
                        profileView.showSuccessMessage("Success!");
                        this.#isPasswordAreaShown = false;
                    })
                    .catch(reason =>
                        profileView.showErrorMessage("Error", reason.message)
                    );
            },
            e => {
                e.preventDefault();
                profileView.closePasswordUpdateForm();
                this.#isPasswordAreaShown = false;
            }
        );
        this.#isPasswordAreaShown = true;
    }

    #changeNickname() {
        if (this.#isNicknameAreaShown || this.#isPasswordAreaShown) return;
        profileView.showNicknameUpdateForm(
            e => {
                e.preventDefault();

                if (
                    profileView.newNicknameValue === userModel.appUser.username
                ) {
                    profileView.closeNicknameUpdateForm();
                    return;
                }

                this.#saveNicknameChange()
                    .then(_ => {
                        this.#filloutUserInfo();
                        profileView.closeNicknameUpdateForm();
                        profileView.showSuccessMessage("Success!");
                        this.#isNicknameAreaShown = false;
                    })
                    .catch(reason =>
                        profileView.showErrorMessage("Error", reason.message)
                    );
            },
            e => {
                e.preventDefault();
                profileView.closeNicknameUpdateForm();
                this.#isNicknameAreaShown = false;
            }
        );
        this.#isNicknameAreaShown = true;
    }

    #savePasswordChange() {
        const payload = new FormData();
        payload.set("password", profileView.newPassValue);

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
            userModel.appUser.password = profileView.newPassValue;
        });
    }

    #saveNicknameChange() {
        const payload = new FormData();
        payload.set("newNickname", profileView.newNicknameValue);

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
            userModel.appUser.username = profileView.newNicknameValue;
        });
    }

    #filloutUserInfo() {
        profileView.profileDescription.textContent = `Hello, ${userModel.appUser.username}. You should add some workouts!`;
    }

    #filloutUserStats() {
        const userStats = getUserStats(userModel.appUser);

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
