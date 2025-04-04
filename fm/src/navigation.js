import { settings } from "./build/config";
import { auth, page, root } from "./build/page";
import { stored_season } from "./build/seasonal";
import { lang, non_override_lang, trans_legacy, tl, trans } from "./build/trans";
import { load_badges } from "./components/badge";
import { version } from "./main";
import { show_theme_change_in_menu } from "./pages/bleh_config";
import { ff } from "./sku";

export function patch_masthead(element) {
    let masthead_logo = element.querySelector('.masthead-logo');

    if (!masthead_logo)
        return;

    if (!masthead_logo.hasAttribute('data-kate-processed')) {
        masthead_logo.setAttribute('data-kate-processed','true');

        let link = document.createElement('a');
        link.classList.add('home-link');
        link.setAttribute('href', `${root}music`);
        link.innerHTML = `<div class="bleh-logo">${version.brand}</div>`;
        masthead_logo.appendChild(link);

        let version_text = document.createElement('a');
        version_text.classList.add('bleh--version');
        version_text.setAttribute('href', `${root}bleh`);
        version_text.textContent = `${version.build}.${version.sku}${(settings.dev) ? ` (dev)` : ''}`;

        masthead_logo.appendChild(version_text);
    }
}

export function append_nav() {
    if (ff('developer') && !page.structure.indicator) {
        let page_indicator = document.createElement('div');
        page_indicator.classList.add('page-indicator');
        document.documentElement.appendChild(page_indicator);

        page.structure.indicator = page_indicator;
    }

    let auth_link = document.body.querySelector('.auth-link');

    if (!auth_link)
        return;

    if (auth_link.hasAttribute('data-bleh'))
        return;
    auth_link.setAttribute('data-bleh', 'true');

    let text = document.createElement('p');
    text.textContent = auth.name;
    auth_link.appendChild(text);

    if (document.body.querySelector('.masthead .masthead-pro-wrap') != null)
        auth.pro = true;
    else
        auth.pro = false;

    let badges = load_badges(auth.name, true);

    if (badges) {
        let badge = document.createElement('span');
        badge.classList.add('label', `user-status--bleh-${badges[0].type}`, `user-status--bleh-user-${auth.name}`, 'auth-badge');
        badge.textContent = badges[0].name;
        auth_link.appendChild(badge);

        auth_link.classList.add(`user-status--bleh-${badges[0].type}`, `user-status--bleh-user-${auth.name}`);
        auth_link.setAttribute('data-has-colour', 'true');
    } else if (auth.pro) {
        let pro_badge = document.createElement('p');
        pro_badge.classList.add('label', 'user-status-subscriber', 'auth-badge');
        pro_badge.textContent = 'Pro';
        auth_link.appendChild(pro_badge);

        auth_link.classList.add('user-status-subscriber');
        auth_link.setAttribute('data-has-colour', 'true');
    }


    let notif_btn = document.body.querySelector('.masthead-nav-control[data-analytics-label="notifications"]');
    let notif_count = notif_btn.querySelector('.notification-count-badge');
    if (notif_count) {
        notif_count = notif_count.textContent;

        tippy(notif_btn, {
            content: tl(trans.notifications.count).replace('{count}', notif_count)
        });

        notif_btn.setAttribute('data-count', notif_count);
    } else {
        tippy(notif_btn, {
            content: tl(trans.notifications.none)
        });
    }

    let inbox_btn = document.body.querySelector('.masthead-nav-control[data-analytics-label="inbox"]');
    let inbox_count = inbox_btn.querySelector('.notification-count-badge');
    if (inbox_count) {
        inbox_count = inbox_count.textContent;

        tippy(inbox_btn, {
            content: tl(trans.inbox.count).replace('{count}', inbox_count)
        });

        inbox_btn.setAttribute('data-count', inbox_count);
    } else {
        tippy(inbox_btn, {
            content: tl(trans.inbox.none)
        });
    }

    let inbox_container = document.body.querySelector('.masthead-nav-item:has([data-analytics-label="inbox"])');

    // what's new?
    let changelog_container = document.createElement('li');
    changelog_container.classList.add('masthead-nav-item');
    changelog_container.innerHTML = (`
        <a class="masthead-nav-control" onclick="_query_changelog()" data-bleh--label="changelog">
            ${trans_legacy[lang].changelog.name}
        </a>
    `);
    tippy(changelog_container, {
        content: trans_legacy[lang].changelog.name
    });
    inbox_container.after(changelog_container);

    // configure bleh
    let bleh_container = document.createElement('li');
    bleh_container.classList.add('masthead-nav-item');
    bleh_container.innerHTML = (`
        <a class="masthead-nav-control" href="${root}bleh${(stored_season.id != 'none') ? '?tab=seasonal' : ''}" data-bleh--label="bleh" data-season="${stored_season.id}" data-season-active="${(stored_season.id != 'none') ? 'true' : 'false'}">
            ${(stored_season.id == 'none') ? trans_legacy[lang].auth_menu.configure_bleh : moment(stored_season.end.replace('y0', stored_season.year).replace('{offset}', stored_season.offset)).to(stored_season.now, true)}
        </a>
    `);
    if (stored_season.id == 'none') {
        tippy(bleh_container, {
            content: trans_legacy[lang].auth_menu.configure_bleh
        });
    } else {
        page.header.season_tooltip = tippy(bleh_container, {
            theme: 'seasonal-swatch',
            content: (`
                <span class="season-colour-name">${trans_legacy[lang].settings.customise.seasonal.listing[stored_season.id]}</span>
                <span class="season-exclusive">${trans_legacy[lang].auth_menu.seasonal_notice}</span>
            `),
            allowHTML: true
        });
    }
    changelog_container.after(bleh_container);

    page.header.season = bleh_container.querySelector('a');


    // auth menu
    let site_auth = document.body.querySelector('.site-auth');
    let legacy_auth_menu = site_auth.querySelector('.auth-dropdown-menu');
    let token = legacy_auth_menu.querySelector('[name="csrfmiddlewaretoken"]').getAttribute('value');
    let auth_menu = tippy(auth_link, {
        theme: 'auth-menu',
        content: (`
            <a class="dropdown-menu-clickable-item" data-menu-item="profile" href="${root}user/${auth.name}">
                ${auth.name}
            </a>
            <a class="dropdown-menu-clickable-item" data-menu-item="profile-shortcut" href="${root}user/${settings.profile_shortcut}" data-profile-shortcut="${settings.profile_shortcut}">
                ${settings.profile_shortcut}
            </a>
            <div class="sep"></div>
            <a class="dropdown-menu-clickable-item" data-menu-item="library" href="${root}user/${auth.name}/library">
                ${tl(trans.library)}
            </a>
            <a class="dropdown-menu-clickable-item" data-menu-item="shouts" href="${root}user/${auth.name}/shoutbox">
                ${tl(trans.shouts)}
            </a>
            ${(settings.auth_menu_obsessions) ? (`
            <a class="dropdown-menu-clickable-item" data-menu-item="obsessions" href="${root}user/${auth.name}/obsessions">
                ${trans_legacy[lang].auth_menu.obsessions}
            </a>
            `) : ''}
            <button class="dropdown-menu-clickable-item" data-menu-item="themes" onclick="toggle_theme()">
                <span class="auth-dropdown-item-row">
                    <span class="auth-dropdown-item-left">${tl(trans.themes.name)}</span>
                    <span class="auth-dropdown-item-right" id="theme-value">${tl(trans.themes[settings.theme])}</span>
                </span>
            </button>
            ${(ff('dev')) ? (`
            <button class="dropdown-menu-clickable-item" data-menu-item="developer" onclick="_update_flag_toggle('dev', this)">
                ${trans_legacy[lang].auth_menu.dev}
            </button>
            `) : ''}
            <a class="dropdown-menu-clickable-item" data-menu-item="bleh" href="${root}bleh">
                ${tl(trans.configure_bleh)}
            </a>
            <div class="sep"></div>
            <a class="dropdown-menu-clickable-item" data-menu-item="labs" href="${root}labs">
                ${trans_legacy[lang].auth_menu.labs}
            </a>
            <a class="dropdown-menu-clickable-item" data-menu-item="bookmarks" href="${root}music/+bookmarks">
                ${tl(trans.bookmarks)}
            </a>
            <a class="dropdown-menu-clickable-item" data-menu-item="settings" href="${root}settings">
                ${tl(trans.settings)}
            </a>
            <form>
                <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
                <a class="dropdown-menu-clickable-item" data-menu-item="logout" href="${root}logout">
                    ${trans_legacy[lang].auth_menu.logout}
                </a>
            </form>
        `),
        allowHTML: true,
        placement: 'top',
        interactive: true,
        interactiveBorder: 10,

        onShow(instance) {
            instance.popper.style.setProperty('--url', `url(${auth.avatar.replace('avatar42s', 'avatar170s')})`);

            let shortcut_item = instance.popper.querySelector('[data-menu-item="profile-shortcut"]');
            if (shortcut_item.getAttribute('data-profile-shortcut') != settings.profile_shortcut) {
                shortcut_item.setAttribute('data-profile-shortcut', settings.profile_shortcut);
                shortcut_item.setAttribute('href', `${root}user/${settings.profile_shortcut}`);
                shortcut_item.textContent = settings.profile_shortcut;
            }

            instance.popper.querySelector('#theme-value').textContent = tl(trans.themes[settings.theme]);


            let theme_menu_item = tippy(instance.popper.querySelector('[data-menu-item="themes"]:not([aria-expanded])'), {
                theme: 'menu',
                content: (`
                    <button class="dropdown-menu-clickable-item theme-item-in-menu" data-bleh-theme="light" onclick="change_theme_from_menu('light')">
                        ${tl(trans.themes.light)}
                    </button>
                    <button class="dropdown-menu-clickable-item theme-item-in-menu" data-bleh-theme="dark" onclick="change_theme_from_menu('dark')">
                        ${tl(trans.themes.dark)}
                    </button>
                    <button class="dropdown-menu-clickable-item theme-item-in-menu" data-bleh-theme="darker" onclick="change_theme_from_menu('darker')">
                        ${tl(trans.themes.darker)}
                    </button>
                    <button class="dropdown-menu-clickable-item theme-item-in-menu" data-bleh-theme="oled" onclick="change_theme_from_menu('oled')">
                        ${tl(trans.themes.oled)}
                    </button>
                `),
                allowHTML: true,
                placement: 'left',
                hideOnClick: false,
                interactive: true,
                interactiveBorder: 10,

                onShow(instance_2) {
                    show_theme_change_in_menu('', instance_2.popper);
                }
            });
        }
    });
    site_auth.removeChild(site_auth.querySelector('.auth-dropdown-menu-wrap'));


    // language
    let selected_language = document.querySelector('.footer-language--active strong')?.textContent;
    let language_options = document.querySelectorAll('.footer-language-form');

    let language_menu = document.createElement('div');
    language_menu.classList.add('language-menu');

    let sel_button = document.createElement('button');
    sel_button.classList.add('dropdown-menu-clickable-item', 'lang-item', 'active');
    sel_button.setAttribute('data-lang', non_override_lang);
    sel_button.style.setProperty('--flag-url', `url('https://katelyynn.github.io/bleh/fm/flags/${non_override_lang}.svg')`);
    sel_button.textContent = selected_language;

    language_menu.appendChild(sel_button);

    language_options.forEach((language_option) => {
        let button = language_option.querySelector('button');
        button.classList.remove('mimic-link');
        button.classList.add('dropdown-menu-clickable-item', 'lang-item');
        button.setAttribute('data-lang', button.getAttribute('name'));
        button.style.setProperty('--flag-url', `url('https://katelyynn.github.io/bleh/fm/flags/${button.getAttribute('name')}.svg')`);

        language_menu.appendChild(language_option);
    });

    let language_nav = document.createElement('a');
    language_nav.classList.add('language-nav');
    language_nav.innerHTML = (`
        <span data-lang="${non_override_lang}" style="--flag-url: url('https://katelyynn.github.io/bleh/fm/flags/${non_override_lang}.svg');">${selected_language}</span>
    `);

    tippy(language_nav, {
        theme: 'language-menu',
        content: (`
            ${language_menu.innerHTML}
        `),
        allowHTML: true,
        delay: [100, 50],
        placement: 'bottom',
        //trigger: 'click',
        interactive: true
    });

    let inner = document.body.querySelector('.masthead-nav-wrap');
    let auth_container = inner.querySelector('.site-auth');

    inner.insertBefore(language_nav, auth_container);
}