import { ValidatorDescriptor, ValidatorFunction } from "./Expectations";
import { Validatable } from "./Validatable";
import { ValidatorResult } from "./ValidatorResult";

export default class ValidatorExpectation implements Validatable {
	key: string;
	validatorDescriptors: Array<ValidatorDescriptor> = [];
	reverse: Boolean = false
	arrayMode: Boolean = false
	debugMode: Boolean = false
	required: Boolean = true

	constructor(key: string) {
		this.key = key;
	}

	private logIfDebug(...args: any[]) {
		if(this.debugMode) {
			console.log(...args);
		}
	}

	debug(): ValidatorExpectation {
		console.log("--- debug mode started", this.validatorDescriptors);
		this.debugMode = true;
		return this;
	}

	validate(data: any, res: ValidatorResult) {
		this.validatorDescriptors.map((descriptor) => {
			if(!this.required) {
				this.logIfDebug("not required, checking if data is undefined or null")
				if ((data[this.key] === undefined || data[this.key] === null)) {
					this.logIfDebug("data is undefined or null, skipping")
					return;
				} else {
					this.logIfDebug("data is not undefined or null, continuing")
				}
			} else {
				this.logIfDebug("required, continuing")
			}
			if(!this.arrayMode) {
				this.logIfDebug("running expectation with", data[this.key], "as", this.key)
				let lastRes = descriptor.function(data[this.key]);
				if(lastRes) {
					res[this.key] = lastRes;
				}
			} else {
				this.logIfDebug("array mode is on, validating array", data[this.key])
				res[this.key] = [];
				data[this.key].forEach((item: any, index: number) => {
					this.logIfDebug("validating item", item)
					let lastRes = descriptor.function(item, res[this.key][index]);
					if(lastRes) {
						res[this.key][index] = lastRes;
					} else {
						res[this.key][index] = {};
					}
				});
			}
		});
	}

	private capitalize(str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	processMessage(message: string): string {
		message = message.replace(/%key%/g, this.key);
		message = message.replace(/%key.capitalize%/g, this.capitalize(this.key));

		return message;
	}

	toBeString(): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBeString', (data: any, message: string = "Is not a string") => {
			if (typeof data !== "string" && !this.reverse) {
				return this.processMessage(message);
			}
		}));
		return this;
	}

	toMatch(regex: RegExp): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toMatch', (data: any, message: string = "Doesn't match the regular expression") => {
			if (!regex.test(data) && !this.reverse) {
				return this.processMessage(message);
			}
		}));
		return this;
	}

	toBe(value: any): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBe', (data: any, message: string = "Doesn't match the provided value") => {
			if (data !== value && !this.reverse) {
				return this.processMessage(message);
			}
		}));
		return this;
	}

	toBeGreaterThan(value: number): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBeGreaterThan', (data: any, message: string = "Is not greater than the provided value") => {
			if (data <= value && !this.reverse) {
				return this.processMessage(message);
			}
		}));
		return this;
	}

	toBeLessThan(value: number): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBeLessThan', (data: any, message: string = "Is not less than the provided value") => {
			if (data >= value && !this.reverse) {
				return this.processMessage(message);
			}
		}));
		return this;
	}

	toBeArray(): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBeArray', (data: any, message: string = "Is not an array") => {
			if (!Array.isArray(data) && !this.reverse) {
				return this.processMessage(message);
			}
		}));
		return this;
	}
	
	toBeEmpty(): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBeEmpty', (data: any, message: string = "Is not empty") => {
			if (data.length > 0 && !this.reverse) {
				return this.processMessage(message);
			}
		}));
		return this;
	}

	toHaveProperties(properties: Array<string>): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toHaveProperties', (data: any, message: string = "Does not have the required properties.") => {
			let missingProperties: Array<string> = [];
			properties.forEach((property) => {
				if (!data.hasOwnProperty(property) && !this.reverse) {
					missingProperties.push(property);
				}
			});
			if (missingProperties.length > 0) {
				return this.processMessage(message) + " Missing properties: " + missingProperties.join(", ");
			}
		}));
		return this;
	}

	toHaveProperty(property: string): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toHaveProperty', (data: any, message: string = "Does not have the required property") => {
			if (!data.hasOwnProperty(property) && !this.reverse) {
				return this.processMessage(message);
			}
		}));
		return this;
	}

	toHaveMinimumLength(length: number): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toHaveMinimumLength', (data: any, message: string = `Is too short (minimum: ${length})`) => {
			if (data.length < length && !this.reverse) {
				return this.processMessage(message);
			}
		}));
		return this;
	}

	toHaveMaximumLength(length: number): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toHaveMaximumLength', (data: any, message: string = `Is too long (maximum: ${length})`) => {
			if (data.length > length && !this.reverse) {
				return this.processMessage(message);
			}
		}));
		return this;
	}

	toHaveLengthBetween(minimum: number, maximum: number): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toHaveLengthBetween', (data: any, message: string = `Does not meet the required length (minimum: ${minimum}, maximum: ${maximum})`) => {
			if (data.length < minimum || data.length > maximum && !this.reverse) {
				return this.processMessage(message);
			}
		}));
		return this;
	}

	toCustom(fn: ValidatorFunction): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toCustom', fn));
		return this;
	}

	toBeObject(): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBeObject', (data: any, message: string = "Is not an object") => {
			if (typeof data !== "object" && !this.reverse) {
				return this.processMessage(message);
			}
		}));
		return this;
	}

	notRequired(): ValidatorExpectation {
		this.logIfDebug("Not required called, setting required to false")
		this.required = false;
		return this;
	}

	each(): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('each', (data: any, message: string = "Is not an array") => {
			if (!Array.isArray(data) && !this.reverse) {
				return this.processMessage(message);
			}
			this.logIfDebug("each called, setting array mode to true")
			this.arrayMode = true;
		}));
		return this;
	}

	ifNot(errorMessage: string): ValidatorExpectation {
		const lastDescriptor = this.validatorDescriptors[this.validatorDescriptors.length - 1];
		const lastDescriptorFunctionClone = lastDescriptor.function;
		lastDescriptor.function = (data: any) => {
			return lastDescriptorFunctionClone(data, errorMessage);
		};
		
		return this;
	}

	not(): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('not', (data: any, message: string = "") => {
			this.reverse = !this.reverse;
		}));
		return this;
	}

	and(): ValidatorExpectation {
		return this;
	}
}