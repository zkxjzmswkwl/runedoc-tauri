import { Component, inject, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [ButtonModule, BadgeModule, AvatarModule, MenuModule, SidebarModule, DividerModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent {
  private readonly router = inject(Router);
  public items: MenuItem[] = [
    { label: 'Home', icon: 'pi pi-home', command: () => this.router.navigate(['/home']) },
    { label: 'Debug', icon: 'pi pi-code', command: () => this.router.navigate(['/client']) },
    { label: 'Metrics', icon: 'pi pi-chart-bar', command: () => this.router.navigate(['/tracker']) },
    { label: 'Settings', icon: 'pi pi-cog', command: () => this.router.navigate(['/settings']) },
  ];
  public sidebarVisible = true;

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  closeCallback(e: Event): void {
    this.sidebarRef.close(e);
  }
}
