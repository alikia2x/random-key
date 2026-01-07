# random-key

`random-key` is a JavaScript library for generating random keys and strings in both browser and Node.js environments. It utilizes the built-in cryptographic capabilities of the environment to ensure that the generated values are as secure as possible. If the cryptographic APIs are unavailable, it falls back to a non-secure random number generator.

## Features

- Generate random strings of specified lengths using customizable character sets.
- Generate random digit strings (0-9).
- Generate random Base58 strings (improved human readability, no 0/O, I/l).
- Generate random Base62 strings (0-9, A-Z, a-z).
- Generate random Base64 strings.
- Generate random hexadecimal strings.
- Works seamlessly in both browser and Node.js environments.

## Installation

You can install it through these commands with your favorite package manager:

```bash
deno add jsr:@alikia/random-key
```

```bash
npm i @alikia/random-key
```

```bash
yarn i @alikia/random-key
```

```bash
pnpm i @alikia/random-key
```

```bash
bun add @alikia/random-key
```

## Usage

### Importing the Library

You can import the library in your JavaScript or TypeScript project as follows:

```javascript
import { generate, generateDigits, generateBase58, generateBase62, generateBase64, generateHex } from '@alikia/random-key';
```

### Generating Random Strings

To generate a random string of a specified length using the default Base58 character set:

```javascript
const randomString = await generate(16); // Generates a random string of length 16
console.log(randomString);
```

You can also specify a custom character set:

```javascript
const customChars = 'ABCDEF';
const randomCustomString = await generate(10, customChars); // Generates a random string of length 10 using custom characters
console.log(randomCustomString);
```

### Generating Random Digit Strings

To generate a random string consisting only of digits:

```javascript
const randomDigits = await generateDigits(10); // Generates a random digit string of length 10
console.log(randomDigits);
```

### Generating Random Hex Strings

To generate a random hexadecimal string:

```javascript
const randomHex = await generateHex(16); // Generates a random hex string of length 16
console.log(randomHex);
```

### Character Set Information

- **Base58**: Uses characters `123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz` (excludes 0, O, I, l for better readability)
- **Base62**: Uses characters `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`
- **Base64**: Standard Base64 encoding with padding
- **Digits**: Uses characters `0123456789`
- **Hex**: Hexadecimal encoding (0-9, a-f)

## Security

The library uses cryptographically secure random number generators:

- **Browser**: Uses `window.crypto.getRandomValues()` API
- **Node.js**: Uses Node.js `crypto.randomBytes()` module
- **Fallback**: If neither is available, falls back to `Math.random()` with a warning (not cryptographically secure)

For production use, ensure your environment supports the Crypto API for truly random values.

## Browser Compatibility

The library checks if it is running in a browser environment and uses the browser's Crypto API for generating random values. If the Crypto API is not available, it falls back to Node.js's crypto module or uses `Math.random()` as a last resort, which is not cryptographically secure.

## Version History

### v2.0.0
- Added `generateHex()` function for hexadecimal string generation
- Added detailed character set information documentation
- Improved security documentation
- Removed deprecated `generateBase30` function
- Updated default character set to Base58 for better human readability

### v1.x
- Initial release with basic random string generation functions

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.
