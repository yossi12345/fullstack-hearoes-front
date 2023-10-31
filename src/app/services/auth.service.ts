import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, firstValueFrom, map, of, tap } from 'rxjs';
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
  private userSub=new BehaviorSubject<User|null|"pending">(this.token?"pending":null)
  user$=this.userSub.asObservable()
  passwordRegex=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,20}/
  usernameRegex=/^[a-zA-Z0-9]{2,10}$/
  getToken(){
    return this.token
  }
  getUser(){
    return this.userSub.value
  }
  updateUserHeroes(newUserHeroes:Hero[]){ 
    const user=this.userSub.value
    if (user===null||user==="pending")return 
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
      next:(res:any)=>{
         this.userSub.next({username:res.username,heroes:res.heroes})
      },
    })
  }
  signIn(username:string,password:string){
    return this.signInOrUp(true,username,password)
  }
  signUp(username:string,password:string){
    if (!this.passwordRegex.test(password)||!this.usernameRegex.test(username))
      return of(false)
    return this.signInOrUp(false,username,password)
  }
  signInOrUp(isSignIn:boolean,username:string,password:string){
    console.log("aluf")
    
    return this.http.post(environment.SERVER_URL+"account"+(isSignIn?"/login":""),{username,password}).pipe(tap((res:any)=>{
      if (!res){
        console.log(res) 
        return 
      }
      sessionStorage.setItem("token",res.token)
      console.log("res",res)
      this.token=res.token
      this.userSub.next({username:res.username,heroes:res.heroes})
      this.router.navigate(["heroes/1"],{replaceUrl:true})

    })).pipe(map((res)=>res?true:false))
  }
  signOut(){
    sessionStorage.removeItem('token')
    this.userSub.next(null)
    this.token=null
    this.router.navigate(['/sign-in'],{replaceUrl:true})
  }
}
