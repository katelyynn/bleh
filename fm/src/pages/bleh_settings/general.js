import { html, render } from "lighterhtml";
import { page_loading, register_skip_to, render_setting_page } from "./bleh_settings";
import { api_key, auth, page, root } from "@/build/page";
import { load_badges } from "@/components/shared/badge";
import { dialog } from "@/components/dialog/dialog";
import { lang, lang_info, tl, trans } from "@/build/trans";
import { setting } from "@/components/settings/settings";
import { DateTime } from "luxon";
import { version } from "@/main";
import { sponsor_list } from "@/build/sponsor";
import { update_branding_type } from "@/components/page/navigation";
import tippy from "tippy.js";
import { update_check } from "@/components/page/style";
import { notify } from "@/components/dialog/notify";

export function general() {
    if (auth.pro == null) {
        setTimeout(() => {
            render_setting_page('general');
        }, 10);
        page_loading();
        return;
    }

    register_skip_to([]);

    let badge_count = 0;

    let badges = load_badges(auth.name);
    if (badges) badge_count = badges.length;
    if (auth.pro) badge_count++;

    const auth_key = localStorage.getItem('bleh_auth');
    const auth_valid = localStorage.getItem('bleh_auth_valid');

    render(page.structure.main, html`
        <section class="bleh--panel">
            <h4>${tl(trans.updates)}</h4>
            <div class="setting-group">
                ${update_setting()}
            </div>
        </section>
        <section class="bleh--panel">
            <h4>${tl(trans.profile)}</h4>
            <div class="setting-group">
                ${auth.name ? html.node`
                    <div class="setting" data-type="info">
                        <div class="avatar-container">
                            <div class="avatar-inner">
                                <img src=${auth.avatar} alt=${auth.name} />
                            </div>
                        </div>
                        <div class="heading">
                            <h5>@${auth.name}</h5>
                        </div>
                        <div class="info">
                            <p>${tl(trans.profile_and_badges, { c: badge_count.toString() })}</p>
                            ${badge_count > 0 ? html.node`
                                <button class="see-more" onclick=${() => {
                                    dialog({
                                        id: 'badges',
                                        title: auth.name,
                                        body: html.node`
                                            <div class="generic-table-list badge-list">
                                                ${badges ? badges.map(badge => {
                                                    let style;
                                                    let classname = '';
                                                    if (
                                                        badge.icon &&
                                                        badge.hue &&
                                                        badge.sat &&
                                                        badge.lit
                                                    ) {
                                                        style = `--mask: url(${badge.icon}); --hue: ${badge.hue}; --sat: ${badge.sat}; --lit: ${badge.lit}`;
                                                    } else {
                                                        classname = `user-status--bleh-${badge.type} user-status--bleh-user-${auth.name}`;
                                                    }

                                                    return html.node`
                                                        <div class="generic-table-list-entry badge-list-entry">
                                                            <div class="icon-container colourful ${classname}" style=${style}>
                                                                <div class="bleh-icon" style="--icon: var(--mask)" />
                                                            </div>
                                                            <div class="name colourful ${classname}" style=${style}>
                                                                ${badge.name}
                                                            </div>
                                                            <div class="text">
                                                                ${badge.reason}
                                                            </div>
                                                        </div>
                                                    `;
                                                }) : ''}
                                                ${auth.pro ? html.node`
                                                    <div class="generic-table-list-entry badge-list-entry">
                                                        <div class="icon-container colourful user-status-subscriber">
                                                            <div class="bleh-icon" style="--icon: var(--mask)" />
                                                        </div>
                                                        <div class="name colourful user-status-subscriber">
                                                            ${tl(trans.badges['user-status-subscriber'].name)}
                                                        </div>
                                                        <div class="text">
                                                            ${tl(trans.badges['user-status-subscriber'].reason)}
                                                        </div>
                                                    </div>
                                                ` : ''}
                                            </div>
                                        `
                                    });
                                }}>${tl(trans.view)}</button>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
                ${auth.sponsor ? html.node`
                    <div class="setting" data-type="action">
                        <div class="heading">
                            <h5>${tl(trans.you_are_a_sponsor)}</h5>
                            <p>${tl(trans.sponsor_get_badge)}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="btn primary icon sponsor" data-type="sponsor" onclick=${() => sponsor_manage()}>
                                ${tl(trans.manage_sponsor)}
                            </button>
                        </div>
                    </div>
                ` : html.node`
                    <div class="setting" data-type="action">
                        <div class="heading">
                            <h5>${tl(trans.news_sponsor_cta)}</h5>
                            <p>${tl(trans.sponsor_get_badge)}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="btn primary icon sponsor" data-type="sponsor" onclick=${() => sponsor()}>
                                ${tl(trans.sponsor)}
                            </button>
                        </div>
                    </div>
                `}
                <div class="setting" data-type="info">
                    <div class="heading">
                        <h5>${tl(trans.current_version)}</h5>
                    </div>
                    <div class="info">
                        <p>${sponsor_list.latest}</p>
                        <button class="see-more update-check sponsor-related" onclick=${() => sponsors(true, () => {
                            render_setting_page('general');
                        })}>
                            ${tl(trans.update_check)}
                        </button>
                    </div>
                </div>
            </div>
        </section>
        ${!page.mobile ? html.node`
            <section class="bleh--panel">
                <h4>${tl(trans.branding)}</h4>
                <div class="setting-group">
                    ${setting({ id: 'branding_type', func: update_branding_type })}
                </div>
            </section>
        ` : ''}
        ${auth.name ? html.node`
            <section class="bleh--panel">
                <h4>API</h4>
                <div class="setting-group">
                    <div class="setting" data-type="action">
                        <div class="heading">
                            <h5>${tl(trans.api.name)}</h5>
                            <p>${tl(trans.api.body)}</p>
                        </div>
                        <div class="toggle-wrap">
                            <a class="btn ${auth_key && auth_valid == 'true' ? '' : 'primary'} icon connect" href="${root}api/auth?api_key=${api_key}&cb=${root}bleh/api">
                                ${tl(trans.connect)}
                            </a>
                        </div>
                    </div>
                    <div class="setting" data-type="info">
                        <div class="heading">
                            <h5>${tl(trans.api_status)}</h5>
                        </div>
                        <div class="info">
                            ${auth_key && auth_valid == 'true' ? html.node`
                                <p>${tl(trans.connected)}</p>
                            ` : html.node`
                                <p>${tl(trans.not_connected)}</p>
                            `}
                        </div>
                    </div>
                </div>
            </section>
        ` : ''}
        <section class="bleh--panel">
            <h4>${tl(trans.language)}</h4>
            <div class="setting-group">
                <div class="languages">
                    ${Object.entries(lang_info).sort(([, a], [, b]) => b.percent - a.percent).map(([key, language]) => {
                        let date;

                        const row = html.node`
                            <div class="language-row${lang == key ? ' active' : ''}">
                                <div class="flag-container">
                                    <img src="https://katelyynn.github.io/bleh/fm/flags/${key}.svg" alt="flag for ${key}">
                                </div>
                                <div class="name">
                                    <h5>${language.name}</h5>
                                    <p>${{ html: tl(trans.by_user, { u: language.by.map((user) => `<a href="${root}user/${user}">${user}</a>`).join(', ') }) }}</p>
                                </div>
                                ${language.new ? html.node`
                                    <div class="badges">
                                        <div class="new-badge">${tl(trans.new)}</div>
                                    </div>
                                ` : html.node`
                                    <div class="badges"></div>
                                `}
                                ${language.percent ? () => {
                                    const elem = html.node`
                                        <div class="percent colourful" style="--hue-over: ${language.percent * 1.2}; --sat-over: 1.2; --lit-over: 1;" data-percent=${language.percent}>
                                            ${language.percent}%
                                        </div>
                                    `;

                                    tippy(elem, {
                                        content: `${tl(trans.amount_translated, { c: language.translated })}, ${tl(trans.missing_translated, { c: language.missing })}`
                                    });

                                    return elem;
                                } : ''}
                                <div class="date">
                                    <p ref=${(el) => (date = el)}>${language.last_updated != 'latest' ? DateTime.fromISO(language.last_updated).toRelative() : language.last_updated}</p>
                                </div>
                            </div>
                        `;

                        if (language.last_updated != 'latest') {
                            tippy(date, {
                                content: DateTime.fromISO(language.last_updated).toLocaleString(DateTime.DATE_MED)
                            });
                        }

                        return row;
                    })}
                </div>
            </div>
            <div class="setting-group">
                <div class="setting" data-type="action">
                    <div class="heading">
                        <h5>${tl(trans.submit_language.name)}</h5>
                        <p>${tl(trans.submit_language.body)}</p>
                    </div>
                    <div class="toggle-wrap">
                        <a class="see-more" href="https://github.com/katelyynn/bleh/wiki" target="_blank">
                            ${tl(trans.help_contribute)}
                        </a>
                    </div>
                </div>
                ${setting({id: 'translator'})}
            </div>
        </section>
    `);
}

function update_setting() {
    let update_btn;
    let pause_btn;

    const update_required = localStorage.getItem('bleh_update_required') || 'false';
    const last_checked = localStorage.getItem('bleh_update_checked') || null;
    const version_to_install = localStorage.getItem('bleh_update_to') || null;

    let paused = localStorage.getItem('bleh_update_paused') || 'false';
    let paused_until = localStorage.getItem('bleh_update_paused_until') || null;

    const cont = html.node`
        <div class="setting" data-type="action" />
    `;

    if (paused === 'true') {
        render(cont, html`
            <div class="setting-v2-icon update-center-icon">
                <div class="update-container">
                    <div class="bleh-icon" data-type="update" />
                </div>
                <div class="check-circle paused colourful">
                    <div class="bleh-icon" data-type="paused" />
                </div>
            </div>
            <div class="heading">
                <h5>${tl(trans.updates_paused)}</h5>
                <p class="last-checked">${tl(trans.paused_until_date).replace('{d}', DateTime.fromJSDate(new Date(paused_until)).toRelative())}</p>
            </div>
            <div class="toggle-wrap">
                <button class="btn primary icon" data-type="update" ref=${el => update_btn = el} disabled>${tl(trans.check)}</button>
            </div>
        `);
    } else if (update_required === 'false') {
        render(cont, html`
            <div class="setting-v2-icon update-center-icon">
                <div class="update-container">
                    <div class="bleh-icon" data-type="update" />
                </div>
                ${last_checked ? html.node`
                <div class="check-circle colourful">
                    <div class="bleh-icon" data-type="check-thick" />
                </div>
                ` : ''}
            </div>
            <div class="heading">
                ${last_checked ? html.node`
                    <h5>${tl(trans.you_are_up_to_date)}</h5>
                    <p class="last-checked">${tl(trans.last_checked_date).replace('{d}', DateTime.fromJSDate(new Date(last_checked)).toRelative())}</p>
                ` : html.node`
                    <h5>${tl(trans.missing_updates)}</h5>
                    <p class="last-checked">${tl(trans.never_checked)}</p>
                `}
            </div>
            <div class="toggle-wrap">
                <button class="btn icon" data-type="update" ref=${(el) => (update_btn = el)} onclick=${() => update_check(true, update_btn, () => {
                    notify({
                        id: 'update',
                        title: tl(trans.updates),
                        body: tl(trans.checked_for_updates),
                        icon: 'icon-16-update'
                    });
                    render_setting_page('general');
                })}>${tl(trans.check)}</button>
            </div>
        `);
    } else {
        render(cont, html`
            <div class="setting-v2-icon update-center-icon">
                <div class="update-container spin">
                    <div class="bleh-icon" data-type="update" />
                </div>
            </div>
            <div class="heading">
                <h5>${tl(trans.update_available_to_install)}</h5>
                ${last_checked ? html.node`
                    <p class="last-checked">${tl(trans.last_checked_date, { d: DateTime.fromJSDate(new Date(last_checked)).toRelative() })}</p>
                ` : html.node`
                    <p class="last-checked">${tl(trans.never_checked)}</p>
                `}
            </div>
            <div class="toggle-wrap">
                <div class="button-group">
                    <button class="btn icon" data-type="update" ref=${(el) => (update_btn = el)} onclick=${() => update_check(true, update_btn, () => {
                        notify({
                            id: 'update',
                            title: tl(trans.updates),
                            body: tl(trans.checked_for_updates),
                            icon: 'icon-16-update'
                        });
                        render_setting_page('general');
                    })}>${tl(trans.check)}</button>
                    <button class="btn primary icon" data-type="update" ref=${(el) => (update_btn = el)} onclick=${() => start_update()}>${tl(trans.install_now)}</button>
                </div>
            </div>
        `);
    }

    return html.node`
        ${cont}
        <div class="setting" data-type="info">
            ${last_checked && paused === 'false' && update_required === 'true' ? html.node`
                <div class="heading">
                    <h5>${tl(trans.updating_to_version)}</h5>
                </div>
                <div class="info">
                    <p>${version_to_install}</p>
                </div>
            ` : html.node`
                <div class="heading">
                    <h5>${tl(trans.current_version)}</h5>
                </div>
                <div class="info">
                    <p>${version.build}</p>
                </div>
            `}
        </div>
    `;
}
