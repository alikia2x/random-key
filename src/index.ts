// Check if we are in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof window.crypto !== 'undefined';

const getRandomBytes = async (size: number): Promise<Uint8Array> => {
	try {
		if (isBrowser) {
			// Use the browser's Crypto API
			const array = new Uint8Array(size);
			window.crypto.getRandomValues(array);
			return array;
		} else {
			// Use Node.js crypto module
			const { randomBytes } = await import('crypto');
			return new Uint8Array(randomBytes(size));
		}
	} catch (error) {
		// Fallback to Math.random if both crypto APIs fail
		console.warn(
			`Crypto API is not available, the Math.random() pseudo-random number generator is being used. Please note that this is not cryptographically secure.`
		);
		const array = new Uint8Array(size);
		for (let i = 0; i < size; i++) {
			array[i] = Math.floor(Math.random() * 256);
		}
		return array;
	}
};

/**
 * Generates a random number between 0 and max (exclusive).
 * @param max - The upper limit for the random number.
 * @returns A random number between 0 and max.
 */
const rn = async (max: number): Promise<number> => {
	const rnBytes = await getRandomBytes(2);
	const randomNum = rnBytes[0] * 256 + rnBytes[1];
	return randomNum % max;
};

const digits = '0123456789';
const base62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
const base30 = '0123456789ABCDFHKLMNPQRSTUVWXYZ'; // 1-9, A-Z exclude(E, G, I, J, O) for human readability

/**
 * Generates a random string of specified length.
 * @param len - The length of the string to generate, default is 16.
 * @param chars - The character set to use for generating the string, default is base62.
 * @returns The generated random string.
 */
export const generate = async (len: number = 16, chars: string = base62): Promise<string> => {
	let key = '';
	const charsLen = chars.length;
	for (let i = 0; i < len; i++) {
		key += chars[await rn(charsLen)];
	}
	return key;
};

/**
 * Generates a random string of digits of specified length.
 * @param len - The length of the string to generate, default is 16.
 * @returns The generated random digit string.
 */
export const generateDigits = async (len: number = 16): Promise<string> => {
	return generate(len, digits);
};

/**
 * Generates a random Base30 string of specified length.
 * @param len - The length of the string to generate, default is 16.
 * @returns The generated random Base30 string.
 */
export const generateBase30 = async (len: number = 16): Promise<string> => {
	return generate(len, base30);
};
