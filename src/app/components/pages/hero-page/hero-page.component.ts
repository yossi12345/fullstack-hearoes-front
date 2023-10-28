import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, first } from 'rxjs';
import { Hero } from 'src/app/models/hero';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styleUrls: ['./hero-page.component.scss']
})
export class HeroPageComponent implements OnInit,OnDestroy{
  hero!:Hero
  subscriber!:Subscription
  user!:User|null
  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private dialogService:DialogService,
    private authService:AuthService
  ){}
  ngOnInit(): void {
    this.subscriber=this.route.data.subscribe((data:any)=>{
      console.log("user resolver data:",data[0])
      if (!data[0]){
        this.router.navigate(['heroes/1'])
        this.dialogService.openDialog("this hero do not exist")
      }
      else
        this.hero=data[0]

    })
    this.subscriber.add(this.authService.user$.subscribe((user)=>{
      this.user=user
    }))
  }
  ngOnDestroy(): void {
    this.subscriber.unsubscribe()
  }
}
