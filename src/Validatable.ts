import { ValidatorResult } from "./ValidatorResult";

export interface Validatable {
	validate(data: any, res: ValidatorResult): void;
	debug(): Validatable;
}