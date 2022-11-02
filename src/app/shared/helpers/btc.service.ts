import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

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