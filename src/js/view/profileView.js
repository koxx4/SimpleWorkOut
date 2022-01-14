import { View } from "./view";

class ProfileView extends View {
    #workoutsButton;
    #changePasswordButton;
    #changeNicknameButton;
    #deleteAccountButton;
    #logoutButton;
    #profileDescription;
    #profileStats;

    constructor() {
        super(document.querySelector("#profile-overview-section"));
        this.#workoutsButton = this.rootElement.querySelector(
            ".profile-overview__actions__workouts-button"
        );
        this.#changePasswordButton = this.rootElement.querySelector(
            ".profile-overview__actions__change-pass-button"
        );
        this.#changeNicknameButton = this.rootElement.querySelector(
            ".profile-overview__actions__change-nick-button"
        );
        this.#deleteAccountButton = this.rootElement.querySelector(
            ".profile-overview__actions__delete-account-button"
        );
        this.#profileDescription = this.rootElement.querySelector(
            ".profile-overview__content__info"
        );
        this.#profileStats = this.rootElement.querySelector(
            ".profile-overview__stats"
        );
        this.#logoutButton = this.rootElement.querySelector(
            ".profile-overview__actions__logout-button"
        );
    }

    get workoutsButton() {
        return this.#workoutsButton;
    }

    get changePasswordButton() {
        return this.#changePasswordButton;
    }

    get changeNicknameButton() {
        return this.#changeNicknameButton;
    }

    get deleteAccountButton() {
        return this.#deleteAccountButton;
    }

    get profileDescription() {
        return this.#profileDescription;
    }

    get profileStats() {
        return this.#profileStats;
    }

    get logoutButton() {
        return this.#logoutButton;
    }
}

export default new ProfileView();
