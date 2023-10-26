import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
export const isUnloggedGuard: CanActivateFn = (route, state) => {
  const authService:AuthService=inject(AuthService)
  if (!authService.getUser())
    return true
  const router=inject(Router)
  return router.createUrlTree(['heroes/1'])
};
