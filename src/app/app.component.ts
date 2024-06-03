import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavigationComponent } from "../components/navigation/navigation.component";
import { LoaderComponent } from "../components/loader/loader.component";

import { CardComponent } from "../components/card/card.component";
import { TopNavComponent } from "../components/top-nav/top-nav.component";
import { BarChartComponent } from "../components/bar-chart/bar-chart.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    NavigationComponent,
    LoaderComponent,
    CardComponent,
    TopNavComponent,
    BarChartComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "keysfortress";

  constructor() {}
}
