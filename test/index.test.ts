import { expect, test } from 'bun:test';
import {
	generate,
	generateDigits,
	generateBase58,
	generateBase62,
	generateBase64,
	generateHex,
	getRandomBytes
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
	expect(charSet.size).toBe(64);
});

test('generateHex creates a hexadecimal string of the specified length', async () => {
	const charSet = new Set();
	const result = await generateHex(LENGTH);
	result.split('').forEach((char) => charSet.add(char));
	expect(result).toHaveLength(LENGTH);
	expect(result).toMatch(/^[0-9a-f]+$/);
	expect(charSet.size).toBe(16);
});

test('generateHex with small length works correctly', async () => {
	const result = await generateHex(8);
	expect(result).toHaveLength(8);
	expect(result).toMatch(/^[0-9a-f]+$/);
});

test('generate with custom charact works', async () => {
	const customChars = 'ABCDEF';
	const result = await generate(10, customChars);
	expect(result).toHaveLength(10);
	expect(result).toMatch(/^[A-F]+$/);
	const charSet = new Set(result.split(''));
	expect(charSet.size).toBeLessThanOrEqual(6);
});

test('generate with single character set works', async () => {
	const singleChar = 'A';
	const result = await generate(10, singleChar);
	expect(result).toHaveLength(10);
	expect(result).toBe('AAAAAAAAAA');
});

test('generate with zero length returns empty string', async () => {
	const result = await generate(0);
	expect(result).toBe('');
});

test('generate with empty character set returns empty', async () => {
	const result = await generate(10, '');
	expect(result).toBe('');
});

test('generateBase64 with length 0 works', async () => {
	const result = await generateBase64(0);
	expect(result).toBe('');
});

test('generate with large length (100000) works', async () => {
	const largeLength = 100000;
	const result = await generate(largeLength);
	expect(result).toHaveLength(largeLength);
	expect(result).toMatch(/^[1-9A-HJ-NP-Za-km-z]+$/);
});

test('generate with negative length should throw', async () => {
	expect(generate(-10)).rejects.toThrow();
});

test('generateDigits with zero length returns empty string', async () => {
	const result = await generateDigits(0);
	expect(result).toBe('');
});

test('generateBase58 with zero length returns empty string', async () => {
	const result = await generateBase58(0);
	expect(result).toBe('');
});

test('generateBase62 with zero length returns empty string', async () => {
	const result = await generateBase62(0);
	expect(result).toBe('');
});

test('generateBase64 with zero length returns empty string', async () => {
	const result = await generateBase64(0);
	expect(result).toBe('');
});

test('generateHex with zero length returns empty string', async () => {
	const result = await generateHex(0);
	expect(result).toBe('');
});

test('generate with floating point length throw', async () => {
	expect(generate(10.5)).rejects.toThrow();
});

test('generate with string throw', async () => {
	expect(generate('10' as any)).rejects.toThrow();
});

test('generate with string length throw', async () => {
	expect(generate('10' as any)).rejects.toThrow();
});

test('generate with negative length throw', async () => {
	expect(generate(-10)).rejects.toThrow();
});

test('generate using a large character set', async () => {
	const result = await generate(LENGTH, generateCJKCharSet());
	expect(result).toHaveLength(LENGTH);
	expect(result).toMatch(/^[\u4E00-\u9FFF]+$/);
});

test('generateBase64 with various lengths works correctly', async () => {
	for (const length of [0, 4, 8, 12, 16, 20, 24]) {
		const result = await generateBase64(length);
		expect(result).toHaveLength(length);
		expect(result).toMatch(/^[A-Za-z0-9+/=]*$/);

		if (length > 0) {
			const padding = length % 4;
			if (padding === 2) {
				expect(result.endsWith('==')).toBe(true);
			} else if (padding === 3) {
				expect(result.endsWith('=')).toBe(true);
			}
		}
	}
});

test('generate produces uniform distribution', async () => {
	const length = 1000000;
	const chars = 'ABCD';
	const result = await generate(length, chars);

	const counts: Record<string, number> = {};
	for (const char of chars) {
		counts[char] = 0;
	}

	for (const char of result) {
		counts[char]++;
	}

	const expected = length / chars.length;
	for (const char of chars) {
		expect(Math.abs(counts[char] - expected) / expected).toBeLessThan(0.005);
	}
});

test('getRandomBytes handles edge cases', async () => {
	const zeroBytes = await getRandomBytes(0);
	expect(zeroBytes.length).toBe(0);

	const smallBytes = await getRandomBytes(1);
	expect(smallBytes.length).toBe(1);
	expect(smallBytes[0]).toBeGreaterThanOrEqual(0);
	expect(smallBytes[0]).toBeLessThan(256);

	const largeBytes = await getRandomBytes(1000);
	expect(largeBytes.length).toBe(1000);

	for (const byte of largeBytes) {
		expect(byte).toBeGreaterThanOrEqual(0);
		expect(byte).toBeLessThan(256);
	}
});

test('generate with single character returns that character', async () => {
	const char = 'X';
	const result = await generate(10, char);
	expect(result).toBe('XXXXXXXXXX');
});

test('generateBase64 produces correct padding', async () => {
	const length = 8;
	const result = await generateBase64(length);

	if (result.length > 0 && result.length % 4 === 0) {
		expect(result.endsWith('=')).toBe(false);
	}
});
