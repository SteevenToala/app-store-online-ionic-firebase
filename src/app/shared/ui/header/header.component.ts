import { Component, Input, OnInit } from '@angular/core';
import { IonHeader, IonToolbar,
  IonButtons, IonButton, IonTitle,
  IonIcon, IonBackButton } from '@ionic/angular/standalone'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonHeader, IonToolbar, IonButtons,
    IonButton, IonTitle, IonIcon, IonBackButton]
})
export class HeaderComponent implements OnInit {
  @Input() title!:string
  @Input() backbutton!:string
  @Input() isModal!:boolean

  constructor() { }

  ngOnInit() {}

  onClick(){

  }

}