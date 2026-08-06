import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  IonContent, 
  IonItem, 
  IonInput, 
  IonIcon,
  IonCheckbox, IonHeader } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Geolocation } from '@capacitor/geolocation';
import { NativeBiometric } from 'capacitor-native-biometric';
import { HttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { cardOutline, chevronBackOutline, keypadOutline, locationOutline } from 'ionicons/icons';



export type BioState = 'idle' | 'scanning' | 'success' | 'error';

interface Particle {
  style: { [key: string]: string };
}

@Component({
  selector: 'app-biometric-checkin',
  templateUrl: './biometric-checkin.component.html',
  styleUrls: ['./biometric-checkin.component.scss'],
  standalone: true,
imports: [
    IonContent,
    IonIcon,
    CommonModule
  ],})
export class BiometricCheckinComponent implements OnInit, OnDestroy {

  pageReady       = false;
  isScanning      = false;
  bioState: BioState = 'idle';
  errorMessage    = '';

  checkpointName  = 'Edificio de Sistemas · Piso 3';
  cardName        = 'Credencial Universitaria';

  particles: Particle[] = [];

  private resetTimeout: ReturnType<typeof setTimeout> | null = null;
  private errorTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient

  ) {
        addIcons({chevronBackOutline,locationOutline,cardOutline,keypadOutline});

  }

  ngOnInit(): void {
    // Leer datos del punto de acceso desde los params o un servicio
    const cardId = this.route.snapshot.paramMap.get('id');
    if (cardId) {
      // this.checkpointName = this.checkinService.getCheckpoint();
      // this.cardName       = this.cardService.getById(cardId)?.institution ?? '';
    }

    this.generateParticles();
    setTimeout(() => { this.pageReady = true; }, 100);
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  // ── Tap sobre la huella ──────────────────────────────────────────
  onFingerprintTap(): void {
    if (this.isScanning) return;
    this.clearError();
    this.bioState = 'scanning';
    this.isScanning = true;
    this.handleResult();
  }

  // ── Flujo de autenticación biométrica real ─────────────────────────
  private async handleResult(): Promise<void> {
    try {
      const available = await NativeBiometric.isAvailable({ useFallback: false });
      if (!available?.isAvailable) {
        this.isScanning = false;
        this.bioState = 'error';
        this.showError('Biometría no configurada en este dispositivo. Usa otro método.');
        this.resetTimeout = setTimeout(() => { this.bioState = 'idle'; }, 2000);
        return;
      }

      await NativeBiometric.verifyIdentity({
        reason: 'Verifica tu identidad para el check-in'
      });

      // Biometría válida, continuar con la ubicación y el backend.
      this.bioState = 'scanning';

      const permissions = await Geolocation.requestPermissions();

      console.log('Permisos:', permissions);

      if (
        permissions.location !== 'granted' &&
        permissions.coarseLocation !== 'granted'
      ) {
        this.isScanning = false;
        this.bioState = 'error';
        this.showError('Debes permitir el acceso a la ubicación para realizar el check-in.');
        return;
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      console.log('Latitud:', lat);
      console.log('Longitud:', lng);

      const token = localStorage.getItem('token');

      if (!token) {
        this.isScanning = false;
        this.bioState = 'error';
        this.showError('Sesión no válida. Inicia sesión nuevamente.');
        return;
      }

      this.http.post(
        'https://backendv-4q6s.onrender.com/api/geo/validate',
        {
          latitud: lat,
          longitud: lng
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      ).subscribe({

        next: (res: any) => {
        
          this.isScanning = false;
          this.bioState = 'success';
          setTimeout(() => {
           
          }, 1000);
        },

        error: (err) => {
          console.error('ERROR BACKEND:', err);
          this.isScanning = false;
          this.bioState = 'error';
          this.showError(
            err?.error?.message ||
            'No fue posible realizar el check-in'
          );
        }

      });

    } catch (error: any) {
      console.error('Error de biometría o ubicación:', error);
      this.isScanning = false;
      this.bioState = 'error';

      if (
        error?.message?.includes('cancel') ||
        error?.message?.includes('Cancel') ||
        error?.message?.includes('canceled') ||
        error?.message?.includes('CANCELED')
      ) {
        this.showError('Autenticación biométrica cancelada.');
      } else if (
        error?.message?.includes('not available') ||
        error?.message?.includes('not configured') ||
        error?.message?.includes('BIOMETRY') ||
        error?.message?.includes('Biometry')
      ) {
        this.showError('Biometría no está disponible o no está configurada.');
      } else if (
        error?.message?.includes('permission') ||
        error?.message?.includes('Permission')
      ) {
        this.showError('La aplicación no tiene permisos de ubicación.');
      } else {
        this.showError('No se pudo obtener tu ubicación actual.');
      }

      this.resetTimeout = setTimeout(() => { this.bioState = 'idle'; }, 2000);
    }

  }

  // ── Acciones ──────────────────────────────────────────────────────
  onCancel(): void {
    this.clearTimers();
    this.router.navigate(['/card']);
  }

  onUsePIN(): void {
    this.clearTimers();
    this.router.navigate(['/pin-checkin']);
  }

  // ── Partículas decorativas ────────────────────────────────────────
  private generateParticles(): void {
    const colors = [
      'rgba(168,85,247,0.7)',
      'rgba(192,132,252,0.6)',
      'rgba(34,211,238,0.6)',
      'rgba(232,121,249,0.5)',
    ];

    for (let i = 0; i < 18; i++) {
      const size  = this.rand(2, 4);
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push({
        style: {
          '--dur':   `${this.rand(9, 18)}s`,
          '--delay': `-${this.rand(0, 14)}s`,
          '--drift': `${this.rand(-40, 40)}px`,
          width:  `${size}px`,
          height: `${size}px`,
          left:   `${this.rand(0, 100)}%`,
          background: color,
          boxShadow:  `0 0 ${size * 2}px ${color}`,
        },
      });
    }
  }
  

  private rand(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private clearTimers(): void {
    if (this.resetTimeout) clearTimeout(this.resetTimeout);
    this.clearErrorTimeout();
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.clearErrorTimeout();
    this.errorTimeout = setTimeout(() => {
      this.errorMessage = '';
    }, 6000);
  }

  private clearError(): void {
    this.errorMessage = '';
    this.clearErrorTimeout();
  }

  private clearErrorTimeout(): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = null;
    }
  }
  
  
}
