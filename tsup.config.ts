import { type Options, defineConfig } from 'tsup';

function generateConfig(jsx: boolean): Options {
	return {
		target: 'esnext',
		platform: 'browser',
		format: 'esm',
		clean: true,
		entry: ['./src/index.ts'],
		outDir: 'dist/',
		treeshake: true,
		replaceNodeEnv: true,
        dts: true,
	};
}

export default defineConfig([generateConfig(true)]);
