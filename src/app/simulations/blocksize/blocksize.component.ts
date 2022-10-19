import { Component, OnInit } from '@angular/core';
import { BlockSizeService } from './simulation/blocksize.service';

@Component({
  selector: 'app-blocksize',
  templateUrl: './blocksize.component.html',
  styleUrls: ['./blocksize.component.scss']
})
export class BlocksizeComponent implements OnInit {

  constructor(private blocksizeService: BlockSizeService) { }

  ngOnInit(): void {
  }

}
