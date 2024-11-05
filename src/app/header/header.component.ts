import { Component, inject } from '@angular/core';
import { GlobalService } from '../shared/services/global.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AsyncPipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly globalService = inject(GlobalService);
  readonly accounts$ = this.globalService.accounts$;
}
