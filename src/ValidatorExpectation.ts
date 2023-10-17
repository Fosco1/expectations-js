import { isValid } from ".";
import Expectations, { ValidatorDescriptor, ValidatorFunction } from "./Expectations";
import { Validatable } from "./Validatable";
import { ValidatorResult } from "./ValidatorResult";

export default class ValidatorExpectation implements Validatable {
	key: string;
	validatorDescriptors: Array<ValidatorDescriptor> = [];
	subExpectations: Array<Validatable> = [];
	reverse: Boolean = false
	arrayMode: Boolean = false
	debugMode: Boolean = false
	required: Boolean = true
	missingMessage: string

	constructor(key: string) {
		this.key = key;
		this.missingMessage = Expectations.defaultMissingMessage;
	}

	logIfDebug(...args: any[]) {
		if (this.debugMode) {
			console.log("[" + this.key + "]", ...args);
		}
	}

	private capitalize(str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	get not(): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('not', (data: any, message: string = "") => {
			this.reverse = !this.reverse;
		}));
		return this;
	}

	debug(): ValidatorExpectation {
		this.debugMode = true;
		this.logIfDebug("--- debug mode started");
		return this;
	}

	validate(data: any, res: ValidatorResult) {
		if ((data[this.key] === undefined || data[this.key] === null)) {
			if (this.required) {
				this.logIfDebug("field required, but data is undefined or null, throwing error")
				res[this.key] = this.processMessage(this.missingMessage);
				return;
			}
			this.logIfDebug("data is empty but not required, skipping checks")
			return;
		}

		this.validatorDescriptors.map((descriptor) => {
			if (!this.arrayMode) {
				this.logIfDebug(`running expectation ${descriptor.name} with`, data[this.key], `as ${this.key}`)
				let lastRes = descriptor.function(data[this.key]);
				if (lastRes) {
					res[this.key] = lastRes;
				}
			} else {
				this.logIfDebug("[ARRAY] array mode is on, validating each of:", data[this.key])
				if (!Array.isArray(data[this.key])) {
					this.logIfDebug("[ARRAY] data is not an array, skipping")
					return;
				}
				res[this.key] = [];
				data[this.key].forEach((item: any, dataArrayIndex: number) => {
					this.logIfDebug(`[ARRAY] running expectation ${descriptor.name} with`, data[this.key], `as ${this.key} at index ${dataArrayIndex}`)
					let lastRes = descriptor.function(item, res[this.key][dataArrayIndex]);
					if (lastRes) {
						res[this.key][dataArrayIndex] = lastRes;
					} else {
						res[this.key][dataArrayIndex] = {};
					}
					this.subExpectations.forEach((expectation) => {
						expectation.validate(item, res[this.key][dataArrayIndex]);
					});
				});
			}
		});
		if (!this.arrayMode) {
			this.logIfDebug("[SUBEXP] running subexpectations with", data[this.key], `as ${this.key}`)
			this.subExpectations.forEach((expectation) => {
				if (!res[this.key]) {
					res[this.key] = {};
				}
				expectation.validate(data[this.key], res[this.key]);
				this.logIfDebug("[SUBEXP] validating item", data[this.key], isValid(res[this.key]) ? 'was' : 'was NOT', 'successful')
			});
		} else {
			this.logIfDebug("[SUBEXP] [ARRAY] array mode is on, validating array", data[this.key])
			if (!Array.isArray(data[this.key])) {
				this.logIfDebug("[SUBEXP] [ARRAY] data is not an array, skipping")
				return;
			}
			res[this.key] = [];
			data[this.key].forEach((item: any, dataArrayIndex: number) => {
				this.logIfDebug(`[SUBEXP] [ARRAY] running subexp check with`, data[this.key], `as ${this.key} at index ${dataArrayIndex}`)
				this.subExpectations.forEach((expectation) => {
					if (!res[this.key][dataArrayIndex]) {
						res[this.key][dataArrayIndex] = {};
					}
					expectation.validate(item, res[this.key][dataArrayIndex]);
				});
			});
		}
	}

	private processMessage(message: string): string {
		message = message.replace(/%key%/g, this.key);
		message = message.replace(/%key.capitalize%/g, this.capitalize(this.key));

		return message;
	}

	private processFailure(message: string) {
		if (this.reverse) return;
		return this.processMessage(message)
	}

	toMatch(regex: RegExp): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toMatch', (data: any, message: string = "Doesn't match the regular expression") => {
			if (!regex.test(data)) {
				return this.processFailure(message)
			}
		}));
		return this;
	}

	toBeString(): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBeString', (data: any, message: string = "Should be a string") => {
			if (typeof data !== "string") {
				return this.processFailure(message)
			}
		}));
		return this;
	}

	toBe(value: any): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBe', (data: any, message: string = `Should match ${value}`) => {
			if (data !== value) {
				return this.processFailure(message)
			}
		}));
		return this;
	}

	toBeGreaterThan(value: number): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBeGreaterThan', (data: any, message: string = `Should be greater than ${value}`) => {
			if (data <= value) {
				return this.processFailure(message)
			}
		}));
		return this;
	}

	toBeLessThan(value: number): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBeLessThan', (data: any, message: string = `Should be less than ${value}`) => {
			if (data >= value) {
				return this.processFailure(message)
			}
		}));
		return this;
	}

	toBeArray(): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBeArray', (data: any, message: string = "Should be an array") => {
			if (!Array.isArray(data)) {
				return this.processFailure(message)
			}
		}));
		return this;
	}

	toBeEmpty(): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBeEmpty', (data: any, message: string = "Should be empty") => {
			if (data.length > 0) {
				return this.processFailure(message)
			}
		}));
		return this;
	}

	toHaveProperties(properties: Array<string>): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toHaveProperties', (data: any, message: string = "Does not have the required properties.") => {
			let missingProperties: Array<string> = [];
			properties.forEach((property) => {
				if (!data.hasOwnProperty(property)) {
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
			if (!data.hasOwnProperty(property)) {
				return this.processFailure(message)
			}
		}));
		return this;
	}

	toHaveMinimumLength(length: number): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toHaveMinimumLength', (data: any, message: string = `Is too short (minimum: ${length})`) => {
			if (data.length < length) {
				return this.processFailure(message)
			}
		}));
		return this;
	}

	toHaveMaximumLength(length: number): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toHaveMaximumLength', (data: any, message: string = `Is too long (maximum: ${length})`) => {
			if (data.length > length) {
				return this.processFailure(message)
			}
		}));
		return this;
	}

	toHaveLengthBetween(minimum: number, maximum: number): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toHaveLengthBetween', (data: any, message: string = `Does not meet the required length (minimum: ${minimum}, maximum: ${maximum})`) => {
			if (data.length < minimum || data.length > maximum) {
				return this.processFailure(message)
			}
		}));
		return this;
	}

	toCustom(fn: ValidatorFunction): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toCustom', fn));
		return this;
	}

	toBeObject(): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBeObject', (data: any, message: string = "Should be an object") => {
			if (typeof data !== "object") {
				return this.processFailure(message)
			}
		}));
		return this;
	}

	toBeNumeric() {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBeNumeric', (data: any, message: string = "Should be numeric") => {
			if (typeof data === "number") return;
			if (!isNaN(data) && !isNaN(parseFloat(data))) {
				return this.processFailure(message)
			}
		}))
		return this;
	}

	toBeNumber() {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBeNumber', (data: any, message: string = "Should be a number") => {
			if (typeof data !== "number" && !isNaN(data)) {
				return this.processFailure(message)
			}
		}))
		return this;
	}

	toBeNumberBetween(min: number, max: number) {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBeNumberBetween', (data: any, message: string = `Should be a number between ${min} and ${max}`) => {
			if ((typeof data !== "number" || !isNaN(data) || data < min || data > max)) {
				return this.processFailure(message)
			}
		}))
		return this;
	}

	toBeNumberGreaterThan(value: number) {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBeNumberGreaterThan', (data: any, message: string = `Should be a number greater than ${value}`) => {
			if ((typeof data !== "number" || !isNaN(data) || data <= value)) {
				return this.processFailure(message)
			}
		}))
		return this;
	}

	toBeNumberLessThan(value: number) {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBeNumberLessThan', (data: any, message: string = `Should be a number smaller than ${value}`) => {
			if ((typeof data !== "number" || !isNaN(data) || data >= value)) {
				return this.processFailure(message)
			}
		}))
		return this;
	}

	toBeBoolean() {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBeBoolean', (data: any, message: string = "Should be a boolean value") => {
			if (typeof data !== "boolean") {
				return this.processFailure(message)
			}
		}))
		return this;
	}

	toBeEnum(values: Array<any>) {
		this.validatorDescriptors.push(new ValidatorDescriptor('toBeEnum', (data: any, message: string = "Should be one of the enum values") => {
			if (!values.includes(data)) {
				return this.processFailure(message)
			}
		}))
		return this;
	}

	// Control functions

	notRequired(): ValidatorExpectation {
		this.logIfDebug("Not required called, setting required to false")
		this.required = false;
		return this;
	}

	each(): ValidatorExpectation {
		this.validatorDescriptors.push(new ValidatorDescriptor('each', (data: any, message: string = "Should be an array") => {
			if (!Array.isArray(data)) {
				return this.processFailure(message)
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

	validatorsList(): string {
		return this.validatorDescriptors.map((descriptor) => {
			return descriptor.name;
		}).join(", ");
	}

	explain() {
		this.logIfDebug("validation process:", this.validatorsList());
		return this;
	}

	toSatisfy(expectations: Array<Validatable>) {
		this.subExpectations = expectations;
		return this;
	}

	ifMissing(message: string) {
		this.missingMessage = message;
		return this;
	}
}