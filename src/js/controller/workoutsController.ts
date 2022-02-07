import { workoutsView } from "../view/workoutsView";
import {
    LEAFLET_CONFIG,
    PATH_NODES_OPTIONS,
    PATH_OPTIONS,
    TokenNotValidError,
} from "../config/configuration";
import WorkoutEntry from "../data/workoutEntry";
import demoModel from "../model/demoUserModel";
import { stripHTML } from "../helpers/helpers";
import { LatLng, LayerGroup, layerGroup } from "leaflet";
import Controller from "./controller";
import WorkoutMapTrail from "../data/workoutMapTrail";
import UserModel from "../model/userModel";
import realUserModel from "../model/realUserModel";
import { LeafletMap } from "../helpers/leafletMap";
import { LoginController } from "./loginController";

class WorkoutsController extends Controller {
    private _leafletMap: LeafletMap;
    private _isUserEditingWorkout: boolean = false;
    private _userWorkoutTrail: WorkoutMapTrail;
    private readonly _workoutEntryLayerGroup: LayerGroup;
    private readonly _unsavedWorkouts: Map<string, WorkoutEntry>;
    private _model: UserModel;

    constructor() {
        super("#workouts", workoutsView);
        this._workoutEntryLayerGroup = layerGroup();
        this._unsavedWorkouts = new Map<string, WorkoutEntry>();
    }

    private createLeafletMap() {
        this._leafletMap = new LeafletMap(LEAFLET_CONFIG);
        this._leafletMap.initialize().then(msg => {
            workoutsView.deleteMapLoadingIcon();
            this._leafletMap.add(this._workoutEntryLayerGroup);
            this.registerMapEventHandlers();
        });
    }

    private startWorkoutForm(event) {
        event.preventDefault();
        workoutsView.renderWorkoutForm();
        this._workoutEntryLayerGroup.clearLayers();
        this._isUserEditingWorkout = true;
        this._userWorkoutTrail = null;
    }

    private exitWorkoutForm(event) {
        event.preventDefault();
        workoutsView.hideWorkoutForm();
        this._isUserEditingWorkout = false;
        this._userWorkoutTrail = null;
        this._workoutEntryLayerGroup.clearLayers();
        this.clearWorkoutFormValues();
    }

    private submitWorkout(event) {
        event.preventDefault();
        const newWorkoutEntry = this.constructWorkoutEntryFromForm();
        workoutsView.renderWorkoutEntry(newWorkoutEntry);
        this.handleSavingWorkoutData(newWorkoutEntry);
        this.exitWorkoutForm(event);
    }

    private handleSavingWorkoutData(newWorkoutEntry: WorkoutEntry) {
        workoutsView.addLoadingSpinnerToWorkoutEntry(newWorkoutEntry.localID);
        this._model.addWorkoutEntry(newWorkoutEntry).then(
            value => {
                if (this._unsavedWorkouts.has(newWorkoutEntry.localID))
                    this._unsavedWorkouts.delete(newWorkoutEntry.localID);

                workoutsView.hideWorkoutSubmitRetryButton(
                    newWorkoutEntry.localID
                );
                workoutsView.removeLoadingSpinnerFromWorkoutEntry(
                    newWorkoutEntry.localID
                );
                workoutsView.removeStatusFromWorkoutEntry(
                    newWorkoutEntry.localID
                );
                workoutsView.addStatusToWorkoutEntry(
                    newWorkoutEntry.localID,
                    "Saved to server"
                );
            },
            reason => {
                if (reason instanceof TokenNotValidError) {
                    this.tokenErrorRoutine();
                    return Promise.reject(reason);
                }

                workoutsView.removeLoadingSpinnerFromWorkoutEntry(
                    newWorkoutEntry.localID
                );
                workoutsView.removeStatusFromWorkoutEntry(
                    newWorkoutEntry.localID
                );
                workoutsView.addStatusToWorkoutEntry(
                    newWorkoutEntry.localID,
                    "Couldn't save to server",
                    "red"
                );
                workoutsView.showWorkoutSubmitRetryButton(
                    newWorkoutEntry.localID
                );
                this._unsavedWorkouts.set(
                    newWorkoutEntry.localID,
                    newWorkoutEntry
                );
            }
        );
    }

    private tokenErrorRoutine() {
        this._unsavedWorkouts.clear();
        this._workoutEntryLayerGroup.clearLayers();
        this._userWorkoutTrail = null;
        this.clearWorkoutFormValues();
        workoutsView.clearAllWorkoutEntries();
        LoginController.relogin();
    }

    private clearWorkoutFormValues() {
        workoutsView.getWorkoutForm().reset();
    }

    private constructWorkoutEntryFromForm() {
        const workoutForm = workoutsView.getWorkoutForm().elements;
        const workoutType = workoutForm["type"].value;
        const workoutNote = stripHTML(workoutForm["note"].value);
        const workoutDate = workoutForm["date"].value
            ? new Date(workoutForm["date"].value)
            : new Date();

        let trailPoints = this._userWorkoutTrail
            ? this._userWorkoutTrail.listOfCoordinates
            : [];
        let workoutDistance = 0;

        if (!workoutForm["distance"] || !workoutForm["distance"].value) {
            if (this._userWorkoutTrail)
                workoutDistance = Math.round(this._userWorkoutTrail.distance);
        } else workoutDistance = Math.round(workoutForm["distance"].value);

        return new WorkoutEntry(
            workoutType,
            workoutDistance,
            workoutDate,
            workoutNote,
            trailPoints,
            UserModel.generateWorkoutLocalID()
        );
    }

