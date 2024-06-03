import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication_service";
import { Router } from "@angular/router";
import { lastValueFrom, throwError } from "rxjs";
import { Identity } from "../models/identity";
import { ServerKeyType } from "../models/key-type";
import { CreateIdentityRequest } from "../dtos/create-identity";
import { UpdateIdentity } from "../dtos/update-identity";
import { UpdateIdentityResponse } from "../dtos/update-identity-response";
import { AddIdentityResponse } from "../dtos/add-identity-response";

@Injectable({
  providedIn: "root",
})
export class IdentityService {
  apiPath: string = "v1/identities";

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

  async all(): Promise<Identity[]> {
    let response = this.httpClient.get<Identity[]>(`${this.apiPath}/all`, {
      headers: this.headers,
    });

    let result = await lastValueFrom(response);
    return result;
  }

  async types(): Promise<ServerKeyType[]> {
    let response = this.httpClient.get<ServerKeyType[]>(
      `${this.apiPath}/types`,
      {
        headers: this.headers,
      }
    );

    let result = await lastValueFrom(response);
    return result;
  }

  async add(identity: CreateIdentityRequest): Promise<AddIdentityResponse> {
    let response = this.httpClient.post<AddIdentityResponse>(
      `${this.apiPath}/add`,
      JSON.stringify(identity),
      {
        headers: this.headers,
      }
    );

    let result = await lastValueFrom(response);
    return result;
  }

  async update(identity: UpdateIdentity): Promise<UpdateIdentityResponse> {
    let response = this.httpClient.post<UpdateIdentityResponse>(
      `${this.apiPath}/update`,
      JSON.stringify(identity),
      { headers: this.headers }
    );

    let result = await lastValueFrom(response);

    return result;
  }

  async remove(id: string): Promise<boolean> {
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
