import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ErrorModalComponent>) {}

  ngOnInit(): void {}

  /**
   * Closes the modal
   */
     close() {
      this.dialogRef.close();
    }
}
