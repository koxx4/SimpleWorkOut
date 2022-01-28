import WorkoutEntry from "./workoutEntry";

export default class AppUser {
    username: string;
    email: string;
    password: string;
    workoutEntries: WorkoutEntry[];

    constructor(
        username: string,
        password: string,
        workoutEntries?: WorkoutEntry[],
        email?: string
    ) {
        this.username = username;
        this.password = password;
        this.workoutEntries = workoutEntries ? workoutEntries : [];
        this.email = email ? email : null;
    }
}
