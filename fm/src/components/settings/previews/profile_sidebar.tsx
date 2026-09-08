import { createRef } from 'jsx-dom';
import { useSettings } from '@/page.ts';
import { Icon, icons } from '@/components/shared/icon.tsx';
import { tl, trans } from '@/build/trans.ts';

interface ProfileSidebarProps {
	ref?: ReturnType<typeof createRef<ProfileSidebarElement>>;
}

type ProfileSidebarElement = HTMLDivElement & {
	update: () => void;
};

export function ProfileSidebar({
	ref,
}: ProfileSidebarProps) {
	const about = createRef();
	const progress = createRef();

	const elem = (
		<div class='profile-sidebar-preview' ref={ref}>
			<div class='about-me-preview'>
				<div class='about-me-preview-title'>{tl(trans.about)}</div>
				<div class='about-me-preview-body' ref={about} />
			</div>
			<div class='your-progress-preview' ref={progress}>
				<div class='about-me-preview-title'>{tl(trans.scrobbles)}</div>
				<div class='your-progress-label'>{tl(trans.this_year)}</div>
				<div class='your-progress-bar your-progress-bar-this-week' />
				<div class='your-progress-label'>{tl(trans.last_year)}</div>
				<div class='your-progress-bar' />
			</div>
		</div>
	) as ProfileSidebarElement;

	function update() {
		const md = useSettings.get('bio_markdown') as boolean;
		const show_progress = useSettings.get('show_your_progress') as boolean;

		if (md) {
			about.current.classList.add('with-md');
			about.current.replaceChildren(
				<>
					<div class='about-me-preview-image'>
						<Icon name={icons.image} />
					</div>
					<div class='about-me-preview-text' />
				</>,
			);
		} else {
			about.current.classList.remove('with-md');
			about.current.replaceChildren(
				<>
					<div class='about-me-preview-text text-big' />
					<div class='about-me-preview-text text-big' />
					<div class='about-me-preview-text text-big' />
				</>,
			);
		}

		progress.current.classList.toggle('hidden-on-profile', !show_progress);
	}

	update();

	elem.update = update;

	return elem;
}
