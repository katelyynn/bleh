import { html, render } from "lighterhtml";
import { auth, dialogs, page } from "@/build/page";
import { render_user } from "@/pages/home/minis";
import { tl, trans } from "@/build/trans";
import { dialog, dialog_rm } from "@/components/dialog/dialog";
import { input } from "@/components/settings/input";
import { icon, icons } from "../shared/icon";

export function plot({ host, sidebar } = {}) {
    if (!host || !sidebar) return;

    let data_points = [];

    let current_year = new Date().getFullYear();
    let previous_year = current_year - 1;

    let body;
    let timeframe;

    render(host, html`
        <div
            class="compare-body"
            data-filled="false"
            ref=${el => body = el}
        >
            <div class="loading-data-container">
                <div class="loading-data-text info">
                    ${tl(trans.choose_a_timeframe_above)}
                </div>
            </div>
        </div>
    `);

    function render_users() {
        render(users_elem, html`
            ${users.map(user => html.node`
                <button class="compare-user-btn" onclick=${() => {
                    users = users.filter(user_name => user_name != user);
                    render_users();
                }}>
                    ${user_placeholder(user)}
                    ${icon({ name: icons.minus })}
                </button>
            `)}
            <button class="compare-user-btn add-user" onclick=${() => {
                let input_box;

                dialog({
                    id: 'add_user',
                    title: tl(trans.plot.name),
                    body: html.node`
                        ${(input_box = input({
                            focus: true,
                            func: complete_add,
                            warn_if_empty: true
                        }))}
                        <div class="modal-footer">
                            <button class="see-more cancel left-icon" onclick=${() => dialog_rm({ id: 'add_user' })}>
                                ${tl(trans.cancel)}
                            </button>
                            <div class="fill"></div>
                            <button class="btn primary icon" data-type="add" onclick=${() => complete_add(input_box.value)}>
                                ${tl(trans.add)}
                            </button>
                        </div>
                    `
                });

                setTimeout(() => {
                    input_box.focus();
                }, 1);

                function complete_add(val) {
                    if (val.length < 1 || users.includes(val)) return;

                    dialog_rm({ id: 'add_user' });

                    users = [...users, val];
                    render_users();
                }
            }}>
                ${icon({ name: icons.plus })}
            </button>
        `);
    }

    function user_placeholder(name, avatar) {
        if (name == auth.name) avatar = auth.avatar;

        const elem = html.node`
            <div class="compare-user" />
        `;

        render(elem, html`
            ${render_user(name, avatar, elem)}
        `);

        return elem;
    }

    function fetch_data_set(user, media = null) {

    }
}
