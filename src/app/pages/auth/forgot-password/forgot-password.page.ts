import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { LogoComponent } from 'src/app/shared/ui/logo/logo.component';
import { HeaderComponent } from 'src/app/shared/ui/header/header.component';
import { CustomInputComponent } from 'src/app/shared/ui/custom-input/custom-input.component';
import { Firebase } from 'src/app/services/firebase';
import { Utils } from 'src/app/services/utils';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule,IonButton, IonIcon,
    HeaderComponent, LogoComponent, CustomInputComponent, ReactiveFormsModule
  ]
})
export class ForgotPasswordPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email])
  })
  utilsSrv = inject(Utils)
  firebaseSrv = inject(Firebase)

  constructor() { }

  ngOnInit() {
  }

  async submit(){
    if (this.form.invalid) return;

    const loading = await this.utilsSrv.showLoading();
    await loading.present();

    const email = (this.form.controls.email.value || '').trim().toLowerCase();

    this.firebaseSrv.sendRecoveryEmail(email)
      .then(() => {
        this.utilsSrv.showToast({
          message: 'Te enviamos un correo para restablecer tu contrasena.',
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'mail-outline'
        });
        this.form.reset();
      })
      .catch(error => {
        this.utilsSrv.showToast({
          message: error?.message || 'No se pudo enviar el correo de recuperacion.',
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }

}
