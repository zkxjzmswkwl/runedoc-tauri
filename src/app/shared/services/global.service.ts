import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GlobalFeature, GlobalFeatureActions, GlobalFeatureState } from '../state/global.feature';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private readonly store = inject(Store);
  readonly accounts$ = this.store.select(GlobalFeature.selectAccounts);
  
  constructor() {
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

  /**
   * @TODO string to Account type?
   * @param accounts
   */
  addAccounts(accounts: string[]) {
    this.store.dispatch(GlobalFeatureActions.addAccounts({ accounts }));
  }
}
