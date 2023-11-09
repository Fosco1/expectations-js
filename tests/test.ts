import { assert } from 'chai';
import ExpectationsJS from '../lib/ExpectationsJS.js';

describe('expect', () => {
    describe('ExpectationsJS.expect', () => {
        describe('ExpectationsJS.expect().not', () => {
            it('should negate the expectation', () => {
                const data = {
                    test: 'test'
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toBe('test1')
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
        }),
        describe('ExpectationsJS.expect().toMatch', () => {
            it('should validate if the value matches the regex', () => {
                const data = {
                    test: 'test'
                };
                const regex = /test/;
                const expectations = [
                    ExpectationsJS.expect('test').toMatch(regex)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value does not match the regex', () => {
                const data = {
                    test: 'test'
                };
                const regex = /test1/;
                const expectations = [
                    ExpectationsJS.expect('test').not.toMatch(regex)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
        }),
        describe('ExpectationsJS.expect().toBeString', () => {
            it('should validate if the value is a string', () => {
                const data = {
                    test: 'test'
                };
                const expectations = [
                    ExpectationsJS.expect('test').toBeString()
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value is not a string', () => {
                const data = {
                    test: 1
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toBeString()
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
        }),
        describe('ExpectationsJS.expect().toBeNumber', () => {
            it('should validate if the value is a number', () => {
                const data = {
                    test: 1
                };
                const expectations = [
                    ExpectationsJS.expect('test').toBeNumber()
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value is not a number', () => {
                const data = {
                    test: 'test'
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toBeNumber()
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value is numeric', () => {
                const data = {
                    test: '1'
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toBeNumber()
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
        })
        describe('ExpectationsJS.expect().toBeBoolean', () => {
            it('should validate if the value is a boolean', () => {
                const data = {
                    test: true
                };
                const expectations = [
                    ExpectationsJS.expect('test').toBeBoolean()
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value is not a boolean', () => {
                const data = {
                    test: 'test'
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toBeBoolean()
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value is truthy or falsy', () => {
                const data = {
                    test: 1,
                    test2: 0
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toBeBoolean(),
                    ExpectationsJS.expect('test2').not.toBeBoolean()
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
        }),
        describe('ExpectationsJS.expect().toBeObject', () => {
            it('should validate if the value is an object', () => {
                const data = {
                    test: {}
                };
                const expectations = [
                    ExpectationsJS.expect('test').toBeObject()
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value is not an object', () => {
                const data = {
                    test: 'test'
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toBeObject()
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
        }),
        describe('ExpectationsJS.expect().toBeArray', () => {
            it('should validate if the value is an array', () => {
                const data = {
                    test: []
                };
                const expectations = [
                    ExpectationsJS.expect('test').toBeArray()
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value is not an array', () => {
                const data = {
                    test: 'test'
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toBeArray()
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
        }),
        describe('ExpectationsJS.expect().toBeEmpty', () => {
            it('should validate if the array is empty', () => {
                const data = {
                    test: []
                };
                const expectations = [
                    ExpectationsJS.expect('test').toBeEmpty(),
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the array is not empty', () => {
                const data = {
                    test: [1]
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toBeEmpty(),
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
        }),
        describe('ExpectationsJS.expect().toBe', () => {
            it('should validate if the value is equal to the expectation', () => {
                const data = {
                    test: 'test'
                };
                const expectations = [
                    ExpectationsJS.expect('test').toBe('test')
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value is not equal to the expectation', () => {
                const data = {
                    test: 'test'
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toBe('test1')
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
        }),
        describe('ExpectationsJS.expect().toBeGreaterThan', () => {
            it('should validate if the value is greater than the expectation', () => {
                const data = {
                    test: 2
                };
                const expectations = [
                    ExpectationsJS.expect('test').toBeGreaterThan(1)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value is not greater than the expectation', () => {
                const data = {
                    test: 1
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toBeGreaterThan(2)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value is numeric', () => {
                const data = {
                    test: '1'
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toBeGreaterThan(2)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
        }),
        describe('ExpectationsJS.expect().toBeLessThan', () => {
            it('should validate if the value is less than the expectation', () => {
                assert.isTrue(typeof 1 === 'number')
                const data = {
                    test: 1
                };
                const expectations = [
                    ExpectationsJS.expect('test').toBeLessThan(2)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value is not less than the expectation', () => {
                const data = {
                    test: 2
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toBeLessThan(1)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value is numeric', () => {
                const data = {
                    test: '1'
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toBeLessThan(2)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
        }),
        describe('ExpectationsJS.expect().toBeBetween', () => {
            it('should validate if the value is between the expectations', () => {
                const data = {
                    test: 2
                };
                const expectations = [
                    ExpectationsJS.expect('test').toBeBetween(1, 3)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value is not between the expectations', () => {
                const data = {
                    test: 4
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toBeBetween(1, 3)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value is numeric', () => {
                const data = {
                    test: '2'
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toBeBetween(1, 3)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
        }),
        describe('ExpectationsJS.expect().toBeNumeric', () => {
            it('should validate if the value is numeric', () => {
                const data = {
                    test: '2',
                    test1: 2
                };
                const expectations = [
                    ExpectationsJS.expect('test').toBeNumeric(),
                    ExpectationsJS.expect('test1').toBeNumeric()
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value is not numeric', () => {
                const data = {
                    test: 'test',
                    test1: false
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toBeNumeric(),
                    ExpectationsJS.expect('test1').not.toBeNumeric()
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
        });
        describe('ExpectationsJS.expect().toHaveProperties', () => {
            it('should validate if the object has the properties', () => {
                const data = {
                    test: {
                        test1: 'test1'
                    }
                };
                const expectations = [
                    ExpectationsJS.expect('test').toHaveProperties(['test1'])
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the object does not have the properties', () => {
                const data = {
                    test: {
                        test1: 'test1'
                    }
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toHaveProperties(['test2'])
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
        });
        describe('ExpectationsJS.expect().toHaveProperty', () => {
            it('should validate if the object has the property', () => {
                const data = {
                    test: {
                        test1: 'test1'
                    }
                };
                const expectations = [
                    ExpectationsJS.expect('test').toHaveProperty('test1')
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the object does not have the property', () => {
                const data = {
                    test: {
                        test1: 'test1'
                    }
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toHaveProperty('test2')
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
        });
        describe('ExpectationsJS.expect().toHaveLength', () => {
            it('should validate if the value has the required length', () => {
                const data = {
                    test: 'test',
                    test1: [1, 2, 3, 4]
                };
                const expectations = [
                    ExpectationsJS.expect('test').toHaveLength(4),
                    ExpectationsJS.expect('test1').toHaveLength(4)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value does not have the required length', () => {
                const data = {
                    test: 'test',
                    test1: [1, 2, 3, 4]
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toHaveLength(5),
                    ExpectationsJS.expect('test1').not.toHaveLength(5)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not crash when the value is not a string or array', () => {
                const data = {
                    test: undefined
                };
                const expectations = [
                    ExpectationsJS.expect('test').toHaveLength(1)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isFalse(ExpectationsJS.isValid(result));
            });
        });
        describe('ExpectationsJS.expect().toHaveMinimumLength', () => {
            it('should validate if the value has the minimum length', () => {
                const data = {
                    test: 'test',
                    test1: [1, 2, 3, 4]
                };
                const expectations = [
                    ExpectationsJS.expect('test').toHaveMinimumLength(4),
                    ExpectationsJS.expect('test1').toHaveMinimumLength(4)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value does not have the minimum length', () => {
                const data = {
                    test: 'test',
                    test1: [1, 2, 3, 4]
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toHaveMinimumLength(5),
                    ExpectationsJS.expect('test1').not.toHaveMinimumLength(5)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
        });
        describe('ExpectationsJS.expect().toHaveMaximumLength', () => {
            it('should validate if the value has the maximum length', () => {
                const data = {
                    test: 'test',
                    test1: [1, 2, 3, 4]
                };
                const expectations = [
                    ExpectationsJS.expect('test').toHaveMaximumLength(4),
                    ExpectationsJS.expect('test1').toHaveMaximumLength(4)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value does not have the maximum length', () => {
                const data = {
                    test: 'test',
                    test1: [1, 2, 3, 4]
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toHaveMaximumLength(3),
                    ExpectationsJS.expect('test1').not.toHaveMaximumLength(3)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
        });
        describe('ExpectationsJS.expect().toHaveLengthBetween', () => {
            it('should validate if the value has the length between the expectations', () => {
                const data = {
                    test: 'test',
                    test1: [1, 2, 3, 4]
                };
                const expectations = [
                    ExpectationsJS.expect('test').toHaveLengthBetween(3, 5),
                    ExpectationsJS.expect('test1').toHaveLengthBetween(3, 5)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
            it('should not validate if the value does not have the length between the expectations', () => {
                const data = {
                    test: 'test',
                    test1: [1, 2, 3, 4]
                };
                const expectations = [
                    ExpectationsJS.expect('test').not.toHaveLengthBetween(4, 5),
                    ExpectationsJS.expect('test1').not.toHaveLengthBetween(4, 5)
                ];
                const result = ExpectationsJS.validate(expectations, data);
                assert.isTrue(ExpectationsJS.isValid(result));
            });
        });

        /** Functions to test:
         * toCustom
         * toBeEnum
         * notRequired
         * each
         * ifNot
         * validatorsList
         * explain
         * toSatisfy
         * ifMissing
         */
    })
});