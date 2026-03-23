import {Component, HostListener, inject, OnInit, signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {CategoryService} from '../../services/category/category.service';
import {CategoryNode} from '../../models/category';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.sass'
})

export class NavbarComponent implements OnInit {

  private readonly categoryService = inject(CategoryService);

  scrolled = signal(false);
  menuOpen = signal(false);
  openDropdown = signal<number | null>(null);

  readonly categories = signal<CategoryNode[]>([]);


  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(nodes => {
      this.categories.set(nodes);
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 60);
  }

  toggleMenu(): void {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  hasChildren(node: CategoryNode): boolean {
    return node.children && node.children.length > 0;
  }

  toggleDropdown(id: number): void {
    this.openDropdown.set(id);
  }

  closeDropdown(): void {
    this.openDropdown.set(null);
  }

}
