import { Component } from '@angular/core';
import { 
  IonContent, 
  IonItem, 
  IonInput, 
  IonIcon,
  IonCheckbox
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';

import { lockClosedOutline, eyeOutline, eyeOffOutline, mailOutline} from 'ionicons/icons';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
   imports: [
    IonContent,
    IonItem,
    IonInput,
    IonIcon,
    IonCheckbox,
    FormsModule,
    CommonModule
  ],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

})
export class Login {

  showPassword = false; // Controla si se ve el texto o los puntos
  email = '';
  password = '';
  errorMessage = ''; 
  

  constructor(private auth: AuthService, private router: Router) {

    addIcons({ lockClosedOutline, eyeOutline, eyeOffOutline, mailOutline });
  }

  login() {
this.errorMessage = ''; // Limpiamos el error antes de intentar

   this.auth.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/tabs/main']);
      },
      error: (err) => {
        console.error(err);
     
        if (err.status === 404 || err.status === 401) {
          this.errorMessage = 'Usuario no encontrado o credenciales incorrectas.';
        } else {
          this.errorMessage = 'Ocurrió un error en el servidor. Intenta más tarde.';
        }
      }
    });
  }
  // MÉTODO AÑADIDO
  goToRegister() {
    this.router.navigate(['/register']);
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
