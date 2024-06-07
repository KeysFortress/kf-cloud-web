import { Component } from "@angular/core";
import { ProfileExpandableComponent } from "../profile-expandable/profile-expandable.component";
import { TopNavComponent } from "../top-nav/top-nav.component";
import { UtilsService } from "../../../helpers/utils.service";

@Component({
  selector: "app-navigation",
  standalone: true,
  templateUrl: "./navigation.component.html",
  styleUrl: "./navigation.component.css",
  imports: [ProfileExpandableComponent, TopNavComponent],
})
export class NavigationComponent {
  /**
   *
   */
  constructor(public utils: UtilsService) {}
}
