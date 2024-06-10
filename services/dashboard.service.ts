import { MonthlyActivityEvents } from "./../models/monthly-activity-events";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication_service";
import { Router } from "@angular/router";
import { lastValueFrom, throwError } from "rxjs";
import { CredentialData } from "../models/credential-data";
import { Device } from "../models/device";
import { Storage } from "../models/storage";
import { ActionEvent } from "../models/action-event";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  apiPath: string = "v1/dashboard";

  headers!: HttpHeaders;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthenticationService,
    private router: Router
  ) {
    let headers = authService.getToken();
    if (headers == null) {
      throwError(() => "Failed to get bearer token, redirecting");
      // this.router.navigateByUrl("");
      return;
    }

    this.headers = headers;
  }

  public async credentialData() {
    let response = this.httpClient.get<CredentialData>(
      `${this.apiPath}/credentials-data`,
      {
        headers: this.headers,
      }
    );

    let result = await lastValueFrom(response);
    return result;
  }

  public async devices() {
    let response = this.httpClient.get<Device[]>(`${this.apiPath}/devices`, {
      headers: this.headers,
    });

    let result = await lastValueFrom(response);
    return result;
  }

  public async storage() {
    let response = this.httpClient.get<Storage>(`${this.apiPath}/storage`, {
      headers: this.headers,
    });

    let result = await lastValueFrom(response);
    return result;
  }

  public async getActivityEvents() {
    let response = this.httpClient.get<MonthlyActivityEvents>(
      `${this.apiPath}/monthly-activity`,
      {
        headers: this.headers,
      }
    );

    var result = await lastValueFrom(response);
    if (result == null) {
      return {
        Downloads: [],
        Uploads: [],
      };
    }

    return result;
  }
}
