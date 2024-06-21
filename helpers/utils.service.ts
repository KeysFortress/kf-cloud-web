import { Storage } from "./../models/storage";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import moment from "moment";

@Injectable({
  providedIn: "root",
})
export class UtilsService {
  constructor(private router: Router) {}

  formatDate(date: Date): string {
    let format = moment(date);
    var d = format.format("DD/MM/YY");
    return d == "Invalid date" ? "--" : d;
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + "k";
    }

    return `${value}`;
  }

  NavigateTo(page: string) {
    this.router.navigate([page]);
  }

  convertToGb(size?: number) {
    if (size == null) return 0;

    return size / 1024;
  }
}
