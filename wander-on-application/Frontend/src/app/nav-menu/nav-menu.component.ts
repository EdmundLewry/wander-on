import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  @Output() print: EventEmitter<any> = new EventEmitter();
  @Output() add: EventEmitter<File> = new EventEmitter();
  @Output() switch: EventEmitter<string> = new EventEmitter();
  @Input() profiles: string[] = [];

  public profile = 0;
  public isExpanded = false;

  public collapse() {
    this.isExpanded = false;
  }

  public toggle() {
    this.isExpanded = !this.isExpanded;
  }

  public printFeatures() {
    this.print.emit();
  }
  
  public onFileSelected(event: any) {
    this.add.emit(event.target.files[0]);
  }

  public switchProfile() {
    this.profile = (this.profile + 1)%this.profiles.length;
    this.switch.emit(this.profiles[this.profile]);
  }
}
