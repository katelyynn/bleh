import { badge } from "@/types/badge";
import { dialog } from "./dialog";
import { tl, trans } from "@/build/trans";
import { html } from "lighterhtml";
import { style_name_from_badge } from "../shared/avatar";
import { sponsor } from "../sponsor";

export function present_badge(badge: badge) {
    let elem;
    let badge_name;

    const window = html.node`
        <div class="present-badge-window">
            <div class="present-badge-top">
                <div class="present-badge colourful" ref=${el => elem = el}>
                    <div class="bleh-icon present-badge-icon" />
                </div>
            </div>
            <strong class="present-badge-name" ref=${el => badge_name = el}>${badge.name}</strong>
            <p class="present-badge-reason">${badge.reason}</p>
            <div class="present-badge-bottom">
                <p class="present-badge-type">${tl(trans.badge_types[badge.type || 'reserved'], { u: badge.user })}</p>
            </div>
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
        </div>
    `;

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

    style_name_from_badge(badge_name, badge);

    dialog({
        id: 'badge',
        title: badge.name,
        body: window,
        type: 'badge'
    });
}
