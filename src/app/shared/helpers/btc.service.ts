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
}

export interface BtcPrice {
    currency: string;
    price: number;
    previousPrice: number;
}