import { TimeBasedPassword } from "./../models/time-based-password";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication_service";
import { Router } from "@angular/router";
import { lastValueFrom, throwError } from "rxjs";
import { AddTimeBasedPassword } from "../dtos/add-time-based-password";
import { UpdateTimeBasedPassword } from "../dtos/update-time-based-password";
import { CodeTypes } from "../dtos/code_types";
import { Algorithm } from "../models/algorithms";
@Injectable({
  providedIn: "root",
})
export class TotpService {
  apiPath: string = "v1/totp";

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

  async all(): Promise<TimeBasedPassword[]> {
    let response = this.httpClient.get<TimeBasedPassword[]>(
      `${this.apiPath}/all`,
      {
        headers: this.headers,
      }
    );

    let result = await lastValueFrom(response);

    return result;
  }

  async getCode(id: string): Promise<string> {
    let response = this.httpClient.get<string>(`${this.apiPath}/code/${id}`, {
      headers: this.headers,
    });

    let result = await lastValueFrom(response);
    return result;
  }

  async getSecret(id: string): Promise<string> {
    let response = this.httpClient.get<string>(
      `${this.apiPath}/content/${id}`,
      {
        headers: this.headers,
      }
    );

    let result = await lastValueFrom(response);
    return result;
  }

  async getCodeTypes(): Promise<CodeTypes[]> {
    let response = this.httpClient.get<CodeTypes[]>(`${this.apiPath}/types`, {
      headers: this.headers,
    });

    let result = await lastValueFrom(response);
    return result;
  }

  async getAlgorithms(): Promise<Algorithm[]> {
    let response = this.httpClient.get<Algorithm[]>(
      `${this.apiPath}/algorithms`,
      {
        headers: this.headers,
      }
    );

    let result = await lastValueFrom(response);
    return result;
  }

  async add(timePassword: AddTimeBasedPassword): Promise<string> {
    let response = this.httpClient.post<string>(
      `${this.apiPath}/add`,
      JSON.stringify(timePassword),
      {
        headers: this.headers,
      }
    );

    let result = await lastValueFrom(response);

    return result;
  }

  async update(timePassword: UpdateTimeBasedPassword): Promise<boolean> {
    let response = this.httpClient.post<boolean>(
      `${this.apiPath}/update`,
      JSON.stringify(timePassword),
      {
        headers: this.headers,
      }
    );

    let result = await lastValueFrom(response);
    return result;
  }

  async delete(id: string): Promise<boolean> {
    let response = this.httpClient.delete<boolean>(`${this.apiPath}/delete`, {
      headers: this.headers,
      body: id,
      params: {
        id: id,
      },
    });

    let result = await lastValueFrom(response);
    return result;
  }
}
