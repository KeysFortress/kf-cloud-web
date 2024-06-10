import { Component, ViewChild } from "@angular/core";
import { NavigationComponent } from "../../components/navigation/navigation.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { CardComponent } from "../../components/card/card.component";
import { TopNavComponent } from "../../components/top-nav/top-nav.component";
import { BarChartComponent } from "../../components/pie-chart/pie-chart.component";
import { DashboardService } from "../../../services/dashboard.service";
import { CredentialData } from "../../../models/credential-data";
import { Device } from "../../../models/device";
import { Storage } from "../../../models/storage";
import { UtilsService } from "../../../helpers/utils.service";
import { EventsService } from "../../../services/events.service";

import { NgApexchartsModule } from "ng-apexcharts";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    NavigationComponent,
    LoaderComponent,
    CardComponent,
    TopNavComponent,
    BarChartComponent,
    NgApexchartsModule,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent {
  credentialData?: CredentialData;
  devices?: Device[];
  storage?: Storage;
  @ViewChild("chart") chart?: ChartComponent;
  public chartOptions?: ChartOptions;

  constructor(
    public utils: UtilsService,
    private dashboardService: DashboardService,
    private eventService: EventsService
  ) {
    dashboardService.credentialData().then((x) => {
      this.credentialData = x;
    });

    dashboardService.devices().then((x) => {
      this.devices = x;
    });

    dashboardService.storage().then((x) => {
      this.storage = x;
      this.renderChart(x);
    });
  }

  getIcon(device: Device) {
    switch (device.TypeId) {
      case 1:
        return "fab fa-android";
      case 2:
        return "fab fa-apple";
      case 3:
        return "fab fa-windows";
      case 4:
        return "fab fa-linux";
      case 5:
        return "fab fa-app-store-ios";
      default:
        return "fab fa-android";
    }
  }

  renderChart(x: Storage) {
    this.chartOptions = {
      series: [
        {
          name: "series1",
          data: [31, 40, 28, 51, 42, 109, 100],
        },
        {
          name: "series2",
          data: [11, 32, 45, 32, 34, 52, 41],
        },
      ],
      chart: {
        height: 215,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
        ],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    };
  }
}
