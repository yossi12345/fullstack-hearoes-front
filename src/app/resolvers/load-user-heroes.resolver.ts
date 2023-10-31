import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import {map, of} from 'rxjs';
import { Hero } from '../models/hero';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
export const loadUserHeroesResolver: ResolveFn<{heroes:Hero[],page:number}|null> =  (route, state) => {
    const page=route.params['page']*1
    const router=inject(Router)
    if (!(page>=1)){
      router.navigate(['/user-heroes/1'])
      return of(null)
    }
    const authService=inject(AuthService)
    return authService.user$.pipe(map((user:User|null|"pending")=>
      (user!=="pending"&&user?.heroes)?{heroes:user.heroes,page}:null
    ))
};
