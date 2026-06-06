import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { add, businessOutline, callOutline, cardOutline, chevronBackOutline, chevronForwardOutline, closeCircleOutline, codeSlashOutline, colorPaletteOutline, contrastOutline, documentLockOutline, documentTextOutline, eyeOutline, fingerPrintOutline, handLeftOutline, headsetOutline, informationCircleOutline, languageOutline, locationOutline, lockClosedOutline, lockOpenOutline, logOutOutline, mailOutline, moonOutline, notificationsOutline, personCircleOutline, personOutline, phonePortraitOutline, scanOutline, shieldCheckmarkOutline, shieldOutline, sparkles, sparklesOutline, starOutline, timeOutline, timerOutline, trashOutline, warningOutline } from 'ionicons/icons';



type RowType = 'nav' | 'toggle' | 'info';

export interface SettingsRow {
  id: string;
  icon: string;
  label: string;
  desc?: string;
  value?: string;
  color: string;
  type: RowType;
  toggled?: boolean;
  route?: string;
  action?: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class SettingsComponent implements OnInit {

  pageReady = false;

  // ── Cuenta ────────────────────────────────────────────────────────
  accountRows: SettingsRow[] = [
    {
      id: 'personal-info',
      icon: 'person-outline',
      label: 'Información personal',
      desc: 'Nombre, fecha de nacimiento, género',
      color: '#a855f7',
      type: 'nav',
      route: '/profile',
    },
    {
      id: 'change-password',
      icon: 'lock-closed-outline',
      label: 'Cambiar contraseña',
      desc: 'Actualiza tu contraseña de acceso',
      color: '#c084fc',
      type: 'nav',
      route: '/change-password',
    },
    {
      id: 'change-email',
      icon: 'mail-outline',
      label: 'Correo electrónico',
      desc: 'c.mendez@universidad.edu.mx',
      color: '#22d3ee',
      type: 'nav',
      route: '/change-email',
    },
    {
      id: 'change-phone',
      icon: 'call-outline',
      label: 'Teléfono',
      desc: '+52 81 2345 6789',
      color: '#4ade80',
      type: 'nav',
      route: '/change-phone',
    },
    {
      id: 'institution',
      icon: 'business-outline',
      label: 'Institución vinculada',
      value: 'Universidad Nacional',
      color: '#fbbf24',
      type: 'nav',
      route: '/institution',
    },
  ];

  // ── Seguridad ─────────────────────────────────────────────────────
  securityRows: SettingsRow[] = [
    {
      id: 'biometrics',
      icon: 'finger-print-outline',
      label: 'Autenticación biométrica',
      desc: 'Usa huella o Face ID para ingresar',
      color: '#22d3ee',
      type: 'toggle',
      toggled: true,
    },
    {
      id: 'two-factor',
      icon: 'shield-checkmark-outline',
      label: 'Verificación en dos pasos',
      desc: 'Código TOTP al iniciar sesión',
      color: '#a855f7',
      type: 'toggle',
      toggled: true,
    },
    {
      id: 'auto-lock',
      icon: 'timer-outline',
      label: 'Bloqueo automático',
      desc: 'Bloquea la app tras inactividad',
      value: '5 min',
      color: '#e879f9',
      type: 'nav',
      route: '/auto-lock',
    },
    {
      id: 'active-sessions',
      icon: 'phone-portrait-outline',
      label: 'Sesiones activas',
      desc: 'Administra dispositivos conectados',
      color: '#fb923c',
      type: 'nav',
      route: '/sessions',
    },
    {
      id: 'privacy-log',
      icon: 'eye-outline',
      label: 'Registro de actividad',
      desc: 'Revisa accesos recientes a tu cuenta',
      color: '#f87171',
      type: 'nav',
      route: '/history',
    },
  ];

  // ── Preferencias ──────────────────────────────────────────────────
  preferenceRows: SettingsRow[] = [
    {
      id: 'language',
      icon: 'language-outline',
      label: 'Idioma',
      desc: 'Selecciona el idioma de la interfaz',
      value: 'Español',
      color: '#e879f9',
      type: 'nav',
      route: '/language',
    },
    {
      id: 'theme',
      icon: 'contrast-outline',
      label: 'Tema visual',
      desc: 'Oscuro, claro o automático',
      value: 'Oscuro',
      color: '#a855f7',
      type: 'nav',
      route: '/theme',
    },
    {
      id: 'haptics',
      icon: 'phone-portrait-outline',
      label: 'Vibración / Haptics',
      desc: 'Retroalimentación táctil en acciones',
      color: '#c084fc',
      type: 'toggle',
      toggled: true,
    },
    {
      id: 'animations',
      icon: 'sparkles-outline',
      label: 'Animaciones',
      desc: 'Efectos visuales y transiciones',
      color: '#fbbf24',
      type: 'toggle',
      toggled: true,
    },
    {
      id: 'geolocation',
      icon: 'location-outline',
      label: 'Geolocalización',
      desc: 'Permite validación por ubicación',
      color: '#4ade80',
      type: 'toggle',
      toggled: true,
    },
    {
      id: 'default-card',
      icon: 'card-outline',
      label: 'Credencial predeterminada',
      desc: 'Tarjeta activa al abrir la app',
      value: 'Credencial UN',
      color: '#22d3ee',
      type: 'nav',
      route: '/default-card',
    },
  ];

  // ── Notificaciones ────────────────────────────────────────────────
  notificationRows: SettingsRow[] = [
    {
      id: 'notif-push',
      icon: 'notifications-outline',
      label: 'Notificaciones push',
      desc: 'Alertas generales de la app',
      color: '#fbbf24',
      type: 'toggle',
      toggled: true,
    },
    {
      id: 'notif-checkin',
      icon: 'scan-outline',
      label: 'Confirmación de check-in',
      desc: 'Notificación al registrar acceso',
      color: '#4ade80',
      type: 'toggle',
      toggled: true,
    },
    {
      id: 'notif-denied',
      icon: 'close-circle-outline',
      label: 'Acceso denegado',
      desc: 'Alerta cuando se rechaza tu credencial',
      color: '#f87171',
      type: 'toggle',
      toggled: true,
    },
    {
      id: 'notif-expiry',
      icon: 'time-outline',
      label: 'Vencimiento de credencial',
      desc: 'Aviso antes de que expire tu tarjeta',
      color: '#fb923c',
      type: 'toggle',
      toggled: false,
    },
    {
      id: 'notif-security',
      icon: 'shield-outline',
      label: 'Alertas de seguridad',
      desc: 'Intentos de acceso sospechosos',
      color: '#22d3ee',
      type: 'toggle',
      toggled: true,
    },
    {
      id: 'notif-schedule',
      icon: 'moon-outline',
      label: 'Horario silencioso',
      desc: 'Sin notificaciones en horas definidas',
      value: 'Off',
      color: '#a855f7',
      type: 'nav',
      route: '/quiet-hours',
    },
  ];

  // ── Acerca de ─────────────────────────────────────────────────────
  aboutRows: SettingsRow[] = [
    {
      id: 'version',
      icon: 'code-slash-outline',
      label: 'Versión de la app',
      value: '1.0.0',
      color: '#4ade80',
      type: 'info',
    },
    {
      id: 'terms',
      icon: 'document-text-outline',
      label: 'Términos y condiciones',
      color: '#22d3ee',
      type: 'nav',
      route: '/terms',
    },
    {
      id: 'privacy',
      icon: 'lock-open-outline',
      label: 'Política de privacidad',
      color: '#a855f7',
      type: 'nav',
      route: '/privacy',
    },
    {
      id: 'support',
      icon: 'headset-outline',
      label: 'Soporte técnico',
      desc: 'Contáctanos ante cualquier problema',
      color: '#e879f9',
      type: 'nav',
      route: '/support',
    },
    {
      id: 'rate',
      icon: 'star-outline',
      label: 'Calificar la app',
      desc: 'Tu opinión nos ayuda a mejorar',
      color: '#fbbf24',
      type: 'nav',
      action: 'rate',
    },
  ];

  constructor(private router: Router) {
    addIcons({
      chevronBackOutline,personOutline, personCircleOutline, chevronForwardOutline, shieldOutline, colorPaletteOutline, notificationsOutline, informationCircleOutline, warningOutline, logOutOutline, trashOutline,
      codeSlashOutline, documentTextOutline, lockOpenOutline, headsetOutline, starOutline, moonOutline, timeOutline, closeCircleOutline,
      scanOutline, locationOutline, cardOutline, sparklesOutline, phonePortraitOutline, contrastOutline, languageOutline,
      eyeOutline, timerOutline, shieldCheckmarkOutline, fingerPrintOutline, businessOutline, mailOutline, callOutline,
      lockClosedOutline
    })
  }

  ngOnInit(): void {
    setTimeout(() => { this.pageReady = true; }, 100);
  }

  /** Maneja el tap en una fila de configuración */
  onRowTap(row: SettingsRow): void {
    if (row.type === 'toggle') return; // El toggle se maneja solo

    if (row.action === 'rate') {
      // Abrir store para calificar
      console.log('Abrir tienda para calificar');
      return;
    }

    if (row.route) {
      this.router.navigate([row.route]);
    }
  }

  /** Maneja cambios en los toggles */
  onToggleChange(row: SettingsRow): void {
    console.log(`Toggle "${row.label}" → ${row.toggled}`);
    // Aquí llamar al servicio correspondiente para persistir la preferencia
    // this.settingsService.update(row.id, row.toggled);
  }

  onLogout(): void {
    this.router.navigate(['/home']);
  }

  onDeleteAccount(): void {
    // Mostrar alert de confirmación antes de eliminar
    console.log('Solicitar confirmación para eliminar cuenta');
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}