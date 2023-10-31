import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Hero } from 'src/app/models/hero';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-heroes-page',
  templateUrl: './user-heroes-page.component.html',
  styleUrls: ['./user-heroes-page.component.scss']
})
export class UserHeroesPageComponent implements OnInit,OnDestroy{
  constructor(
    private route:ActivatedRoute,
    private authService:AuthService,
    private router:Router
  ){}
  isModalClose!:boolean
  allUserHeroes!:Hero[]
  heroesInPage!:Hero[]
  page!:number
  subscriber!:Subscription
  ngOnInit():void{
    this.subscriber=this.route.data.subscribe((data:any)=>{
      console.log("user resolver data:",data[0])
      this.allUserHeroes=data[0].heroes
      this.page=data[0].page
      this.updateHeroesInPage()
      if (this.heroesInPage.length===0&&this.page!==1)
        this.router.navigate(['/user-heroes/1'],{replaceUrl:true})
    })
    this.subscriber.add(this.authService.user$.subscribe((user)=>{
      if (!user||user==="pending") return 
      this.allUserHeroes=user.heroes?user.heroes:[]
      this.updateHeroesInPage()
      if (this.page>1&&this.heroesInPage.length===0)
        this.router.navigate(['/user-heroes/'+(this.page-1)],{replaceUrl:true})
    }))
  }
  updateHeroesInPage(){
    this.heroesInPage=this.allUserHeroes.slice((this.page-1)*3,this.page*3)
  }
  ngOnDestroy(): void {
    this.subscriber.unsubscribe()
  }
}
