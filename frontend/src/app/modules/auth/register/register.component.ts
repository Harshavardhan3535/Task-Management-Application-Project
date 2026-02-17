import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  styleUrls: [
    '../../../shared/styles/auth.styles.scss',
    './register.component.css'
  ],
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <h2>Task Manager</h2>
        <p class="subtitle">Create your account</p>

        <form [formGroup]="form" (ngSubmit)="register()">
          <input
            class="auth-input"
            type="text"
            placeholder="Name"
            formControlName="name"
          />

          <input
            class="auth-input"
            type="email"
            placeholder="Email"
            formControlName="email"
          />

          <input
            class="auth-input"
            type="password"
            placeholder="Password"
            formControlName="password"
          />

          <button class="auth-button" type="submit">
            Register
          </button>
        </form>

        <p class="switch-text">
          Already have an account?
          <a routerLink="/login">Login</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea, #764ba2);
    }

    .auth-card {
      background: #fff;
      padding: 40px;
      border-radius: 14px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.25);
      text-align: center;
    }

    h2 {
      margin-bottom: 6px;
      font-size: 28px;
    }

    .subtitle {
      margin-bottom: 24px;
      color: #666;
    }

    .auth-input {
      width: 100%;
      padding: 14px 16px;
      margin-bottom: 18px;
      border-radius: 8px;
      border: 1px solid #ddd;
      font-size: 16px;
      box-sizing: border-box;
      outline: none;
    }

    .auth-input:focus {
      border-color: #667eea;
    }

    .auth-button {
      width: 100%;
      padding: 14px;
      background: #667eea;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      margin-top: 10px;
    }

    .auth-button:hover {
      background: #5a67d8;
    }

    .switch-text {
      margin-top: 22px;
      font-size: 14px;
      color: #555;
    }

    .switch-text a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }
  `]
})

export class RegisterComponent {
  error = '';

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  register() {
    if (this.form.invalid) return;
    
    this.auth.register(this.form.value).subscribe({
      next: (res: any) => {
        // 🔁 Redirect to verify-email page
        this.router.navigate(['/verify-email'], {
          queryParams: { email: res.email }
        });
      },
      error: err => {
        alert(err.error?.message || 'Registration failed');
      }
    });
  }
}
