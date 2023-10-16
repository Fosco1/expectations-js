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
	when('age').isLessThan(18).expect('name').not().toEqual('John'),
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
If you need to run an inverse check, just call the `not` method. 
```typescript
expect('name').not().toMatch(/^[a-zA-Z]+$/)
```
An `and` method is also available. It is not necessary, but it can make the code more readable. 
```typescript
expect('name').toMatch(/^[a-zA-Z]+$/).and().not().toEqual('John')
```
If you need to perform a validation on multiple items (e.g. an array), you can use the `each` method. 
```typescript
expect('names').each().toMatch(/^[a-zA-Z]+$/)
```
For more complex operations (e.g. two values dependent on eachother), use the `when` method.
```typescript
when('age').isLessThan(18).expect('name').not().toEqual('John')
```
You can also chain the `ifNot` method to set a custom error message.
```typescript
expect('age').toBeLessThan(18).ifNot('You must be 18 or older')
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
	when('age').isLessThan(18).expect('name').not().toEqual('John').ifNot("Sorry John, you're too young"),
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
> expect('age').not().toBeLessThan(18).ifNot("You must be 18 or older to use this service")
> ```