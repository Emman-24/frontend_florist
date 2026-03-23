import { Component } from '@angular/core';
import {HeroComponent} from '../../components/hero/hero.component';
import {MarqueeComponent} from '../../components/marquee/marquee.component';
import {FeaturedComponent} from '../../components/featured/featured.component';
import {ProcessComponent} from '../../components/process/process.component';
import {StoryComponent} from '../../components/story/story.component';
import {FilosofyComponent} from '../../components/filosofy/filosofy.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    MarqueeComponent,
    FeaturedComponent,
    ProcessComponent,
    FilosofyComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent {

}
