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

import { ApexLegend, NgApexchartsModule } from "ng-apexcharts";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
} from "ng-apexcharts";
import { MonthlyActivityEvents } from "../../../models/monthly-activity-events";
import { ActionEvent } from "../../../models/action-event";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
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
  monthlyActivityEvents?: MonthlyActivityEvents;
  Events?: ActionEvent[];

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
    });

    dashboardService.getActivityEvents().then((x) => {
      this.monthlyActivityEvents = x;
      this.renderChart(x);
    });

    eventService.Take(5, 0).then((x) => {
      this.Events = x;
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

  renderChart(x: MonthlyActivityEvents) {
    const downloads: { [date: string]: number } = x.Downloads.reduce<{
      [date: string]: number;
    }>((acc, cur) => {
      const dateKey =
        cur.EventDate instanceof Date
          ? cur.EventDate.toISOString().split("T")[0]
          : cur.EventDate; // Extracting date part if EventDate is a Date object
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {});

    const uploads: { [date: string]: number } = x.Uploads.reduce<{
      [date: string]: number;
    }>((acc, cur) => {
      const dateKey =
        cur.EventDate instanceof Date
          ? cur.EventDate.toISOString().split("T")[0]
          : cur.EventDate; // Extracting date part if EventDate is a Date object
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {});

    const dates = Object.keys(downloads); // Assuming downloads and uploads have same dates
    const uploadDates = Object.keys(uploads);
    this.chartOptions = {
      series: [
        {
          name: "Downloads",
          data: dates.map((date) => downloads[date]),
        },
        {
          name: "Uploads",
          data: uploadDates.map((date) => uploads[date] || 0), // If there are no uploads for a date, set count to 0
        },
      ],
      chart: {
        height: 215,
        type: "area",
        toolbar: {
          show: false,
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: dates,
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    };
  }

  getEventTypeColor(data: ActionEvent) {
    console.log(data.TypeId);
    if (
      data.TypeId == 1 ||
      data.TypeId == 4 ||
      data.TypeId == 7 ||
      data.TypeId == 10
    ) {
      return "bg-primary";
    }

    if (
      data.TypeId == 2 ||
      data.TypeId == 5 ||
      data.TypeId == 8 ||
      data.TypeId == 11
    ) {
      return "bg-warning";
    }

    if (
      data.TypeId == 3 ||
      data.TypeId == 6 ||
      data.TypeId == 9 ||
      data.TypeId == 12
    ) {
      return "bg-danger";
    }

    if (data.TypeId == 13) {
      return "bg-info";
    }

    return "";
  }
}
