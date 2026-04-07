import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonItem, IonIcon, IonInput, 
  IonButton } from '@ionic/angular/standalone'
import { addIcons } from 'ionicons';
import { shieldOutline, mailOutline, lockClosedOutline,
  logInOutline, personAddOutline, personOutline, eyeOutline,
  eyeOffOutline, add
 } from 'ionicons/icons';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  imports: [IonItem, IonIcon, IonInput, IonButton, ReactiveFormsModule]
})
export class CustomInputComponent  implements OnInit {
  @Input() control!:FormControl
  @Input() type!:string
  @Input() label!:string
  @Input() autocomplete!:string
  @Input() icon!:string

  isPassword!:boolean
  hide:boolean = true

  constructor() { 
    this.registryIcons()
  }

  registryIcons(){
    addIcons({shieldOutline, mailOutline, lockClosedOutline,
      logInOutline, personAddOutline, personOutline,
      eyeOutline, eyeOffOutline, add
    })
  }

  ngOnInit() {
    if(this.type == 'password') this.isPassword = true
  }

  showOrHidePassword(){
    this.hide = !this.hide
    if(this.hide)
      this.type='password'
    else
      this.type='text'
  }
}
