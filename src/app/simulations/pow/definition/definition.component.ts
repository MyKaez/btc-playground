import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-pow-definition',
  templateUrl: './definition.component.html',
  styleUrls: ['./definition.component.scss']
})
export class DefinitionComponent implements OnInit {

  @Input()
  youtubeReference: string = '';

  constructor() { }

  get video(): string{
    return `https://www.youtube.com/embed/${this.youtubeReference}`;
  }

  ngOnInit(): void {
  }

}
