import {Component, Input, OnInit} from '@angular/core';
import { WebHelper } from 'src/model/web';

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
    WebHelper.ensureYoutubeIframe();
  }

}
