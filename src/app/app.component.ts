import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { LoaderComponent } from '../components/loader/loader.component';
import { CardComponent } from '../components/card/card.component';
import { TopNavComponent } from '../components/top-nav/top-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavigationComponent,
    LoaderComponent,
    CardComponent,
    TopNavComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'keysfortress';
  SevenInHundred: number = 0;
  /**
   *
   */
  constructor() {
    for (let i = 1; i <= 100; i++) {
      console.log(i);
      let num = i.toString();
      if (num.includes('7')) {
        this.SevenInHundred += 1;
        console.log('Seven');
      }
    }
  }
}
