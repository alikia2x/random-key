const digits = '0123456789';
const base62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const base58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

const getCrypto = async (): Promise<Crypto | undefined> => {
	if (typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
		return globalThis.crypto;
	}

	// 2. Node.js fallback
	try {
		// @ts-ignore
		const { webcrypto } = await import('crypto');
		return webcrypto as unknown as Crypto;
	} catch (e) {
		return undefined;
	}
};

export const getRandomBytes = async (size: number): Promise<Uint8Array> => {
	if (size <= 0) return new Uint8Array(0);

	const crypto = await getCrypto();

	if (crypto) {
		const array = new Uint8Array(size);
		crypto.getRandomValues(array);
		return array;
	}

	// Fallback
	console.warn(
		`[random-key] Crypto API unavailable. Using Math.random() (INSECURE) as fallback.`
	);
	const array = new Uint8Array(size);
	for (let i = 0; i < size; i++) {
		array[i] = Math.floor(Math.random() * 256);
	}
	return array;
};

const toHex = (bytes: Uint8Array): string => {
    // Use Buffer if available
    if (typeof Buffer !== 'undefined') {
        return Buffer.from(bytes).toString('hex');
    }
    
	let result = '';
    const len = bytes.length;
	for (let i = 0; i < len; i++) {
		const hex = bytes[i].toString(16);
		result += hex.length === 1 ? '0' + hex : hex;
	}
	return result;
};

const toBase64 = (bytes: Uint8Array): string => {
    // 1. Using Buffer if available
	if (typeof Buffer !== 'undefined') {
		return Buffer.from(bytes).toString('base64');
	}

    // 2. Convert bytes into a string
	let binary = '';
	const len = bytes.length;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}

    // 3. Browser environment
	if (typeof globalThis !== 'undefined' && typeof globalThis.btoa === 'function') {
		return globalThis.btoa(binary);
	}

    // 4. Simple Base64 Polyfill
    const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let output = "";
    let i = 0;
    while (i < len) {
        const c1 = bytes[i++];
        const c2 = bytes[i++];
        const c3 = bytes[i++];
        const e1 = c1 >> 2;
        const e2 = ((c1 & 3) << 4) | (c2 >> 4);
        const e3 = ((c2 & 15) << 2) | (c3 >> 6);
        const e4 = c3 & 63;
        output += b64.charAt(e1) + b64.charAt(e2) + 
                  (isNaN(c2) ? "=" : b64.charAt(e3)) + 
                  (isNaN(c3) ? "=" : b64.charAt(e4));
    }
    return output;
};

// -----------------------------------------------------------------------------
// Core Generators
// -----------------------------------------------------------------------------

/**
 * Generates a random string of specified length.
 */
export const generate = async (len: number = 16, chars: string = base58): Promise<string> => {
	if (!Number.isInteger(len) || len < 0) {
		throw new Error('Length must be a non-negative integer');
	}
	if (len === 0) return '';
    if (chars.length === 0) return '';

	const charsLen = chars.length;
    
    const crypto = await getCrypto();
    
    const result = new Array(len);

    if (crypto) {
        const randomValues = new Uint32Array(len);
        crypto.getRandomValues(randomValues);
        for (let i = 0; i < len; i++) {
            result[i] = chars[randomValues[i] % charsLen];
        }
    } else {
        for (let i = 0; i < len; i++) {
            result[i] = chars[Math.floor(Math.random() * charsLen)];
        }
    }

	return result.join('');
};

/**
 * Helper to factory generic generators
 */
export const generateWithCharSet = (chars: string = base58): ((len?: number) => Promise<string>) => {
	return (len: number = 16) => generate(len, chars);
};

/**
 * Generates a random hex string.
 */
export const generateHex = async (len: number = 16): Promise<string> => {
	if (!Number.isInteger(len) || len < 0) throw new Error('Length must be a non-negative integer');
    if (len === 0) return '';
    
	// 1 byte = 2 hex chars. So we need ceil(len / 2) bytes.
	const bytesNeeded = Math.ceil(len / 2);
	const bytes = await getRandomBytes(bytesNeeded);
	return toHex(bytes).slice(0, len);
};

/**
 * Generates a random Base64 string.
 */
export const generateBase64 = async (len: number = 16): Promise<string> => {
	if (!Number.isInteger(len) || len < 0) throw new Error('Length must be a non-negative integer');
    if (len === 0) return '';

    // Calculate required bytes to produce 'len' base64 characters
    // Logic: 4 chars <= 3 bytes. 
    // If we want exact length, strict math is tricky due to padding.
    // Simpler approach: Get enough bytes to cover the length, convert, then slice.
    // 3 bytes -> 4 chars. X chars -> X * 0.75 bytes.
    const bytesNeeded = Math.ceil(len * 0.75);
    
    const bytes = await getRandomBytes(bytesNeeded);
    // Convert to base64 and ensure URL safety or standard padding handling if needed.
    // Standard base64 may have padding '='.
    const base64 = toBase64(bytes);
    
    return base64.slice(0, len);
};

export const generateDigits = generateWithCharSet(digits);
export const generateBase58 = generateWithCharSet(base58);
export const generateBase62 = generateWithCharSet(base62);
