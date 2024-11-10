import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';

export type WatchedMessage = {
  message: string;
  alertType: number;
}

export type AFKWardenFeatureState = {
  watchedMessages: WatchedMessage[];
}

const initialState: AFKWardenFeatureState = {
  watchedMessages: [],
};

export const AFKWardenFeatureActions = createActionGroup({
  source: 'AFKWardenFeature',
  events: {
    'Reset State': emptyProps(),
    'Update': props<{ partial: Partial<AFKWardenFeatureState> }>(),
    'Add Watched Message': props<{ message: string, alertType: number }>(),
    'Set Watched Messages': props<{ watchedMessages: WatchedMessage[] }>(),
    'Delete Message': props<{ message: WatchedMessage }>(),
  },
});

export const AFKWardenFeature = createFeature({
  name: 'AFKWardenFeature',
  reducer: createReducer(
    initialState,
    on(AFKWardenFeatureActions.resetState, () => initialState),
    on(AFKWardenFeatureActions.update, (state, { partial }) => ({
      ...state,
      ...partial,
    })),
    on(AFKWardenFeatureActions.addWatchedMessage, (state, { message, alertType }) => ({
      ...state,
      watchedMessages: [...state.watchedMessages, { message, alertType }],
    })),
    on(AFKWardenFeatureActions.setWatchedMessages, (state, { watchedMessages }) => ({
      ...state,
      watchedMessages,
    })),
    on(AFKWardenFeatureActions.deleteMessage, (state, { message }) => {
      const index = state.watchedMessages.indexOf(message);
      const messages = [...state.watchedMessages];
      messages.splice(index, 1);

      return {
        ...state,
        watchedMessages: messages,
      };
    }),
  ),
});