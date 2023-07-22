import { Inject, Injectable } from '@angular/core';
import { SHA256 } from 'crypto-js';
import { Block } from 'src/app/models/block';
import { delay } from 'src/app/shared/delay';
import { PowConfig } from '../models/pow-config';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { DeterminationRunConfig, RunConfig } from '../models/run-config';

@Injectable({
  providedIn: 'root'
})
export class PowService {
  blocks: Block[] = [];
  isExecuting: boolean = false;

  constructor(@Inject('BTCIS.ME-API') private url: string, private httpClient: HttpClient) { }

  getConfig(totalHashRate: number, secondsUntilBlock: number, hashRate: number): Observable<PowConfig> {
    const req = { totalHashRate: totalHashRate, secondsUntilBlock: secondsUntilBlock };
    return this.httpClient.post(`${this.url}/v1/simulations/proof-of-work`, req).pipe(
      map(data => <PowConfig>data),
      catchError(error => {
        console.error("Failed get pow config from server. Fallback to local config", error);
        return of(this.getLocalConfig(totalHashRate, secondsUntilBlock, hashRate))
      })
    );
  }

  private getLocalConfig(totalHashRate: number, secondsUntilBlock: number, hashRate: number): PowConfig {
    let difficulty = hashRate * secondsUntilBlock;
    let exptected = 1 / ((totalHashRate || 1) * secondsUntilBlock);

    return {
      totalHashRate: totalHashRate,
      secondsUntilBlock: secondsUntilBlock,
      difficulty: difficulty,
      expected: exptected,
      secondsToSkipValidBlocks: 0,
      threshold: "00"
    }
  }

  async findBlock(runConfig: RunConfig): Promise<Block | undefined> {
    this.isExecuting = true;
    let created = 0;

    try {
      const template = this.createTemplate(runConfig.runId);
      let foundBlock = false;
      do {
        if (!this.isExecuting) {
          return undefined;
        }
        if (runConfig.stopCondition && runConfig.stopCondition()) {
          return undefined;
        }
        created++;
        const text = template + created;
        const hash = SHA256(text).toString();
        const block: Block = this.createBlock(runConfig, text, hash, hash < runConfig.powConfig.threshold);
        this.blocks.unshift(block);
        if (this.blocks.length > runConfig.amountOfBlocks) {
          this.blocks.pop();
        }
        await delay(1);

        if (this.blocks[0].hash <= runConfig.powConfig.threshold) {
          if (runConfig.startTime.getTime() + runConfig.powConfig.secondsToSkipValidBlocks * 1000 > new Date().getTime()) {
            console.log('skipped valid: ' + this.blocks[0].hash);
            this.blocks.splice(0, 1);
          }
          else {
            foundBlock = true;
          }
        }
      } while (!foundBlock);
    }
    catch (error) {
      console.error("Failed at finding block", error);
    }

    this.isExecuting = false;
    return this.blocks[0];
  }

  async determine(runConfig: DeterminationRunConfig): Promise<number> {
    this.isExecuting = true;
    this.blocks.length = 0;
    let overallHashRate = 0;
    const determineRounds = 5;
    const template = this.createTemplate(runConfig.runId);
    for (let i = 0; i < determineRounds; i++) {
      const start = new Date();
      start.setSeconds(start.getSeconds() + 1);
      while (start.getTime() > new Date().getTime()) {
        if (runConfig.stopCondition && runConfig.stopCondition()) {
          break;
        }
        overallHashRate++;
        const text = template + overallHashRate;
        const hash = SHA256(text).toString();
        const block: Block = this.createBlock(runConfig, text, hash, false);
        this.blocks.unshift(block);
        if (this.blocks.length > runConfig.amountOfBlocks) {
          this.blocks.pop();
        }
        if (runConfig.stopCondition && runConfig.stopCondition()) {
          break;
        }
        await delay(1);
      }
      this.blocks.length = 0;
    }
    const allowedHashRate = Math.round(Math.round(overallHashRate * 0.75) / determineRounds);
    this.isExecuting = false;
    return allowedHashRate;
  }

  private createBlock(runConfig: DeterminationRunConfig, text: string, hash: string, isValid: boolean): Block {
    return {
      userId: runConfig.runId ?? '',
      text: text,
      hash: runConfig.modifyHash ? runConfig.modifyHash(hash) : hash,
      isValid: isValid,
    };
  }

  createTemplate(runId?: string): string {
    const timestamp = new Date().toISOString().replace(/[^0-9_]/g, '');
    if (runId) {
      const id = runId.split('-')[0];
      return `${id}_${timestamp}_`;
    }
    return `${timestamp}_`;;
  }
}
