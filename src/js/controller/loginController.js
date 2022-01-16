import { USER_DATA_ENDPOINT } from "../config/configuration";
import userModel from "../model/userModel";
import AppUser from "../data/appUser";
import { dbWorkoutToJS, fetchWithUserCredentials } from "../helpers/helpers";
import mainView from "../view/mainView";
import Controller from "./controller";
import loginView from "../view/loginView";

class LoginController extends Controller {
    constructor() {
        super("#login", loginView);
    }

    registerEventHandlers() {
        this.view.addEventListenerLoginSubmitButton("click", event => {
            event.preventDefault();
            if (userModel.isLoggedIn) return;
            this.#loadUserProfileData(this.view.getLoginFormData())
                .then(() => this.#redirectToUserProfilePage())
                .then(() => mainView.showProfileButton(true))
                .then(() => mainView.hideLoginButton(true))
                .catch(reason => this.#handleLoginError(reason.message));
        });
    }

    #loadUserProfileData(loginFormData) {
        const username = loginFormData.get("username");
        const password = loginFormData.get("password");

        return fetchWithUserCredentials(
            `${USER_DATA_ENDPOINT}/${username}/data`,
            username,
            password,
            {
                method: "GET",
                mode: "cors",
            }
        )
            .then(response => {
                if (!response.ok) throw new Error(response.statusText);
                return response.json();
            })
            .then(userData => {
                this.processFetchedUserData(userData, password);
            });
    }

    processFetchedUserData(userData, password) {
        const jsWorkouts = userData.workouts
            ? userData.workouts.map(value => dbWorkoutToJS(value))
            : [];

        userModel.appUser = new AppUser(
            userData.nickname,
            password,
            jsWorkouts
        );
        userModel.appUser.email = userData.email;
        userModel.isLoggedIn = true;
    }

    #redirectToUserProfilePage() {
        location.hash = "#profile-overview";
    }

    #handleLoginError(msg) {
        this.view.clearLoginForm();
        this.view.showLoginErrorInfo(msg);
    }
}
export default new LoginController();
