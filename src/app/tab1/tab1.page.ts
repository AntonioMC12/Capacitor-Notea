import { Component, ViewChild } from '@angular/core';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { AlertController, IonInfiniteScroll, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { toastController } from '@ionic/core';
import { Note } from '../model/Note';
import { EditModalPage } from '../pages/edit-modal/edit-modal.page';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import { NoteService } from '../services/note.service';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  public notas: Note[] = [];
  public miLoading: HTMLIonLoadingElement;
  public avatar:any;

  public image: any;
  public user: User;
  public userImg: any;

  constructor(public ns: NoteService, public loadingController: LoadingController, public toastController: ToastController, public alertController: AlertController, private mc: ModalController, private storage:LocalStorageService, private authS:AuthService) { }

  async ngOnInit() {
    await this.ns.setUserInfo();
    await this.cargaNotas();
    await this.setUserIMG()
  }

  //event con el ? es un parametro opcional
  public async cargaNotas(event?) {
    console.log(this.infiniteScroll)
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false;
      console.log(this.infiniteScroll);
      console.log(this.infiniteScroll.disabled);
    }

    if (!event) {
      //mostrar loading
      await this.presentLoading();
    }
    this.notas = [];
    try {
      this.notas = await this.ns.getNotesByPage('algo').toPromise();
    } catch (error) {
      console.error(error);
      //notificar el error al usuario
      await this.presentToast("Error cargando datos", "danger");
    } finally {
      if (event) {
        event.target.complete();
      } else {
        //ocultar loading
        this.miLoading.dismiss();
      }
    }
  }

  public async editar(nota: Note) {
    const modal = await this.mc.create({
      component: EditModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'note': nota,
      }
    });
    return await modal.present();
  }

  public async borra(nota: Note) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmación',
      subHeader: 'Borrado de nota ' + nota.tittle,
      message: '¿Está seguro de borrar la nota?',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: async () => {
          await this.miLoading.dismiss();
        }
      }, {
        text: 'Aceptar',
        handler: async () => {
          await this.ns.remove(nota.key);
          await this.presentLoading();
          let i = this.notas.indexOf(nota, 0);
          if (i > -1) {
            this.notas.splice(i, 1);
          }
          await this.miLoading.dismiss();
        }
      }]
    });
    await alert.present();
  }

  public async cargaInfinita($event) {
    console.log("carga infinita");
    let nuevasNotas = await this.ns.getNotesByPage().toPromise();

    this.notas = this.notas.concat(nuevasNotas);
    $event.target.complete();
    if (nuevasNotas.length < 10) {
      $event.target.disabled = true;
    }
  }

  //searchbar para buscar notas
  public buscarNotas($event) {
    const texto = $event.target.value;
    if (texto.length > 0) {
      this.notas = this.notas.filter((note) => {
        return (note.tittle.toLowerCase().indexOf(texto.toLowerCase())) > -1;
      });
    } else {
      this.cargaNotas();
    }
  }

  public async setUserIMG() {
    this.user = this.authS.user;
    if (this.user.imageUrl != null) {
      this.image = this.user.imageUrl;
      this.ns.image = this.image;
    } else if (await this.storage.getItem(this.user.email + "-userPic") != null) {
      this.image = await this.storage.getItem(this.user.email + "-userPic");
      this.ns.image = this.image;
    } else {
      this.image = "../../../assets/images/user.png";
      this.ns.image = this.image;
    }
  }

  async speakText(nota:Note) {
    await TextToSpeech.speak({
      text: (nota.tittle+"..."+nota.description),
      lang: "es-ES",
      rate: 0.75
    }).then(() => {
      console.log("Success");
    }).catch((error) => {
      console.error(error);
    });
  }

  async stopText() {
    await TextToSpeech.stop();
  }

  //////////////////////////////////////////////////
  //Hacer estos metodos en el servicio
  async presentLoading() {
    this.miLoading = await this.loadingController.create({
      message: '',
    });
    await this.miLoading.present();
  }

  async presentToast(msg: string, clr: string) {
    const miToast = await toastController.create({
      message: msg,
      duration: 2000,
      color: clr
    });
    miToast.present();
  }
  //////////////////////////////////////////////////
}
