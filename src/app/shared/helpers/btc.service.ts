import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { BLOCK_DURATION_IN_SECONDS } from "./block";

@Injectable()
export class BtcService {
    constructor(private http: HttpClient) {

    }

    getCurrentPrice(): Observable<BtcPrice> {
        const currency = 'EUR';
        return this.http.get('https://blockchain.info/ticker').pipe(
            map(data => (<any>data)[currency]),
            map(data => ({
                currency: currency,
                price: data['last'],
                previousPrice: data['15m'],
            }))
        );
    }

    getLatestBlocks(): Observable<BtcBlock[]> {
        return this.http.get('https://mempool.space/api/v1/blocks/').pipe(
            map(data => (<any[]>data)),
            map(data => ([
                {
                    id: data[0]['id'],
                    difficulty: data[0]['difficulty'],
                    height: data[0]['height']
                },
                {
                    id: data[1]['id'],
                    difficulty: data[1]['difficulty'],
                    height: data[1]['height']
                },
                {
                    id: data[2]['id'],
                    difficulty: data[2]['difficulty'],
                    height: data[2]['height']
                }
            ]))
        );
    }

    // https://en.bitcoinwiki.org/wiki/Difficulty_in_Mining#:~:text=Average%20time%20of%20finding%20a,a%20miner%20finds%20per%20second.
    getCurrentHashRate(): Observable<number> {
        return this.getLatestBlocks().pipe(
            map(blocks => {
                const bitcoinDifficulty = blocks[0].difficulty;
                return bitcoinDifficulty * (2 ** 32) / BLOCK_DURATION_IN_SECONDS;
            })
        )
    }
}

export interface BtcPrice {
    currency: string;
    price: number;
    previousPrice: number;
}

export interface BtcBlock {
    id: string;
    difficulty: number;
    height: number;
}