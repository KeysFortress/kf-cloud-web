import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication_service";
import { Router } from "@angular/router";
import { lastValueFrom, throwError } from "rxjs";
import { AuthSuccess } from "../models/auth-success";
import { MfaSetupResponse } from "../dtos/mfa-setup-response";

@Injectable({
  providedIn: "root",
})
export class MfaService {
  apiPath: string = "v1/mfa";
  apiUserPath: string = "v1/mfa-user";

  headers?: HttpHeaders;
  mfaHeaders!: HttpHeaders;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthenticationService,
    private router: Router
  ) {
    let headers = authService.getToken();
    this.headers = headers;

    let mfaHeaders = authService.getMfaToken();
    if (mfaHeaders == null) {
      throwError(() => "Failed to get bearer token, redirecting");
      // this.router.navigateByUrl("");
      return;
    }
    this.mfaHeaders = mfaHeaders;
  }

  async GetAuthenticationSecret(): Promise<MfaSetupResponse> {
    console.log(this.mfaHeaders);
    let response = this.httpClient.get<MfaSetupResponse>(
      `${this.apiPath}/begin-setup`,
      {
        headers: this.mfaHeaders,
      }
    );

    let result = await lastValueFrom(response);
    return result;
  }

  async FinishInitialSetup(code: string, secret: string): Promise<boolean> {
    const bindingData = {
      Code: code,
      Secret: secret,
    };

    let response = this.httpClient.post<AuthSuccess>(
      `${this.apiPath}/finish-setup`,
      JSON.stringify(bindingData),
      { headers: this.mfaHeaders }
    );

    let result = await lastValueFrom(response);
    this.authService.setAuthenticationToken(result);
    return true;
  }
}
