import { Component, Input } from '@angular/core';
import { filter, interval, map, of, shareReplay, takeUntil, takeWhile, tap } from 'rxjs';
import { SessionInfo } from 'src/app/models/session';
import { PowConfig } from 'src/app/simulations/pow/models/pow-config';

@Component({
  selector: 'app-hash-progress',
  templateUrl: './hash-progress.component.html',
  styleUrls: ['./hash-progress.component.scss']
})
export class HashProgressComponent {

  @Input('session') session!: SessionInfo;

  get pow(): PowConfig {
    return <PowConfig>this.session.configuration;
  }

  get estimatedHashes(): number {
    return this.pow.secondsUntilBlock * this.pow.totalHashRate;
  }

  time$ = interval(1_000).pipe(
    takeWhile(_ => this.session.status === 'started'),
    shareReplay(1)
  );

  hashes$ = this.time$.pipe(
    map(second => {
      const hashes = this.pow.totalHashRate * second;
      return hashes;
    })
  );

  progress$ = this.time$.pipe(
    map(_ => {
      const pow = <PowConfig>this.session.configuration;
      const max = pow.secondsUntilBlock;
      const time = new Date().getTime() - this.session.startTime!.getTime();
      const seconds = time / 1000;
      return seconds / max * 100;
    })
  );

  getBars(progress: number): { index: number, progress: number }[] {
    const bars: { index: number, progress: number }[] = [];
    let index = 0;
    while (progress > 100) {
      progress -= 100;
      bars.push({ index: index++, progress: progress });
    }
    return bars;
  }
}
