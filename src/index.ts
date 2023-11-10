import ExpectationsJS from "./ExpectationsJS.js";
import { Validatable } from "./Validatable.js";
import { ValidatorResult } from "./ValidatorResult.js";

export function when(key: string)  {
	return ExpectationsJS.when(key);
}

export function expect(key: string) {
	return ExpectationsJS.expect(key);
}

export function isValid(res: ValidatorResult) {
	return ExpectationsJS.isValid(res);
}

export function validate(expectations: Array<Validatable> | Validatable, data: any) {
	return ExpectationsJS.validate(expectations, data);
}

export function setDefaultMissingMessage(message: string) {
	return ExpectationsJS.defaultMissingMessage = message;
}
