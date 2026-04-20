import { Component, inject, Input, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CustomInputComponent } from '../custom-input/custom-input.component';
import { IonContent, IonAvatar, IonIcon, IonButton } from '@ionic/angular/standalone'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { Firebase } from 'src/app/services/firebase';
import { Utils } from 'src/app/services/utils';

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.scss'],
  imports: [HeaderComponent, CustomInputComponent, IonContent,
    IonAvatar, IonIcon, IonButton, ReactiveFormsModule] 
})
export class AddUpdateComponent  implements OnInit {
  @Input() product?:Product
  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(6)]),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(0, [Validators.required, Validators.min(0)]),
  })

  firebaseSrv = inject(Firebase)
  utilsSrv = inject(Utils)

  user = {} as User

  constructor() { }

  ngOnInit() {
    this.user = this.utilsSrv.getFromLocalStorage('user') as User
    if(this.product?.id) this.form.setValue(this.product)
  }

  setNumberInputs(){

  }

  submit(){
    if(this.form.valid){
      if(this.product?.id) this.updateProduct()
        else this.addProduct()
    }
  }

  async takeImage(){
    const imageUrl = (await this.utilsSrv.takeImage('Selecciona una imagen para tu producto')).dataUrl
    if(imageUrl) this.form.controls.image.setValue(imageUrl)
  }

  updateProduct(){
    let path = `users/${this.user.uid}/products/${this.product?.id}`
    const loading = this.utilsSrv.showLoading()
    loading.then((res) => res.present())

    const data = { ...this.form.value }
    delete data.id

    this.firebaseSrv.updateDocument(path, data).then(() => {
      this.utilsSrv.dissmissModal({success:true})
      this.utilsSrv.showToast({
        message:'Producto actualizado',
        color:'primary',
        duration:2000,
        position:'middle',
        icon:'checkmark-circle-outline'
      })
    }).catch(error => {
      this.utilsSrv.showToast({
        message:error.message,
        color:'danger',
        duration:2000,
        position:'middle',
        icon:'alert-circle-outline'
      })
    }).finally(() => {
      loading.then((res) => res.dismiss())
    })
  }

  async addProduct(){
    let path = `users/${this.user.uid}/products`
    const loading = await this.utilsSrv.showLoading()
    loading.present()

    let dataUrl = this.form.value.image
    let imagePath = `${this.user.uid}/${Date.now()}l`
    let imageUrl = await this.firebaseSrv.uploadImage(imagePath, dataUrl as string)

    this.form.controls.image.setValue(imageUrl)
    delete this.form.value.id

    this.firebaseSrv.addDocument(path, this.form.value).then(async res => {
      this.utilsSrv.dissmissModal({success:true})
      this.utilsSrv.showToast({
        message:'Registro exitoso',
        color:'primary',
        duration:2000,
        position:'middle',
        icon:'person-circle-outline'
      }).catch(error => {
        this.utilsSrv.showToast({
          message:error.message,
          color:'danger',
          duration:2000,
          position:'middle',
          icon:'alert-circle-outline'
        })        
      }).finally(() => {
        loading.dismiss()
      })
    })

  }
}
