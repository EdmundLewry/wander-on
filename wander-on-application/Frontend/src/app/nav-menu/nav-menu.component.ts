import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  @Output() print: EventEmitter<any> = new EventEmitter();
  @Output() add: EventEmitter<File> = new EventEmitter();

  isExpanded = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  printFeatures() {
    this.print.emit();
  }
  
  onFileSelected(event: any) {
    this.add.emit(event.target.files[0]);
  }
}
