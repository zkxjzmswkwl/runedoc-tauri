import { Routes } from "@angular/router";
import {
    HomeComponent,
    ClientComponent,
    SettingsComponent
} from './routes';

export const routes: Routes = [
  { path: '',         component: HomeComponent },
  { path: 'home',     component: HomeComponent },
  { path: 'client',   component: ClientComponent },
  { path: 'settings', component: SettingsComponent },
];