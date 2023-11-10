import { ValidatorResult } from "./ValidatorResult.js";
export interface Validatable {
    validate(data: any, res: ValidatorResult): void;
    debug(): Validatable;
}
