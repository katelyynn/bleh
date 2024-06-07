// ==UserScript==
// @name         bleh
// @namespace    http://last.fm/
// @version      1.0.0
// @description  bleh!!! ^-^
// @author       kate
// @match        https://www.last.fm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=last.fm
// @grant        GM_addStyle
// ==/UserScript==

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
    dev: 0,
    hide_hateful: true
};


let redacted = [
    'underthefl00d',
    'SonicGamer420', 'PunishedCav', 'whatisajuggalo', 'Spartan122s', 'ruszaj', 'Chandiwila999', 'deadaptation', 'ShamsRealm', 'DREAD1NAT0R', 'oskxzr', 'SuperSonic2324', 'luna', 'daysbeforepazi', 'Reypublican', 'urkel_waste', 'bloodtemptress', 'EnderBro1945', 'nxtready', 'Hammurabis', 'Flammenjunge', 'hotgreekman', 'MinajSpace',
    'sudaengi', 'antisemitic', 'Alfonsorivera07', 'gueulescassees', 'bit188', 'Aryanorexic', 'archive44', 'goyslop', 'Lzxy', 'I984june', 'Babayoga88', 'GoatUser', 'SynagogueBurner', 'Cybercat2k6',
    'TheKimsterAight', 'squiggins', 'atwistedpath', 'aeriscupid', 'nicefeetliberal', 'KanyeBestStan', 'A-_-_-_-_-_-_-_', 'Wurzel362', 'Chaosophile', 'Sagamore_BR', 'Account124', 'Oliwally2', 'lucasthales', 'thedadbrains', 'artofIettinggo', 'Lumyh', 'meltingwalls', 'meowpoopoo', 'aeest', 'AJRogers25', 'FLVCKO5000', 'YUNGRAPUNXOTA', 'sen_nn', 'Chickenoflight', 'majorCbartl', 'entranas', 'julyrent', 'misaeld7', 'sircarno', 'Getyuu', 'IFuckBees', 'BigBabyGOAT-116', 'MatRanc', 'Andre3x', 'Johanvillian666', 'souljahwitch_', 'selenabeer', 'kbasfm', 'c4alexo', 'aantoniotapia', 'Bobbygordon4', 'Con_8L', 'kebfm', 'Alex5un', 'Bluefacee', 'Itachiu1', 'TARDSLAYER87', 'sharosky',
    'CraziiDago',
    'calicowawawa', 'Ieo-',
    'dyetzer09', 'SevenDotz', 'GeckoGunner21',
    'Bigman_kam', 'JuanLuisGG15', 'xXAleSonikPS2Xx', 'noodlebaths',
    'entrys', 'haviebaby',
    'ifuckenhatebts', 'cuteandfunny', 'NickiTheBarbie', 'kristojk', 'Lovethebabiesss', 'TheCryBabyGirl', 'faafasfJH12', 'lost', 'isucktoes_', 'rightangles', 'SupaDupaSeb', 'SeptemberSun-_-', 'yy02', 'breakpoint420', 'twillaz', 'angel-food', 'owenfomistu', 'nuhovich', 'einstieg', 'Sigmevious', 'lovedytea',
    'EminemIover911', 'Ranmaru1232', 'Littlegayman', 'OverKektor', 'Zigger0707', 'JTLDN', 'BakaAnon', 'TheWatcher777', 'Guicute', 'wempep', 'BeingofEvil', 'Marie_Cachet', 'rusnazi8814', 'Go1ngER', 'Pranav777', 'Creativezito', 'DjAngelInfinity', 'Cowboy-Robot', 'RiskGrave', 'charmingaxelotl', 'naterade20', 'Willgregg10', 'avantish', 'shaggy-maggot', 'SliceJosiah', 'airshots22', 'TacoMIW', 'DaveBFC', 'UkulilyFilly', 'SPEEPYBOO', 'roosterteethz', 'winter_demon', 'preziosestelle', 'Wess0', 'heruchris', 'MellowColonel', 'DXP6986', 'Leo_Marlow', 'newmetallic', 'Kotkaa', 'dodemea', 'CainRipley', 'frajestic', 'Danny_Top23', 'molochthagod', 'kanyelover900', 'Phosphoss', 'sugawarasatsuki', 'captivepleading', 'PaddyCM', 'burroughs3000', 'marblesodaa', 'muistu77', 'korimullanmusic', 'magikwand', 'EmpireoGrace', 'Psychonau', 'sk8erboi03', 'DOGTOME', 'milkvveed', 'ghastlygoblin', 'lsihc', 'Promethesis', 'NlCKlMlNAJ', 'so0catwoman', 'handsomegamer46', 'w28888ihateu', 'IIthe2nd', 'Jrwer', 'r0ann', 'Hetzghor', 'umabon', 'Karl_Nicenstein', 'forestgaze', 'Ghostcum', 'bigluke444', 'Mozzaddy', 'ahuehauheauauh', 'KINGJAXTERK', 'setitaIIablaze', 'araicd', 'juliusvc', 'mzumii', 'masskollaps', 'belenio', 'HoosierBallz', 'sh0ppingcart', 'brownieboy', 'martyrdomr', 'Vessel_Anathema', 'Twenty10s', 'Skuuuuuii', 'birodani115', 'lawlercopter_', 'samanthafox12', 'The_Diabolus', 'momasoooooos', 'tigohc', 'OrA4NGEpm', 'minakonyaa', 'RyukoProp', 'AntifaFemboy', 'nlec', 'jediwarlock1', 'epowjgpwak', 'anxrcxy', 'pissturd1', 'adxail', 'Suprremme', 'qwertyhomu', 'keblz', 'hotstep_', 'fadelooy', 'ApesOG', 'violentflowers', 'ItsThiagoBanger', 'SyrettePurp', 'swagstica', 'htgs', 'grigoriybalbes', 'heliosi', 'buttfartdhshs', 'Wonderglue', 'kanyewest2028', 'Caeshijque', 'MysteryBFDI', 'NikkiLee8208', 'JCK_FM', 'EtherealBangerz', 'iseenothing', 'achondrogenesis', 'theandromedaxo', 'SeanDerBeste', 'JCT08', 'TheV3locity4545', 'HumbleGold', 'Draincel', 'allyourbased', 'birdboiling', 'tharizdoom', 'SUPlNHO', 'dashywashy', 'gabcoelhomusic', 'ox_yd', 'bernkastel__', 'fearcuIt', 'gxlnd_', 'BrittanyMahomes', 'NuMetalFan69', 'SafireStar', 'IceSpoon', 'IssacJ06', 'ThePrio', 'LoveDiaries', 'sillycelery1974', 'nyqmii', 'gauItier', 'rspbrysda', 'pnavarre2330', 'lTSUP2ME', 'noolr', 'dakota0824', 'goncalvesrafael', 'DaequanBS', 'dwaqons', 'Bogurodzica69', 'GtzGold', 'roy_05', 'niloymahir', 'Ikarivktr', 'JE1934', 'Figaro-17', 'sugmaballs69', 'Don-Weaso', 'schrodngrSafety', 'okJosiah', 'anahausu', 'venusfleur', 'kristiyan47', 'mkulia', 'Nick-Valentine', 'raraee_', 'MJ-XX', 'Berk_Ziya', 'thatpower1', 'phantomchasm', 'StupidMetalhead'
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
            style.setAttribute('href','https://katelyynn.github.io/bleh/fm/bleh.user.css');
            document.documentElement.appendChild(style);
        }
    }

    function append_nav(element) {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();
        let user_nav = element.querySelectorAll('.auth-dropdown-menu li')[0];

        if (!user_nav.hasAttribute('data-kate-processed')) {
            user_nav.setAttribute('data-kate-processed','true');

            let bleh_nav = document.createElement('li');
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
        for (let setting in settings)
            document.documentElement.setAttribute(`data-bleh--${setting}`, `${settings[setting]}`);

        // save to settings
        localStorage.setItem('bleh', JSON.stringify(settings));
    }

    // save a setting
    function setting(setting, value) {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

        // save value
        settings[setting] = value;
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

            if (redacted.includes(profile_name)) {
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
            if (!shout.hasAttribute('data-kate-processed')) {
                shout.setAttribute('data-kate-processed', 'true');

                let shout_name = shout.querySelector('.shout-user a').textContent;
                let shout_avatar = shout.querySelector('.shout-user-avatar');

                if (redacted.includes(shout_name)) {
                    shout.classList.add('shout--bleh-redacted');
                    shout_avatar.classList.add('avatar--bleh-missing');
                } else {
                    patch_avatar(shout_avatar, shout_name);
                }
            }
        });
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
                                    <div class="icon bleh--theme-dark">

                                    </div>
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
                    <h3>Customise</h3>
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
        content.innerHTML = inner_content;
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
    unsafeWindow.kill_window = function(id) {
        document.body.removeChild(document.getElementById(`bleh--window-${id}--background`));
        document.body.removeChild(document.getElementById(`bleh--window-${id}--wrapper`));
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