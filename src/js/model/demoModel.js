import AppUser from "../data/appUser";
import { UserModel } from "./userModel";

class DemoModel extends UserModel {
    constructor() {
        super(new AppUser("demo-user", "", []));
    }
}
export default new DemoModel();
