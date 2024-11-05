import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';

export type GlobalFeatureState = {
  accounts: string[];
};

const initialState: GlobalFeatureState = {
  accounts: [],
};

export const GlobalFeatureActions = createActionGroup({
  source: 'GlobalFeature',
  events: {
    'Reset State': emptyProps(),
    'Update': props<{ partial: Partial<GlobalFeatureState> }>(),
    'Add Accounts': props<{ accounts: string[] }>(),
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
    on(GlobalFeatureActions.addAccounts, (state, { accounts }) => ({
      ...state,
      accounts: [...state.accounts, ...accounts],
    })),
  ),
});