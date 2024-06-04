import { Component } from "@angular/core";
import { AuthenticationService } from "../../../services/authentication_service";
import { Router } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  title = "keyfortress";
  showFiller = false;
  isRegister = false;
  _authService: AuthenticationService;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    this._authService = authService;
  }

  formGroup = new FormGroup({
    email: new FormControl(""),
  });

  onLoginBegin() {
    var email = this.formGroup.value.email;
    console.log(email);
    let request = this._authService.beginLogin(email as string);
    request.subscribe((data) => {
      this.router.navigate(["connect"], { queryParams: data });
    });
  }
}
