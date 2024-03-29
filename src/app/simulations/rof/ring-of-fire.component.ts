import { Component, OnInit } from '@angular/core';
import { ContentLayoutMode, LayoutService } from 'src/app/pages';

@Component({
    selector: 'ring-of-fire',
    templateUrl: 'ring-of-fire.component.html'
})

export class RingOfFireComponent implements OnInit {
    constructor(private layout: LayoutService) { }

    ngOnInit() {
        this.layout.setLayoutMode(ContentLayoutMode.LockImage);
    }
}