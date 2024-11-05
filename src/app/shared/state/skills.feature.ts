import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';

export type MetricSnapshot = {
  skillId: number;
  level: number;
  current: number;
  gained: number;
  hourly: number[];
};

export const SKILL_ID_MAX = 29;

export type SkillsFeatureState = {
  skillSnapshots: MetricSnapshot[];
}

const initialState: SkillsFeatureState = {
  skillSnapshots: [],
};

export const SkillsFeatureActions = createActionGroup({
  source: 'SkillsFeature',
  events: {
    'Reset State': emptyProps(),
    'Update': props<{ partial: Partial<SkillsFeatureState> }>(),
    'Update Snapshot': props<{ snapshot: Omit<MetricSnapshot, 'hourly'>, newHourly: number }>(),
  },
});

export const SkillsFeature = createFeature({
  name: 'SkillsFeature',
  reducer: createReducer(
    initialState,
    on(SkillsFeatureActions.resetState, () => initialState),
    on(SkillsFeatureActions.update, (state, { partial }) => ({
      ...state,
      ...partial,
    })),
    on(SkillsFeatureActions.updateSnapshot, (state, { snapshot, newHourly }) => {
      if (snapshot.skillId < 0 || snapshot.skillId > SKILL_ID_MAX) {
        console.error(`Attempted to update skill snapshot with an invalid skill ID. ${JSON.stringify(snapshot)}`);

        return state;
      }
      
      // Because state is immuatable, need to do spreads to copy everything.
      // Could use the klona package to deep clone with a single line if objects get complex later on.
      const skillSnapshots = [...state.skillSnapshots];
      const snapshotToUpdate = {
        ...skillSnapshots[snapshot.skillId],
        hourly: [...skillSnapshots[snapshot.skillId].hourly]
      };
      
      snapshotToUpdate.hourly.push(newHourly);
      if (snapshotToUpdate.hourly.length > 50) {
        snapshotToUpdate.hourly.shift();
      }
      
      skillSnapshots[snapshot.skillId] = {
        ...snapshotToUpdate,
        ...snapshot,
      };

      return {
        ...state,
        skillSnapshots,
      };
    }),
  ),
});