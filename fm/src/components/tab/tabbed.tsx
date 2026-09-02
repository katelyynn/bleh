import { createRef, ReactElement, ReactNode } from 'jsx-dom';
import { Button } from '@/components/button/button.tsx';
import { Icon } from '@/components/shared/icon.tsx';
import { log } from '@/build/log.ts';

export interface TabbedPage {
	icon: string;
	label: ReactNode;
	content: Element | (() => Element);
}

type TabbedElement = HTMLDivElement & {
	update: () => void;
};

interface TabbedProps {
	ref?: ReturnType<typeof createRef<TabbedElement>>;
	header?: ReactNode;
	chibi?: boolean;
	pages: Record<string, TabbedPage>;
	page?: string;
}

export function Tabbed({
	ref,
	header,
	chibi,
	pages,
	page,
}: TabbedProps) {
	const tabs: TabElement[] = [];
	const content = createRef();

	if (!page) page = Object.keys(pages)[0];

	const elem = (
		<div class='tabbed' ref={ref}>
			<div class={['tabbed-top', header != undefined && 'with-header']}>
				{header && (
					<div class='tabbed-top-header'>
						{header}
					</div>
				)}
				<nav class='tabbed-tabs'>
					{Object.entries(pages).map(([p, value]) => {
						const elem = (
							<Tab
								chibi={chibi}
								icon={value.icon}
								label={value.label}
								id={p}
								onChange={() => {
									page = p;
									update();
								}}
							/>
						) as TabElement;

						tabs.push(elem);

						return elem;
					})}
				</nav>
			</div>
			<main class='tabbed-content' ref={content} />
		</div>
	) as TabbedElement;

	elem.update = update;

	function update() {
		if (!pages[page!]) {
			page = Object.keys(pages)[0];
			update();
			return;
		}

		log(`changing page to ${page}`, 'tabbed', 'info', {
			page: pages[page!],
		});
		tabs.forEach((tab) => {
			tab.active = tab.id == page;
		});

		if (typeof pages[page!].content == 'function') {
			content.current.replaceChildren(
				(pages[page!].content as () => Element)(),
			);
		} else {
			content.current.replaceChildren(pages[page!].content);
		}
	}

	update();

	return elem;
}

interface TabProps {
	label: ReactNode;
	icon: string;
	chibi?: boolean;
	active?: boolean;
	id: string;
	onChange?: (v: string) => void;
}

type TabElement = HTMLButtonElement & {
	id: string;
	active: boolean;
};

export function Tab({
	label,
	icon,
	chibi,
	active,
	id,
	onChange,
}: TabProps) {
	const elem = (
		<Button
			className={`tabbed-tab ${chibi && 'tabbed-tab-chibi'}`}
			onClick={() => {
				if (onChange) onChange(id);
			}}
		>
			<Icon name={icon} />
			{label}
		</Button>
	) as TabElement;

	Object.defineProperty(elem, 'id', {
		get() {
			return id;
		},
	});

	Object.defineProperty(elem, 'active', {
		get() {
			return active;
		},
		set(v: boolean) {
			active = v;
			update();
		},
	});

	function update() {
		elem.setAttribute('aria-checked', String(active));
	}

	update();

	return elem;
}
