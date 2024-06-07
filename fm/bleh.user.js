// ==UserScript==
// @name         bleh
// @namespace    http://last.fm/
// @version      2024.0607
// @description  bleh!!! ^-^
// @author       kate
// @match        https://www.last.fm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=last.fm
// @grant        GM_addStyle
// @updateURL    https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.js
// @downloadURL  https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.js
// ==/UserScript==

let version = '2024.0607';

let profile_badges = {
    'cutensilly': {
        type: 'queen',
        name: 'bleh Owner'
    },
    'Iexyy': {
        type: 'cat',
        name: 'it\'s a kitty!!'
    },
    'bIeak': {
        type: 'cat',
        name: 'it\'s a kitty!!'
    },
    'peoplepleasr': {
        type: 'cat',
        name: 'it\'s a kitty!!'
    },
    'twolay': {
        type: 'cat',
        name: 'it\'s a kitty!!'
    },
    'aoivee': {
        type: 'cat',
        name: 'it\'s a kitty!!'
    },
    'Serprety': {
        type: 'cat',
        name: 'it\'s a kitty!!'
    },
    'RazzBX': {
        type: 'cat',
        name: 'it\'s a kitty!!'
    },
    'ivyshandle': {
        type: 'cat',
        name: 'it\'s a kitty!!'
    },
    'KuroinHeroin': {
        type: 'mask',
        name: 'kimchi lover'
    },
    'u5c': {
        type: 'paw',
        name: 'silly creature'
    },
    'destons': {
        type: 'colon-three',
        name: ':3²'
    }
};

let theme_names = {
    'dark': 'Dark',
    'light': 'Light',
    'oled': 'OLED'
};


