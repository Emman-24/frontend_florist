import {Component, inject, OnInit, OnDestroy, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {CategoryService} from '../../services/category/category.service';
import {CategoryNode} from '../../models/category';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink
  ],
  templateUrl: './footer.component.html',
  standalone: true,
  styleUrl: './footer.component.sass'
})
export class FooterComponent implements OnInit, OnDestroy {

  year = new Date().getFullYear();

  private readonly categoryService = inject(CategoryService);
  readonly categories = signal<CategoryNode[]>([]);
  private categorySub!: Subscription;

  ngOnInit(): void {
    this.categorySub = this.categoryService.getCategories().subscribe(nodes => {
      this.categories.set(nodes);
    });
  }

  ngOnDestroy(): void {
    this.categorySub?.unsubscribe();
  }

}
