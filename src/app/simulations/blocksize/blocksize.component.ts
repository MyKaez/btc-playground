import { Component, OnInit } from '@angular/core';
import { calculateSize } from 'src/app/shared/helpers/size';
import { BlockSizeService } from './simulation/blocksize.service';
import { Interval } from './simulation/types';

@Component({
  selector: 'app-blocksize',
  templateUrl: './blocksize.component.html',
  styleUrls: ['./blocksize.component.scss']
})
export class BlocksizeComponent implements OnInit {
  blocksPerHour: number;
  blocksPerDay: number;
  blocksPerWeek: number;
  blocksPerYear: number;
  blockSizePerHour: string;
  blockSizePerDay: string;
  blockSizePerWeek: string;
  blockSizePerYear: string;

  constructor(private blocksizeService: BlockSizeService) {
    this.blocksPerHour = this.blocksizeService.blocksPer(1, Interval.Hour);
    this.blocksPerDay = this.blocksizeService.blocksPer(1, Interval.Day);
    this.blocksPerWeek = this.blocksizeService.blocksPer(1, Interval.Week);
    this.blocksPerYear = this.blocksizeService.blocksPer(1, Interval.Year);
    this.blockSizePerHour = this.calculateSize(this.blocksizeService.blockSizeInBytesPer(1, Interval.Hour));
    this.blockSizePerDay = this.calculateSize(this.blocksizeService.blockSizeInBytesPer(1, Interval.Day));
    this.blockSizePerWeek = this.calculateSize(this.blocksizeService.blockSizeInBytesPer(1, Interval.Week));
    this.blockSizePerYear = this.calculateSize(this.blocksizeService.blockSizeInBytesPer(1, Interval.Year));
  }

  ngOnInit(): void {
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

  calculateSize(bytes: number): string {
    return calculateSize(bytes);
  }
}
