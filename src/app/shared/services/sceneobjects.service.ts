import { DestroyRef, inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { SceneObjectsFeature, SceneObjectsFeatureActions } from '../state/sceneobjects.feature';
import { listen } from '@tauri-apps/api/event';

@Injectable({
  providedIn: 'root'
})
export class SceneobjectsService {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);
  public readonly sceneObjects$ = this.store.select(SceneObjectsFeature.selectSceneObjects);

  constructor() {
    listen<string>('packet_received', (event) => {
      const buffer = event.payload;

      if (!buffer.startsWith('resp:sceneobjects')) {
        return;
      }

      const spl = buffer.split(':');
      var nodes = spl[2].split("^").slice(0, -1);

      var sceneObjects = nodes.map(node => {
        var data = node.split("#");
        var name = data[0];
        var combatLevel = parseInt(data[1]);
        var serverIndex = parseInt(data[2]);
        var pointer = parseInt(data[3]);
        return { name, combatLevel, serverIndex, pointer };
      })

      console.log(sceneObjects);
      
      this.store.dispatch(SceneObjectsFeatureActions.setSceneObjects({ sceneObjects }));
    });
  }
}
