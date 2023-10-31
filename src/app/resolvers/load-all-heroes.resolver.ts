import {ResolveFn,Router} from '@angular/router';
import {inject} from '@angular/core';
import {from, map, of} from 'rxjs';
import {HeroesService} from '../services/heroes.service';
import { Hero } from '../models/hero';
export const loadAllHeroesResolver: ResolveFn<{heroes:Hero[],amount:number,page:number}|null> = (route, state) => {
  const page=route.params['page']*1
  const router=inject(Router)
  if (!(page>=1)){
    router.navigate(['/heroes/1'])
    return of(null)
  }
  const heroesService=inject(HeroesService) 
  return heroesService.updateAllHeroesState(page)
 // return heroesService.allHeroes$
  .pipe(map((data)=>{
    console.log("**1",data)
    if (!data||data.heroes.length===0){
      console.log("**",data)
      router.navigate(['/heroes/1'])
      return null
    }
    return {...data,page}
  }))
};
