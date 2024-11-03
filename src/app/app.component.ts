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

  greetingMessage = '';

  constructor() {
    this.pngConfig.theme.set({ preset: Lara });
  }

  greet(event: SubmitEvent, name: string): void {
    event.preventDefault();

    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    invoke<string>('greet', { name }).then((text) => {
      this.greetingMessage = text;
    });
  }
}
