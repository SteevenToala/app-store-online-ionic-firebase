import { inject, Injectable } from '@angular/core'; 
import { Auth, createUserWithEmailAndPassword,
  sendPasswordResetEmail, signInWithEmailAndPassword,
  updateProfile } from '@angular/fire/auth'
import { User } from '../models/user'
import { Firestore, setDoc, doc, getDoc, updateDoc,
  collection, collectionData, query, addDoc, deleteDoc
 } from '@angular/fire/firestore'
import { Utils } from '../services/utils' 
import { uploadString, getStorage, getDownloadURL,
  ref, deleteObject } from '@angular/fire/storage'

@Injectable({
  providedIn: 'root',
})
export class Firebase {
  auth = inject(Auth)
  firestore = inject(Firestore)
  utilsSrv = inject(Utils)

  //AUTH
  signIn(user:User){
    return signInWithEmailAndPassword(this.auth,user.email, user.password)      
  }

  signUp(user:User){
    return createUserWithEmailAndPassword(this.auth, user.email, user.password)
  }

  updateUser(displayName:string){
    const user = this.auth.currentUser
    if(!user) throw new Error('No existe usuario autenticado')
      return updateProfile(user, {displayName})
  }

  sendRecoveryEmail(email:string){
    return sendPasswordResetEmail(this.auth, email)
  }

  signOut(){
    this.auth.signOut()
    localStorage.removeItem('user')
    this.utilsSrv.routerLink('/auth')
  }

  //DATABASE
  setDocument(path:string, data:any){
    return setDoc(doc(this.firestore,path),data)
  }

  async getDocument(path:string){
    return (await getDoc(doc(this.firestore, path))).data()
  }

  getCollectionData(path:string, collectionQuery?:any)
  {
    const ref = collection(this.firestore,path)
    return collectionData(query(ref, ...collectionQuery),{idField:'id'})
  }

  updateDocument(path:string, data:any){
    return updateDoc(doc(this.firestore,path),data)
  }

  deleteDocument(path:string){
    return deleteDoc(doc(this.firestore,path))
  }

  addDocument(path:string, data:any){
    return addDoc(collection(this.firestore, path),data)
  }

  //STORAGE
 async uploadImage(path:string, data_url:string){
    return uploadString(ref(getStorage(),path), data_url, 'data_url').then(()=> {
      return getDownloadURL(ref(getStorage(),path))
    })
 }

 async getFilePath(path:string){
  return ref(getStorage(),path).fullPath
 }

 deleteFile(path:string){
  return deleteObject(ref(getStorage(),path))
 }
}
