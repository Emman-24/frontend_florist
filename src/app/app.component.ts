import {afterNextRender, Component, inject, OnDestroy, signal} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {CursorComponent} from './components/cursor/cursor.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {FooterComponent} from './components/footer/footer.component';
import {LoaderComponent} from './components/loader/loader.component';
import {filter, Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CursorComponent, NavbarComponent, NavbarComponent, FooterComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnDestroy {

  loaderDone = signal(false)
  private observer!: IntersectionObserver;
  private routerSub!: Subscription;
  private router = inject(Router);

  constructor() {
    afterNextRender(() => {
      setTimeout(() => {
        this.loaderDone.set(true);
        this.initRevealObserver();
        setTimeout(() => this.observeRevealElements(), 50);
      }, 2400);
    });

    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => this.observeRevealElements(), 50);
      setTimeout(() => this.observeRevealElements(), 300);
    });
  }


  private initRevealObserver(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.makeAllVisible();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    this.observeRevealElements();
  }

  private observeRevealElements(): void {
    if (!this.observer) return;
    const selectors = '.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible)';
    document.querySelectorAll(selectors).forEach(el => this.observer.observe(el));
  }

  private makeAllVisible(): void {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
      .forEach(el => el.classList.add('visible'));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.routerSub?.unsubscribe();
  }

}
