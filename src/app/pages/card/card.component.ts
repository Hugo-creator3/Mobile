import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  IonContent, 
  IonItem, 
  IonInput, 
  IonIcon,
  IonCheckbox, IonHeader } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { TarjetaService } from 'src/app/services/tarjeta.service';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { businessOutline, calendarOutline, fingerPrintOutline, layersOutline, locateOutline, lockClosedOutline, mailOutline, scanOutline, shieldCheckmarkOutline, warningOutline, wifiOutline, chevronBackOutline, locationOutline } from 'ionicons/icons';




export interface VirtualCard {
  id: string;
  institution: string;
  holderName: string;
  isActive: boolean;
  accentColor: string;
  accentAlt: string;
}

export interface Institution {
  name: string;
  type: string;
  address: string;
  phone: string;
  website: string;
  director: string;
  since: string;
  employees: string;
}

interface InstRow {
  icon: string;
  label: string;
  value: string;
  color: string;
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
imports: [
    IonContent,
    IonIcon,
    IonHeader,
    CommonModule
  ],})
export class CardComponent implements OnInit, OnDestroy {

  pageReady  = false;
  isFlipped  = false;
  
  userPhoto: string = '';
  // ── TOTP ─────────────────────────────────────────────────────────
  totpCode     = '482 915';
  totpSeconds  = 30;
  totpProgress = 100;
  private totpInterval: ReturnType<typeof setInterval> | null = null;


  card: VirtualCard | null = null;
institution: Institution | null = null;


  // ── Datos de la tarjeta seleccionada ─────────────────────────────
  // En producción se obtendría del route param + un CardService
 



  
  constructor(
   private router: Router,
  private route: ActivatedRoute,
  private tarjetaService: TarjetaService,
  private authService: AuthService    
  ) {
    addIcons({chevronBackOutline,wifiOutline,scanOutline,fingerPrintOutline,warningOutline,businessOutline,shieldCheckmarkOutline,locationOutline,layersOutline,mailOutline,lockClosedOutline,calendarOutline,locateOutline,});
  }
  
ngOnInit(): void {

  // 🔹 1. Traer perfil del usuario
  this.authService.getProfile().subscribe({
    next: (user) => {

      console.log("USUARIO:", user);

      const fullName = user.nombre + ' ' + user.apellidos;
      const photo = user.foto_url;

      // 🔹 2. Traer diseño de tarjeta
      this.tarjetaService.getTarjeta().subscribe({
        next: (res) => {

          console.log("RESPUESTA BACKEND:", res);

          if (!res) return;

          this.card = {
            id: 'db',
            institution: res.nombre_institucion,
            holderName: fullName, // 🔥 DINÁMICO
            isActive: true,
            accentColor: res.color_primario || '#a855f7',
            accentAlt: res.color_secundario || '#22d3ee'
          };

          // 🔥 guarda también la foto
          this.userPhoto = photo;

          console.log("CARD ARMADA:", this.card);
        }
      });

    },
    error: (err) => console.error(err)
  });

  setTimeout(() => { this.pageReady = true; }, 120);
}
  ngOnDestroy(): void {
    this.stopTotpTimer();
  }

  // ── Flip de la tarjeta ────────────────────────────────────────────
  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }

  // ── TOTP countdown ────────────────────────────────────────────────
  private startTotpTimer(): void {
    // Sincroniza con el segundo actual del reloj para simular TOTP real
    const now = new Date();
    this.totpSeconds = 30 - (now.getSeconds() % 30);
    this.totpProgress = (this.totpSeconds / 30) * 100;

    this.totpInterval = setInterval(() => {
      this.totpSeconds--;
      this.totpProgress = (this.totpSeconds / 30) * 100;

      if (this.totpSeconds <= 0) {
        this.totpSeconds  = 30;
        this.totpProgress = 100;
        this.totpCode     = this.generateTotpCode();
      }
    }, 1000);
  }

  private stopTotpTimer(): void {
    if (this.totpInterval) {
      clearInterval(this.totpInterval);
      this.totpInterval = null;
    }
  }

  /** Genera un código de 6 dígitos simulado (en producción: algoritmo TOTP real) */
  private generateTotpCode(): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return `${code.slice(0, 3)} ${code.slice(3)}`;
  }

  // ── Acciones ──────────────────────────────────────────────────────
 

  onMoreOptions(): void {
    // Abrir action sheet con opciones: compartir, reportar problema, etc.
    console.log('Más opciones');
  }

  onBack(): void {
    this.router.navigate(['/tabs/main']);
  }
  GoCheckin(): void {
    this.router.navigate(['/biometric-checkin']);
  }
}