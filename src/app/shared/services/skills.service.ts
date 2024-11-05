import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  MetricSnapshot,
  SKILL_ID_MAX,
  SkillsFeature,
  SkillsFeatureActions,
  SkillsFeatureState,
} from '../state/skills.feature';
import { listen } from '@tauri-apps/api/event';

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  private readonly store = inject(Store);
  public readonly snapshots$ = this.store.select(SkillsFeature.selectSkillSnapshots);

  constructor() {
    const skillSnapshots = Array(SKILL_ID_MAX).fill(0).map<MetricSnapshot>((hourly, skillId) => ({
      skillId,
      level: 1,
      current: 0,
      gained: 0,
      hourly: [hourly],
    }));
    
    console.log(skillSnapshots);

    this.updatePartial({
      skillSnapshots,
    });

    listen<string>('packet_received', (event) => {
      const buffer = event.payload;

      if (!buffer.startsWith('resp:')) {
        return;
      }

      const spl = buffer.split(':');

      if (spl.length < 3) {
        return console.error('Received packet with no arguments.');
      }

      if (spl.length > 3) {
        return console.error('Received packet with too many arguments.');
      }

      if (spl[1] !== 'metrics') {
        return;
      }

      this.handleResponseMetrics(spl[2]);
    });
  }

  updatePartial(partial: Partial<SkillsFeatureState>) {
    this.store.dispatch(SkillsFeatureActions.update({ partial }));
  }

  updateSnapshot(snapshot: Omit<MetricSnapshot, 'hourly'>, newHourly: number) {
    this.store.dispatch(SkillsFeatureActions.updateSnapshot({ snapshot, newHourly }));
  }

  private handleResponseMetrics(buffer: string) {
    const nodes = buffer.split('^').slice(0, -1);

    for (const node of nodes) {
      const data = node.split('#');
      const hourly = parseInt(data[4]);

      const snapshot: Omit<MetricSnapshot, 'hourly'> = {
        skillId: parseInt(data[0]),
        level: parseInt(data[1]),
        current: parseInt(data[2]),
        gained: parseInt(data[3]),
      };

      this.updateSnapshot(snapshot, hourly);
    }
  }
}
