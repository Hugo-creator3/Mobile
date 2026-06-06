import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Geolocation } from '@capacitor/geolocation';
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
  imports: [IonicModule, CommonModule],
})
export class BiometricCheckinComponent implements OnInit, OnDestroy {

  pageReady       = false;
  isScanning      = false;
  bioState: BioState = 'idle';

  checkpointName  = 'Edificio de Sistemas · Piso 3';
  cardName        = 'Credencial Universitaria';

  particles: Particle[] = [];

  private scanTimeout: ReturnType<typeof setTimeout>  | null = null;
  private resetTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient

  ) {
        addIcons({ chevronBackOutline, locationOutline, cardOutline, keypadOutline
        })

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
    this.startScan();
  }

  // ── Flujo de escaneo simulado ─────────────────────────────────────
  // La lógica biométrica real se implementará con Capacitor Biometrics
  private startScan(): void {
    this.isScanning = true;
    this.bioState   = 'scanning';

    // Simula tiempo de lectura (1.8s) — se reemplazará con el plugin real
    this.scanTimeout = setTimeout(() => {
      this.isScanning = false;
      // Resultado simulado: siempre exitoso por ahora
      this.handleResult(true);
    }, 1800);
  }

 private async handleResult(success: boolean): Promise<void> {

  if (!success) {
    this.bioState = 'error';

    this.resetTimeout = setTimeout(() => {
      this.bioState = 'idle';
    }, 2000);

    return;
  }

  // 🔥 NO pongas success todavía
  this.bioState = 'scanning';

  try {
    const position = await Geolocation.getCurrentPosition();

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    console.log("Mi ubicación:", lat, lng);

    const token = localStorage.getItem('token');

    this.http.post('https://backendv-4q6s.onrender.com/api/geo/validate', {
      latitud: lat,
      longitud: lng
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
      
    }).subscribe({
      next: (res: any) => {

        this.bioState = 'success';

        setTimeout(() => {
         alert('Se te hizo'); // o error
        }, 1200);

      },
      error: (err) => {

        console.log("ERROR COMPLETO:", err);
  console.log("RESPUESTA:", err.error);

  this.bioState = 'error';
    alert(err.error?.message || 'Error desconocido');


        setTimeout(() => {
          alert('Andas mal'); // o error
        }, 1200);
      }
      
    });

  } catch (error) {
    console.error("Error obteniendo ubicación", error);

    this.bioState = 'error';

    
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
    if (this.scanTimeout)  clearTimeout(this.scanTimeout);
    if (this.resetTimeout) clearTimeout(this.resetTimeout);
  }
  
  
}