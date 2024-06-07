import { Component } from "@angular/core";

@Component({
  selector: "app-loader",
  standalone: true,
  imports: [],
  templateUrl: "./loader.component.html",
  styleUrl: "./loader.component.css",
})
export class LoaderComponent {
  /**
   *
   */
  constructor() {}

  ngOnInit() {
    // remove pre-loader start
    const elem: any = document.getElementById("loader");
    if (!elem) return;

    elem.fadeOut = function (timing: number) {
      let newValue = 1;
      elem.style.opacity = "1";
      elem.fadeOutInterval = window.setInterval(function () {
        if (newValue > 0) {
          newValue -= 0.01;
        } else {
          elem.style.opacity = "0";
          elem.style.display = "none";
          if (elem.fadeOutInterval !== undefined) {
            clearInterval(elem.fadeOutInterval);
          }
        }
        elem.style.opacity = newValue.toString();
      }, timing);
    };
    elem.fadeOut(1.5);
    setTimeout(function () {}, 2000);
  }
}
