import { page } from "@/build/page";

export function see_more() {
    if (!page.structure.container) return;

    const links = page.structure.container.querySelectorAll(':is(.more-link, .more-link-with-action, .more-link-fullwidth-right, .more-link-fullwidth-right-flush-top, .more-link-fullwidth, .show-more, .music-more-link, .pagination-next, .pagination-previous) > a:not([data-see-more])');
    links.forEach(link => {
        link.setAttribute('data-see-more', 'true');

        const parent = link.parentElement;
        const classes = parent.classList;

        link.classList.add('see-more');

        if (classes == 'pagination-previous') {
            link.classList.add('pagination-previous-link');
        }
    });
}
