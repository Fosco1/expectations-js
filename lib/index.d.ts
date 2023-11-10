import { Validatable } from "./Validatable";
import { ValidatorResult } from "./ValidatorResult";
export declare function when(key: string): import("./Condition").default;
export declare function expect(key: string): import("./Expectation").default;
export declare function isValid(res: ValidatorResult): boolean;
export declare function validate(expectations: Array<Validatable> | Validatable, data: any): any;
export declare function setDefaultMissingMessage(message: string): string;
