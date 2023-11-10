import Expectation from "./Expectation.js";
import { ValidatorFunction } from "./ExpectationsJS.js";
import { Validatable } from "./Validatable.js";
import { ValidatorResult } from "./ValidatorResult.js";
declare enum LogicOperator {
    AND = "AND",
    OR = "OR"
}
export default class Condition implements Validatable {
    conditions: Array<Expectation>;
    expectations: Array<Expectation>;
    conditionOperators: LogicOperator[];
    expectationOperators: LogicOperator[];
    debugMode: Boolean;
    private errorInfo;
    constructor(key: string);
    logIfDebug(...args: any[]): this;
    get not(): Condition;
    get lastCondition(): Expectation;
    and(key: string): Condition;
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
    or(val: Expectation | string): Condition;
    debug(): Condition;
    then(expectations: Expectation | Array<Expectation>): Condition;
    private setError;
    validate(data: any, res: ValidatorResult): boolean;
    matches(regex: RegExp): Condition;
    isString(): Condition;
    is(value: any): Condition;
    isGreaterThan(value: number): Condition;
    isLessThan(value: number): Condition;
    isArray(): Condition;
    isEmpty(): Condition;
    hasProperties(properties: Array<string>): Condition;
    hasProperty(property: string): Condition;
    hasMinimumLength(length: number): Condition;
    hasMaximumLength(length: number): Condition;
    hasLengthBetween(min: number, max: number): Condition;
    isCustom(fn: ValidatorFunction): Condition;
    isObject(): Condition;
    isNumeric(): this;
    isNumber(): this;
    isNumberBetween(min: number, max: number): this;
    isNumberGreaterThan(value: number): this;
    isNumberLessThan(value: number): this;
    isBoolean(): this;
    isEnum(values: Array<any>): this;
    notRequired(): Condition;
    each(): Condition;
    explain(): this;
    satisfies(expectations: Array<Validatable>): Condition;
    onConditionsMet(field: string, message: string): Condition;
    onConditionsNotMet(field: string, message: string): Condition;
    onExpectationsMet(field: string, message: string): Condition;
    onExpectationsNotMet(field: string, message: string): Condition;
}
export {};
