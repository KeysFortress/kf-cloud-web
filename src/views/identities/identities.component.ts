import { Component } from "@angular/core";
import { NavigationComponent } from "../../components/navigation/navigation.component";
import { TopNavComponent } from "../../components/top-nav/top-nav.component";
import { CardComponent } from "../../components/card/card.component";
import { LoaderComponent } from "../../components/loader/loader.component";

@Component({
  selector: "app-identities",
  standalone: true,
  imports: [
    NavigationComponent,
    TopNavComponent,
    CardComponent,
    LoaderComponent,
  ],
  templateUrl: "./identities.component.html",
  styleUrl: "./identities.component.css",
})
export class IdentitiesComponent {}
