import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from "@ngrx/store";
import { SceneObject } from "../../models/sceneobject";


export type SceneObjectsFeatureState = {
    sceneObjects: SceneObject[];
}

const initialState: SceneObjectsFeatureState = {
    sceneObjects: [],
};

export const SceneObjectsFeatureActions = createActionGroup({
    source: 'SceneObjectsFKWardenFeature',
    events: {
        'Reset State': emptyProps(),
        'Update': props<{ partial: Partial<SceneObjectsFeatureState> }>(),
        'Add Scene Object': props<{ 
            name: string,
            combatLevel: number,
            serverIndex: number,
            pointer: bigint,
        }>(),
        'Set Scene Objects': props<{ sceneObjects: SceneObject[] }>(),
    },
});

export const SceneObjectsFeature = createFeature({
    name: 'SceneObjectsFeature',
    reducer: createReducer(
        initialState,
        on(SceneObjectsFeatureActions.resetState, () => initialState),
        on(SceneObjectsFeatureActions.update, (state, { partial }) => ({
            ...state,
            ...partial,
        })),
        on(SceneObjectsFeatureActions.addSceneObject, (state, { name, combatLevel, serverIndex, pointer }) => ({
            ...state,
            watchedMessages: [...state.sceneObjects, { name, combatLevel, serverIndex, pointer }],
        })),
        on(SceneObjectsFeatureActions.setSceneObjects, (state, { sceneObjects }) => ({
            ...state,
            sceneObjects,
        })),
    ),
});