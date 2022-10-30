import { ILightningTransaction } from ".";

export class NotEnoughLiquidityError extends Error {
    constructor(public transaction: ILightningTransaction, 
        msg: string) {
        super(msg);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, NotEnoughLiquidityError.prototype);
    }
}