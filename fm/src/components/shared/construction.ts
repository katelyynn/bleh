import { html } from 'lighterhtml';
import { icon, icons } from './icon';
import { tl, trans } from '@/build/trans';

export function under_construction() {
	return html.node`
        <div class="under-construction colourful">
            ${icon({ name: icons.construction })}
            <p>${tl(trans.under_construction)}</p>
        </div>
    `;
}
