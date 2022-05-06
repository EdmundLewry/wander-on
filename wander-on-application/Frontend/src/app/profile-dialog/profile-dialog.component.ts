import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.css']
})
export class ProfileDialogComponent {

  public key: string = "";

  constructor(
    private dialogRef: MatDialogRef<ProfileDialogComponent>) {
  }

  public updateKey(event: any) {
    this.key = event.target.value;
    console.log(this.key);
  }

  public save() {
    this.dialogRef.close(this.key);
  }

  public close() {
    this.dialogRef.close();
  }
}
