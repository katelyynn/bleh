//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import {
    inbuilt_settings,
    settings,
    settings_base,
    settings_store,
    settings_template
} from './build/config';
import { log } from './build/log';
import { page, reload_pending } from './build/page';
import { stored_season } from './build/seasonal';
import { tl, trans } from './build/trans';
import { chart_reflow, load_chart_colours } from './chart';
import { notify } from './components/notify';
import { load_skus } from './pages/bleh_config';
import { bleh_glacier_date_graph_generate } from './pages/glacier';
import { compile_settings, save_setting } from './components/settings.js';

// load settings
export function load_settings(skip = false) {
    if (!skip) {
        for (let setting in settings_store) {
            // assign default if missing
            if (settings[setting] == null)
                settings[setting] = structuredClone(settings_store[setting].default);
        }

        if (!settings.version) settings.version = 10000000;
    }

    if (!settings.theme_type) {
        if (settings.theme == 'light' || settings.theme == 'ink')
            settings.theme_type = 'light';
        else settings.theme_type = 'dark';
    }

    // migrates old settings
    if (settings.version < 2025.0929) {
        if (settings.seasonal_particles == true)
            settings.seasonal_particles = 'all';
        else if (settings.seasonal_particles == false)
            settings.seasonal_particles = 'none';

        if (settings.seasonal_particles_reduced == true) {
            settings.seasonal_particles = 'less';
            delete settings.seasonal_particles_reduced;
        } else if (settings.seasonal_particles_reduced == false) {
            delete settings.seasonal_particles_reduced;
        }

        if (settings.font_weight == 480 || settings.font_weight == 440)
            settings.font_weight = settings_store.font_weight.default;
        if (
            settings.font_weight_medium == 650 ||
            settings.font_weight_medium == 570
        )
            settings.font_weight_medium =
                settings_store.font_weight_medium.default;
        if (
            settings.font_weight_bold == 730 ||
            settings.font_weight_bold == 760 ||
            settings.font_weight_bold == 680
        )
            settings.font_weight_bold = settings_store.font_weight_bold.default;
    }

    if (settings.version < 2026.0201) {
        if (settings.noise == 0.5) settings.noise = settings_store.noise.default;
    }

    if (Number.isInteger(settings.list_view)) {
        if (settings.list_view == 0) {
            settings.list_view = 'list';
        } else {
            settings.list_view = 'cards';
        }
    }

    if (settings.profile_shortcut) {
        settings.friends = [settings.profile_shortcut];
        settings.starred_friend = settings.profile_shortcut;

        localStorage.removeItem('bleh_profile_shortcut_avi');
        delete settings.profile_shortcut;
    }

    // save setting into body
    for (let setting in settings) {
        if (
            (setting == 'hue' || setting == 'sat' || setting == 'lit') &&
            settings.hue == settings_store.hue.default &&
            settings.sat == settings_store.sat.default &&
            settings.lit == settings_store.lit.default
        )
            continue;

        if (settings_store[setting] && settings_store[setting].css)
            document.body.style.setProperty(
                `--${settings_store[setting].css}`,
                `${settings[setting]}${settings_store[setting].suffix || ''}`
            );
        document.documentElement.setAttribute(
            `data-bleh--${setting}`,
            `${settings[setting]}`
        );
    }

    load_skus();

    // save to settings
    compile_settings();

    // override theme when browsing listening reports
    if (document.body.classList.contains('user-dashboard-layout')) {
        document.documentElement.setAttribute('data-bleh--theme', 'oled');
        page.state.settings_reload = true;
    }

    load_chart_colours();
}

// theme
export function toggle_theme() {
    if (page.subpage.startsWith('listening-report')) return;

    let current_theme = settings.theme;

    if (current_theme == 'dark') current_theme = 'darker';
    else if (current_theme == 'darker') current_theme = 'oled';
    else if (current_theme == 'oled' || current_theme == 'classic')
        current_theme = 'light';
    else if (current_theme == 'light') current_theme = 'ink';
    else if (current_theme == 'ink') current_theme = 'dark';

    // save value
    save_setting('theme_schedule', false);
    save_setting('theme', current_theme);
}

// settings-page specific
function reset_all() {
    for (let item in settings_base) reset_item(item);
}

export function refresh_all(search = document) {
    for (let item in settings_base)
        update_item(item, settings[item], false, search);
}

function reset_item(item) {
    update_item(item, settings_base[item].value);
}

export function update_params(params = {}) {
    for (let item in params) {
        update_item(item, params[item]);
    }
}

unsafeWindow._reset_all = function () {
    reset_all();
};
unsafeWindow._reset_item = function (item) {
    reset_item(item);
};
unsafeWindow._update_params = function (params = {}) {
    update_params(params);
};
unsafeWindow._update_item = function (item, value) {
    update_item(item, value);
};

