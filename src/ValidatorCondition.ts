import Expectations, { ValidatorFunction } from "./Expectations";
import { Validatable } from "./Validatable";
import ValidatorExpectation from "./ValidatorExpectation";
import { ValidatorResult } from "./ValidatorResult";

enum LogicOperator {
	AND = "AND",
	OR = "OR"
}

export default class ValidatorCondition implements Validatable {
	conditions: Array<ValidatorExpectation>;
	expectations: Array<ValidatorExpectation>;
	operators = Array<LogicOperator>();
	debugMode: Boolean = false;
	errorField?: string;
	errorMessage?: string;

	constructor(key: string) {
		this.conditions = [new ValidatorExpectation(key)];
		this.expectations = [];
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
		return this.conditions[this.conditions.length - 1];
	}

	and(key: string): ValidatorCondition {
		this.logIfDebug("AND", key);
		this.operators.push(LogicOperator.AND);
		this.conditions.push(new ValidatorExpectation(key));
		return this;
	}

	or(key: string): ValidatorCondition {
		this.logIfDebug("OR", key);
		this.operators.push(LogicOperator.OR);
		this.conditions.push(new ValidatorExpectation(key));
		return this;
	}

	debug(): ValidatorCondition {
		this.debugMode = true;
		this.logIfDebug("--- Debug mode started");
		this.logIfDebug("Last expectation: ", this.lastExpectation.key)
		return this;
	}

	then(expectations: ValidatorExpectation | Array<ValidatorExpectation>): ValidatorCondition {
		if(!Array.isArray(expectations)) {
			expectations = [expectations];
		}
		this.logIfDebug("THEN");
		expectations.forEach(expectation => {
			this.logIfDebug("\tExpecting", expectation.key, "to", expectation.validatorsList());
			this.expectations.push(expectation);
		})
		return this;
	}

	validate(data: any, res: ValidatorResult) {
		this.logIfDebug("[VALIDATING] conditions")

		let finalResult = true;
		this.conditions.some((expectation, index) => {
			let tempRes = {};
			expectation.validate(data, tempRes);
			const validated = Expectations.isValid(tempRes);
			this.logIfDebug(`Conditions '${expectation.key}' to '${expectation.validatorsList()}' is ${validated ? "valid" : "invalid"}`);
			switch(this.operators[index]) {
				case LogicOperator.AND:
					this.logIfDebug("AND");
					finalResult = finalResult && validated;
					break;
				case LogicOperator.OR:
					this.logIfDebug("OR");
					finalResult = finalResult || validated;
					break;
				default:
					finalResult = validated;
					break;
			}
			return !finalResult;
		})
		if(finalResult) {
			this.logIfDebug("Conditions are valid, validating expectations")
			if(this.errorField && this.errorMessage) {
				this.logIfDebug(`Setting error '${this.errorMessage}' to '${this.errorField}'`);
				res[this.errorField] = Expectations.processMessage(this.errorMessage, this.errorField);
			}
			this.expectations.forEach((expectation) => {
				this.logIfDebug(`Expecting '${expectation.key}' to '${expectation.validatorsList()}'`);
				expectation.validate(data, res);
			})
		} else {
			this.logIfDebug("Conditions are NOT valid, skipping expectations")
		}
		return finalResult;
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