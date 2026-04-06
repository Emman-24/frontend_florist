import {Component, HostListener, inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2, signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {CategoryService} from '../../services/category/category.service';
import {CategoryNode} from '../../models/category';
import {isPlatformBrowser} from '@angular/common';

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

export class NavbarComponent implements OnInit, OnDestroy {

  private readonly categoryService = inject(CategoryService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly renderer = inject(Renderer2);

  private backdropEl: HTMLElement | null = null;
  private savedScrollY = 0;
  private closeDropdownTimer: ReturnType<typeof setTimeout> | null = null;


  scrolled     = signal(false);
  menuOpen     = signal(false);
  openDropdown = signal<number | null>(null);
  mobileOpen   = signal<number | null>(null);

  readonly categories = signal<CategoryNode[]>([]);


  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(nodes => {
      this.categories.set(nodes);
    });
  }

  ngOnDestroy(): void {
    this.clearCloseTimer();
    this.destroyBackdrop();
    this.unlockScroll();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 60);
  }

  toggleMenu(): void {
    this.menuOpen() ? this.closeMenu() : this.openMenu();
  }

  openMenu(): void {
    this.menuOpen.set(true);
    this.lockScroll();
    this.createBackdrop();
  }

  closeMenu(): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    this.mobileOpen.set(null);
    this.unlockScroll();
    this.destroyBackdrop();
  }

  hasChildren(node: CategoryNode): boolean {
    return node.children?.length > 0;
  }

  toggleDropdown(id: number): void {
    this.clearCloseTimer();
    this.openDropdown.set(id);
  }

  closeDropdown(): void {
    this.closeDropdownTimer = setTimeout(() => {
      this.openDropdown.set(null);
    }, 150);
  }

  private clearCloseTimer(): void {
    if (this.closeDropdownTimer !== null) {
      clearTimeout(this.closeDropdownTimer);
      this.closeDropdownTimer = null;
    }
  }

  toggleMobile(id: number): void {
    this.mobileOpen.set(this.mobileOpen() === id ? null : id);
  }

  isMobileOpen(id: number): boolean {
    return this.mobileOpen() === id;
  }

  private createBackdrop(): void {
    if (!isPlatformBrowser(this.platformId) || this.backdropEl) return;

    const el = this.renderer.createElement('div') as HTMLElement;
    this.renderer.addClass(el, 'nav-body-backdrop');
    this.renderer.listen(el, 'click', () => this.closeMenu());
    this.renderer.appendChild(document.body, el);
    this.backdropEl = el;

    requestAnimationFrame(() => {
      if (this.backdropEl) this.renderer.addClass(this.backdropEl, 'nav-body-backdrop--visible');
    });
  }

  private destroyBackdrop(): void {
    if (!this.backdropEl) return;
    this.renderer.removeClass(this.backdropEl, 'nav-body-backdrop--visible');
    const el = this.backdropEl;
    this.backdropEl = null;
    setTimeout(() => {
      if (el.parentNode) this.renderer.removeChild(document.body, el);
    }, 420);
  }

  private lockScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.savedScrollY = window.scrollY;
    const b = document.body;
    b.style.position = 'fixed';
    b.style.top      = `-${this.savedScrollY}px`;
    b.style.left     = '0';
    b.style.right    = '0';
    b.style.overflow = 'hidden';
  }

  private unlockScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const b = document.body;
    b.style.position = '';
    b.style.top      = '';
    b.style.left     = '';
    b.style.right    = '';
    b.style.overflow = '';
    window.scrollTo(0, this.savedScrollY);
  }

}
