import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px;">
      <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); width: 100%; max-width: 400px;">
        <h2 style="color: #333; margin: 0 0 8px; text-align: center; font-size: 28px;">Task Manager</h2>
        <p style="color: #666; margin: 0 0 25px; text-align: center;">Sign in to your account</p>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">Email</label>
            <input style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;" 
                   type="email" 
                   formControlName="email" 
                   placeholder="Enter your email">
            <div *ngIf="email?.invalid && email?.touched" style="color: #e74c3c; font-size: 14px; margin-top: 5px;">
              Please enter a valid email
            </div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">Password</label>
            <input style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;" 
                   type="password" 
                   formControlName="password" 
                   placeholder="Enter your password">
            <div *ngIf="password?.invalid && password?.touched" style="color: #e74c3c; font-size: 14px; margin-top: 5px;">
              Password must be at least 6 characters
            </div>
          </div>
          
          <!-- Error message display -->
          <div *ngIf="errorMessage" style="background: #fee; color: #c33; padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 14px;">
            {{ errorMessage }}
          </div>
          
          <button style="width: 100%; padding: 14px; background: #667eea; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; margin-top: 10px;" 
                  type="submit" 
                  [disabled]="loginForm.invalid || loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        
        <!-- Demo note -->
        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
          <p style="margin: 0;">Use registered credentials to login/sign in</p>
        </div>
        
        <!-- Register link -->
        <div style="margin-top: 20px; text-align: center;">
          <p style="color: #666; margin: 0;">
            Don't have an account? 
            <a routerLink="/register" style="color: #667eea; font-weight: 500; text-decoration: none;">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [],
  styleUrls: [
    '../../../shared/styles/auth.styles.scss',
    './login.component.scss'
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage: string = '';
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  onSubmit(): void {
    if (this.loginForm.invalid) return;
    
    this.loading = true;
    this.errorMessage = '';
    
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (!res.token || !res.user) {
          this.errorMessage = 'Invalid server response';
          this.loading = false;
          return;
        }
        
        this.authService.saveToken(res.token);
        this.authService.saveUser(res.user);
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
