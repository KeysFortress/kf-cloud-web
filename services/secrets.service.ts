import { AddSecretDto } from "./../dtos/add-secret";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication_service";
import { Router } from "@angular/router";
import { lastValueFrom, throwError } from "rxjs";
import { UpdateSecretDto } from "../dtos/update-secret";
import { Secret } from "../models/secret";

@Injectable({
  providedIn: "root",
})
export class SecretsService {
  apiPath: string = "v1/secrets";

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

  async all(): Promise<Secret[]> {
    let response = this.httpClient.get<Secret[]>(`${this.apiPath}/all`, {
      headers: this.headers,
    });
    let result = await lastValueFrom(response);
    return result;
  }

  async getSecretContent(id: string): Promise<string> {
    let response = this.httpClient.get<string>(
      `${this.apiPath}/content/${id}`,
      {
        headers: this.headers,
      }
    );

    var result = await lastValueFrom(response);
    return result;
  }

  async add(addSecret: AddSecretDto): Promise<string> {
    let response = this.httpClient.post<string>(
      `${this.apiPath}/add`,
      JSON.stringify(addSecret),
      {
        headers: this.headers,
      }
    );

    var result = await lastValueFrom(response);

    return result;
  }

  async update(addSecret: UpdateSecretDto): Promise<boolean> {
    let response = this.httpClient.post<boolean>(
      `${this.apiPath}/update`,
      JSON.stringify(addSecret),
      {
        headers: this.headers,
      }
    );

    var result = await lastValueFrom(response);

    return result;
  }

  async delete(id: string): Promise<boolean> {
    let response = this.httpClient.delete<boolean>(`${this.apiPath}/remove`, {
      body: id,
      headers: this.headers,
      params: {
        id: id,
      },
    });

    let result = await lastValueFrom(response);
    return result;
  }
}
