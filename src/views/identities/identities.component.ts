import { ServerKeyType } from "./../../../models/key-type";
import { Component, Input } from "@angular/core";
import { NavigationComponent } from "../../components/navigation/navigation.component";
import { TopNavComponent } from "../../components/top-nav/top-nav.component";
import { CardComponent } from "../../components/card/card.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Identity } from "../../../models/identity";
import { UtilsService } from "../../../helpers/utils.service";
import { Router } from "@angular/router";
import { IdentityService } from "../../../services/identity.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-identities",
  standalone: true,
  imports: [
    NavigationComponent,
    TopNavComponent,
    CommonModule,
    CardComponent,
    LoaderComponent,
    ReactiveFormsModule,
  ],
  templateUrl: "./identities.component.html",
  styleUrl: "./identities.component.css",
})
export class IdentitiesComponent {
  identities: Identity[] = [];
  selectedIdentity?: Identity;
  regenerateKeys: boolean = false;

  keySizes: number[] = [1024, 2048, 4096];
  keyTypes: ServerKeyType[] = [];
  keyType?: ServerKeyType;

  formGroup = new FormGroup({
    name: new FormControl(""),
    keyType: new FormControl<ServerKeyType | null>(null),
    keySize: new FormControl<number | null>(null),
  });

  constructor(
    public utils: UtilsService,
    private router: Router,
    private identityService: IdentityService
  ) {}

  ngOnInit() {
    this.identityService.all().then((value) => {
      this.identities = value;
    });

    this.identityService.types().then((value) => {
      this.keyTypes = value;
      this.keyType = value[0];
      this.formGroup.patchValue({ keyType: this.keyType });
    });
  }

  onEditPressed(identity: Identity) {
    this.selectedIdentity = identity;

    this.formGroup.patchValue({
      name: identity.Name,
      keyType: this.keyTypes.find((key) => key.Name === identity.KeyType),
      keySize: identity.KeySize,
    });
  }

  async onDeletePressed(id: string): Promise<boolean> {
    let result = await this.identityService.remove(id);
    if (!result) return false;

    this.identities = this.identities.filter((identity) => identity.Id !== id);
    return true;
  }

  async onSubmit(): Promise<boolean> {
    if (!this.validate()) return false;

    if (this.selectedIdentity != null) return this.onEdit();

    let result = await this.identityService.add({
      Name: this.formGroup.value.name!,
      KeyType: this.formGroup.value.keyType!.Id,
      KeySize: this.formGroup.value.keySize!,
    });

    this.identities.push({
      CreatedAt: new Date(),
      UpdatedAt: undefined,
      Id: result.Id,
      KeySize: this.formGroup.value.keySize!,
      KeyType: this.formGroup.value.keyType!.Name,
      Name: this.formGroup.value.name!,
      PublicKey: result.PublicKey,
      PrivateKey: result.PrivateKey,
    });

    this.resetForm();
    return true;
  }

  async onEdit(): Promise<boolean> {
    if (this.selectedIdentity?.KeyType != this.formGroup.value.keyType?.Name) {
      this.regenerateKeys = true;
    }

    let result = await this.identityService.update({
      Id: this.selectedIdentity!.Id,
      KeySize: this.formGroup.value.keySize!,
      KeyType: this.formGroup.value.keyType!.Id,
      Name: this.formGroup.value.name!,
      RegenerateKey: this.regenerateKeys,
    });

    if (!result.State) return false;

    let updatedIdentity = this.identities.find(
      (x) => x.Id === this.selectedIdentity!.Id
    )!;
    updatedIdentity.Name = this.formGroup.value.name!;
    updatedIdentity.KeySize = this.formGroup.value.keySize!;
    updatedIdentity.KeyType = this.formGroup.value.keyType!.Name;
    updatedIdentity.PublicKey = result.PublicKey;
    updatedIdentity.PrivateKey = result.PrivateKey;

    this.resetForm();
    return true;
  }

  validate(): boolean {
    if (!this.formGroup.value.name) return false;
    if (!this.formGroup.value.keyType) return false;
    if (this.keyType?.HasSize && !this.formGroup.value.keySize) return false;

    return true;
  }

  resetForm() {
    this.formGroup.reset({
      name: "",
      keyType: this.keyTypes[0],
      keySize: this.keyType?.HasSize ? this.keySizes[0] : null,
    });
    this.keyType = this.keyTypes[0];
    this.selectedIdentity = undefined;
  }

  updateKeyType() {
    if (this.keyType?.HasSize) {
      this.formGroup.patchValue({ keySize: this.keySizes[0] });
    } else {
      this.formGroup.patchValue({ keySize: null });
    }
  }
}
