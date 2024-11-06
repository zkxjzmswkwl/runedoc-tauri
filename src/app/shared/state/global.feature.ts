import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';

export type Silhouette = {
  red: number;
  green: number;
  blue: number;
  opacity: number;
  width: number;
};

export type GlobalFeatureState = {
  accounts: string[];
  silhouette: Silhouette;
};

const initialState: GlobalFeatureState = {
  accounts: [],
  silhouette: {
    red: 1.0,
    green: 1.0,
    blue: 1.0,
    opacity: 1.0,
    width: 1.0
  },
};

export const GlobalFeatureActions = createActionGroup({
  source: 'GlobalFeature',
  events: {
    'Reset State': emptyProps(),
    'Update': props<{ partial: Partial<GlobalFeatureState> }>(),
    'Update Colors': props<{ partial: Partial<GlobalFeatureState['silhouette']> }>(),
    'Add Accounts': props<{ accounts: string[] }>(),
    'Set Accounts': props<{ accounts: string[] }>(),
  },
});

export const GlobalFeature = createFeature({
  name: 'GlobalFeature',
  reducer: createReducer(
    initialState,
    on(GlobalFeatureActions.resetState, () => initialState),
    on(GlobalFeatureActions.update, (state, { partial }) => ({
      ...state,
      ...partial,
    })),
    on(GlobalFeatureActions.updateColors, (state, { partial }) => ({
      ...state,
      silhouette: {
        ...state.silhouette,
        ...partial,
      },
    })),
    on(GlobalFeatureActions.addAccounts, (state, { accounts }) => ({
      ...state,
      accounts: [...state.accounts, ...accounts],
    })),
    on(GlobalFeatureActions.setAccounts, (state, { accounts }) => ({
      ...state,
      accounts,
    })),
  ),
});