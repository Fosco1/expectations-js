import ExpectationsJS from "./ExpectationsJS.js";
export function when(key) {
    return ExpectationsJS.when(key);
}
export function expect(key) {
    return ExpectationsJS.expect(key);
}
export function isValid(res) {
    return ExpectationsJS.isValid(res);
}
export function validate(expectations, data) {
    return ExpectationsJS.validate(expectations, data);
}
export function setDefaultMissingMessage(message) {
    return ExpectationsJS.defaultMissingMessage = message;
}
