/**
 * bleh, an extension for the music site Last.fm
 * Copyright (c) 2024-2026 katelyn and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Icon, icons } from '@/components/shared/icon.tsx';
import { Button } from '@/components/button/button.tsx';
import { tl, trans } from '@/build/trans.ts';
import tippy from 'tippy.js';
import { Input } from '@/components/input/input.tsx';
import { createRef, ReactNode } from 'jsx-dom';

interface ListProps {
	ref?: ReturnType<typeof createRef<HTMLDivElement>>;
	children: ReactNode;
}

export function List({
	ref,
	children,
}: ListProps) {
	return (
		<div class={['setting-lists']} ref={ref}>
			{children}
		</div>
	);
}

interface ListItemProps {
	icon?: string;
	name: string;
	onMove?: (direction: 'left' | 'right') => void;
	onRemove?: () => void;
	canRemove?: boolean;
}

export function ListItem({
	icon,
	name,
	onMove,
	onRemove,
	canRemove = true,
}: ListItemProps) {
	const elem = (
		<div class={['setting-list-item', 'current']}>
			<div class='setting-list-item-info'>
				{icon && (
					<div class='setting-list-icon'>
						<Icon name={icon} />
					</div>
				)}
				{name}
			</div>
			{canRemove && (
				<Button
					chibi
					className='setting-list-item-btn'
					onClick={onRemove}
				>
					<Icon name={icons.minus} />
					{tl(trans.remove)}
				</Button>
			)}
		</div>
	);

	return elem;
}

interface ListCandidateProps {
	icon?: string;
	name: string;
	onAdd?: () => void;
}

export function ListCandidate({
	icon,
	name,
	onAdd,
}: ListCandidateProps) {
	const elem = (
		<div class={['setting-list-item']}>
			<div class='setting-list-item-info'>
				{icon && (
					<div class='setting-list-icon'>
						<Icon name={icon} />
					</div>
				)}
				{name}
			</div>
			<Button
				chibi
				className='setting-list-item-btn'
				onClick={onAdd}
			>
				<Icon name={icons.plus} />
				{tl(trans.add)}
			</Button>
		</div>
	);

	return elem;
}

interface ListAddProps {
	onAdd?: (value: string) => void;
}

export function ListAdd({
	onAdd,
}: ListAddProps) {
	const elem = (
		<button type='button' class={['btn', 'setting-list-item', 'current']}>
			<div class='setting-list-item-info'>
				<Icon name={icons.plus} />
				{tl(trans.add)}
			</div>
		</button>
	);

	const input = createRef();

	const modal = tippy(elem, {
		theme: 'window',
		content: (
			<Input
				ref={input}
				onSubmit={(val) => {
					modal.destroy();
					onAdd?.(val as string);
				}}
			/>
		),
		placement: 'bottom',
		interactive: true,
		interactiveBorder: 10,
		trigger: 'click',
		appendTo: document.body,

		onShow() {
			setTimeout(() => {
				input.current.focus();
			}, 0);
		},
	});

	return elem;
}
