import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{ ignores: ["bleh.user.js", "bleh.user.css", "bleh.css", "bleh.js"] },
	{
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			}
		}
	},
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,js,tsx}"],
		plugins: { js },
		extends: ["js/recommended"],
		languageOptions: { globals: globals.browser },
		rules: {
			"no-prototype-builtins": "off"
		}
	},
	{
		files: ["**/*.{ts,tsx,mts,cts}"],
		extends: [...tseslint.configs.recommended],
	},
	tseslint.configs.recommended,
	{ files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
	{ files: ["**/*.jsonc"], plugins: { json }, language: "json/jsonc", extends: ["json/recommended"] },
	{ files: ["**/*.json5"], plugins: { json }, language: "json/json5", extends: ["json/recommended"] },
	{
		files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"], rules: {
			"css/no-invalid-properties": "off",
			"css/use-baseline": "off",
			"css/no-important": "off",
			"css/font-family-fallbacks": "off"
		}
	},
]);
