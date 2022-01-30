import { USER_DATA_ENDPOINT } from "../config/configuration";
import AppUser from "../data/appUser";
import { dbWorkoutToJS, fetchWithUserCredentials } from "../helpers/helpers";
import mainView from "../view/mainView";
import Controller from "./controller";
import loginView from "../view/loginView";
import realUserModel from "../model/realUserModel";

class LoginController extends Controller {
    constructor() {
        super("#login", loginView);
    }

    initialize() {
        loginView.addEventListenerLoginSubmitButton("click", event => {
            event.preventDefault();
            if (realUserModel.isUserLoggedIn) return;
            this.loadUserProfileData(loginView.getLoginFormData())
                .then(() => this.redirectToUserProfilePage())
                .then(() => mainView.showProfileButton(true))
                .then(() => {
                    mainView.hideLoginButton(false);
                    return mainView.hideDemoButton(false);
                })
                .catch(reason => this.handleLoginError(reason.message));
        });
    }

    private loadUserProfileData(loginFormData: FormData) {
        const username = loginFormData.get("username").toString();
        const password = loginFormData.get("password").toString();

        loginView.showLoadingSpinner();
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
                loginView.hideLoadingSpinner();
                if (!response.ok) throw new Error(response.statusText);
                return response.json();
            })
            .then(userData => {
                this.processFetchedUserData(userData, password);
            });
    }

    processFetchedUserData(userData, password) {
        const jsWorkouts = userData.workouts
            ? userData.workouts.map((value, index) =>
                  dbWorkoutToJS(value, index)
              )
            : [];

        realUserModel.appUser = new AppUser(
            userData.nickname,
            password,
            jsWorkouts
        );
        realUserModel.appUser.email = userData.email;
        realUserModel.isUserLoggedIn = true;
    }

    private redirectToUserProfilePage() {
        location.hash = "#profile-overview";
    }

    private handleLoginError(msg: string) {
        loginView.clearLoginForm();
        loginView.showLoginErrorInfo(msg);
    }
}
export default new LoginController();
