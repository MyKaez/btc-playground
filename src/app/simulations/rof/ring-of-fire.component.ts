import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ContentLayoutMode, LayoutService } from 'src/app/pages';

@Component({
    selector: 'ring-of-fire',
    templateUrl: 'ring-of-fire.component.html',
    styleUrls: ['./ring-of-fire.component.scss']
})

export class RingOfFireComponent implements OnInit {

    contentLayoutMode = ContentLayoutMode.LockImage;
    isHandset$: Observable<boolean>;
    constructor(private layout: LayoutService) {
      this.isHandset$ = layout.isHandset$;
    }

    
    nodeCount = new FormControl(3);
    formGroup = new FormGroup({
        nodeCount: this.nodeCount
    });

    ngOnInit() {
        this.layout.setLayoutMode(ContentLayoutMode.LockImage);
    }
}