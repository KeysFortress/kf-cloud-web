import { Password } from "./../models/password";
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
  dragAreaClass?: string;
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

  async getShareLink(email: string, filePath: string): Promise<string> {
    var data = {
      Email: email,
      FilePath: filePath,
    };
    let json = JSON.stringify(data);
    let response = this.httpClient.post<string>(`${this.apiPath}/share`, json, {
      headers: this.headers,
    });

    let result = await lastValueFrom(response);
    return result;
  }

  async rename(path: string, name: string): Promise<boolean> {
    let data = JSON.stringify({
      Path: path,
      Name: name,
    });
    let response = this.httpClient.post<boolean>(
      `${this.apiPath}/rename`,
      data,
      {
        headers: this.headers,
      }
    );

    let result = lastValueFrom(response);
    return result;
  }

  async delete(path: string): Promise<boolean> {
    let response = this.httpClient.delete<boolean>(
      `${this.apiPath}/file/remove`,
      {
        body: path,
        headers: this.headers,
        params: {
          id: path,
        },
      }
    );

    let result = await lastValueFrom(response);
    return result;
  }

  async upload(event: File[], path: string): Promise<boolean> {
    const formData: FormData = new FormData();

    for (const file of event) {
      formData.append("file", file, file.name);
    }

    formData.append("path", path);
    var boundary = Math.random().toString().substr(2);
    const headers = this.authService.getToken(
      "multipart/form-data; boundary=--" + boundary
    );
    console.log(boundary);
    try {
      var h = new HttpHeaders({
        Authorization: this.headers.get("Authorization")!,
      });
      let response = await this.httpClient.post<boolean>(
        `${this.apiPath}/upload`,
        formData,
        { headers: h }
      );

      let result = await lastValueFrom(response);
      return result;
    } catch (error) {
      console.error("Error uploading file:", error);
      return false;
    }
  }

  async download(path: string, fileName: string): Promise<void> {
    const response = this.httpClient.post(
      `${this.apiPath}/download`,
      JSON.stringify(path),
      {
        headers: this.headers,
        responseType: "blob",
      }
    );

    const result = await lastValueFrom(response);
    this.saveFile(result, fileName);
  }

  private saveFile(data: Blob, filename: string): void {
    const a = document.createElement("a");
    const objectUrl = URL.createObjectURL(data);
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }
}
