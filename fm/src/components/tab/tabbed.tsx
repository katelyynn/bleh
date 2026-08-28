import { createRef, ReactElement, ReactNode } from 'jsx-dom';
import { Button } from '@/components/button/button.tsx';
import { Icon } from '@/components/shared/icon.tsx';
import { log } from '@/build/log.ts';

export interface TabbedPage {
	icon: string;
	label: ReactNode;
	content: Element;
}

interface TabbedProps {
	pages: Record<string, TabbedPage>;
	page?: string;
}

export function Tabbed({
	pages,
	page,
}: TabbedProps) {
	const tabs: TabElement[] = [];
	const content = createRef();

	if (!page) page = Object.keys(pages)[0];

	const elem = (
		<div class='tabbed'>
			<nav class='tabbed-tabs'>
				{Object.entries(pages).map(([p, value]) => {
					const elem = (
						<Tab
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
			<main class='tabbed-content' ref={content} />
		</div>
	);

	function update() {
		log(`changing page to ${page}`, 'tabbed', 'info', {
			page: pages[page!],
		});
		tabs.forEach((tab) => {
			tab.active = tab.id == page;
		});

		content.current.replaceChildren(pages[page!].content.cloneNode(true));
	}

	update();

	return elem;
}

interface TabProps {
	label: ReactNode;
	icon: string;
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
	active,
	id,
	onChange,
}: TabProps) {
	const elem = (
		<Button
			className='tabbed-tab'
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
