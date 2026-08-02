import { tl, trans } from '@/build/trans';
import { icon, icons } from './icon';

export function beta_indicator() {
	return <label class='new-badge beta'>{tl(trans.beta)}</label>;
}

export function new_indicator() {
	return <label class='new-badge new colourful'>{tl(trans.new)}</label>;
}

export function click_indicator(action = tl(trans.click_for_more_options)) {
	return (
		<div class='click-action'>
			{icon({ name: icons.mouse, identifier: 'click-action-icon' })}
			{action}
		</div>
	);
}
