import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/ui/header/header.component';
import { LogoComponent } from 'src/app/shared/ui/logo/logo.component';
import { CustomInputComponent } from 'src/app/shared/ui/custom-input/custom-input.component';
import { RouterLink } from '@angular/router';
import { Utils } from 'src/app/services/utils';
import { Firebase } from 'src/app/services/firebase';
import { User } from 'src/app/models/user';
import { addIcons } from 'ionicons';
import { shieldOutline, mailOutline, lockClosedOutline,
  logInOutline, personAddOutline, personOutline, eyeOutline,
  eyeOffOutline, add, closeCircleOutline, createOutline, trashOutline
 } from 'ionicons/icons';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent,
    LogoComponent, CustomInputComponent, IonContent, ReactiveFormsModule,
    RouterLink, IonButton, IonIcon
  ]
})
export class AuthPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required, Validators.minLength(6)])
  })
  utilsSrv = inject(Utils)
  firebaseSrv = inject(Firebase)

  constructor() { 
    this.registryIcons()
  }

  ngOnInit() {
  }

  async submit(){
    if(this.form.valid){
      const loading = await this.utilsSrv.showLoading()
      await loading.present()
      this.firebaseSrv.signIn(this.form.value as User).then(async res => {
        this.getUserInfo(res.user.uid)
      }).catch(error => {
        this.utilsSrv.showToast({
          message:error.message,
          duration:1500,
          color:'danger',
          position:'middle',
          icon:'alert-circle-outline'
        })         
      }).finally(() => {
        loading.dismiss()
      })
    }    
  }

  async getUserInfo(uid:string){
    let path = `users/${uid}`
    this.firebaseSrv.getDocument(path).then((doc) => {
      const user = doc as User
      this.utilsSrv.saveInLocalStorage('user',user)
      this.utilsSrv.routerLink('/list')
      this.form.reset()
      this.utilsSrv.showToast({
        message:`Bienvenido ${user.name}`,
        duration:1500,
        color:'primary',
        position:'middle',
        icon:'person-circle-outline'        
      })
    }).catch(error => {
      this.utilsSrv.showToast({
        message:error.message,
        duration:1500,
        color:'danger',
        position:'middle',
        icon:'alert-circle-outline'
      })         
    })
  }

  registryIcons(){
    addIcons({shieldOutline, mailOutline, lockClosedOutline,
      logInOutline, personAddOutline, personOutline,
      eyeOutline, eyeOffOutline, add, closeCircleOutline, createOutline, 
      trashOutline
    })
  }  
}
