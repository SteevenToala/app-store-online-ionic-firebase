import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonRefresher, IonRefresherContent, IonCard,
        IonList, IonItemSliding, IonItem, IonAvatar, IonLabel, IonChip, IonItemOptions,
        IonItemOption, IonIcon, IonFab, IonFabButton
 } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/ui/header/header.component';
import { Product } from 'src/app/models/product';
import { Firebase } from 'src/app/services/firebase';
import { Utils } from 'src/app/services/utils';
import { User } from 'src/app/models/user';
import { AddUpdateComponent } from 'src/app/shared/ui/add-update/add-update.component';
import { orderBy } from 'firebase/firestore';
import { addIcons } from 'ionicons';
import { add, createOutline, shieldOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, IonContent, IonRefresher, 
    IonRefresherContent, IonCard, IonList, IonItemSliding, IonItem, 
    IonAvatar, IonLabel, IonChip, IonItemOptions, IonItemOption, IonIcon, IonFab, 
    IonFabButton]
})
export class ListPage implements OnInit {
  products:Product[]=[]
  loading:boolean = false

  firebaseSrv = inject(Firebase)
  utilsSrv = inject(Utils)

  constructor() {
    this.registryIcons()
  }

  ngOnInit() {
  }

  user():User{
    return this.utilsSrv.getFromLocalStorage('user') as User
  }

  doRefresh(event:any){
    setTimeout(() => {
      this.getProducts()
      event.target.complete()
    },2000)
  }

  ionViewWillEnter(){
    this.getProducts()
  }

  async addUpdateProduct(product?:Product){
    let success = await this.utilsSrv.showModal({
      component:AddUpdateComponent,
      cssClass:'add-update-modal',
      componentProps:{product:product}
    }) 
    if(success) this.getProducts()
  }

  async deleteProduct(item:Product){
    const alert = await this.utilsSrv.showAlert({
      header: 'Eliminar producto',
      message: `¿Deseas eliminar ${item.name}?`,
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.deleteProductById(item.id)
          }
        }
      ]
    })

    await alert.present()
  }

  async deleteProductById(productId: string) {
    const path = `users/${this.user().uid}/products/${productId}`;
    const loading = await this.utilsSrv.showLoading();
    await loading.present();

    
    let product: Product | undefined = this.products.find(p => p.id === productId);
   
    // Elimina la imagen del storage si existe y es una URL
    if (product && product.image && product.image.startsWith('https://')) {
      try {
        const url = new URL(product.image);
        const pathMatch = url.pathname.match(/\/o\/(.+)/);
        if (pathMatch && pathMatch[1]) {
          const storagePath = decodeURIComponent(pathMatch[1]);
          console.log('Eliminando imagen en storage:', storagePath);
          await this.firebaseSrv.deleteFile(storagePath);
        }
      } catch (e) {
        // Ignora errores de parseo/eliminación
      }
    }

    this.firebaseSrv.deleteDocument(path).then(() => {
      this.utilsSrv.showToast({
        message: 'Producto eliminado',
        color: 'primary',
        duration: 2000,
        position: 'middle',
        icon: 'trash-outline'
      });
      this.getProducts();
    }).catch(error => {
      this.utilsSrv.showToast({
        message: error.message,
        color: 'danger',
        duration: 2000,
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }

  getProducts(){
    let path = `users/${this.user().uid}/products`
    this.loading = true
    let query = [
      orderBy('soldUnits','desc')
    ]
    let sub = this.firebaseSrv.getCollectionData(path,query).subscribe({
      next:(res:any) => {
        this.products = res
        this.loading = false
        sub.unsubscribe()
      }
    })
  }

  registryIcons(){
    addIcons({ add, createOutline, shieldOutline, trashOutline })
  }

}
