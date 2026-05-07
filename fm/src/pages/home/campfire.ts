import { settings } from '@/build/config';
import { auth, page, root } from '@/build/page';
import { romanise, sanitise } from '@/build/tools';
import { tl, trans } from '@/build/trans';
import { correct_artist, correct_item_by_artist, name_includes, smart_artists, smart_title } from '@/components/music/lotus';
import { redirect } from '@/components/music/music';
import { Hole, html, render } from 'lighterhtml';
import { load_profile_cache_externally, open_starred_friend_window } from '../profile/profile';
import { load_recent_tracks } from '../home';
import tippy from 'tippy.js';
import { is_sponsor } from '@/components/sponsor';

interface album {
    image: string,
    title: string,
    artist: string,
    plays: string,
    corrected_title: string,
    corrected_artist: string
}

export function campfire() {
  let previous_index = 0;
  let max_index = 0;
  let items_container: HTMLElement;
  let item_details: HTMLElement;
  let current_bg: HTMLElement;
  let previous_bg: HTMLElement;

  let visual_index = 0;
  let real_index = 0;
  let is_wrapping = false;

  const container = html.node`
    <div class="campfire">
      <div class="campfire-intro">
        <h2 class="music-section-heading">${tl(trans.your_recent_30_days)}</h2>
      </div>
      <div class="campfire-items" ref=${el => items_container = el} />
      <div class="campfire-details" ref=${el => item_details = el} />
      <div class="campfire-bg current" ref=${el => current_bg = el} />
      <div class="campfire-bg previous" ref=${el => previous_bg = el} />
    </div>
  `;
  page.structure.row.insertBefore(container, page.structure.content);

  campfire_extended(container);

  let albums: album[] = [];
  let album_elements: { elem: HTMLElement, index: number }[] = [];

  fetch(`${root}user/${auth.name}/partial/albums?albums_date_preset=LAST_30_DAYS&ajax=1`)
    .then(function (response) {
      console.log('returned', response, response.text);

      return response.text();
    })
    .then(function (dom) {
      let doc = new DOMParser().parseFromString(dom, 'text/html');
      console.log('DOC', doc);

      const items = doc.querySelectorAll('.grid-items > .grid-items-item');
      items.forEach(item => {
        const image = item.querySelector('.grid-items-cover-image-image img').src;
        const title = item.querySelector('.grid-items-item-main-text a').textContent;
        const artist = item.querySelector('.grid-items-item-aux-block').textContent;
        const plays = item.querySelector('.grid-items-item-aux-text a:last-child').textContent.trim();

        let corrected_title = romanise(correct_item_by_artist(title, artist));
        let corrected_artist = romanise(correct_artist(artist));

        albums.push({
          image: image.replace('/avatar300s/', '/500x500/'),
          title,
          artist,
          plays,
          corrected_title,
          corrected_artist
        });
      });

      max_index = albums.length - 1;

      visual_index = max_index + 1;
      real_index = 0;

      items_container.style.setProperty('--max-index', max_index.toString());

      const cloned_albums = [...albums, ...albums, ...albums];

      render(items_container, html`
        ${cloned_albums.map((album, index) => {
          const item_index = ((index % albums.length) + albums.length) % albums.length;

          const elem = html.node`
            <div class="campfire-item" style="--index: ${index}" onclick=${() => {
              if (is_wrapping) return;

              if (item_index != real_index) {
                let diff = item_index - real_index;
                if (diff > (max_index + 1) / 2) diff -= max_index + 1;
                else if (diff < -(max_index + 1) / 2) diff += max_index + 1;

                set_index(visual_index + diff);
              }
            }}>
              <div class="campfire-item-cover">
                <img src=${album.image} alt=${album.corrected_title} />
              </div>
            </div>
          `;

          album_elements.push({ elem, index: item_index });

          return elem;
        })}
      `);

      let timeout;
      container.addEventListener('wheel', e => {
        e.preventDefault();
        if (timeout) return;

        timeout = setTimeout(() => {
            timeout = null;
        }, 0.15);

        const direction = Math.sign(e.deltaY);
        if (direction == 0) return;
        set_index(visual_index + direction);
      }, { passive: false });

      set_index(visual_index);
    });

  function set_index(index: number) {
    if (is_wrapping) return;

    real_index = ((index % albums.length) + albums.length) % albums.length;

    previous_index = visual_index;
    visual_index = index;

    items_container.style.setProperty('--selected-index', visual_index.toString());

    album_elements.forEach(({ elem, index: i }) => {
        elem.setAttribute('aria-checked', (i == real_index).toString());
    });

    if (visual_index <= max_index || visual_index >= (max_index * 2) + 2) {
        is_wrapping = true;

        setTimeout(() => {
            items_container.style.setProperty('--trans-toggle', '0');

            visual_index = real_index + max_index + 1;
            items_container.style.setProperty('--selected-index', visual_index.toString());

            void items_container.offsetWidth;

            items_container.style.setProperty('--trans-toggle', '1');
            is_wrapping = false;
        }, 500);
    }

    const album = albums[real_index];

    current_bg.style.setProperty('background-image', `url(${album.image})`);

    console.info('album', album);

    let formatted_title: string | Hole = album.corrected_title;
    let formatted_artist: string | Hole = album.corrected_artist;

    if (settings.format_guest_features) {
      const formatted = name_includes(album.title, album.artist);

      formatted_title = smart_title(formatted[0], formatted[1]);
      formatted_artist = smart_artists(formatted[2], formatted[3]);
    }

    render(item_details, html``);
    render(item_details, html`
      <a class="campfire-title smart-title" href="${root}music/${sanitise(album.artist)}/${sanitise(album.title)}" target="_blank">
        ${formatted_title}
      </a>
      <span class="campfire-artist">
        ${settings.format_guest_features ? formatted_artist : html.node`<a class="campfire-artist" href="${root}music/${redirect()}${sanitise(album.artist)}" target="_blank">${album.corrected_artist}</a>`}
      </span>
      <div class="campfire-plays">
        ${album.plays}
      </div>
    `);
  }
}

