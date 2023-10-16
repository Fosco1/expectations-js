import { ValidatorFunction } from "./Expectations";
import { Validatable } from "./Validatable";
import { ValidatorResult } from "./ValidatorResult";

export default class ValidatorExpectation implements Validatable {
	key: string;
	validatorFunctions: Array<ValidatorFunction>
	reverse: Boolean = false
	arrayMode: Boolean = false
	debugMode: Boolean = false

	constructor(key: string) {
		this.key = key;
		this.validatorFunctions = [];
	}

	private logIfDebug(...args: any[]) {
		if(this.debugMode) {
			console.log(...args);
		}
	}

	debug(): ValidatorExpectation {
		console.log(this.validatorFunctions);
		this.debugMode = true;
		return this;
	}

	validate(data: any, res: ValidatorResult) {
		this.validatorFunctions.map((expectation) => {
			if(!this.arrayMode) {
				this.logIfDebug("running expectation with", data[this.key], "as", this.key)
				let lastRes = expectation(data[this.key]);
				if(lastRes) {
					res[this.key] = lastRes;
				}
			} else {
				this.logIfDebug("array mode is on, validating array", data[this.key])
				res[this.key] = [];
				data[this.key].forEach((item: any, index: number) => {
					this.logIfDebug("validating item", item)
					let lastRes = expectation(item, res[this.key][index]);
					if(lastRes) {
						res[this.key][index] = lastRes;
					}
				});
			}
		});
	}

	toBeString(): ValidatorExpectation {
		this.validatorFunctions.push((data: any, message: string = "Is not a string") => {
			if (typeof data !== "string" && !this.reverse) {
				return message;
			}
		});
		return this;
	}

	toMatch(regex: RegExp): ValidatorExpectation {
		this.validatorFunctions.push((data: any, message: string = "Doesn't match the regular expression") => {
			if (!regex.test(data) && !this.reverse) {
				return message;
			}
		});
		return this;
	}

	toBe(value: any): ValidatorExpectation {
		this.validatorFunctions.push((data: any, message: string = "Doesn't match the provided value") => {
			if (data !== value && !this.reverse) {
				return message;
			}
		});
		return this;
	}

	toBeGreaterThan(value: number): ValidatorExpectation {
		this.validatorFunctions.push((data: any, message: string = "Is not greater than the provided value") => {
			if (data <= value && !this.reverse) {
				return message;
			}
		});
		return this;
	}

	toBeLessThan(value: number): ValidatorExpectation {
		this.validatorFunctions.push((data: any, message: string = "Is not less than the provided value") => {
			if (data >= value && !this.reverse) {
				return message;
			}
		});
		return this;
	}

	toBeArray(): ValidatorExpectation {
		this.validatorFunctions.push((data: any, message: string = "Is not an array") => {
			if (!Array.isArray(data) && !this.reverse) {
				return message;
			}
		});
		return this;
	}
	
	toBeEmpty(): ValidatorExpectation {
		this.validatorFunctions.push((data: any, message: string = "Is not empty") => {
			if (data.length > 0 && !this.reverse) {
				return message;
			}
		});
		return this;
	}

	toHaveProperties(properties: Array<string>): ValidatorExpectation {
		this.validatorFunctions.push((data: any, message: string = "Does not have the required properties.") => {
			let missingProperties: Array<string> = [];
			properties.forEach((property) => {
				if (!data.hasOwnProperty(property) && !this.reverse) {
					missingProperties.push(property);
				}
			});
			if (missingProperties.length > 0) {
				return message + " Missing properties: " + missingProperties.join(", ");
			}
		});
		return this;
	}

	toHaveProperty(property: string): ValidatorExpectation {
		this.validatorFunctions.push((data: any, message: string = "Does not have the required property") => {
			if (!data.hasOwnProperty(property) && !this.reverse) {
				return message;
			}
		});
		return this;
	}

	toCustom(fn: ValidatorFunction): ValidatorExpectation {
		this.validatorFunctions.push(fn);
		return this;
	}

	each(): ValidatorExpectation {
		this.validatorFunctions.push((data: any, message: string = "Is not an array") => {
			if (!Array.isArray(data) && !this.reverse) {
				return message;
			}
			this.logIfDebug("each called, setting array mode to true")
			this.arrayMode = true;
		});
		return this;
	}

	ifNot(errorMessage: string): ValidatorExpectation {
		const lastExpectation = this.validatorFunctions[this.validatorFunctions.length - 1];
		this.validatorFunctions[this.validatorFunctions.length - 1] = (data: any) => {
			return lastExpectation(data, errorMessage);
		};
		return this;
	}

	not(): ValidatorExpectation {
		this.validatorFunctions.push((data: any, message: string = "") => {
			this.reverse = !this.reverse;
		});
		return this;
	}

	and(): ValidatorExpectation {
		return this;
	}
}