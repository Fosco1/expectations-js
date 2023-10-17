# expectations-js
A developer-friendly, no-dependency Typescript data-validation framework

## Installation

```bash
npm install expectations-js
```

## What does it do?
When dealing with user input, you cannot rely on the data to be valid.
This library allows you to easily validate data, and get a list of errors if the data is invalid.<br>
You just need to define a set of expectations to which your data should conform.
If it does not, you will get a list of errors, which you can then use to display to the user.<br>
This is particularly suited to form validation, but it can be used for any kind of data validation. (e.g. API responses)

## Usage

To get started, you can import these functions: 
```typescript
import { when, expect, validate, isValid } from '@fosco110/expectations-js';
```

You will then need to create an array, in which you can put your validation rules. 
```typescript
const expectations = [
	expect('name').toMatch(/^[a-zA-Z]+$/),
	when('age').isLessThan(18).expect('name').not.toEqual('John'),
]
```

To run the validation, you can use the `validate` function. 
```typescript
const data = {
	name: 'John',
	age: 17,
}
const res = validate(data, expectations);
```

If you need to check whether the data is valid, you can use the `isValid` function. 
```typescript
const valid = isValid(data, expectations);
```

## API
The `expect` function takes a key, and creates a `ValidatorExpectation` object. 
You can then chain methods to it, to create a validation rule. 
```typescript
expect('name').toMatch(/^[a-zA-Z]+$/)
```
By default, when you `expect` a key, it will be considered required. If you want to allow it to be undefined, you can use the `notRequired` method.
```typescript
expect('name').notRequired().toMatch(/^[a-zA-Z]+$/)
```
If you need to run an inverse check, just use `not`. 
```typescript
expect('name').not.toMatch(/^[a-zA-Z]+$/)
```
If you need to perform a validation on multiple items (e.g. an array), you can use the `each` method. 
```typescript
expect('names').each().toMatch(/^[a-zA-Z]+$/)
```
For more complex operations (e.g. two values dependent on eachother), use the `when` method.
```typescript
when('age').isLessThan(18).expect('name').not.is('John')
```
You can also chain the `ifNot` method to set a custom error message.
```typescript
expect('age').toBeLessThan(18).ifNot('You must be 18 or older')
```
If you put a `%key%` in the error message, it will be replaced with the value of the key.
If you need it capitalized, just use `%key.capitalize%`.
```typescript
expect('age').toBeLessThan(18).ifNot('%key.capitalize% must be 18 or older') // Age must be 18 or older
```
In case of more complex validation operations (e.g. an object, an object inside an array, an object inside another object), you can use SubExpectations.
```typescript
const data = {
	user: {
		name: 'John',
		age: 17,
	},
};
const expectations = [
	expect('user').toSatisfy([
		expect('name').toMatch(/^[a-zA-Z]+$/),
		expect('age').toBeGreaterThan(18),
	])
];
const res = validate(data, expectations);
/**
 * res = {
 * 	user: {
 * 		age: 'age must be greater than 18',
 * 	},
 * }
 */
```
You can chain these conditions with the `and` and `or` methods, and use the `error` method to set a custom error message.
```typescript
when('age').isLessThan(18).and('parentConsent').is(false).error('parentConsent', "You must have your parent's consent to use this service")
```
## Interpreting return values
The `validate` function returns an object, whose keys are set when a validation fails.
If the key corresponds to an array, it will by default create an empty array. Check for failures in the array, to see what went wrong. 
If it corresponds to an object, it will create an empty object. Again, check for failures in the object, to see what went wrong.
### Example
```typescript
const data = {
	name: 'John',
	age: 17,
	agreeToTerms: false,
}
const expectations = [
	expect('name').toMatch(/^[a-zA-Z]+$/),
	when('age').isLessThan(18).expect('name').not.toEqual('John').ifNot("Sorry John, you're too young"),
	expect('agreeToTerms').toBe(true).ifNot('You must agree to the terms'),
]
const res = validate(data, expectations);
```
In this example, the `res` object will look like this:
```typescript
{
	name: "Sorry John, you're too young",
	agreeToTerms: 'You must agree to the terms',
}
```
This means that the validation failed for the fields `name` and `agreeToTerms`.
> NOTE: The `age` field is not present in the `res` object, because the validation passed for that field.
> If you wanted to check for the user to be at least 18, you could put this expectation:
> ```typescript
> expect('age').toBeGreaterThan(17).ifNot("You must be 18 or older to use this service")
> ```
> or
> ```typescript
> expect('age').not.toBeLessThan(18).ifNot("You must be 18 or older to use this service")
> ```

## Debugging
If you need to debug your expectations, you can chain the `debug` method to any expectation.
```typescript
expect('name').debug().toMatch(/^[a-zA-Z]+$/)
```
> You can chain this anywhere, on the `when` function too.
> ```typescript
> when('age').debug().isLessThan(18).expect('name').not.toEqual('John')
> ```

