import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from "@ngrx/store";


export type HighlightedEntity = {
    name: string;
    // Unused for now
    colour?: string;
    width?: number;
    opacity?: number;
    // - 
}

export type HighlightFeatureState = {
    targetEntities: HighlightedEntity[];
}

const initialState: HighlightFeatureState = {
    targetEntities: [],
};

export const HighlightFeatureActions = createActionGroup({
    source: 'HighlightFeature',
    events: {
        'Reset State': emptyProps(),
        'Update': props<{ partial: Partial<HighlightFeatureState> }>(),
        'Add Entity': props<{ name: string }>(),
        'Set Target Entities': props<{ targetEntities: HighlightedEntity[] }>(),
    },
});

export const HighlightFeature = createFeature({
    name: 'HighlightFeature',
    reducer: createReducer(
        initialState,
        on(HighlightFeatureActions.resetState, () => initialState),
        on(HighlightFeatureActions.update, (state, { partial }) => ({
            ...state,
            ...partial,
        })),
        on(HighlightFeatureActions.addEntity, (state, { name }) => ({
            ...state,
            targetEntities: [...state.targetEntities, { name }],
        })),
        on(HighlightFeatureActions.setTargetEntities, (state, { targetEntities }) => ({
            ...state,
            targetEntities,
        })),
    ),
});