import { log } from "@/build/log";
import { auth, page, root, urls } from "@/build/page";
import { checkup_page_structure } from "@/components/page/structure";
import { is_url, update_page } from "@/page";

export function bleh_now() {
    page.structure.container = document.body.querySelector('.page-content');
    try {
        page.structure.row = page.structure.container.querySelector('.row');
        page.structure.main = page.structure.row.querySelector('.col-main');
        page.structure.side = page.structure.row.querySelector('.col-sidebar');
    } catch (e) {
        log('unable to find elements', 'page structure');
    }

    let content_top = document.body.querySelector('.content-top');

    checkup_page_structure(false, content_top);

    page.type = 'bleh_now';
    page.subpage = '';

    log('status is', 'page', 'info', page);

    update_page();

    // remove error stuff cus we control this page
    page.structure.row.removeChild(page.structure.row.firstElementChild);
    page.structure.row.removeChild(page.structure.row.firstElementChild);

    page.structure.container.classList.add('has-cards-view');
    page.structure.content.classList.add('cards-view');

    page.state.bleh_now = {
        name: null,
        artist: null
    };

    get_recents(auth.name);
    const timer = setInterval(() => {
        if (!is_url(urls.now)) {
            clearInterval(timer);
            return;
        }

        get_recents(auth.name);
    }, 10000);
}

function get_recents(user: string) {
    fetch(`${root}user/${user}/partial/recenttracks?ajax=1`)
        .then(res => res.text())
        .then(dom => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(dom, 'text/html');

            const list = doc.querySelector('.chartlist');
            if (!list) return;

            const items = list.querySelectorAll('.chartlist-row:not(.chartlist-row--interlist-ad)');
            if (!items) return;

            const most_recent = items[0];
            const name = most_recent.querySelector('.chartlist-name').textContent.trim().toLowerCase();
            const artist = most_recent.querySelector('.chartlist-artist').textContent.trim().toLowerCase();

            const previous_now = page.state.bleh_now;
            page.state.bleh_now = {
                name,
                artist
            }

            if (previous_now.name == name && previous_now.artist == artist) return;

            new_poll();
        });
}

function new_poll() {
    console.info('new poll', page.state.bleh_now);
}
