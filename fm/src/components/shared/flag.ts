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

interface flag_candidate_data {
    'iso-3166-1-codes'?: string[],
    'iso-3166-2-codes'?: string[],
}

export function flag_candidates(country: string, data: flag_candidate_data) {
    if (data['iso-3166-1-codes']) {
        return data['iso-3166-1-codes'][0];
    } else if (data['iso-3166-2-codes']) {
        return data['iso-3166-2-codes'][0];
    }

    return country;
}
