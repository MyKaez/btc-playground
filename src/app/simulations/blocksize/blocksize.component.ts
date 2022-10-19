import { Component, OnInit } from '@angular/core';
import { calculateSize } from 'src/app/shared/helpers/size';
import { BlockSizeService } from './simulation/blocksize.service';
import { BlockData, Interval } from './simulation/types';

@Component({
  selector: 'app-blocksize',
  templateUrl: './blocksize.component.html',
  styleUrls: ['./blocksize.component.scss']
})
export class BlocksizeComponent implements OnInit {

  blocks: BlockData[];

  constructor(private blocksizeService: BlockSizeService) {
    this.blocks = [
      this.createBlockData(1, Interval.hour),
      this.createBlockData(1, Interval.day),
      this.createBlockData(1, Interval.week),
      this.createBlockData(1, Interval.year),
      this.createBlockData(1, Interval.decade),
    ];
  }

  ngOnInit(): void {
  }

  createBlockData(amountOfTime: number, interval: Interval): BlockData {
    return {
      interval: interval.text,
      amountOfTime: amountOfTime,
      amountOfBlocks: this.blocksizeService.blocksPer(amountOfTime, interval),
      blockSize: this.calculateSize(this.blocksizeService.blockSizeInBytesPer(amountOfTime, interval))
    }
  }

  get blockTime(): number {
    return this.blocksizeService.blockTimeInSeconds;
  }

  get blockTimeInMinutes(): number {
    return this.blocksizeService.blockTimeInSeconds / 60;
  }

  get blockSize(): number {
    return this.blocksizeService.blockSizeInBytes;
  }

  calculateSize(size: number): string {
    return calculateSize(size);
  }
}
