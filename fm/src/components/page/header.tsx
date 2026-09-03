import { ReactNode } from 'jsx-dom';
import { tl, trans } from '@/build/trans.ts';
import { SubText } from '@/components/text/sub.tsx';
import { InfoTip } from '@/components/text/tip.tsx';
import { WithChildren } from '@/types/generic.tsx';

interface PageHeaderProps {
	type: 'artist' | 'album' | 'track' | 'profile' | 'search' | 'tag';
	combined?: boolean;
	name?: ReactNode;
	avatar?: ReactNode;
	children?: ReactNode;
	extra?: ReactNode;
}

export function PageHeader({
	type,
	combined,
	name,
	avatar,
	children,
	extra,
}: PageHeaderProps) {
	const generic = !!avatar;
	const label = tl(trans[type]);

	return (
		<section class={['page-header', `for-${type}`]}>
			{avatar && (
				<div class='page-header-avatar-list'>
					{avatar}
				</div>
			)}
			<div class={['page-header-info', 'has-main-info']}>
				<div class='main-info'>
					{!combined ? <SubText>{label}</SubText> : (
						<SubText>
							{tl(trans.artists)}
							<InfoTip>
								{tl(trans.artists_tooltip)}
							</InfoTip>
						</SubText>
					)}
					{generic
						? (
							<>
								{children}
							</>
						)
						: (
							<h1
								class={[
									'page-header-title',
									'generic-page-title',
								]}
							>
								{name}
							</h1>
						)}
				</div>
				{extra}
			</div>
		</section>
	);
}

interface PageHeaderTitleProps {
	combined?: boolean;
	children: ReactNode;
}

export function PageHeaderTitle({
	combined,
	children,
}: PageHeaderTitleProps) {
	return (
		<div class='title-container' data-multi={String(combined)}>
			{children}
		</div>
	);
}
