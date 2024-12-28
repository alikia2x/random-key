import { expect, test } from 'bun:test';
import { generate, generateDigits, generateBase30 } from '../src/index'; // Adjust the import path accordingly

test('generate creates a string of the specified length', async () => {
	const len = 10;
	const result = await generate(len);
	expect(result).toHaveLength(len);
});

test('generateDigits creates a string of digits of the specified length', async () => {
	const len = 10;
	const result = await generateDigits(len);
	expect(result).toHaveLength(len);
	expect(result).toMatch(/^\d+$/); // Check if the result contains only digits
});

test('generateBase30 creates a Base30 string of the specified length', async () => {
	const len = 10;
	const result = await generateBase30(len);
	expect(result).toHaveLength(len);
	expect(result).toMatch(/^[0-9ABCDFHKLMNPQRSTUVWXYZ]+$/); // Check if the result contains only Base30 characters
});
