import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SetupService {
  apiPath: string = "v1/setup";

  constructor(private httpClient: HttpClient) {}

  async isConfigured(): Promise<boolean> {
    let response = this.httpClient.get<boolean>(`${this.apiPath}/state`);

    let result = await lastValueFrom(response);
    return result;
  }

  async initSetup(): Promise<string> {
    let response = this.httpClient.get<string>(`${this.apiPath}/init`);

    let result = await lastValueFrom(response);
    return result;
  }
}
