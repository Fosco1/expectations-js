import Expectations, { ValidatorFunction } from "./Expectations";
import { Validatable } from "./Validatable";
import ValidatorExpectation from "./ValidatorExpectation";
import { ValidatorResult } from "./ValidatorResult";

enum LogicCondition {
	AND = "AND",
	OR = "OR"
}

export default class ValidatorCondition implements Validatable {
	expectations: Array<ValidatorExpectation>;
	conditions = Array<LogicCondition>();
	debugMode: Boolean = false;
	errorField?: string;
	errorMessage?: string;

	constructor(key: string) {
		this.expectations = [new ValidatorExpectation(key)];
	}

	logIfDebug(...args: any[]) {
		if(this.debugMode) {
			console.log(`[CONDITION]`, ...args);
		}
		return this;
	}

	get not(): ValidatorCondition {
		this.lastExpectation.not;
		return this;
	}

	get lastExpectation() {
		return this.expectations[this.expectations.length - 1];
	}

	and(key: string): ValidatorCondition {
		this.logIfDebug("AND", key);
		this.conditions.push(LogicCondition.AND);
		this.expectations.push(new ValidatorExpectation(key));
		return this;
	}

	or(key: string): ValidatorCondition {
		this.logIfDebug("OR", key);
		this.conditions.push(LogicCondition.OR);
		this.expectations.push(new ValidatorExpectation(key));
		return this;
	}

	debug(): ValidatorCondition {
		this.debugMode = true;
		this.logIfDebug("--- Debug mode started");
		this.logIfDebug("Last expectation: ", this.lastExpectation.key)
		return this;
	}

	expect(key: string): ValidatorCondition {
		this.logIfDebug("Expecting", key);
		this.expectations.push(new ValidatorExpectation(key));
		return this;
	}

	validate(data: any, res: ValidatorResult) {
		this.logIfDebug("Validating", this.expectations)

		let finalresult = true;
		this.expectations.some((expectation, index) => {
			let tempRes = {};
			expectation.validate(data, tempRes);
			const validated = Expectations.isValid(tempRes);
			this.logIfDebug(`Expectation '${expectation.key}' to '${expectation.validatorsList()}' is ${validated ? "valid" : "invalid"}`);
			switch(this.conditions[index]) {
				case LogicCondition.AND:
					this.logIfDebug("AND", finalresult, validated);
					finalresult = finalresult && validated;
					break;
				case LogicCondition.OR:
					this.logIfDebug("OR", finalresult, validated);
					finalresult = finalresult || validated;
					break;
				default:
					finalresult = validated;
					break;
			}
			this.logIfDebug("FinalResult is", finalresult);
			return !finalresult;
		})
		this.logIfDebug("Final result is", finalresult);
		if(this.errorField && this.errorMessage && finalresult) {
			this.logIfDebug(`Setting error '${this.errorMessage}' to '${this.errorField}'`);
			res[this.errorField] = this.errorMessage;
		}
		return finalresult;
	}

	matches(regex: RegExp): ValidatorCondition {
		this.lastExpectation.toMatch(regex);
		return this;
	}

	isString(): ValidatorCondition {
		this.lastExpectation.toBeString();
		return this;
	}

	is(value: any): ValidatorCondition {
		this.lastExpectation.toBe(value);
		return this;
	}

	isGreaterThan(value: number): ValidatorCondition {
		this.lastExpectation.toBeGreaterThan(value);
		return this;
	}

	isLessThan(value: number): ValidatorCondition {
		this.lastExpectation.toBeLessThan(value);
		return this;
	}

	isArray(): ValidatorCondition {
		this.lastExpectation.toBeArray();
		return this;
	}

	isEmpty(): ValidatorCondition {
		this.lastExpectation.toBeEmpty();
		return this;
	}

	hasProperties(properties: Array<string>): ValidatorCondition {
		this.lastExpectation.toHaveProperties(properties);
		return this;
	}

	hasProperty(property: string): ValidatorCondition {
		this.lastExpectation.toHaveProperty(property);
		return this;
	}

	hasMinimumLength(length: number): ValidatorCondition {
		this.lastExpectation.toHaveMinimumLength(length);
		return this;
	}

	hasMaximumLength(length: number): ValidatorCondition {
		this.lastExpectation.toHaveMaximumLength(length);
		return this;
	}

	hasLengthBetween(min: number, max: number): ValidatorCondition {
		this.lastExpectation.toHaveLengthBetween(min, max);
		return this;
	}

	isCustom(fn: ValidatorFunction): ValidatorCondition {
		this.lastExpectation.toCustom(fn);
		return this;
	}

	isObject(): ValidatorCondition {
		this.lastExpectation.toBeObject();
		return this;
	}

	isNumeric() {
		this.lastExpectation.toBeNumeric();
		return this;
	}

	isNumber() {
		this.lastExpectation.toBeNumber();
		return this;
	}

	isNumberBetween(min: number, max: number) {
		this.lastExpectation.toBeNumberBetween(min, max);
		return this;
	}

	isNumberGreaterThan(value: number) {
		this.lastExpectation.toBeNumberGreaterThan(value);
		return this;
	}

	isNumberLessThan(value: number) {
		this.lastExpectation.toBeNumberLessThan(value);
		return this;
	}

	isBoolean() {
		this.lastExpectation.toBeBoolean();
		return this;
	}

	isEnum(values: Array<any>) {
		this.lastExpectation.toBeEnum(values);
		return this;
	}

	notRequired(): ValidatorCondition {
		this.lastExpectation.notRequired();
		return this;
	}

	each(): ValidatorCondition {
		this.lastExpectation.each();
		return this;
	}

	ifNot(errorMessage: string): ValidatorCondition {
		this.lastExpectation.ifNot(errorMessage);
		return this;
	}

	explain() {
		this.lastExpectation.explain();
		return this;
	}

	satisfies(expectations: Array<Validatable>): ValidatorCondition {
		this.lastExpectation.toSatisfy(expectations);
		return this;
	}

	error(field: string, message: string): ValidatorCondition {
		this.errorField = field;
		this.errorMessage = message;
		return this;
	}
}