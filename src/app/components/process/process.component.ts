import {Component} from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './process.component.html',
  styleUrl: './process.component.sass'
})
export class ProcessComponent {
  steps = [
    {
      num: '01', icon: '🌺', title: 'Selección de flores',
      desc: 'Escogemos las flores más frescas y hermosas, garantizando calidad y durabilidad en cada arreglo que preparamos.'
    },
    {
      num: '02', icon: '✂️', title: 'Diseño artesanal',
      desc: 'Con amor y dedicación, nuestras manos crean cada arreglo pensando en el mensaje que quieres transmitir.'
    },
    {
      num: '03', icon: '🎀', title: 'Presentación especial',
      desc: 'Cada arreglo se presenta con empaque elegante, listo para sorprender a esa persona tan especial en tu vida.'
    },
    {
      num: '04', icon: '🛵', title: 'Entrega en Pereira',
      desc: 'Llevamos tu detalle directamente donde lo necesites en Pereira y sus alrededores con puntualidad y cuidado.'
    },
  ];
}
