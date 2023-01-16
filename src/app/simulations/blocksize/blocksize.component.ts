import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ContentLayoutMode, LayoutService} from 'src/app/pages';
import {calculateUnit, UnitOfSize} from 'src/app/shared/helpers/size';
import {calculateTime} from 'src/app/shared/helpers/time';
import {BlockSizeService} from './simulation/blocksize.service';
import {BlockData, Interval} from './simulation/types';
import {Observable} from "rxjs";

@Component({
  selector: 'app-blocksize',
  templateUrl: './blocksize.component.html',
  styleUrls: ['./blocksize.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlocksizeComponent implements OnInit, OnDestroy {
  blocks: BlockData[];
  spaceInBytes: number = 1_000_000_000_000;
  isHandset$: Observable<boolean>;

  constructor(private blockSizeService: BlockSizeService,
              private layout: LayoutService) {
    this.blocks = this.createBlocks();
    this.isHandset$ = layout.isHandset;
  }

  ngOnInit(): void {
    this.layout.setLayoutMode(ContentLayoutMode.LockImage);
    this.layout.isSimulation = true;
  }

  ngOnDestroy(): void {
    this.layout.isSimulation = false;
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
      amountOfBlocks: this.blockSizeService.blocksPer(amountOfTime, interval),
      blockSize: this.calculateSize(this.blockSizeService.blockSizeInBytesPer(amountOfTime, interval))
    }
  }

  get blockTime(): number {
    return this.blockSizeService.blockTimeInSeconds;
  }

  set blockTime(value: number) {
    this.blockSizeService.blockTimeInSeconds = value;
    this.blocks = this.createBlocks();
  }

  get blockSize(): number {
    return this.blockSizeService.size.smallesUnits;
  }

  set blockSize(value: number) {
    this.blockSizeService.size.smallesUnits = value;
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
    return calculateUnit(size, UnitOfSize.bytes).toText();
  }

  calculateTime(seconds: number): string {
    return calculateTime(seconds);
  }
}
