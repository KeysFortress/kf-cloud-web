import { StorageItem } from "./../../../models/storage-item";
import { Component } from "@angular/core";
import { NavigationComponent } from "../../components/navigation/navigation.component";
import { TopNavComponent } from "../../components/top-nav/top-nav.component";
import { CardComponent } from "../../components/card/card.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { ReactiveFormsModule } from "@angular/forms";
import { StorageService } from "../../../services/storage.service";
import { UtilsService } from "../../../helpers/utils.service";
import { last } from "rxjs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "app-storage",
  standalone: true,
  imports: [
    NavigationComponent,
    TopNavComponent,
    CardComponent,
    LoaderComponent,
    ReactiveFormsModule,
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
}
