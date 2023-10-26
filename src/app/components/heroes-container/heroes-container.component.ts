import { Component, Input } from '@angular/core';
import { Hero } from 'src/app/models/hero';

@Component({
  selector: 'app-heroes-container',
  templateUrl: './heroes-container.component.html',
  styleUrls: ['./heroes-container.component.scss']
})
export class HeroesContainerComponent {
  @Input() heroes!:Hero[]
  @Input() isUserPage!:boolean
}
