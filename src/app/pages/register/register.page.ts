import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  userdata: any;
  constructor(private autService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }
  /**
   * Metodo para registrar a un usuario en firesbase
   */

  public async onRegister(email, password) {
    try {
      const user = await this.autService.register(email.value, password.value);
      if (user) {
        console.log(user);
        await this.autService.keepSession();
      }
    } catch (error) {
      console.log(error);
    }
  }

  public goLogin(){
    this.router.navigate(['']);
  }

}
