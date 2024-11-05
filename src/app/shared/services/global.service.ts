import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GlobalFeature, GlobalFeatureActions, GlobalFeatureState } from '../state/global.feature';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { queuePacket } from '../../icp-events/events';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private readonly store = inject(Store);
  readonly accounts$ = this.store.select(GlobalFeature.selectAccounts);
  readonly silhouette$ = this.store.select(GlobalFeature.selectSilhouette)
    .pipe(tap(colors => {
      queuePacket('cmd', 'red', `${colors.red}`);
      queuePacket('cmd', 'green', `${colors.green}`);
      queuePacket('cmd', 'blue', `${colors.blue}`);
      queuePacket('cmd', 'opacity', `${colors.opacity}`);
      queuePacket('cmd', 'width', `${colors.width}`);
    }));
  readonly state$ = this.store.select(GlobalFeature.selectGlobalFeatureState);

  constructor() {
    listen<string>('packet_received', (event) => {
      const buffer = event.payload;

      if (!buffer.startsWith('resp:')) {
        return;
      }

      const spl = buffer.split(':');

      if (spl.length < 3) {
        console.log(spl);
        return console.error('Received packet with no arguments.');
      }

      if (spl.length > 3) {
        console.log(spl);
        return console.error('Received packet with too many arguments.');
      }

      if (spl[1] !== 'rsn') {
        return;
      }

      const rsn = spl[2];
      this.addAccounts([rsn]);
      getCurrentWindow().setTitle(rsn);
    });
  }


  /**
   * Used to override any passed in partial properties.
   * @param partial The partial settings we want to override existing state with.
   */
  updateState(partial: Partial<GlobalFeatureState>) {
    this.store.dispatch(GlobalFeatureActions.update({ partial }));
  }

  updateColors(partial: Partial<GlobalFeatureState['silhouette']>) {
    this.store.dispatch(GlobalFeatureActions.updateColors({ partial }));
  }

  loadFromStorage(partial: Partial<GlobalFeatureState>) {
    this.updateState(partial);
  }

  /**
   * @TODO string to Account type?
   * @param accounts
   */
  addAccounts(accounts: string[]) {
    this.store.dispatch(GlobalFeatureActions.addAccounts({ accounts }));
  }
}
