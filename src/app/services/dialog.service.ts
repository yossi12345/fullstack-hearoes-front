import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog/dialog.component';
@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog:MatDialog) { }
  openDialog(dialogContent:string|string[]){
    const data=(typeof dialogContent==="string") ? [dialogContent] : dialogContent
    this.dialog.open(DialogComponent,{data})
  }
}
