import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

export interface ApiBlock {
  data: Block;
}

export interface Block {
  height: number,
  hash: string;
  difficulty: number;
}

@Component({
  selector: 'app-pow',
  templateUrl: './pow.component.html',
  styleUrls: ['./pow.component.scss', '../../materials.scss']
})
export class PowComponent implements OnInit {
  private curBlock: Block = {
    height: 0,
    difficulty: 0,
    hash: ''
  };

  constructor(private http: HttpClient) {
  }

  public get currentBlock(): Block {
    return this.curBlock;
  }

  public set currentBlock(value: Block) {
    this.curBlock = value;
  }


  ngOnInit(): void {
    const url = 'https://chain.api.btc.com/v3/block/latest';
    this.http.get<ApiBlock>(url).subscribe(res => {
      this.currentBlock = res.data;
    });
  }

  handleError(e: any): any {
    alert(JSON.stringify(e))
  }
}
