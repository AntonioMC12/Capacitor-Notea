import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { Platform } from '@ionic/angular';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: any;
  private isAndroid = false;


  constructor(private storage: LocalStorageService,
    private platform: Platform, private router: Router, public afAuth: AngularFireAuth,private afs: AngularFirestore) {
    this.isAndroid = platform.is("android");
    if (!this.isAndroid)
      GoogleAuth.init(); //lee la config clientid del meta de index.html
  }

  public async loadSession() {
    let user = await this.storage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      this.user = user;
    }
  }

  public async loginGoogle() {
    let user: User = await GoogleAuth.signIn();
    this.user = user;
    console.log(user.email);
    
    await this.keepSession();
  }
  public async logout() {
    await GoogleAuth.signOut();
    await this.storage.removeItem('user');
    this.user = null;
    this.router.navigate([''])
  }
  public async keepSession() {
    await this.storage.setItem('user', JSON.stringify(this.user));
  }

  public isLogged(): boolean {
    return (this.user ? true : false);
  }

    /**
   * Metodo que se encarga de registrar un usuario en firebase con email y conytraseña
   * @param email Email del usuario
   * @param password Contraseña del usuario
   */
     public async register(email:string,password:string){
      try {
        const {user} = await this.afAuth.createUserWithEmailAndPassword(email,password);
        return user;
      } catch (error) {
        console.log("Error al registrar usuario ---> "+error);
      }
    }
    /**
     * Metodo que se encarga de iniciar sesion con email y contraseña
     * @param email Email del usuario
     * @param password Contraseña del usuario
     * @returns Devuelve si el usuario se pudo loguear
     */
    public async login(email:string,password:string):Promise<any>{
      try {
        const {user} = await this.afAuth.signInWithEmailAndPassword(email,password);
        this.user=user;
        await this.keepSession();
        return user;
      } catch (error) {
        console.log("Error al iniciar sesion ---> "+error);
      }
    }
}
