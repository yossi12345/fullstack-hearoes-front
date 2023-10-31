import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, of, skip, switchMap } from 'rxjs';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const authService:AuthService=inject(AuthService)
  const router=inject(Router)
  console.log("guard",authService.getUser())
  const userSubValue=authService.getUser()
  switch(userSubValue){
    case "pending":
      return authService.user$.pipe(skip(1)).pipe(map((user)=>{
        console.log(":::",user)
        if (user)
          return true
        router.navigate(["/sign-in"])
        return false
      }))
    case null:
      router.navigate(["/sign-in"])
      return of(false)
    default:
      return of(true)
  }
}
