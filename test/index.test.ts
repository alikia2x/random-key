import { expect, test } from 'bun:test';
import {
	generate,
	generateDigits,
	generateBase58,
	generateBase62,
	generateBase64,
	generateHex,
	getRandomBytes,
	ALPHABETS
} from '../src/randomKey';

const LENGTH = Math.floor(Math.random() * 2_500) * 4 + 10_000;

const generateCJKCharSet = () => {
	let result = '';
	const start = 0x4e00;
	const end = 0x9fff;

	for (let codePoint = start; codePoint <= end; codePoint++) {
		result += String.fromCodePoint(codePoint);
	}

	return result;
};

test('generateDigits creates a string of digits of the specified length', () => {
	const charSet = new Set();
	const result = generateDigits(LENGTH);
	result.split('').forEach((char) => charSet.add(char));
	expect(result).toHaveLength(LENGTH);
	expect(result).toMatch(/^\d+$/);
	expect(charSet.size).toBe(10);
});

test('default generate() creates a Base58 string of the specified length', () => {
	const charSet = new Set();
	const result = generate(LENGTH);
	result.split('').forEach((char) => charSet.add(char));
	expect(result).toHaveLength(LENGTH);
	expect(result).toMatch(/^[1-9A-HJ-NP-Za-km-z]+$/);
	expect(charSet.size).toBe(58);
});

test('generateBase58 creates a Base58 string of the specified length', () => {
	const charSet = new Set();
	const result = generateBase58(LENGTH);
	result.split('').forEach((char) => charSet.add(char));
	expect(result).toHaveLength(LENGTH);
	expect(result).toMatch(/^[1-9A-HJ-NP-Za-km-z]+$/);
	expect(charSet.size).toBe(58);
});

test('generateBase62 creates a Base62 string of the specified length', () => {
	const charSet = new Set();
	const result = generateBase62(LENGTH);
	result.split('').forEach((char) => charSet.add(char));
	expect(result).toHaveLength(LENGTH);
	expect(result).toMatch(/^[0-9A-Za-z]+$/);
	expect(charSet.size).toBe(62);
});

test('generateBase64 creates a Base64 string of the specified length', () => {
	const charSet = new Set();
	const result = generateBase64(LENGTH);
	result.split('').forEach((char) => charSet.add(char));
	expect(result).toHaveLength(LENGTH);
	expect(result).toMatch(/^[A-Za-z0-9\-_]+$/);
	expect(charSet.size).toBe(64);
});

test('generateHex creates a hexadecimal string of the specified length', () => {
	const charSet = new Set();
	const result = generateHex(LENGTH);
	result.split('').forEach((char) => charSet.add(char));
	expect(result).toHaveLength(LENGTH);
	expect(result).toMatch(/^[0-9a-f]+$/);
	expect(charSet.size).toBe(16);
});

test('generateHex with small length works correctly', () => {
	const result = generateHex(8);
	expect(result).toHaveLength(8);
	expect(result).toMatch(/^[0-9a-f]+$/);
});

test('generate with custom charact works', () => {
	const customChars = 'ABCDEF';
	const result = generate(10, customChars);
	expect(result).toHaveLength(10);
	expect(result).toMatch(/^[A-F]+$/);
	const charSet = new Set(result.split(''));
	expect(charSet.size).toBeLessThanOrEqual(6);
});

test('generate with single character set works', () => {
	const singleChar = 'A';
	const result = generate(10, singleChar);
	expect(result).toHaveLength(10);
	expect(result).toBe('AAAAAAAAAA');
});

test('generate with zero length returns empty string', () => {
	const result = generate(0);
	expect(result).toBe('');
});

test('generate with empty character set returns empty', () => {
	const result = generate(10, '');
	expect(result).toBe('');
});

test('generateBase64 with length 0 works', () => {
	const result = generateBase64(0);
	expect(result).toBe('');
});

test('generate with large length (100000) works', () => {
	const largeLength = 100000;
	const result = generate(largeLength);
	expect(result).toHaveLength(largeLength);
	expect(result).toMatch(/^[1-9A-HJ-NP-Za-km-z]+$/);
});

test('generate with negative length should throw', () => {
	expect(() => generate(-10)).toThrow();
});

test('generateDigits with zero length returns empty string', () => {
	const result = generateDigits(0);
	expect(result).toBe('');
});

test('generateBase58 with zero length returns empty string', () => {
	const result = generateBase58(0);
	expect(result).toBe('');
});

test('generateBase62 with zero length returns empty string', () => {
	const result = generateBase62(0);
	expect(result).toBe('');
});

test('generateBase64 with zero length returns empty string', () => {
	const result = generateBase64(0);
	expect(result).toBe('');
});

test('generateHex with zero length returns empty string', () => {
	const result = generateHex(0);
	expect(result).toBe('');
});

test('generate with floating point length throw', () => {
	expect(() => generate(10.5)).toThrow();
});

test('generate with string throw', () => {
	expect(() => generate('10' as any)).toThrow();
});

test('generate with negative length throw', () => {
	expect(() => generate(-10)).toThrow();
});

test('generate using a large character set', () => {
	const result = generate(LENGTH, generateCJKCharSet());
	expect(result).toHaveLength(LENGTH);
	expect(result).toMatch(/^[\u4E00-\u9FFF]+$/);
});

test('getRandomBytes handles edge cases', () => {
	const zeroBytes = getRandomBytes(0);
	expect(zeroBytes.length).toBe(0);

	const smallBytes = getRandomBytes(1);
	expect(smallBytes.length).toBe(1);
	expect(smallBytes[0]).toBeGreaterThanOrEqual(0);
	expect(smallBytes[0]).toBeLessThan(256);

	const largeBytes = getRandomBytes(1000);
	expect(largeBytes.length).toBe(1000);

	for (const byte of largeBytes) {
		expect(byte).toBeGreaterThanOrEqual(0);
		expect(byte).toBeLessThan(256);
	}
});

test('generate with single character returns that character', () => {
	const char = 'X';
	const result = generate(10, char);
	expect(result).toBe('XXXXXXXXXX');
});

test('generateBase64 produces correct padding', () => {
	const length = 8;
	const result = generateBase64(length);

	if (result.length > 0 && result.length % 4 === 0) {
		expect(result.endsWith('=')).toBe(false);
	}
});
