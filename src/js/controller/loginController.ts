import { fetchUserToken, fetchAndConvertAppUserData } from "../helpers/helpers";
import mainView from "../view/mainView";
import Controller from "./controller";
import loginView from "../view/loginView";
import realUserModel from "../model/realUserModel";
import { TokenNotValidError } from "../config/configuration";

export class LoginController extends Controller {
    private _isLoginRequestSent: boolean;

    constructor() {
        super("#login", loginView);
    }

    initialize() {
        loginView.addEventListenerLoginSubmitButton("click", event => {
            event.preventDefault();

            if (realUserModel.isUserLoggedIn || this._isLoginRequestSent)
                return;

            const loginData = loginView.getLoginFormData();
            const username = loginData.get("username").toString();
            const password = loginData.get("password").toString();

            this._isLoginRequestSent = true;
            loginView.showLoadingSpinner();
            fetchUserToken(username, password)
                .then(token => {
                    if (token.length <= 0)
                        return Promise.reject("Server problem");

                    realUserModel.token = token;

                    return fetchAndConvertAppUserData(token);
                })
                .then(appUser => {
                    realUserModel.isUserLoggedIn = true;
                    realUserModel.appUser = appUser;
                    loginView.hideLoadingSpinner();
                })
                .then(() => this.redirectToUserProfilePage())
                .then(() => mainView.showProfileButton(true))
                .then(() => {
                    this._isLoginRequestSent = false;
                    loginView.clearLoginForm();
                    mainView.hideLoginButton(false);
                    mainView.hideDemoButton(false);
                })
                .catch(reason => {
                    this._isLoginRequestSent = false;
                    this.handleLoginError("Maybe incorrect password or login?");
                });
        });
    }

    private redirectToUserProfilePage() {
        location.hash = "#profile-overview";
    }

    private handleLoginError(msg: string) {
        loginView.clearLoginForm();
        loginView.showLoginErrorInfo(msg);
        loginView.hideLoadingSpinner();
    }

    public static relogin() {
        location.hash = "#login";
        realUserModel.isUserLoggedIn = false;
        realUserModel.appUser = null;
        realUserModel.isUserLoggedIn = false;
        realUserModel.token = "";
        mainView.showLoginButton(false);
        mainView.showDemoButton(false);
        mainView.hideProfileButton(false);
        loginView.showLoginErrorInfo(
            "Your session expired, you need to login again"
        );
    }

    public static async tryToAutoLogin() {
        const token = realUserModel.token;

        if (!token) throw new Error("Could not auto-login");

        try {
            realUserModel.appUser = await fetchAndConvertAppUserData(token);
        } catch (error) {
            if (error instanceof TokenNotValidError) realUserModel.token = "";
            throw error;
        }
        realUserModel.isUserLoggedIn = true;
        mainView.hideLoginButton(false);
        mainView.hideDemoButton(false);
        mainView.showProfileButton(false);
        location.hash = "#profile-overview";
    }
}
export default new LoginController();
