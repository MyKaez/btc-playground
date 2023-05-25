import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import QrScanner from 'qr-scanner'

@Component({
  selector: 'app-session-join-formular',
  templateUrl: './session-join-formular.component.html',
  styleUrls: ['./session-join-formular.component.scss']
})
export class SessionJoinFormularComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<SessionJoinFormularComponent>, private elementRef: ElementRef) { }
  
  sessionIdControl = new FormControl("", [Validators.required]);

  ngOnInit(): void {
  }

  scan() {
    const videoElement = this.elementRef.nativeElement.querySelector("video");
    const qrScanner = new QrScanner(
      videoElement,
      result => {
        if(!result?.data) return;

        qrScanner.stop();
        this.sessionIdControl.setValue(result.data);
      }, { }
    );

    qrScanner.start();
  }

  join() {
    this.dialogRef.close(this.sessionIdControl.value);
  }
}
