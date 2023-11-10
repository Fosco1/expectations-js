import Condition from "./Condition.js";
import Expectation from "./Expectation.js";
export default class ExpectationsJS {
    static validate(expectations, data) {
        const res = {};
        if (!Array.isArray(expectations)) {
            expectations = [expectations];
        }
        expectations.forEach((expectation) => {
            expectation.validate(data, res);
        });
        return res;
    }
    static processMessage(message, key) {
        message = message.replace(/%key%/g, key);
        message = message.replace(/%key.capitalize%/g, this.capitalize(key));
        return message;
    }
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    /**
     * Checks recursively if res has a property set which is a string.
     * If it has an array, checks each item with the same function.
     * If it has an object, checks it entirely with the same function.
     * @param res
     */
    static isValid(res) {
        for (let key in res) {
            if (typeof res[key] === "string") {
                return false;
            }
            if (Array.isArray(res[key])) {
                for (let i = 0; i < res[key].length; i++) {
                    if (!this.isValid(res[key][i])) {
                        return false;
                    }
                }
            }
            if (typeof res[key] === "object") {
                if (!this.isValid(res[key])) {
                    return false;
                }
            }
        }
        return true;
    }
    static expect(key) {
        return new Expectation(key);
    }
    static when(key) {
        return new Condition(key);
    }
}
ExpectationsJS.defaultMissingMessage = "Missing %key.capitalize%.";
export class ValidatorDescriptor {
    constructor(name, func) {
        this.name = name;
        this.function = func;
    }
}
