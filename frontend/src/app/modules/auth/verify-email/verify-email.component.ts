import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <h2>Verify Email</h2>

        <form [formGroup]="form" (ngSubmit)="verify()">
          <input
            class="auth-input"
            formControlName="email"
            placeholder="Email"
            readonly
          />

          <input
            class="auth-input"
            formControlName="otp"
            placeholder="Enter OTP"
          />

          <button class="auth-button" type="submit">
            Verify
          </button>
        </form>

        <p *ngIf="timeLeft > 0" class="timer">
          OTP expires in <strong>{{ timeLeft }}</strong> seconds
        </p>

        <button
          class="resend-btn"
          type="button"
          (click)="resend()"
          [disabled]="timeLeft > 0"
        >
          Resend OTP
        </button>
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
      background: white;
      padding: 40px;
      border-radius: 14px;
      width: 100%;
      max-width: 420px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.25);
    }

    .auth-input {
      width: 100%;
      padding: 14px;
      margin-bottom: 16px;
      border-radius: 8px;
      border: 1px solid #ddd;
      font-size: 16px;
    }

    .auth-button {
      width: 100%;
      padding: 14px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
    }

    .timer {
      margin-top: 12px;
      font-size: 14px;
      color: #555;
    }

    .resend-btn {
      margin-top: 12px;
      background: transparent;
      border: none;
      color: #667eea;
      cursor: pointer;
      font-weight: 500;
    }

    .resend-btn:disabled {
      color: #aaa;
      cursor: not-allowed;
    }
  `]
})
export class VerifyEmailComponent implements OnInit, OnDestroy {

  form = this.fb.group({
    email: ['', Validators.required],
    otp: ['', Validators.required]
  });

  timeLeft = 60;
  private timer!: any;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    if (email) {
      this.form.patchValue({ email });
    }

    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  verify(): void {
    if (this.form.invalid) return;

    this.auth.verifyEmail(this.form.value as any).subscribe({
      next: res => {
        this.auth.saveToken(res.token);
        this.auth.saveUser(res.user);
        this.router.navigate(['/dashboard']);
      },
      error: err => alert(err.error?.message || 'Verification failed')
    });
  }

  resend(): void {
    const email = this.form.value.email!;
    this.auth.resendOtp(email).subscribe({
      next: () => {
        alert('OTP resent');
        this.timeLeft = 60;
        this.startTimer();
      },
      error: err => alert(err.error?.message || 'Failed to resend OTP')
    });
  }
}
