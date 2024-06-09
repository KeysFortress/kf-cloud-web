import { Component, Input } from "@angular/core";

@Component({
  selector: "app-bar-chart",
  standalone: true,
  imports: [],
  templateUrl: "./bar-chart.component.html",
  styleUrl: "./bar-chart.component.css",
})
export class BarChartComponent {
  @Input()
  credentialRequests?: number;

  @Input()
  newCredentials?: number;
}
