import { badge } from "@/types/badge";
import { dialog } from "./dialog";
import { tl, trans } from "@/build/trans";
import { html, render } from "lighterhtml";
import { avatar, style_name_from_badge } from "../shared/avatar";
import { sponsor } from "../sponsor";
import "@zachleat/hypercard";
import { load_profile_cache_externally } from "@/pages/profile/profile";
import { get_amount_of_badge } from "../shared/badge";

export async function present_badge(badge: badge) {
    let head;
    let bg_avatar;

    let type;

    if (badge.inbuilt) {
        type = badge.reason;
    } else {
        type = tl(trans.badge_types[badge.type || 'reserved'], { u: badge.user });
    }

    const count = get_amount_of_badge(badge);

    const window = html.node`
        ${badge.type == 'reserved' ? html.node`
            <div class="present-badge-type-indicator">
                ${tl(trans.badges.reserved.reason)}
            </div>
        ` : ''}
        <hyper-card class="present-badge-hyper-card">
            <div class="present-badge-window">
                <div class="present-badge-corner corner-left" />
                <div class="present-badge-corner corner-right" />
                <div class="present-badge-avatar-back" ref=${el => bg_avatar = el} />
                <div class="present-badge-head" ref=${el => head = el}>
                    <div class="present-badge-avatar avatar">
                        <img class="missing-avatar">
                    </div>
                    <span class="present-badge-username">${badge.user}</span>
                </div>
                <div class="present-badge-inner">
                    <div class="present-badge-top">
                        <div class="present-badge colourful">
                            <div class="bleh-icon present-badge-icon" data-mask=${badge.mask} />
                        </div>
                    </div>
                    <strong class="present-badge-name">${badge.name}</strong>
                    <p class="present-badge-reason">${badge.reason}</p>
                    <p class="present-badge-type">${type}</p>
                </div>
                ${count > 0 ? html.node`
                    <div class="present-badge-bottom">
                        <p class="present-badge-count">${count == 1 ? tl(trans.badge_only_user, { u: badge.user }) : tl(trans.badge_multiple_users, { u: badge.user, c: count })}</p>
                    </div>
                ` : ''}
            </div>
        </hyper-card>
        ${badge.type == 'sponsor' ? html.node`
            <div class="present-badge-actions">
                <button class="btn primary icon sponsor colourful" data-type="sponsor" onclick=${() => sponsor()}>
                    ${tl(trans.sponsor)}
                </button>
            </div>
        ` : badge.type == 'translation' ? html.node`
            <div class="present-badge-actions">
                <a class="btn primary icon translate colourful" data-type="translate" href="https://github.com/katelyynn/bleh/wiki/Translations" target="_blank">
                    ${tl(trans.translate)}
                </a>
            </div>
        ` : ''}
    `;

    const elem = dialog({
        id: 'badge',
        title: badge.name,
        body: window,
        type: 'badge',
        colourful: true,
        colourful_bg: true
    });

    if (
        badge.icon != '' &&
        badge.hue > -1 &&
        badge.sat > -1 &&
        badge.lit > -1
    ) {
        // new style badge
        elem.style.setProperty('--mask', `url(${badge.icon})`);
        elem.style.setProperty('--hue-over', badge.hue);
        elem.style.setProperty('--sat-over', badge.sat);
        elem.style.setProperty('--lit-over', badge.lit);
    } else if (badge.inbuilt) {
        elem.classList.add(badge.type);
    } else {
        elem.classList.add(
            `user-status--bleh-${badge.type}`,
            `user-status--bleh-user-${badge.user}`
        );
    }

    const cache = await load_profile_cache_externally(badge.user);

    render(head, html`
        <div class="present-badge-avatar avatar">
            <img src=${avatar(cache.avatar, 'avatar300s')} />
        </div>
        <span class="present-badge-username">${badge.user}</span>
    `);

    render(bg_avatar, html`
        <img src=${avatar(cache.avatar, 'avatar300s')} />
    `);
}
