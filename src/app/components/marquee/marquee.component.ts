import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-marquee',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './marquee.component.html',
  styleUrl: './marquee.component.sass'
})
export class MarqueeComponent {
  private base = [
    'Arreglos de Ocasión', 'Bouquets de Mano', 'Cajas Florales',
    'Fruteros Florales', 'Arreglos de Condolencia', 'Quinceaños & Graduación', 'Engalanados',
  ];
  allItems = [...this.base, ...this.base, ...this.base, ...this.base];
}
