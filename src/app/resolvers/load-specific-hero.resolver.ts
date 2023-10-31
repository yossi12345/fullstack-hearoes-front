import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { HeroesService } from '../services/heroes.service';
import { Hero } from '../models/hero';
import { from } from 'rxjs';
export const loadSpecificHeroResolver: ResolveFn<boolean> = (route, state) => {
  const heroesService=inject(HeroesService)
  const heroId=route.params['id']
  return heroesService.updateHeroForHeroPageById(heroId)
  
};
