import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { cardOutline, chevronForwardOutline, notificationsOutline, shieldCheckmarkOutline, timeOutline, wifiOutline } from 'ionicons/icons';




export interface VirtualCard {
  id: string;
  institution: string;
  holderName: string;
  role: string;
  idCode: string;
  validUntil: string;
  isActive: boolean;
  /** Color CSS principal de acento (hex o rgba). Ej: '#a855f7' */
  accentColor: string;
  /** Color alternativo para el gradiente del acento */
  accentAlt: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class MainComponent implements OnInit {

  pageReady = false;
  isScrolled = false;

  userName = 'Carlos';
  currentDate = '';
  unreadNotifications = 2;

  /** Lista de tarjetas del usuario — en producción vendrá de un servicio */
  cards: VirtualCard[] = [
    {
     id: 'card-001', //estatico
      institution: 'Universidad Nacional', //aqui si que sea el nombre d ela institucion afiliada en la bd
      holderName: 'Carlos Méndez', //su nombre verdadero
      role: 'Estudiante · Ing. Sistemas', //estatico
      idCode: 'UN-2024-0842', //estatico
      validUntil: 'Dic 2027', //estatico
      isActive: true, //estatico
      accentColor: '#a855f7', 
      accentAlt: '#117881',
    },
    {
      id: 'card-002',
      institution: 'Laboratorio de Cómputo',
      holderName: 'Carlos Méndez',
      role: 'Acceso Nivel 2',
      idCode: 'LC-ACC-0291',
      validUntil: 'Jun 2025',
      isActive: true,
      accentColor: '#22d3ee',
      accentAlt: '#a855f7',
    },
    {
      id: 'card-003',
      institution: 'Biblioteca Central',
      holderName: 'Carlos Méndez',
      role: 'Miembro Activo',
      idCode: 'BC-MBR-1105',
      validUntil: 'Ene 2025',
      isActive: false,
      accentColor: '#e879f9',
      accentAlt: '#fbbf24',
    },
  ];

  get activeCards(): number {
    return this.cards.filter(c => c.isActive).length;
  }

constructor(
  private router: Router,
  private authService: AuthService
) {
  addIcons ({
    notificationsOutline, shieldCheckmarkOutline, wifiOutline, cardOutline, timeOutline, chevronForwardOutline,
  })
}

 ngOnInit(): void {
  this.currentDate = this.formatDate(new Date());

  this.authService.getProfile().subscribe({
    next: (user) => {
      console.log("USER:", user);

      // 🔥 Nombre dinámico
      this.userName = user.nombre;

      const fullName = `${user.nombre} ${user.apellidos}`;
      const institucion = user.institucion?.nombre || 'Sin institución';

      // 🔥 SOLO MODIFICAS LA PRIMERA TARJETA
      this.cards[0] = {
        ...this.cards[0],
        institution: institucion,
        holderName: fullName
      };

      this.pageReady = true;
    },
    error: (err) => {
      console.error(err);
      this.pageReady = true;
    }
  });
}

  /** Evento de scroll para comprimir el hero */
  onScroll(event: CustomEvent): void {
    this.isScrolled = event.detail.scrollTop > 40;
  }

  /** Navega al detalle de la tarjeta seleccionada */
  onCardSelect(card: VirtualCard): void {
    // Guarda la tarjeta en un servicio de estado antes de navegar
    // this.cardService.selectCard(card);
    this.router.navigate(['/card', card.id]);
  }

  /** Abre el flujo para agregar una nueva tarjeta */
  onAddCard(): void {
    this.router.navigate(['/add-card']);
  }

  /** Abre el panel de notificaciones */
  onNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  private formatDate(d: Date): string {
    return d.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }
}