import { Component, OnInit } from '@angular/core';
import { Router, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

interface HexItem {
  x: string;
  y: string;
  delay: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit {

  /** Posiciones de los hexágonos decorativos del fondo */
  hexagons: HexItem[] = [];

  /** 9 celdas para el patrón QR de la tarjeta */
  qrDots: number[] = Array(9).fill(0);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.generateHexagons();
  }

  /**
   * Genera hexágonos con posiciones y delays aleatorios
   * para el fondo animado.
   */
  private generateHexagons(): void {
    const count = 18;
    for (let i = 0; i < count; i++) {
      this.hexagons.push({
        x:     `${Math.random() * 100}%`,
        y:     `${Math.random() * 100}%`,
        delay: `${(Math.random() * 4).toFixed(2)}s`,
      });
    }
  }

  /**
   * Navega a la pantalla de autenticación / onboarding.
   * Ajusta la ruta según tu RouterModule.
   */
  onStart(): void {
    this.router.navigateByUrl('/login');
  }
}