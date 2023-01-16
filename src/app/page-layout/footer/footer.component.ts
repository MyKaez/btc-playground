import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { LayoutService } from 'src/app/pages';
import { ThemeEditorComponent } from 'src/app/shared/personal';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  get isShown(): boolean {
    return !this.layout.isHandset || !this.layout.isSimulation
  }

  constructor(public dialog: MatDialog, public layout: LayoutService) { }

  ngOnInit(): void {
  }


  openThemeEditor() {
    this.dialog.open(ThemeEditorComponent);
  }
}
