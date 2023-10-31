import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, first, firstValueFrom, from, map, of, tap } from 'rxjs';
import { Hero } from '../models/hero';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  constructor(private authService:AuthService,private router:Router,private http:HttpClient) { }
  private allHeroesSub=new BehaviorSubject<{heroes:Hero[],page:number,amountOfHeroes:number}|null>(null)
  allHeroes$=this.allHeroesSub.asObservable()
  private heroForHeroPageSub=new BehaviorSubject<null|Hero|"pending">(null)
  heroforHeroPage$=this.heroForHeroPageSub.asObservable()
  navigateToHeroPage(hero:Hero){
    this.heroForHeroPageSub.next(hero)
    this.router.navigate(['/hero/'+hero.id])
  }
  updateHeroForHeroPageById(id:string){
    const heroForHeroPage=this.heroForHeroPageSub.value
    if (heroForHeroPage==="pending"||heroForHeroPage?.id===id) return of(true)
    const user=this.authService.getUser()
    if (!user||user==="pending")
      return of(false)
    const result=user.heroes?.find((hero)=>hero.id===id)
    if (result){
      this.heroForHeroPageSub.next(result)
      return of(true)
    } 
    this.heroForHeroPageSub.next("pending")
    return from(this.sendHttpRequest(environment.SERVER_URL+"heroes/"+id,"get")).
      pipe(tap((res)=>{
        this.heroForHeroPageSub.next(res?res:null)
      })).pipe(
        map(res=>res?true:false)
      )
    // from(this.sendHttpRequest(environment.SERVER_URL+"heroes/"+id,"get")).subscribe({
    //   next:(res)=>{
    //       this.heroForHeroPageSub.next(res?res:null)
    //   },
    //   error:(err)=>{
    //     this.heroForHeroPageSub.next(null)
    //   }
    // })
  }
  updateAllHeroesState(page:number=1){
    const currentAllHeroes=this.allHeroesSub.getValue()
    if (page===currentAllHeroes?.page){
      this.allHeroesSub.next(currentAllHeroes)
      return of(currentAllHeroes)
    }
    else{
      // try{
      //   console.log("TRY!")
      //   const res:any=await this.sendHttpRequest(environment.SERVER_URL+"heroes/"+page,"get")
      //   if (res)
      //     this.allHeroesSub.next({heroes:res.heroes,amount:res.amountOfHeroes,page})
      //   console.log("res1",res)
      // }catch(err){
      //   console.log(err)
      // }
      // this.sendHttpRequest(environment.SERVER_URL+"heroes/"+page,"get").then((res)=>{
      //   if (res)
      //     this.allHeroesSub.next({heroes:res.heroes,amount:res.amountOfHeroes,page})
      //   console.log("res1",res)
      // }).catch((err)=>console.log(err))
      
      return this.sendHttpRequest(environment.SERVER_URL+"heroes/"+page,"get").pipe(tap((res)=>{
        if (res)
           this.allHeroesSub.next({heroes:res.heroes,amountOfHeroes:res.amountOfHeroes,page})
        console.log("res1",res)
      }))
    }
  }
  changeUserHeroes(action:"own"|"unown",hero:Hero){
    const token:string|null=this.authService.getToken()
    if (!token||(action==="own"&&hero.owner)||(action==="unown"&&!hero.owner)) return 
    this.sendHttpRequest(environment.SERVER_URL+"heroes/"+action+"/"+hero.id,"patch",{}).pipe(first()).subscribe({
      next:(res)=>{
        if (!res) return 
        console.log("oun1",res)
        this.authService.updateUserHeroes(res)
        const user=this.authService.getUser()
        if (user===null||user==="pending") return
        const heroForHeroPage=this.heroForHeroPageSub.value
        if (heroForHeroPage!=="pending"&&heroForHeroPage?.id===hero.id){
          heroForHeroPage.owner=action==="own"?user:null
          this.heroForHeroPageSub.next(heroForHeroPage)
        }
        const allHeroesState=this.allHeroesSub.value
        if (!allHeroesState) return 
        const heroIndex=allHeroesState.heroes.findIndex((h)=>h.id===hero.id)
        if (heroIndex===-1) return 
        allHeroesState.heroes[heroIndex].owner=action==="own"?user:null
        this.allHeroesSub.next({...allHeroesState})
      },
      error:(err)=>{
        console.log(err)
      }
    })
    // try{
    //   const res=await this.sendHttpRequest(environment.SERVER_URL+"heroes/"+action+"/"+hero.id,"patch",{})
    //   if (!res) return 
    //   console.log("oun1",res)
    //   this.authService.updateUserHeroes(res)
    //   const user=this.authService.getUser()
    //   if (user===null||user==="pending") return
    //   const heroForHeroPage=this.heroForHeroPageSub.value
    //   if (heroForHeroPage!=="pending"&&heroForHeroPage?.id===hero.id){
    //     heroForHeroPage.owner=action==="own"?user:null
    //     this.heroForHeroPageSub.next(heroForHeroPage)
    //   }
    //   const allHeroesState=this.allHeroesSub.value
    //   if (!allHeroesState) return 
    //   const heroIndex=allHeroesState.heroes.findIndex((h)=>h.id===hero.id)
    //   if (heroIndex===-1) return 
    //   allHeroesState.heroes[heroIndex].owner=action==="own"?user:null
    //   this.allHeroesSub.next({...allHeroesState})
    // }catch(err){
    //   console.log(err)
    // } 
  }
  // async tryTrain(hero:Hero){
  //   const heroRestTimeInMiliseconds = 86400000
  //   const token=this.authService.getToken()
  //   if (!token) return {isSucceeded:false}
  //   const user=this.authService.getUser()
  //   if (user===null||user==="pending") return {isSucceeded:false}
  //   const train=async ():Promise<boolean>=>{
  //     try{
  //       const res=await this.sendHttpRequest(environment.SERVER_URL+"heroes/train/"+hero.id,"patch",{})
  //       if (!res) return false
  //       if (user.heroes){
  //         const heroIndex=user.heroes.findIndex((h)=>h.id===hero.id)
  //         if (heroIndex>-1){
  //           user.heroes[heroIndex]=res
  //           this.authService.updateUserHeroes([...user.heroes])
  //         }
  //       }
  //       const heroForHeroPage=this.heroForHeroPageSub.value
  //       if (heroForHeroPage!=="pending"&&heroForHeroPage?.id===hero.id)
  //         this.heroForHeroPageSub.next(res)
        
  //       const allHeroesState=this.allHeroesSub.value
  //       if (allHeroesState){
  //         const heroIndex=allHeroesState.heroes.findIndex((h)=>h.id===hero.id)
  //         if (heroIndex>-1){
  //           allHeroesState.heroes[heroIndex]=res
  //           this.allHeroesSub.next({...allHeroesState})
  //         }
  //       }
  //       return true
  //     }catch(err){
  //       console.log(err)
  //     }
  //     return false
  //   }
  //   if (hero.amountOfTrainingsToday<5) 
  //     return {isSucceeded:await train()}
  //   const lastTrainingDate=new Date(hero.lastTrainingDate)
  //   const allowedNextTrainingDate=new Date(lastTrainingDate.getTime()+heroRestTimeInMiliseconds)
  //   console.log("allowed",allowedNextTrainingDate)
  //   if ((new Date().getTime()-allowedNextTrainingDate.getTime())<0) 
  //     return {isSucceeded:false,allowedNextTrainingDate} 
  //   return {isSucceeded:await train()}
  // }
  tryTrain(hero:Hero){
    const heroRestTimeInMiliseconds = 86400000
    const token=this.authService.getToken()
    if (!token) return {isSucceeded:false}
    const user=this.authService.getUser()
    if (user===null||user==="pending") return of({isSucceeded:false})
    const train=():Observable<boolean>=>{
      return this.sendHttpRequest(environment.SERVER_URL+"heroes/train/"+hero.id,"patch",{}).
        pipe(tap((res)=>{
          if (res)return 
          if (user.heroes){
            const heroIndex=user.heroes.findIndex((h)=>h.id===hero.id)
            if (heroIndex>-1){
              user.heroes[heroIndex]=res
              this.authService.updateUserHeroes([...user.heroes])
            }
          }
          const heroForHeroPage=this.heroForHeroPageSub.value
          if (heroForHeroPage!=="pending"&&heroForHeroPage?.id===hero.id)
            this.heroForHeroPageSub.next(res)
          const allHeroesState=this.allHeroesSub.value
          if (allHeroesState){
            const heroIndex=allHeroesState.heroes.findIndex((h)=>h.id===hero.id)
            if (heroIndex>-1){
              allHeroesState.heroes[heroIndex]=res
              this.allHeroesSub.next({...allHeroesState})
            }
          }
        }
      )).pipe(map((res)=>{
        return res?true:false
      }))
    }
    if (hero.amountOfTrainingsToday<5) {
      return train().pipe(map((res)=>{
        return {isSucceeded:res}
      }))
    }
    const lastTrainingDate=new Date(hero.lastTrainingDate)
    const allowedNextTrainingDate=new Date(lastTrainingDate.getTime()+heroRestTimeInMiliseconds)
    console.log("allowed",allowedNextTrainingDate)
    if ((new Date().getTime()-allowedNextTrainingDate.getTime())<0) 
      return of({isSucceeded:false,allowedNextTrainingDate}) 
    return train().pipe(map(res=>{
      return {isSucceeded:res}
    }))
  }
  sendHttpRequest(url:string,method:"patch"|"post"|"get"|"put"|"delete",body?:object,):Observable<any>{
    const headers=new HttpHeaders({
      Authorization: 'Bearer '+this.authService.getToken()
    })
    console.log("try",this.authService.getToken())
    if (method==="delete"||method==="get")
      return this.http[method](url,{headers})
    
    return this.http[method](url,body,{headers})
  }
}
// Design pattern,factory pattern, dependency injection ,token
// לקרוא איך עושים middleware לcontroller ספציפי בעזרת attribute 