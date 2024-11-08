import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { provideStore, StoreModule } from '@ngrx/store';
import { SkillsFeature } from './shared/state/skills.feature';
import { BrowserModule } from '@angular/platform-browser';
import { GlobalFeature } from './shared/state/global.feature';
import { AFKWardenFeature } from './shared/state/afkwarden.feature';
import { SceneObjectsFeature } from './shared/state/sceneobjects.feature';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore(),
    importProvidersFrom(
      // Inject reducer manager
      StoreModule.forRoot({}),
      StoreModule.forFeature(SkillsFeature),
      StoreModule.forFeature(GlobalFeature),
      StoreModule.forFeature(AFKWardenFeature),
      StoreModule.forFeature(SceneObjectsFeature)
    ),
  ],
};
