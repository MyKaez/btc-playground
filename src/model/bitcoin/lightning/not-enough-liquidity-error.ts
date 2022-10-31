import { ILightningTransaction } from ".";

export class NotEnoughLiquidityError extends Error {
    constructor(public override message: string, public transaction?: ILightningTransaction) {
        super(message);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, NotEnoughLiquidityError.prototype);
    }
}