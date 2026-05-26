import {Component, inject, OnDestroy, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {interval, startWith, Subscription} from 'rxjs';

@Component({
  selector: 'app-whatsapp',
  imports: [],
  templateUrl: './whatsapp.component.html',
  standalone: true,
  styleUrl: './whatsapp.component.sass'
})
export class WhatsappComponent implements OnInit,OnDestroy{

  readonly isVisible = signal(false);
  readonly whatsappUrl = 'https://wa.me/573206861244';

  private scheduleSub?: Subscription;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  ngOnInit() {
    this.isVisible.set(this.checkSchedule());
    if (!this.isBrowser) return;

    this.scheduleSub = interval(60_000).pipe(startWith(0)).subscribe(() => {
      this.isVisible.set(this.checkSchedule());
    });
  }

  ngOnDestroy(): void {
    this.scheduleSub?.unsubscribe();
  }

  private checkSchedule(): boolean {
    const now = new Date();
    const bogota = new Date(now.toLocaleString('en-US', {timeZone: 'America/Bogota'}));
    const day = bogota.getDay();
    const time = bogota.getHours() * 60 + bogota.getMinutes();

    if (day === 0) return time >= 9 * 60 && time < 13 * 60;        // Sun 9–13
    if (day >= 1 && day <= 6) return time >= 7 * 60 && time < 19 * 60; // Mon–Sat 7–19
    return false;
  }

}

