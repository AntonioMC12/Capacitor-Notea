import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Note } from 'src/app/model/Note';
import { NoteService } from 'src/app/services/note.service';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.page.html',
  styleUrls: ['./edit-modal.page.scss'],
})
export class EditModalPage implements OnInit {

  @Input() note: Note

  public formNota: FormGroup;
  startButton: boolean;
  stopButton: boolean = true;
  languages: any[];
  public miLoading: HTMLIonLoadingElement;
  constructor(private modalController: ModalController, private noteS: NoteService, private fb: FormBuilder, public loadingController: LoadingController, public toastController: ToastController) { }

  ngOnInit() {

    this.formNota = this.fb.group({
      tittle: ["", Validators.required],
      description: [""]
    });
    this.languages = [
      {
        name: "English",
        code: "en-US"
      },
      {
        name: "Spanish",
        code: "es-ES"
      },
      {
        name: "French",
        code: "fr-FR"
      },
      {
        name: "German",
        code: "de-DE"
      }];
  }

  public async editNote() {
    this.note.tittle = this.formNota.get("tittle").value;
    this.note.description = this.formNota.get("description").value;
    try {
      await this.noteS.editNote(this.note);
      await this.presentToast("Nota editada Correctamente", "success");
    } catch (error) {
      await this.presentToast("Error al guardar", "danger");
    }

    this.closeModal();
  }

  public closeModal() {

    this.modalController.dismiss();
  }
  async speak() {
    this.startButton = true;
    this.stopButton = false;
    //Start the recognition
    await SpeechRecognition.start({
      //different characteristics of the plugin
      language: "es-ES",
      maxResults: 2,
      prompt: "Di algo",
      partialResults: true,
    }).then(async (data) => {
      let titulo = this.formNota.get("tittle").value;
      this.formNota.setValue({
        tittle: titulo,
        description: data.matches[0].charAt(0).toUpperCase() + data.matches[0].slice(1)
      });
      data.matches.forEach(data => {
        console.log("coincidencia: " + data);
      })
    }).catch((data) => {
      console.error(data);
    })
  }
  async stop() {
    SpeechRecognition.stop();
    this.startButton = false;
    this.stopButton = true;
  }

  async speakText() {
    await TextToSpeech.speak({
      text: this.note.description,
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
    const miToast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: clr
    });
    miToast.present();
  }
  //////////////////////////////////////////////////

}
