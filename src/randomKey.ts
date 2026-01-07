export const ALPHABETS = {
	digits: '0123456789',
	base62: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
	base58: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
	base64url: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_',
	hex: '0123456789abcdef'
};

const POOL_SIZE = 1024 * 4;

class EntropySource {
	private pool = new Uint8Array(POOL_SIZE);
	private offset = POOL_SIZE;

	/**
	 * Fills the internal pool using the best available CSPRNG.
	 */
	private refresh(): void {
		if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
			crypto.getRandomValues(this.pool);
		} else {
			console.warn('[random-key] Crypto API unavailable. Falling back to Math.random() (INSECURE).');
			for (let i = 0; i < POOL_SIZE; i++) {
				this.pool[i] = Math.floor(Math.random() * 256);
			}
		}
		this.offset = 0;
	}

	/**
	 * Returns a slice of random bytes.
	 */
	getNextBytes(size: number): Uint8Array {
		if (size > POOL_SIZE) {
			// If requested size is huge, don't use pool to avoid exhaustion
			const largeBuf = new Uint8Array(size);
			if (typeof crypto !== 'undefined') crypto.getRandomValues(largeBuf);
			return largeBuf;
		}

		if (this.offset + size > POOL_SIZE) {
			this.refresh();
		}

		const res = this.pool.slice(this.offset, this.offset + size);
		this.offset += size;
		return res;
	}
}

const entropy = new EntropySource();

/**
 * Higher-order function to create generators for specific alphabets.
 */
export const createGenerator = (alphabet: string) => {
	const alphabetLen = alphabet.length;
	// Masking technique to reduce bias while maintaining performance
	const mask = (2 << (31 - Math.clz32(alphabetLen - 1))) - 1;

	if (alphabetLen === 0) {
		return () => '';
	}

	return (len: number = 16): string => {
		if (len === 0) return '';
		if (!Number.isInteger(len) || len < 0) {
			throw new Error('Length must be a positive integer');
		}

		let result = '';
		while (result.length < len) {
			// Request a small batch of bytes to minimize "refresh" calls
			const bytes = entropy.getNextBytes(Math.ceil((len - result.length) * 1.5));
			for (let i = 0; i < bytes.length && result.length < len; i++) {
				const byte = bytes[i] & mask;
				if (byte < alphabetLen) {
					result += alphabet[byte];
				}
			}
		}
		return result;
	};
};

/**
 * Standard dynamic generator
 */
export const generate = (len: number = 16, alphabet: string = ALPHABETS.base58): string => {
	return createGenerator(alphabet)(len);
};

export const generateDigits = createGenerator(ALPHABETS.digits);
export const generateHex = createGenerator(ALPHABETS.hex);
export const generateBase62 = createGenerator(ALPHABETS.base62);
export const generateBase58 = createGenerator(ALPHABETS.base58);
export const generateBase64 = createGenerator(ALPHABETS.base64url);

/**
 * Returns raw random bytes (useful for buffers/salts)
 */
export const getRandomBytes = (size: number): Uint8Array => {
	if (size <= 0) return new Uint8Array(0);
	return entropy.getNextBytes(size);
};
