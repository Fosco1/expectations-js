import Condition from "./Condition.js";
import Expectation from "./Expectation.js";
import { Validatable } from "./Validatable.js";
import { ValidatorResult } from "./ValidatorResult.js";
export default class ExpectationsJS {
    static defaultMissingMessage: string;
    static validate(expectations: Array<Validatable> | Validatable, data: any): any;
    static processMessage(message: string, key: string): string;
    private static capitalize;
    /**
     * Checks recursively if res has a property set which is a string.
     * If it has an array, checks each item with the same function.
     * If it has an object, checks it entirely with the same function.
     * @param res
     */
    static isValid(res: ValidatorResult): boolean;
    static expect(key: string): Expectation;
    static when(key: string): Condition;
}
export declare class ValidatorDescriptor {
    name: string;
    function: ValidatorFunction;
    constructor(name: string, func: ValidatorFunction);
}
export declare type ValidatorFunction = (data: any, message?: string) => string | undefined | void;
