/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { html } from 'lighterhtml';
import { random_list, root } from '@/build/page';
import { tl, trans } from '@/build/trans';
import {
	dialog,
	dialog_rm,
	FooterFill,
	ModalFooter,
} from '@/components/dialog/dialog';
import { input } from '@/components/settings/input';
import { notify } from '@/components/dialog/notify';
import { log } from '@/build/log.ts';
import { toggle } from '@/components/settings/toggle';
import { pad2 } from '@/build/tools';
import tippy from 'tippy.js';
import { setting } from '../settings/settings';
import { settings } from '@/build/config';
import { DateTime } from 'luxon';
import {
	FormActions,
	FormCombo,
	FormInner,
	GenericLabel,
	ScrobbleForm,
} from '@/components/form/form.tsx';
import { Input } from '@/components/input/input.tsx';
import { Button, ButtonGroup } from '@/components/button/button.tsx';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { createRef } from 'jsx-dom';
import { SettingCheckbox } from '@/components/settings/provider/checkbox.tsx';
import { HybridTimeframePicker } from '@/components/date/timeframe.tsx';
import { SeeMore } from '@/components/text/see_more.tsx';

interface submit_scrobble {
	pre_track?: string;
	pre_album?: string;
	pre_artist?: string;
	pre_album_artist?: string;
	pre_timestamp?: number;
	func?: () => void;
	can_api?: boolean;
}

export function submit_scrobble({
	pre_track = '',
	pre_album = '',
	pre_artist = '',
	pre_album_artist = '',
	pre_timestamp = 0,
	func,
	can_api,
}: submit_scrobble) {
	if (can_api == undefined) {
		can_api = localStorage.getItem('bleh_auth') &&
				localStorage.getItem('bleh_auth_valid') === 'true' || false;
	}

	if (!can_api) {
		window.location.href = `${root}bleh/general?setting=api`;
		return;
	}

	const random = random_list[Math.floor(Math.random() * random_list.length)];

	const track = createRef();
	const album = createRef();
	const artist = createRef();
	const album_artist = createRef();
	const use_current = createRef();
	let date;

	const create_scrobble = createRef();

	const max_date = new Date();
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
		body: (
			<>
				<ScrobbleForm>
					<FormCombo>
						<FormInner>
							<GenericLabel>{tl(trans.track)}</GenericLabel>
							<Input
								value={pre_track}
								placeholder={tl(trans.example, {
									v: random.track,
								}) as string}
								ref={track}
							/>
							<GenericLabel>{tl(trans.album)}</GenericLabel>
							<Input
								value={pre_album}
								placeholder={tl(trans.example, {
									v: random.album,
								}) as string}
								ref={album}
							/>
						</FormInner>
						<FormActions>
							<Button
								chibi
								subtle
								tooltip={tl(trans.switch)}
								onClick={() => {
									const track_val = track.current.value;
									const album_val = album.current.value;

									if (!track_val && !album_val) return;

									track.current.value = album_val;
									album.current.value = track_val;
								}}
							>
								<Icon name={icons.switch} />
								{tl(trans.switch)}
							</Button>
						</FormActions>
					</FormCombo>
					<FormCombo>
						<FormInner>
							<GenericLabel>{tl(trans.artist)}</GenericLabel>
							<Input
								value={pre_artist}
								placeholder={tl(trans.example, {
									v: random.artist,
								}) as string}
								ref={artist}
							/>
							<GenericLabel>
								{tl(trans.album_artist)}
							</GenericLabel>
							<Input
								value={pre_album_artist}
								placeholder={tl(trans.example, {
									v: random.album_artist,
								}) as string}
								ref={album_artist}
							/>
						</FormInner>
						<FormActions>
							<Button
								chibi
								subtle
								tooltip={tl(trans.switch)}
								onClick={() => {
									const artist_val = artist.current.value;
									const album_artist_val =
										album_artist.current.value;

									if (!artist_val && !album_artist_val) {
										return;
									}

									artist.current.value = album_artist_val;
									album_artist.current.value = artist_val;
								}}
							>
								<Icon name={icons.switch} />
								{tl(trans.switch)}
							</Button>
						</FormActions>
					</FormCombo>
					<GenericLabel>{tl(trans.time)}</GenericLabel>
					<div class='toggle-and-time'>
						<SettingCheckbox
							standalone
							value={!pre_existing_date}
							name={tl(trans.use_current_time)}
							ref={use_current}
							onChange={(v) => {
								date.disabled(v);
							}}
						/>
						{date = input({
							type: 'date',
							value: pre_existing_date ? pre_timestamp : null,
							max: `${max_date.getFullYear()}-${
								pad2(max_date.getMonth() + 1)
							}-${pad2(max_date.getDate())}`,
							disabled: !pre_existing_date,
							value_in_iso: typeof pre_timestamp == 'number',
						})}
					</div>
				</ScrobbleForm>
				<ModalFooter>
					<SeeMore
						iconPlacement='left'
						icon={icons.x}
						onClick={() => {
							dialog_rm({ id: 'submit_scrobble' });
						}}
					>
						{tl(trans.cancel)}
					</SeeMore>
					<FooterFill />
					<ButtonGroup extra>
						<SettingCheckbox
							bind='auto_close_scrobble_modal'
							standalone
						/>
						<Button
							primary
							onClick={async () => {
								if (
									track.current.value == '' ||
									artist.current.value == ''
								) {
									notify({
										id: 'submit_scrobble',
										title: tl(trans.new_scrobble),
										body: tl(trans.missing_fields),
										type: 'error',
									});
									return;
								}

								track.current.disabled = true;
								album.current.disabled = true;
								artist.current.disabled = true;
								album_artist.current.disabled = true;
								use_current.current.disabled = true;
								date.disabled(true);
								create_scrobble.current.loading = true;

								if (
									album.current.value != '' &&
									album_artist.current.value == ''
								) {
									album_artist.current.value =
										artist.current.value;
								}

								const params = {
									sk: localStorage.getItem('bleh_auth'),
									artist: artist.current.value,
									track: track.current.value,
									timestamp: use_current.current.value
										? DateTime.now().toUnixInteger()
										: Math.floor(date.value / 1000),
								};

								if (album.current.value != '') {
									params.album = album.current.value;
								}
								if (album_artist.current.value != '') {
									params.albumArtist =
										album_artist.current.value;
								}

								const res = await fetch(
									'https://jufufu.katelyn.moe/api/lastfm',
									{
										method: 'POST',
										headers: {
											'content-type': 'application/json',
										},
										body: JSON.stringify({
											method: 'track.scrobble',
											params,
										}),
									},
								);

								const json = await res.json();
								log(
									'received response',
									'submit scrobble',
									'info',
									{
										result: json,
									},
								);

								function re_enable() {
									track.current.disabled = false;
									album.current.disabled = false;
									artist.current.disabled = false;
									album_artist.current.disabled = false;
									use_current.current.disabled = false;
									date.disabled(false);
									create_scrobble.current.loading = false;
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

								const error_code =
									json.scrobbles.scrobble.ignoredMessage.code;
								if (error_code > 0) {
									log('error', 'submit scrobble', 'error', {
										error_code,
									});
									notify({
										id: 'submit_scrobble',
										title: tl(trans.scrobble_failed),
										body: tl(
											trans
												.scrobble_error_codes[
													error_code
												],
										),
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
							}}
							ref={create_scrobble}
						>
							<Icon name={icons.plus} />
							{tl(trans.scrobble)}
						</Button>
					</ButtonGroup>
				</ModalFooter>
			</>
		),
	});
}