let settings_template = {
    theme: 'dark',
    gloss: 0,
    gendered_tags: false,
    show_extra_nav: true,
    hue: 255,
    sat: 1,
    lit: 1,
    invert_interactable_colour: false,
    dev: 0,
    hide_hateful: true
};
let settings_base = {
    hue: {
        css: 'hue',
        unit: '',
        value: 255,
        type: 'slider'
    },
    sat: {
        css: 'sat',
        unit: '',
        value: 1,
        type: 'slider'
    },
    lit: {
        css: 'lit',
        unit: '',
        value: 1,
        type: 'slider'
    },
    gloss: {
        css: 'gloss',
        unit: '',
        value: 0,
        type: 'slider'
    },
    main_width: {
        css: 'main_width',
        unit: 'px',
        value: 902,
        type: 'slider'
    },
    nav: {
        css: 'show_extra_nav',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    gendered_tags: {
        css: 'gendered_tags',
        unit: '',
        value: false,
        values: [false, true],
        type: 'toggle'
    },
    hide_hateful: {
        css: 'hide_hateful',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    }
}


let redacted = [
    'underthefl00d',
    'sonicgamer420', 'punishedcav', 'whatisajuggalo', 'spartan122s', 'ruszaj', 'chandiwila999', 'deadaptation', 'shamsrealm', 'dread1nat0r', 'oskxzr', 'supersonic2324', 'luna', 'daysbeforepazi', 'reypublican', 'urkel_waste', 'bloodtemptress', 'enderbro1945', 'nxtready', 'hammurabis', 'flammenjunge', 'hotgreekman', 'minajspace',
    'sudaengi', 'antisemitic', 'alfonsorivera07', 'gueulescassees', 'bit188', 'aryanorexic', 'archive44', 'goyslop', 'lzxy', 'i984june', 'babayoga88', 'goatuser', 'synagogueburner', 'cybercat2k6',
    'thekimsteraight', 'squiggins', 'atwistedpath', 'aeriscupid', 'nicefeetliberal', 'kanyebeststan', 'a-_-_-_-_-_-_-_', 'wurzel362', 'chaosophile', 'sagamore_br', 'account124', 'oliwally2', 'lucasthales', 'thedadbrains', 'artofiettinggo', 'lumyh', 'meltingwalls', 'meowpoopoo', 'aeest', 'ajrogers25', 'flvcko5000', 'yungrapunxota', 'sen_nn', 'chickenoflight', 'majorcbartl', 'entranas', 'julyrent', 'misaeld7', 'sircarno', 'getyuu', 'ifuckbees', 'bigbabygoat-116', 'matranc', 'andre3x', 'johanvillian666', 'souljahwitch_', 'selenabeer', 'kbasfm', 'c4alexo', 'aantoniotapia', 'bobbygordon4', 'con_8l', 'kebfm', 'alex5un', 'bluefacee', 'itachiu1', 'tardslayer87', 'sharosky',
    'craziidago',
    'calicowawawa', 'ieo-',
    'dyetzer09', 'sevendotz', 'geckogunner21',
    'bigman_kam', 'juanluisgg15', 'xxalesonikps2xx', 'noodlebaths',
    'entrys', 'haviebaby',
    'ifuckenhatebts', 'cuteandfunny', 'nickithebarbie', 'kristojk', 'lovethebabiesss', 'thecrybabygirl', 'faafasfjh12', 'lost', 'isucktoes_', 'rightangles', 'supadupaseb', 'septembersun-_-', 'yy02', 'breakpoint420', 'twillaz', 'angel-food', 'owenfomistu', 'nuhovich', 'einstieg', 'sigmevious', 'lovedytea',
    'eminemiover911', 'ranmaru1232', 'littlegayman', 'overkektor', 'zigger0707', 'jtldn', 'bakaanon', 'thewatcher777', 'guicute', 'wempep', 'beingofevil', 'marie_cachet', 'rusnazi8814', 'go1nger', 'pranav777', 'creativezito', 'djangelinfinity', 'cowboy-robot', 'riskgrave', 'charmingaxelotl', 'naterade20', 'willgregg10', 'avantish', 'shaggy-maggot', 'slicejosiah', 'airshots22', 'tacomiw', 'davebfc', 'ukulilyfilly', 'speepyboo', 'roosterteethz', 'winter_demon', 'preziosestelle', 'wess0', 'heruchris', 'mellowcolonel', 'dxp6986', 'leo_marlow', 'newmetallic', 'kotkaa', 'dodemea', 'cainripley', 'frajestic', 'danny_top23', 'molochthagod', 'kanyelover900', 'phosphoss', 'sugawarasatsuki', 'captivepleading', 'paddycm', 'burroughs3000', 'marblesodaa', 'muistu77', 'korimullanmusic', 'magikwand', 'empireograce', 'psychonau', 'sk8erboi03', 'dogtome', 'milkvveed', 'ghastlygoblin', 'lsihc', 'promethesis', 'nlcklmlnaj', 'so0catwoman', 'handsomegamer46', 'w28888ihateu', 'iithe2nd', 'jrwer', 'r0ann', 'hetzghor', 'umabon', 'karl_nicenstein', 'forestgaze', 'ghostcum', 'bigluke444', 'mozzaddy', 'ahuehauheauauh', 'kingjaxterk', 'setitaiiablaze', 'araicd', 'juliusvc', 'mzumii', 'masskollaps', 'belenio', 'hoosierballz', 'sh0ppingcart', 'brownieboy', 'martyrdomr', 'vessel_anathema', 'twenty10s', 'skuuuuuii', 'birodani115', 'lawlercopter_', 'samanthafox12', 'the_diabolus', 'momasoooooos', 'tigohc', 'ora4ngepm', 'minakonyaa', 'ryukoprop', 'antifafemboy', 'nlec', 'jediwarlock1', 'epowjgpwak', 'anxrcxy', 'pissturd1', 'adxail', 'suprremme', 'qwertyhomu', 'keblz', 'hotstep_', 'fadelooy', 'apesog', 'violentflowers', 'itsthiagobanger', 'syrettepurp', 'swagstica', 'htgs', 'grigoriybalbes', 'heliosi', 'buttfartdhshs', 'wonderglue', 'kanyewest2028', 'caeshijque', 'mysterybfdi', 'nikkilee8208', 'jck_fm', 'etherealbangerz', 'iseenothing', 'achondrogenesis', 'theandromedaxo', 'seanderbeste', 'jct08', 'thev3locity4545', 'humblegold', 'draincel', 'allyourbased', 'birdboiling', 'tharizdoom', 'suplnho', 'dashywashy', 'gabcoelhomusic', 'ox_yd', 'bernkastel__', 'fearcuit', 'gxlnd_', 'brittanymahomes', 'numetalfan69', 'safirestar', 'icespoon', 'issacj06', 'theprio', 'lovediaries', 'sillycelery1974', 'nyqmii', 'gauitier', 'rspbrysda', 'pnavarre2330', 'ltsup2me', 'noolr', 'dakota0824', 'goncalvesrafael', 'daequanbs', 'dwaqons', 'bogurodzica69', 'gtzgold', 'roy_05', 'niloymahir', 'ikarivktr', 'je1934', 'figaro-17', 'sugmaballs69', 'don-weaso', 'schrodngrsafety', 'okjosiah', 'anahausu', 'venusfleur', 'kristiyan47', 'mkulia', 'nick-valentine', 'raraee_', 'mj-xx', 'berk_ziya', 'thatpower1', 'phantomchasm', 'stupidmetalhead'
];

// use the top-right link to determine the current user
let auth = '';

let bleh_url = 'https://www.last.fm/bleh';
let bleh_regex = new RegExp('^https://www\.last\.fm/[a-z]+/bleh$');


(function() {
    'use strict';

    auth = document.querySelector('a.auth-link img').getAttribute('alt');

    if (auth)
        initia();

    function initia() {
        append_style();
        //get_scrobbles(document.body);
        append_nav(document.body);
        patch_masthead(document.body);

        console.log(bleh_url,window.location.href,bleh_regex.test(window.location.href));

        if (window.location.href == bleh_url || bleh_regex.test(window.location.href)) {
            bleh_settings();
        } else {
            patch_profile(document.body);
            patch_shouts(document.body);
        }

        // last.fm is a single page application
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node instanceof Element) {
                        if (!node.hasAttribute('data-kate-processed')) {
                            node.setAttribute('data-kate-processed', 'true');
                            //get_scrobbles(node);
                            append_nav(document.body);
                            patch_masthead(document.body);

                            if (window.location.href == bleh_url || bleh_regex.test(window.location.href)) {
                                bleh_settings();
                            } else {
                                patch_profile(document.body);
                                patch_shouts(document.body);
                            }
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function append_style() {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

        if (settings.dev != 1) {
            let style = document.createElement('link');
            style.setAttribute('rel','stylesheet');
            style.setAttribute('href','https://katelyynn.github.io/bleh/fm/bleh.css');
            document.documentElement.appendChild(style);
        }
    }

    function patch_masthead(element) {
        let masthead_logo = element.querySelector('.masthead-logo');

        if (!masthead_logo.hasAttribute('data-kate-processed')) {
            masthead_logo.setAttribute('data-kate-processed','true');

            let version_text = document.createElement('p');
            version_text.classList.add('bleh--version');
            version_text.textContent = version;

            masthead_logo.appendChild(version_text);
        }
    }

    function append_nav(element) {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();
        let user_nav = element.querySelectorAll('.auth-dropdown-menu li')[0];

        if (!user_nav.hasAttribute('data-kate-processed')) {
            user_nav.setAttribute('data-kate-processed','true');

            let bleh_nav = document.createElement('li');
            if (auth == 'cutensilly') {
                bleh_nav.innerHTML = (`
                    <li>
                        <button class="auth-dropdown-menu-item bleh--theme-menu-item" onclick="toggle_theme()">
                            <span class="auth-dropdown-item-row">
                                <span class="auth-dropdown-item-left">Theme</span>
                                <span class="auth-dropdown-item-right" id="theme-value">${theme_names[settings.theme]}</span>
                            </span>
                        </button>
                    </li>
                    <li>
                        <button class="auth-dropdown-menu-item bleh--dev-menu-item" onclick="toggle_setting('dev')">
                            <span class="auth-dropdown-item-row">
                                <span class="auth-dropdown-item-left">Toggle dev mode</span>
                            </span>
                        </button>
                    </li>
                    <li>
                        <a class="auth-dropdown-menu-item bleh--configure-menu-item" href="/bleh">
                            <span class="auth-dropdown-item-row">
                                <span class="auth-dropdown-item-left">Configure bleh</span>
                            </span>
                        </a>
                    </li>
                    `);
            } else {
                bleh_nav.innerHTML = (`
                    <li>
                        <button class="auth-dropdown-menu-item bleh--theme-menu-item" onclick="toggle_theme()">
                            <span class="auth-dropdown-item-row">
                                <span class="auth-dropdown-item-left">Theme</span>
                                <span class="auth-dropdown-item-right" id="theme-value">${theme_names[settings.theme]}</span>
                            </span>
                        </button>
                    </li>
                    <li>
                        <a class="auth-dropdown-menu-item bleh--configure-menu-item" href="/bleh">
                            <span class="auth-dropdown-item-row">
                                <span class="auth-dropdown-item-left">Configure bleh</span>
                            </span>
                        </a>
                    </li>
                    `);
            }


            user_nav.insertAdjacentElement('beforeend', bleh_nav);
        }
    }



    // settings
    load_settings();

    // create blank settings
    function create_settings_template() {
        localStorage.setItem('bleh', JSON.stringify(settings_template));
        return settings_template;
    }

    // load settings
    function load_settings() {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

        // missing? set to default value
        for (let setting in settings_template)
            if (settings[setting] == undefined)
                settings[setting] = settings_template[setting];

        // save setting into body
        for (let setting in settings) {
            document.body.style.setProperty(`--${setting}`, settings[setting]);
            document.documentElement.setAttribute(`data-bleh--${setting}`, `${settings[setting]}`);
        }

        // save to settings
        localStorage.setItem('bleh', JSON.stringify(settings));
    }

    // save a setting
    function setting(setting, value) {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

        // save value
        settings[setting] = value;
        document.body.style.setProperty(`--${setting}`, value);
        document.documentElement.setAttribute(`data-bleh--${setting}`, `${value}`);

        // save to settings
        localStorage.setItem('bleh', JSON.stringify(settings));
    }


    // toggle setting
    unsafeWindow.toggle_setting = function(setting) {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

        let value = settings[setting];

        if (value == 0)
            value = 1;
        else
            value = 0;

        // save value
        settings[setting] = value;
        document.documentElement.setAttribute(`data-bleh--${setting}`, `${value}`);

        // save to settings
        localStorage.setItem('bleh', JSON.stringify(settings));
    }




    // theme
    unsafeWindow.toggle_theme = function() {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

        let current_theme = settings.theme;

        if (current_theme == 'dark')
            current_theme = 'oled';
        else if (current_theme == 'oled')
            current_theme = 'light';
        else if (current_theme == 'light')
            current_theme = 'dark';

        document.getElementById('theme-value').textContent = theme_names[current_theme];

        // save value
        settings.theme = current_theme;
        document.documentElement.setAttribute(`data-bleh--theme`, `${current_theme}`);

        // save to settings
        localStorage.setItem('bleh', JSON.stringify(settings));
    }

    unsafeWindow.change_theme_from_settings = function(theme) {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

        document.getElementById('theme-value').textContent = theme_names[theme];

        // save value
        settings.theme = theme;
        document.documentElement.setAttribute(`data-bleh--theme`, `${theme}`);

        // show in settings
        show_theme_change_in_settings(theme);

        // save to settings
        localStorage.setItem('bleh', JSON.stringify(settings));
    }


    // patch profile pages
    function patch_profile(element) {
        try {
        let profile_header = element.querySelector('.header-title-label-wrap');
        let profile_name = element.querySelector('.header-title-label-wrap a').textContent;

        if (!profile_header.hasAttribute('data-kate-processed')) {
            profile_header.setAttribute('data-kate-processed', 'true');

            if (redacted.includes(profile_name.toLowerCase())) {
                let prior_redacted_msg = element.querySelector('.bleh--redacted-message');
                if (prior_redacted_msg !== null)
                    document.body.removeChild(prior_redacted_msg);

                let main_content = document.querySelector('.main-content');
                main_content.classList.add('content--bleh-redacted');

                let redacted_message = document.createElement('div');
                redacted_message.classList.add('bleh--redacted-message');
                redacted_message.innerHTML = (`
                    <span class="text">
                        <h5>Profile hidden</h5>
                        <p>This user has been flagged as hateful through community contributions, you can choose to continue or go back.</p>
                    </span>
                    <span class="actions">
                        <button class="btn secondary" onclick="undo_profile_hiding()">Un-hide profile</button>
                        <button class="btn primary" onclick="history.back()">Go back</button>
                    </span>
                `);
                document.body.appendChild(redacted_message);
            } else {
                // is this their profile?
                if (profile_name == auth) {
                    // make avatar clickable
                    let header_avatar = document.querySelector('.header-avatar .avatar');

                    let avatar_link = document.createElement('a');
                    avatar_link.classList.add('bleh--avatar-clickable-link');
                    avatar_link.href = '/settings';
                    header_avatar.appendChild(avatar_link);
                }

                // badges
                if (profile_badges.hasOwnProperty(profile_name)) {
                    let badge = document.createElement('span');
                    badge.classList.add('label',`user-status--bleh-${profile_badges[profile_name].type}`,`user-status--bleh-user-${profile_name}`);
                    badge.textContent = profile_badges[profile_name].name;
                    profile_header.appendChild(badge);
                }
            }
        }
        } catch(e) {}
    }


    unsafeWindow.undo_profile_hiding = function() {
        let main_content = document.querySelector('.main-content');
        main_content.classList.remove('content--bleh-redacted');
        document.body.removeChild(document.body.querySelector('.bleh--redacted-message'));
    }


    // patch shouts
    function patch_shouts(element) {
        let shouts = element.querySelectorAll('.shout');

        shouts.forEach((shout) => {
            try {
            if (!shout.hasAttribute('data-kate-processed')) {
                shout.setAttribute('data-kate-processed', 'true');

                let shout_name = shout.querySelector('.shout-user a').textContent;
                let shout_avatar = shout.querySelector('.shout-user-avatar');

                if (redacted.includes(shout_name.toLowerCase())) {
                    shout.classList.add('shout--bleh-redacted');
                    shout.setAttribute('data-bleh--shout-expanded','false');
                    shout_avatar.classList.add('avatar--bleh-missing');

                    let redacted_msg = document.createElement('p');
                    redacted_msg.textContent = 'This user is hidden.';
                    shout.insertBefore(redacted_msg, shout.firstChild);


                    // gather shout id from more actions' id
                    let shout_actions = shout.querySelector('.shout-more-actions-menu');
                    let shout_id = shout_actions.getAttribute('id').replace('shout-more-actions-');
                    shout.setAttribute('id',`bleh--shout-${shout_id}`);

                    // append button
                    let shout_show_button = document.createElement('li');
                    shout_show_button.innerHTML = (`
                        <button onclick="_show_hidden_shout('${shout_id}')" class="dropdown-menu-clickable-item more-item--bleh--show-hidden-shout">
                            Show shout contents
                        </button>
                    `);
                    shout_actions.appendChild(shout_show_button);
                } else {
                    patch_avatar(shout_avatar, shout_name);
                }
            }
            } catch(e) {}
        });
    }

    unsafeWindow._show_hidden_shout = function(shout_id) {
        document.getElementById(`bleh--shout-${shout_id}`).setAttribute('data-bleh--shout-expanded','true');
    }


    // patch avatar
    function patch_avatar(element, name) {
        if (!element.hasAttribute('data-kate-processed')) {
            element.setAttribute('data-kate-processed', 'true');

            if (profile_badges.hasOwnProperty(name)) {
                // remove pre-existing badge
                let pre_existing_badge = element.querySelector('.avatar-status-dot');
                if (pre_existing_badge !== null)
                    element.removeChild(pre_existing_badge);

                // make new badge
                let badge = document.createElement('span');
                badge.classList.add('avatar-status-dot',`user-status--bleh-${profile_badges[name].type}`,`user-status--bleh-user-${name}`);
                element.appendChild(badge);
            }
        }
    }




    // bleh settings
    unsafeWindow.open_bleh_settings = function() {
        create_window('bleh_settings','Theme settings','');
    }

    function bleh_settings() {
        let adaptive_skin_container = document.querySelector('.adaptive-skin-container');

        if (!adaptive_skin_container.hasAttribute('data-kate-processed')) {
            adaptive_skin_container.setAttribute('data-kate-processed','true');

            // initial
            adaptive_skin_container.innerHTML = '';
            document.title = 'bleh settings | Last.fm';


            // go wild
            let outer = document.createElement('div');
            outer.classList.add('bleh--page-outer');

            let inner = document.createElement('div');
            inner.classList.add('bleh--page-inner');


            let main = document.createElement('div');
            main.classList.add('bleh--panel-main');
            main.setAttribute('id','bleh--panel-main');

            let side = document.createElement('div');
            side.classList.add('bleh--panel-side');
            side.innerHTML = (`
                <div class="bleh--panel">
                    <div class="btns">
                        <button class="btn bleh--btn" data-bleh-page="home" onclick="_change_settings_page('home')">
                            Home
                        </button>
                        <button class="btn bleh--btn" data-bleh-page="themes" onclick="_change_settings_page('themes')">
                            Themes
                        </button>
                        <button class="btn bleh--btn" data-bleh-page="customise" onclick="_change_settings_page('customise')">
                            Customise
                        </button>
                    </div>
                    <div class="btns sep">
                        <button class="btn" data-bleh-action="import" onclick="_import_settings()">
                            Import
                        </button>
                        <button class="btn" data-bleh-action="export" onclick="_export_settings()">
                            Export
                        </button>
                    </div>
                    <div class="btns sep">
                        <button class="btn" data-bleh-action="reset" onclick="_reset_settings()">
                            Reset
                        </button>
                    </div>
                </div>
            `);


            inner.appendChild(main);
            inner.appendChild(side);
            outer.appendChild(inner);
            adaptive_skin_container.appendChild(outer);

            change_settings_page('home');
        }
    }

    function render_setting_page(page) {
        if (page == 'home') {
            return (`
            <div class="bleh--panel">
                <h3>Home</h3>
                <div class="screen-row">
                    <div class="screen-wrap">
                        <img class="screen" src="https://cutensilly.org/img/bleh2-main.png" alt="bleh">
                        <div class="text">
                            <h5>bleh</h5>
                            <p>Version ${version}</p>
                        </div>
                    </div>
                    <div class="actions">
                        <a class="btn action" href="https://github.com/katelyynn/bleh/issues" target="_blank">
                            <div class="icon bleh--issues"></div>
                            <span class="text">
                                <h5>Issues</h5>
                                <p>Report bugs</p>
                            </span>
                        </a>
                    </div>
                </div>
                <h4>Recommended settings</h4>
                <div class="setting-items">
                    <div class="side-left">
                        <button class="btn setting-item has-image" onclick="_change_settings_page('themes')">
                            <div class="image">
                                <div class="icon bleh--themes"></div>
                            </div>
                            <div class="text">
                                <h5>Themes</h5>
                                <p>Choose between light, dark, and oled.</p>
                            </div>
                            <div class="image-row">
                                <img src="https://cutensilly.org/img/bleh2-addon-oled.png">
                            </div>
                        </button>
                    </div>
                    <div class="side-right">
                        <button class="btn setting-item" onclick="_change_settings_page('customise')">
                            <div class="icon bleh--palette"></div>
                            <div class="text">
                                <h5>Colours</h5>
                                <p>Pick your favourite!</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            `);
        } else if (page == 'themes') {
            return (`
                <div class="bleh--panel">
                    <h3>Themes</h3>
                    <h4>Dark</h4>
                    <div class="setting-items">
                        <div class="side-left full">
                            <button class="btn setting-item has-image" data-bleh-theme="dark" onclick="change_theme_from_settings('dark')">
                                <div class="image">
                                    <div class="icon bleh--theme-dark"></div>
                                </div>
                                <div class="text">
                                    <h5>Dark</h5>
                                    <p>The default flavour of bleh</p>
                                </div>
                                <div class="image-row">
                                    <img src="https://cutensilly.org/img/bleh2-main.png" alt="Screenshot of bleh's default dark theme">
                                </div>
                            </button>
                            <button class="btn setting-item has-image" data-bleh-theme="oled" onclick="change_theme_from_settings('oled')">
                                <div class="image">
                                    <div class="icon bleh--theme-oled">

                                    </div>
                                </div>
                                <div class="text">
                                    <h5>OLED</h5>
                                    <p>Ultra blackout</p>
                                </div>
                                <div class="image-row">
                                    <img src="https://cutensilly.org/img/bleh2-addon-oled.png" alt="Screenshot of bleh's oled theme">
                                </div>
                            </button>
                        </div>
                    </div>
                    <h4>Light</h4>
                    <div class="setting-items">
                        <div class="side-left full">
                            <button class="btn setting-item has-image" data-bleh-theme="light" onclick="change_theme_from_settings('light')">
                                <div class="image">
                                    <div class="icon bleh--theme-light">

                                    </div>
                                </div>
                                <div class="text">
                                    <h5>Light</h5>
                                    <p>Low saturation, brightly coloured</p>
                                </div>
                                <div class="image-row">
                                    <img src="https://cutensilly.org/img/bleh2-addon-light.png" alt="Screenshot of bleh's light theme">
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                `);
        } else if (page == 'customise') {
            return (`
                <div class="bleh--panel">
                    <h3>Colours</h3>
                    <h5>Presets</h5>
                    <div class="palette options">
                        <button class="btn" style="
                            --hue: -2;
                            --sat: 1;
                            --lit: 0.8" onclick="_update_params({
                            hue: -2,
                            sat: 1,
                            lit: 0.8
                        })"></button>
                        <button class="btn" style="
                            --hue: 10;
                            --sat: 1;
                            --lit: 0.9" onclick="_update_params({
                            hue: 10,
                            sat: 1,
                            lit: 0.9
                        })"></button>
                        <button class="btn" style="
                            --hue: 35;
                            --sat: 1.2;
                            --lit: 1" onclick="_update_params({
                            hue: 35,
                            sat: 1.2,
                            lit: 1
                        })"></button>
                        <button class="btn" style="
                            --hue: 85;
                            --sat: 1;
                            --lit: 1" onclick="_update_params({
                            hue: 85,
                            sat: 1,
                            lit: 1
                        })"></button>
                        <button class="btn" style="
                            --hue: 115;
                            --sat: 1;
                            --lit: 1" onclick="_update_params({
                            hue: 115,
                            sat: 1,
                            lit: 1
                        })"></button>
                        <button class="btn" style="
                            --hue: 155;
                            --sat: 1;
                            --lit: 1" onclick="_update_params({
                            hue: 155,
                            sat: 1,
                            lit: 1
                        })"></button>
                        <button class="btn" style="
                            --hue: 185;
                            --sat: 1;
                            --lit: 1" onclick="_update_params({
                            hue: 185,
                            sat: 1,
                            lit: 1
                        })"></button>
                        <button class="btn" style="
                            --hue: 222;
                            --sat: 1;
                            --lit: 0.9" onclick="_update_params({
                            hue: 222,
                            sat: 1,
                            lit: 0.9
                        })"></button>
                        <button class="btn" style="
                            --hue: 255;
                            --sat: 1;
                            --lit: 1" onclick="_update_params({
                            hue: 255,
                            sat: 1,
                            lit: 1
                        })"></button>
                        <button class="btn" style="
                            --hue: 333;
                            --sat: 1;
                            --lit: 1" onclick="_update_params({
                            hue: 333,
                            sat: 1,
                            lit: 1
                        })"></button>
                    </div>
                    <h5>Manual</h5>
                    <button class="btn primary" onclick="_create_a_custom_colour()">
                        Create a custom colour
                    </button>
                </div>
                <div class="bleh--panel">
                    <h3>Artwork</h3>
                    <div class="inner-preview pad">
                        <div class="palette albums" style="height: fit-content">
                            <div class="album-cover" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/1569198c4cf0a3b2ff8728975e8359fa.jpg')"></div>
                            <div class="album-cover" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/b897255bf422baa93a42536af293f9f8.jpg')"></div>
                            <div class="album-cover" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/a78bbd5ff0184115902f403212f04976.jpg')"></div>
                            <div class="album-cover" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/ddee3b871289a6cda0e3c7d4b4580d62.jpg')"></div>
                            <div class="album-cover" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/570021b68d3d9d2db08bc99a473303b0.jpg')"></div>
                            <div class="album-cover" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/e39eb31f874f4a5c4afa836845141437.jpg')"></div>
                        </div>
                    </div>
                    <div class="slider-container" id="container-gloss">
                        <button class="btn reset" onclick="_reset_item('gloss')">Reset to default</button>
                        <div class="heading">
                            <h5>Gloss overlay</h5>
                            <p>Previously a default of 0.2, now disabled by default.</p>
                        </div>
                        <div class="slider">
                            <input type="range" min="0" max="1" value="0" step="0.05" id="slider-gloss" oninput="_update_item('gloss', this.value)">
                            <p id="value-gloss">0</p>
                        </div>
                    </div>
                </div>
                <div class="bleh--panel">
                    <h3>Display</h3>
                    <div class="inner-preview pad flex">
                        <div class="preview-img">
                            <img id="gendered_tags-img" src="https://cutensilly.org/img/gendered_tags-hidden.png">
                        </div>
                    </div>
                    <div class="toggle-container" id="container-gendered_tags">
                        <button class="btn reset" onclick="_reset_item('gendered_tags')">Reset to default</button>
                        <div class="heading">
                            <h5>Hide gendered tags</h5>
                            <p>By default, gendered tags are hidden in bleh due to their unorganised and impossible nature.</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-gendered_tags" onclick="_update_item('gendered_tags')" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="sep"></div>
                    <div class="toggle-container" id="container-hide_hateful">
                        <button class="btn reset" onclick="_reset_item('hide_hateful')">Reset to default</button>
                        <div class="heading">
                            <h5>Hide hateful shouts</h5>
                            <p>Hateful users are community-contributed, it is up to you if you prefer to view these shouts.</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-hide_hateful" onclick="_update_item('hide_hateful')" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                </div>
                `);
        }
    }

    unsafeWindow._change_settings_page = function(page) {
        change_settings_page(page);
    }

    function change_settings_page(page) {
        let btns = document.querySelectorAll('.bleh--btn');
        btns.forEach((btn) => {
            console.log(btn.getAttribute('data-bleh-page'),page);
            if (btn.getAttribute('data-bleh-page') != page) {
                btn.classList.remove('active');
            } else {
                btn.classList.add('active');
            }
        });

        document.getElementById('bleh--panel-main').innerHTML = render_setting_page(page);

        if (page == 'themes')
            show_theme_change_in_settings();
    }

    function show_theme_change_in_settings(theme = '') {
        let settings = {};
        if (theme == '')
            settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();
        else
            settings.theme = theme;

        let btns = document.querySelectorAll('.setting-item');
        btns.forEach((btn) => {
            console.log(btn.getAttribute('data-bleh-theme'),settings.theme);
            if (btn.getAttribute('data-bleh-theme') != settings.theme) {
                btn.classList.remove('active');
            } else {
                btn.classList.add('active');
            }
        });
    }




    // settings-page specific
    function reset_all() {
        for (let item in settings_base)
            reset_item(item);
    }

    function reset_item(item) {
        update_item(item, settings_base[item].value);
    }

    function update_params(params={}) {
        for (let item in params) {
            update_item(item, params[item]);
        }
    }

    unsafeWindow._reset_all = function() {
        reset_all();
    }
    unsafeWindow._reset_item = function(item) {
        reset_item(item);
    }
    unsafeWindow._update_params = function(params={}) {
        update_params(params);
    }
    unsafeWindow._update_item = function(item, value) {
        update_item(item, value);
    }

    function update_item(item, value) {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();
        if (settings_base[item].type == 'slider')
            settings[item] = value;

        // determine interactable text colour based on --hue & --lit
        if (item == 'hue' || item == 'lit') {
            if (settings.hue > 228 && settings.hue < 252 && settings.lit < 0.75) {
                settings.invert_interactable_colour = true;
            } else if (settings.hue > 210 && settings.hue < 280 && settings.lit < 0.425) {
                settings.invert_interactable_colour = true;
            } else if (settings.lit < 0.3) {
                settings.invert_interactable_colour = true;
            } else {
                settings.invert_interactable_colour = false;
            }

            // save setting into body
            document.body.style.setProperty(`--invert_interactable_colour`,settings.invert_interactable_colour);
            document.documentElement.setAttribute(`data-bleh--invert_interactable_colour`, `${settings.invert_interactable_colour}`);
        }

        if (settings_base[item].type == 'slider') {
            // text to show current slider value
            try {
                document.getElementById(`value-${item}`).textContent = `${settings[item]}${settings_base[item].unit}`;
                document.getElementById(`slider-${item}`).value = settings[item];

                if (settings[item] != settings_base[item].value)
                    document.getElementById(`container-${item}`).classList.add('modified');
                else
                    document.getElementById(`container-${item}`).classList.remove('modified');
            } catch(e) {}

            // save setting into body
            document.body.style.setProperty(`--${item}`,value);
            document.documentElement.setAttribute(`data-bleh--${item}`, `${value}`);
        } else if (settings_base[item].type == 'toggle') {
            if (settings[item] == settings_base[item].values[0]) {
                settings[item] = settings_base[item].values[1];
                document.getElementById(`toggle-${item}`).setAttribute('aria-checked',false);


                if (item == 'nav') {
                    document.getElementById('nav-img').setAttribute('src','https://cutensilly.org/img/nav-hidden.png');
                    settings.auth_badge = settings_base.auth_badge.values[1];
                } else if (item == 'gendered_tags') {
                    document.getElementById('gendered_tags-img').setAttribute('src','https://cutensilly.org/img/gendered_tags-shown.png');
                }

                // save setting into body
                document.body.style.setProperty(`--${item}`,settings_base[item].values[1]);
                document.documentElement.setAttribute(`data-bleh--${item}`, `${settings_base[item].values[1]}`);
            } else {
                settings[item] = settings_base[item].values[0];
                document.getElementById(`toggle-${item}`).setAttribute('aria-checked',true);


                if (item == 'nav') {
                    document.getElementById('nav-img').setAttribute('src','https://cutensilly.org/img/nav-shown.png');
                    settings.auth_badge = settings_base.auth_badge.values[0];
                } else if (item == 'gendered_tags') {
                    document.getElementById('gendered_tags-img').setAttribute('src','https://cutensilly.org/img/gendered_tags-hidden.png');
                }

                // save setting into body
                document.body.style.setProperty(`--${item}`,settings_base[item].values[0]);
                document.documentElement.setAttribute(`data-bleh--${item}`, `${settings_base[item].values[0]}`);
            }
        }

        // save to settings
        localStorage.setItem('bleh', JSON.stringify(settings));
    }


    // create a custom colour
    unsafeWindow._create_a_custom_colour = function() {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();
        create_window('custom_colour','Create a custom colour',`
        <p>Colours are controlled by three values: hue, saturation, and lightness. Try out the sliders to get a feel.</p>
        <br>
        <div class="inner-preview pad">
            <div class="palette">
                <div style="--col: hsl(var(--l2-c))"></div>
                <div style="--col: hsl(var(--l3-c))"></div>
                <div style="--col: hsl(var(--l4-c))"></div>
                <div style="--col: hsl(var(--l2))"></div>
                <div style="--col: hsl(var(--l3))"></div>
                <div style="--col: hsl(var(--l4))"></div>
            </div>
            <div class="sep"></div>
            <div class="btn-row">
                <button class="btn">Example button</button>
                <button class="btn primary">Example button</button>
                <div class="chartlist-count-bar">
                    <a class="chartlist-count-bar-link">
                        <span class="chartlist-count-bar-slug" style="width: 60%"></span>
                        <span class="chartlist-count-bar-value">44,551 plays</span>
                    </a>
                </div>
            </div>
        </div>
        <br>
        <div class="slider-container dim-using-hue-gradient" id="container-hue">
            <button class="btn reset" onclick="_reset_item('hue')">Reset to default</button>
            <div class="heading">
                <h5>Accent colour</h5>
            </div>
            <div class="slider">
                <input type="range" min="0" max="360" value="${settings.hue}" id="slider-hue" oninput="_update_item('hue', this.value)">
                <p id="value-hue">${settings.hue}${settings_base.hue.unit}</p>
            </div>
            <div class="hint">
                <p style="left: 0">0</p>
                <p style="left: calc((255 / 360) * 100%)">255</p>
                <p style="left: 100%">360</p>
            </div>
        </div>
        <div class="slider-container dim-using-hue-gradient" id="container-sat">
            <button class="btn reset" onclick="_reset_item('sat')">Reset to default</button>
            <div class="heading">
                <h5>Saturation</h5>
            </div>
            <div class="slider">
                <input type="range" min="0" max="1.5" value="${settings.sat}" step="0.025" id="slider-sat" oninput="_update_item('sat', this.value)">
                <p id="value-sat">${settings.sat}${settings_base.sat.unit}</p>
            </div>
            <div class="hint">
                <p style="left: 0">0</p>
                <p style="left: calc((1 / 1.5) * 100%)">1</p>
                <p style="left: 100%">1.5</p>
            </div>
        </div>
        <div class="slider-container dim-using-hue-gradient" id="container-lit">
            <button class="btn reset" onclick="_reset_item('lit')">Reset to default</button>
            <div class="heading">
                <h5>Lightness</h5>
            </div>
            <div class="slider">
                <input type="range" min="0" max="1.5" value="${settings.lit}" step="0.025" id="slider-lit" oninput="_update_item('lit', this.value)">
                <p id="value-lit">${settings.lit}${settings_base.lit.unit}</p>
            </div>
            <div class="hint">
                <p style="left: 0">0</p>
                <p style="left: calc((1 / 1.5) * 100%)">1</p>
                <p style="left: 100%">1.5</p>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn primary" onclick="_kill_window('custom_colour')">
                Done
            </button>
        </div>
        `);

        // this displays the "reset to default" button if you are not on the defaults
        update_item('hue',settings.hue);
        update_item('sat',settings.sat);
        update_item('lit',settings.lit);
    }




    // create a window
    function create_window(id, title, inner_content) {
        let background = document.createElement('div');
        background.classList.add('popup_background');
        background.setAttribute('id',`bleh--window-${id}--background`);
        background.style = 'opacity: 0.8; visibility: visible; background-color: rgb(0, 0, 0); position: fixed; inset: 0px;';
        background.setAttribute('data-kate-processed','true');

        let wrapper = document.createElement('div');
        wrapper.classList.add('popup_wrapper','popup_wrapper_visible');
        wrapper.setAttribute('id',`bleh--window-${id}--wrapper`);
        wrapper.style = 'opacity: 1; visibility: visible; position: fixed; overflow: auto; width: 100%; height: 100%; top: 0px; left: 0px; text-align: center;';
        wrapper.setAttribute('data-kate-processed','true');


        // dialog
        let dialog = document.createElement('div');
        dialog.classList.add('modal-dialog');
        dialog.setAttribute('id',`bleh--window-${id}--dialog`);
        dialog.style = 'opacity: 1; visibility: visible; pointer-events: auto; display: inline-block; outline: none; text-align: left; position: relative; vertical-align: middle;';
        dialog.setAttribute('data-kate-processed','true');

        // content
        let content = document.createElement('div');
        content.classList.add('modal-content');
        content.setAttribute('id',`bleh--window-${id}--content`);
        content.setAttribute('data-kate-processed','true');

        // share content
        let share = document.createElement('div');
        share.classList.add('modal-share-content');
        share.setAttribute('id',`bleh--window-${id}--share`);
        share.setAttribute('data-kate-processed','true');

        // body
        let body = document.createElement('div');
        body.classList.add('modal-body');
        body.setAttribute('id',`bleh--window-${id}--body`);
        body.setAttribute('data-kate-processed','true');

        // title
        let header = document.createElement('h2');
        header.classList.add('modal-title');
        header.textContent = title;
        header.setAttribute('data-kate-processed','true');

        // inner content
        let inner_content_em = document.createElement('div');
        inner_content_em.classList.add('modal-inner-content');
        inner_content_em.innerHTML = inner_content;
        inner_content_em.setAttribute('data-kate-processed','true');


        let align = document.createElement('div');
        align.classList.add('popup_align');
        align.setAttribute('id',`bleh--window-${id}--align`);
        align.style = 'display: inline-block; vertical-align: middle; height: 100%;';
        align.setAttribute('data-kate-processed','true');


        body.appendChild(header);
        body.appendChild(inner_content_em)
        share.appendChild(body);
        content.appendChild(share);
        dialog.appendChild(content);
        wrapper.appendChild(dialog);
        wrapper.appendChild(align);


        document.body.appendChild(background);
        document.body.appendChild(wrapper);
    }

    // kill a window
    function kill_window(id) {
        document.body.removeChild(document.getElementById(`bleh--window-${id}--background`));
        document.body.removeChild(document.getElementById(`bleh--window-${id}--wrapper`));
    }

    unsafeWindow._kill_window = function(id) {
        kill_window(id);
    }




    // import settings
    unsafeWindow._import_settings = function() {
        create_window('import_settings','Import settings from a previous install',`
            <p class="alert alert-warning">Anything you import will override your current settings, if you are importing settings from online ensure you trust the source.</p>
            <br>
            <textarea id="import_area"></textarea>
            <div class="modal-footer">
                <button class="btn primary" onclick="_confirm_import()">
                    Import
                </button>
                <button class="btn" onclick="_kill_window('import_settings')">
                    Cancel
                </button>
            </div>
        `);
    }

    unsafeWindow._confirm_import = function() {
        //localStorage.setItem('old_settings', localStorage.getItem('bleh'));

        let requesting_setting = document.getElementById('import_area').value;
        try {
            let try_parse = JSON.parse(requesting_setting);

            // can continue
            localStorage.setItem('bleh', requesting_setting);
            load_settings();

            kill_window('import_settings');
        } catch(e) {
            // cannot continue, halt
            kill_window('import_settings');
            create_window('import_failed','Import failed',`
            <p class="alert alert-error">The settings you attempted to import failed to parse, no changes were made.</p>
            <div class="modal-footer">
                <button class="btn primary" onclick="_kill_window('import_failed')">
                    Confirm
                </button>
            </div>
            `);
        }
    }


    // export settings
    function export_settings() {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

        create_window('export_settings','Export your current settings',`
            <p class="alert alert-success">Your current settings are in the textbox below ready for you to copy.</p>
            <br>
            <textarea>${JSON.stringify(settings)}</textarea>
            <div class="modal-footer">
                <button class="btn primary" onclick="_kill_window('export_settings')">
                    Done
                </button>
            </div>
        `);
    }
    unsafeWindow._export_settings = function() {
        export_settings();
    }


    // reset settings
    unsafeWindow._reset_settings = function() {
        create_window('reset_settings','Reset your settings to default',`
            <p class="alert alert-warning">Your settings will be <strong>reset to all defaults</strong> with no way to go back. Are you sure?</p>
            <div class="modal-footer">
                <button class="btn" onclick="_confirm_reset()">
                    Yes, reset my settings
                </button>
                <button class="btn" onclick="_export_first()">
                    Export first
                </button>
                <button class="btn primary" onclick="_kill_window('reset_settings')">
                    Cancel
                </button>
            </div>
        `);
    }

    unsafeWindow._confirm_reset = function() {
        let settings = create_settings_template();
        localStorage.setItem('bleh', JSON.stringify(settings));
        load_settings();

        kill_window('reset_settings');
    }

    unsafeWindow._export_first = function() {
        kill_window('reset_settings');
        export_settings();
    }










    function get_scrobbles(element) {
        try {
            let item = element.querySelectorAll('.header-metadata-item')[0];
            let link = element.querySelectorAll('.header-metadata-item p a')[0];

            let value = parseInt(link.textContent.replaceAll(',',''));
            item.setAttribute('data-scrobbles',value);
            let percent = 0;

            let colour = 0;
            if (value <= 50_000) {
                colour = 1;
            } else if (value <= 75_000) {
                colour = 2;
            } else if (value <= 100_300) {
                colour = 3;
            } else if (value <= 125_000) {
                colour = 4;
            } else if (value <= 150_000) {
                colour = 5;
            } else if (value <= 175_000) {
                colour = 6;
            } else if (value <= 200_300) {
                colour = 7;
            } else if (value <= 225_000) {
                colour = 8;
            }

            let milestone = 0;
            if (value <= 100_300) {
                percent = (value / 100_000) * 100;
            } else if (value <= 200_300) {
                value = value - 100_300;
                percent = (value / 100_000) * 100;
            } else if (value <= 300_300) {
                value = value - 200_300;
                percent = (value / 100_000) * 100;
            } else if (value <= 400_300) {
                value = value - 300_300;
                percent = (value / 100_000) * 100;
            }

            item.setAttribute('data-scrobbles-percent',percent);
            item.setAttribute('data-scrobbles-milestone',colour);
            item.style.setProperty('--percent',`${Math.round(percent)}%`);
        } catch(e) {console.error('bwaaaaaaaa',e)}
    }
})();