import { style } from '@angular/animations';
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

  changeColor(color: ThemeColor, colorValue: string) {
    console.log("Color changed", color, colorValue);
    this.applyThemeToUi(this.currentTheme);
  }

  private applyThemeToUi(theme: CssColorTheme) {
    let themeKey = "theme-editor-" + theme.title;
    let colorStyles = theme.colors.map(color => `--${color.key}: ${color.color}`);
    let cssRule = `.${themeKey} { ${colorStyles.join(";\r\n")} }`;

    let styleElement = document.getElementById(themeKey);
    if(!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = themeKey;
      document.head.appendChild(styleElement);
      document.body.classList.add(themeKey);
    }

    styleElement.innerText = cssRule;
  }

  private getStaticTheme(): CssColorTheme {
    let colors = this.getDefinedColors();
    colors.forEach(c => {
      let hashColor = getComputedStyle(document.body).getPropertyValue(`--${c.key}`);
      c.color = hashColor;
    });

    return {
      title: "static",
      colors: colors
    };
  }

  private getDefinedColors(): ThemeColor[] {
    return [{
      title: "Primär",
      key: "primary",
      color: ""
    },{
      title: "Akzent",
      key: "accent",
      color: ""
    },{
      title: "Hintergrund",
      key: "background-color",
      color: ""
    },{
      title: "Header",
      key: "header-color",
      color: ""
    },{
      title: "Footer",
      key: "footer-color",
      color: ""
    },{
      title: "Schrift",
      key: "font-color",
      color: ""
    }];
  }
}

export interface CssColorTheme {
  title: string;
  colors: ThemeColor[];
}

export interface ThemeColor {
  key: string;
  title: string;
  color: string;
}

/*@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
})
export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}*/