import { inject, Injectable } from '@angular/core';
import { LoadingController, ToastController, AlertController,
        ModalController, ToastOptions, AlertOptions, ModalOptions
 } from '@ionic/angular/standalone'
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Utils {
  loadingCtrl = inject(LoadingController)
  toastCtrl = inject(ToastController)
  alertCtrl = inject(AlertController)
  modalCtrl = inject(ModalController)
  router = inject(Router)

  //LOADING
  async showLoading(){
    return this.loadingCtrl.create({spinner:'crescent'})
  }

  //TOAST
  async showToast(opts:ToastOptions){
    const toast = await this.toastCtrl.create(opts)
    toast.present()
  }

  //ALERT
  showAlert(opts:AlertOptions){
    return this.alertCtrl.create(opts)
  }

  //NAVIGATE
  routerLink(url:string){
    return this.router.navigateByUrl(url)
  }

  //MODAL
  async showModal(opts:ModalOptions){
    const modal = await this.modalCtrl.create(opts)
    await modal.present()

    const {data} = await modal.onWillDismiss()
    if(data) return data
  }

  dissmissModal(data?:any){
    this.modalCtrl.dismiss(data)
  }

  //LOCAL STORAGE
  saveInLocalStorage(key:string, value:any){
    return localStorage.setItem(key, JSON.stringify(value))
  }

  getFromLocalStorage<T>(key:string):T|null{
    const item = localStorage.getItem(key)
    if(item){
      return JSON.parse(item) as T
    }
    return null
  }

  //IMAGE
  async takeImage(promptLabelHeader:string){
    return await Camera.getPhoto({
      quality:90,
      allowEditing:true,
      resultType:CameraResultType.DataUrl,
      source:CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto:'Selecciona una imagen',
      promptLabelPicture:'Toma una foto'
    })
  }
}
