import { Component, inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { invoke } from '@tauri-apps/api/core';
import { SidenavComponent } from './sidenav/sidenav.component';
import { PrimeNGConfig } from 'primeng/api';
// import { Aura } from 'primeng/themes/aura';
import { Lara } from 'primeng/themes/lara';
import { HeaderComponent } from './header/header.component';
import { AlertComponent } from './shared/components/alert/alert.component';
import { AccordionComponent } from './shared/components/accordion/accordion.component';
import { Store } from 'tauri-plugin-store-api';
import { combineLatest, from, Observable } from 'rxjs';
import { GlobalService } from './shared/services/global.service';
import { GlobalFeatureState } from './shared/state/global.feature';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * @TODO Use later on if there are settings that aren't tied to a users RS account
 * but are RuneDoc related that a user may want to see saved.
 * @param file {@link AppComponent.settingsLocation} Where the Tauri file saves at in AppData
 * @param key Object key to save as.
 * @param data The data we wish to save.
 */
async function saveToStore<T>(file: string, key: string, data: T) {
  const store = new Store(file);

  await store.set(key, { value: data });
  await store.save();
}

function getFromStore<T>(file: string, key: string): Observable<{ value: T } | null> {
  const store = new Store(file);

  return from(store.get<{ value: T }>(key));
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
  private readonly settingsLocation = '.settings.json';

  greetingMessage = '';

  constructor() {
    this.pngConfig.theme.set({ preset: Lara });

    /**
     * combineLatest for future proofing multiple states.
     */
    combineLatest([
      getFromStore<GlobalFeatureState>(this.settingsLocation, 'global_settings'),
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(([globalState]) => {
        // We currently don't save the data, this is more of an example of how data should be loaded
        // when there are more services saving.
        this.globalService.updateState(globalState?.value ?? {});
      });
  }

  greet(event: SubmitEvent, name: string): void {
    event.preventDefault();

    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    invoke<string>('greet', { name }).then((text) => {
      this.greetingMessage = text;
    });
  }
}