    initialize() {
        workoutsView.addEventHandlerAddWorkoutButton(
            "click",
            this.startWorkoutForm.bind(this)
        );

        workoutsView.addEventHandlerCancelWorkoutFormButton(
            "click",
            this.exitWorkoutForm.bind(this)
        );

        workoutsView.addEventHandlerSubmitWorkoutForm(
            this.submitWorkout.bind(this)
        );

        workoutsView.addEventHandlerWorkoutList(
            "click",
            this.handleWorkoutEntryInteraction.bind(this)
        );

        workoutsView.rootElement.addEventListener("sectionfocus", _ => {
            this.loadAndRenderExistingUserData();
            workoutsView.renderMapLoadingIcon();
            this.createLeafletMap();
        });

        workoutsView.rootElement.addEventListener("sectionexit", _ => {
            workoutsView.clearAllWorkoutEntries();
            workoutsView.deleteMapLoadingIcon();
            this._userWorkoutTrail = null;
            this._leafletMap.destroy();
        });
    }

    private loadAndRenderExistingUserData() {
        this._model = realUserModel.isUserLoggedIn ? realUserModel : demoModel;
        workoutsView.renderWorkoutEntries(this._model.getAllWorkoutEntries());
    }

    private registerMapEventHandlers() {
        this._leafletMap.addEventHandlerOnMapClick(event => {
            if (this._isUserEditingWorkout) {
                if (!this._userWorkoutTrail)
                    this.createNewUserWorkoutTrail(event.latlng);

                this._userWorkoutTrail.addPoint(event.latlng);
                this.updateTrailDistanceUI();
            }
        });
    }

    private createNewUserWorkoutTrail(latlng: LatLng) {
        const { lat, lng } = latlng;
        this._userWorkoutTrail = new WorkoutMapTrail(
            [[lat, lng]],
            PATH_OPTIONS,
            PATH_NODES_OPTIONS
        );
        this._userWorkoutTrail.addTo(this._workoutEntryLayerGroup);
        this.updateTrailDistanceUI();
    }

    private updateTrailDistanceUI() {
        const distance = Math.round(this._userWorkoutTrail.distance);
        const text = `${distance} meters calculated`;
        workoutsView.setSmallTextWorkoutDistance(text);
        this._userWorkoutTrail.bindPopup(
            `Workout trail. <b style="background-color: #77aa7744">Calculated distance: ${distance} m.</b>`
        );
    }

    private handleWorkoutEntryInteraction(event) {
        const targetButtonValue = event.target.value;
        const targetWorkoutEntryID =
            event.target.parentElement.dataset.workoutId;
        const targetWorkoutEntry = this._unsavedWorkouts.has(
            targetWorkoutEntryID
        )
            ? this._unsavedWorkouts.get(targetWorkoutEntryID)
            : this._model.getWorkoutEntryByID(targetWorkoutEntryID);
        if (!targetWorkoutEntry) return;

        switch (targetButtonValue) {
            case "show":
                this.showWorkoutEntryOnMap(targetWorkoutEntry);
                break;
            case "delete":
                this.deleteWorkoutEntry(targetWorkoutEntry);
                break;
            case "note":
                this.showWorkoutEntryNote(targetWorkoutEntry);
                break;
            case "submit-retry":
                this.handleSavingWorkoutData(targetWorkoutEntry);
                break;
        }
    }

    private deleteWorkoutEntry(workout: WorkoutEntry) {
        if (this._unsavedWorkouts.delete(workout.localID)) {
            workoutsView.clearAllWorkoutEntries();
            workoutsView.renderWorkoutEntries(
                this._model.getAllWorkoutEntries()
            );
            this._workoutEntryLayerGroup.clearLayers();
            this._userWorkoutTrail = null;
            return;
        }

        workoutsView.addLoadingSpinnerToWorkoutEntry(workout.localID);

        this._model.deleteWorkoutEntryByLocalID(workout.localID).then(
            () => {
                workoutsView.removeLoadingSpinnerFromWorkoutEntry(
                    workout.localID
                );
                workoutsView.clearAllWorkoutEntries();
                workoutsView.renderWorkoutEntries(
                    this._model.getAllWorkoutEntries()
                );
                this._workoutEntryLayerGroup.clearLayers();
                this._userWorkoutTrail = null;
            },
            () =>
                workoutsView.removeLoadingSpinnerFromWorkoutEntry(
                    workout.localID
                )
        );
    }

    private showWorkoutEntryOnMap(workout: WorkoutEntry) {
        if (this._isUserEditingWorkout) return;

        if (!workout.trailCoordinates || workout.trailCoordinates.length < 1) {
            alert("No trail was saved for this workout!");
            return;
        }

        this._userWorkoutTrail = new WorkoutMapTrail(
            workout.trailCoordinates,
            PATH_OPTIONS,
            PATH_NODES_OPTIONS
        );

        this._workoutEntryLayerGroup.clearLayers();
        this._workoutEntryLayerGroup.addLayer(
            LeafletMap.createBasicMarker(
                this._userWorkoutTrail.trailStartingLatLang,
                "",
                `${workout.type} started here...`
            )
        );

        this._workoutEntryLayerGroup.addLayer(
            LeafletMap.createBasicMarker(
                this._userWorkoutTrail.trailEndingLatLang,
                "",
                `... and ended there.`
            )
        );

        this._userWorkoutTrail.addTo(this._workoutEntryLayerGroup);
        this._userWorkoutTrail.isEditable = false;
        this._leafletMap.fitLine(this._userWorkoutTrail.path);
        this.updateTrailDistanceUI();
    }

    private showWorkoutEntryNote(workout: WorkoutEntry) {
        workoutsView.toggleWorkoutEntryNote(workout.localID);
    }
}
export default new WorkoutsController();
