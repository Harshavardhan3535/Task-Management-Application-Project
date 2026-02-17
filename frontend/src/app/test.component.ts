import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  standalone: true,
  template: `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); text-align: center;">
        <h1 style="color: #333; margin-bottom: 20px;">✅ Angular is Working!</h1>
        <p style="color: #666; margin-bottom: 20px;">All styles are inline</p>
        <button style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer;" (click)="navigateToLogin()">
          Go to Login Page
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class TestComponent {
  navigateToLogin() {
    window.location.href = '/login';
  }
}
