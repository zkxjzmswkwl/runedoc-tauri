import { Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { ClientComponent } from './routes/client/client.component';
import { SettingsComponent } from './routes/settings/settings.component';
import { TrackerComponent } from './routes/tracker/tracker.component';
import { AfkwardenComponent } from './routes/afkwarden/afkwarden.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'client', component: ClientComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'tracker', component: TrackerComponent },
  { path: 'afkwarden', component: AfkwardenComponent },
];