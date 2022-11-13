import {Component, Input, OnInit} from '@angular/core';
import {BtcPayService, Currency, Invoice} from 'src/app/shared/helpers/btc-pay.service';
import {NotificationService} from 'src/app/shared/media/notification.service';

@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.scss']
})
export class DonationComponent implements OnInit {
  amount: number = 0;
  currency: Currency = 'EUR';
  step: number = 0;
  private storeId?: string;
  private amounts = {
    'EUR': {amount: 2.1, step: 0.1},
    'CHF': {amount: 2.1, step: 0.1},
    'BTC': {amount: 0.000021, step: 0.000001},
    'sats': {amount: 2100, step: 100}
  };

  @Input()
  showHeader: boolean = true;

  constructor(private btcPayService: BtcPayService, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.updateSettings(this.currency);
    this.btcPayService.getStoreId().subscribe(storeId => this.storeId = storeId);
  }

  get activated(): boolean {
    return this.storeId != undefined;
  }

  updateSettings(currency: Currency) {
    this.amount = this.amounts[currency].amount;
    this.step = this.amounts[currency].step;
  }

  donate() {
    const storeId = this.storeId ? this.storeId : '';
    let invoice: Invoice = {
      amount: this.amount,
      currency: this.currency
    };
    this.notificationService.display('Danke für deine Unterstützung ♥');
    this.btcPayService.createInvoice(storeId, invoice).subscribe(res => {
      window.open(res.checkoutLink);
    });
  }

  copyLightningAddress(): void {
    let payload = 'LNURL1DP68GURN8GHJ7MRWW3UXYMM59E3K7MF09EMK2MRV944KUMMHDCHKCMN4WFK8QTM5WAJKUAREDAHX2MTFD3KXJMMWNZ32PN';
    this.copyData(payload);
  }

  copyBitcoinAddress(): void {
    let payload = 'bc1qcvg7pn3ly6qf5qcg4c7c8a2se5kxqurf8tyuwa';
    this.copyData(payload);
  }

  private copyData(payload: string) {
    let listener = (e: ClipboardEvent) => {
      e.clipboardData!.setData("text", payload);
      e.preventDefault();
      this.notificationService.display('Adresse kopiert!')
      document.removeEventListener('copy', listener, false);
    };
    document.addEventListener('copy', listener, false);
    document.execCommand('copy');
  }
}
