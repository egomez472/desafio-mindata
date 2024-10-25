import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-abm-dialog',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './abm-dialog.component.html',
  styleUrl: './abm-dialog.component.scss'
})
export class AbmDialogComponent {

  private readonly dialogRef = inject(MatDialogRef<AbmDialogComponent>)

  confirm() {
    console.log('ejecuta confirm');

    this.dialogRef.close(true);
  }

  closeDilog() {
    this.dialogRef.close(false);
  }

}
