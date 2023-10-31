import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Hero } from 'src/app/models/hero';

@Component({
  selector: 'app-all-heroes-page',
  templateUrl: './all-heroes-page.component.html',
  styleUrls: ['./all-heroes-page.component.scss']
})
export class AllHeroesPageComponent {
  constructor(private route:ActivatedRoute){}
  heroes!:Hero[]
  amountOfHeroes!:number
  page!:number
  subscriber!:Subscription
  ngOnInit():void{
    console.log("(((")
   this.subscriber=this.route.data.subscribe((data:any)=>{
      console.log("resolver data:",data)
      this.heroes=data[0].heroes
      this.amountOfHeroes=data[0].amountOfHeroes
      this.page=data[0].page
    })
  }
  ngOnDestroy(): void {
    this.subscriber.unsubscribe()
  }
}
