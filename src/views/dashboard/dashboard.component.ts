import { Component } from "@angular/core";
import { NavigationComponent } from "../../components/navigation/navigation.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { CardComponent } from "../../components/card/card.component";
import { TopNavComponent } from "../../components/top-nav/top-nav.component";
import { BarChartComponent } from "../../components/bar-chart/bar-chart.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    NavigationComponent,
    LoaderComponent,
    CardComponent,
    TopNavComponent,
    BarChartComponent,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent {}
