import {afterNextRender, Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CursorComponent} from './components/cursor/cursor.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {FooterComponent} from './components/footer/footer.component';
import {LoaderComponent} from './components/loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CursorComponent, NavbarComponent, NavbarComponent, FooterComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {

  loaderDone = signal(false)
  private observer!: IntersectionObserver;


  constructor() {
    afterNextRender(() => {
      setTimeout(() => {
        this.loaderDone.set(true);
        this.initRevealObserver();
      }, 2400);
    });
  }

  private initRevealObserver(): void {
    if (typeof IntersectionObserver === 'undefined') return;
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    this.observeRevealElements();
  }

  private observeRevealElements(): void {
    if (!this.observer) return;
    document.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible)')
      .forEach(el => this.observer.observe(el));
  }
}
