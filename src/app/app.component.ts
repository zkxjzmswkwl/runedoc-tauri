import { Component, inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from './sidenav/sidenav.component';
import { PrimeNGConfig } from 'primeng/api';
import { Lara } from 'primeng/themes/lara';
import { HeaderComponent } from './header/header.component';
import { AlertComponent } from './shared/components/alert/alert.component';
import { AccordionComponent } from './shared/components/accordion/accordion.component';
import { combineLatest, debounceTime, from } from 'rxjs';
import { GlobalService } from './shared/services/global.service';
import { GlobalFeatureState } from './shared/state/global.feature';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { load } from '@tauri-apps/plugin-store';
import { AfkwardenService } from './shared/services/afkwarden.service';

async function saveToStore<T>(file: string, key: string, data: T) {
  const store = await load(file);

  await store.set(key, { value: data });
  await store.save();
}

async function getFromStore<T>(file: string, key: string): Promise<{ value: T } | undefined> {
  const store = await load(file);
  return store.get<{ value: T }>(key);
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AccordionComponent, AlertComponent, SidenavComponent, HeaderComponent],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly pngConfig = inject(PrimeNGConfig);
  private readonly globalService = inject(GlobalService);
  private readonly afkwardenService = inject(AfkwardenService);
  private readonly settingsLocation = '.settings.json';

  constructor() {
    this.pngConfig.theme.set({ preset: Lara });

    this.globalService.state$
      .pipe(takeUntilDestroyed(), debounceTime(500))
      .subscribe(state => saveToStore<GlobalFeatureState>(this.settingsLocation, 'global_settings', state));

    // this.afkwardenService.state$
    //   .pipe(takeUntilDestroyed(), debounceTime(500))
    //   .subscribe(state => saveToStore<AFKWardenFeatureState>(this.settingsLocation, 'afkwarden', state));

    /**
     * combineLatest for future proofing multiple states.
     *
     * Marshals stored application state from file on disk.
     */
    combineLatest([
      from(getFromStore<GlobalFeatureState>(this.settingsLocation, 'global_settings')),
      // from(getFromStore<AFKWardenFeatureState>(this.settingsLocation, 'afkwarden')),
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(([globalState]) => {
        this.globalService.updateState(globalState?.value ?? {});
        // commented out for now, currently messages are saved on the server side.
        // this.afkwardenService.updatePartial(afkwardenState?.value ?? {});
      });
  }
}
