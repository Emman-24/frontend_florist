import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage = 0;       // 0-based (Spring Boot style)
  @Input() totalPages = 0;
  @Input() totalElements = 0;
  @Input() pageSize = 12;
  @Output() pageChange = new EventEmitter<number>();

  pages: (number | '…')[] = [];

  ngOnChanges(_changes: SimpleChanges): void {
    this.buildPages();
  }

  private buildPages(): void {
    if (this.totalPages <= 1) {
      this.pages = [];
      return;
    }

    const p = this.currentPage;
    const t = this.totalPages;
    const raw: (number | '…')[] = [];

    raw.push(0);

    if (p > 3) raw.push('…');

    for (let i = Math.max(1, p - 1); i <= Math.min(t - 2, p + 1); i++) {
      raw.push(i);
    }

    if (p < t - 4) raw.push('…');

    if (t > 1) raw.push(t - 1);

    this.pages = raw;
  }

  go(page: number | '…'): void {
    if (page === '…' || page === this.currentPage) return;
    this.pageChange.emit(page as number);
  }

  prev(): void {
    if (this.currentPage > 0) this.pageChange.emit(this.currentPage - 1);
  }

  next(): void {
    if (this.currentPage < this.totalPages - 1) this.pageChange.emit(this.currentPage + 1);
  }

  get startItem(): number {
    return this.currentPage * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalElements);
  }

  isEllipsis(p: number | '…'): p is '…' {
    return p === '…';
  }
}
