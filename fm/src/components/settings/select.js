//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html, render } from 'lighterhtml';
import { tl, trans } from '@/build/trans';
import tippy from 'tippy.js';

unsafeWindow._update_inbuilt_select = function (id, value) {
    update_inbuilt_select(id, value);
};
export function update_inbuilt_select(id, value) {
    document.body.setAttribute(`data-bleh--inbuilt-${id}`, value);
}

export function select(values, initial = '', name = '', func = null, blend = false, title_func = null, hide = false) {
    let select;
    let button;

    if (!values || values.length == 0) return html.node`
        <div class="alert alert-error no-margin">
            ${tl(trans.value_failed_to_load).replace('{v}', 'Select')}
            <br />Invalid values passed or length of zero
        </div>
    `;

    if (initial == '')
        initial = values.find((v) => 'value' in v)?.value ?? initial;

    let container = html.node`
        <div class="select-wrap custom-selector">
            <select ref=${(el) => (select = el)} name=${name}>
                ${values.map((value) => {
                    if (value.value == null) return html.node``;

                    return html.node`
                        <option value=${value.value} selected=${value.value == initial}>${value.text}</option>
                    `;
                })}
            </select>
            <button class="select-button ${blend ? 'link-select blend-v2-btn' : ''}" data-hide=${hide} type="button" ref=${(el) => (button = el)} />
        </div>
    `;

    let menu = tippy(button, {
        theme: 'select-menu',
        content: html.node``,
        placement: 'bottom',
        interactive: true,
        interactiveBorder: 10,
        trigger: 'click',
        appendTo: document.body,

        onShow(instance) {
            if (values.length > 15) {
                setTimeout(() => {
                    instance.popper
                        .querySelector('[aria-checked="true"]')
                        .scrollIntoView({
                            behavior: 'instant',
                            block: 'center',
                            container: 'nearest'
                        });
                }, 1);
            }
        }
    });

    set_select(initial, false);

    container.set = (val) => {
        set_select(val);
    };

    container.value = () => {
        return select.value;
    };

    return container;

    function set_select(selected, bubble = true) {
        render(button, html`${tl(trans.unavailable)}`);

        values.some((value) => {
            if (value.value == selected) {
                if (!title_func) {
                    render(button, html`${value.text}`);
                } else {
                    render(button, title_func(value));
                }

                return false;
            }
        });

        select.value = selected;

        if (name != '')
            document.body.setAttribute(
                `data-bleh--inbuilt-id_${name}`,
                selected
            );

        if (func && bubble) {
            func(selected);
            menu.hide();
        }

        menu.setContent(html.node`
            ${values.map((value) => {
                if (value.value == null) {
                    return html.node`
                        <div class="select-header">
                            ${value.text}
                        </div>
                    `;
                }

                return html.node`
                    <button class="btn dropdown-menu-clickable-item select-item" aria-checked=${selected == value.value} onclick=${() => set_select(value.value)}>
                        ${value.text}
                    </button>
                `;
            })}
        `);
    }
}

export function select_prepare(element) {
    let values = [];

    element.querySelectorAll('option').forEach((option) => {
        values.push({
            value: option.value,
            text: option.textContent
        });
    });

    return values;
}

export function select_prepare_list(list, icon = null) {
    return list.map((item) => {
        if (typeof item === 'string') return { value: item, text: item, icon };

        return item;
    });
}

export function select_prepare_convert_from_setting(list) {
    return Object.entries(list).map(([key, val]) => ({
        value: key,
        text: val.name
    }));
}

function select_fail(e = null) {
    return html.node`
        <div class="alert alert-error">
            ${tl(trans.value_failed_to_load).replace('{v}', tl(trans.select_component))}
            ${e ? html`<br />${e.message}` : ''}
        </div>
    `;
}

export function custom_select(select, element_to_append) {
    console.info(select);
    let id = select.getAttribute('id');
    let value = select.value;
    let value_objects = select.querySelectorAll('option');

    let menu_list = document.createElement('div');
    value_objects.forEach((object) => {
        let object_value = object.getAttribute('value');
        let object_text = object.textContent;

        let item = document.createElement('button');
        item.classList.add(
            'btn',
            'dropdown-menu-clickable-item',
            'select-item'
        );
        item.setAttribute(
            'onclick',
            `_set_custom_select_value('${id}', '${object_value}')`
        );
        item.setAttribute('data-value', object_value);
        item.setAttribute('type', 'button');
        item.textContent = object_text;

        menu_list.appendChild(item);
    });

    let button = document.createElement('button');
    button.classList.add('select-button');
    button.setAttribute('id', `select-${id}`);
    button.setAttribute('type', 'button');
    button.textContent = menu_list.querySelector(
        `[data-value="${value}"]`
    ).textContent;

    let theme_menu_item = tippy(button, {
        theme: 'select-menu',
        content: html.node([menu_list.innerHTML]),
        placement: 'bottom',
        interactive: true,
        interactiveBorder: 10,
        trigger: 'click',

        onShow(instance) {
            update_custom_select(instance.popper, select.value);
        }
    });

    element_to_append.appendChild(button);
}

unsafeWindow._set_custom_select_value = function (select_id, value) {
    let select = document.getElementById(select_id);

    select.value = value;

    console.info(select, `#select-${select_id}`);

    update_custom_select(
        document.getElementById(`select-${select_id}`)._tippy.popper,
        value,
        select_id
    );
    document.body.setAttribute(
        `data-bleh--inbuilt-${select_id}`,
        value
    );
};
function update_custom_select(
    element = document.body,
    value = '',
    select_id = ''
) {
    let btns = element.querySelectorAll('.dropdown-menu-clickable-item');
    btns.forEach((btn) => {
        if (btn.getAttribute('data-value') != value) {
            btn.classList.remove('active');
        } else {
            btn.classList.add('active');
            //btn.scrollIntoView(true);

            /*let y = btn.getBoundingClientRect().top + element.scrollY;
            element.scroll({
                top: y,
                behavior: 'smooth'
            });*/

            let sel_button = document.body.querySelector(
                `#select-${select_id}`
            );

            console.log(sel_button);

            if (!sel_button) return;
            sel_button.textContent = btn.textContent;
        }
    });
}

unsafeWindow._update_inbuilt_selection = function (id, index) {
    document.getElementById(id).selectedIndex = index;
    update_inbuilt_select(id, document.getElementById(id).value);
};
