import { Router, Routes } from "@angular/router";
import { PasswordsComponent } from "../views/passwords/passwords.component";
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
import { DashboardComponent } from "../views/dashboard/dashboard.component";

export const routes: Routes = [
  {
    path: "passwords",
    component: PasswordsComponent,
    canActivate: [() => authenticationGuard()],
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [() => authenticationGuard()],
  },
  {
    path: "secrets",
    component: SecretsComponent,
    canActivate: [() => authenticationGuard()],
  },
  {
    path: "identities",
    component: IdentitiesComponent,
    canActivate: [() => authenticationGuard()],
  },
  {
    path: "totp",
    component: TotpComponent,
    canActivate: [() => authenticationGuard()],
  },
  {
    path: "",
    component: SetupComponent,
  },
  {
    path: "setup-mfa",
    component: SetupMfaComponent,
    canActivate: [() => mfaAuthenticationGuard()],
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
    canActivate: [() => mfaAuthenticationGuard()],
  },
];

function mfaAuthenticationGuard(): boolean {
  let authService = inject(AuthenticationService);
  let router = inject(Router);
  var loggedIn = authService.mfaTokenPresent();

  if (!loggedIn) {
    router.navigate([""]);
    return false;
  }

  return true;
}

function authenticationGuard(): boolean {
  let authService = inject(AuthenticationService);
  let router = inject(Router);
  var loggedIn = authService.isLoggedIn();
  if (!loggedIn) {
    router.navigate([""]);

    return false;
  }

  return true;
}

async function setupGuard(): Promise<boolean> {
  let setupService = inject(SetupService);
  let isEmpty = await setupService.isConfigured();

  return true;
}
