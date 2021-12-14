import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, ImageOptions, Photo } from '@capacitor/camera';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { AlertController, IonToggle } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Note } from '../model/Note';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import { NoteService } from '../services/note.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public isGoogle: boolean = false;
  public image: any;
  public user: User;
  public userImg: any;
  public nNotes: any;
  public nCreadas: any;
  public nBorradas: any;
  //https://images.unsplash.com/photo-1484186139897-d5fc6b908812?ixlib=rb-0.3.5&s=9358d797b2e1370884aa51b0ab94f706&auto=format&fit=crop&w=200&q=80%20500w


  constructor(private traductor: TranslateService, private storage: LocalStorageService, public alertController: AlertController, private authS: AuthService, private ns: NoteService, private router: Router) {
    /*traductor.setDefaultLang("es");
    traductor.get("PHOTOS").toPromise().then(data=>{
      console.log(data);
    })*/
  }

  async ngOnInit() {
    this.user = this.authS.user;
    await this.setUserIMG();
  }

  async ionViewDidEnter() {
    await this.setNotesInfo();
  }


  public async hazFoto() {
    let options: ImageOptions = {
      resultType: CameraResultType.DataUrl,  //sustituyendo DataUri para obtener base64 en web
      allowEditing: false,
      quality: 90,
      source: CameraSource.Camera,
      saveToGallery: true
    }
    console.log("HAGO FOTO")
    
    let result: Photo = await Camera.getPhoto(options);
    //console.log(result);
    this.image = result.dataUrl;
    //console.log(result.webPath);
    //console.log(result.dataUrl);
    this.ns.image = this.image;
    this.storage.setItem(this.user.email + "-userPic", this.image);
  }

  public goAddNote() {
    this.router.navigate(['private/tabs/tab2']);
  }

  public async setNotesInfo() {    
    try {
      let notes: Note[] = await this.ns.getNotes().toPromise();
      this.nNotes = notes.length;
      console.log(this.nNotes);
      

    } catch (error) {
      this.nNotes = 0;
    }

    try {
      if (await this.storage.getItem(this.authS.user.email + "-creadas") != null) {
        this.nCreadas = await this.storage.getItem(this.authS.user.email + "-creadas");        
      } else {
        this.nCreadas = 0;
      }
      if (await this.storage.getItem(this.authS.user.email + "-borradas") != null) {
        this.nBorradas = await this.storage.getItem(this.authS.user.email + "-borradas");
      } else {
        this.nBorradas = 0;
      }
    } catch (error) {
      this.nBorradas = "0";
      this.nCreadas = "0";
    }
  }

  public async setUserIMG(){
    if (this.user.imageUrl != null) {
      this.image = this.user.imageUrl;
      this.ns.image = this.image;
      this.isGoogle = true;
    } else if (await this.storage.getItem(this.user.email + "-userPic") != null) {
      this.image = await this.storage.getItem(this.user.email + "-userPic");
      this.ns.image = this.image;
    } else {
      this.image = "../../../assets/images/user.png";
      this.ns.image = this.image;
    }
  }
}
