import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from "@angular/core";

@Directive({
  selector: "[appFileDragNDrop]",
  standalone: true, // Declare the directive as standalone
})
export class FileDragNDropDirective {
  @Output() filesChangeEmitter: EventEmitter<File[]> = new EventEmitter();

  @HostBinding("style.background") private background = "";
  @HostBinding("style.border") private borderStyle = "";
  @HostBinding("style.border-color") private borderColor = "";
  @HostBinding("style.border-radius") private borderRadius = "";

  constructor() {}

  @HostListener("dragover", ["$event"]) public onDragOver(evt: any) {
    console.log("Drag over event triggered");
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "lightgray";
    this.borderColor = "cadetblue";
    this.borderStyle = "3px solid";
  }

  @HostListener("dragleave", ["$event"]) public onDragLeave(evt: any) {
    console.log("Drag leave event triggered");
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "";
    this.borderColor = "";
    this.borderStyle = "";
  }

  @HostListener("drop", ["$event"]) public onDrop(evt: any) {
    console.log("Drop event triggered");
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "";
    this.borderColor = "";
    this.borderStyle = "";

    const files = evt.dataTransfer.files;
    const validFiles: Array<File> = Array.from(files);
    this.filesChangeEmitter.emit(validFiles);
  }
}
