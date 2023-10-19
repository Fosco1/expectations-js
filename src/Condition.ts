import ExpectationsJS, { ValidatorFunction } from "./ExpectationsJS";
import { Validatable } from "./Validatable";
import Expectation from "./Expectation";
import { ValidatorResult } from "./ValidatorResult";

enum LogicOperator {
	AND = "AND",
	OR = "OR"
}

type FieldErrorInfo = {
	field: string,
	message: string,
	set: boolean,
}

function makeFieldErrorObject(field: string, message: string): FieldErrorInfo {
	return {
		field,
		message,
		set: true,
	}
}

function makeEmptyFieldErrorObject(): FieldErrorInfo {
	return {
		field: '',
		message: '',
		set: false,
	}
}

export default class Condition implements Validatable {
	conditions: Array<Expectation>;
	expectations: Array<Expectation>;
	conditionOperators = Array<LogicOperator>();
	expectationOperators = Array<LogicOperator>();
	debugMode: Boolean = false;
	private errorInfo: {
		conditions: {
			met: FieldErrorInfo,
			notMet: FieldErrorInfo,
		},
		expectations: {
			met: FieldErrorInfo,
			notMet: FieldErrorInfo,
		}
	}

	constructor(key: string) {
		this.conditions = [new Expectation(key)];
		this.expectations = [];
		this.errorInfo = {
			conditions: {
				met: makeEmptyFieldErrorObject(),
				notMet: makeEmptyFieldErrorObject()
			},
			expectations: {
				met: makeEmptyFieldErrorObject(),
				notMet: makeEmptyFieldErrorObject()
			}
		}
	}

	logIfDebug(...args: any[]) {
		if(this.debugMode) {
			console.log(`[CONDITION]`, ...args);
		}
		return this;
	}

	get not(): Condition {
		this.lastCondition.not;
		return this;
	}

	get lastCondition() {
		return this.conditions[this.conditions.length - 1];
	}

	and(key: string): Condition {
		this.logIfDebug("AND", key);

		if(this.expectations.length > 0) {
			this.expectations.push(new Expectation(key));
			this.expectationOperators.push(LogicOperator.AND);
		} else {
			this.conditions.push(new Expectation(key));
			this.conditionOperators.push(LogicOperator.AND);
		}

		return this;
	}

	/**
	 * Adds a condition to the container.
	 * If a string is passed, it will be added to the conditions. If an Expectation is passed, it will be added to the expectations.
	 * Usage example:
	 * ```
	 * when('license_plate_missing').is(false).then(
	 * 		expect('license_plate').toBeString().ifNot('License must be a string.')
	 * ).or(
	 * 		expect('trailer_license_plate').toBeString().ifNot('Trailer license plate must be a string.')
	 * )
	 * @param val 
	 * @returns 
	 */
	or(val: Expectation | string): Condition {

		if(val instanceof Expectation) {
			this.logIfDebug("OR expecting", val.key, "to", val.validatorsList());
			this.expectations.push(val);
			this.expectationOperators.push(LogicOperator.OR);
		} else {
			this.logIfDebug("OR when", val);
			this.conditions.push(new Expectation(val));
		}

		return this;
	}

	debug(): Condition {
		this.debugMode = true;
		this.logIfDebug("--- Debug mode started");
		this.logIfDebug("Last expectation: ", this.lastCondition.key)
		return this;
	}

	then(expectations: Expectation | Array<Expectation>): Condition {
		if(!Array.isArray(expectations)) {
			expectations = [expectations];
		}
		this.logIfDebug("THEN called, the Condition container is now in expectation mode");
		expectations.forEach(expectation => {
			this.logIfDebug("\tExpecting", expectation.key, "to", expectation.validatorsList());
			this.expectations.push(expectation);
		})
		return this;
	}

	private setError(info: FieldErrorInfo, res: ValidatorResult) {
		if(info.set) {
			this.logIfDebug(`Setting error '${info.message}' to '${info.field}'`);
			res[info.field] = ExpectationsJS.processMessage(info.message, info.field);
		}
	}

