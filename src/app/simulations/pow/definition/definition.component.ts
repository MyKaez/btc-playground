import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-pow-definition',
  templateUrl: './definition.component.html',
  styleUrls: ['../../definition.scss']
})
export class PowDefinitionComponent implements OnInit {

  @Input()
  youtubeReference: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
