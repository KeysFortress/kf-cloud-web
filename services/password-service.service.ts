import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  firstValueFrom,
  lastValueFrom,
  map,
  Observable,
  throwError,
} from "rxjs";
import { Password } from "../models/password";
import { AuthenticationService } from "./authentication_service";
import { Router } from "@angular/router";
import { UpdatePassword } from "../dtos/update-password";

@Injectable({
  providedIn: "root",
})
export class PasswordService {
  apiPath: string = "v1/passwords";

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

  public async add(
    website: string,
    email: string,
    password: string,
    upperCase: boolean = true,
    lowerCase: boolean = true,
    unique: boolean = true,
    requireDigits: boolean = true,
    specialCharacters: boolean = true
  ): Promise<Password> {
    const options = { headers: this.headers };
    let response = this.httpClient.post<string>(
      `${this.apiPath}/add`,
      JSON.stringify({
        Website: website,
        Email: email,
        Password: password,
        UpperCase: upperCase,
        LowerCase: lowerCase,
        Digits: requireDigits,
        Unique: unique,
        SpecialCharacters: specialCharacters,
      }),
      { headers: this.headers }
    );

    let first = await firstValueFrom(response);

    return {
      Id: first,
      Password: password.length,
      Website: website,
      Email: email,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    };
  }

  public async update(password: UpdatePassword): Promise<boolean> {
    let data = JSON.stringify(password);

    let response = this.httpClient.post<boolean>(
      `${this.apiPath}/update`,
      data,
      { headers: this.headers }
    );

    let first = await firstValueFrom(response);
    return first;
  }

  public async all(): Promise<Password[]> {
    let response = this.httpClient.get<Password[]>(`${this.apiPath}/all`, {
      headers: this.headers,
    });
    let result = await lastValueFrom(response);
    if (result == null) return [];

    return result;
  }

  public async passwordContent(id: string): Promise<string> {
    let response = this.httpClient.get<string>(
      `${this.apiPath}/content/${id}`,
      { headers: this.headers }
    );

    var result = await lastValueFrom(response);
    return result;
  }

  public async NewPassword(
    lenght: number = 16,
    upperCase: boolean = true,
    lowerCase: boolean = true,
    unique: boolean = true,
    requireDigits: boolean = true,
    specialCharacters: boolean = true
  ): Promise<string> {
    const json = {
      UpperCase: upperCase,
      LowerCase: lowerCase,
      Digits: requireDigits,
      Unique: unique,
      SpecialCharacters: specialCharacters,
      Lenght: lenght,
    };

    let response = this.httpClient.post<string>(
      `${this.apiPath}/generate`,
      JSON.stringify(json),
      { headers: this.headers }
    );

    const result = await lastValueFrom(response);
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

    const result = await lastValueFrom(response);
    return result;
  }
}
