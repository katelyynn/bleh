import { tl, trans } from "@/build/trans";
import { Placeholder } from "../loading/placeholder";

export type OracleCreditType = 'vocal' | 'recording' | 'mix' | 'engineer' | 'writer';

export type FormattedOracleCredits = Partial<Record<OracleCreditType, FormattedOracleCredit[]>>;

interface FormattedOracleCredit {
	name: string;
	attributes: string[];
}

interface OracleCreditsProps {
	name: string;
	credits: FormattedOracleCredits
}

export function OracleCredits({
	name,
	credits
}: OracleCreditsProps) {
	const order = [
		'vocal',
		'recording',
		'mix',
		'engineer',
		'writer',
	];

	const grouped = Object.entries(credits)
		.sort(([a], [b]) => {
			const a_index = order.indexOf(a);
			const b_index = order.indexOf(b);

			if (a_index == -1) return 1;
			if (b_index == -1) return -1;

			return a_index - b_index;
		});

	return (
		<div class='oracle-credits'>
			{grouped.length > 0 ? grouped.map(([type, artists]) => (
				<OracleCredit type={type} credits={artists} />
			)) : (
				<Placeholder face='(๑/////๑ " )'>
					{tl(trans.oracle_no_credits)}
				</Placeholder>
			)}
		</div>
	)
}

interface OracleCreditProps {
	type: OracleCreditType,
	credits: FormattedOracleCredit[]
}

export function OracleCredit({
	type,
	credits
}: OracleCreditProps) {
	const text = trans.hasOwnProperty(`oracle_${type}`)
		? tl(trans[`oracle_${type}`])
		: `${type} (unknown, please report as bug)`;

	return (
		<div class='oracle-credit-group'>
			<h4 class='oracle-credit-group-title'>
				{text}
			</h4>
			<div class='oracle-credit-list'>
				{credits.map((credit, i) => (
					<>
						<OracleCreditArtist name={credit.name} attributes={credit.attributes} />
						{i < credits.length - 1 && ', '}
					</>
				))}
			</div>
		</div>
	)
}

function OracleCreditArtist({
	name,
	attributes
}: FormattedOracleCredit) {
	return (
		<div class='oracle-credit'>
			<a class='oracle-credit-link'>
				{name}
				{attributes.length > 0 && <span class='oracle-credit-attributes'>({attributes.join(', ')})</span>}
			</a>
		</div>
	)
}
