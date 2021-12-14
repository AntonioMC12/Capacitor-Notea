import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public userinfo: User;
  private isAndroid: boolean;

  constructor(private platform: Platform, private authS: AuthService, private router: Router) {
    this.isAndroid = platform.is("android");
    if (!this.isAndroid) GoogleAuth.init(); //lee la config clientid del meta de index.html
  }

  async ngOnInit() {
    await this.authS.loadSession();
    if (this.authS.isLogged) {
      this.router.navigate(['private/tabs/tab1']);
    }
  }

  async ionViewWillEnter() {
  }

  public async singinGoogle() {
    try {
      await this.authS.loginGoogle();
      this.router.navigate(['private/tabs/tab1']);
    } catch (err) {
      console.error(err);
    }
  }

  public async singin(email, password) {
    try {
      await this.authS.login(email.value, password.value);
      if (this.authS.user != null) {
        this.router.navigate(['private/tabs/tab1']);
      }
    } catch (error) {
      console.error(error);

    }
  }

  public goRegister(){
    this.router.navigate(['register']);
  }
}
