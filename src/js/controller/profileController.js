import profileView from "../view/profileView";
import userModel from "../model/userModel";
import mainView from "../view/mainView";
import { getUserStats } from "../helpers/helpers";

class ProfileController {
    constructor() {}

    registerEventHandlers() {
        profileView.rootElement.addEventListener("sectionfocus", e => {
            this.#filloutUserInfo();
            this.#filloutUserStats();
        });
        profileView.logoutButton.addEventListener("click", e =>
            this.#logoutUser()
        );
    }

    #logoutUser() {
        userModel.appUser = null;
        userModel.isLoggedIn = false;
        mainView.hideProfileButton(true);
        location.hash = "#home";
    }

    #filloutUserInfo() {
        profileView.profileDescription.textContent = `Hello, ${userModel.appUser.username}`;
    }

    #filloutUserStats() {
        const userStats = getUserStats(userModel.appUser);
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
