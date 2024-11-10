import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AFKWardenFeature,
  AFKWardenFeatureActions,
  AFKWardenFeatureState,
  WatchedMessage,
} from '../state/afkwarden.feature';
import { listen } from '@tauri-apps/api/event';
import { queuePacket } from '../../icp-events/events';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root',
})
export class AfkwardenService {
  private readonly store = inject(Store);
  public readonly state$ = this.store.select(AFKWardenFeature.selectAFKWardenFeatureState);
  public readonly messages$ = this.store.select(AFKWardenFeature.selectWatchedMessages);

  constructor() {
    listen<string>('packet_received', (event) => {
      const buffer = event.payload;

      if (!buffer.startsWith('_specpl_:afkwarden')) {
        return;
      }

      const spl = buffer.split(':');

      if (spl[2] === 'queryresp') {
        const nodes = spl[3].split('^').slice(0, -1);

        const watchedMessages = nodes.map(node => ({
          message: node,
          alertType: 1,
        }));

        // Again ignoring server side state for now.
        this.store.dispatch(AFKWardenFeatureActions.setWatchedMessages({ watchedMessages }));
      }

      if (spl[2] === 'playalert') {
        console.log(spl)
        const sound = new Howl({
          src: ['assets/fbalert.mp3'],
        });
        sound.play();
      }
    });
  }

  addMessage(message: string) {
    this.store.dispatch(AFKWardenFeatureActions.addWatchedMessage({ message, alertType: 1 }));
    queuePacket('_specpl_', 'afkwarden', 'addWatchedMessage', message);
  }

  updatePartial(partial: Partial<AFKWardenFeatureState>) {
    this.store.dispatch(AFKWardenFeatureActions.update({ partial }));
  }

  deleteAlert(message: WatchedMessage) {
    this.store.dispatch(AFKWardenFeatureActions.deleteMessage({ message }));
  }

  queryWatchedMessages() {
    queuePacket('_specpl_', 'afkwarden', 'query');
  }
}
