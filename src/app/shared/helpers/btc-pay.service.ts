import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { Observable } from "rxjs";
import { Config } from "src/environments/environment";
//import { Config } from ".config/private/btc-pay";

@Injectable()
export class BtcPayService {
    static readonly VOLTAGE_KEY = Config.VOLTAGE_KEY;
    static readonly BTC_PAY_AUTH = Config.BTC_PAY_AUTH;
    static readonly FIRE_REQUEST = Config.FIRE_REQUEST;

    constructor(private http: HttpClient) {
    }

    getStoreId(): Observable<string> {
        if (!BtcPayService.FIRE_REQUEST) {
            return new Observable();
        }

        return this.http.get('https://api.voltage.cloud/btcpayserver', {
            headers: new HttpHeaders({
                'X-VOLTAGE-AUTH': BtcPayService.VOLTAGE_KEY
            })
        }).pipe(
            map(res => {
                let obj = <any>res;
                let storeId = obj['btcpayservers'][0]['store_id'];

                return storeId;
            })
        );
    }

    createInvoice(storeId: string, invoice: Invoice): Observable<Checkout> {
        if (!BtcPayService.FIRE_REQUEST) {
            return new Observable();
        }

        let url = `https://btcpay0.voltageapp.io/api/v1/stores/${storeId}/invoices`;
        return this.http.post(url, {
            amount: invoice.amount,
            currency: invoice.currency,
            receipt: {
                enabled: true,
                showQR: true
            }
        }, {
            headers: new HttpHeaders({
                'Authorization': `Basic ${BtcPayService.BTC_PAY_AUTH}`
            })
        }).pipe(
            map(data => <Checkout>data)
        );
    }
}

export type Currency = 'EUR' | 'CHF' | 'sats' | 'BTC';

export interface Invoice {
    amount: number;
    currency: Currency;
}

export interface Checkout {
    id: string;
    amount: number;
    checkoutLink: string;
    currency: string;
}