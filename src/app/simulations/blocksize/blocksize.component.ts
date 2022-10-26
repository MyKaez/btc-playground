import { Component, OnInit } from '@angular/core';
import { calculateSize } from 'src/app/shared/helpers/size';
import { calculateTime } from 'src/app/shared/helpers/time';
import { BlockSizeService } from './simulation/blocksize.service';
import { BlockData, Interval } from './simulation/types';

@Component({
  selector: 'app-blocksize',
  templateUrl: './blocksize.component.html',
  styleUrls: ['./blocksize.component.scss']
})
export class BlocksizeComponent implements OnInit {
  blocks: BlockData[];
  spaceInBytes: number = 1_000_000_000_000;

  constructor(private blocksizeService: BlockSizeService) {
    this.blocks = this.createBlocks();
  }

  ngOnInit(): void {
  }

  private createBlocks(): BlockData[] {
    return [
      this.createBlockData(1, Interval.hour),
      this.createBlockData(1, Interval.day),
      this.createBlockData(1, Interval.week),
      this.createBlockData(1, Interval.year),
      this.createBlockData(1, Interval.decade),
    ];
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

  set blockTime(value: number) {
    this.blocksizeService.blockTimeInSeconds = value;
    this.blocks = this.createBlocks();
  }

  get blockSize(): number {
    return this.blocksizeService.blockSizeInBytes;
  }

  set blockSize(value: number) {
    this.blocksizeService.blockSizeInBytes = value;
    this.blocks = this.createBlocks();
  }

  get space(): string {
    return this.calculateSize(this.spaceInBytes);
  }

  get outOfSpaceTime(): string {
    let duration = this.spaceInBytes / this.blockSize * this.blockTime;
    return this.calculateTime(duration);
  }

  calculateSize(size: number): string {
    return calculateSize(size);
  }

  calculateTime(seconds: number): string {
    return calculateTime(seconds);
  }
}
