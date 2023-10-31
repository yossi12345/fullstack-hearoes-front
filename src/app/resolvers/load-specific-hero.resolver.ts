import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { HeroesService } from '../services/heroes.service';
import { catchError, of } from 'rxjs';
import { DialogService } from '../services/dialog.service';
export const loadSpecificHeroResolver: ResolveFn<boolean> = (route, state) => {
  const heroesService=inject(HeroesService)
  const router=inject(Router)
  const dialogService=inject(DialogService)
  const heroId=route.params['id']
  console.log("R")
  return heroesService.updateHeroForHeroPageById(heroId).
    pipe(catchError(()=>{
      router.navigate(['heroes/1'])
      dialogService.openDialog("this hero do not exist")
      return of(false)
    }))
  
};
