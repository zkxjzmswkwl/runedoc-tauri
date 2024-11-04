import { Component } from '@angular/core';
import { Account } from '../models/account';
import { StateManager } from '../statemanager';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  public stateManager: StateManager = StateManager.getInstance();
  public activeAccounts: Account[] = [
    { rsn: 'Doc Boobies', active: false },
    { rsn: 'RyanGosling69', active: true },
  ];

  constructor() {
    console.log('header ctor');
  }
}
