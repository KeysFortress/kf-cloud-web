import { Component } from "@angular/core";
import { NavigationComponent } from "../../components/navigation/navigation.component";
import { TopNavComponent } from "../../components/top-nav/top-nav.component";
import { CardComponent } from "../../components/card/card.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { Router } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Password } from "../../../models/password";
import { UtilsService } from "../../../helpers/utils.service";
import { PasswordService } from "../../../services/password-service.service";

@Component({
  selector: "app-passwords",
  standalone: true,
  imports: [
    NavigationComponent,
    TopNavComponent,
    CardComponent,
    LoaderComponent,
    ReactiveFormsModule,
  ],
  templateUrl: "./passwords.component.html",
  styleUrl: "./passwords.component.css",
})
export class PasswordsComponent {
  _isEdit: boolean = false;
  passwords: Password[] = [];
  _password?: Password;

  generatedPassword?: string;
  passwordLength: number = 16;

  upperCase: boolean = true;
  lowerCase: boolean = true;
  unique: boolean = true;
  requireDigits: boolean = true;
  specialCharacters: boolean = true;

  formGroup = new FormGroup({
    email: new FormControl(""),
    website: new FormControl(""),
    passwordLength: new FormControl(""),
  });

  constructor(
    private router: Router,
    private passwordService: PasswordService,
    public utils: UtilsService
  ) {}

  ngOnInit() {
    this.passwordService.all().then((value) => {
      this.passwords = value;
    });
  }

  async onSliderChanged() {
    await this.getNewPassword();
  }

  async onEditPassword(password: Password) {
    this.generatedPassword = await this.passwordService.passwordContent(
      password.Id
    );
    this._isEdit = true;
    this._password = password;
    this.passwordLength = this._password.Password;
    this.formGroup.setValue({
      email: this._password.Email,
      website: this._password.Website,
      passwordLength: this.passwords.length.toString(),
    });
  }

  async onSave(): Promise<boolean> {
    if (this._isEdit) return await this.updateRecord();

    var email = this.formGroup.value.email;
    var website = this.formGroup.value.website;

    if (!this.validate()) {
      return false;
    }

    let result = await this.passwordService.add(
      email!,
      website!,
      this.generatedPassword!,
      this.upperCase,
      this.lowerCase,
      this.unique,
      this.requireDigits,
      this.specialCharacters
    );

    this.passwords.push(result);
    this.resetFormData();
    return true;
  }

  async updateRecord(): Promise<boolean> {
    if (this._password == null) return false;

    let email = this.formGroup.value.email;
    let website = this.formGroup.value.website;

    let result = await this.passwordService.update({
      Id: this._password.Id!,
      Email: email!,
      Password: this.generatedPassword!,
      Website: website!,
    });

    if (!result) return false;

    let index = this.passwords.indexOf(this._password);
    this.passwords[index] = {
      CreatedAt: this._password.CreatedAt,
      Email: email!,
      Password: this.generatedPassword!.length,
      UpdatedAt: new Date(),
      Website: website!,
      Id: this._password.Id,
    };
    this.resetFormData();
    return result;
  }

  async onDeletePassword(id: string) {
    let deleted = await this.passwordService.delete(id);
    if (!deleted) return;

    let mutated = this.passwords.filter((value) => value.Id != id);
    this.passwords = mutated;

    //We clear the form values in case when deleting the current record we had it previously selected
    if (this._password != undefined && id == this._password?.Id) {
      this.resetFormData();
    }
  }

  validate(): boolean {
    if (this.formGroup.value.email == null) return false;
    if (this.formGroup.value.website == null) return false;
    if (this.generatedPassword == null) return false;
    return true;
  }

  async getNewPassword() {
    this.generatedPassword = await this.passwordService.NewPassword(
      Number.parseInt(this.formGroup.value.passwordLength!),
      this.upperCase,
      this.lowerCase,
      this.unique,
      this.requireDigits,
      this.specialCharacters
    );
  }

  onSpecialChanged() {
    this.specialCharacters = !this.specialCharacters;
  }

  onUpperChanged() {
    this.upperCase = !this.upperCase;
  }

  onLowerChanged() {
    this.lowerCase = !this.lowerCase;
  }

  onDigitsChanged() {
    this.requireDigits = !this.requireDigits;
  }

  onUniqueChanged() {
    this.unique = !this.unique;
  }

  resetFormData() {
    this._password = undefined;
    this.formGroup.setValue({
      email: "",
      website: "",
      passwordLength: "",
    });
    this.generatedPassword = undefined;
    this.upperCase = true;
    this.lowerCase = true;
    this.unique = true;
    this.specialCharacters = true;
    this.requireDigits = true;
    this.passwordLength = 16;
  }
}
