import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HeroesContainerComponent } from './components/heroes-container/heroes-container.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { DisplayPagesComponent } from './components/display-pages/display-pages.component';
import { HeroComponent } from './components/hero/hero.component';
import { HeroPageComponent } from './components/pages/hero-page/hero-page.component';
import { SignInPageComponent } from './components/pages/sign-in-page/sign-in-page.component';
import { SignUpPageComponent } from './components/pages/sign-up-page/sign-up-page.component';
import { UserHeroesPageComponent } from './components/pages/user-heroes-page/user-heroes-page.component';
import { AllHeroesPageComponent } from './components/pages/all-heroes-page/all-heroes-page.component';
import { LogFormComponent } from './components/log-form/log-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeroesContainerComponent,
    DialogComponent,
    DisplayPagesComponent,
    HeroComponent,
    HeroPageComponent,
    SignInPageComponent,
    SignUpPageComponent,
    UserHeroesPageComponent,
    AllHeroesPageComponent,
    LogFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
