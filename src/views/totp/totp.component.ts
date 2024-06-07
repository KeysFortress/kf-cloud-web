import { Component } from "@angular/core";
import { NavigationComponent } from "../../components/navigation/navigation.component";
import { TopNavComponent } from "../../components/top-nav/top-nav.component";
import { CardComponent } from "../../components/card/card.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TimeBasedPassword } from "../../../models/time-based-password";
import { CodeTypes } from "../../../dtos/code_types";
import { Algorithm } from "../../../models/algorithms";
import { UtilsService } from "../../../helpers/utils.service";
import { TotpService } from "../../../services/totp.service";
import { CommonModule } from "@angular/common";
@Component({
  selector: "app-totp",
  standalone: true,
  imports: [
    NavigationComponent,
    TopNavComponent,
    CardComponent,
    CommonModule,
    LoaderComponent,
    ReactiveFormsModule,
  ],
  templateUrl: "./totp.component.html",
  styleUrl: "./totp.component.css",
})
export class TotpComponent {
  timebasedCodes: TimeBasedPassword[] = [];
  lengths: number[] = [15, 30, 60];
  codeTypes: CodeTypes[] = [];
  algorithms: Algorithm[] = [];

  activeCode?: string;
  selectedTimebasedPassword?: TimeBasedPassword;

  formGroup = new FormGroup({
    email: new FormControl(""),
    website: new FormControl(""),
    secret: new FormControl(""),
    lenght: new FormControl(this.lengths[0]),
    codeType: new FormControl(this.codeTypes[0]),
    algorithm: new FormControl(this.algorithms[0]),
  });

  constructor(public utils: UtilsService, private totpService: TotpService) {}

  ngOnInit() {
    this.totpService.all().then((value) => {
      this.timebasedCodes = value;
      this.timebasedCodes.forEach((x) => {
        setInterval(() => this.onCodeExpired(x), x.Validity * 1000);
        this.onCodeExpired(x);
      });
    });

    this.totpService.getCodeTypes().then((value) => {
      this.codeTypes = value;
    });

    this.totpService.getAlgorithms().then((value) => {
      this.algorithms = value;
    });
  }

  async onEditTimePassword(timePassword: TimeBasedPassword) {
    this.selectedTimebasedPassword = timePassword;
    var secret = await this.totpService.getSecret(
      this.selectedTimebasedPassword.Id
    );

    let codeType = this.codeTypes.find((e) => e.Name == timePassword.Type);
    let algorithm = this.algorithms.find(
      (e) => e.Name == timePassword.Algorithm
    );
    this.formGroup.setValue({
      email: this.selectedTimebasedPassword.Email,
      secret: secret,
      website: this.selectedTimebasedPassword.Website,
      lenght: timePassword.Validity,
      codeType: codeType!,
      algorithm: algorithm!,
    });

    this.activeCode = this.selectedTimebasedPassword.Code;
    let type = this.codeTypes.filter(
      (value) => value.Name == this.selectedTimebasedPassword!.Type
    );
  }

  async onRemoveTimePassword(id: string) {
    var deleted = await this.totpService.delete(id);

    if (!deleted) return;

    if (
      this.selectedTimebasedPassword != null &&
      this.selectedTimebasedPassword.Id == id
    ) {
      this.resetForm();
    }

    let filtered = this.timebasedCodes.filter((value) => value.Id != id);
    this.timebasedCodes = filtered;
  }

  async onSubmit(): Promise<boolean> {
    if (!this.validate()) return false;

    if (this.selectedTimebasedPassword != null) return this.onEdit();

    let response = await this.totpService.add({
      Email: this.formGroup.value.email!,
      Website: this.formGroup.value.website!,
      Secret: this.formGroup.value.secret!,
      Type: this.formGroup.value.codeType!.Id,
      Validity: this.formGroup.value.lenght!,
      Algorithm: this.formGroup.value.algorithm!.Id,
    });

    if (response == "") return false;
    let length = this.formGroup.value.secret!.length;
    let timePassword = {
      Id: response,
      Email: this.formGroup.value.email!,
      Website: this.formGroup.value.website!,
      Secret: length,
      Type: this.formGroup.value.codeType!.Id,
      Validity: this.formGroup.value.lenght,
      CreatedAt: new Date(),
      UpdatedAt: undefined,
      Code: "--",
    };

    if (this.timebasedCodes == null) this.timebasedCodes = [];

    this.timebasedCodes.push({
      Id: response,
      CreatedAt: new Date(),
      Email: this.formGroup.value.email!,
      Website: this.formGroup.value.website!,
      Secret: length,
      Type: this.formGroup.value.codeType!.Name,
      Validity: this.formGroup.value.lenght!,
      Code: "123 323",
      UpdatedAt: undefined,
      Algorithm: this.formGroup.value.algorithm!.Name,
    });

    this.resetForm();
    return true;
  }

  async onEdit(): Promise<boolean> {
    let response = await this.totpService.update({
      Id: this.selectedTimebasedPassword!.Id,
      Email: this.formGroup.value.email!,
      Website: this.formGroup.value.website!,
      Secret: this.formGroup.value.secret!,
      Type: this.formGroup.value.codeType!.Id,
      Validity: this.formGroup.value.lenght!,
      Algorithm: this.formGroup.value.algorithm!.Id,
    });

    if (!response) return false;

    let index = this.timebasedCodes.indexOf(this.selectedTimebasedPassword!);
    this.timebasedCodes[index] = {
      CreatedAt: this.selectedTimebasedPassword!.CreatedAt,
      Email: this.formGroup.value.email!,
      Code: "123 324",
      UpdatedAt: new Date(),
      Website: this.formGroup.value.website!,
      Secret: this.formGroup.value.secret!.length,
      Id: this.selectedTimebasedPassword!.Id,
      Type: this.formGroup.value.codeType!.Name,
      Validity: this.formGroup.value.lenght!,
      Algorithm: this.formGroup.value.algorithm!.Name,
    };
    this.resetForm();
    return true;
  }

  validate(): boolean {
    if (this.formGroup.value.email == null) return false;
    if (this.formGroup.value.website == null) return false;
    if (this.formGroup.value.secret == null) return false;

    return true;
  }

  resetForm() {
    this.formGroup.setValue({
      email: "",
      secret: "",
      website: "",
      lenght: this.lengths[0],
      codeType: this.codeTypes[0],
      algorithm: this.algorithms[0],
    });

    this.selectedTimebasedPassword = undefined;
  }

  async onCodeExpired(timePassword: TimeBasedPassword): Promise<void> {
    let code = await this.totpService.getCode(timePassword.Id);
    if (this.selectedTimebasedPassword == timePassword) {
      this.activeCode = code;
    }
    this.timebasedCodes.find((x) => x.Id == timePassword.Id)!.Code = code;
  }
}
