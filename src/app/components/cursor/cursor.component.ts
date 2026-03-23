import {Component, inject, OnDestroy, OnInit, Renderer2} from '@angular/core';

@Component({
  selector: 'app-cursor',
  standalone: true,
  templateUrl: './cursor.component.html',
  styleUrl: './cursor.component.sass'
})
export class CursorComponent implements OnInit, OnDestroy {

  private renderer = inject(Renderer2);
  x = 0; y = 0;
  rx = 0; ry = 0;
  hovered = false;
  private unlisten: (() => void)[] = [];

  ngOnInit(): void {
    this.unlisten.push(
      this.renderer.listen('document', 'mousemove', (e: MouseEvent) => {
        this.x = e.clientX;
        this.y = e.clientY;
        setTimeout(() => { this.rx = e.clientX; this.ry = e.clientY; }, 80);
      })
    );
    this.unlisten.push(
      this.renderer.listen('document', 'mouseover', (e: MouseEvent) => {
        const t = e.target as HTMLElement;
        this.hovered = !!t.closest('button, a, .product-card, .feat-card, .detail-thumb, .color-swatch, .size-btn, .cart-qty-btn');
      })
    );
  }


  ngOnDestroy(): void {
    this.unlisten.forEach(fn => fn());
  }



}
