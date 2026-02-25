import { html } from "lighterhtml"

interface icon {
    name: string,
    identifier?: string,
    use_mask?: boolean
}

export function icon({ name, identifier, use_mask = true }: icon) {
    const elem = html.node`
        <span class="bleh-icon" data-type=${name}>
            ${name} (icon)
        </span>
    `;

    if (use_mask) elem.classList.add('use-mask');
    if (identifier) elem.classList.add(`bleh-icon-${identifier}`);

    return elem;
}
