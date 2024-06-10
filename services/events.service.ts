import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication_service";
import { Router } from "@angular/router";
import { lastValueFrom, throwError } from "rxjs";
import { ActionEvent } from "../models/action-event";

@Injectable({
  providedIn: "root",
})
export class EventsService {
  apiPath: string = "v1/events";

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

  public async Take(take: number, skip: number) {
    let response = this.httpClient.post<ActionEvent[]>(
      `${this.apiPath}/take`,
      JSON.stringify({
        Take: take,
        Skip: skip,
      }),
      {
        headers: this.headers,
      }
    );

    let result = await lastValueFrom(response);
    return result;
  }
}
