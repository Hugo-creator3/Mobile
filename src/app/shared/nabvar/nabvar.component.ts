import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { 
  IonTabs, IonTabBar, IonTabButton, IonIcon, 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { addIcons } from 'ionicons';

import { homeOutline, home, personOutline, person, timeOutline, time, settingsOutline, settings} from 'ionicons/icons';

type TabKey = 'inicio' | 'perfil' | 'historial' | 'configuracion';

interface NavTab {
  key:   TabKey;
  route: string;
  index: number;
}

const NAV_TABS: NavTab[] = [
  { key: 'inicio',        route: '/tabs/main',     index: 0 },
  { key: 'perfil',        route: '/tabs/profile',  index: 1 },
  { key: 'historial',     route: '/tabs/history',  index: 2 },
  { key: 'configuracion', route: '/tabs/settings', index: 3 },
];

@Component({
  selector: 'app-nabvar',
  templateUrl: './nabvar.component.html',
  styleUrls: ['./nabvar.component.scss'],
  standalone: true,
imports: [CommonModule,  IonTabs, IonTabBar, IonTabButton, IonIcon],
})
export class NabvarComponent implements OnInit {

  activeTab:   TabKey = 'inicio';
  activeIndex: number = 0;

  constructor(private router: Router) {
        addIcons({ settings, settingsOutline, person, personOutline, timeOutline, time, homeOutline, home });

  }

  ngOnInit(): void {
    // Sincroniza el tab activo con la URL actual (incluye navegación directa o recarga)
    this.syncFromUrl(this.router.url);

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.syncFromUrl(e.urlAfterRedirects);
      });
  }

  /** Llamado al tocar un tab manualmente */
  setTab(key: TabKey, index: number): void {
    this.activeTab   = key;
    this.activeIndex = index;
  }

  /** Infiere el tab activo a partir de la URL */
  private syncFromUrl(url: string): void {
    const match = NAV_TABS.find(t => url.startsWith(t.route));
    if (match) {
      this.activeTab   = match.key;
      this.activeIndex = match.index;
    }
  }
}