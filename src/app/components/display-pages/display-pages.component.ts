import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display-pages',
  templateUrl: './display-pages.component.html',
  styleUrls: ['./display-pages.component.scss']
})
export class DisplayPagesComponent {
  @Input() currentPage!:number
  @Input() amountOfHeroes!:number
  @Input() isUserPage!:boolean
}
