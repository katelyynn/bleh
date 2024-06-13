// ==UserScript==
// @name         bleh
// @namespace    http://last.fm/
// @version      2024.0613
// @description  bleh!!! ^-^
// @author       kate
// @match        https://www.last.fm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=last.fm
// @grant        GM_addStyle
// @updateURL    https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.js
// @downloadURL  https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.js
// @run-at       document-body
// @require      https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js
// @require      https://unpkg.com/@popperjs/core@2
// @require      https://unpkg.com/tippy.js@6
// ==/UserScript==

let version = '2024.0613';

tippy.setDefaultProps({
    arrow: false,
    duration: [100, 300],
    delay: [null, 50]
});

let song_title_corrections = {
    'Quadeca': {
        'BORN YESTERDAY': 'born yesterday',
        'Tell Me A Joke': 'tell me a joke',
        'Gone Gone': 'gone gone',
        'Guess Who?': 'GUESS WHO?',
        'UNDER My Skin': 'UNDER MY SKIN',
        'being yourself': 'BEING YOURSELF',
        'I Make It Look Effortless': 'I MAKE IT LOOK EFFORTLESS',
        'Scrapyard': 'SCRAPYARD',
        'i didn\'t mean to haunt you': 'I Didn\'t Mean To Haunt You'
    },
    'yeule': {
        'Sulky Baby': 'sulky baby'
    },
    'brakence': {
        'Drank 3 of My Parents\' Craft Beers To Make Eye Contact With You (feat. Login)': 'drank 3 of my parents\' craft beers to make eye contact with you (feat. login)',
        'tonight\'s no good how about wednesday oh you\'re in dallas on wednesday oh ok well then let\'s just not see each other for 8 months and It doesn\'t matter at all': 'tonight\'s no good how about wednesday oh you\'re in dallas on wednesday oh ok well then let\'s just not see each other for 8 months and it doesn\'t matter at all',
        'Introvert': 'introvert',
        'Hypochondriac (Demo)': 'hypochondriac (demo)'
    },
    'Young Thug': {
        'Pick up the Phone': 'pick up the phone'
    },
    'Nirvana': {
        'Tourette\'s - 1992/Live at Reading': 'tourette\'s - 1992/Live at Reading',
        'Tourette\'s (Alternative Mix)': 'tourette\'s (Alternative Mix)',
        'Tourette\'s (2013 Mix)': 'tourette\'s (2013 Mix)',
        'Tourette\'s - 2013 Mix': 'tourette\'s - 2013 Mix',
        'Tourette\'s (Demo / Instrumental)': 'tourette\'s (Demo / Instrumental)',
        'Tourette\'s - Demo / Instrumental': 'tourette\'s - Demo / Instrumental'
    }
};

let includes = {
    guests: [
        '- feat', '(feat', '[feat', ' feat.',
        '- with', '(with', '[with',
        '- ft', '(ft', '[ft', ' ft.',
        'w/ '
    ],
    versions: [
        '(taylor', '- spotify singles'
    ],
    mixes: [
        '- devonshire mix', '(devonshire mix',
        '- remaster', '(remaster',
        '- remix', '(remix',
        '- live', '(live',
        '- demo', '(demo',
        '- rehearsal', '(rehearsal',
        '- sample clearance', '(sample clearance', '[sample clearance',
        '- home demo', '(home demo',
        '- solo acoustic', '(solo acoustic',
        '- acoustic', '(acoustic',
        '- alternative', '(alternative',
        '(mix 1', '(mix 2', '(mix 3', '(mix 4', '(mix 5', '(mix 6', '(mix 7', '(mix 8', '(mix 9',
        '- choppednotslopped', '(choppednotslopped', '[choppednotslopped'
    ],
    stems: [
        '- acapella', '(acapella', '[acapella',
        '- instrumental', '(instrumental', '[instrumental',
        '- session', '(session', '[session',
        '- studio session', '(studio session', '[studio session',
        '- smart session', '(smart session', '[smart session',
        '- boombox', '(boombox',
        '- mtv unplugged', '(mtv unplugged',
        '- unplugged', '(unplugged',
        '- the long pond studio', '(the long pond studio'
    ],
    bonus: [
        '- intro', '(intro', '[intro',
        '- outro', '(outro', '[outro',
        '- interlude', '(interlude', '[interlude',
        '- bonus', '(bonus', '[bonus',
        '- edit', '(edit', '[edit',
        '- from', '(from', '[from',
        '- skit', '(skit',
        '- original', '(original', '[original',
        '[clean', '[explicit',
        '- deluxe', '(deluxe', '[deluxe',
        '- digital deluxe', '(digital deluxe', '[digital deluxe',
        '- complete edition', '(complete edition', '[complete edition',
        '- extended', '(extended', '[extended',
        '- anniversary', '(anniversary', '[anniversary',
        '- b-side', '- c-side', '(b-side', '(c-side',
        '- lp', '- ep', '(lp', '(ep',
        '- single', '(single',
        '- 19', '- 20', '(19', '(20'
    ]
}

