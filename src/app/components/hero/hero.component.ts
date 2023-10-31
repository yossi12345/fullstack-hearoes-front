import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Hero } from 'src/app/models/hero';
import { DialogService } from 'src/app/services/dialog.service';
import { HeroesService } from 'src/app/services/heroes.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  @Input() hero!:Hero
  @Input() isUserPage!:boolean
  constructor(private heroesService:HeroesService,private dialogService:DialogService){}
  ownHero(){
    this.heroesService.changeUserHeroes("own",this.hero)
  }
  unownHero(){
    this.heroesService.changeUserHeroes("unown",this.hero)
  }
  train(){
    this.heroesService.tryTrain(this.hero).subscribe(({isSucceeded,allowedNextTrainingDate})=>{
      console.log("hero",isSucceeded,allowedNextTrainingDate)
      if (!isSucceeded&&allowedNextTrainingDate){
        console.log(allowedNextTrainingDate)
        this.dialogService.openDialog([
          `The hero ${this.hero.name} is very tired now.`,
          `You can train it in ${this.getDifferenceTimeFromNow(allowedNextTrainingDate)} hours`
        ])
      }
    })
  }
  getDifferenceTimeFromNow(date:Date):string{
    console.log("1a",new Date(),"2a",date)
    const timeDifferenceInMiliseconds=date.getTime()-(new Date().getTime())
    const timeDifferenceInSeconds=Math.floor(timeDifferenceInMiliseconds/1000)
    const hours=Math.floor(timeDifferenceInSeconds/3600)
    const minutes=Math.floor((timeDifferenceInSeconds%3600)/60)
    const seconds=timeDifferenceInSeconds%60
    console.log(seconds,minutes,hours,timeDifferenceInSeconds)
    return (hours<10?"0":"")+hours+":"+(minutes<10?"0":"")+minutes+":"+(seconds<10?"0":"")+seconds
  }
  navigateToHeroPage(){
    this.heroesService.navigateToHeroPage(this.hero)
  }
}
