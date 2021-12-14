import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/compat';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Note } from '../model/Note';
import { Tab3Page } from '../tab3/tab3.page';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private myCollection: AngularFirestoreCollection;
  private myCollectionString: string;
  private last: any = null;
  public image:any;

  constructor(private db: AngularFirestore, private authS: AuthService, private storage: LocalStorageService) {
    /*(async() =>{
      await this.setUserInfo();
      console.log(this.myCollectionString);
      
    })()*/
  }

  public addNote(note: Note): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        let response: DocumentReference<firebase.default.firestore.DocumentData> = await this.myCollection.add({
          tittle: note.tittle,
          description: note.description
        });
        if (await this.storage.getItem(this.myCollectionString + "-creadas") != null) {
          let creadas: string = await this.storage.getItem(this.myCollectionString + "-creadas");
          let number = +creadas
          number++;
          console.log(this.myCollectionString);

          await this.storage.setItem(this.myCollectionString + "-creadas", number);
        } else {
          this.storage.setItem(this.myCollectionString + "-creadas", 1);
        }
        resolve(response.id)
      } catch (error) {
        reject(error);
      }
    });
  }

  public getNotes(): Observable<Note[]> {

    return new Observable((observer) => {


      let result: Note[] = [];

      this.myCollection.get().subscribe((data: firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>) => {
        data.docs.forEach((d: firebase.default.firestore.DocumentData) => {
          let tmp = d.data(); //devuelve el objeto almacenado -> la nota con tittle
          let id = d.id;      //devuelve la key del objeto
          result.push({ 'key': id, ...tmp });
          //operador spread -> 'tittle':tmp.tittle,'description':tmp.description
        })
        observer.next(result); // -> esto es lo que devolvemos
        observer.complete();
      })  //final del substcribe
    }); //final del return observable
  }

  public getNote(id: string): Promise<Note> {
    /*
    return new Promise((resolve, reject) => {
      try {
        let response:Observable<firebase.default.firestore.DocumentSnapshot<firebase.default.firestore.DocumentData>>  = this.myCollection.doc(id).get()
        response.subscribe((d)=>{
          let tmp = d.data(); //devuelve el objeto almacenado -> la nota con tittle
          let result:Note = {'tittle':tmp.tittle,'description':tmp.description}
          resolve(result);
        })
      } catch (error) {
        reject(error);
      }
    });
    */
    return new Promise(async (resolve, reject) => {
      let note: Note = null;
      try {
        let result: firebase.default.firestore.DocumentData = await this.myCollection.doc(id).get().toPromise();
        note = {
          id: result.id,
          ...result.data()
        }
        resolve(note);
      } catch (err) {
        reject(err);
      }
    })
  }

  /**
   * 
   * @param page número de la página, que sera 1 por defecto si no le pasa nada
   * @param criteria el criteria del paginado, nulo si no se le ponenada. ('tittle')
   * .orderBy(criteria,'desc')
   */
  public getNotesByPage(all?): Observable<Note[]> {
    if (all) {
      this.last = null
    }
    return new Observable((observer) => {
      let result: Note[] = [];
      let query = null;
      if (this.last) {
        query = this.db.collection<any>(this.myCollectionString,
          ref => ref.limit(15).startAfter(this.last));
      } else {
        query = this.db.collection<any>(this.myCollectionString,
          ref => ref.limit(15));
      }

      query.get().subscribe((data: firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>) => {
        data.docs.forEach((d: firebase.default.firestore.DocumentData) => {
          this.last = d; //dejo el ultimo documento guardado
          let tmp = d.data(); //devuelve el objeto almacenado -> la nota con tittle
          let id = d.id;      //devuelve la key del objeto
          result.push({ 'key': id, ...tmp });
          //operador spread -> 'tittle':tmp.tittle,'description':tmp.description
        })
        observer.next(result); // -> esto es lo que devolvemos
        observer.complete();
      })  //final del substcribe
    }); //final del return observable);

  }

  public async remove(id: string): Promise<void> {
    try {
      if (await this.storage.getItem(this.myCollectionString + "-borradas") != null) {
        let creadas: string = await this.storage.getItem(this.myCollectionString + "-borradas");
        let number = +creadas
        number++;
        await this.storage.setItem(this.myCollectionString + "-borradas", number);
      } else {
        this.storage.setItem(this.myCollectionString + "-borradas", 1);
      }
    } catch (error) {
    }
    return this.myCollection.doc(id).delete();
  }

  public async editNote(nota: Note): Promise<void> {
    try {
      await this.myCollection.doc(nota.key).update(nota);
    } catch (err) {
      console.error(err);
    }
  }

  public async setUserInfo() {
    if (this.authS.user != null) {
      this.myCollection = this.db.collection<any>(this.authS.user.email);
      this.myCollectionString = this.authS.user.email;
      console.log(this.myCollectionString);
      console.log(this.myCollection);
    } else {
      this.myCollection = this.db.collection<any>(environment.firebaseConfig.todoCollection);
      this.myCollectionString = environment.firebaseConfig.todoCollection;
    }
  }
}
