//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html } from 'lighterhtml';
import { random_list, root } from '@/build/page';
import { tl, trans } from '@/build/trans';
import { dialog, dialog_rm } from '@/components/dialog/dialog';
import { input } from '@/components/settings/input';
import { notify } from '@/components/dialog/notify';
import { log } from '@/build/log.js';
import { toggle } from '@/components/settings/toggle';
import { pad2 } from '@/build/tools';
import tippy from 'tippy.js';
import { setting } from '../settings/settings';
import { settings } from '@/build/config';
import { DateTime } from 'luxon';

export function submit_scrobble({
	pre_track = '',
	pre_album = '',
	pre_artist = '',
	pre_album_artist = '',
	pre_timestamp = 0,
	func,
	can_api,
} = {}) {
	if (!can_api) {
		can_api = localStorage.getItem('bleh_auth') &&
			localStorage.getItem('bleh_auth_valid') === 'true';
	}

	if (!can_api) {
		window.location.href = `${root}bleh/general?setting=api`;
		return;
	}

	const random = random_list[Math.floor(Math.random() * random_list.length)];

	let track;
	let album;
	let artist;
	let album_artist;
	let use_current;
	let date;

	let create_scrobble;

	let max_date = new Date();
	max_date.setDate(max_date.getDate() + 1);

	const pre_existing_date = pre_timestamp != 0;

	log('requesting dialog', 'submit scrobble', 'info', {
		pre_track,
		pre_album,
		pre_artist,
		pre_album_artist,
		pre_timestamp,
		func,
		can_api,
	});

	dialog({
		id: 'submit_scrobble',
		title: tl(trans.new_scrobble),
		body: html.node`
            <div class="new-scrobble-form">
                <div class="form-combo">
                    <div class="form-inner">
                        <p class="generic-label">${tl(trans.track)}</p>
                        ${track = input({
			type: 'text',
			value: pre_track,
			placeholder: tl(trans.example, { v: random.track }),
			warn_if_empty: true,
		})}
                        <p class="generic-label">${tl(trans.album)}</p>
                        ${album = input({
			type: 'text',
			value: pre_album,
			placeholder: tl(trans.example, { v: random.album }),
		})}
                    </div>
                    <div class="form-actions">
                        ${() => {
			const btn = html.node`
                                <button class="btn chibi icon subtle" data-type="switch" onclick=${() => {
				const track_val = track.value;
				const album_val = album.value;

				if (!track_val && !album_val) return;

				track.value = album_val;
				album.value = track_val;
			}}>
                                    ${tl(trans.switch)}
                                </button>
                            `;

			tippy(btn, {
				content: btn.textContent,
			});

			return btn;
		}}
                    </div>
                </div>
                <div class="form-combo">
                    <div class="form-inner">
                        <p class="generic-label">${tl(trans.artist)}</p>
                        ${artist = input({
			type: 'text',
			value: pre_artist,
			placeholder: tl(trans.example, { v: random.artist }),
			warn_if_empty: true,
		})}
                        <p class="generic-label">${tl(trans.album_artist)}</p>
                        ${album_artist = input({
			type: 'text',
			value: pre_album_artist,
			placeholder: tl(trans.example, { v: random.album_artist }),
		})}
                    </div>
                    <div class="form-actions">
                        ${() => {
			const btn = html.node`
                                <button class="btn chibi icon subtle" data-type="switch" onclick=${() => {
				const artist_val = artist.value;
				const album_artist_val = album_artist.value;

				if (!artist_val && !album_artist_val) return;

				artist.value = album_artist_val;
				album_artist.value = artist_val;
			}}>
                                    ${tl(trans.switch)}
                                </button>
                            `;

			tippy(btn, {
				content: btn.textContent,
			});

			return btn;
		}}
                    </div>
                </div>
                <p class="generic-label">${tl(trans.time)}</p>
                <div class="toggle-and-time">
                    ${use_current = toggle({
			value: !pre_existing_date,
			type: 'checkbox',
			title: tl(trans.use_current_time),
			func: (state: boolean) => {
				date.disabled(state);
			},
		})}
                    ${date = input({
			type: 'date',
			value: pre_existing_date ? pre_timestamp : null,
			max: `${max_date.getFullYear()}-${pad2(max_date.getMonth() + 1)}-${
				pad2(max_date.getDate())
			}`,
			disabled: !pre_existing_date,
			value_in_iso: typeof pre_timestamp == 'number',
		})}
                </div>
            </div>
            <div class="modal-footer">
                <button class="see-more cancel left-icon" onclick=${() =>
			dialog_rm({ id: 'submit_scrobble' })}>
                    ${tl(trans.cancel)}
                </button>
                <div class="fill" />
                <div class="button-group extra">
                    ${
			setting({ id: 'auto_close_scrobble_modal', standalone: true })
		}
                    <button class="btn primary icon" data-type="add" ref=${(
			el,
		) => (create_scrobble = el)} onclick=${async () => {
			if (track.value == '' || artist.value == '') {
				notify({
					id: 'submit_scrobble',
					title: tl(trans.new_scrobble),
					body: tl(trans.missing_fields),
					type: 'error',
				});
				return;
			}

			track.disabled(true);
			album.disabled(true);
			artist.disabled(true);
			album_artist.disabled(true);
			use_current.disabled(true);
			date.disabled(true);
			create_scrobble.disabled = true;

			if (album.value != '' && album_artist.value == '') {
				album_artist.value = artist.value;
			}

			let params = {
				sk: localStorage.getItem('bleh_auth'),
				artist: artist.value,
				track: track.value,
				timestamp: use_current.checked()
					? DateTime.now().toUnixInteger()
					: Math.floor(date.value / 1000),
			};

			if (album.value != '') params.album = album.value;
			if (album_artist.value != '') {
				params.albumArtist = album_artist.value;
			}

			const res = await fetch(
				'https://jufufu.katelyn.moe/api/lastfm',
				{
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						method: 'track.scrobble',
						params,
					}),
				},
			);

			const json = await res.json();
			log('received response', 'submit scrobble', 'info', {
				result: json,
			});

			function re_enable() {
				track.disabled(false);
				album.disabled(false);
				artist.disabled(false);
				album_artist.disabled(false);
				use_current.disabled(false);
				date.disabled(false);
				create_scrobble.disabled = false;
			}

			if (json.error) {
				log('error', 'submit scrobble', 'error');
				notify({
					id: 'submit_scrobble',
					title: tl(trans.scrobble_failed),
					body: json.message,
					type: 'error',
					persist: true,
				});
				re_enable();
				return;
			}

			const error_code = json.scrobbles.scrobble.ignoredMessage.code;
			if (error_code > 0) {
				log('error', 'submit scrobble', 'error', {
					error_code,
				});
				notify({
					id: 'submit_scrobble',
					title: tl(trans.scrobble_failed),
					body: tl(trans.scrobble_error_codes[error_code]),
					type: 'error',
					persist: true,
				});
				re_enable();
				return;
			}

			notify({
				id: 'submit_scrobble',
				title: tl(trans.new_scrobble),
				body: params.track,
				type: 'success',
			});

			if (settings.auto_close_scrobble_modal) {
				dialog_rm({ id: 'submit_scrobble' });
			} else {
				dialog_rm({ id: 'submit_scrobble' });
				submit_scrobble({
					pre_track,
					pre_album,
					pre_artist,
					pre_album_artist,
					pre_timestamp,
					func,
					can_api,
				});
			}

			if (func) func();
		}}>
                        ${tl(trans.new)}
                    </button>
                </div>
            </div>
        `,
	});
}
