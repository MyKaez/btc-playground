export interface BlockData {
    interval: string;
    amountOfTime: number;
    amountOfBlocks: number;
    blockSize: string;
}

export class Interval {
    private static no: number = 0;

    index: number;
    text: string;

    private constructor(text: string) {
        this.index = Interval.no++;
        this.text = text;
    }

    static readonly second: Interval = new Interval('Sekunde');
    static readonly minute: Interval = new Interval('Minute');
    static readonly hour: Interval = new Interval('Stunde');
    static readonly day: Interval = new Interval('Tag');
    static readonly week: Interval = new Interval('Woche');
    static readonly year: Interval = new Interval('Jahr');
    static readonly decade: Interval = new Interval('Dekade');
}