import {Component, OnChanges, signal, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.sass'
})
export class ProductDetailComponent implements OnChanges {

  selectedThumb = signal(0);
  activeTab = signal<'description' | 'care' | 'delivery'>('description');


  ngOnChanges(changes: SimpleChanges): void {
    this.selectedThumb.set(0);
  }

  switchThumb(i: number): void {
    this.selectedThumb.set(i);
  }

}
