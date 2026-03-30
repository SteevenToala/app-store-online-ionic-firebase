import { Component, OnInit } from '@angular/core';
import {IonIcon, IonText} from '@ionic/angular/standalone'
@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  imports: [IonIcon, IonText]
})
export class LogoComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
