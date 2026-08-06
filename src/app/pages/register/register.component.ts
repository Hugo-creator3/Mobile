import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonItem, 
  IonLabel,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
  IonSelectOption,
  IonInput, 
  IonSelect,
  IonIcon, IonHeader } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';



import {
  personOutline,
  personAddOutline,
  mailOutline,
  lockClosedOutline,
  shieldCheckmarkOutline,
  callOutline,
  transgenderOutline,
  calendarOutline,
  cameraOutline
} from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';

// ─── Tipos de error por campo ───────────────────────────────────────────────
interface FormErrors {
  nombre?: string;
  apellidos?: string;
  genero?: string;
  fecha_nacimiento?: string;
  email?: string;
  telefono?: string;
  password?: string;
  confirmPassword?: string;
  clave_institucion?: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [ 
    IonContent,
    IonLabel,
    IonSelectOption,
    IonSelect,
    IonDatetimeButton,
    IonModal,
    IonDatetime,
    IonInput,
    IonItem,
    IonIcon,
    FormsModule,
    CommonModule
  ],})
export class RegisterComponent {

  // ─── Modelo de datos ──────────────────────────────────────────────────────
  profileImage: string | null = null;
  nombre            = '';
  apellidos         = '';
  email             = '';
  password          = '';
  confirmPassword   = '';
  telefono          = '';
  genero            = '';
  fecha_nacimiento  = '';
  clave_institucion = '';

  // ─── Estado de validación ─────────────────────────────────────────────────
  errors: FormErrors = {};
  touched: Record<string, boolean> = {};
  submitted = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    addIcons({
      personOutline,
      personAddOutline,
      mailOutline,
      lockClosedOutline,
      shieldCheckmarkOutline,
      callOutline,
      transgenderOutline,
      calendarOutline,
      cameraOutline
    });
  }

  // ─── Marcar campo como tocado al perder foco ──────────────────────────────
  markTouched(field: string): void {
    this.touched[field] = true;
    this.validateField(field);
  }
  // En register.component.ts

