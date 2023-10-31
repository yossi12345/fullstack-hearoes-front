import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, first } from 'rxjs';
import { Hero } from 'src/app/models/hero';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { HeroesService } from 'src/app/services/heroes.service';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styleUrls: ['./hero-page.component.scss']
})
export class HeroPageComponent implements OnInit,OnDestroy{
  hero!:Hero|null
  subscriber!:Subscription
  user!:User|null
  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private dialogService:DialogService,
    private authService:AuthService,
    private heroService:HeroesService
  ){}
  ngOnInit(): void {
    this.subscriber=this.route.data.subscribe({
      next:(data:any)=>{
        console.log("user resolver data:",data[0])
        if (!data[0]){
          this.router.navigate(['heroes/1'])
          this.dialogService.openDialog("this hero do not exist")

        }
      },
      error:()=>{
        console.log("ERR2")
        this.router.navigate(['heroes/1'])
        this.dialogService.openDialog("this hero do not exist")
      }
    })
    this.subscriber.add(this.authService.user$.subscribe((user)=>{
      console.log("user",user)
        this.user=user==="pending"?null:user
    }))
    this.subscriber.add(this.heroService.heroforHeroPage$.subscribe(hero=>{
      this.hero=hero==="pending"?null:hero
    }))
  }
  ngOnDestroy(): void {
    this.subscriber.unsubscribe()
  }
}
