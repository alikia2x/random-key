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
			`[random-key] Crypto API is not available, the Math.random() pseudo-random number generator is being used. Please note that this is not cryptographically secure.`
		);
		const array = new Uint8Array(size);
		for (let i = 0; i < size; i++) {
			array[i] = Math.floor(Math.random() * 256);
		}
		return array;
	}
};

const digits = '0123456789';
const base62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const base58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/**
 * Generates a random string of specified length.
 * @param len - The length of the string to generate, default is 16.
 * @param chars - The character set to use for generating the string, default is base58.
 * @returns The generated random string.
 */
export const generate = async (len: number = 16, chars: string = base58): Promise<string> => {
	const charsLen = chars.length;
	const randomValues = await getRandomBytes(len * 2); // Generate enough random bytes for the entire string
	const keyArray = new Array(len);

	for (let i = 0; i < len; i++) {
		const randomNum = (randomValues[i * 2] << 8) | randomValues[i * 2 + 1]; // Combine two bytes into a 16-bit number
		keyArray[i] = chars[randomNum % charsLen];
	}

	return keyArray.join('');
};

function base64LengthToBytesLength(base64Length: number): number {
	if (base64Length % 4 !== 0) {
		throw new Error(`Base64 string length must be a multiple of 4, but got ${base64Length}`);
	}
	const padding = base64Length === 0 ? 0 : (4 - (base64Length % 4)) % 4;
	return (base64Length * 3) / 4 - padding;
}

export const factoryHelper = (chars: string = base58): ((len?: number) => Promise<string>) => {
	return (len: number = 16) => generate(len, chars);
};

/**
 * Generates a random hex string of specified length.
 * @param len - The length of the string to generate, default is 16.
 * @returns The generated random hex string.
 */
export const generateHex = async (len: number = 16): Promise<string> => {
	return Buffer.from(await getRandomBytes(len)).toString('hex');
};

/**
 * Generates a random string of digits of specified length.
 * @param len - The length of the string to generate, default is 16.
 * @returns The generated random digit string.
 */
export const generateDigits = factoryHelper(digits);

/**
 * Generates a random Base58 string of specified length.
 * @param len - The length of the string to generate, default is 16.
 * @returns The generated random Base58 string.
 */
export const generateBase58 = factoryHelper(base58);

/**
 * Generates a random Base62 string of specified length.
 * @param len - The length of the string to generate, default is 16.
 * @returns The generated random Base62 string.
 */
export const generateBase62 = factoryHelper(base62);

/**
 * Generates a random Base64 string of specified length.
 * @param len - The length of the string to generate, default is 16.
 * @returns The generated random Base64 string.
 */
export const generateBase64 = async (len: number = 16): Promise<string> => {
	return Buffer.from(await getRandomBytes(base64LengthToBytesLength(len))).toString('base64');
};
