import { html } from 'lighterhtml';

export function radio({ name, value, values = {} }) {
    let buttons = [];

    let elem = html.node`
        <div class="primary-selections">
        ${Object.entries(values).map(([key, val]) => {
            const icon = val.icon;

            let input;
            const button = html.node`
                <div class="setting v2 standalone" data-type="radio" data-value=${key} onclick=${() => {
                    update_radio(key);
                }}>
                    <div class="radio-cont">
                        <input type="radio" name=${name} value=${key} required ref=${(el) => (input = el)}>
                        <div class="radio" aria-checked=${value == key} />
                    </div>
                    ${
                        icon ?
                            html.node`
                                <div class="icon">
                                    <div class="bleh-icon" style="--icon: var(--${icon})" />
                                </div>
                            `
                        :   ''
                    }
                    <div class="heading">
                        <h5>${typeof val.name == 'object' ? tl(val.name) : val.name}</h5>
                    </div>
                </div>
            `;

            input.checked = value == key;

            buttons.push(button);
            return button;
        })}
        </div>
    `;

    function update_radio(val) {
        buttons.forEach((btn) => {
            btn.querySelector('input').checked =
                btn.getAttribute('data-value') == val;
            btn.querySelector('.radio').setAttribute(
                'aria-checked',
                btn.getAttribute('data-value') == val
            );
        });
    }

    return elem;
}

export function radio_convert(existing) {
    if (!existing) return {};

    let values = {};

    existing.forEach((item) => {
        const input = item.querySelector('input');
        const label = item.querySelector('label');

        values[input.value] = {
            name: label.textContent.trim()
        };
    });

    return values;
}