function update_item(item, value, modify = true, search = document) {
    let container = search.querySelector(`#container-${item}`);

    if (container) console.info(container);
    else if (
        settings_base[item].type != 'slider' &&
        settings_base[item].type != 'options'
    )
        return;

    try {
        // is this a new value?
        let new_value = false;
        if (value != settings[item]) new_value = true;

        if (
            (settings_base[item].require_reload == true ||
                (settings_base[item].require_reload == 'partial' &&
                    page.type != 'bleh_settings')) &&
            new_value
        )
            request_reload();

        if (settings_base[item].type == 'slider' && modify)
            settings[item] = value;

        if (!modify) console.info(item, value, modify);

        if (settings_base[item].type == 'slider') {
            // text to show current slider value
            try {
                let slider = search.querySelector(`#slider-${item}`);

                search.querySelector(`#value-${item}`).textContent =
                    `${settings[item]}${settings_base[item].unit}`;
                slider.value = settings[item];
                search
                    .querySelector(`#slider-track-${item}`)
                    .style.setProperty(
                        '--percent',
                        `${(settings[item] / slider.getAttribute('max')) * 100}%`
                    );
            } catch (e) {}

            // save setting into body
            document.body.style.setProperty(
                `--${settings_base[item].css}`,
                `${value}${settings_base[item].unit}`
            );
            document.documentElement.setAttribute(
                `data-bleh--${item}`,
                `${value}`
            );

            if (item == 'hue' || item == 'sat' || item == 'lit') {
                if (
                    settings.hue == settings_base.hue.value &&
                    settings.sat == settings_base.sat.value &&
                    settings.lit == settings_base.lit.value &&
                    settings.seasonal &&
                    stored_season.id != 'none'
                ) {
                    document.body.style.removeProperty(
                        `--${settings_base.hue.css}`
                    );
                    document.body.style.removeProperty(
                        `--${settings_base.sat.css}`
                    );
                    document.body.style.removeProperty(
                        `--${settings_base.lit.css}`
                    );
                    document.documentElement.setAttribute(
                        'data-bleh--hsl-override',
                        'true'
                    );
                } else {
                    document.documentElement.setAttribute(
                        'data-bleh--hsl-override',
                        'false'
                    );
                }
            }
        } else if (settings_base[item].type == 'toggle') {
            if (settings[item] == settings_base[item].values[0] && modify) {
                settings[item] = settings_base[item].values[1];
                search
                    .querySelector(`#toggle-${item}`)
                    .setAttribute('aria-checked', false);

                // save setting into body
                document.body.style.setProperty(
                    `--${item}`,
                    settings_base[item].values[1]
                );
                document.documentElement.setAttribute(
                    `data-bleh--${item}`,
                    `${settings_base[item].values[1]}`
                );
            } else if (modify) {
                settings[item] = settings_base[item].values[0];
                console.log(`toggle-${item}`);
                search
                    .querySelector(`#toggle-${item}`)
                    .setAttribute('aria-checked', true);

                // save setting into body
                document.body.style.setProperty(
                    `--${item}`,
                    settings_base[item].values[0]
                );
                document.documentElement.setAttribute(
                    `data-bleh--${item}`,
                    `${settings_base[item].values[0]}`
                );
            } else {
                // dont modify, just show
                if (settings[item] == settings_base[item].values[0]) {
                    search
                        .querySelector(`#toggle-${item}`)
                        .setAttribute('aria-checked', true);
                } else {
                    search
                        .querySelector(`#toggle-${item}`)
                        .setAttribute('aria-checked', false);
                }
            }
        } else if (settings_base[item].type == 'options') {
            if (modify) {
                settings[item] = value;

                // save setting into body
                document.body.style.setProperty(`--${item}`, value);
                document.documentElement.setAttribute(
                    `data-bleh--${item}`,
                    value
                );

                let toggle = document.getElementById(`toggle-${item}-${value}`);
                if (toggle) toggle.setAttribute('aria-checked', true);

                let other_toggles = search.querySelectorAll(
                    `[data-toggle="${item}"]`
                );
                other_toggles.forEach((toggle) => {
                    let other_value = toggle.getAttribute('data-toggle-value');
                    if (other_value == value) return;
                    else toggle.setAttribute('aria-checked', false);
                });

                // re-flow chart
                if (
                    (item == 'chart_view' || item == 'chart_bar_axis') &&
                    page.type == 'user' &&
                    page.subpage.startsWith('library')
                )
                    bleh_glacier_date_graph_generate();
            } else {
                // dont modify, just show
                if (settings[item] == value) {
                    document
                        .getElementById(`toggle-${item}-${value}`)
                        .setAttribute('aria-checked', true);
                } else {
                    document
                        .getElementById(`toggle-${item}-${value}`)
                        .setAttribute('aria-checked', false);
                }
            }
        }

        if (modify) log(`updated ${item} to ${settings[item]}`, 'settings');

        // save to settings
        compile_settings();
    } catch (e) {}

    if (container) {
        if (settings[item] != settings_base[item].value)
            container.classList.add('modified');
        else container.classList.remove('modified');
    }

    /*if (item.startsWith('seasonal') && modify) {
        page.structure.main.innerHTML = render_setting_page('customise');
        refresh_all();
    }*/

    if (item == 'hue' || item == 'sat' || item == 'lit') {
        update_colour_swatches();
        load_chart_colours();
    }
}

