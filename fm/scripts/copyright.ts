#!/usr/bin/env -S deno run --allow-read --allow-write

import { walk } from '@std/fs';
import { bold, cyan, dim, green, red, yellow } from '@std/fmt/colors';

const cfg = {
	project: 'bleh',
	author: 'katelyn and contributors',
	license: 'GPL-3.0-or-later',
	get licenseLine() {
		return `SPDX-License-Identifier: ${this.license}`;
	},
	yearRange: `2024-${new Date().getFullYear()}`,
	preferredStyle: 'slash' as 'jsdoc' | 'slash',
	description: 'an extension for the music site Last.fm',
	extensions: ['.ts', '.tsx', '.js'],
	skip: [
		/node_modules/,
		/\.git/,
		/copyright\.ts$/,
		/(static|assets)\//,
	],
};

const JSDOC_RE =
	/\/\*\*\s*\n(?:\s*\*[^\n]*\n)*?\s*\*\s*Copyright\s*\(c\)[^]*?\*\/\s*/;
const SLASH_RE = /\/\/\s*Copyright\s*\(c\)[^\n]*\n(\s*\/\/[^\n]*\n)*/;

function detect(content: string) {
	let match = content.match(JSDOC_RE);
	if (match) {
		return {
			exists: true,
			style: 'jsdoc' as const,
			header: match[0],
			rest: content.slice(match.index! + match[0].length).trimStart(),
		};
	}

	match = content.match(SLASH_RE);
	if (match) {
		return {
			exists: true,
			style: 'slash' as const,
			header: match[0],
			rest: content.slice(match.index! + match[0].length).trimStart(),
		};
	}

	return {
		exists: false,
		style: 'none' as const,
		header: '',
		rest: content.trimStart(),
	};
}

function generate(): string {
	if (cfg.preferredStyle === 'slash') {
		const description = cfg.description ? `, ${cfg.description}` : '';
		return `// ${cfg.project}${description}\n// Copyright (c) ${cfg.yearRange} ${cfg.author}\n// ${cfg.licenseLine}`;
	} else {
		return `/**\n * ${cfg.project}, ${cfg.description}\n * Copyright (c) ${cfg.yearRange} ${cfg.author}\n * ${cfg.licenseLine}\n */`;
	}
}

function validate(header: string): { correct: boolean; reasons: string[] } {
	const reasons: string[] = [];

	const yearRegex = new RegExp(`\\b${cfg.yearRange.replace('-', '\\-')}\\b`);
	if (!yearRegex.test(header)) {
		reasons.push(`year → "${cfg.yearRange}"`);
	}

	const authorRegex = new RegExp(`\\b${cfg.author}\\b`);
	if (!authorRegex.test(header)) {
		reasons.push(`author → "${cfg.author}"`);
	}

	const escapedLicense = cfg.licenseLine.replace(
		/[.*+?^${}()|[\]\\]/g,
		'\\$&',
	);
	const licenseRegex = new RegExp(`\\b${escapedLicense}\\b`);
	if (!licenseRegex.test(header)) {
		reasons.push(`license → "${cfg.licenseLine}"`);
	}

	return {
		correct: reasons.length === 0,
		reasons,
	};
}

async function processFile(
	path: string,
	dry: boolean,
): Promise<{ status: string; msg: string }> {
	const raw = await Deno.readTextFile(path);
	const content = raw.replaceAll('\r\n', '\n');
	const detected = detect(content);

	if (!detected.exists) {
		if (!dry) {
			const header = generate();
			await Deno.writeTextFile(path, `${header}\n\n${detected.rest}`);
		}
		return { status: 'added', msg: 'added copyright header' };
	}

	let needsUpdate = false;
	const reasons: string[] = [];

	if (detected.style !== cfg.preferredStyle) {
		needsUpdate = true;
		reasons.push(`style ${detected.style} → ${cfg.preferredStyle}`);
	}

	const check = validate(detected.header);
	if (!check.correct) {
		needsUpdate = true;
		reasons.push(...check.reasons);
	}

	if (needsUpdate) {
		if (!dry) {
			const header = generate();
			await Deno.writeTextFile(path, `${header}\n\n${detected.rest}`);
		}
		return { status: 'updated', msg: `${reasons.join(',')}` };
	}

	return { status: 'ok', msg: 'all good' };
}

async function main() {
	const args = Deno.args;
	const dry = args.includes('--dry') || args.includes('-n');
	const verbose = args.includes('--verbose') || args.includes('-v');
	const dir = args.find((a) => !a.startsWith('-')) || './';

	console.log(cyan(bold(`${cfg.project} copyright header management`)));
	console.log(dim(`  target: ${dir}`));
	console.log(dim(`  year range: ${cfg.yearRange}`));
	console.log(dim(`  author: ${cfg.author}`));
	console.log(dim(`  license: ${cfg.license}`));
	console.log(dim(`  preferred style: ${cfg.preferredStyle}`));
	console.log(dim(`  mode: ${dry ? 'dry run' : 'live'}\n`));

	const stats = { added: 0, updated: 0, ok: 0, errors: 0 };

	const walkOptions = {
		includeDirs: false,
		followSymlinks: false,
		exts: cfg.extensions,
		skip: cfg.skip,
	};

	for await (const entry of walk(dir, walkOptions)) {
		try {
			const result = await processFile(entry.path, dry);
			stats[result.status as keyof typeof stats] =
				(stats[result.status as keyof typeof stats] || 0) + 1;

			if (verbose || result.status !== 'ok') {
				const color = result.status === 'added'
					? green
					: result.status === 'updated'
					? yellow
					: dim;
				const sym = result.status === 'added'
					? '+'
					: result.status === 'updated'
					? '~'
					: '·';
				console.log(
					`  ${color(sym)} ${result.msg.padEnd(25)} ${
						dim(entry.path)
					}`,
				);
			}
		} catch (err) {
			stats.errors++;
			console.log(
				`  ${red('!')} ${red((err as Error).message)} ${
					dim(entry.path)
				}`,
			);
		}
	}

	console.log(cyan(bold('\nsummary')));
	console.log(`  ${green('+')} ${stats.added} added`);
	console.log(`  ${yellow('~')} ${stats.updated} updated`);
	console.log(`  ${dim('·')} ${stats.ok} ok`);
	console.log(`  ${red('!')} ${stats.errors} errors`);

	if (dry && (stats.added || stats.updated)) {
		console.log(
			yellow('\n  (this was a dry run, run without --dry to apply)'),
		);
	}

	if (stats.errors) Deno.exit(1);
}

if (import.meta.main) await main();
