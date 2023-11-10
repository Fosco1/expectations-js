import { Validatable } from "./Validatable.js";
import { ValidatorResult } from "./ValidatorResult.js";
export declare function when(key: string): import("./Condition.js").default;
export declare function expect(key: string): import("./Expectation.js").default;
export declare function isValid(res: ValidatorResult): boolean;
export declare function validate(expectations: Array<Validatable> | Validatable, data: any): any;
export declare function setDefaultMissingMessage(message: string): string;
