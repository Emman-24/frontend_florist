import {Component, inject, OnInit, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CategoryService} from '../../services/category/category.service';
import {CategoryNode} from '../../models/category';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.sass'
})
export class FooterComponent implements OnInit{

  year = new Date().getFullYear();

  private readonly categoryService = inject(CategoryService);
  readonly categories = signal<CategoryNode[]>([]);

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(nodes => {
      this.categories.set(nodes);
    });
  }

}
