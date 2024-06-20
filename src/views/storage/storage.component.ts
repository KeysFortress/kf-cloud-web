import { StorageItem } from "./../../../models/storage-item";
import { Component } from "@angular/core";
import { NavigationComponent } from "../../components/navigation/navigation.component";
import { TopNavComponent } from "../../components/top-nav/top-nav.component";
import { CardComponent } from "../../components/card/card.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { StorageService } from "../../../services/storage.service";
import { UtilsService } from "../../../helpers/utils.service";
import { last } from "rxjs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FileDragNDropDirective } from "../../../services/file-drop-service";

@Component({
  selector: "app-storage",
  standalone: true,
  imports: [
    NavigationComponent,
    TopNavComponent,
    CardComponent,
    LoaderComponent,
    ReactiveFormsModule,
    FileDragNDropDirective,
  ],
  templateUrl: "./storage.component.html",
  styleUrl: "./storage.component.css",
})
export class StorageComponent {
  storageItems: StorageItem[] = [];
  selected: string = "";
  selectedItem?: StorageItem;
  lastOpenFolder: string = "";
  loaderActive: boolean = false;
  totalItems: number = 0;
  totalConsumed: number = 0;
  totalStorage: number = 0;

  formGroup = new FormGroup({
    name: new FormControl(""),
  });
  dragAreaClass: any;

  /**
   *
   */
  constructor(
    public utils: UtilsService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.loaderActive = true;
    this.storageService.get("").then((x) => {
      this.storageItems = x;
      this.loaderActive = false;
    });
  }

  select(storageItem: StorageItem) {
    this.selected = storageItem.Name;
    this.selectedItem = storageItem;
    this.formGroup.setValue({
      name: this.selectedItem!.Name,
    });
  }

  async open() {
    if (this.selectedItem != null && this.selectedItem.IsDirectory) {
      this.storageItems = await this.storageService.getDirectory(
        this.selectedItem.AbsolutePath
      );
      this.lastOpenFolder = this.selectedItem.AbsolutePath;
    }

    //TODO Download the file otherwise.

    console.log("presed");
  }

  async Goto(item: string) {
    let prevLink = "";
    let result = this.lastOpenFolder.split("/");
    for (var current in result) {
      if (result[current] == item) {
        prevLink += result[current] + "/";
        break;
      }
      prevLink += result[current] + "/";
    }
    this.loaderActive = true;
    this.storageItems = await this.storageService.getDirectory(prevLink);
    this.lastOpenFolder = prevLink;
    this.loaderActive = false;
  }

  shareItem(item: StorageItem[]) {
    throw new Error("Method not implemented.");
  }

  async onDeleteItem(item: StorageItem) {
    let result = await this.storageService.delete(item.AbsolutePath);
  }

  editItem(item: StorageItem) {}

  async onFilesDropped(event: File[]) {
    let result = await this.storageService.upload(event, this.lastOpenFolder);
    if (!result) alert("upload failed");

    this.loaderActive = true;
    this.storageItems = await this.storageService.getDirectory(
      this.lastOpenFolder
    );
    this.lastOpenFolder = this.lastOpenFolder;
    this.loaderActive = false;
  }
  async downloadItem(item: StorageItem) {
    await this.storageService.download(item.AbsolutePath, item.Name);
  }
}
