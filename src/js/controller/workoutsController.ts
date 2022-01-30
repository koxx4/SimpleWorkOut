import { workoutsView } from "../view/workoutsView";
import {
    LEAFLET_CONFIG,
    PATH_NODES_OPTIONS,
    PATH_OPTIONS,
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

class WorkoutsController extends Controller {
    private _leafletMap: LeafletMap;
    private _isUserEditingWorkout: boolean = false;
    private _userWorkoutTrail: WorkoutMapTrail;
    private readonly _workoutEntryLayerGroup: LayerGroup;
    private _model: UserModel;

    constructor() {
        super("#workouts", workoutsView);
        this._workoutEntryLayerGroup = layerGroup();
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
        this._model.addWorkoutEntry(newWorkoutEntry);
        workoutsView.renderWorkoutEntry(newWorkoutEntry);
        this.exitWorkoutForm(event);
    }

    private clearWorkoutFormValues() {
        workoutsView.getWorkoutForm().reset();
    }

    private constructWorkoutEntryFromForm() {
        const workoutForm = workoutsView.getWorkoutForm();
        let workoutType = workoutForm.type.value;
        let workoutDistance = workoutForm.distance.value;
        let workoutDate = new Date(workoutForm.date.value);
        let workoutNote = workoutForm.note.value;

        workoutDistance =
            workoutDistance > 0
                ? workoutDistance
                : Math.round(this._userWorkoutTrail.distance);
        workoutDate = workoutDate ? workoutDate : new Date();
        workoutNote = stripHTML(workoutNote);

        return new WorkoutEntry(
            workoutType,
            workoutDistance,
            workoutDate,
            workoutNote,
            this._userWorkoutTrail.listOfCoordinates,
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
        switch (targetButtonValue) {
            case "show":
                this.showWorkoutEntryOnMap(targetWorkoutEntryID);
                break;
            case "delete":
                this.deleteWorkoutEntry(targetWorkoutEntryID);
                break;
            case "note":
                this.showWorkoutEntryNote(targetWorkoutEntryID);
                break;
        }
    }

    private deleteWorkoutEntry(workoutID) {
        this._model.deleteWorkoutEntryByID(workoutID);
        workoutsView.clearAllWorkoutEntries();
        workoutsView.renderWorkoutEntries(this._model.getAllWorkoutEntries());
        this._workoutEntryLayerGroup.clearLayers();
    }

    private showWorkoutEntryOnMap(workoutID) {
        if (this._isUserEditingWorkout) return;

        const workout = this._model.getWorkoutEntryByID(workoutID);

        if (!workout) return;
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

    private showWorkoutEntryNote(workoutID: string) {
        const workout = this._model.getWorkoutEntryByID(workoutID);
        if (workout) workoutsView.toggleWorkoutEntryNote(workoutID);
    }
}
export default new WorkoutsController();
