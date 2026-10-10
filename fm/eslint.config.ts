import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import promise from 'eslint-plugin-promise';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
	globalIgnores(['ext/', 'bleh.user.js', 'bleh.user.css', 'node_modules/']),

	js.configs.recommended,
	tseslint.configs.recommended,
	promise.configs['flat/recommended'],

	stylistic.configs.customize({
		indent: 'tab',
		semi: true,
		quotes: 'single',
		braceStyle: '1tbs',
	}),

	{
		languageOptions: { globals: globals.browser },
		plugins: { 'simple-import-sort': simpleImportSort },
		rules: {
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
		},
	},
]);
