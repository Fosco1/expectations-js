import { Validatable } from "./Validatable";
import ValidatorCondition from "./ValidatorCondition";
import ValidatorExpectation from "./ValidatorExpectation";
import { ValidatorResult } from "./ValidatorResult";

export default class Expectations {
	static validate(expectations: Array<Validatable> | Validatable, data: any) {
		const res = {} as ValidatorResult;
		if(!Array.isArray(expectations)) {
			expectations = [expectations];
		}
		expectations.forEach((expectation) => {
			expectation.validate(data, res);
		});
		return res;
	}

	static isValid(res: ValidatorResult) {
		return Object.keys(res).length === 0;
	}

	static expect(key: string) {
		return new ValidatorExpectation(key);
	}

	static when(key: string) {
		return new ValidatorCondition(key);
	}

	static ifNotValid(res: ValidatorResult, message: string) {
		if (!Expectations.isValid(res)) {
			throw new Error(message);
		}
	}
}

export type ValidatorFunction = (data: any, message?: string) => string | undefined | void;