import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <h2>Forgot Password</h2>
        <p class="subtitle">Enter your email to receive OTP</p>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <input
            class="auth-input"
            type="email"
            placeholder="Email"
            formControlName="email"
          />

          <button class="auth-button" type="submit">
            Send OTP
          </button>
        </form>

        <p *ngIf="message" class="success">{{ message }}</p>
        <p *ngIf="error" class="error">{{ error }}</p>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  message = '';
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  submit(): void {
    if (this.form.invalid) return;

    const email = this.form.value.email as string;

    this.auth.forgotPassword(email).subscribe({
      next: () => {
        this.router.navigate(['/reset-password'], {
          queryParams: { email }
        });
      },
      error: err => {
        this.error = err.error?.message || 'Failed to send OTP';
      }
    });
  }
}
