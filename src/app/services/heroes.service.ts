import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Hero } from '../models/hero';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  constructor(private authService:AuthService,private router:Router,private http:HttpClient) { }
  private allHeroesSub=new BehaviorSubject<{heroes:Hero[],page:number,amount:number}|null>(null)
  allHeroes$=this.allHeroesSub.asObservable()
  private heroForHeroPage:null|Hero=null
  navigateToHeroPage(hero:Hero){
    this.heroForHeroPage=hero
    this.router.navigate(['/hero/'+hero.name])
  }
  async getSpecificHero(id:string){
    if (this.heroForHeroPage?.id===id) return this.heroForHeroPage
    const user=await firstValueFrom(this.authService.user$)
    if (!user)
      return null
    const result=user.heroes?.find((hero)=>hero.id===id)
    if (result){
      this.heroForHeroPage=result
      return result
    } 
    try{
      const result=await this.sendHttpRequest(environment.SERVER_URL+"heroes/"+id,"get")
      if (result)
        return result
    }catch(err){
      console.log(err)
    }
    return null
  }
  async updateAllHeroesState(page:number=1){
    const currentAllHeroes=this.allHeroesSub.getValue()
    if (page===currentAllHeroes?.page)
      this.allHeroesSub.next(currentAllHeroes)
    else{
      try{
        const res:any=await this.sendHttpRequest(environment.SERVER_URL+"heroes/"+page,"get")
        if (res)
          this.allHeroesSub.next({heroes:res.heroes,amount:res.amountOfHeroes,page})
      }catch(err){
        console.log(err)
      }
    }
  }
  async changeUserHeroes(action:"own"|"unown",hero:Hero){
    const token:string|null=this.authService.getToken()
    if (!token||(action==="own"&&hero.owner)||(action==="unown"&&!hero.owner)) return 
    try{
      const res=await this.sendHttpRequest(environment.SERVER_URL+"heroes/"+action+"/"+hero.id,"patch",{})
      if (!res) return 
      this.authService.updateUserHeroes(res)
      const user=await firstValueFrom(this.authService.user$)
      if (user===null) return
      if (this.heroForHeroPage?.id===hero.id)
        this.heroForHeroPage.owner=action==="own"?user:null
      const allHeroesState=this.allHeroesSub.getValue()
      if (!allHeroesState) return 
      const heroIndex=allHeroesState.heroes.findIndex((h)=>h.id===hero.id)
      if (heroIndex===-1) return 
      allHeroesState.heroes[heroIndex].owner=user
      this.allHeroesSub.next({...allHeroesState})
    }catch(err){
      console.log(err)
    } 
  }
  async tryTrain(hero:Hero){
    const heroRestTimeInMiliseconds = 86400000
    const token=this.authService.getToken()
    if (!token) return {isSucceeded:false}
    const user=this.authService.getUser()
    if (user===null) return {isSucceeded:false}
    const train=async ():Promise<boolean>=>{
      try{
        const res=await this.sendHttpRequest(environment.SERVER_URL+"heroes/train/"+hero.id,"patch",{})
        if (!res) return false
        if (user.heroes){
          const heroIndex=user.heroes.findIndex((h)=>h.id===hero.id)
          if (heroIndex>-1){
            user.heroes[heroIndex]=res
            this.authService.updateUserHeroes([...user.heroes])
          }
        }
        if (this.heroForHeroPage?.id===hero.id)
          this.heroForHeroPage=res
        
        const allHeroesState=this.allHeroesSub.getValue()
        if (allHeroesState){
          const heroIndex=allHeroesState.heroes.findIndex((h)=>h.id===hero.id)
          if (heroIndex>-1){
            allHeroesState.heroes[heroIndex]=res
            this.allHeroesSub.next({...allHeroesState})
          }
        }
        return true
      }catch(err){
        console.log(err)
      }
      return false
    }
    if (hero.amountOfTrainingsToday<5) 
      return {isSucceeded:await train()}
    
    const allowedNextTrainingDate=new Date(hero.lastTrainingDate.getTime()+heroRestTimeInMiliseconds)
    if (new Date().getTime()-allowedNextTrainingDate.getTime()<heroRestTimeInMiliseconds) 
      return {isSucceeded:false,allowedNextTrainingDate} 
    return {isSucceeded:await train()}
  }
  async sendHttpRequest(url:string,method:"patch"|"post"|"get"|"put"|"delete",body?:object,):Promise<any>{
    const headers=new HttpHeaders({
      Authorization: 'Bearer '+this.authService.getToken()
    })
    if (method==="delete"||method==="get")
      return await firstValueFrom(this.http[method](url,{headers}))
    
    return await firstValueFrom(this.http[method](url,body,{headers}))
  }

}
