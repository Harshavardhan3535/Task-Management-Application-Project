import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  forgotPassword(email: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/forgot-password`, { email });
  }
  
  resetPassword(data: { email: string; otp: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/auth/reset-password`, data);
  }
  
  verifyEmail(
    data: { email: string; otp: string }
  ): Observable<{ token: string; user: any }> {
    return this.http.post<{ token: string; user: any }>(
      `${this.apiUrl}/auth/verify-email`,
      data
    );
  }
  resendOtp(email: string) {
    return this.http.post(`${this.apiUrl}/auth/resend-otp`, { email });
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserRole(): string {
    return this.getUser()?.role;
  }
  
  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }
  
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}
