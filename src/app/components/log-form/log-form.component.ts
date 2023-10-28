import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-log-form',
  templateUrl: './log-form.component.html',
  styleUrls: ['./log-form.component.scss']
})
export class LogFormComponent implements OnInit{
  @Input() isSignIn!:boolean
  passwordErrors=[
    {value:'be 8-20 characters',regex:/^.{6,20}$/},
    {value:'include at least one number',regex:/.*\d.*/},
    {value:'include at least one lowercase letter',regex:/.*[a-z].*/},
    {value:'include at least one uppercase letter',regex:/.*[A-Z].*/},
    {value:'include at least one of the special \n characters !@#$%^&*',regex:/.*[!@#$%^&*].*/}
  ]
  @ViewChild('passwordInput') passwordInput!:ElementRef
  logForm!:FormGroup
  isUserSubmited:boolean=false
  upperError:string=""
  constructor(private fb:FormBuilder,private authService:AuthService){}
  ngOnInit(): void {
    this.logForm=this.fb.group({
      username:['',[Validators.required, Validators.minLength(2),Validators.maxLength(10)]],
      password:['',[
        Validators.required,
        Validators.pattern(this.authService.passwordRegex)
      ]],
      repeatedPassword:['',[]]
    })
    this.passwordInput
  }
  getControl(name:'password'|'repeatedPassword'|'username'):FormControl{
    return this.logForm.get(name) as FormControl
  }
  getError(isPassword:boolean){
    const control=this.getControl(isPassword?'password':'username')
    if ((control.touched||this.isUserSubmited)&&control.getError('required'))
      return (isPassword?'password':'username')+' is required'
    if ((!control.touched&&!isPassword)||(isPassword&&!control.dirty))
      return ""
    if (!isPassword&&(control.getError('minlength')||control.getError('maxlength')))
      return "username must be 2-10 characters"
    return ""
  }
  handleSubmit(){
    this.isUserSubmited=true
    if (this.logForm.invalid){
      if (this.isSignIn){
        this.upperError=""
        setTimeout(()=>{
          this.upperError='the username or password is wrong'
        },300)
      }
      else if (this.getControl('password').hasError('pattern'))
        this.passwordInput.nativeElement.focus()
      return
    }
    console.log("UU")
    const password=this.getControl('password').value
    const username=this.getControl('username').value
    if (this.isSignIn){
      this.authService.signIn(username,password).then((isLogSuccessfully)=>{
        if (!isLogSuccessfully){
          this.upperError=""
          setTimeout(()=>{
            this.upperError='the username or password is wrong'
          },300)
        }
      })
    }
    else if (password===this.getControl('repeatedPassword').value){
      this.authService.signUp(username,password).then((isLogSuccessfully)=>{
        if (!isLogSuccessfully){
          this.upperError=""
          setTimeout(()=>{
            this.upperError='this username already exists'
          },300)
        }
      })
    } 
  }
}
