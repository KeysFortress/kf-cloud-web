import { Component } from "@angular/core";
import { CodeInputModule } from "angular-code-input";

@Component({
  selector: "app-mfa",
  standalone: true,

  imports: [CodeInputModule],
  templateUrl: "./mfa.component.html",
  styleUrl: "./mfa.component.css",
})
export class MfaComponent {
  wrongCode: boolean = false;

  // this called every time when user changed the code
  onCodeChanged(code: string) {}

  // this called only if user entered full code
  onCodeCompleted(code: string) {}

  onSubmit() {}
}
