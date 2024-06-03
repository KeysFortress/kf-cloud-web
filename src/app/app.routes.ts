import { Routes } from "@angular/router";
import { PasswordsComponent } from "../views/passwords/passwords.component";
import { DashboardComponent } from "../views/dashboard/dashboard.component";
import { SecretsComponent } from "../views/secrets/secrets.component";
import { IdentitiesComponent } from "../views/identities/identities.component";
import { TotpComponent } from "../views/totp/totp.component";

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
];
