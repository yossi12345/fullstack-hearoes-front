import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  subscriber!:Subscription
  user!:User|null
  @Input() isUserHeroesPage!:boolean
  @Input() isAllHeroesPage!:boolean
  constructor(private authService:AuthService){}
  ngOnInit(): void {
    this.subscriber=this.authService.user$.subscribe((user)=>{
      this.user=user==="pending"?null:user
    })
  }
  ngOnDestroy(): void {
    this.subscriber.unsubscribe()
  }
  signOut(){
    this.authService.signOut()
  }
}
