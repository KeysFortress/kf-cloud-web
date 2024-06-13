import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication_service";
import { Router } from "@angular/router";
import { lastValueFrom, throwError } from "rxjs";
import { StorageItem } from "../models/storage-item";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  apiPath: string = "v1/storage";

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

  async get(folderPath: string): Promise<StorageItem[]> {
    let path = `${this.apiPath}`;
    if (folderPath != "") {
      path = `${this.apiPath}/path/${folderPath}`;
    }

    let response = this.httpClient.get<StorageItem[]>(path, {
      headers: this.headers,
    });

    let result = await lastValueFrom(response);
    return result;
  }
  async getDirectory(folderPath: string): Promise<StorageItem[]> {
    let response = this.httpClient.post<StorageItem[]>(
      `${this.apiPath}/path`,
      JSON.stringify(folderPath),
      {
        headers: this.headers,
      }
    );

    let result = await lastValueFrom(response);
    return result;
  }
}
