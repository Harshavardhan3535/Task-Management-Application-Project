import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 1️⃣ Check login
  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // 2️⃣ Check role (if route requires it)
  const expectedRole = route.data?.['role'];
  const userRole = auth.getUserRole();

  if (expectedRole && userRole !== expectedRole) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
