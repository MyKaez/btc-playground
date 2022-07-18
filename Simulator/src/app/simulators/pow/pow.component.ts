import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Block } from '../block';

@Component({
  selector: 'app-pow',
  templateUrl: './pow.component.html',
  styleUrls: ['./pow.component.scss']
})
export class PowComponent implements OnInit {
  private _blocks:Block[] = [];
  private _runJob: boolean = false;
  private _hashRate: number = 1;
  private _blockTime: number= 1; 

  public dataSource: MatTableDataSource<Block>;
  public processedBlockTimes: number = 0;
  public stopOnFoundBlock: boolean = false;

  constructor() { 
    this.dataSource = new MatTableDataSource(this.blocks);
  }

  public get isProcessing(): boolean{
    return this._runJob;
  }

  public get probability(): number{
    return 1 / (this._hashRate * this._blockTime);
  }

  public get blocks(): Block[]{
    return this._blocks;
  }

  public get displayedColumns():string[]{
    return ['id', 'isValid', 'serialNo', 'processTime', 'difficulty'];
  }

  public get hashRate(): string {
    return this._hashRate.toString();
  }

  public set hashRate(value: string){
    if (!Number.isNaN(value))
      this._hashRate = Number.parseFloat(value);
  }

  public get blockTime():string{
    return this._blockTime.toString();
  }

  public set blockTime(value: string){
    if (!Number.isNaN(value))
      this._blockTime = Number.parseFloat(value);
  }

  public get expectedPrefixes(): string{
    const res = [];
    const input = this.getValidationInput();
    const leadingZero = input[0];
    const probability = input[1];
    let x = '';
    for(let i = 0; i < leadingZero; i++){ 
      x += '0';
    }
    for (let i = 0; i < probability; i++){
      res.push(x + i.toString(16));
    }
    return res.reduce((prev, cur)=> prev += ', ' + cur, '').substring(2);
  }

  ngOnInit(): void {
  }

  async start() {
    if (this._runJob){
      return;
    }
    this._runJob = true;
    await this.createJob();
  }

  createJob():Promise<string> {
    return new Promise(async resolve =>{
      const delay = 1000 / this._hashRate * this._blockTime;
      const validationInput = this.getValidationInput();
      while(this._runJob) {
        for (let i = 0; i < this._hashRate; i++){  
          const block = this.createBlock(validationInput[0], validationInput[1]);
          this.blocks.push(block);
          if(this.stopOnFoundBlock && block.isValid){
            this.stop();
            break;
          }
          await this.delay(delay);
        }
        this.processedBlockTimes++;
      }
      resolve('done');
    });
  }

  createBlock(leadingZeros: number, probability: number): Block {
    const id = this.createBlockId(); 
    const block = {
      id: id,
      processTime: this.processedBlockTimes,
      difficulty: this.probability,
      serialNo: this.blocks.length,
      isValid: this.probability === 1 
        ? true 
        : this.validate(id, leadingZeros, probability)
    };
    return block;
  }

  getValidationInput() : [number, number]{
    let probability = this.probability;
    let leadingZeros = 0;
    for (let i = 0 ; i < this.createBlockId().length; i ++){
      probability = probability * 16;
      if (probability >= 1){
        break;
      }
      leadingZeros++;
    }
    probability = Math.round(probability);
    return [leadingZeros, probability];
  }

  validate(id: string, leadingZeros: number, probability: number): boolean {
    let zerosOnly = id.substring(0, leadingZeros);
    if (zerosOnly.replace('0', '').length > 0){
      return false;
    }
    let relevantChar = id.substring(leadingZeros, leadingZeros + 1);
    let hex = '0x' + relevantChar;
    return Number.parseInt(hex) <= probability;
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  stop(): void{
    this._runJob = false;
    this.dataSource.data = this.blocks;
  }

  clear(): void {
    if (this._runJob){
      return;
    }
    for(let i = this.blocks.length; i > 0; i--){
      this.blocks.pop();
    }
    this.dataSource.data = this.blocks;
    this.processedBlockTimes = 0;
  }

  createBlockId(): string {
    // origins from here: https://www.cloudhadoop.com/javascript-uuid-tutorial/#:~:text=Typescript%20-%20generate%20UUID%20or%20GUID%20with%20an,directly%20use%20the%20uuid%20%28%29%20function%20as%20below.
    let uuidValue = "", k, randomValue;  
    for (k = 0; k < 64; k++) {  
      randomValue = Math.random() * 16 | 0;    
      uuidValue += (k == 12 ? 4 : (k == 16 ? (randomValue & 3 | 8) : randomValue)).toString(16);  
    }  
    return uuidValue;
  }
}
