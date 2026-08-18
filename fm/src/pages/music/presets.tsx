import { tl, trans } from '@/build/trans.ts';
import { PanelHead } from '@/components/text/head.tsx';
import { icons } from '@/components/shared/icon.tsx';
import { copy } from '@/build/tools.ts';
import tippy from 'tippy.js';

export function SymbolPresets() {
	const presets = [`“`, `”`, `—`, `‘`, `’`, `-`];
	const standards = [
		tl(trans.wiki_standard_tracks),
		tl(trans.wiki_standard_artists),
		tl(trans.wiki_standard_quotations),
	];

	return (
		<section class='wiki-presets-panel'>
			<PanelHead icon={icons.wiki}>
				{tl(trans.symbol_presets)}
			</PanelHead>
			<div class='presets'>
				{presets.map((preset) => <SymbolPreset preset={preset} />)}
			</div>
			<ul class='wiki-standards generic-list'>
				{standards.map((standard) => <li>{standard}</li>)}
			</ul>
		</section>
	);
}

interface SymbolPresetProps {
	preset: string;
}

function SymbolPreset({
	preset,
}: SymbolPresetProps) {
	const elem = (
		<div class='preset' onClick={() => copy(preset)}>
			{preset}
		</div>
	);

	tippy(elem, {
		content: tl(trans.click_to_copy),
		delay: [500, 0],
	});

	return elem;
}
