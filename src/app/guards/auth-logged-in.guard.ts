import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const authLoggedInGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = await firstValueFrom(authService.isLoggedIn$);

  if (isLoggedIn) {
    await router.navigateByUrl('/chatapp');
    return false;
  }

  return true;
};
