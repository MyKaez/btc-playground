import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-session-join-formular',
  templateUrl: './session-join-formular.component.html',
  styleUrls: ['./session-join-formular.component.scss']
})
export class SessionJoinFormularComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  scan() {
  }
}