export function request_reload() {
    if (page.type == 'bleh_setup') return;

    log('requesting reload', 'settings');
    reload_pending.state = true;
    notify({
        title: tl(trans.refresh_pending.name),
        body: tl(trans.refresh_pending.body),
        icon: 'icon-16-settings',
        persist: true,
        actions: [
            {
                action: () => invoke_reload(),
                text: tl(trans.refresh),
                type: 'refresh'
            }
        ]
    });
}
unsafeWindow._invoke_reload = function () {
    invoke_reload();
};
export function invoke_reload() {
    window.location.reload();
}

export function update_colour_swatches() {
    let found = false;
    let custom = null;
    let seasonal = null;

    let swatches = page.structure.main.querySelectorAll('.swatch');
    swatches.forEach((swatch) => {
        let h = swatch.style.getPropertyValue('--hue-over');
        let s = swatch.style.getPropertyValue('--sat-over');
        let l = swatch.style.getPropertyValue('--lit-over');

        let parent = swatch.parentElement;
        if (swatch.classList[0] == 'dropdown-menu-clickable-item')
            parent = swatch;

        if (
            (h == settings.hue && s == settings.sat && l == settings.lit) ||
            (swatch.getAttribute('data-swatch-type') == 'default' &&
                settings.hue == 255 &&
                settings.sat == 1 &&
                settings.lit == 1) // default
        ) {
            parent.setAttribute('aria-checked', 'true');

            if (swatch.classList[0] != 'dropdown-menu-clickable-item')
                found = true;
        } else {
            parent.setAttribute('aria-checked', 'false');
        }

        if (!custom && swatch.getAttribute('data-swatch-type') == 'customise')
            custom = parent;

        if (!seasonal && swatch.getAttribute('data-swatch-type') == 'default')
            seasonal = parent;
    });

    if (found) return;

    if (custom && settings.accent_type != 'season')
        custom.setAttribute('aria-checked', 'true');
    else if (seasonal) seasonal.setAttribute('aria-checked', 'true');
}

unsafeWindow._reset_inbuilt_item = function (item) {
    reset_inbuilt_item(item);
};
unsafeWindow._update_inbuilt_params = function (params = {}) {
    update_inbuilt_params(params);
};
unsafeWindow._update_inbuilt_item = function (item, value) {
    update_inbuilt_item(item, value);
};

export function update_inbuilt_item(
    item,
    value,
    modify = true,
    element = document.body
) {
    //console.log('update item',item,value);
    console.warn('update item', item, value, 'modify', modify);

    let test_if_valid = element.querySelector(`#toggle-${item}`);
    console.warn(test_if_valid, `toggle-${item}`);
    //console.info(test_if_valid, item, value, inbuilt_settings[item], 'modify', modify);
    if (test_if_valid == undefined) return;

    if (inbuilt_settings[item].type == 'toggle') {
        if (modify) {
            value =
                document
                    .getElementById(`toggle-${item}`)
                    .getAttribute('aria-checked') === 'true';
            log(`updated (inbuilt) ${item} to ${!value}`, 'settings');
        }

        //console.info(value, inbuilt_settings[item].values[0], value == inbuilt_settings[item].values[0], modify);

        if (value == inbuilt_settings[item].values[0] && modify) {
            element.querySelector(
                `#inbuilt-companion-checkbox-${item}`
            ).checked = false;
            element
                .querySelector(`#toggle-${item}`)
                .setAttribute('aria-checked', false);
            document.documentElement.setAttribute(
                `data-bleh--inbuilt-${item}`,
                inbuilt_settings[item].values[1]
            );
        } else if (modify) {
            element.querySelector(
                `#inbuilt-companion-checkbox-${item}`
            ).checked = true;
            element
                .querySelector(`#toggle-${item}`)
                .setAttribute('aria-checked', true);
            document.documentElement.setAttribute(
                `data-bleh--inbuilt-${item}`,
                inbuilt_settings[item].values[0]
            );
        } else {
            // dont modify, just show
            console.warn(
                item,
                value,
                value == true,
                value == false,
                typeof value,
                typeof true
            );
            if (value == true) {
                console.warn(item, value, 'TRUE');
                element.querySelector(
                    `#inbuilt-companion-checkbox-${item}`
                ).checked = true;
                element
                    .querySelector(`#toggle-${item}`)
                    .setAttribute('aria-checked', true);
                document.documentElement.setAttribute(
                    `data-bleh--inbuilt-${item}`,
                    true
                );
            } else if (value == false) {
                console.warn(item, value, 'FALSE');
                element.querySelector(
                    `#inbuilt-companion-checkbox-${item}`
                ).checked = false;
                element
                    .querySelector(`#toggle-${item}`)
                    .setAttribute('aria-checked', false);
                document.documentElement.setAttribute(
                    `data-bleh--inbuilt-${item}`,
                    false
                );
            }
        }
    }
}
