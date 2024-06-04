import { Component } from "@angular/core";
import { QRCodeModule } from "angularx-qrcode";
import { SetupService } from "../../../services/setup.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-setup",
  standalone: true,
  imports: [QRCodeModule],
  templateUrl: "./setup.component.html",
  styleUrl: "./setup.component.css",
})
export class SetupComponent {
  qrData: string = "dwadwadwa";

  constructor(private setupService: SetupService, private router: Router) {}

  async ngOnInit() {
    let isEmpty = await this.setupService.isConfigured();
    if (!isEmpty) {
      this.router.navigate(["login"]);
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
