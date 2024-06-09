import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication_service";
import { Router } from "@angular/router";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EventsService {
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
}
