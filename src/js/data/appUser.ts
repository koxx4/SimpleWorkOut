import WorkoutEntry from "./workoutEntry";

export default class AppUser {
    username: string;
    email: string;
    workoutEntries: WorkoutEntry[];

    constructor(
        username: string,
        workoutEntries?: WorkoutEntry[],
        email?: string
    ) {
        this.username = username;
        this.workoutEntries = workoutEntries ? workoutEntries : [];
        this.email = email ? email : null;
    }
}
