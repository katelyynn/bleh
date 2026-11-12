import {
	flip, inline,
	offset as offsetMiddleware,
	shift as shiftMiddleware,
} from "@floating-ui/dom";
import { NavWindow, NavWindowContents } from "../menu/nav_window";
import { menu_tooltip, Tooltip, TooltipInstance } from "../shared/tooltips";
import { ReactNode } from "jsx-dom";
import { Button } from "../button/button";
import { tl, trans } from "@/build/trans";
import { Icon, icons } from "../shared/icon";
import { auth, root } from "@/build/page";

export function page_search(form: HTMLFormElement, input: HTMLInputElement) {
	return;

	const host = form;
	const element = (
		<Tooltip theme='search'>
			<NavWindowContents>
				<SearchSection label={tl(trans.own_profile)}>
					<div class='browse-for-items'>
						<BrowseFor href={`${root}user/${auth.name}/library`}>
							<Icon name={icons.play} />
							{tl(trans.scrobbles)}
						</BrowseFor>
						<BrowseFor href={`${root}user/${auth.name}/library/artists`}>
							<Icon name={icons.artists} />
							{tl(trans.artists)}
						</BrowseFor>
						<BrowseFor href={`${root}user/${auth.name}/library/albums`}>
							<Icon name={icons.albums} />
							{tl(trans.albums)}
						</BrowseFor>
						<BrowseFor href={`${root}user/${auth.name}/library/tracks`}>
							<Icon name={icons.tracks} />
							{tl(trans.tracks)}
						</BrowseFor>
					</div>
				</SearchSection>
				<SearchSection label={tl(trans.own_profile)}>
					<div class='browse-for-items'>
						<BrowseFor href={`${root}user/${auth.name}/library`}>
							<Icon name={icons.play} />
							{tl(trans.scrobbles)}
						</BrowseFor>
						<BrowseFor href={`${root}user/${auth.name}/library/artists`}>
							<Icon name={icons.artists} />
							{tl(trans.artists)}
						</BrowseFor>
						<BrowseFor href={`${root}user/${auth.name}/library/albums`}>
							<Icon name={icons.albums} />
							{tl(trans.albums)}
						</BrowseFor>
						<BrowseFor href={`${root}user/${auth.name}/library/tracks`}>
							<Icon name={icons.tracks} />
							{tl(trans.tracks)}
						</BrowseFor>
					</div>
				</SearchSection>
			</NavWindowContents>
		</Tooltip>
	);

	const tooltip = new TooltipInstance(host, element, {
		placement: 'bottom',
		ariaEnabled: true,
		middleware: [
			flip(),
			inline(),
			shiftMiddleware({
				crossAxis: true,
				padding: 6,
			}),
			offsetMiddleware(6),
		],
		onShow: () => {
			setTimeout(() => {
				input.focus();
			}, 0);
		},
		onHide: () => {
			document.body.removeEventListener('click', listener);
			document.body.removeEventListener('contextmenu', listener);
		},
	});

	let cancel_close = false;

	const listener: EventListener = ({ target: t }) => {
		if (cancel_close) return;

		// TODO: if you click the button (or something inside it)
		// that triggered the menu to show,
		// it will fire this after the clicking again check
		// below:
		const target = t as HTMLElement | null;
		if (
			target && target instanceof HTMLElement &&
			target != tooltip.element && target != host &&
			!tooltip.element.contains(target) &&
			!target.closest('.tippy-box') &&
			!tooltip.element.querySelector('[aria-expanded="true"]') &&
			tooltip.is_mounted
		) {
			tooltip.hide();
		}
	};

	element.addEventListener('mousedown', () => {
		setTimeout(() => {
			input.focus();
		}, 0);
	});

	host.addEventListener('click', (e) => {
		cancel_close = true;
		console.info('click', e);

		setTimeout(() => {
			cancel_close = false;
		}, 0);

		// close when clicking again
		if (tooltip.is_mounted) {
			if (!host.matches(':focus-within')) tooltip.hide();
			return;
		}
		tooltip.show();

		setTimeout(() => {
			document.body.addEventListener('click', listener);
			document.body.addEventListener('contextmenu', listener);
		}, 0);
	});
}

interface SearchSectionProps {
	label: ReactNode;
	children: ReactNode;
}

function SearchSection({
	label,
	children
}: SearchSectionProps) {
	return (
		<div class='search-section'>
			<label class='search-section-label'>{label}</label>
			<div class='search-section-items'>
				{children}
			</div>
		</div>
	)
}

interface BrowseForProps {
	href: string;
	children: ReactNode;
}

function BrowseFor({
	href,
	children
}: BrowseForProps) {
	return (
		<Button className='browse-for' href={href}>
			{children}
		</Button>
	)
}
