import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpPageComponent } from './components/pages/sign-up-page/sign-up-page.component';
import { SignInPageComponent } from './components/pages/sign-in-page/sign-in-page.component';
import { isUnloggedGuard } from './guards/is-unlogged.guard';
import { AllHeroesPageComponent } from './components/pages/all-heroes-page/all-heroes-page.component';
import { isLoggedGuard } from './guards/is-logged.guard';
import { UserHeroesPageComponent } from './components/pages/user-heroes-page/user-heroes-page.component';
import { loadUserHeroesResolver } from './resolvers/load-user-heroes.resolver';
import { loadAllHeroesResolver } from './resolvers/load-all-heroes.resolver';
import { HeroPageComponent } from './components/pages/hero-page/hero-page.component';
import { loadSpecificHeroResolver } from './resolvers/load-specific-hero.resolver';

const routes: Routes = [
  {path:'',redirectTo:'sign-in',pathMatch:'full'},
  {path:'hero/:name',component:HeroPageComponent,canActivate:[isLoggedGuard],resolve:[loadSpecificHeroResolver]},
  {path:'sign-up',component:SignUpPageComponent,canActivate:[isUnloggedGuard]},
  {path:'sign-in',component:SignInPageComponent,canActivate:[isUnloggedGuard]},
  {path:'heroes/:page',component:AllHeroesPageComponent,canActivate:[isLoggedGuard],resolve:[loadAllHeroesResolver]},
  {path:'user-heroes/:page',component:UserHeroesPageComponent,canActivate:[isLoggedGuard],resolve:[loadUserHeroesResolver]},
  {path:'**',redirectTo:'sign-in'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
