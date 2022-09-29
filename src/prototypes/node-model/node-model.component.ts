import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'node-model',
    templateUrl: 'node-model.component.html'
})

export class NodeModelComponent implements OnInit {    
    @Input("node-count")
    nodeCount = 3;


    constructor() { }

    ngOnInit() { }
}