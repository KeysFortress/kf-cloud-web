import { Router, Routes } from "@angular/router";
import { PasswordsComponent } from "../views/passwords/passwords.component";
import { DashboardComponent } from "../views/dashboard/dashboard.component";
import { SecretsComponent } from "../views/secrets/secrets.component";
import { IdentitiesComponent } from "../views/identities/identities.component";
import { TotpComponent } from "../views/totp/totp.component";
import { SetupComponent } from "../views/setup/setup.component";
import { SetupMfaComponent } from "../views/setup-mfa/setup-mfa.component";
import { LoginComponent } from "../views/login/login.component";
import { ConnectComponent } from "../views/connect/connect.component";
import { MfaComponent } from "../views/mfa/mfa.component";
import { inject } from "@angular/core";
import { SetupService } from "../../services/setup.service";
import { AuthenticationService } from "../../services/authentication_service";

export const routes: Routes = [
  {
    path: "passwords",
    component: PasswordsComponent,
  },
  {
    path: "dashboard",
    component: DashboardComponent,
  },
  {
    path: "secrets",
    component: SecretsComponent,
  },
  {
    path: "identities",
    component: IdentitiesComponent,
  },
  {
    path: "totp",
    component: TotpComponent,
  },
  {
    path: "",
    component: SetupComponent,
  },
  {
    path: "setup-mfa",
    component: SetupMfaComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "connect",
    component: ConnectComponent,
  },
  {
    path: "mfa",
    component: MfaComponent,
  },
];

function mfaAuthenticationGuard(): boolean {
  let authService = inject(AuthenticationService);
  let router = inject(Router);
  var loggedIn = authService.mfaTokenPresent();

  if (!loggedIn) {
    return true;
  }

  return true;
}

function authenticationGuard(): boolean {
  let authService = inject(AuthenticationService);
  let router = inject(Router);
  var loggedIn = authService.mfaTokenPresent();
  if (!loggedIn) {
    // router.navigateByUrl("");
    return true;
  }

  return true;
}

async function setupGuard(): Promise<boolean> {
  let setupService = inject(SetupService);
  let isEmpty = await setupService.isConfigured();

  return true;
}
