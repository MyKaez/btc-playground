import { Injectable } from '@angular/core';
import { SHA256 } from 'crypto-js';
import { Block } from 'src/app/models/block';
import { delay } from 'src/app/shared/delay';
import { PowConfig } from '../models/pow-config';

@Injectable({
  providedIn: 'root'
})
export class PowService {

  blocks: Block[] = [];

  async findBlock(runId: string, config: PowConfig): Promise<Block> {
    let overallHashRate = 0;
    const id = runId.split('-')[0];
    const timestamp = new Date().toISOString();
    const template = `${id}_${timestamp}_`;
    do {
      overallHashRate++;
      const text = template + overallHashRate;
      const hash = SHA256(text).toString();
      const block = {
        userId: runId,
        text: text,
        hash: hash
      };
      this.blocks.unshift(block);
      if (this.blocks.length > 20) {
        this.blocks.pop();
      }
      await delay(1);
    } while (this.blocks[0].hash > config.threshold);
    return this.blocks[0];
  }

  async determine(runId?: string): Promise<number> {
    if (!runId) {
      runId = 'determination-run'
    };
    let overallHashRate = 0;
    const determineRounds = 5;
    const template = `${runId}_${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}'_`;
    for (let i = 0; i < determineRounds; i++) {
      const start = new Date();
      start.setSeconds(start.getSeconds() + 1);
      while (start.getTime() > new Date().getTime()) {
        overallHashRate++;
        const text = template + overallHashRate;
        const hash = SHA256(text).toString();
        const block = {
          userId: runId,
          text: text,
          hash: hash
        };
        this.blocks.unshift(block);
        if (this.blocks.length > 20) {
          this.blocks.pop();
        }
        await delay(1);
      }
      this.blocks.length = 0;
    }
    const allowedHashRate = Math.round(Math.round(overallHashRate * 0.75) / determineRounds);

    return allowedHashRate;
  }
}
