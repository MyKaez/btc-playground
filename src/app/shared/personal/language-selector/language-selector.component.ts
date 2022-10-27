import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {
  languages: LanguageOption[] = [];
  selectedLanguage: string = "";

  constructor() { }

  ngOnInit(): void {
    this.languages = this.getLanguages();
    this.selectedLanguage = this.languages.find(l => l.short === "DE")?.short!;
  }

  private getLanguages(): LanguageOption[] {
    return [{
      language: "English",
      short: "EN"
    }, {      
      language: "Deutsch",
      short: "DE"
    }];
  }
}

export interface LanguageOption {
  language: string;
  short: string;
}