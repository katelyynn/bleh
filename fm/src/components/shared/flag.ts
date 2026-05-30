import { html } from 'lighterhtml';
import tippy from 'tippy.js';

export function flag(code: string, classname?: string) {
    const url = `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`;

    const elem = html.node`
        <div class="country-flag ${classname ? classname : ''}" style="background-image: url(${url})">
            ${code} (flag)
        </div>
    `;

    tippy(elem, {
        content: code
    });

    return elem;
}

export const convert_lang_to_country = {
    en: 'gb',
    sv: 'se',
    zh: 'cn',
    ja: 'jp',
    pt: 'br'
}