import { AuthResponse } from "../models/auth-response";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import moment, { Moment } from "moment";
import { lastValueFrom, Observable } from "rxjs";
import { AuthSuccess } from "../models/auth-success";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  public beginLogin(email: string): Observable<AuthResponse> {
    var result = this.http.get<AuthResponse>(`v1/begin-request/${email}`);
    return result;
  }

  public async finishRequest(code: string): Promise<boolean> {
    let response = this.http.get<AuthSuccess>(`v1/login/${code}`);
    let result = await lastValueFrom(response);
    this.setSession(result);

    return true;
  }

  private setSession(authResult: AuthSuccess) {
    const expiresAt = authResult.expires_at;
    localStorage.setItem("mfa_token", authResult.access_token);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  public setAuthenticationToken(authResult: AuthSuccess) {
    localStorage.removeItem("mfa_token");
    localStorage.removeItem("expires_at");

    const expiresAt = authResult.expires_at;
    localStorage.setItem("id_token", authResult.access_token);
    localStorage.setItem("id_expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem("mfa_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("id_expires_at");
  }

  public isLoggedIn() {
    let date = this.getExpiration();
    if (date == null) return false;
    const dateTime = moment(date).format();
    return moment().isBefore(dateTime);
  }

  public isMfaPending() {
    const expiration = localStorage.getItem("expires_at");
    if (expiration == null) return false;

    const expiresAt = new Date(parseInt(expiration) * 1000);

    const dateTime = moment(expiresAt).format();
    return moment().isBefore(dateTime);
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration(): Moment | null {
    const expiration = localStorage.getItem("id_expires_at");
    if (expiration == null) return null;

    const expiresAt = new Date(parseInt(expiration) * 1000);
    return moment(expiresAt);
  }

  public getToken(
    contentType: string = "application/json"
  ): HttpHeaders | undefined {
    let token = localStorage.getItem("id_token");
    if (token == null) return undefined;

    let headers;
    headers = new HttpHeaders({
      "Content-Type": contentType,
      Authorization: `Bearer ${token}`,
    });

    return headers;
  }

  public getMfaToken(): HttpHeaders | null {
    let token = localStorage.getItem("mfa_token");
    if (token == null) return null;

    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    return headers;
  }

  mfaTokenPresent(): boolean {
    let token = localStorage.getItem("mfa_token");
    if (token == null) return false;

    return true;
  }
}
