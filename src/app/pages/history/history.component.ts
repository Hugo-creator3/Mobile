import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonContent, IonIcon, IonHeader 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { AsistenciasService } from 'src/app/services/asistencias.service';
import { addIcons } from 'ionicons';
import { 
  barbellOutline, businessOutline, addOutline, logOutOutline, cafeOutline, 
  cardOutline, carOutline, checkmarkCircleOutline, checkmarkOutline, 
  chevronBackOutline, closeCircleOutline, closeOutline, desktopOutline, 
  flameOutline, hardwareChipOutline, hourglassOutline, libraryOutline, 
  locationOutline, optionsOutline, scanOutline, timeOutline 
} from 'ionicons/icons';

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
  imports: [IonContent, IonIcon, IonHeader, CommonModule],
})
export class HistoryComponent implements OnInit {

  pageReady = false;
  activeTab: TabKey = 'all';

  private allCheckins: CheckinItem[] = [];

  // ── Propiedades fijas en lugar de getters ──────────────────────
  tabs: Tab[] = [];
  stats: StatCard[] = [];
  filteredGroups: CheckinGroup[] = [];
  totalCheckins: number = 0;
  activeTabIndex: number = 0;

  constructor(
    private router: Router,
    private asistenciasService: AsistenciasService,
    private ngZone: NgZone
  ) {
    addIcons({ 
      chevronBackOutline, optionsOutline, cardOutline, timeOutline, 
      locationOutline, scanOutline, desktopOutline, hardwareChipOutline,
      barbellOutline, hourglassOutline, businessOutline, logOutOutline,
      carOutline, addOutline, closeCircleOutline, flameOutline,
      libraryOutline, cafeOutline, checkmarkOutline, closeOutline, checkmarkCircleOutline
    });
  }

  ngOnInit(): void {
    this.rebuildAll();
    this.pageReady = true;

    this.asistenciasService.getMyAsistencias().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
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
          this.rebuildAll();
        });
      },
      error: (err) => {
        console.error('Error cargando historial', err);
      }
    });
  }

  setTab(key: TabKey): void {
    this.activeTab = key;
    this.pageReady = false;
    this.rebuildAll();
    setTimeout(() => { this.pageReady = true; }, 60);
  }

  onBack(): void { this.router.navigate(['/tabs/main']); }
  onFilter(): void {}
  onItemTap(item: CheckinItem): void { console.log('Check-in:', item.id); }

  // ── Reconstruye todas las propiedades derivadas ────────────────
  private rebuildAll(): void {
    const weekCheckins  = this.getWeekCheckins();
    const monthCheckins = this.getMonthCheckins();

    this.totalCheckins  = this.allCheckins.length;
    this.activeTabIndex = ['all', 'week', 'month'].indexOf(this.activeTab);

    this.tabs = [
      { key: 'all',   label: 'Todos',  count: this.allCheckins.length },
      { key: 'week',  label: 'Semana', count: weekCheckins.length },
      { key: 'month', label: 'Mes',    count: monthCheckins.length },
    ];

    const current = this.activeTab === 'week'  ? weekCheckins
                  : this.activeTab === 'month' ? monthCheckins
                  : this.allCheckins;

    const ok      = current.filter(c => c.status === 'success').length;
    const denied  = current.filter(c => c.status === 'denied').length;
    const pending = current.filter(c => c.status === 'pending').length;
    const streak  = this.calcStreak();

    this.stats = [
      { icon: 'checkmark-circle-outline', value: String(ok),      label: 'Accesos\nExitosos',  color: '#4ade80' },
      { icon: 'close-circle-outline',     value: String(denied),  label: 'Accesos\nDenegados', color: '#f87171' },
      { icon: 'time-outline',             value: String(pending), label: 'Pendientes',          color: '#fb923c' },
      { icon: 'flame-outline',            value: `${streak}d`,    label: 'Racha\nActual',       color: '#a855f7' },
    ];

    this.filteredGroups = this.groupByDate(current);
  }

  // ── Helpers ───────────────────────────────────────────────────
  private getWeekCheckins(): CheckinItem[] {
    const from = new Date();
    from.setDate(from.getDate() - 7);
    return this.allCheckins.filter(c => c.date >= from);
  }

  private getMonthCheckins(): CheckinItem[] {
    const now = new Date();
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
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
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
}