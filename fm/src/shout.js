import { patch_avatar } from "./avatar";
import { settings } from "./build/config";
import { log } from "./build/log";
import { auth, page, root, shout_parse_queue } from "./build/page";
import { lang, trans_legacy } from "./build/trans";
import { deliver_notif, notify } from "./components/notify";
import { clean_message } from "./pages/moderation";

export function patch_shouts() {
    if (page.structure.main == null)
        return;

    let shouts = page.structure.main.querySelectorAll('.shout:not([data-kate-processed])');

    shouts.forEach((shout) => {
        try {
            shout.setAttribute('data-kate-processed', 'true');

            let shout_name = shout.querySelector('.shout-user a');

            if (!shout_name)
                return;
            let shout_name_text = shout_name.textContent;

            let shout_avatar = shout.querySelector('.shout-user-avatar');

            let badge = patch_avatar(shout_avatar, shout_name_text, 'shout');

            if (badge.type) {
                if (badge.type == 'avatar-status-dot--staff')
                    shout.classList.add('staff-shout');

                shout_avatar.setAttribute('data-avatar-themed', 'true');
                shout_avatar.classList.add(`user-status--bleh-${badge.type}`, `user-status--bleh-user-${shout_name_text}`);
                shout_name.classList.add(`user-status--bleh-${badge.type}`, `user-status--bleh-user-${shout_name_text}`);
            }

            if (settings.shout_markdown) {
                let shout_body = shout.querySelector('.shout-body p');

                shout_parse_queue.push({
                    element: shout_body
                });
            }


            // timestamp
            let shout_timestamp = shout.querySelector('.shout-timestamp time');
            if (shout_timestamp != null) {
                tippy(shout_timestamp, {
                    content: shout_timestamp.getAttribute('title')
                });

                shout_timestamp.removeAttribute('title');
            }


            let send_button = shout.querySelector('.form-group--submit');
            shout_send(send_button);
        } catch(e) {
            deliver_notif('a shout on this page failed to be modified :(');
            console.error('bleh - a shout failed to patch', e);
        }
    });

    // enter a shout field
    let shout_forms = document.querySelectorAll('.shout-form:not([data-kate-processed])');
    shout_forms.forEach((shout_form) => {
        shout_form.setAttribute('data-kate-processed', 'true');
        let shout_avatar = shout_form.querySelector('.shout-user-avatar');

        patch_avatar(shout_avatar, auth.name);


        let send_button = shout_form.querySelector('.form-group--submit');
        shout_send(send_button);

        //let textarea = shout_form.querySelector('textarea');
        shout_form.addEventListener('keydown', (e) => {
            //console.info('key', e, e.keyCode, e.target, textarea, e.target == textarea);

            /*if (e.target != textarea)
                return;*/

            // CTRL + ENTER
            if (e.ctrlKey && e.keyCode == 13) {
                e.preventDefault();

                send_button.querySelector('.btn-post-shout').click();
                notify({
                    id: 'shout',
                    title: trans_legacy[lang].shout.name,
                    body: trans_legacy[lang].shout.sent,
                    icon: 'icon-16-send'
                });
            }
        });
    });
}

function shout_send(send_button) {
    if (!send_button) return;

    let button = send_button.querySelector('.btn-post-shout');
    if (!button) return;

    button.classList.add('btn-send-shout-generic');
    //button.innerHTML = 'Send with Copilot<span class="new-badge">PREMIUM</span>';
    button.textContent = trans_legacy[lang].settings.send;

    tippy(button, {
        content: trans_legacy[lang].settings.send_quickly.replace('{kbd}', '<kbd>ctrl+↵</kbd>'),
        delay: [500, 0],
        allowHTML: true
    });
}

export function parse_shout_queue() {
    let response = parse_shout(0);

    if (response == 0)
        return;

    setTimeout(function() {
        parse_shout(0);
    }, 100);
}

function parse_shout(index) {
    if (shout_parse_queue.length <= 0)
        return 0;

    let shout = shout_parse_queue[index];

    console.info(index, shout_parse_queue, shout);

    let converter = new showdown.Converter({
        emoji: true,
        excludeTrailingPunctuationFromURLs: true,
        headerLevelStart: 5,
        noHeaderId: true,
        openLinksInNewWindow: true,
        requireSpaceBeforeHeadingText: true,
        simpleLineBreaks: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        underline: true,
        ghCodeBlocks: false,
        smartIndentationFix: true
    });
    let parsed_body = converter.makeHtml(clean_message(shout.element.textContent, "shout") // TODO: only works when markdown is enabled
    .replace(/([@])([a-zA-Z0-9_]+)/g, `[$1$2](${root}user/$2)`)
    .replace(/\[artist\]([a-zA-Z0-9]+)\[\/artist\]/g, `[$1](${root}music/$1)`)
    .replace(/\[album artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/album\]/g, `[$2](${root}music/$1/$2)`)
    .replace(/\[track artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/track\]/g, `[$2](${root}music/$1/_/$2)`)
    .replace(/https:\/\/open\.spotify\.com\/user\/([A-Za-z0-9]+)\?si=([A-Za-z0-9]+)/g, '[@$1](https://open.spotify.com/user/$1)')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;'));
    shout.element.innerHTML = parsed_body;
    log(`parsed index ${index}`, 'shout', 'log');

    shout_parse_queue.splice(index, 1);
    return 1;
}

unsafeWindow._show_hidden_shout = function(shout_id) {
    document.getElementById(`bleh--shout-${shout_id}`).setAttribute('data-bleh--shout-expanded','true');
}