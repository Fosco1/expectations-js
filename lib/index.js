"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultMissingMessage = exports.validate = exports.isValid = exports.expect = exports.when = void 0;
const ExpectationsJS_1 = __importDefault(require("./ExpectationsJS"));
function when(key) {
    return ExpectationsJS_1.default.when(key);
}
exports.when = when;
function expect(key) {
    return ExpectationsJS_1.default.expect(key);
}
exports.expect = expect;
function isValid(res) {
    return ExpectationsJS_1.default.isValid(res);
}
exports.isValid = isValid;
function validate(expectations, data) {
    return ExpectationsJS_1.default.validate(expectations, data);
}
exports.validate = validate;
function setDefaultMissingMessage(message) {
    return ExpectationsJS_1.default.defaultMissingMessage = message;
}
exports.setDefaultMissingMessage = setDefaultMissingMessage;
