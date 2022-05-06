import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';

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

  public isExpanded = false;

  constructor(private dialog: MatDialog) {}

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

  public switchProfile() {;
    this.openDialog();
  }

  private openDialog() {    
    const dialogRef = this.dialog.open(ProfileDialogComponent);

    dialogRef.afterClosed().subscribe(
        data => this.switch.emit(data)
    );    
  }
}
