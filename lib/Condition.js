"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Expectation_1 = __importDefault(require("./Expectation"));
const ExpectationsJS_1 = __importDefault(require("./ExpectationsJS"));
var LogicOperator;
(function (LogicOperator) {
    LogicOperator["AND"] = "AND";
    LogicOperator["OR"] = "OR";
})(LogicOperator || (LogicOperator = {}));
function makeFieldErrorObject(field, message) {
    return {
        field,
        message,
        set: true,
    };
}
function makeEmptyFieldErrorObject() {
    return {
        field: '',
        message: '',
        set: false,
    };
}
class Condition {
    conditions;
    expectations;
    conditionOperators = Array();
    expectationOperators = Array();
    debugMode = false;
    errorInfo;
    constructor(key) {
        this.conditions = [new Expectation_1.default(key)];
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
        };
    }
    logIfDebug(...args) {
        if (this.debugMode) {
            console.log(`[CONDITION]`, ...args);
        }
        return this;
    }
    get not() {
        this.lastCondition.not;
        return this;
    }
    get lastCondition() {
        return this.conditions[this.conditions.length - 1];
    }
    and(key) {
        this.logIfDebug("AND", key);
        if (this.expectations.length > 0) {
            this.expectations.push(new Expectation_1.default(key));
            this.expectationOperators.push(LogicOperator.AND);
        }
        else {
            this.conditions.push(new Expectation_1.default(key));
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
    or(val) {
        if (val instanceof Expectation_1.default) {
            this.logIfDebug("OR expecting", val.key, "to", val.validatorsList());
            this.expectations.push(val);
            this.expectationOperators.push(LogicOperator.OR);
        }
        else {
            this.logIfDebug("OR when", val);
            this.conditions.push(new Expectation_1.default(val));
        }
        return this;
    }
    debug() {
        this.debugMode = true;
        this.logIfDebug("--- Debug mode started");
        this.logIfDebug("Last expectation: ", this.lastCondition.key);
        return this;
    }
    then(expectations) {
        if (!Array.isArray(expectations)) {
            expectations = [expectations];
        }
        this.logIfDebug("THEN called, the Condition container is now in expectation mode");
        expectations.forEach(expectation => {
            this.logIfDebug("\tExpecting", expectation.key, "to", expectation.validatorsList());
            this.expectations.push(expectation);
        });
        return this;
    }
    setError(info, res) {
        if (info.set) {
            this.logIfDebug(`Setting error '${info.message}' to '${info.field}'`);
            res[info.field] = ExpectationsJS_1.default.processMessage(info.message, info.field);
        }
    }
    validate(data, res) {
        this.logIfDebug("[VALIDATING] conditions");
        let conditionsMet = true;
        this.conditions.some((expectation, index) => {
            let tempRes = {};
            if (this.debugMode) {
                expectation = expectation.debug();
            }
            expectation.validate(data, tempRes);
            const validated = ExpectationsJS_1.default.isValid(tempRes);
            this.logIfDebug(`Condition '${expectation.key}' to '${expectation.validatorsList()}' is ${validated ? "valid" : "invalid"}`);
            switch (this.conditionOperators[index]) {
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
        });
        if (!conditionsMet) {
            this.logIfDebug("Conditions are NOT met, skipping expectations");
            this.setError(this.errorInfo.conditions.notMet, res);
            return false;
        }
        this.setError(this.errorInfo.conditions.met, res);
        this.logIfDebug("Conditions are met, validating expectations");
        let expectationsMet = true;
        let expectationsRes = {};
        this.expectations.some((expectation, index) => {
            const tempRes = {};
            if (this.debugMode) {
                expectation = expectation.debug();
            }
            expectation.validate(data, tempRes);
            const validated = ExpectationsJS_1.default.isValid(tempRes);
            this.logIfDebug(`Expectation '${expectation.key}' to '${expectation.validatorsList()}' is ${validated ? "valid" : "invalid"}`);
            switch (this.conditionOperators[index]) {
                case LogicOperator.AND:
                    this.logIfDebug("AND");
                    expectationsMet = expectationsMet && validated;
                    expectationsRes = { ...expectationsRes, ...tempRes };
                    break;
                case LogicOperator.OR:
                    this.logIfDebug("OR");
                    expectationsMet = expectationsMet || validated;
                    expectationsRes = { ...expectationsRes, ...tempRes };
                    break;
                default:
                    expectationsMet = validated;
                    break;
            }
            return !expectationsMet;
        });
        if (!expectationsMet) {
            this.logIfDebug("Expectations are NOT met");
            if (this.errorInfo.expectations.notMet.set) {
                this.setError(this.errorInfo.expectations.notMet, res);
            }
            else {
                res = { ...res, ...expectationsRes };
            }
            return false;
        }
        this.setError(this.errorInfo.expectations.met, res);
        this.logIfDebug("Expectations are met");
        return expectationsMet;
    }
    matches(regex) {
        this.lastCondition.toMatch(regex);
        return this;
    }
    isString() {
        this.lastCondition.toBeString();
        return this;
    }
    is(value) {
        this.lastCondition.toBe(value);
        return this;
    }
    isGreaterThan(value) {
        this.lastCondition.toBeGreaterThan(value);
        return this;
    }
    isLessThan(value) {
        this.lastCondition.toBeLessThan(value);
        return this;
    }
    isArray() {
        this.lastCondition.toBeArray();
        return this;
    }
    isEmpty() {
        this.lastCondition.toBeEmpty();
        return this;
    }
    hasProperties(properties) {
        this.lastCondition.toHaveProperties(properties);
        return this;
    }
    hasProperty(property) {
        this.lastCondition.toHaveProperty(property);
        return this;
    }
    hasMinimumLength(length) {
        this.lastCondition.toHaveMinimumLength(length);
        return this;
    }
    hasMaximumLength(length) {
        this.lastCondition.toHaveMaximumLength(length);
        return this;
    }
    hasLengthBetween(min, max) {
        this.lastCondition.toHaveLengthBetween(min, max);
        return this;
    }
    isCustom(fn) {
        this.lastCondition.toCustom(fn);
        return this;
    }
    isObject() {
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
    isNumberBetween(min, max) {
        this.lastCondition.toBeNumberBetween(min, max);
        return this;
    }
    isNumberGreaterThan(value) {
        this.lastCondition.toBeNumberGreaterThan(value);
        return this;
    }
    isNumberLessThan(value) {
        this.lastCondition.toBeNumberLessThan(value);
        return this;
    }
    isBoolean() {
        this.lastCondition.toBeBoolean();
        return this;
    }
    isEnum(values) {
        this.lastCondition.toBeEnum(values);
        return this;
    }
    notRequired() {
        this.lastCondition.notRequired();
        return this;
    }
    each() {
        this.lastCondition.each();
        return this;
    }
    explain() {
        this.lastCondition.explain();
        return this;
    }
    satisfies(expectations) {
        this.lastCondition.toSatisfy(expectations);
        return this;
    }
    onConditionsMet(field, message) {
        this.errorInfo.conditions.met = makeFieldErrorObject(field, message);
        return this;
    }
    onConditionsNotMet(field, message) {
        this.errorInfo.conditions.notMet = makeFieldErrorObject(field, message);
        return this;
    }
    onExpectationsMet(field, message) {
        this.errorInfo.expectations.met = makeFieldErrorObject(field, message);
        return this;
    }
    onExpectationsNotMet(field, message) {
        this.errorInfo.expectations.notMet = makeFieldErrorObject(field, message);
        return this;
    }
}
exports.default = Condition;
