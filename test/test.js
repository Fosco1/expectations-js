import { assert } from 'chai';
import ExpectationsJS from '../lib/ExpectationsJS.js';

describe('expect', function () {
    describe('ExpectationsJS.expect', function () {
        /** Functions to test:
         * toMatch
         * toBeString
         * toBe
         * toBeGreaterThan
         * toBeLessThan
         * toBeArray
         * toBeEmpty
         * toHaveProperties
         * toHaveProperty
         * toHaveMinimumLength
         * toHaveMaximumLength
         * toHaveLengthBetween
         * toCustom
         * toBeObject
         * toBeNumeric
         * toBeNumber
         * toBeNumberBetween
         * toBeNumberGreaterThan
         * toBeNumberLessThan
         * toBeBoolean
         * toBeEnum
         * notRequired
         * each
         * ifNot
         * validatorsList
         * explain
         * toSatisfy
         * ifMissing
         */
        it('should return true if the value matches the regex', function () {
            var value = 'test';
            var regex = /test/;
            var result = ExpectationsJS.expect(value).toMatch(regex);
            assert.equal(result, true);
        });
    });
});