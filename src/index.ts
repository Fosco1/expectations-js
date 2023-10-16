import Expectations from "./Expectations";
import { Validatable } from "./Validatable";
import { ValidatorResult } from "./ValidatorResult";

export function when(key: string)  {
	return Expectations.when(key);
}

export function expect(key: string) {
	return Expectations.expect(key);
}

export function isValid(res: ValidatorResult) {
	return Expectations.isValid(res);
}

export function validate(expectations: Array<Validatable> | Validatable, data: any) {
	return Expectations.validate(expectations, data);
}