export function bleh_moderation() {

    alert("bleh_moderation")
    if(localStorage.getItem("bleh_moderation") == null) {
        // TODO: use github raw once this is live
        localStorage.setItem("bleh_moderation", JSON.stringify([
            {
                url: "https://files.sad.ovh/public/bleh/b0_racist.txt",
                type: "strings"
            },
            {
                url: "https://files.sad.ovh/public/bleh/b4_sexual.txt",
                type: "strings"
            }
        ]));
    }
    reload();
}

function reload() {
    const blocklistElement = document.getElementById("block-lists")
    blocklistElement.innerHTML = "";
    const blocklist = JSON.parse(localStorage.getItem("bleh_moderation"));
    blocklist.forEach((z,i) => {
        const elem = document.createElement("div")
        elem.className = "language-row";
        elem.innerHTML = `
                <div class="name">
          <h5>${z.url}</h5>
        </div>
        <div class="badges">
        <div class="new-badge">${z.type.substring(0,1).toUpperCase()+z.type.slice(1)}</div>
        </div>
        <div class="date">
          <button class="btn danger" onclick="_remove_block_index(${i})">Remove</button>
        </div>
        `
        blocklistElement.appendChild(elem)
    })
}
unsafeWindow._remove_block_index = (i) => {
    const blocklist = JSON.parse(localStorage.getItem("bleh_moderation"));
    blocklist.splice(i, 1);
    localStorage.setItem("bleh_moderation", JSON.stringify(blocklist));
    reload()
}

unsafeWindow._add_block = () => {
    const input = document.getElementById("block-list-input");
    const type = document.getElementById("block-list-type");
    if(!input.value.trim()) return;
    try {
        new URL(input.value.trim());
    } catch (_) {
        return;
    }

    const blocklist = JSON.parse(localStorage.getItem("bleh_moderation"));
    blocklist.push({ url: input.value.trim(), type: type.value });
    localStorage.setItem("bleh_moderation", JSON.stringify(blocklist));
    reload();
    input.value = "";
}

export function clean_message(message, type) {

}