	validate(data: any, res: ValidatorResult) {
		this.logIfDebug("[VALIDATING] conditions")

		let conditionsMet = true;
		this.conditions.some((expectation, index) => {
			let tempRes = {};
			if(this.debugMode) {
				expectation = expectation.debug();
			}
			expectation.validate(data, tempRes);
			const validated = ExpectationsJS.isValid(tempRes);
			this.logIfDebug(`Condition '${expectation.key}' to '${expectation.validatorsList()}' is ${validated ? "valid" : "invalid"}`);
			switch(this.conditionOperators[index]) {
				case LogicOperator.AND:
					this.logIfDebug("AND");
					conditionsMet = conditionsMet && validated;
					break;
				case LogicOperator.OR:
					this.logIfDebug("OR");
					conditionsMet = conditionsMet || validated;
					break;
				default:
					conditionsMet = validated;
					break;
			}
			return !conditionsMet;
		})
		if(!conditionsMet) {
			this.logIfDebug("Conditions are NOT met, skipping expectations")
			this.setError(this.errorInfo.conditions.notMet, res);
			return false;
		}

		this.setError(this.errorInfo.conditions.met, res);
		this.logIfDebug("Conditions are met, validating expectations")
		let expectationsMet = true;

		let expectationsRes = {};
		this.expectations.some((expectation, index) => {
			const tempRes = {};
			if(this.debugMode) {
				expectation = expectation.debug();
			}
			expectation.validate(data, tempRes);
			const validated = ExpectationsJS.isValid(tempRes);
			this.logIfDebug(`Expectation '${expectation.key}' to '${expectation.validatorsList()}' is ${validated ? "valid" : "invalid"}`);
			switch(this.conditionOperators[index]) {
				case LogicOperator.AND:
					this.logIfDebug("AND");
					expectationsMet = expectationsMet && validated;
					expectationsRes = {...expectationsRes, ...tempRes};
					break;
				case LogicOperator.OR:
					this.logIfDebug("OR");
					expectationsMet = expectationsMet || validated;
					expectationsRes = {...expectationsRes, ...tempRes};
					break;
				default:
					expectationsMet = validated;
					break;
			}
			return !expectationsMet;
		})

		if(!expectationsMet) {
			this.logIfDebug("Expectations are NOT met")
			if(this.errorInfo.expectations.notMet.set) {
				this.setError(this.errorInfo.expectations.notMet, res);
			} else {
				res = {...res, ...expectationsRes};
			}
			return false;
		}
		this.setError(this.errorInfo.expectations.met, res);
		this.logIfDebug("Expectations are met")

		return expectationsMet;
	}

	matches(regex: RegExp): Condition {
		this.lastCondition.toMatch(regex);
		return this;
	}

	isString(): Condition {
		this.lastCondition.toBeString();
		return this;
	}

	is(value: any): Condition {
		this.lastCondition.toBe(value);
		return this;
	}

	isGreaterThan(value: number): Condition {
		this.lastCondition.toBeGreaterThan(value);
		return this;
	}

	isLessThan(value: number): Condition {
		this.lastCondition.toBeLessThan(value);
		return this;
	}

	isArray(): Condition {
		this.lastCondition.toBeArray();
		return this;
	}

	isEmpty(): Condition {
		this.lastCondition.toBeEmpty();
		return this;
	}

	hasProperties(properties: Array<string>): Condition {
		this.lastCondition.toHaveProperties(properties);
		return this;
	}

	hasProperty(property: string): Condition {
		this.lastCondition.toHaveProperty(property);
		return this;
	}

	hasMinimumLength(length: number): Condition {
		this.lastCondition.toHaveMinimumLength(length);
		return this;
	}

	hasMaximumLength(length: number): Condition {
		this.lastCondition.toHaveMaximumLength(length);
		return this;
	}

	hasLengthBetween(min: number, max: number): Condition {
		this.lastCondition.toHaveLengthBetween(min, max);
		return this;
	}

	isCustom(fn: ValidatorFunction): Condition {
		this.lastCondition.toCustom(fn);
		return this;
	}

	isObject(): Condition {
		this.lastCondition.toBeObject();
		return this;
	}

	isNumeric() {
		this.lastCondition.toBeNumeric();
		return this;
	}

	isNumber() {
		this.lastCondition.toBeNumber();
		return this;
	}

	isNumberBetween(min: number, max: number) {
		this.lastCondition.toBeNumberBetween(min, max);
		return this;
	}

	isNumberGreaterThan(value: number) {
		this.lastCondition.toBeNumberGreaterThan(value);
		return this;
	}

	isNumberLessThan(value: number) {
		this.lastCondition.toBeNumberLessThan(value);
		return this;
	}

	isBoolean() {
		this.lastCondition.toBeBoolean();
		return this;
	}

	isEnum(values: Array<any>) {
		this.lastCondition.toBeEnum(values);
		return this;
	}

	notRequired(): Condition {
		this.lastCondition.notRequired();
		return this;
	}

	each(): Condition {
		this.lastCondition.each();
		return this;
	}

	explain() {
		this.lastCondition.explain();
		return this;
	}

	satisfies(expectations: Array<Validatable>): Condition {
		this.lastCondition.toSatisfy(expectations);
		return this;
	}

	onConditionsMet(field: string, message: string): Condition {
		this.errorInfo.conditions.met = makeFieldErrorObject(field, message);
		return this;
	}

	onConditionsNotMet(field: string, message: string): Condition {
		this.errorInfo.conditions.notMet = makeFieldErrorObject(field, message);
		return this;
	}

	onExpectationsMet(field: string, message: string): Condition {
		this.errorInfo.expectations.met = makeFieldErrorObject(field, message);
		return this;
	}
	
	onExpectationsNotMet(field: string, message: string): Condition {
		this.errorInfo.expectations.notMet = makeFieldErrorObject(field, message);
		return this;
	}
}