function campfire_extended(container: HTMLElement) {
    const friends = settings.friends as string[];

    let summary;

    container.after(html.node`
        <section class="friends-panel">
            <h2>${tl(trans.scrobbling_now)}</h2>
            ${friends.length > 0 ? html.node`
                <div class="friends">
                    ${friends.map((friend: string) => campfire_friend(friend))}
                </div>
            ` : html.node`
                <div class="placeholder-block">
                    <div class="placeholder-head">ദ്ദി◝ ⩊ ◜.ᐟ</div>
                    <div class="placeholder-summary" ref=${el => summary = el}>${{html: tl(trans.better_with_friends, { a: `<a>`, '/a': '</a>' }) }}</div>
                </div>
            `}
        </section>
    `);

    if (summary) {
        const link = summary.querySelector('a');
        if (!link) return;

        link.onclick = () => {
            open_starred_friend_window();
        }
    }
}

function campfire_friend(friend: string) {
    let cover_art: HTMLElement;
    let track_info: HTMLElement;
    let user_avatar: HTMLElement;
    let user_name: HTMLElement;
    let track_time: HTMLElement;

    const elem = html.node`
        <div class="user friend hidden-user" data-live="false">
            <div class="user-avatar cover-art" ref=${el => cover_art = el}>
                <div class="bleh-icon loading-spinner" />
            </div>
            <div class="user-info">
                <div class="user-name">
                    <div class="avatar" ref=${el => user_avatar = el}>
                        <div class="bleh-icon loading-spinner" />
                    </div>
                    <p ref=${el => user_name = el}>@${friend}</p>
                    <a class="link-block-cover-link" href="${root}user/${friend}" />
                </div>
                <div class="user-about track" ref=${el => track_info = el}>
                    <p>${tl(trans.loading)}</p>
                </div>
                <div class="user-time" ref=${el => track_time = el} />
            </div>
        </div>
    `;

    load_profile_cache_externally(friend).then(cache => {
        render(user_avatar, html`
            <img src=${cache.avatar} alt=${friend}>
        `);

        if (cache.username)
            user_name.textContent = cache.username;

        load_recent_tracks(friend).then(tracks => {
            const item = tracks[0];

            if (item) {
                let sister = item.sister;
                let name = item.name;

                if (settings.format_guest_features) {
                    const formatted = name_includes(name, sister);

                    name = html.node`${smart_title(formatted[0], formatted[1])}`;
                    sister = html.node`${smart_artists(formatted[2], formatted[3])}`;
                } else if (settings.corrections) {
                    sister = romanise(correct_artist(item.sister));
                    name = romanise(correct_item_by_artist(item.name, item.sister));
                }

                const valid = is_sponsor(friend);

                if (cache.username && valid) {
                    render(user_name, html`
                        <strong class="username-combo">
                            <span class="username-custom">${cache.username}</span>
                            <span class="username-original">
                                <span class="at">@</span>${friend}
                            </span>
                        </strong>
                    `);
                } else {
                    render(user_name, html`
                        <strong><span class="at">@</span>${friend}</strong>
                    `);
                }

                if (item.time) {
                    track_time.textContent = item.time;
                } else {
                    elem.classList.remove('hidden-user');
                    track_time.textContent = tl(trans.scrobbling_now);

                    elem.setAttribute('data-live', 'true');
                }

                render(cover_art, html`
                    <img src=${item.avatar} alt=${name}>
                    <a class="link-block-cover-link" href="${root}music/${item.sister}/_/${item.name}" />
                `);

                const track_elem = html.node`
                    <a class="wiki-link icon" data-link-type="track" href="${root}music/${item.sister}/_/${item.name}">${name}</a>
                `;

                tippy(track_elem, {
                    theme: 'name-sister-combo',
                    content: html.node`
                        <span class="name">${{ html: track_elem.innerHTML }}</span>
                        <span class="sister">${sister}</span>
                    `
                });

                render(track_info, track_elem);
            }
        });
    });

    return elem;
}

function get_loop_index(index: number, selected: number, max: number): number {
  let diff = index - selected;

  if (diff > (max + 1) / 2) diff -= max + 1;
  else if (diff < -(max + 1) / 2) diff += max + 1;

  return diff;
}
