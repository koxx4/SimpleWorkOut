import loginView from "../view/loginView";
import { USER_DATA_ENDPOINT } from "../config/configuration";
import userModel from "../model/userModel";
import AppUser from "../data/appUser";
import { dbWorkoutToJS } from "../helpers/helpers";

class LoginController {
    constructor() {}

    registerEventHandlers() {
        loginView.addEventListenerLoginSubmitButton("click", (event) => {
            event.preventDefault();
            this.#loadUserProfileData(loginView.getLoginFormData())
                .then(() => this.#redirectToUserProfilePage())
                .catch((reason) => this.#handleLoginError(reason.message));
        });
    }

    #loadUserProfileData(loginFormData) {
        const username = loginFormData.get("username");
        const password = loginFormData.get("password");

        const httpBasicHeaderValue =
            "Basic " +
            Buffer.from(`${username}:${password}`).toString("base64");

        const reqHeaders = new Headers();
        reqHeaders.set("Authorization", httpBasicHeaderValue);

        return fetch(`${USER_DATA_ENDPOINT}/${username}/data`, {
            headers: reqHeaders,
            method: "GET",
            mode: "cors",
        })
            .then((response) => {
                if (!response.ok) throw new Error(response.statusText);
                return response.json();
            })
            .then((userData) => {
                this.processFetchedUserData(userData, password);
            });
    }

    processFetchedUserData(userData, password) {
        const jsWorkouts = userData.workouts
            ? userData.workouts.map((value) => dbWorkoutToJS(value))
            : [];

        userModel.appUser = new AppUser(
            userData.nickname,
            password,
            jsWorkouts
        );
        userModel.appUser.email = userData.email;
    }

    #redirectToUserProfilePage() {
        location.hash = "#profile-overview";
    }

    #handleLoginError(msg) {
        loginView.clearLoginForm();
        loginView.showRegistrationErrorInfo(msg);
    }
}
export default new LoginController();
