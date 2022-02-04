import WorkoutEntry from "../data/workoutEntry";
import AppUser from "../data/appUser";
import { v4 as uuidv4 } from "uuid";

export default abstract class UserModel {
    protected _appUser: AppUser;

    protected constructor(appUser: AppUser) {
        this._appUser = appUser;
    }

    abstract getWorkoutEntriesSize(): number;

    abstract addWorkoutEntry(workoutEntry: WorkoutEntry): Promise<void>;

    abstract deleteWorkoutEntry(workoutEntry: WorkoutEntry): Promise<void>;

    abstract deleteWorkoutEntryByLocalID(localId: string): Promise<void>;

    abstract deleteAllWorkoutEntries(): Promise<void>;

    abstract getWorkoutEntryByID(id: string): WorkoutEntry | undefined;

    static generateWorkoutLocalID(): string {
        return uuidv4();
    }

    get appUser(): AppUser {
        return this._appUser;
    }

    set appUser(value) {
        this._appUser = value;
    }

    public getAllWorkoutEntries(): WorkoutEntry[] {
        return this._appUser.workoutEntries;
    }
}
