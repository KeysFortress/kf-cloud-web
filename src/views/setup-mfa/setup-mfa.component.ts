import { Router } from "@angular/router";
import { Component } from "@angular/core";
import { QRCodeModule } from "angularx-qrcode";
import { MfaSetupResponse } from "../../../dtos/mfa-setup-response";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MfaService } from "../../../services/mfa.service";

@Component({
  selector: "app-setup-mfa",
  standalone: true,
  imports: [QRCodeModule, ReactiveFormsModule],
  templateUrl: "./setup-mfa.component.html",
  styleUrl: "./setup-mfa.component.css",
})
export class SetupMfaComponent {
  qrData!: MfaSetupResponse;
  formGroup = new FormGroup({
    code: new FormControl(""),
  });
  wrongCode: boolean = false;

  /**
   *
   */
  constructor(private mfaService: MfaService, private router: Router) {}

  ngOnInit() {
    this.mfaService.GetAuthenticationSecret().then((secret) => {
      this.qrData = secret;
    });
  }

  async onTryAgain() {
    if (this.formGroup.value.code == null) return;

    let result = await this.mfaService.FinishInitialSetup(
      this.formGroup.value.code!,
      this.qrData.Secret
    );

    if (!result) {
      alert("Code is not valid");
    }

    this.router.navigate(["dashboard"]);
  }
}
