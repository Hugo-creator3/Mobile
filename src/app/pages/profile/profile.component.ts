import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonContent, IonIcon, IonHeader 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { 
  businessOutline, callOutline, addOutline, logOutOutline, 
  chevronBackOutline, createOutline, mailOutline, maleFemaleOutline, 
  personOutline, shieldCheckmarkOutline, timeOutline 
} from 'ionicons/icons';

export interface UserProfile {
  fullName: string;
  photoUrl: string;
  isActive: boolean;
  gender: string;
  phone: string;
  email: string;
  memberSince: string;
  institution: string;
}

interface DataRow {
  icon: string;
  label: string;
  value: string;
  color: string;
  isStatus?: boolean;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [IonHeader, IonContent, IonIcon, CommonModule],
})
export class ProfileComponent implements OnInit {

  pageReady = false;

  user: UserProfile = {
    fullName: 'Carlos A. Méndez',
    photoUrl: 'https://i.pravatar.cc/300?img=12',
    isActive: true,
    gender: 'Masculino',
    phone: '+52 81 2345 6789',
    email: 'c.mendez@universidad.edu.mx',
    memberSince: 'Agosto 2022',
    institution: 'Universidad Nacional',
  };

  // ── Propiedades fijas en lugar de getters ──────────────────────
  personalRows: DataRow[] = [];
  contactRows: DataRow[] = [];
  accountRows: DataRow[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone
  ) {
    addIcons({ 
      chevronBackOutline, addOutline, createOutline, logOutOutline, 
      timeOutline, shieldCheckmarkOutline, businessOutline, mailOutline, 
      callOutline, personOutline, maleFemaleOutline 
    });
  }

  ngOnInit(): void {
    this.buildRows();
    this.pageReady = true;

    this.authService.getProfile().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.user = {
            fullName: data.nombre + ' ' + data.apellidos,
            photoUrl: data.foto_url || 'https://i.pravatar.cc/300',
            isActive: data.activo,
            gender: data.genero || 'No especificado',
            phone: data.telefono || 'No disponible',
            email: data.email,
            memberSince: new Date(data.fecha_creacion).toLocaleDateString(),
            institution: data.institucion?.nombre || 'N/A'
          };
          // Reconstruir filas con datos reales
          this.buildRows();
        });
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  private buildRows(): void {
    this.personalRows = [
      { icon: 'person-outline', label: 'Nombre completo', value: this.user.fullName, color: '#a855f7' },
      { icon: 'male-female-outline', label: 'Género', value: this.user.gender, color: '#e879f9' },
    ];

    this.contactRows = [
      { icon: 'call-outline', label: 'Teléfono', value: this.user.phone, color: '#4ade80' },
      { icon: 'mail-outline', label: 'Correo electrónico', value: this.user.email, color: '#22d3ee' },
    ];

    this.accountRows = [
      { icon: 'business-outline', label: 'Institución', value: this.user.institution, color: '#a855f7' },
      { 
        icon: 'shield-checkmark-outline', 
        label: 'Estado de cuenta', 
        value: this.user.isActive ? 'Activo' : 'Inactivo',
        color: this.user.isActive ? '#4ade80' : '#f87171', 
        isStatus: true 
      },
      { icon: 'time-outline', label: 'Miembro desde', value: this.user.memberSince, color: '#fbbf24' },
    ];
  }

  onBack(): void { this.router.navigate(['/tabs/main']); }
  onEdit(): void { this.router.navigate(['/edit-profile']); }
  onLogout(): void { this.router.navigate(['/home']); }

  onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    const initials = this.user.fullName
      .split(' ').slice(0, 2).map(n => n[0]).join('');
    img.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='110' height='110'><rect width='110' height='110' rx='55' fill='%236b21a8'/><text x='55' y='70' font-size='36' text-anchor='middle' fill='white' font-family='sans-serif'>${initials}</text></svg>`;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('photo', file);
    this.authService.uploadPhoto(formData).subscribe({
      next: (res: any) => { this.user.photoUrl = res.photoUrl; },
      error: (err) => console.error(err)
    });
  }
}