onDateChange(event: any) {
  // Ionic devuelve el valor en event.detail.value
  const fechaSeleccionada = event.detail.value;
  
  // Si viene un array o un string largo, extraemos solo la parte de la fecha (YYYY-MM-DD)
  if (fechaSeleccionada) {
    this.fecha_nacimiento = fechaSeleccionada.split('T')[0];
  }
  
  this.markTouched('fecha_nacimiento');
}

  // ─── Validación individual por campo ──────────────────────────────────────
  validateField(field: string): void {
    switch (field) {

      case 'nombre':
        if (!this.nombre.trim()) {
          this.errors.nombre = 'El nombre es requerido.';
        } else if (this.nombre.trim().length < 2) {
          this.errors.nombre = 'Mínimo 2 caracteres.';
        } else if (this.nombre.trim().length > 50) {
          this.errors.nombre = 'Máximo 50 caracteres.';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/.test(this.nombre.trim())) {
          this.errors.nombre = 'Solo se permiten letras y espacios.';
        } else {
          delete this.errors.nombre;
        }
        break;

      case 'apellidos':
        if (!this.apellidos.trim()) {
          this.errors.apellidos = 'Los apellidos son requeridos.';
        } else if (this.apellidos.trim().length < 2) {
          this.errors.apellidos = 'Mínimo 2 caracteres.';
        } else if (this.apellidos.trim().length > 80) {
          this.errors.apellidos = 'Máximo 80 caracteres.';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/.test(this.apellidos.trim())) {
          this.errors.apellidos = 'Solo se permiten letras y espacios.';
        } else {
          delete this.errors.apellidos;
        }
        break;

      case 'genero':
        if (!this.genero) {
          this.errors.genero = 'Selecciona un género.';
        } else {
          delete this.errors.genero;
        }
        break;

      case 'fecha_nacimiento':
  if (!this.fecha_nacimiento) {
    this.errors.fecha_nacimiento = 'La fecha de nacimiento es requerida.';
  } else {
    const hoy = new Date();
    // Usamos el string recortado para evitar errores de zona horaria
    const nacim = new Date(this.fecha_nacimiento.split('T')[0]); 
    
    // Tu lógica de edad real está perfecta, solo asegúrate de que 'nacim' sea un Date válido
    if (isNaN(nacim.getTime())) {
      this.errors.fecha_nacimiento = 'Fecha inválida.';
      break;
    }

    const edad = hoy.getFullYear() - nacim.getFullYear();
    const cumpleEsteAnio =
      hoy.getMonth() > nacim.getMonth() ||
      (hoy.getMonth() === nacim.getMonth() && hoy.getDate() >= nacim.getDate());
    const edadReal = cumpleEsteAnio ? edad : edad - 1;

    if (nacim >= hoy) {
      this.errors.fecha_nacimiento = 'La fecha no puede ser futura.';
    } else if (edadReal < 5) {
      this.errors.fecha_nacimiento = 'Debes tener al menos 5 años.';
    } else if (edadReal > 120) {
      this.errors.fecha_nacimiento = 'Fecha de nacimiento inválida.';
    } else {
      delete this.errors.fecha_nacimiento;
    }
  }
  break;

      case 'email':
        if (!this.email.trim()) {
          this.errors.email = 'El correo electrónico es requerido.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(this.email.trim())) {
          this.errors.email = 'Ingresa un correo electrónico válido.';
        } else if (this.email.trim().length > 100) {
          this.errors.email = 'Máximo 100 caracteres.';
        } else {
          delete this.errors.email;
        }
        break;

      case 'telefono':
        const telefonoLimpio = this.telefono.replace(/\s|-/g, '');
        if (!telefonoLimpio) {
          this.errors.telefono = 'El teléfono es requerido.';
        } else if (!/^\+?[0-9]{7,15}$/.test(telefonoLimpio)) {
          this.errors.telefono = 'Ingresa un número de teléfono válido (7–15 dígitos).';
        } else {
          delete this.errors.telefono;
        }
        break;

      case 'password':
        if (!this.password) {
          this.errors.password = 'La contraseña es requerida.';
        } else if (this.password.length < 8) {
          this.errors.password = 'Mínimo 8 caracteres.';
        } else if (this.password.length > 64) {
          this.errors.password = 'Máximo 64 caracteres.';
        } else if (!/[A-Z]/.test(this.password)) {
          this.errors.password = 'Debe contener al menos una mayúscula.';
        } else if (!/[a-z]/.test(this.password)) {
          this.errors.password = 'Debe contener al menos una minúscula.';
        } else if (!/[0-9]/.test(this.password)) {
          this.errors.password = 'Debe contener al menos un número.';
        } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.password)) {
          this.errors.password = 'Debe contener al menos un carácter especial.';
        } else {
          delete this.errors.password;
        }
        // Re-validar confirmación si ya fue tocada
        if (this.touched['confirmPassword']) {
          this.validateField('confirmPassword');
        }
        break;

      case 'confirmPassword':
        if (!this.confirmPassword) {
          this.errors.confirmPassword = 'Confirma tu contraseña.';
        } else if (this.confirmPassword !== this.password) {
          this.errors.confirmPassword = 'Las contraseñas no coinciden.';
        } else {
          delete this.errors.confirmPassword;
        }
        break;

      case 'clave_institucion':
        if (!this.clave_institucion.trim()) {
          this.errors.clave_institucion = 'La clave de institución es requerida.';
        } else if (this.clave_institucion.trim().length < 3) {
          this.errors.clave_institucion = 'Mínimo 3 caracteres.';
        } else if (this.clave_institucion.trim().length > 30) {
          this.errors.clave_institucion = 'Máximo 30 caracteres.';
        } else if (!/^[a-zA-Z0-9_-]+$/.test(this.clave_institucion.trim())) {
          this.errors.clave_institucion = 'Solo letras, números, guiones y guiones bajos.';
        } else {
          delete this.errors.clave_institucion;
        }
        break;
    }
  }

  // ─── Validar todos los campos antes de enviar ─────────────────────────────
  private validateAll(): boolean {
    const campos = [
      'nombre', 'apellidos', 'genero', 'fecha_nacimiento',
      'email', 'telefono', 'password', 'confirmPassword', 'clave_institucion'
    ];
    campos.forEach(c => {
      this.touched[c] = true;
      this.validateField(c);
    });
    return Object.keys(this.errors).length === 0;
  }

  // ─── Getter helpers para el template ─────────────────────────────────────
  hasError(field: string): boolean {
    return !!(this.touched[field] && this.errors[field as keyof FormErrors]);
  }

  errorMsg(field: string): string {
    return this.errors[field as keyof FormErrors] ?? '';
  }
  get maxDate(): string {
  return new Date().toISOString();
}

onFechaChange(event: any): void {
  const val = event.detail?.value;
  this.fecha_nacimiento = Array.isArray(val) ? val[0] : val;
  this.markTouched('fecha_nacimiento');
}

  // ─── Calcular fortaleza de contraseña (0–4) ────────────────────────────
  get passwordStrength(): number {
    if (!this.password) return 0;
    let score = 0;
    if (this.password.length >= 8)  score++;
    if (/[A-Z]/.test(this.password) && /[a-z]/.test(this.password)) score++;
    if (/[0-9]/.test(this.password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.password)) score++;
    return score;
  }

  get passwordStrengthLabel(): string {
    const labels = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
    return labels[this.passwordStrength] ?? '';
  }

  get passwordStrengthClass(): string {
    const classes = ['', 'weak', 'fair', 'good', 'strong'];
    return classes[this.passwordStrength] ?? '';
  }

  // ─── register() — lógica de servicio intacta ───────────────────────────────
  register(): void {
    this.submitted = true;

    if (!this.validateAll()) {
      // Hacer scroll suave al primer error
      const firstErrorEl = document.querySelector('.error-msg');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    this.auth.register({
      nombre:            this.nombre.trim(),
      apellidos:         this.apellidos.trim(),
      email:             this.email.trim(),
      password:          this.password,
      telefono:          this.telefono.replace(/\s|-/g, ''),
      genero:            this.genero,
      fecha_nacimiento:  this.fecha_nacimiento,
      clave_institucion: this.clave_institucion.trim()
    }).subscribe({
      next: () => {
        alert('Registro exitoso');
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // ─── GoLogin() — intacto ──────────────────────────────────────────────────
  GoLogin(): void {
    this.router.navigate(['/login']);
  }
}