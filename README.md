# random-key

`random-key` is a JavaScript library for generating random keys and strings in both browser and Node.js environments. It utilizes the built-in cryptographic capabilities of the environment to ensure that the generated values are as secure as possible. If the cryptographic APIs are unavailable, it falls back to a non-secure random number generator.

## Features

- Generate random strings of specified lengths using customizable character sets.
- Generate random digit strings.
- Generate random Base30 strings for improved human readability.
- Works seamlessly in both browser and Node.js environments.

## Installation

This package was published to [JSR](https://jsr.io/) only. 
You can install it through these commands with your favorite package manager:

```bash
deno add jsr:@alikia/random-key
```

```bash
npx jsr add @alikia/random-key
```

```bash
yarn dlx jsr add @alikia/random-key
```

```bash
pnpm dlx jsr add @alikia/random-key
```

```bash
bunx jsr add @alikia/random-key
```

## Usage

### Importing the Library

You can import the library in your JavaScript or TypeScript project as follows:

```javascript
import { generate, generateDigits, generateBase30 } from '@alikia/random-key';
```

### Generating Random Strings

To generate a random string of a specified length using the default Base62 character set:

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

### Generating Random Base30 Strings

To generate a random Base30 string:

```javascript
const randomBase30 = await generateBase30(10); // Generates a random Base30 string of length 10
console.log(randomBase30);
```

## Browser Compatibility

The library checks if it is running in a browser environment and uses the browser's Crypto API for generating random values. If the Crypto API is not available, it falls back to Node.js's crypto module or uses `Math.random()` as a last resort, which is not cryptographically secure.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.
