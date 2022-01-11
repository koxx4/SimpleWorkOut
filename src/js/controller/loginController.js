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
            this.#loadUserProfileData(loginView.getLoginFormData()).then(() =>
                this.#redirectToUserProfilePage()
            );
        });
    }

    #loadUserProfileData(loginFormData) {
        const username = loginFormData.get("username");
        const password = loginFormData.get("password");
        console.log(username + " | " + password);
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
                return response.json();
            })
            .then((userData) => {
                const jsWorkouts = userData.workouts
                    ? userData.workouts.map((value) => dbWorkoutToJS(value))
                    : [];

                userModel.appUser = new AppUser(
                    userData.nickname,
                    password,
                    jsWorkouts
                );
                userModel.appUser.email = userData.email;
            });
    }

    #redirectToUserProfilePage() {
        location.href = "/#profile-overview";
    }
}
export default new LoginController();
