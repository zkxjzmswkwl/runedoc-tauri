import { DestroyRef, inject, Injectable, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AFKWardenFeature, AFKWardenFeatureActions, AFKWardenFeatureState } from '../state/afkwarden.feature';
import { listen } from '@tauri-apps/api/event';
import { queuePacket } from '../../icp-events/events';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root'
})
export class AfkwardenService {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);
  public readonly messages$ = this.store.select(AFKWardenFeature.selectWatchedMessages);

  constructor() {

    listen<string>('packet_received', (event) => {
      const buffer = event.payload;

      if (!buffer.startsWith('_specpl_:afkwarden')) {
        return;
      }

      const spl = buffer.split(':');

      if (spl[2] === "queryresp") {
        var nodes = spl[3].split("^").slice(0, -1);
        console.log(nodes);

        const watchedMessages = nodes.map(node => ({
          message: node,
          alertType: 1
        }));

        this.store.dispatch(
          AFKWardenFeatureActions.setWatchedMessages({ watchedMessages }));
      }

      if (spl[2] === "playalert") {
        var sound = new Howl({
          src: ['assets/fbalert.mp3']
        });
        sound.play();
      }
    })
  }

  updatePartial(partial: Partial<AFKWardenFeatureState>) {
    this.store.dispatch(AFKWardenFeatureActions.update({ partial }));
  }

  queryWatchedMessages() {
    queuePacket("_specpl_", "afkwarden", "query");
  }
}
