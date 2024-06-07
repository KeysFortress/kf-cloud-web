import { Component } from "@angular/core";
import { NavigationComponent } from "../../components/navigation/navigation.component";
import { TopNavComponent } from "../../components/top-nav/top-nav.component";
import { CardComponent } from "../../components/card/card.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Secret } from "../../../models/secret";
import { UtilsService } from "../../../helpers/utils.service";
import { Router } from "@angular/router";
import { SecretsService } from "../../../services/secrets.service";

@Component({
  selector: "app-secrets",
  standalone: true,
  imports: [
    NavigationComponent,
    TopNavComponent,
    CardComponent,
    LoaderComponent,
    ReactiveFormsModule,
  ],
  templateUrl: "./secrets.component.html",
  styleUrl: "./secrets.component.css",
})
export class SecretsComponent {
  secrets: Secret[] = [];
  selectedSecret?: Secret;

  formGroup = new FormGroup({
    email: new FormControl(""),
    website: new FormControl(""),
    secret: new FormControl(""),
  });

  constructor(
    public utils: UtilsService,
    private router: Router,
    private secretService: SecretsService
  ) {}

  ngOnInit() {
    this.secretService.all().then((value) => {
      this.secrets = value;
    });
  }

  async onDeleteSecret(id: string) {
    await this.secretService.delete(id);

    if (this.selectedSecret != null && this.selectedSecret?.Id == id) {
      this.resetFormData();
    }

    let filtered = this.secrets.filter((value) => value.Id != id);
    this.secrets = filtered;
  }

  async onEditSecret(incomingSecret: Secret) {
    this.selectedSecret = incomingSecret;
    var getContent = await this.secretService.getSecretContent(
      this.selectedSecret.Id
    );
    this.formGroup.setValue({
      email: this.selectedSecret.Email,
      website: this.selectedSecret.Website,
      secret: getContent,
    });
  }

  async onSubmit(): Promise<boolean> {
    if (!this.validate()) {
      return false;
    }

    if (this.selectedSecret != null)
      return this.updateSecret(this.selectedSecret);

    var dto = {
      Email: this.formGroup.value.email!,
      Website: this.formGroup.value.website!,
      Secret: this.formGroup.value.secret!,
    };

    let created = await this.secretService.add(dto);

    if (!created) return false;

    this.resetFormData();
    this.secrets.push({
      CreatedAt: new Date(),
      Email: dto.Email,
      Website: dto.Website,
      Secret: dto.Secret.length,
      Id: created,
      UpdatedAt: undefined,
    });

    return created != undefined;
  }

  validate(): boolean {
    if (this.formGroup.value.email == null) return false;
    if (this.formGroup.value.website == null) return false;
    if (this.formGroup.value.secret == null) return false;

    return true;
  }

  async updateSecret(Secret: Secret): Promise<boolean> {
    let email = this.formGroup.value.email!;
    let website = this.formGroup.value.website!;
    let secret = this.formGroup.value.secret!;
    let updated = await this.secretService.update({
      Id: Secret.Id,
      Email: email,
      Website: website,
      Secret: secret,
    });

    if (!updated) return false;

    this.resetFormData();
    let index = this.secrets.indexOf(this.selectedSecret!);
    this.secrets[index] = {
      CreatedAt: this.selectedSecret!.CreatedAt,
      Email: email!,
      Secret: secret.length,
      UpdatedAt: new Date(),
      Website: website!,
      Id: this.selectedSecret!.Id,
    };

    return true;
  }

  resetFormData() {
    this.formGroup.setValue({
      email: "",
      website: "",
      secret: "",
    });
  }
}
