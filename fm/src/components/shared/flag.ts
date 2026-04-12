import { html } from 'lighterhtml';
import tippy from 'tippy.js';

export function flag(code: string) {
    const url = `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`;

    const elem = html.node`
        <div class="country-flag" style="background-image: url(${url})">
            ${code} (flag)
        </div>
    `;

    tippy(elem, {
        content: code
    });

    return elem;
}