let profile_badges = {
    'cutensilly': {
        type: 'queen',
        name: 'blehhhhhhhhhh!!'
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
    'oled': 'OLED',
    'darker': 'Darker'
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
    dev: false,
    hide_hateful: true,
    accessible_name_colours: false,
    underline_links: false,
    big_numbers: false,
    format_guest_features: true
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
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    hide_hateful: {
        css: 'hide_hateful',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    accessible_name_colours: {
        css: 'accessible_name_colours',
        unit: '',
        value: false,
        values: [true, false],
        type: 'toggle'
    },
    underline_links: {
        css: 'underline_links',
        unit: '',
        value: false,
        values: [true, false],
        type: 'toggle'
    },
    dev: {
        css: 'dev',
        unit: '',
        value: false,
        values: [true, false],
        type: 'toggle'
    },
    big_numbers: {
        css: 'big_numbers',
        unit: '',
        value: false,
        values: [true, false],
        type: 'toggle'
    },
    format_guest_features: {
        css: 'format_guest_features',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    }
};


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
    initia();

    function initia() {
        append_style();
        load_settings();
        //get_scrobbles(document.body);
        append_nav(document.body);
        patch_masthead(document.body);

        console.log(bleh_url,window.location.href,bleh_regex.test(window.location.href));

        if (window.location.href == bleh_url || bleh_regex.test(window.location.href)) {
            bleh_settings();
        } else {
            patch_profile(document.body);
            patch_shouts(document.body);
            patch_lastfm_settings(document.body);
            patch_titles(document.body);
            patch_header_title(document.body);
        }

        // last.fm is a single page application
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node instanceof Element) {
                        if (!node.hasAttribute('data-kate-processed')) {
                            node.setAttribute('data-kate-processed', 'true');
                            load_settings();
                            //get_scrobbles(node);
                            append_nav(document.body);
                            patch_masthead(document.body);

                            if (window.location.href == bleh_url || bleh_regex.test(window.location.href)) {
                                bleh_settings();
                            } else {
                                patch_profile(document.body);
                                patch_shouts(document.body);
                                patch_lastfm_settings(document.body);
                                patch_titles(document.body);
                                patch_header_title(document.body);
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
        let cached_style = localStorage.getItem('bleh_cached_style') || '';
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

        // style is not fetched in dev mode
        if (settings.dev)
            return;

        if (cached_style == '') {
            // style has never been cached
            console.info('bleh - style has never been cached, fetching now');
            fetch_new_style();
        } else {
            // style is currently cached, load that first
            // ensures no flashing missing styles hopefully
            console.info('bleh - requesting cached style');
            load_cached_style(cached_style);

            // now, analyse if we should fetch a new one
            console.info('bleh - checking cache timeout status of style');
            check_if_style_cache_is_valid();
        }
    }

    function load_cached_style(cached_style) {
        let style_cache = document.createElement('style');
        style_cache.setAttribute('id', 'bleh--cached-style');
        style_cache.textContent = cached_style;
        document.documentElement.appendChild(style_cache);

        console.info('bleh - loaded cached style');
        setTimeout(function() {document.body.classList.add('bleh');}, 200);
    }

    function check_if_style_cache_is_valid() {
        let cached_style_timeout = new Date(localStorage.getItem('bleh_cached_style_timeout'));
        let current_time = new Date();

        // check if timeout has expired
        if (cached_style_timeout < current_time) {
            console.info('bleh - fetching new style, timeout has expired');
            fetch_new_style();
        } else {
            console.info('bleh - style timeout is still valid');
        }
    }

    function fetch_new_style(delete_old_style = false) {
        let xhr = new XMLHttpRequest();
        let url = 'https://katelyynn.github.io/bleh/fm/bleh.css';
        xhr.open('GET',url,true);

        xhr.onload = function() {
            console.info('bleh - style responded with', xhr.status);

            // create style element
            let style = document.createElement('style');
            style.textContent = this.response;
            document.documentElement.appendChild(style);

            // remove the old style, if needed
            if (delete_old_style)
                document.documentElement.removeChild(document.getElementById('bleh--cached-style'));

            // save to cache for next page load
            localStorage.setItem('bleh_cached_style',this.response);

            // set expire date
            let api_expire = new Date();
            api_expire.setHours(api_expire.getHours() + 1);
            localStorage.setItem('bleh_cached_style_timeout',api_expire);
            console.info('bleh - style is cached until', api_expire);

            setTimeout(function() {document.body.classList.add('bleh');}, 200);
        }

        xhr.send();
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
        let user_nav = element.querySelectorAll('.auth-dropdown-menu > li')[0];
        let inbox_nav = element.querySelectorAll('.auth-dropdown-menu > li')[2];

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
            user_nav.appendChild(bleh_nav);
        }

        if (!inbox_nav.hasAttribute('data-kate-processed')) {
            inbox_nav.setAttribute('data-kate-processed','true');
            let profile_link = user_nav.querySelector('a').getAttribute('href');

            let extra_nav = document.createElement('li');
            extra_nav.innerHTML = (`
                <li>
                    <a class="auth-dropdown-menu-item bleh--shouts-menu-item" href="${profile_link}/shoutbox">
                        <span class="auth-dropdown-item-row">
                            <span class="auth-dropdown-item-left">Shouts</span>
                        </span>
                    </a>
                </li>
                `);

            inbox_nav.appendChild(extra_nav);
        }
    }

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

        // todo: remove
        if (settings.dev == 1)
            settings.dev = true;

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

        if (value == false)
            value = true;
        else
            value = false;

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
            current_theme = 'darker';
        else if (current_theme == 'darker')
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


    // patch last.fm settings
    function patch_lastfm_settings(element) {
        try {
        let about_me_box = document.getElementById('id_about_me');

        if (!about_me_box.hasAttribute('data-kate-processed')) {
            about_me_box.setAttribute('data-kate-processed','true');
            about_me_box.setAttribute('oninput','_update_about_me_preview(this.value)');

            let about_me_preview = document.createElement('span');
            about_me_preview.classList.add('bleh--about-me-preview');
            about_me_preview.setAttribute('id','about_me_preview');
            about_me_box.after(about_me_preview);

            update_about_me_preview(about_me_box.value);
        }
        } catch(e) {}
    }

    unsafeWindow._update_about_me_preview = function(value) {
        update_about_me_preview(value);
    }
    function update_about_me_preview(value) {
        let converter = new showdown.Converter({
            emoji: true,
            excludeTrailingPunctuationFromURLs: true,
            ghMentions: true,
            ghMentionsLink: '/user/{u}',
            headerLevelStart: 5,
            noHeaderId: true,
            openLinksInNewWindow: true,
            requireSpaceBeforeHeadingText: true,
            simpleLineBreaks: true,
            simplifiedAutoLink: true,
            strikethrough: true,
            underline: true,
            ghCodeBlocks: false,
            smartIndentationFix: true
        });
        let parsed_body = converter.makeHtml(value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;'));
        document.getElementById('about_me_preview').innerHTML = parsed_body;
    }


    // patch profile pages
    function patch_profile(element) {
        try {
        let profile_header = element.querySelector('.header-title-label-wrap');
        let profile_name = element.querySelector('.header-title-label-wrap a');

        // profile note
        let profile_notes = JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
        let profile_note = profile_notes[profile_name.textContent];

        let profile_has_note = false;
        if (profile_note != undefined)
            profile_has_note = true;

        if (!profile_header.hasAttribute('data-kate-processed')) {
            profile_header.setAttribute('data-kate-processed', 'true');

            if (redacted.includes(profile_name.textContent.toLowerCase())) {
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
                if (profile_name.textContent == auth) {
                    // make avatar clickable
                    let header_avatar = document.querySelector('.header-avatar .avatar');

                    let avatar_link = document.createElement('a');
                    avatar_link.classList.add('bleh--avatar-clickable-link');
                    avatar_link.href = '/settings';
                    header_avatar.appendChild(avatar_link);
                }

                // badges
                if (profile_badges.hasOwnProperty(profile_name.textContent)) {
                    let badge = document.createElement('span');
                    badge.classList.add('label',`user-status--bleh-${profile_badges[profile_name.textContent].type}`,`user-status--bleh-user-${profile_name.textContent}`);
                    badge.textContent = profile_badges[profile_name.textContent].name;
                    profile_header.appendChild(badge);
                }

                // me :3
                if (profile_name.textContent == 'cutensilly') {
                    profile_name.classList.add('bleh--name-is-cute');
                }
            }
        }

        let about_me_sidebar = element.querySelector('.about-me-sidebar');
        if (!about_me_sidebar.hasAttribute('data-kate-processed')) {
            about_me_sidebar.setAttribute('data-kate-processed','true');

            // parse body
            let about_me_text = about_me_sidebar.querySelector('p');
            let converter = new showdown.Converter({
                emoji: true,
                excludeTrailingPunctuationFromURLs: true,
                ghMentions: true,
                ghMentionsLink: '/user/{u}',
                headerLevelStart: 5,
                noHeaderId: true,
                openLinksInNewWindow: true,
                requireSpaceBeforeHeadingText: true,
                simpleLineBreaks: true,
                simplifiedAutoLink: true,
                strikethrough: true,
                underline: true,
                ghCodeBlocks: false,
                smartIndentationFix: true
            });
            let parsed_body = converter.makeHtml(about_me_text.textContent
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;'));
            about_me_text.innerHTML = parsed_body;

            // add note button
            if (!profile_has_note) {
                let add_note_button = document.createElement('button');
                add_note_button.classList.add('btn','bleh--add-note');
                add_note_button.setAttribute('id','bleh--add-note');
                add_note_button.textContent = 'Add note';
                add_note_button.setAttribute('onclick',`_add_profile_note('${profile_name.textContent}',${profile_has_note})`);

                tippy(add_note_button, {
                    content: `Edit ${profile_name.textContent}'s note`
                });

                let about_me_header = about_me_sidebar.querySelector('h2');
                about_me_header.appendChild(add_note_button);
            } else {
                create_profile_note_panel(profile_name.textContent, true);
            }
        }
        } catch(e) {}
    }

    unsafeWindow._add_profile_note = function(username, has_note) {
        add_profile_note(username, has_note);
    }
    function add_profile_note(username, has_note) {
        document.getElementById('bleh--add-note').style.setProperty('display','none');

        create_profile_note_panel(username, has_note);
    }


    function create_profile_note_panel(username, has_note) {
        let note_panel = document.createElement('section');
        note_panel.classList.add('bleh--panel','bleh--profile-note-panel');

        if (has_note) {
            note_panel.innerHTML = (`
            <h2>Your notes</h2>
            <div class="content-form">
                <textarea id="bleh--profile-note" placeholder="Enter a local note for this user">${JSON.parse(localStorage.getItem('bleh_profile_notes'))[username]}</textarea>
            </div>
            <div class="actions">
                <button class="btn" onclick="_clear_profile_note('${username}')">Clear</button>
                <button class="btn primary" onclick="_save_profile_note('${username}')">Save</button>
            </div>
            `);
        } else {
            note_panel.innerHTML = (`
            <h2>Your notes</h2>
            <div class="content-form">
                <textarea id="bleh--profile-note" placeholder="Enter a local note for this user"></textarea>
            </div>
            <div class="actions">
                <button class="btn" onclick="_clear_profile_note('${username}')">Clear</button>
                <button class="btn primary" onclick="_save_profile_note('${username}')">Save</button>
            </div>
            `);
        }

        let about_me_sidebar = document.body.querySelector('.about-me-sidebar');
        about_me_sidebar.after(note_panel);
    }

    unsafeWindow._clear_profile_note = function(username) {
        let profile_notes = JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
        delete profile_notes[username];
        document.getElementById('bleh--profile-note').value = '';

        localStorage.setItem('bleh_profile_notes',JSON.stringify(profile_notes));
    }

    unsafeWindow._save_profile_note = function(username) {
        save_profile_note(username);
    }
    function save_profile_note(username) {
        let profile_notes = JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
        profile_notes[username] = document.getElementById('bleh--profile-note').value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

        localStorage.setItem('bleh_profile_notes',JSON.stringify(profile_notes));
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

                let shout_body = shout.querySelector('.shout-body p');

                let converter = new showdown.Converter({
                    emoji: true,
                    excludeTrailingPunctuationFromURLs: true,
                    ghMentions: true,
                    ghMentionsLink: '/user/{u}',
                    headerLevelStart: 5,
                    noHeaderId: true,
                    openLinksInNewWindow: true,
                    requireSpaceBeforeHeadingText: true,
                    simpleLineBreaks: true,
                    simplifiedAutoLink: true,
                    strikethrough: true,
                    underline: true,
                    ghCodeBlocks: false,
                    smartIndentationFix: true
                });
                let parsed_body = converter.makeHtml(shout_body.textContent
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;'));
                console.log(shout_body.textContent, parsed_body);
                shout_body.innerHTML = parsed_body;

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

                element.setAttribute('title','');

                // make new badge
                let badge = document.createElement('span');
                badge.classList.add('avatar-status-dot',`user-status--bleh-${profile_badges[name].type}`,`user-status--bleh-user-${name}`);
                element.appendChild(badge);

                tippy(badge, {
                    content: `${name}, ${profile_badges[name].name}`
                });
            } else {
                let pre_existing_badge = element.querySelector('.avatar-status-dot');
                tippy(pre_existing_badge, {
                    content: `${name}, ${element.getAttribute('title')}`
                });
                element.setAttribute('title','');
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
                        <button class="btn bleh--btn" data-bleh-page="profiles" onclick="_change_settings_page('profiles')">
                            Profiles
                        </button>
                        <button class="btn bleh--btn" data-bleh-page="performance" onclick="_change_settings_page('performance')">
                            Performance
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
                                <p>Choose from light to oled.</p>
                            </div>
                            <div class="image-row">
                                <img src="https://cutensilly.org/img/bleh3-theme-oled.png">
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
                        <button class="btn setting-item" onclick="_change_settings_page('customise')">
                            <div class="icon bleh--link"></div>
                            <div class="text">
                                <h5>Always underline links</h5>
                                <p>Make links to interactables stand out.</p>
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
                        <div class="side-left full more">
                            <button class="btn setting-item has-image" data-bleh-theme="dark" onclick="change_theme_from_settings('dark')">
                                <div class="image">
                                    <div class="icon bleh--theme-dark"></div>
                                </div>
                                <div class="text">
                                    <h5>Dark</h5>
                                    <p>The default flavour of bleh</p>
                                </div>
                                <div class="image-row">
                                    <img src="https://cutensilly.org/img/bleh3-theme-dark.png" alt="Screenshot of bleh's default dark theme">
                                </div>
                            </button>
                            <button class="btn setting-item has-image" data-bleh-theme="darker" onclick="change_theme_from_settings('darker')">
                                <div class="image">
                                    <div class="icon bleh--theme-dark"></div>
                                </div>
                                <div class="text">
                                    <h5>Darker</h5>
                                    <p>The in-between</p>
                                </div>
                                <div class="image-row">
                                    <img src="https://cutensilly.org/img/bleh3-theme-darker.png" alt="Screenshot of bleh's darker theme">
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
                                    <img src="https://cutensilly.org/img/bleh3-theme-oled.png" alt="Screenshot of bleh's oled theme">
                                </div>
                            </button>
                        </div>
                    </div>
                    <h4>Light</h4>
                    <div class="setting-items">
                        <div class="side-left full more">
                            <button class="btn setting-item has-image" data-bleh-theme="light" onclick="change_theme_from_settings('light')">
                                <div class="image">
                                    <div class="icon bleh--theme-light">

                                    </div>
                                </div>
                                <div class="text">
                                    <h5>Light</h5>
                                    <p>Low saturation and bright</p>
                                </div>
                                <div class="image-row">
                                    <img src="https://cutensilly.org/img/bleh3-theme-light.png" alt="Screenshot of bleh's light theme">
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
                        <div class="shout js-shout js-link-block" data-kate-processed="true">
                            <h3 class="shout-user">
                                <a>cutensilly</a>
                            </h3>
                            <span class="avatar shout-user-avatar" title="Last.fm Pro user" data-kate-processed="true">
                                <img src="https://lastfm.freetls.fastly.net/i/u/avatar70s/198d1a3bd66a0d586e8e7af8a31febe4.jpg" alt="Your avatar" loading="lazy">
                                <span class="avatar-status-dot user-status--bleh-queen user-status--bleh-user-cutensilly" data-kate-processed="true"></span>
                            </span>
                            <a class="shout-permalink shout-timestamp">
                                <time datetime="2024-06-05T02:33:39+01:00" title="Wednesday 5 Jun 2024, 2:33am">
                                    5 Jun 2:33am
                                </time>
                            </a>
                            <div class="shout-body">
                                <p>some completely random text that doesn't mean <a href="https://cutensilly.org">anything at all</a></p>
                            </div>
                        </div>
                    </div>
                    <div class="toggle-container" id="container-accessible_name_colours">
                        <button class="btn reset" onclick="_reset_item('accessible_name_colours')">Reset to default</button>
                        <div class="heading">
                            <h5>Prefer accessible name colours</h5>
                            <p>Use the default header text colour over a accented text colour.</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-accessible_name_colours" onclick="_update_item('accessible_name_colours')" aria-checked="false">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="toggle-container" id="container-underline_links">
                        <button class="btn reset" onclick="_reset_item('underline_links')">Reset to default</button>
                        <div class="heading">
                            <h5>Always underline links</h5>
                            <p>Make links to interactables stand out with underlines.</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-underline_links" onclick="_update_item('underline_links')" aria-checked="false">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="sep"></div>
                    <div class="inner-preview pad flex">
                        <table class="chartlist chartlist--with-index chartlist--with-index--length-2 chartlist--with-image chartlist--with-play chartlist--with-artist chartlist--with-bar">
                            <tbody>
                                <tr class="chartlist-row chartlist-row--with-artist">
                                    <td class="chartlist-index">
                                        1
                                    </td>
                                    <td class="chartlist-image">
                                        <span class="cover-art">
                                            <img src="https://lastfm.freetls.fastly.net/i/u/64s/c15d3ed1bd8574260f9378e26847501d.jpg" alt="fractions of infinity" loading="lazy">
                                        </span>
                                    </td>
                                    <td class="chartlist-name">
                                        <a href="/music/Quadeca/_/fractions+of+infinity" title="fractions of infinity" class="bleh--chartlist-name-without-features">fractions of infinity (feat. Sunday Service Choir)</a>
                                        <a href="/music/Quadeca/_/fractions+of+infinity" title="fractions of infinity" class="bleh--chartlist-name-with-features">
                                            <span class="title">fractions of infinity</span>
                                            <span class="feat">feat. Sunday Service Choir</span>
                                        </a>
                                    </td>
                                    <td class="chartlist-artist bleh--chartlist-name-without-features">
                                        <a href="/music/Quadeca" title="Quadeca">Quadeca</a>
                                    </td>
                                    <td class="chartlist-artist bleh--chartlist-name-with-features">
                                        <a href="/music/Quadeca" title="Quadeca">Quadeca</a>,
                                        <a href="/music/Quadeca" title="Quadeca">Sunday Service Choir</a>
                                    </td>
                                    <td class="chartlist-bar">
                                        <span class="chartlist-count-bar">
                                            <span class="chartlist-count-bar-link">
                                                <span class="chartlist-count-bar-slug" style="width:100.0%;"></span>
                                                <span class="chartlist-count-bar-value">
                                                    104,321
                                                </span>
                                            </span>
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="toggle-container" id="container-format_guest_features">
                        <button class="btn reset" onclick="_reset_item('format_guest_features')">Reset to default</button>
                        <div class="heading">
                            <h5>Format guest features and song tags</h5>
                            <p>Visually places less priority on song features & tags (eg. Remix, Deluxe Edition, etc.)</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-format_guest_features" onclick="_update_item('format_guest_features')" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="toggle-container" id="container-big_numbers">
                        <button class="btn reset" onclick="_reset_item('big_numbers')">Reset to default</button>
                        <div class="heading">
                            <h5>Use alternative numerical font</h5>
                            <p>A special font solely for numbers, check it out!</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-big_numbers" onclick="_update_item('big_numbers')" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="sep"></div>
                    <div class="inner-preview pad flex">
                        <section class="catalogue-tags">
                            <ul class="tags-list tags-list--global">
                                <li class="tag">
                                    <a href="/tag/pop">pop</a>
                                </li>
                                <li class="tag">
                                    <a href="/tag/country">country</a>
                                </li>
                                <li class="tag">
                                    <a href="/tag/singer-songwriter">singer-songwriter</a>
                                </li>
                                <li class="tag">
                                    <a href="/tag/female+vocalists">female vocalists</a>
                                </li>
                                <li class="tag">
                                    <a href="/tag/synthpop">synthpop</a>
                                </li>
                            </ul>
                        </section>
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
        } else if (page == 'performance') {
            return (`
                <div class="bleh--panel">
                    <h3>Performance</h3>
                    <p>Running into noticeable issues in theme loading? Try out these settings.</p>
                    <div class="toggle-container" id="container-dev">
                        <button class="btn reset" onclick="_reset_item('dev')">Reset to default</button>
                        <div class="heading">
                            <h5>Disable in-built theme loading</h5>
                            <p>This allows you to load the in-built theme via Stylus instead, which may be more performant.</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-dev" onclick="_update_item('dev')" aria-checked="false">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                </div>
                `);
        } else if (page == 'profiles') {
            return (`
                <div class="bleh--panel">
                    <h3>Profiles</h3>
                    <p>Manage your personal data and data stored on other profiles.</p>
                    <h4>Notes</h4>
                    <div class="profile-notes" id="profile-notes"></div>
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
        else if (page == 'customise' || page == 'performance')
            refresh_all();
        else if (page == 'profiles')
            init_profile_notes();
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


    function init_profile_notes() {
        let profile_notes = JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
        let profile_notes_table = document.getElementById('profile-notes');

        for (let user in profile_notes) {
            let profile_note = document.createElement('div');
            profile_note.classList.add('profile-note-row');
            profile_note.setAttribute('id',`profile-note-row--${user}`);
            profile_note.innerHTML = (`
            <div class="name">
                <h5>${user}</h5>
            </div>
            <div class="note-preview">
                <p id="profile-note-row-preview--${user}">${profile_notes[user]}</p>
            </div>
            <div class="actions">
                <button class="btn bleh--edit-note" id="profile-note-row-edit--${user}" onclick="_edit_profile_note('${user}')">
                    Edit note
                </button>
                <button class="btn bleh--delete-note" id="profile-note-row-delete--${user}" onclick="_delete_profile_note('${user}')">
                    Remove note
                </button>
            </div>
            `);

            profile_notes_table.appendChild(profile_note);
            tippy(document.getElementById(`profile-note-row-edit--${user}`), {
                content: `Edit ${user}'s note`
            });
            tippy(document.getElementById(`profile-note-row-delete--${user}`), {
                content: `Delete ${user}'s note`
            });
        }
    }

    unsafeWindow._delete_profile_note = function(username) {
        let profile_notes = JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
        delete profile_notes[username];
        document.getElementById(`profile-note-row--${username}`).style.setProperty('display','none');

        localStorage.setItem('bleh_profile_notes',JSON.stringify(profile_notes));
    }

    unsafeWindow._edit_profile_note = function(username) {
        let profile_notes = JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};

        create_window('edit_profile_note',`Edit profile note for ${username}`,`
        <textarea id="bleh--profile-note" placeholder="Enter a local note for this user">${profile_notes[username]}</textarea>
        <div class="modal-footer">
            <button class="btn primary" onclick="_save_profile_note_in_window('${username}')">
                Save changes
            </button>
            <button class="btn" onclick="_kill_window('edit_profile_note')">
                Cancel
            </button>
        </div>
        `);

        profile_notes[username] = document.getElementById('bleh--profile-note').value;

        localStorage.setItem('bleh_profile_notes',JSON.stringify(profile_notes));
    }

    unsafeWindow._save_profile_note_in_window = function(username) {
        let profile_notes = JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
        let value_to_save = document.getElementById('bleh--profile-note').value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
        profile_notes[username] = value_to_save;

        document.getElementById(`profile-note-row-preview--${username}`).textContent = value_to_save;

        localStorage.setItem('bleh_profile_notes',JSON.stringify(profile_notes));
        kill_window('edit_profile_note');
    }




    // settings-page specific
    function reset_all() {
        for (let item in settings_base)
            reset_item(item);
    }

    function refresh_all() {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();
        for (let item in settings_base)
            update_item(item, settings[item], false);
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

    function update_item(item, value, modify=true) {
        console.log('update item',item,value);
        try {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();
        if (settings_base[item].type == 'slider' && modify)
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
            if (settings[item] == settings_base[item].values[0] && modify) {
                settings[item] = settings_base[item].values[1];
                document.getElementById(`toggle-${item}`).setAttribute('aria-checked',false);


                if (item == 'nav') {
                    document.getElementById('nav-img').setAttribute('src','https://cutensilly.org/img/nav-hidden.png');
                    settings.auth_badge = settings_base.auth_badge.values[1];
                }

                // save setting into body
                document.body.style.setProperty(`--${item}`,settings_base[item].values[1]);
                document.documentElement.setAttribute(`data-bleh--${item}`, `${settings_base[item].values[1]}`);
            } else if (modify) {
                settings[item] = settings_base[item].values[0];
                console.log(`toggle-${item}`);
                document.getElementById(`toggle-${item}`).setAttribute('aria-checked',true);


                if (item == 'nav') {
                    document.getElementById('nav-img').setAttribute('src','https://cutensilly.org/img/nav-shown.png');
                    settings.auth_badge = settings_base.auth_badge.values[0];
                } else if (item == 'dev') {
                    create_window('prompt_dev','Disable in-built theme loading',`
                        <p class="alert alert-info">Once you refresh the page, the in-built bleh theme will be disabled (unless you disable this option again).</p>
                        <br>
                        If you do not already have the <strong>Stylus</strong> extension, choose your browser below:
                        <br>
                        <div class="browser-choices">
                            <button class="btn browser" onclick="_chosen_chrome()">
                                <img class="browser-icon" src="https://cutensilly.org/img/chrome.png">
                                <p>Chrome</p>
                                <p class="caption">for Chrome, Edge, Brave, Opera</p>
                            </button>
                            <button class="btn browser" onclick="_chosen_firefox()">
                                <img class="browser-icon" src="https://cutensilly.org/img/firefox.png">
                                <p>Firefox</p>
                                <p class="caption">for Firefox only</p>
                            </button>
                        </div>
                    `);
                }

                // save setting into body
                document.body.style.setProperty(`--${item}`,settings_base[item].values[0]);
                document.documentElement.setAttribute(`data-bleh--${item}`, `${settings_base[item].values[0]}`);
            } else {
                // dont modify, just show
                if (settings[item] == settings_base[item].values[0]) {
                    document.getElementById(`toggle-${item}`).setAttribute('aria-checked',true);
                } else {
                    document.getElementById(`toggle-${item}`).setAttribute('aria-checked',false);
                }
            }
        }

        // save to settings
        localStorage.setItem('bleh', JSON.stringify(settings));
        } catch(e) {}
    }


    unsafeWindow._chosen_chrome = function() {
        open('https://chromewebstore.google.com/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne');
        continue_dev();
    }
    unsafeWindow._chosen_firefox = function() {
        open('https://addons.mozilla.org/en-US/firefox/addon/styl-us/');
        continue_dev();
    }


    function continue_dev() {
        kill_window('prompt_dev');
        create_window('continue_dev','Disable in-built theme loading',`
            Once you have the extension installed, hit "Install style" on the new tab that will open.
            <div class="modal-footer">
                <button class="btn primary" onclick="_finish_dev()">
                    Continue
                </button>
            </div>
        `);
    }

    unsafeWindow._finish_dev = function() {
        open('https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.css');
        kill_window('continue_dev');
        create_window('finish_dev','Disable in-built theme loading',`
            <p class="alert alert-success">All done! From now on, styling will be handled via Stylus.</p>
            <div class="modal-footer">
                <button class="btn primary" onclick="_kill_window('finish_dev')">
                    Done
                </button>
            </div>
        `);
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




    // feat.
    function name_includes(original_title, original_artist) {
        console.log(original_title, original_artist);
        let formatted_title = original_title;

        try {
        if (song_title_corrections[original_artist][formatted_title] != undefined)
            formatted_title = song_title_corrections[original_artist][formatted_title];
        } catch(e) {}

        let lowercase_title = formatted_title.toLowerCase();
        let extras = [];

        console.log(formatted_title, lowercase_title);


        // includes is now sorted into groups, first we run thru groups
        for (let group in includes) {
            // now we run thru individual includes in said-group
            for (let possible_match in includes[group]) {
                // does the title include this text match?
                if (lowercase_title.includes(includes[group][possible_match])) {
                    // mark character in string
                    let chr = lowercase_title.indexOf(`${includes[group][possible_match]}`);

                    extras.push({
                        type: includes[group][possible_match],
                        group: group,
                        chr: chr
                    })
                }
            }
        }

        // sort by occurance in string
        extras.sort((a, b) => a.chr - b.chr);

        // remove tags from original title
        for (let extra in extras) {
            formatted_title = formatted_title.slice(0, (extras[extra].chr - 1));
            break;
        }

        // find song guests
        let song_guests = [];

        console.log(extras);
        for (let extra in extras) {
            if ((parseInt(extra) + 1) < extras.length) {
                let chr = extras[extra].chr;
                let next_chr = extras[parseInt(extra) + 1].chr;

                extras[extra].text = original_title.slice(chr, (next_chr - 1)).replaceAll('(','').replaceAll(')','').replaceAll('[','').replaceAll(']','').replaceAll('- ','');
            } else {
                let chr = extras[extra].chr;
                extras[extra].text = original_title.slice(chr).replaceAll('(','').replaceAll(')','').replaceAll('[','').replaceAll(']','').replaceAll('- ','');
            }


            let field_group = extras[extra].group;
            // remove beginning tag
            let field_text = extras[extra].text.replace('feat. ','').replace('w/ ','').replace('with ','').replaceAll(' & ',';').replaceAll(', ',';').replaceAll('Tyler;the', 'Tyler, the').replaceAll(' with ',';');

            if (field_group == 'guests')
                song_guests = field_text.split(';');
        }

        if (extras.length > 0)
            return [formatted_title, extras, original_artist, song_guests];
        else
            return [formatted_title, [], original_artist, song_guests];
    }


    function patch_titles(element) {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

        if (settings.format_guest_features) {
            try {
            let tracks = element.querySelectorAll('.chartlist-row:not(.chartlist__placeholder-row)');

            tracks.forEach((track) => {
                if (!track.hasAttribute('data-kate-processed')) {
                    track.setAttribute('data-kate-processed','true');

                    console.log(track);

                    let track_title = track.querySelector('.chartlist-name a');
                    let track_artist = track_title.getAttribute('href').split('/')[2].replaceAll('+',' ');

                    let formatted_title = name_includes(track_title.textContent, track_artist);
                    console.log('formatted', formatted_title);
                    let song_title = formatted_title[0];
                    let song_tags = formatted_title[1];

                    // parse tags into text
                    let song_tags_text = '';
                    for (let song_tag in song_tags) {
                        song_tags_text = `${song_tags_text}<div class="feat" data-bleh--tag-type="${song_tags[song_tag].type}" data-bleh--tag-group="${song_tags[song_tag].group}">${song_tags[song_tag].text}</div>`;
                    }

                    // combine
                    track_title.innerHTML = `<div class="title">${song_title}</div>${song_tags_text}`;

                    let song_artist_element = track.querySelector('.chartlist-artist');
                    if (song_artist_element != undefined) {
                        if (song_artist_element.textContent.replaceAll('+', ' ').trim() == track_artist) {
                            let song_guests = formatted_title[3];
                            for (let guest in song_guests) {
                                // &
                                song_artist_element.innerHTML = `${song_artist_element.innerHTML},`;

                                let guest_element = document.createElement('a');
                                guest_element.setAttribute('href',`/music/${song_guests[guest]}`);
                                guest_element.setAttribute('title',song_guests[guest]);
                                guest_element.textContent = song_guests[guest];

                                song_artist_element.appendChild(guest_element);
                            }
                        }
                    }



                    // duration
                    let track_timestamp = track.querySelector('.chartlist-timestamp span');
                    if (track_timestamp != undefined) {
                        tippy(track_timestamp, {
                            content: track_timestamp.getAttribute('title')
                        });
                        track_timestamp.setAttribute('title','');
                    }


                    // image
                    let track_image = track.querySelector('.chartlist-image img');
                    tippy(track_image, {
                        content: track_image.getAttribute('alt')
                    })
                }
            });
            } catch(e) {console.error('AA',e)}
        }
    }

    function patch_header_title(element) {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

        if (settings.format_guest_features) {
            try {
            let track_title = element.querySelector('.header-new-title');
            let track_artist = element.querySelector('.header-new-crumb span');
            if (!track_title.hasAttribute('data-kate-processed')) {
                track_title.setAttribute('data-kate-processed','true');

                let formatted_title = name_includes(track_title.textContent, track_artist.textContent);
                let song_title = formatted_title[0];
                let song_tags = formatted_title[1];

                // parse tags into text
                let song_tags_text = '';
                for (let song_tag in song_tags) {
                    song_tags_text = `${song_tags_text}<div class="feat" data-bleh--tag-type="${song_tags[song_tag].type}">${song_tags[song_tag].text}</div>`;
                }

                // combine
                track_title.innerHTML = `<div class="title">${song_title}</div>${song_tags_text}`;

                let song_artist_element = element.querySelector('span[itemprop="byArtist"]');
                let song_guests = formatted_title[3];
                for (let guest in song_guests) {
                    // &
                    song_artist_element.innerHTML = `${song_artist_element.innerHTML},`;

                    let guest_element = document.createElement('a');
                    guest_element.classList.add('header-new-crumb');
                    guest_element.setAttribute('href',`/music/${song_guests[guest]}`);
                    guest_element.setAttribute('title',song_guests[guest]);
                    guest_element.textContent = song_guests[guest];

                    song_artist_element.appendChild(guest_element);
                }
            }
            } catch(e) {}
        }
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