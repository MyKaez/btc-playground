import { Color } from '@angular-material-components/color-picker';
import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-theme-editor',
  templateUrl: './theme-editor.component.html',
  styleUrls: ['./theme-editor.component.scss']
})
export class ThemeEditorComponent implements OnInit {
  currentTheme: CssColorTheme;
  themes: CssColorTheme[] = [];

  constructor() {
    this.currentTheme = this.getStaticTheme();
    console.log(this.currentTheme);
   }

  ngOnInit(): void {
  }

  private getStaticTheme(): CssColorTheme {
    let colors = this.getDefinedColors();
    colors.forEach(c => {
      let hashColor = getComputedStyle(document.body).getPropertyValue(`--${c.key}`);
      let computedColor = this.hexToRgb(hashColor);
      c.color = computedColor;
    });

    return {
      title: "static",
      colors: colors
    };
  }

  private getDefinedColors(): ThemeColor[] {
    return [{
      title: "Primär",
      key: "primary"
    },{
      title: "Akzent",
      key: "accent"
    },{
      title: "Hintergrund",
      key: "background-color"
    },{
      title: "Header",
      key: "header-color"
    },{
      title: "Footer",
      key: "footer-color"
    },{
      title: "Schrift",
      key: "font-color"
    }];
  }

  /* See: https://stackoverflow.com/questions/63157253/how-to-initialize-a-angular-material-components-color-picker-side-ts-with-stri */
  private hexToRgb(hex: string): Color | undefined {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let rgb = result && {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };

    return rgb ? new Color(rgb.r, rgb.g, rgb.b) : undefined;
  } 
}

export interface CssColorTheme {
  title: string;
  colors: ThemeColor[];
}

export interface ThemeColor {
  key: string;
  title: string;
  color?: Color;
}

/*@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
})
export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}*/