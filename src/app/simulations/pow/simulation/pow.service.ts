import { Inject, Injectable } from '@angular/core';
import { SHA256 } from 'crypto-js';
import { Block } from 'src/app/models/block';
import { delay } from 'src/app/shared/delay';
import { PowConfig } from '../models/pow-config';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PowService {
  blocks: Block[] = [];
  isExecuting: boolean = false;

  constructor(@Inject('BTCIS.ME-API') private url: string, private httpClient: HttpClient) { }

  getConfig(totalHashRate: number, secondsUntilBlock: number): Observable<PowConfig> {
    const req = { totalHashRate: totalHashRate, secondsUntilBlock: secondsUntilBlock };
    return this.httpClient.post(`${this.url}/v1/simulations/proof-of-work`, req).pipe(
      map(data => <PowConfig>data)
    );
  }

  async findBlock(runId: string, config: PowConfig, amountOfBlocks: number): Promise<Block | undefined> {
    this.isExecuting = true;
    let created = 0;
    const template = this.createTemplate(runId);
    do {
      if (!this.isExecuting) {
        return undefined;
      }
      created++;
      const text = template + created;
      const hash = SHA256(text).toString();
      const block = {
        userId: runId,
        text: text,
        hash: hash,
        isValid: hash < config.threshold
      };
      this.blocks.unshift(block);
      if (this.blocks.length > amountOfBlocks) {
        this.blocks.pop();
      }
      await delay(1);
    } while (this.blocks[0].hash > config.threshold);
    this.isExecuting = false;
    return this.blocks[0];
  }

  async determine(runId: string, amountOfBlocks: number): Promise<number> {
    this.isExecuting = true;
    this.blocks.length = 0;
    let overallHashRate = 0;
    const determineRounds = 5;
    const template = this.createTemplate(runId);
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
          hash: hash,
          isValid: false
        };
        this.blocks.unshift(block);
        if (this.blocks.length > amountOfBlocks) {
          this.blocks.pop();
        }
        await delay(1);
      }
      this.blocks.length = 0;
    }
    const allowedHashRate = Math.round(Math.round(overallHashRate * 0.75) / determineRounds);
    this.isExecuting = false;
    return allowedHashRate;
  }

  createTemplate(runId: string): string {
    const id = runId.split('-')[0];
    const timestamp = new Date().toISOString().replace(/[^0-9_]/g, '');
    if (id.length > 0) {
      return `${id}_${timestamp}_`;
    }
    return `${timestamp}_`;;
  }
}
