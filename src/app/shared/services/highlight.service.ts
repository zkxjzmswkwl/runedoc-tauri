import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HighlightFeature, HighlightFeatureActions } from '../state/highlight.feature';
import { listen } from '@tauri-apps/api/event';
import { queuePacket } from '../../icp-events/events';

@Injectable({
  providedIn: 'root'
})
export class HighlightService {
  private readonly store = inject(Store);
  public readonly targetEntities$ = this.store.select(HighlightFeature.selectTargetEntities);

  constructor() {
    listen<string>('packet_received', (event) => {
      const buffer = event.payload;

      if (!buffer.startsWith('_specpl_:highlight')) {
        return;
      }

      const spl = buffer.split(':');
      var nodes = spl[3].split("^").slice(0, -1);
      console.log(nodes);
      

      var targetEntities = nodes.map(node => {
        return { name: node };
      });

      console.log(targetEntities);
      
      this.store.dispatch(HighlightFeatureActions.setTargetEntities({ targetEntities }));
    });
  }

  queryEntities() {
    queuePacket("_specpl_", "highlight", "query");
  }
}
