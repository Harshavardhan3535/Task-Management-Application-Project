import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <h2>Reset Password</h2>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <input
            class="auth-input"
            type="email"
            formControlName="email"
            readonly
          />

          <input
            class="auth-input"
            placeholder="OTP"
            formControlName="otp"
          />

          <input
            class="auth-input"
            type="password"
            placeholder="New Password"
            formControlName="password"
          />

          <button class="auth-button" type="submit">
            Reset Password
          </button>
        </form>

        <p *ngIf="error" class="error">{{ error }}</p>
      </div>
    </div>
  `
})
export class ResetPasswordComponent {
  error = '';

  form = this.fb.group({
    email: [''],
    otp: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const email = this.route.snapshot.queryParamMap.get('email');
    this.form.patchValue({ email });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.auth.resetPassword(this.form.value as any).subscribe({
      next: () => {
        alert('Password reset successful');
        this.router.navigate(['/login']);
      },
      error: err => {
        this.error = err.error?.message || 'Reset failed';
      }
    });
  }
}
