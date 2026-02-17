import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/login/login.component')
        .then(m => m.LoginComponent),
    canActivate: [guestGuard]   
  },

  {
    path: 'admin',
    loadComponent: () =>
      import('./modules/admin/admin.component')
    .then(m => m.AdminComponent),
    canActivate: [authGuard],
    data: { role: 'admin' }
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./modules/auth/register/register.component')
        .then(m => m.RegisterComponent),
    canActivate: [guestGuard]  
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./modules/dashboard/dashboard.component')
        .then(m => m.DashboardComponent),
    canActivate: [authGuard]   
  },

  {
    path: 'tasks',
    loadComponent: () =>
      import('./modules/tasks/task-list/task-list.component')
        .then(m => m.TaskListComponent),
    canActivate: [authGuard]   
  },

  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./modules/auth/forgot-password/forgot-password.component')
    .then(m => m.ForgotPasswordComponent),
    canActivate: [guestGuard]
  },

  {
    path: 'reset-password',
    loadComponent: () =>
      import('./modules/auth/reset-password/reset-password.component')
    .then(m => m.ResetPasswordComponent),
    canActivate: [guestGuard]
  },

  {
    path: 'verify-email',
    loadComponent: () =>
      import('./modules/auth/verify-email/verify-email.component')
    .then(m => m.VerifyEmailComponent),
    canActivate: [guestGuard]
  },

  {
    path: 'calendar',
    loadComponent: () =>
      import('./modules/calendar/calendar.component')
    .then(m => m.CalendarComponent)
  },


  {
  path: 'profile',
  loadComponent: () =>
    import('./modules/profile/profile.component')
      .then(m => m.ProfileComponent),
  canActivate: [authGuard]
},

  { path: '**', redirectTo: 'login' }
];

