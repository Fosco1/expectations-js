import Expectations from "./Expectations";
import ValidatorExpectation from "./ValidatorExpectation";

export default class ValidatorCondition extends ValidatorExpectation {
	conditionKey?: string;
	data: any;

	constructor(key: string) {
		super(key);
	}

	expect(data: any, key: string): ValidatorExpectation {
		const res = Expectations.validate(this, data);
		const validated = Expectations.isValid(res);
		if (validated) {
			this.reset();
			this.conditionKey = key;
			return this;
		} else {
			return res[key];
		}
	}

	private conditionKeySet() {
		return this.conditionKey !== undefined;
	}

	private reset() {
		this.expectations = [];
		this.reverse = false;
	}
}