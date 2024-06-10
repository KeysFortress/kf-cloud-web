import { Component, Input, ViewChild } from "@angular/core";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent,
  NgApexchartsModule,
  ApexLegend,
  ApexFill,
  ApexDataLabels,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  tooltip: {
    enabled: boolean;
  };
  labels: string[];
  colors: string[];
  legend: ApexLegend;
};

@Component({
  selector: "app-pie-chart",
  standalone: true,
  imports: [BarChartComponent, NgApexchartsModule],
  templateUrl: "./pie-chart.component.html",
  styleUrl: "./pie-chart.component.css",
})
export class BarChartComponent {
  @Input()
  credentialRequests?: number;

  @Input()
  newCredentials?: number;

  chartOptions?: ChartOptions;

  constructor() {}

  ngOnInit() {
    this.chartOptions = {
      series: [this.credentialRequests!, this.newCredentials!],
      chart: {
        width: 380,
        height: 380,
        type: "pie",
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
        style: {
          fontSize: "0px",
        },
      },

      fill: {
        colors: ["#e74c3c", "#ffffff"],
        type: "solid",
      },
      tooltip: {
        enabled: false,
      },
      labels: ["Credential requests", "New Credentials"],
      colors: ["#FFFFFF", "#FFFFFF"], // Set colors to white
      legend: {
        show: false, // Hide legend
      },
    };
  }
}
