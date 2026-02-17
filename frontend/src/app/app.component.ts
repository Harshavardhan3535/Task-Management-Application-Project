import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar *ngIf="isLoggedIn"></app-navbar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(private auth: AuthService) {}

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
  toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}
}
