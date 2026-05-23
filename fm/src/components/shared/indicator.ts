import { tl, trans } from "@/build/trans";
import { html } from "lighterhtml";

export function new_indicator() {
    return html.node`
        <label class="new-badge new colourful">${tl(trans.new)}</label>
    `;
}
