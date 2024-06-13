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

  onNavToggled() {
    console.log("Click");
    if (
      document
        .querySelector(".pc-sidebar")!
        .classList.contains("pc-sidebar-hide")
    ) {
      document
        .querySelector(".pc-sidebar")!
        .classList.remove("pc-sidebar-hide");
      var selector = document.querySelector(".pc-container-removed")!;
      selector.classList.add("pc-container");
      selector.classList.remove("pc-container-removed");
    } else {
      document.querySelector(".pc-sidebar")!.classList.add("pc-sidebar-hide");
      var selector = document.querySelector(".pc-container")!;
      selector.classList.add("pc-container-removed");
      selector.classList.remove("pc-container");
    }

    if (!!document.querySelector(".trig-drp-search")) {
      const search_drp: any = document.querySelector(".trig-drp-search");
      search_drp.addEventListener("shown.bs.dropdown", () => {
        var doc: any = document.querySelector(".drp-search input");
        doc.focus();
      });
    }
  }
}
