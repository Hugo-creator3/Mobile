import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AsistenciasService } from 'src/app/services/asistencias.service';


export type CheckinStatus = 'success' | 'denied' | 'pending';

export interface CheckinItem {
  id: string;
  location: string;
  locationIcon: string;
  zone: string;
  cardUsed: string;
  time: string;
  date: Date;
  status: CheckinStatus;
  statusLabel: string;
  statusIcon: string;
  isLast?: boolean;
}

export interface CheckinGroup {
  dateLabel: string;
  dateKey: string;
  items: CheckinItem[];
}

type TabKey = 'all' | 'week' | 'month';

interface Tab {
  key: TabKey;
  label: string;
  count: number;
}

interface StatCard {
  icon: string;
  value: string;
  label: string;
  color: string;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HistoryComponent implements OnInit {

  pageReady = false;
  activeTab: TabKey = 'all';

     private allCheckins: CheckinItem[] = [];

  // ── Tabs ──────────────────────────────────────────────────────────
  get tabs(): Tab[] {
    return [
      { key: 'all',   label: 'Todos',       count: this.allCheckins.length },
      { key: 'week',  label: 'Semana',       count: this.getWeekCheckins().length },
      { key: 'month', label: 'Mes',          count: this.getMonthCheckins().length },
    ];
  }

  get activeTabIndex(): number {
    return ['all', 'week', 'month'].indexOf(this.activeTab);
  }

  get totalCheckins(): number { return this.allCheckins.length; }

  // ── Estadísticas ─────────────────────────────────────────────────
  get stats(): StatCard[] {
    const src = this.currentCheckins;
    const ok      = src.filter(c => c.status === 'success').length;
    const denied  = src.filter(c => c.status === 'denied').length;
    const pending = src.filter(c => c.status === 'pending').length;
    // Racha de días consecutivos (simplificado)
    const streak = this.calcStreak();
    return [
      { icon: 'checkmark-circle-outline', value: String(ok),      label: 'Accesos\nExitosos', color: '#4ade80' },
      { icon: 'close-circle-outline',     value: String(denied),   label: 'Accesos\nDenegados', color: '#f87171' },
      { icon: 'time-outline',             value: String(pending),  label: 'Pendientes',         color: '#fb923c' },
      { icon: 'flame-outline',            value: `${streak}d`,     label: 'Racha\nActual',      color: '#a855f7' },
    ];
  }

  // ── Grupos filtrados ──────────────────────────────────────────────
  get filteredGroups(): CheckinGroup[] {
    return this.groupByDate(this.currentCheckins);
  }

  private get currentCheckins(): CheckinItem[] {
    switch (this.activeTab) {
      case 'week':  return this.getWeekCheckins();
      case 'month': return this.getMonthCheckins();
      default:      return this.allCheckins;
    }
  }

  constructor(
  private router: Router,
  private asistenciasService: AsistenciasService
) {}

  ngOnInit(): void {

  this.asistenciasService.getMyAsistencias().subscribe({
    next: (data) => {

      this.allCheckins = data.map((a: any, index: number) => {

        const date = new Date(a.fecha_hora);

        return {
          id: String(index),
          location: `Lat: ${a.latitud}, Lng: ${a.longitud}`,
          locationIcon: 'location-outline',
          zone: 'Zona registrada',
          cardUsed: 'Credencial',
          time: date.toLocaleTimeString(),
          date: date,
          status: this.mapStatus(a.estado),
          statusLabel: this.mapStatusLabel(a.estado),
          statusIcon: this.mapStatusIcon(a.estado),
          isLast: false
        };

      });

    },
    error: (err) => {
      console.error('Error cargando historial', err);
    }
  });

  setTimeout(() => { this.pageReady = true; }, 120);
}

  setTab(key: TabKey): void {
    this.activeTab = key;
    // Resetea animación
    this.pageReady = false;
    setTimeout(() => { this.pageReady = true; }, 60);
  }

  onBack(): void { this.router.navigate(['/main']); }
  onFilter(): void { /* Abrir modal de filtros avanzados */ }

  onItemTap(item: CheckinItem): void {
    // Navegar al detalle del check-in
    console.log('Check-in seleccionado:', item.id);
  }

  // ── Helpers ──────────────────────────────────────────────────────
  private getWeekCheckins(): CheckinItem[] {
    const now  = new Date();
    const from = new Date(now);
    from.setDate(now.getDate() - 7);
    return this.allCheckins.filter(c => c.date >= from);
  }

  private getMonthCheckins(): CheckinItem[] {
    const now  = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    return this.allCheckins.filter(c => c.date >= from);
  }

  private groupByDate(items: CheckinItem[]): CheckinGroup[] {
    const map = new Map<string, CheckinItem[]>();
    for (const item of items) {
      const key = this.dateKey(item.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries()).map(([key, groupItems]) => {
      groupItems[groupItems.length - 1].isLast = true;
      return {
        dateKey:   key,
        dateLabel: this.dateLabel(groupItems[0].date),
        items:     groupItems,
      };
    });
  }

  private mapStatus(estado: string): CheckinStatus {
  if (estado === 'ACEPTADO') return 'success';
  if (estado === 'DENEGADO') return 'denied';
  return 'pending';
}

private mapStatusLabel(estado: string): string {
  if (estado === 'ACEPTADO') return 'OK';
  if (estado === 'DENEGADO') return 'Denegado';
  return 'Pendiente';
}

private mapStatusIcon(estado: string): string {
  if (estado === 'ACEPTADO') return 'checkmark-outline';
  if (estado === 'DENEGADO') return 'close-outline';
  return 'hourglass-outline';
}
  private dateKey(d: Date): string {
    return d.toISOString().split('T')[0];
  }

  private dateLabel(d: Date): string {
    const today     = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    if (this.dateKey(d) === this.dateKey(today))     return 'Hoy';
    if (this.dateKey(d) === this.dateKey(yesterday)) return 'Ayer';
    return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  private calcStreak(): number {
    const days = new Set(this.allCheckins
      .filter(c => c.status === 'success')
      .map(c => this.dateKey(c.date)));
    let streak = 0;
    const d = new Date();
    while (days.has(this.dateKey(d))) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }

  // ── Datos simulados ───────────────────────────────────────────────
  private buildCheckins(): CheckinItem[] {
    const now = new Date();
    const daysAgo = (n: number, h = 8, m = 0) => {
      const d = new Date(now);
      d.setDate(d.getDate() - n);
      d.setHours(h, m, 0, 0);
      return d;
    };

    const raw: Omit<CheckinItem, 'statusLabel' | 'statusIcon' | 'isLast'>[] = [
      // Hoy
      { id:'ci-01', location:'Edificio de Sistemas',   locationIcon:'desktop-outline',        zone:'Piso 3 · Aula 301', cardUsed:'Credencial Universitaria', time:'09:04 AM', date: daysAgo(0, 9, 4),   status:'success' },
      { id:'ci-02', location:'Laboratorio de Cómputo', locationIcon:'hardware-chip-outline',  zone:'Lab A · Sala Norte', cardUsed:'Acceso Lab',               time:'11:22 AM', date: daysAgo(0, 11, 22), status:'success' },
      { id:'ci-03', location:'Biblioteca Central',     locationIcon:'library-outline',         zone:'Planta Baja',        cardUsed:'Credencial Universitaria', time:'01:45 PM', date: daysAgo(0, 13, 45), status:'success' },
      { id:'ci-04', location:'Cafetería Norte',        locationIcon:'cafe-outline',            zone:'Acceso General',     cardUsed:'Credencial Universitaria', time:'02:10 PM', date: daysAgo(0, 14, 10), status:'denied'  },

      // Ayer
      { id:'ci-05', location:'Edificio de Sistemas',   locationIcon:'desktop-outline',        zone:'Piso 2 · Aula 215', cardUsed:'Credencial Universitaria', time:'08:58 AM', date: daysAgo(1, 8, 58),  status:'success' },
      { id:'ci-06', location:'Sala de Conferencias A', locationIcon:'people-outline',         zone:'Piso 1',             cardUsed:'Credencial Universitaria', time:'10:30 AM', date: daysAgo(1, 10, 30), status:'success' },
      { id:'ci-07', location:'Laboratorio de Cómputo', locationIcon:'hardware-chip-outline',  zone:'Lab B · Sala Sur',   cardUsed:'Acceso Lab',               time:'03:15 PM', date: daysAgo(1, 15, 15), status:'pending' },
      { id:'ci-08', location:'Estacionamiento Sur',    locationIcon:'car-outline',            zone:'Puerta 2',           cardUsed:'Credencial Universitaria', time:'05:50 PM', date: daysAgo(1, 17, 50), status:'success' },

      // Hace 2 días
      { id:'ci-09', location:'Edificio Administrativo',locationIcon:'business-outline',       zone:'Ventanilla 4',       cardUsed:'Credencial Universitaria', time:'09:20 AM', date: daysAgo(2, 9, 20),  status:'success' },
      { id:'ci-10', location:'Biblioteca Central',     locationIcon:'library-outline',         zone:'Sala de Estudio 2',  cardUsed:'Credencial Universitaria', time:'12:05 PM', date: daysAgo(2, 12, 5),  status:'success' },
      { id:'ci-11', location:'Gimnasio Universitario', locationIcon:'barbell-outline',        zone:'Acceso Principal',   cardUsed:'Credencial Universitaria', time:'06:30 PM', date: daysAgo(2, 18, 30), status:'success' },

      // Hace 3 días
      { id:'ci-12', location:'Edificio de Sistemas',   locationIcon:'desktop-outline',        zone:'Piso 3 · Aula 305', cardUsed:'Credencial Universitaria', time:'08:45 AM', date: daysAgo(3, 8, 45),  status:'success' },
      { id:'ci-13', location:'Laboratorio de Cómputo', locationIcon:'hardware-chip-outline',  zone:'Lab A · Sala Norte', cardUsed:'Acceso Lab',               time:'11:00 AM', date: daysAgo(3, 11, 0),  status:'denied'  },
      { id:'ci-14', location:'Auditorio Principal',    locationIcon:'mic-outline',            zone:'Planta Baja',        cardUsed:'Credencial Universitaria', time:'04:00 PM', date: daysAgo(3, 16, 0),  status:'success' },

      // Hace 5 días
      { id:'ci-15', location:'Cafetería Norte',        locationIcon:'cafe-outline',           zone:'Acceso General',     cardUsed:'Credencial Universitaria', time:'01:30 PM', date: daysAgo(5, 13, 30), status:'success' },
      { id:'ci-16', location:'Biblioteca Central',     locationIcon:'library-outline',        zone:'Sala Digital',       cardUsed:'Credencial Universitaria', time:'03:40 PM', date: daysAgo(5, 15, 40), status:'success' },

      // Hace 8 días (ya fuera de semana)
      { id:'ci-17', location:'Edificio de Sistemas',   locationIcon:'desktop-outline',        zone:'Piso 1 · Aula 102', cardUsed:'Credencial Universitaria', time:'09:10 AM', date: daysAgo(8, 9, 10),  status:'success' },
      { id:'ci-18', location:'Sala de Conferencias B', locationIcon:'people-outline',         zone:'Piso 2',             cardUsed:'Credencial Universitaria', time:'11:45 AM', date: daysAgo(8, 11, 45), status:'pending' },

      // Hace 12 días
      { id:'ci-19', location:'Laboratorio de Cómputo', locationIcon:'hardware-chip-outline',  zone:'Lab C · Sala Este',  cardUsed:'Acceso Lab',               time:'02:00 PM', date: daysAgo(12, 14, 0), status:'success' },
      { id:'ci-20', location:'Estacionamiento Norte',  locationIcon:'car-outline',            zone:'Puerta 1',           cardUsed:'Credencial Universitaria', time:'06:00 PM', date: daysAgo(12, 18, 0), status:'denied'  },

      // Hace 20 días
      { id:'ci-21', location:'Edificio Administrativo',locationIcon:'business-outline',       zone:'Rectoría',           cardUsed:'Credencial Universitaria', time:'10:15 AM', date: daysAgo(20, 10, 15),status:'success' },
      { id:'ci-22', location:'Gimnasio Universitario', locationIcon:'barbell-outline',        zone:'Acceso VIP',         cardUsed:'Credencial Universitaria', time:'07:00 PM', date: daysAgo(20, 19, 0), status:'success' },
    ];

    return raw.map(item => ({
      ...item,
      statusLabel: item.status === 'success' ? 'OK'
                 : item.status === 'denied'  ? 'Denegado'
                 : 'Pendiente',
      statusIcon:  item.status === 'success' ? 'checkmark-outline'
                 : item.status === 'denied'  ? 'close-outline'
                 : 'hourglass-outline',
      isLast: false,
    }));
  }
}