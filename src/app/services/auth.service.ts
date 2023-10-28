import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {first} from "rxjs"
import { Hero } from '../models/hero';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router:Router,private http:HttpClient) {
    this.getUserFirstTime()
  }
  private token:string|null=sessionStorage.getItem('token')
  private userSub=new BehaviorSubject<User|null>(null)
  user$=this.userSub.asObservable()
  passwordRegex=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,20}/
  getToken(){
    return this.token
  }
  getUser(){
    return this.userSub.value
  }
  updateUserHeroes(newUserHeroes:Hero[]){
    
    const user=this.userSub.value
    if (user===null)return 
    user.heroes=newUserHeroes
    this.userSub.next({...user})
  }
  getUserFirstTime (){
    if (!this.token) return 

    this.http.get(environment.SERVER_URL+"account",{
      headers:new HttpHeaders().set('Authorization', 'Bearer '+this.token)
    }).
    pipe(first()).subscribe({
      error:(res)=>{
        sessionStorage.removeItem("token")
        this.token=null
        this.userSub.next(null)
      },
      next:(res)=>{
         this.userSub.next((res as User))
      },
    })
  }
  async signIn(username:string,password:string){
    return await this.signInOrUp(true,username,password)
  }
  async signUp(username:string,password:string){
    if (!(this.passwordRegex.test(password))||username.length<2||username.length>10)
      return false
    return await this.signInOrUp(false,username,password)
  }
  async signInOrUp(isSignIn:boolean,username:string,password:string){
    console.log("aluf")
    try{
      const res:any=await firstValueFrom(this.http.post(environment.SERVER_URL+"account"+(isSignIn?"/login":""),{username,password}))
      if (!res)
        return false
      sessionStorage.setItem("token",res.Token)
      this.token=res.Token
      this.userSub.next({username:res.Username,heroes:res.Heroes})
      return true
    }catch(err){
      console.log(err)
      return false
    }
  }
  signOut(){
    sessionStorage.removeItem('token')
    this.userSub.next(null)
    this.token=null
    this.router.navigate(['/sign-in'],{replaceUrl:true})
  }
}
