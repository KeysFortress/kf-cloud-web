import { Component } from "@angular/core";
import { QRCodeModule } from "angularx-qrcode";
import { SetupService } from "../../../services/setup.service";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../../services/authentication_service";

@Component({
  selector: "app-setup",
  standalone: true,
  imports: [QRCodeModule],
  templateUrl: "./setup.component.html",
  styleUrl: "./setup.component.css",
})
export class SetupComponent {
  qrData: string = "dwadwadwa";

  constructor(
    private setupService: SetupService,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  async ngOnInit() {
    let isEmpty = await this.setupService.isConfigured();
    let loggedIn = await this.authService.isLoggedIn();
    if (!isEmpty && !loggedIn) {
      this.router.navigate(["login"]);
    }

    if (loggedIn) {
      this.router.navigate(["dashboard"]);
    }

    this.setupService
      .initSetup()
      .then((x) => {
        this.qrData = x;
      })
      .catch((x) => {
        this.router.navigate(["login"]);
      });
  }
}
