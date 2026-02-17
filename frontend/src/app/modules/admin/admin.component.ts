import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:40px">
      <h2>Admin Panel</h2>
      <p>This page is restricted to admin users.</p>
    </div>
  `
})
export class AdminComponent {}
