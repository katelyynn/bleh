/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createRef } from 'jsx-dom';
import {
	avatar,
	patch_avatar,
	style_name_from_badge,
} from '@/components/shared/avatar.tsx';
import { root } from '@/build/page.ts';
import { WithChildren } from '@/types/generic.tsx';

interface MessageSenderProps {
	image: string;
	name: string;
}

export function MessageSender({
	image,
	name,
}: MessageSenderProps) {
	const avi = createRef();

	const elem = (
		<div class={['message-sender', 'colourful']}>
			<div class='inbox-message-sender-avatar'>
				<span class='avatar' ref={avi}>
					<img src={avatar(image, 'avatar170s')} loading='lazy' />
				</span>
			</div>
			<a class='inbox-message-sender-name' href={`${root}user/${name}`}>
				{name}
			</a>
		</div>
	);

	const your_badge = patch_avatar(avi.current, name);
	style_name_from_badge(elem, your_badge);

	return elem;
}

export function MessageContent({
	children,
}: WithChildren) {
	return (
		<div class='message-content'>
			{children}
		</div>
	);
}
