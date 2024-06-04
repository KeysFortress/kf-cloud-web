import { Component } from "@angular/core";
import { AuthResponse } from "../../../models/auth-response";
import { AuthenticationService } from "../../../services/authentication_service";
import { ActivatedRoute, Router } from "@angular/router";
import { Time } from "@angular/common";
import { QRCodeModule } from "angularx-qrcode";

@Component({
  selector: "app-connect",
  standalone: true,
  imports: [QRCodeModule],
  templateUrl: "./connect.component.html",
  styleUrl: "./connect.component.css",
})
export class ConnectComponent {
  authRequestData!: AuthResponse;
  expiresAt!: Time;
  qrData!: string;
  seconds!: number;
  expired!: boolean;
  private timeout: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.expiresAt = {
      minutes: 10,
      hours: 0,
    };
  }

  ngOnInit() {
    this.route.queryParams.forEach(async (param) => {
      this.authRequestData = param as AuthResponse;
      this.qrData = JSON.stringify(param as AuthResponse);

      let result = await this.authService.finishRequest(
        this.authRequestData.Uuid
      );
      if (!result) {
        this.expired = true;
      }

      this.router.navigate(["setup-mfa"]);
    });

    this.seconds = 0;
    this.timeout = setInterval(() => {
      this.seconds += 1;

      if (this.seconds == 60) {
        this.seconds = 0;
        this.expiresAt.minutes -= 1;
      }

      if (this.expiresAt.minutes <= 0) {
        this.expired = true;
        clearInterval(this.timeout);
      }
    }, 1000);
  }

  onTryAgain() {
    this.router.navigate([""]);
  }
}
