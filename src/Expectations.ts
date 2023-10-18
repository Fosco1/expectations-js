import { Validatable } from "./Validatable";
import ValidatorCondition from "./ValidatorCondition";
import ValidatorExpectation from "./ValidatorExpectation";
import { ValidatorResult } from "./ValidatorResult";

export default class Expectations {
	static defaultMissingMessage: string = "Missing %key.capitalize%.";

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

	static processMessage(message: string, key: string): string {
		message = message.replace(/%key%/g, key);
		message = message.replace(/%key.capitalize%/g, this.capitalize(key));

		return message;
	}

	private static capitalize(str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	/**
	 * Checks recursively if res has a property set which is a string.
	 * If it has an array, checks each item with the same function.
	 * If it has an object, checks it entirely with the same function.
	 * @param res
	 */
	static isValid(res: ValidatorResult): boolean {
		for(let key in res) {
			if(typeof res[key] === "string") {
				return false;
			}
			if(Array.isArray(res[key])) {
				for(let i = 0; i < res[key].length; i++) {
					if(!this.isValid(res[key][i])) {
						return false;
					}
				}
			}
			if(typeof res[key] === "object") {
				if(!this.isValid(res[key])) {
					return false;
				}
			}
		}
		return true;
	}

	static expect(key: string) {
		return new ValidatorExpectation(key);
	}

	static when(key: string) {
		return new ValidatorCondition(key);
	}
}

export class ValidatorDescriptor {
	name: string
	function: ValidatorFunction

	constructor(name: string, func: ValidatorFunction) {
		this.name = name;
		this.function = func;
	}
}
export type ValidatorFunction = (data: any, message?: string) => string | undefined | void;