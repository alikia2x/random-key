import { expect, test } from 'bun:test';
import { generate, generateDigits, generateBase58, generateBase62, generateBase64 } from '../src/index';

const LENGTH = 10000;

test('generateDigits creates a string of digits of the specified length', async () => {
	const charSet = new Set();
	const result = await generateDigits(LENGTH);
	result.split('').forEach((char) => charSet.add(char));
	expect(result).toHaveLength(LENGTH);
	expect(result).toMatch(/^\d+$/);
	expect(charSet.size).toBe(10);
});

test('default generate() creates a Base58 string of the specified length', async () => {
	const charSet = new Set();
	const result = await generate(LENGTH);
	result.split('').forEach((char) => charSet.add(char));
	expect(result).toHaveLength(LENGTH);
	expect(result).toMatch(/^[1-9A-HJ-NP-Za-km-z]+$/);
	expect(charSet.size).toBe(58);
});

test('generateBase58 creates a Base58 string of the specified length', async () => {
	const charSet = new Set();
	const result = await generateBase58(LENGTH);
	result.split('').forEach((char) => charSet.add(char));
	expect(result).toHaveLength(LENGTH);
	expect(result).toMatch(/^[1-9A-HJ-NP-Za-km-z]+$/);
	expect(charSet.size).toBe(58);
});

test('generateBase62 creates a Base62 string of the specified length', async () => {
	const charSet = new Set();
	const result = await generateBase62(LENGTH);
	result.split('').forEach((char) => charSet.add(char));
	expect(result).toHaveLength(LENGTH);
	expect(result).toMatch(/^[0-9A-Za-z]+$/);
	expect(charSet.size).toBe(62);
});

test('generateBase64 creates a Base64 string of the specified length', async () => {
	const charSet = new Set();
	const result = await generateBase64(LENGTH);
	result.split('').forEach((char) => charSet.add(char));
	expect(result).toHaveLength(LENGTH);
	expect(result).toMatch(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/);
});
