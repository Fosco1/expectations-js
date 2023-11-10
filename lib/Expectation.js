import ExpectationsJS, { ValidatorDescriptor } from "./ExpectationsJS.js";
import { isValid } from "./index.js";
export default class Expectation {
    constructor(key) {
        this.validatorDescriptors = [];
        this.subExpectations = [];
        this.reverse = false;
        this.arrayMode = false;
        this.debugMode = false;
        this.required = true;
        this.propertyType = 'undefined';
        this.key = key;
        this.missingMessage = ExpectationsJS.defaultMissingMessage;
    }
    logIfDebug(...args) {
        if (this.debugMode) {
            console.log("[" + this.key + "]", ...args);
        }
    }
    getType(val) {
        const type = typeof val;
        if (type == 'object') {
            if (Array.isArray(val))
                return 'array';
            if (val === null)
                return 'null';
            return 'object';
        }
        if (type == "number" && isNaN(val))
            return 'NaN';
        return type;
    }
    defaultIfEmpty() {
        switch (this.propertyType) {
            case 'object':
                return {};
            case 'array':
                return [];
            default:
                return undefined;
        }
    }
    get not() {
        this.validatorDescriptors.push(new ValidatorDescriptor('not', (data, message = "") => {
            this.reverse = !this.reverse;
        }));
        return this;
    }
    debug() {
        this.debugMode = true;
        this.logIfDebug("--- debug mode started");
        return this;
    }
    validate(data, res) {
        this.propertyType = this.getType(data[this.key]);
        if ((data[this.key] === undefined || data[this.key] === null)) {
            if (this.required) {
                this.logIfDebug("field required, but data is undefined or null, throwing error");
                res[this.key] = ExpectationsJS.processMessage(this.missingMessage, this.key);
                return;
            }
            this.logIfDebug("data is empty but not required, skipping checks");
            return;
        }
        this.validatorDescriptors.map((descriptor) => {
            if (!this.arrayMode) {
                this.logIfDebug(`running expectation ${descriptor.name} with`, data[this.key], `as ${this.key}`);
                let lastRes = descriptor.function(data[this.key]);
                if (lastRes) {
                    res[this.key] = lastRes;
                }
            }
            else {
                this.logIfDebug("[ARRAY] array mode is on, validating each of:", data[this.key]);
                if (!Array.isArray(data[this.key])) {
                    this.logIfDebug("[ARRAY] data is not an array, skipping");
                    return;
                }
                res[this.key] = this.defaultIfEmpty();
                data[this.key].forEach((item, dataArrayIndex) => {
                    this.logIfDebug(`[ARRAY] running expectation ${descriptor.name} with`, data[this.key], `as ${this.key} at index ${dataArrayIndex}`);
                    let lastRes = descriptor.function(item, res[this.key][dataArrayIndex]);
                    if (lastRes) {
                        res[this.key][dataArrayIndex] = lastRes;
                    }
                    else {
                        res[this.key][dataArrayIndex] = {};
                    }
                    this.subExpectations.forEach((expectation) => {
                        expectation.validate(item, res[this.key][dataArrayIndex]);
                    });
                });
            }
        });
        if (!this.arrayMode) {
            this.logIfDebug("[SUBEXP] running subexpectations with", data[this.key], `as ${this.key}`);
            this.subExpectations.forEach((expectation) => {
                if (!res[this.key]) {
                    res[this.key] = this.defaultIfEmpty();
                }
                expectation.validate(data[this.key], res[this.key]);
                this.logIfDebug("[SUBEXP] validating item", data[this.key], isValid(res[this.key]) ? 'was' : 'was NOT', 'successful');
            });
        }
        else {
            this.logIfDebug("[SUBEXP] [ARRAY] array mode is on, validating array", data[this.key]);
            if (!Array.isArray(data[this.key])) {
                this.logIfDebug("[SUBEXP] [ARRAY] data is not an array, skipping");
                return;
            }
            res[this.key] = this.defaultIfEmpty();
            data[this.key].forEach((item, dataArrayIndex) => {
                this.logIfDebug(`[SUBEXP] [ARRAY] running subexp check with`, data[this.key], `as ${this.key} at index ${dataArrayIndex}`);
                this.subExpectations.forEach((expectation) => {
                    if (!res[this.key][dataArrayIndex]) {
                        res[this.key][dataArrayIndex] = {};
                    }
                    expectation.validate(item, res[this.key][dataArrayIndex]);
                });
            });
        }
    }
    processFailure(message) {
        if (this.reverse)
            return;
        return ExpectationsJS.processMessage(message, this.key);
    }
    toMatch(regex) {
        this.validatorDescriptors.push(new ValidatorDescriptor('toMatch', (data, message = "Doesn't match the regular expression") => {
            if (!regex.test(data)) {
                return this.processFailure(message);
            }
        }));
        return this;
    }
    toBeString() {
        this.validatorDescriptors.push(new ValidatorDescriptor('toBeString', (data, message = "Should be a string") => {
            if (typeof data !== "string") {
                return this.processFailure(message);
            }
        }));
        return this;
    }
    toBe(value) {
        this.validatorDescriptors.push(new ValidatorDescriptor('toBe', (data, message = `Should match ${value}`) => {
            if (data !== value) {
                return this.processFailure(message);
            }
        }));
        return this;
    }
    toBeGreaterThan(value) {
        return this.toBeNumberGreaterThan(value);
    }
    toBeLessThan(value) {
        return this.toBeNumberLessThan(value);
    }
    toBeBetween(min, max) {
        return this.toBeNumberBetween(min, max);
    }
    toBeArray() {
        this.validatorDescriptors.push(new ValidatorDescriptor('toBeArray', (data, message = "Should be an array") => {
            if (!Array.isArray(data)) {
                return this.processFailure(message);
            }
        }));
        return this;
    }
    toBeEmpty() {
        this.validatorDescriptors.push(new ValidatorDescriptor('toBeEmpty', (data, message = "Should be empty") => {
            if (data.length > 0) {
                return this.processFailure(message);
            }
        }));
        return this;
    }
    toHaveProperties(properties) {
        this.validatorDescriptors.push(new ValidatorDescriptor('toHaveProperties', (data, message = "Does not have the required properties.") => {
            let missingProperties = [];
            properties.forEach((property) => {
                if (!data.hasOwnProperty(property)) {
                    missingProperties.push(property);
                }
            });
            if (missingProperties.length > 0) {
                return this.processFailure(message);
            }
        }));
        return this;
    }
    toHaveProperty(property) {
        this.validatorDescriptors.push(new ValidatorDescriptor('toHaveProperty', (data, message = "Does not have the required property") => {
            if (!data.hasOwnProperty(property)) {
                return this.processFailure(message);
            }
        }));
        return this;
    }
    toHaveLength(length) {
        this.validatorDescriptors.push(new ValidatorDescriptor('toHaveLength', (data, message = `Does not meet the required length (required: ${length})`) => {
            if (data.length !== length) {
                return this.processFailure(message);
            }
        }));
        return this;
    }
    toHaveMinimumLength(length) {
        this.validatorDescriptors.push(new ValidatorDescriptor('toHaveMinimumLength', (data, message = `Is too short (minimum: ${length})`) => {
            if (data.length < length) {
                return this.processFailure(message);
            }
        }));
        return this;
    }
    toHaveMaximumLength(length) {
        this.validatorDescriptors.push(new ValidatorDescriptor('toHaveMaximumLength', (data, message = `Is too long (maximum: ${length})`) => {
            if (data.length > length) {
                return this.processFailure(message);
            }
        }));
        return this;
    }
    toHaveLengthBetween(minimum, maximum) {
        this.validatorDescriptors.push(new ValidatorDescriptor('toHaveLengthBetween', (data, message = `Does not meet the required length (minimum: ${minimum}, maximum: ${maximum})`) => {
            if (data.length < minimum || data.length > maximum) {
                return this.processFailure(message);
            }
        }));
        return this;
    }
    toCustom(fn) {
        this.validatorDescriptors.push(new ValidatorDescriptor('toCustom', fn));
        return this;
    }
    toBeObject() {
        this.validatorDescriptors.push(new ValidatorDescriptor('toBeObject', (data, message = "Should be an object") => {
            if (typeof data !== "object") {
                return this.processFailure(message);
            }
        }));
        return this;
    }
    toBeNumeric() {
        this.validatorDescriptors.push(new ValidatorDescriptor('toBeNumeric', (data, message = "Should be numeric") => {
            if (typeof data === "number")
                return;
            if (isNaN(data) || isNaN(parseFloat(data))) {
                return this.processFailure(message);
            }
        }));
        return this;
    }
    toBeNumber() {
        this.validatorDescriptors.push(new ValidatorDescriptor('toBeNumber', (data, message = "Should be a number") => {
            if (typeof data !== "number" || isNaN(data)) {
                return this.processFailure(message);
            }
        }));
        return this;
    }
    toBeNumberBetween(min, max) {
        this.validatorDescriptors.push(new ValidatorDescriptor('toBeNumberBetween', (data, message = `Should be a number between ${min} and ${max}`) => {
            if ((typeof data !== "number" || isNaN(data) || data < min || data > max)) {
                return this.processFailure(message);
            }
        }));
        return this;
    }
    toBeNumberGreaterThan(value) {
        this.validatorDescriptors.push(new ValidatorDescriptor('toBeNumberGreaterThan', (data, message = `Should be a number greater than ${value}`) => {
            if ((typeof data !== "number" || isNaN(data) || data <= value)) {
                return this.processFailure(message);
            }
        }));
        return this;
    }
    toBeNumberLessThan(value) {
        this.validatorDescriptors.push(new ValidatorDescriptor('toBeNumberLessThan', (data, message = `Should be a number smaller than ${value}`) => {
            if ((typeof data !== "number" || isNaN(data) || data >= value)) {
                return this.processFailure(message);
            }
        }));
        return this;
    }
    toBeBoolean() {
        this.validatorDescriptors.push(new ValidatorDescriptor('toBeBoolean', (data, message = "Should be a boolean value") => {
            if (typeof data !== "boolean") {
                return this.processFailure(message);
            }
        }));
        return this;
    }
    toBeEnum(values) {
        this.validatorDescriptors.push(new ValidatorDescriptor('toBeEnum', (data, message = "Should be one of the enum values") => {
            if (!values.includes(data)) {
                return this.processFailure(message);
            }
        }));
        return this;
    }
    // Control functions
    notRequired() {
        this.logIfDebug("Not required called, setting required to false");
        this.required = false;
        return this;
    }
    each() {
        this.validatorDescriptors.push(new ValidatorDescriptor('each', (data, message = "Should be an array") => {
            if (!Array.isArray(data)) {
                return this.processFailure(message);
            }
            this.logIfDebug("each called, setting array mode to true");
            this.arrayMode = true;
        }));
        return this;
    }
    ifNot(errorMessage) {
        const lastDescriptor = this.validatorDescriptors[this.validatorDescriptors.length - 1];
        const lastDescriptorFunctionClone = lastDescriptor.function;
        lastDescriptor.function = (data) => {
            return lastDescriptorFunctionClone(data, errorMessage);
        };
        return this;
    }
    validatorsList() {
        return this.validatorDescriptors.map((descriptor) => {
            return descriptor.name;
        }).join(", ");
    }
    explain() {
        this.logIfDebug("validation process:", this.validatorsList());
        return this;
    }
    toSatisfy(expectations) {
        this.subExpectations = expectations;
        return this;
    }
    ifMissing(message) {
        this.missingMessage = message;
        return this;
    }
}
