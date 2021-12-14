import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './services/local-storage.service';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { Camera, CameraResultType, CameraSource, ImageOptions, Photo } from '@capacitor/camera';
import { IonToggle, Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { NoteService } from './services/note.service';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private langsAvailable = ['es', 'en'];
  @ViewChild('mitoggle', { static: false }) mitoogle: IonToggle;
  

  constructor(private traductor: TranslateService, private storage: LocalStorageService, public authS:AuthService, private ns:NoteService, private platform:Platform) {
    /**
     * Función que busca si tenemos un lenguage preferido en el localStorage, en caso de que no 
     * la tengamos, coge el lenguaje del navegador, en caso de que no tengamos el lenguaje del 
     * navegador, cogemos el lenguaje "en" por defecto.
     */
     this.platform.backButton.subscribeWithPriority(10, () => {
      App.exitApp();
    });
    (async() =>{
      let lang = await storage.getItem("lang");
      if(lang == null){
        (this.langsAvailable.indexOf(this.traductor.getBrowserLang()) > -1 ? traductor.setDefaultLang(this.traductor.getBrowserLang()) : traductor.setDefaultLang('en'));
      }else{
        traductor.setDefaultLang(lang.value);
      }
    })();
  }

  async ngOnInit(){
    console.log("Entro en el oninit");
    await this.ns.setUserInfo();
  }

  ionViewDidEnter() {
    const lang = this.traductor.getDefaultLang();
    if (lang == 'es') {
      this.mitoogle.checked = false;
    } else {
      this.mitoogle.checked = true;
    }
  }

  public async cambiaIdioma(event) {
    if (event && event.detail && event.detail.checked) {
      await this.storage.setItem('lang', { value: 'en' });
      this.traductor.use('en');
    } else {
      await this.storage.setItem('lang', { value: 'es' });
      this.traductor.use('es');
    }
  }

  
}
