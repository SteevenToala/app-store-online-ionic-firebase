import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/ui/header/header.component';
import { LogoComponent } from 'src/app/shared/ui/logo/logo.component';
import { CustomInputComponent } from 'src/app/shared/ui/custom-input/custom-input.component';
import { Utils } from 'src/app/services/utils';
import { Firebase } from 'src/app/services/firebase';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, 
    LogoComponent, CustomInputComponent, ReactiveFormsModule, 
    IonButton, IonIcon
  ]
})
export class SignUpPage implements OnInit {
  form = new FormGroup({
    uid: new FormControl(''),
    name: new FormControl('',[Validators.required, Validators.minLength(4)]),
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required, Validators.minLength(6)])
  })
  utilsSrv = inject(Utils)
  firebaseSrv = inject(Firebase)

  ngOnInit() {
  }

  async submit(){
    if(this.form.valid){
      const loading = await this.utilsSrv.showLoading()
      await loading.present()
      this.firebaseSrv.signUp(this.form.value as User).then(async res => {
        await this.firebaseSrv.updateUser(this.form.value.name!)
        let uid = res.user.uid
        this.form.controls.uid.setValue(uid)
        this.setUserInfo(uid)
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

  async setUserInfo(uid:string){
    let path = `users/${uid}`
    delete this.form.value.password

    this.firebaseSrv.setDocument(path,this.form.value).then(async res => {
      this.utilsSrv.saveInLocalStorage('user', this.form.value)
      this.utilsSrv.routerLink('/list')
      this.utilsSrv.showToast({
        message:`Bienvenido ${this.form.value.name}`,
        duration:1500,
        color:'primary',
        position:'middle',
        icon:'person-circle-outline'
      })
      this.form.reset()
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

}
