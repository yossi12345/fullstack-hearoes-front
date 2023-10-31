import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, of, skip } from 'rxjs';
export const isUnloggedGuard: CanActivateFn = (route, state) => {
  const authService:AuthService=inject(AuthService)
  const router=inject(Router)
  const userSubValue=authService.getUser()
  switch(userSubValue){
    case "pending":
      return authService.user$.pipe(skip(1)).pipe(map((user)=>{
        if (!user)
          return true
        router.navigate(["/heroes/1"])
        return false
      }))
    case null:
      return of(true)
    default:
      router.navigate(["/heroes/1"])
      return of(false)
  }
}
