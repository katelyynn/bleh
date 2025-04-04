import { handle_error_500 } from "../page";
import { log } from "./log";
import { auth, auth_link, setRoot } from "./page";
import { clamp_sat, rgb_to_hsl } from "./tools";

// loads your selected language in last.fm
export let lang;
export let non_override_lang;
// WARN: fill this out if translating
// lists all languages with valid bleh translations
// any custom translations will not load if not listed here!!
export let valid_langs = ['en', 'de', 'pl'];

export let lang_info = {
    en: {
        name: 'English',
        by: ['cutensilly'],
        last_updated: 'latest'
    },
    de: {
        name: 'Deutsch',
        by: ['stellasaur', 'cutensilly'],
        last_updated:  '2025-03-09'
    },
    pl: {
        name: 'Polski',
        by: ['iwas15with100k'],
        last_updated:  '2024-06-17'
    }
}

export const trans = {
    home: {
        en: 'Home'
    },
    library: {
        en: 'Library'
    },
    view_profile: {
        en: 'View profile'
    },
    shouts: {
        en: 'Shouts'
    },
    about: {
        en: 'About'
    },
    edit_wiki: {
        en: 'Edit wiki'
    },
    read_more: {
        en: 'Read more'
    },
    refresh: {
        en: 'Refresh'
    },
    refresh_tracks: {
        en: 'Refresh tracks'
    },
    from_the_album: {
        en: 'From the album: {album}'
    },
    set_obsession: {
        en: 'Obsess'
    },
    obsession_first: {
        en: 'First to claim this obsession!'
    },
    compare: {
        en: 'Compare'
    },
    compare_plays: {
        en: 'Compare plays'
    },
    others_featured: {
        en: 'Others featured'
    },
    your_scrobbles: {
        en: 'Your scrobbles'
    },
    plays: {
        en: 'Plays'
    },
    try_again: {
        en: 'Try again'
    },
    continue: {
        en: 'Continue'
    },
    back: {
        en: 'Back'
    },
    settings: {
        en: 'Settings'
    },
    done: {
        en: 'Done'
    },
    on_ignore_list: {
        en: 'Ignored'
    },
    friends: {
        en: 'Friends'
    },
    aka: {
        en: 'aka.'
    },
    pronouns: {
        en: 'pronouns'
    },
    account_created: {
        en: 'created'
    },
    account_scrobbling_since_replace: {
        // copy this from last.fm 1:1 (including the space at the end if there)
        en: '• scrobbling since '
    },
    edit: {
        en: 'Edit'
    },
    edit_profile: {
        en: 'Edit profile'
    },
    scrobbles: {
        en: 'Scrobbles'
    },
    artists: {
        en: 'Artists'
    },
    albums: {
        en: 'Albums'
    },
    tracks: {
        en: 'Tracks'
    },
    appearance: {
        en: 'Appearance'
    },
    themes: {
        en: 'Themes',
        light: {
            en: 'Light'
        },
        dark: {
            en: 'Ash'
        },
        darker: {
            en: 'Dark'
        },
        oled: {
            en: 'Void'
        }
    },
    configure: {
        en: 'Configure'
    },
    events: {
        en: 'Events'
    },
    top_badge: {
        en: 'Top Badge'
    },
    layout: {
        en: 'Layout'
    },
    music: {
        en: 'Music',
        de: 'Musik'
    },
    profile: {
        en: 'Profile',
        de: 'Profil'
    },
    seasonal: {
        en: 'Seasonal',
        de: 'Saisonal'
    },
    text: {
        en: 'Text'
    },
    accessibility: {
        en: 'Accessibility'
    },
    moderation: {
        en: "Moderation"
    },
    troubleshooting: {
        en: 'Advanced'
    },
    recommendations: {
        en: 'Recommendations'
    },
    releases: {
        en: 'Releases'
    },
    bookmarks: {
        en: 'Bookmarks'
    },
    charts: {
        en: 'Charts'
    },
    welcome_back_user: {
        en: 'Welcome back {user}'
    },
    thank_you_for_sponsoring: {
        en: 'Thank you for sponsoring!'
    },
    configure_bleh: {
        en: 'bleh Settings'
    },
    import: {
        en: 'Import'
    },
    export: {
        en: 'Export'
    },
    reset: {
        en: 'Reset'
    },
    whats_new: {
        en: 'What\'s New?'
    },
    default: {
        en: 'Default'
    },
    avatar: {
        en: 'Avatar'
    },
    customise: {
        en: 'Customise'
    },
    hue: {
        en: 'Accent colour',
        de: 'Akzentfarbe'
    },
    sat: {
        en: 'Vibrancy'
    },
    lit: {
        en: 'Lightness',
        de: 'Helligkeit'
    },
    card_background_saturation: {
        name: {
            en: 'Card background vibrancy'
        },
        body: {
            en: 'Bring some colour into your world (or reduce it)'
        }
    },
    save: {
        en: 'Save'
    },
    add: {
        en: 'Add'
    },
    remove: {
        en: 'Remove'
    },
    go: {
        en: 'Go'
    },
    skip: {
        en: 'Skip'
    },
    send: {
        en: 'Send'
    },
    send_quickly_with: {
        en: 'Send quickly with {kbd}'
    },
    right_click_for_more_options: {
        en: 'Right click for more options'
    },
    refresh_pending: {
        name: {
            en: 'Refresh pending'
        },
        body: {
            en: 'A setting you changed requires a page refresh to take effect.'
        }
    },
    new: {
        en: 'New'
    },
    beta: {
        en: 'Beta'
    }
}

export const trans_legacy = {
    en: {
        pages: {
            bleh_settings: {
                '': 'bleh settings'
            },
            bleh_setup: {
                '': 'bleh setup'
            },
            bleh_sponsor: {
                '': 'sponsor'
            },
            home: {
                overview: 'home',
                artists: 'artists',
                albums: 'albums',
                tracks: 'tracks',
                events: 'events'
            },
            overview: {
                music: 'home'
            },
            recommended: {
                artists: 'recommended artists',
                albums: 'recommended albums',
                tracks: 'recommended tracks',
                rediscover: 'blasts from the past',
                tags: 'recommended tags'
            },
            bookmarks: {
                overview: 'bookmarks',
                artists: 'bookmarks',
                albums: 'bookmarks',
                tracks: 'bookmarks',
                tags: 'bookmarks'
            },
            search: {
                overview: '{name} · search',
                artists: '{name} · artist search',
                albums: '{name} · album search',
                tracks: '{name} · track search'
            },
            labs: {
                overview: 'labs'
            },
            settings: {
                overview: 'settings',
                privacy: 'privacy · settings',
                account_overview: 'account · settings',
                website: 'website · settings',
                subscription_overview: 'last.fm pro · settings',
                'subscription_automatic-edits_albums': 'album auto edits · settings',
                'subscription_automatic-edits_tracks': 'track auto edits · settings',
                applications_overview: 'applications · settings',
            },
            inbox: {
                overview: 'incoming inbox',
                sent_overview: 'outgoing inbox',
                compose: 'compose message',
                message_overview: 'message',
                sent_message: 'message',
                notifications: 'notifications'
            },
            releases: {
                'out-now_recommended': 'out now',
                'out-now_popular': 'out now',
                'coming-soon_recommended': 'coming soon',
                'coming-soon_popular': 'coming soon'
            },
            charts: {
                overview: 'live charts',
                weekly: 'weekly charts'
            },
            user: {
                overview: '{name} · profile',
                'listening-report_week': '{name} · profile reports',
                'listening-report_month': '{name} · profile reports',
                'listening-report_year': '{name} · profile reports',
                library_overview: '{name} · profile library',
                library_artists: '{name} · profile library',
                library_albums: '{name} · profile library',
                library_tracks: '{name} · profile library',
                library_artist_overview: '{name} · profile library',
                library_album_overview: '{name} · profile library',
                library_track_overview: '{name} · profile library',
                library_artist_albums: '{name} · profile library',
                library_artist_tracks: '{name} · profile library',
                following: '{name} · profile following',
                followers: '{name} · profile followers',
                neighbours: '{name} · profile neighbours',
                shoutbox_overview: '{name} · profile shouts',
                loved: '{name} · profile loved',
                obsessions: '{name} · profile obsessions',
                events: '{name} · profile events',
                playlists_playlists: '{name} · profile playlists',
                tags_overview: '{name} · profile tags',
            },
            artist: {
                overview: '{name} · artist',
                tracks: '{name} · artist tracks',
                albums: '{name} · artist albums',
                images_overview: '{name} · artist photos',
                'images_image-upload': '{name} · artist photos',
                image: '{name} · artist photo',
                similar: '{name} · artist similar',
                wiki_overview: '{name} · artist wiki',
                wiki_edit: '{name} · artist wiki',
                wiki_history: '{name} · artist wiki',
                listeners_overview: '{name} · artist top listeners',
                'listeners_you-know': '{name} · artist listeners you know',
                shoutbox_overview: '{name} · artist shouts',
                events: '{name} · artist events',
                tags_overview: '{name} · artist tags'
            },
            album: {
                overview: '{name} - {sister} · album',
                wiki_overview: '{name} - {sister} · album wiki',
                wiki_edit: '{name} - {sister} · album wiki',
                wiki_history: '{name} - {sister} · album wiki',
                images_overview: '{name} - {sister} · album photos',
                'images_image-upload': '{name} - {sister} · album photos',
                image: '{name} - {sister} · album photo',
                shoutbox_overview: '{name} - {sister} · album shouts',
                tags_overview: '{name} - {sister} · album tags'
            },
            track: {
                overview: '{name} - {sister} · track',
                albums: '{name} - {sister} · track albums',
                wiki_overview: '{name} - {sister} · track wiki',
                wiki_edit: '{name} - {sister} · track wiki',
                wiki_history: '{name} - {sister} · track wiki',
                shoutbox_overview: '{name} - {sister} · track shouts',
                tags_overview: '{name} - {sister} · track tags'
            }
        },
        badges: {
            missing: {
                name: 'No badges'
            },
            'user-status-subscriber': {
                name: 'Last.fm Pro',
                reason: 'Active Pro subscription'
            },
            'user-status-staff': {
                name: 'Staff',
                reason: 'Staff member of Last.fm'
            },
            'label--fade': {
                reason: 'They follow you'
            },
            contributor: {
                name: 'bleh contributor',
                reason: 'Contributed to bleh via code or translations'
            },
            translation: {
                reason: 'Translated for a supported language'
            },
            cat: {
                name: 'it\'s a kitty!!'
            },
            sponsor: {
                name: 'Sponsoring',
                reason: 'Sponsored bleh and bwaa :3'
            },
            cute: {
                reason: 'Reserved for special users'
            },
            reserved: {
                reason: 'Reserved for certain users'
            }
        },
        avatar_for_me: 'Your avatar',
        avatar_for_user: 'Avatar for ',
        actions: {
            view_profile: 'View profile',
            view_library: 'Library',
            leave_a_shout: 'Shouts'
        },
        lotus: {
            artist: 'Artist corrections have been downloaded!',
            album_track: 'Album and track corrections have been downloaded!',
            version: 'You are running lotus version {v}.',
            tooltip: 'lotus is the community correction system used in bleh and bwaa',
            check: 'Check for updates',
            correct: {
                name: 'Correct capitalisation',
                tooltip: 'Submit name correction',
                tooltip_active: 'Active name correction'
            }
        },
        glacier: {
            name: 'Library refresh',
            by_artist: ' by {a}',
            meta: {
                artists: 'Artists',
                albums: 'Albums',
                tracks: 'Tracks',
                average: 'Average'
            },
            view: {
                grid: 'Grid',
                list: 'List',
                line: 'Line',
                pie: 'Pie',
                bar: 'Bar'
            },
            axis: {
                horizontal: 'Horizontal',
                vertical: 'Vertical'
            },
            dates: {
                last_year: 'Last year',
                this_year: 'This year'
            },
            edit: 'Edit',
            delete: 'Delete',
            love: 'Love',
            bulk_edit: 'Bulk edit',
            option: {
                name: 'Use new graphs in library',
                bio: 'This can add a little amount of slow-down in some cases but with the benefit of awesome graphs.'
            }
        },
        changelog: {
            name: 'What’s New?',
            subtitle: 'from {u}',
            type: {
                major: 'Major release',
                minor: 'Minor release',
                general: 'General improvements',
                fix: 'Bug fix'
            },
            latest: 'Latest',
            view_major: 'View latest major release'
        },
        auth_menu: {
            dev: 'Toggle dev mode',
            configure_bleh: 'Configure bleh',
            library: 'Library',
            shouts: 'Shouts',
            obsessions: 'Obsessions',
            labs: 'Labs',
            bookmarks: 'Bookmarks',
            settings: 'Settings',
            logout: 'Logout',
            seasonal_notice: 'To watch the counter update live, click and stay on the tab that opens.',
            seasonal_live: 'Counter is updating live!'
        },
        music: {
            submit_lastfm_correction: 'Submit correction to Last.fm',
            search_variations: {
                name: 'Search',
                tooltip: 'Search for variations of this title'
            },
            search_genius: 'Search lyrics',
            fetch_plays: {
                name: 'Tracklist',
                info: 'Sourced from your own plays as an official tracklist is unavailable',
                loading: 'Fetching your plays on this album',
                fail: 'You do not have any plays on this album',
                open_as_track: 'Open album title as a track'
            },
            from_the_album: 'From the album: {album}',
            listens: {
                count_listens: '{c} listens',
                loading_listens: 'listens',
                other_listeners: '{c} others',
                custom: {
                    tooltip: 'Pick a user',
                    name: 'View listens from another user'
                }
            },
            wiki: 'About',
            wiki_edit: 'edit wiki',
            wiki_read: 'read more',
            refresh: 'Refresh',
            refresh_tracks: 'Refresh tracks',
            menu: 'Extra options',
            obsession: 'Obsess',
            obsession_first: 'First to claim this obsession!',
            compare: {
                name: 'Compare',
                header: 'Compare plays'
            },
            about: 'About',
            about_guests: 'Others featured',
            view_profile: 'View profile'
        },
        error: {
            name: 'This page is missing...',
            go_back: 'Go back',
            visit_profile: 'Visit profile',
            try_again: 'Try again'
        },
        statistics: {
            scrobbles: {
                name: 'Your scrobbles'
            },
            plays: {
                name: 'plays'
            }
        },
        profile: {
            name: 'Profile',
            on_ignore_list: 'Ignored',
            friends: {
                name: 'Friends'
            },
            display_name: {
                aka: 'aka.',
                pronouns: 'pronouns'
            },
            created: {
                name: 'created',

                replace: '• scrobbling since '
            },
            edit: 'Edit profile',
            obsess: 'Obsess',
            message: 'Message',
            sponsor: 'Sponsor',
            message_sponsor: 'Receive sponsor rewards',
            shortcut: {
                add: 'Shortcut',
                remove: 'Shortcut'
            },
            scrobbles: 'Scrobbles',
            artists: 'Artists',
            loved: 'Loved',
            taste: 'Taste similarity',
            taste_meter: {
                level: {
                    super: 'Super',
                    very_high: 'Very High',
                    high: 'High',
                    medium: 'Medium',
                    low: 'Low',
                    very_low: 'Very Low',
                    unknown: 'Unknown'
                },
                you_share_1: 'You share {artist}',
                you_share_2: 'You share {artist1} and {artist2}',
                you_share_3: 'You share {artist1}, {artist2}, and {artist3}'
            },
            open_avatar: 'Open in a new tab',
            settings: 'Configure',
            events: 'Events',
            top_badge: 'Top Badge',
            progress: {
                to_go: '{s} scrobbles to go',
                tier: 'Tier {t}',
                explain: 'For each tier, you unlock a new badge'
            },
            banner: {
                name: 'Banner',
                origin: {
                    bio: [
                        'Sourced from this user\'s about me',
                        'Embed an image with {b} to achieve the same'
                    ],
                    avatar: 'Sourced from this user\'s avatar',
                    artist: 'Sourced from this user\'s top track',
                    hidden: 'Hidden based on your preferences',
                    none: 'Sourced from nowhere...'
                }
            }
        },
        event: {
            name: 'Event',
            going: '{c} going',
            maybe: '{c} interested',
            you_know: 'Who you know',
            all_time: 'All time',
            total: '{c} total'
        },
        messaging: {
            update: 'bleh has updated to version {v}!'
        },
        wiki: {
            latest: 'View latest version',
            syntax: {
                name: 'Use fancy syntax when editing',
                links_to: 'Links to {link}'
            },
            presets: {
                name: 'Symbol presets'
            }
        },
        settings: {
            name: 'Settings',
            save: 'Save',
            cancel: 'Cancel',
            close: 'Close',
            clear: 'Clear',
            create: 'Create',
            add: 'Add',
            remove: 'Remove',
            done: 'Done',
            finish: 'Finish',
            continue: 'Continue',
            reset: 'Reset to default',
            go: 'Go',
            skip: 'Skip',
            back: 'Back',
            send: 'Send',
            send_quickly: 'Send quickly with {kbd}',
            right_click: 'Right-click for more options',
            reload: {
                name: 'Refresh pending',
                body: 'A setting you changed requires a page refresh to take effect.'
            },
            new: 'New',
            beta: 'Beta',
            configure: 'Configure',
            pages: {
                overview: 'Profile',
                privacy: 'Privacy',
                account_overview: 'Account',
                website: 'Website',
                subscription_overview: 'Pro',
                applications_overview: 'Applications'
            },
            examples: {
                button: 'Example button'
            },
            skip_to: {
                name: 'Skip to'
            },
            home: {
                name: 'Home',
                brand: 'bleh',
                version: 'Version {v}',
                recommended: 'Recommended settings',
                issues: {
                    name: 'Issues',
                    bio: 'Report bugs'
                },
                update: {
                    name: 'Updates',
                    css: 'Update style',
                    bio: 'Check now',
                    notice: 'There are updates available!',
                    ignore: 'Ignore temporarily',

                    update_now: 'Update now',
                    update_to_v: 'Update to {v}'
                },
                setup: {
                    name: 'Setup',
                    bio: 'Re-enter setup'
                },
                colours: {
                    name: 'Colours',
                    bio: 'Pick your favourite!'
                },
                thanks: 'Welcome {m}, you are running bleh version {v}.',
                sponsor: {
                    name: 'Sponsor',
                    header: 'Sponsor the development of bleh and bwaa',
                    bio: 'If you feel my work on these projects is worthy of donations you are welcome to sponsor me on GitHub. This is of course optional and bleh will forever be open-source and free.',
                    thanks: 'Thank you for sponsoring {m}, you are running bleh version {v}.',
                    status: {
                        yes: 'You are a sponsor, thank you!',
                        no: 'Become a sponsor to get a custom badge',
                        badge: 'To configure your custom badge, get in touch with me.',
                        one_time: 'A custom badge is available only when selecting monthly.'
                    },
                    manage: 'Manage sponsorship',
                    check: 'Refresh badges',
                    download: 'Sponsorship and badge data downloaded!',
                    version: 'You have version {v} of the sponsorship/badge data downloaded.'
                }
            },
            appearance: {
                name: 'Appearance'
            },
            themes: {
                name: 'Themes',
                bio: 'Choose from light to midnight.',
                dark: {
                    name: 'Dark',
                    bio: 'The default flavour of bleh'
                },
                darker: {
                    name: 'Darker',
                    bio: 'The in-between'
                },
                oled: {
                    name: 'Midnight',
                    bio: 'Ultra blackout'
                },
                light: {
                    name: 'Light',
                    bio: 'Low saturation and bright'
                },
                classic: {
                    name: 'Classic',
                    bio: 'Re-live early computing'
                }
            },
            music: {
                name: 'Music',
                header: 'Music configuration',
                bio: 'Configure your music-related settings for profiles, artists, albums, and tracks.',
                profile_shortcut: {
                    name: 'Profile shortcut',
                    bio: 'Quickly access a user\'s plays on an artist, album, or track page.',
                    placeholder: 'Profile',
                    header: 'Enter username',
                    saved: 'Profile shortcut is valid',
                    failed: 'Profile does not exist or failed to load'
                },
                show_bulk_edit_album: {
                    name: 'Show album in chartlists',
                    bio: 'This is disabled by default as hovering over tracks reveals the album title in all areas',
                    require: 'Only applicable with the ‘Last.fm Bulk Edit’ extension'
                },
                grid_glow: {
                    name: 'Show a glow around grid items'
                }
            },
            accessibility: {
                name: 'Accessibility',
                shout_preview: 'some completely random text that doesn\'t mean <a href="https://cutensilly.org">anything at all</a>',
                accessible_name_colours: {
                    name: 'Prefer accessible name colours',
                    bio: 'Use the default header text colour over a accented text colour.'
                },
                underline_links: {
                    name: 'Always underline links',
                    bio: 'Make links to interactables stand out.'
                },
                reduced_motion: {
                    name: 'Reduce animations around interfaces',
                    bio: 'Will in most cases either slowly fade or hard-cut, no scaling.'
                },
                toggle_icon: {
                    name: 'Add indicator icon to toggles',
                    bio: 'Display a checkmark or a cross depending on toggle state.'
                }
            },
            layout: {
                name: 'Layout',
                header: 'Manage header layout',
                avatar_action: {
                    name: 'Default avatar action',
                    bio: 'What do you want to happen when you click avatars?',
                    gallery: 'View photos (or featured album for tracks)',
                    album: 'View featured album'
                },
                quick_artist_button: {
                    name: 'Quick artist button',
                    bio: 'Control the right-side button on artist profiles.',
                    shouts: 'View shouts',
                    wiki: 'View biography',
                    listens: 'View listeners'
                }
            },
            customise: {
                name: 'Customise',
                colours: {
                    name: 'Colours',
                    modals: {
                        custom_colour: {
                            hue: 'Accent colour',
                            sat: 'Saturation',
                            lit: 'Lightness',
                            seasonal_alert: 'The current season is overriding your accent colour, adjust sliders to disable.'
                        }
                    },
                    swatches: {
                        default: 'Default',
                        avatar: 'Avatar',
                        seasonal: 'Seasonal',
                        custom: 'Customise'
                    }
                },
                high_contrast: {
                    name: 'Enable high contrast mode'
                },
                seasonal: {
                    name: 'Seasonal',
                    timeline: 'Seasonal timeline',
                    bio: 'During seasonal events, bleh can automatically change the default accent colour, add particles, and add overlays to various interface elements.',
                    info: 'Seasonal events try to match your timezone, for reference we calculated {offset}',
                    started: 'Started',
                    ends_in: 'Ends in',
                    listing: {
                        none: 'No active season',
                        easter: 'Easter',
                        pride: 'Pride',
                        halloween: 'Halloween',
                        pre_fall: 'Pre-Fall',
                        fall: 'Fall',
                        christmas: 'Christmas',
                        new_years: 'New Years'
                    },
                    option: {
                        name: 'Enable seasonal event system'
                    },
                    marker: {
                        current: 'The current season is {season} for {time}.',
                        started: 'started {time}',
                        none: 'There is no active season currently.',
                        disabled: 'You have seasons disabled, enable to view current event.'
                    },
                    particles: {
                        name: 'Display particles during select seasons',
                        bio: 'During winter seasons you get snowflakes!'
                    },
                    show_less_particles: {
                        name: 'Display a reduced number of particles'
                    },
                    fps_particles: {
                        name: 'Display particles without fancy effects',
                        bio: 'This might be more demanding on some systems'
                    },
                    overlays: {
                        name: 'Display additional seasonal effects',
                        bio: 'During winter seasons this is used for ice effects, otherwise mainly just gradients.'
                    },
                    announce: 'It is now {s}!',
                    nonsense: 'A Nonsense Christmas',
                    fruitcake: 'fruitcake',
                    mistletoe: 'Mistletoe',
                    festival: 'Christmas Eve',
                    view: 'Open seasonal tab',
                    none: 'No colours available'
                },
                artwork: {
                    name: 'Artwork'
                },
                hue_from_album: {
                    name: 'Colour album pages based on album art',
                    bio: 'Picks the primary colour from an album cover to paint the page.'
                },
                gloss: {
                    name: 'Gloss overlay',
                    bio: 'Apply flair to all cover arts.'
                },
                display: {
                    name: 'Display'
                },
                colourful_counts: {
                    name: 'Use a colour gradient for all-time charts',
                    bio: 'Assigns a colour from a gradient based on your position in all-time artist scrobbles.'
                },
                colourful_tracks: {
                    name: 'Colour actively scrobbling tracks based on album art',
                    bio: 'Picks the primary colour from the associated cover to paint the track.'
                },
                gendered_tags: {
                    name: 'Hide gendered tags',
                    bio: 'Gender-specific tags are deemed redundant by default.'
                },
                rain: {
                    name: 'Let it rain!',
                    bio: 'rain :3c (may have performance impacts !! also may look bad !!)'
                },
                show_your_progress: {
                    name: 'Show your weekly progress',
                    bio: 'too many numbers ~w~'
                },
                profile_header: {
                    name: 'Display profile backgrounds',
                    see_type: 'Source from avatar instead of top artist',
                    view_on: 'View backgrounds on',
                    for_own: 'My own profile',
                    for_others: 'Other profiles'
                },
                sat_bg: {
                    name: 'Card background saturation',
                    bio: 'Control the colour of backgrounds in addition to main accent'
                }
            },
            activities: {
                name: 'Activities',
                bio: 'Display your most recent activities locally on your profile, only for you to see.',
                toggle: {
                    name: 'Enable activity tracking',
                    bio: 'Events will only be registered and displayed while enabled.'
                },
                types: {
                    shout: 'Shouts',
                    image: 'Image uploads and interactions',
                    obsess: 'Track obsessions',
                    love: 'Track love',
                    install: 'Installing and updating',
                    wiki: 'Wiki editing'
                }
            },
            moderation: {
                name: "Moderation"
            },
            performance: {
                name: 'Troubleshooting',
                bio: 'Running into noticeable issues in theme loading? Try out these settings.',
                dev: {
                    name: 'Disable in-built theme loading',
                    bio: 'This allows you to load the in-built theme via Stylus instead, which may be more performant.',
                    modals: {
                        prompt: {
                            alert: 'Once you refresh the page, the in-built bleh theme will be disabled (unless you disable this option again).',
                            stylus: 'If you do not already have the <strong>Stylus</strong> extension, choose your browser below:',
                            browsers: {
                                chrome: {
                                    name: 'Chrome',
                                    bio: 'for Chrome, Edge, Brave, Opera'
                                },
                                firefox: {
                                    name: 'Firefox',
                                    bio: 'for Firefox only'
                                }
                            }
                        },
                        continue: {
                            next_step: 'Once you have the extension installed, hit "Install style" on the new tab that will open.'
                        },
                        finish: {
                            alert: 'All done! From now on, styling will be handled via Stylus.'
                        }
                    }
                },
                bug: {
                    name: 'Something wrong?',
                    bio: 'Report a bug in the bleh repo to get it fixed.'
                }
            },
            profiles: {
                name: 'Profile',
                bio: 'Manage your personal data and data stored on other profiles.',
                notes: {
                    name: 'Notes',
                    header: 'Note',
                    placeholder: 'Enter a local note for this user',
                    edit: 'Edit note',
                    delete: 'Remove note',
                    edit_user: 'Edit {u}\'s note',
                    delete_user: 'Remove {u}\'s note',
                    view: 'View your profile notes'
                },
                you: 'You',
                avatar_radius: {
                    name: 'User avatar shape'
                },
                api: {
                    name: 'API access',
                    bio: 'Enter a Last.fm API key to use new features, such as:',
                    features: [
                        {}
                    ],
                    placeholder: 'Enter API key',
                    saved: 'Saved your API key, testing..',
                    confirmed: 'Verified your API key, enjoy!',
                    inaccessible: 'Last.fm API is inaccessible',
                    invalid: 'That key seems invalid, are you sure?',
                    rate_limit: 'Your key is rate-limited for a short time'
                }
            },
            redirects: {
                name: 'Redirects',
                bio: 'Manage last.fm\'s (not) handy redirection system as best as possible.',
                travis: {
                    name: 'Hide redirect messages on music pages',
                    bio: 'No, I didn\'t mean Travi$ Scott'
                },
                autocorrect: {
                    name: 'Scrobble auto-correction',
                    bio: 'By default, last.fm will \'auto-correct\' some of your scrobbles using this system. This will make your scrobbles appear as <i>Travis Scott</i> rather than <i>Travi$ Scott</i>, however the redirection system is not fully disabled.',
                    action: 'Open Settings'
                }
            },
            corrections: {
                name: 'Corrections',
                bio: 'Manage capitalisation of artist, album, and track names with community contributions.',
                toggle: {
                    name: 'Enable the correction system'
                },
                view: {
                    name: 'View current corrections',
                    bio: 'Lists all active in your install'
                },
                formatting: 'Smart music titles',
                format_guest_features: {
                    name: 'Format guest features and song tags',
                    bio: 'Splits track and album titles into their individual tags such as guest features, versions, remixes.'
                },
                show_guest_features: {
                    name: 'Show featured artists in track title',
                    bio: 'Featured artists are always shown below the title regardless.'
                },
                stacked_chartlist_info: {
                    name: 'Stack track name and title',
                    bio: 'Both matches streaming services and increases max length of each.'
                },
                show_remaster_tags: {
                    name: 'Show remaster tags',
                    bio: 'Nobody likes remasters (or the tags), if you\'d prefer to still listen but remove the annoyance hide them!'
                },
                submit: {
                    name: 'Submit new correction',
                    bio: 'Have a name that you feel is capitalised wrong?',
                    action: 'Submit'
                },
                listing: {
                    artists: 'Artists',
                    albums_tracks: 'Albums and tracks'
                }
            },
            language: {
                name: 'Language',

                supported: 'Supported by bleh',
                by: 'by {users}',
                submit: {
                    name: 'Are you fluent in another language?',
                    bio: 'Translations are purely community-contributed.',
                    action: 'Submit translation'
                }
            },
            text: {
                name: 'Text',
                shout_preview_md: 'some <strong>completely</strong> random!<br>text that doesn\'t mean <a href="https://cutensilly.org">anything at all</a>',
                shout_preview: 'some completely random! text that doesn\'t mean anything at all',
                markdown: {
                    name: 'Use markdown formatting',
                    bio: 'Enables line-breaks, bold, italics, and links.',
                    shouts: 'In shouts',
                    profile: 'In profile bios'
                },
                font: {
                    name: 'Font settings',
                    placeholder: 'Font name(s), separated by commas'
                },
                font_weight: {
                    name: 'Font weight',
                    bio: 'Used for most regular text'
                },
                font_weight_medium: {
                    name: 'Medium font weight',
                    bio: 'Used for bold text'
                },
                font_weight_bold: {
                    name: 'Bold font weight',
                    bio: 'Used for larger text such as headers'
                },
                font_emoji: {
                    name: 'Use compatibility emoji font',
                    bio: 'On Windows systems prior to 11, the emoji font is majorly outdated unless this option is used. (such as 🏳️‍⚧️)'
                }
            },
            inbuilt: {
                profile: {
                    name: 'Profile',
                    subtitle: {
                        name: 'Subtitle',
                        aka: 'aka.',
                        pronouns: 'pronouns'
                    },
                    pronoun_tip: 'When pronouns are placed first, "aka." will change to "pronouns".',
                    country: 'Country',
                    website: 'Website',
                    about: 'About',
                    toggle_preview: {
                        name: 'Toggle preview',
                        bio: 'Preview how your bio looks to others',
                        note: 'For non-bleh users, multiple lines display as spaces and links, bold, italics will be plain text. Any images embedded will appear as manic text, so be aware.'
                    },
                    banner_tip: 'Images can be embedded using ![](link). You can also set a custom profile banner with ![banner](link).',
                    avatar: {
                        name: 'Edit avatar',
                        upload: 'Upload file',
                        delete: 'Delete avatar'
                    }
                },
                charts: {
                    name: 'Charts',
                    recent: {
                        count: {
                            name: 'Tracks to display'
                        },
                        artwork: {
                            name: 'Display album artwork'
                        },
                        realtime: {
                            name: 'Update tracks in realtime',
                            bio: 'Your recent tracks will refresh while you are on your profile.'
                        }
                    },
                    artists: {
                        timeframe: {
                            name: 'Default timeframe'
                        },
                        style: {
                            name: 'Chart style'
                        },
                        length: {
                            name: 'Chart size'
                        }
                    },
                    albums: {
                        timeframe: {
                            name: 'Default timeframe'
                        },
                        style: {
                            name: 'Chart style'
                        },
                        length: {
                            name: 'Chart size'
                        }
                    },
                    tracks: {
                        count: {
                            name: 'Tracks to display'
                        },
                        timeframe: {
                            name: 'Default timeframe'
                        }
                    }
                },
                ignore: {
                    name: 'Communication',
                    consider: {
                        name: 'To consider',
                        good: [
                            'You will not see previous or new shouts globally',
                            'They cannot direct message you',
                            'They cannot leave a shout on your profile or under your shouts anywhere'
                        ],
                        bad: [
                            'You cannot delete pre-existing shouts from your profile',
                            'They can still view your profile'
                        ]
                    },
                    view: 'View {c} more',
                    count: 'You have {c} users hidden'
                },
                privacy: {
                    name: 'Privacy',
                    recent_listening: {
                        name: 'Hide your recent listening history',
                        bio: 'Keep your recent listens a secret o.O'
                    },
                    receiving_msgs: {
                        name: 'Control who can interact with you',
                        bio: 'This setting controls who can post shouts and message you privately.',
                        settings: {
                            everyone: {
                                name: 'Everyone not hidden',
                                bio: 'Everyone except who you have ignored'
                            },
                            neighbours: {
                                name: 'Who you follow and neighbours',
                                bio: 'Everyone who you have chosen to follow, along with your Last.fm neighbours'
                            },
                            follow: {
                                name: 'Who you follow only',
                                bio: 'Only users who you have chosen to follow'
                            }
                        }
                    },
                    disable_shoutbox: {
                        name: 'Hide your shoutbox',
                        bio: 'Your shoutbox will be hidden for you and anyone else.'
                    }
                }
            },
            actions: {
                import: {
                    name: 'Import',
                    modals: {
                        initial: {
                            name: 'Import settings from a previous install',
                            alert: 'Anything you import will override your current settings, if you are importing settings from online ensure you trust the source.'
                        },
                        failed: {
                            name: 'Import failed',
                            alert: 'The settings you attempted to import failed to parse, no changes were made.'
                        }
                    }
                },
                export: {
                    name: 'Export',
                    modals: {
                        initial: {
                            name: 'Export your current settings',
                            alert: 'Your current settings are in the textbox below ready for you to copy.'
                        }
                    }
                },
                reset: {
                    name: 'Reset',
                    modals: {
                        initial: {
                            name: 'Reset your settings to default',
                            alert: 'Your settings will be <strong>reset to all defaults</strong> with no way to go back. Are you sure?',
                            confirm: 'Yes, reset my settings',
                            export: 'Export first'
                        }
                    }
                }
            }
        },
        shout: {
            name: 'Shout',
            sent: 'Sent!'
        },
        setup: {
            start: {
                name: 'hello {m}!!',
                thanks: 'Thank you for installing',
                info: [
                    'This is the first-time setup to help you get started with common tasks for new users, which include:',
                    'Manage accessibility, such as reduced motion',
                    'Configuring your accent colour',
                    'Changing your interface theme',
                    'Adjusting song corrections and tagging',
                    'If you\'re already set, you can skip.'
                ],
                pick_theme: 'Which theme would you prefer?',
                change_later: 'You can modify all your settings at any time.'
            },
            appearance: {
                name: 'Your colour',
                bio: 'Configure the colour of bleh from one of the available presets, or make your own colour combination!',
                subtext: 'During seasonal events, the default colour changes automatically.'
            },
            music: {
                change_later: 'More detailed options available in settings.'
            }
        },
        gallery: {
            tabs: {
                overview: 'All',
                bookmarks: 'Saved'
            },
            bookmarks: {
                name: 'Saved',
                bio: 'Gallery photos can be saved for future reference.',
                no_data: 'no images saved (・・ )',
                link: 'View all saved photos',
                button: {
                    image_is_bookmarked: {
                        name: 'You have saved this image'
                    },
                    bookmark_this_image: {
                        name: 'Save',
                        bio: 'Save this image for later'
                    },
                    unbookmark_this_image: {
                        name: 'Unsave',
                        bio: 'Unsave this image'
                    }
                }
            },
            empty: {
                title: 'No title',
                description: 'No description'
            },
            prefer: {
                name: 'Star'
            },
            report: {
                name: 'Report'
            },
            open: {
                name: 'Expand',
                tooltip: 'Expand image to full resolution'
            },
            up: 'Up votes:',
            down: 'Down votes:',
            vote: 'This is the sum of votes used for ordering.',
            view: 'View photos'
        },
        activities: {
            name: 'Recent Activity',

            test: 'TEST {involved}',
            shout: 'Shout',
            image_upload: 'Uploaded image',
            image_star: 'Starred image',
            obsess: 'Obsessed',
            unobsess: 'Removed obsession',
            love: 'Loved',
            unlove: 'Removed love',
            install_bwaa: 'Installed bwaa',
            update_bwaa: 'Updated bwaa',
            install_bleh: 'Installed bleh',
            update_bleh: 'Updated bleh',
            bookmark: 'Bookmarked',
            unbookmark: 'Removed bookmark',
            wiki: 'Edited wiki'
        },
        artist: {
            name: 'Artist',
            plural: 'Artists',
            tooltip: 'Multiple artists are combined into this profile.'
        },
        album: {
            name: 'Album',
            plural: 'Albums'
        },
        track: {
            name: 'Track',
            plural: 'Tracks'
        },
        tag: {
            name: 'Tag'
        },
        search: {
            name: 'Search',
            results_for: 'Results for {v}'
        },
        inbox: {
            name: 'Inbox',
            overview: 'Messages',
            sent_overview: 'Messages',
            compose: 'Messages',
            message_overview: 'Messages',
            sent_message: 'Messages',
            notifications: 'Notifications'
        },
        charts: {
            name: 'Charts',
            overview: 'Real time',
            weekly: 'Weekly',
            charts_for: 'Charts for {date}',
            view: 'View the charts',
            scroll: {
                name: 'Simulate horizontal scrolling',
                bio: 'Disable if you can scroll easily on a laptop for example.'
            }
        },
        bookmarks: {
            name: 'Bookmarks'
        },
        home: {
            name: 'Home',
            welcome: 'Welcome back {m}'
        },
        nag_bar: {
            corrections: {
                title: 'Redirected from'
            }
        }
    },
    de: {
        badges: {
            missing: {
                name: 'Kein Abzeichen'
            },
            'user-status-subscriber': {
                name: 'Last.fm Pro',
                reason: 'Aktives Pro Abonnement'
            },
            'user-status-staff': {
                name: 'Angestellter',
                reason: 'Angestellter von Last.fm'
            },
            'label--fade': {
                reason: '-'
            },
            contributor: {
                name: 'bleh Mitwirkender',
                reason: 'Hat bei bleh mitgewirkt über code oder übersetzungen'
            },
            translation: {
                reason: 'Hat für eine unterstützte Sprache übersetzt'
            },
            cat: {
                name: 'ein Kätzchen!!!'
            },
            sponsor: {
                name: 'Sponsor',
                reason: 'Hat bleh und bwaa gesponsert :3'
            },
            cute: {
                reason: 'Für besondere Nutzer reserviert'
            },
            reserved: {
                reason: 'Für bestimmte Nutzer reserviert'
            }
        },
        avatar_for_me: 'Dein Avatar',
        avatar_for_user: 'Avatar für ',
        actions: {
            view_profile: 'View profile',
            view_library: 'Library',
            leave_a_shout: 'Shouts'
        },
        lotus: {
            artist: 'Artist corrections have been downloaded!',
            album_track: 'Album and track corrections have been downloaded!',
            version: 'You are running lotus version {v}.',
            tooltip: 'lotus is the community correction system used in bleh and bwaa',
            check: 'Check for updates',
            correct: {
                name: 'Correct capitalisation',
                tooltip: 'Submit name correction',
                tooltip_active: 'Active name correction'
            }
        },
        glacier: {
            name: 'Library refresh',
            by_artist: ' von {a}',
            meta: {
                artists: 'Künstler',
                albums: 'Alben',
                tracks: 'Titel',
                average: 'Average'
            },
            view: {
                grid: 'Gitter',
                list: 'Liste',
                line: 'Liniendiagramm',
                pie: 'Kreis',
                bar: 'Balken'
            },
            axis: {
                horizontal: 'Horizontal',
                vertical: 'Vertikal'
            },
            dates: {
                last_year: 'Letztes Jahr',
                this_year: 'Dieses Jahr'
            },
            edit: 'Editieren',
            delete: 'Loeschen',
            love: 'Love',
            bulk_edit: 'Massenbearbeitung',
            option: {
                name: 'Use new graphs in library',
                bio: 'This can add a little amount of slow-down in some cases but with the benefit of awesome graphs.'
            }
        },
        changelog: {
            name: 'What’s New?',
            subtitle: 'from {u}',
            type: {
                major: 'Major release',
                minor: 'Minor release',
                general: 'General improvements',
                fix: 'Bug fix'
            },
            latest: 'Latest',
            view_major: 'View latest major release'
        },
        auth_menu: {
            dev: 'Toggle dev mode',
            configure_bleh: 'bleh konfigurieren',
            library: 'Bibliothek',
            shouts: 'Shouts',
            obsessions: 'Obsessionen',
            labs: 'Labor',
            bookmarks: 'Lesezeichen',
            settings: 'Einstellungen',
            logout: 'Ausloggen'
        },
        music: {
            submit_lastfm_correction: 'Submit correction to Last.fm',
            search_variations: {
                name: 'Search',
                tooltip: 'Search for variations of this title'
            },
            search_genius: 'Search lyrics',
            fetch_plays: {
                name: 'Titelliste',
                info: 'Sourced from your own plays as an official tracklist is unavailable',
                loading: 'Deine Wiedergaben auf diesem Album werden abgerufen',
                fail: 'Du hast keine Scrobbel auf diesem Album',
                open_as_track: 'Albumtitel als Titel öffnen'
            },
            from_the_album: 'Aus dem Album: {album}',
            listens: {
                count_listens: '{c} scrobbels',
                loading_listens: 'scrobbels',
                other_listeners: '{c} hörer',
                custom: {
                    tooltip: 'Pick a user',
                    name: 'View listens from another user'
                }
            },
            wiki: 'Über',
            wiki_edit: 'wiki editieren',
            wiki_read: 'mehr erfahren',
            refresh: 'Neu laden',
            refresh_tracks: 'Titel aktualisieren',
            menu: 'Extra options',
            obsession: 'Obsess',
            obsession_first: 'First to claim this obsession!',
            compare: {
                name: 'Compare',
                header: 'Compare plays'
            },
            about: 'About',
            about_guests: 'Others featured',
            view_profile: 'View profile'
        },
        error: {
            name: 'This page is missing...',
            go_back: 'Go back',
            visit_profile: 'Visit profile',
            try_again: 'Try again'
        },
        statistics: {
            scrobbles: {
                name: 'Deine Scrobbels'
            },
            plays: {
                name: 'scrobbels'
            }
        },
        profile: {
            name: 'Profil',
            on_ignore_list: 'Du stehst auf der Ignorierliste dieses Benutzers.',
            friends: {
                name: 'Freunde'
            },
            display_name: {
                aka: 'aka.',
                pronouns: 'pronomen'
            },
            created: {
                name: 'erstellt',

                replace: '• scrobbelt seit '
            },
            edit: 'Profil bearbeiten',
            obsess: 'Obsess',
            message: 'Anschreiben',
            shortcut: {
                add: 'Verknüpfung',
                remove: 'Verknüpfung'
            },
            scrobbles: 'Scrobbels',
            artists: 'Künstler',
            loved: 'Lieblingslieder',
            taste: 'Taste similarity',
            taste_meter: {
                level: {
                    super: 'Super',
                    very_high: 'Very High',
                    high: 'High',
                    medium: 'Medium',
                    low: 'Low',
                    very_low: 'Very Low',
                    unknown: 'Unknown'
                },
                you_share_1: 'Ihr hört beide {artist}',
                you_share_2: 'Ihr hört beide {artist1} und {artist2}',
                you_share_3: 'Ihr hört beide {artist1}, {artist2}, und {artist3}'
            },
            open_avatar: 'Im neuen Fenster öffnen',
            settings: 'Konfigurieren',
            events: 'Events',
            top_badge: 'Top-Abzeichen',
            progress: {
                to_go: 'Noch {s} scrobbels',
                tier: 'Stufe {t}',
                explain: 'Für jede Stufe schaltest du ein neues Abzeichen frei'
            }
        },
        event: {
            name: 'Event',
            going: '{c} going',
            maybe: '{c} interested',
            you_know: 'Who you know',
            all_time: 'All time',
            total: '{c} total'
        },
        messaging: {
            update: 'bleh wurde auf Version {v} aktualisiert!'
        },
        wiki: {
            latest: 'View latest version',
            syntax: {
                name: 'Use fancy syntax when editing',
                links_to: 'Links to {link}'
            },
            presets: {
                name: 'Symbol presets'
            }
        },
        settings: {
            name: 'Einstellungen',
            save: 'Speichern',
            cancel: 'Abbrechen',
            close: 'Schließen',
            clear: 'Leeren',
            create: 'Create',
            add: 'Add',
            remove: 'Remove',
            done: 'Fertig',
            finish: 'Beenden',
            continue: 'Fortsetzen',
            reset: 'Auf Werkseinstellung Zurücksetzen',
            go: 'Fortfahren',
            skip: 'Überspringen',
            back: 'Zurück',
            right_click: 'Right-click for more options',
            reload: {
                name: 'Refresh pending',
                body: 'Klicke zum Neuladen, um deine Einstellungen zu übernehmen.'
            },
            new: 'Neu',
            beta: 'Beta',
            configure: 'Konfigurieren',
            pages: {
                overview: 'Profil',
                privacy: 'Datenschutz',
                account_overview: 'Konto',
                website: 'Website',
                subscription_overview: 'Pro',
                applications_overview: 'Apps'
            },
            examples: {
                button: 'Beispiel-Taste'
            },
            skip_to: {
                name: 'Skip to'
            },
            home: {
                name: 'Startseite',
                brand: 'bleh',
                version: 'Version {v}',
                recommended: 'Empfohlene Einstellungen',
                issues: {
                    name: 'Probleme',
                    bio: 'Bugs reporten'
                },
                update: {
                    name: 'Aktualisierungen',
                    css: 'Stil aktualisieren',
                    bio: 'Jetzt prüfen',
                    notice: 'There are updates available!',
                    ignore: 'Ignore temporarily',

                    update_now: 'Update now',
                    update_to_v: 'Update to {v}'
                },
                setup: {
                    name: 'Setup',
                    bio: 'Re-enter setup'
                },
                colours: {
                    name: 'Farbe',
                    bio: 'Pick your favourite!'
                },
                thanks: 'Willkommen {m}, du verwendest bleh Version {v}.',
                sponsor: {
                    name: 'Sponsor',
                    header: 'Sponsor the development of bleh and bwaa',
                    bio: 'If you feel my work on these projects is worthy of donations you are welcome to sponsor me on GitHub. This is of course optional and bleh will forever be open-source and free.',
                    thanks: 'Thank you for sponsoring {m}, you are running bleh version {v}.',
                    status: {
                        yes: 'You are a sponsor, thank you!',
                        no: 'Become a sponsor to get a custom badge',
                        badge: 'To configure your custom badge, get in touch with me.',
                        one_time: 'A custom badge is available only when selecting monthly.'
                    },
                    manage: 'Manage sponsorship',
                    check: 'Refresh badges',
                    download: 'Sponsorship and badge data downloaded!',
                    version: 'You have version {v} of the sponsorship/badge data downloaded.'
                }
            },
            appearance: {
                name: 'Aussehen'
            },
            themes: {
                name: 'Farbschema',
                bio: 'Choose from light to midnight.',
                dark: {
                    name: 'Dunkel',
                    bio: 'The default flavour of bleh'
                },
                darker: {
                    name: 'Dunkler',
                    bio: 'The in-between'
                },
                oled: {
                    name: 'Mitternacht',
                    bio: 'Ultra blackout'
                },
                light: {
                    name: 'Hell',
                    bio: 'Low saturation and bright'
                },
                classic: {
                    name: 'Classic',
                    bio: 'Re-live early computing'
                }
            },
            music: {
                name: 'Musik',
                header: 'Musikkonfiguration',
                bio: 'Konfiguriere deine musikbezogene Einstellungen für Profile, Künstler, Alben und Titel.',
                profile_shortcut: {
                    name: 'Profilverknüpfung',
                    bio: 'Schnell auf die Wiedergaben eines Benutzers auf einer Künstler-, Album- oder Titelseite zugreifen.',
                    placeholder: 'Profil',
                    header: 'Benutzernamen eingeben',
                    saved: 'Die Profilverknüpfung ist gültig',
                    failed: 'Das Profil existiert nicht oder konnte nicht geladen werden.'
                },
                show_bulk_edit_album: {
                    name: 'Show album in chartlists',
                    bio: 'This is disabled by default as hovering over tracks reveals the album title in all areas',
                    require: 'Only applicable with the ‘Last.fm Bulk Edit’ extension'
                },
                grid_glow: {
                    name: 'Show a glow around grid items'
                }
            },
            accessibility: {
                name: 'Zugänglichkeit',
                shout_preview: 'some completely random text that doesn\'t mean <a href="https://cutensilly.org">anything at all</a>',
                accessible_name_colours: {
                    name: 'Zugängliche Namensfarben bevorzugen',
                    bio: 'Use the default header text colour over a accented text colour.'
                },
                underline_links: {
                    name: 'Links immer unterstreichen',
                    bio: 'Make links to interactables stand out.'
                },
                reduced_motion: {
                    name: 'Animationen reduzieren',
                    bio: 'Will in most cases either slowly fade or hard-cut, no scaling.'
                },
                toggle_icon: {
                    name: 'Add indicator icon to toggles',
                    bio: 'Display a checkmark or a cross depending on toggle state.'
                }
            },
            layout: {
                name: 'Layout',
                header: 'Manage header layout',
                avatar_action: {
                    name: 'Default avatar action',
                    bio: 'What do you want to happen when you click avatars?',
                    gallery: 'View photos (or featured album for tracks)',
                    album: 'View featured album'
                },
                quick_artist_button: {
                    name: 'Quick artist button',
                    bio: 'Control the right-side button on artist profiles.',
                    shouts: 'View shouts',
                    wiki: 'View biography',
                    listens: 'View listeners'
                }
            },
            customise: {
                name: 'Anpassen',
                colours: {
                    name: 'Farbe',
                    presets: 'Voreinstellungen',
                    manual: 'Anleitung',
                    custom: 'Erstelle eine eigene Farbe',
                    default_with_season: 'Standardfarbe für {season}',
                    default: 'Standardfarbe',
                    modals: {
                        custom_colour: {
                            preface: 'Farben werden durch drei Werte gesteuert: Farbton, Sättigung und Helligkeit. Probiere den Schieberegler aus, um ein Gefühl dafür zu bekommen.',
                            hue: 'Akzentfarbe',
                            sat: 'Sättigung',
                            lit: 'Helligkeit',
                            seasonal_alert: 'Die aktuelle Saison überschreibt deine Akzentfarbe. Passe den Schieberegler an, um sie zu deaktivieren.'
                        }
                    }
                },
                high_contrast: {
                    name: 'Enable high contrast mode'
                },
                seasonal: {
                    name: 'Saisonal',
                    timeline: 'Seasonal timeline',
                    bio: 'Während saisonaler Ereignisse kann bleh automatisch die Standardakzentfarbe ändern, Partikel hinzufügen und verschiedenen Schnittstellenelementen Overlays hinzufügen.',
                    info: 'Seasonal events try to match your timezone, for reference we calculated {offset}',
                    started: 'Gestartet',
                    ends_in: 'Endet in',
                    listing: {
                        none: 'No active season',
                        easter: 'Ostern',
                        pride: 'Pride',
                        halloween: 'Halloween',
                        pre_fall: 'Vorherbst',
                        fall: 'Herbst',
                        christmas: 'Weihnachten',
                        new_years: 'Silvester'
                    },
                    option: {
                        name: 'Saisonales Eventsystem aktivieren'
                    },
                    marker: {
                        current: 'Die aktuelle Saison ist {season} für {time}',
                        started: '{time} angefangen',
                        none: 'Derzeit gibt es keine aktive Saison.',
                        disabled: 'Saisons sind deaktiviert. Aktiviere diese, um die aktuelle Saison anzuzeigen.'
                    },
                    particles: {
                        name: 'Partikel während bestimmter Jahreszeiten anzeigen',
                        bio: 'Während der Wintersaison gibt es Schneeflocken!'
                    },
                    show_less_particles: {
                        name: 'Display a reduced number of particles'
                    },
                    fps_particles: {
                        name: 'Display particles without fancy effects',
                        bio: 'This might be more demanding on some systems'
                    },
                    overlays: {
                        name: 'Zusätzliche saisonale Effekte anzeigen',
                        bio: 'During winter seasons this is used for ice effects, otherwise mainly just gradients.'
                    },
                    announce: 'It is now {s}!',
                    nonsense: 'A Nonsense Christmas',
                    fruitcake: 'fruitcake',
                    mistletoe: 'Mistletoe',
                    festival: 'Christmas Eve',
                    exclusive_for_season: 'Exclusive for <span class="season-name">{season}</span>',
                    exclusive_for_season_and_more: 'Exclusive for <span class="season-name">{season}</span> and 1 more',
                    view: 'Open seasonal tab'
                },
                artwork: {
                    name: 'Cover'
                },
                hue_from_album: {
                    name: 'Albumseiten automatisch färben',
                    bio: 'Wählt die Primärfarbe eines Albumcovers aus, um die Seite zu bemalen.'
                },
                gloss: {
                    name: 'Gloss overlay',
                    bio: 'Apply flair to all cover arts.'
                },
                display: {
                    name: 'Anzeigeeinstellungen'
                },
                colourful_counts: {
                    name: 'Verwende einen Farbverlauf für die Allzeitdiagramme',
                    bio: 'Weist eine Farbe aus dem Farbverlauf zu, basierend auf der insgesamten Anzahl der Scrobbels für einen Künstler.'
                },
                colourful_tracks: {
                    name: 'Colour actively scrobbling tracks based on album art',
                    bio: 'Picks the primary colour from the associated cover to paint the track.'
                },
                gendered_tags: {
                    name: 'Geschlechtsspezifische Tags ausblenden',
                    bio: 'Geschlechtsspezifische Tags sind normalerweise überflüssig.'
                },
                rain: {
                    name: 'Let it rain!',
                    bio: 'rain :3c (may have performance impacts !! also may look bad !!)'
                },
                show_your_progress: {
                    name: 'Show your weekly progress',
                    bio: 'too many numbers ~w~'
                },
                profile_header: {
                    name: 'Profilhintergründe anzeigen',
                    see_type: 'Source from avatar instead of top artist',
                    view_on: 'View backgrounds on',
                    for_own: 'Auf meinem Profil',
                    for_others: 'Auf anderen Profilen'
                },
                sat_bg: {
                    name: 'Card background saturation',
                    bio: 'Control the colour of backgrounds in addition to main accent'
                }
            },
            activities: {
                name: 'Activities',
                bio: 'Track your most recent activities locally on your profile.',
                toggle: {
                    name: 'Enable activity tracking',
                    bio: 'Events will only be registered and displayed while enabled.'
                },
                types: {
                    shout: 'Shouts',
                    image: 'Image uploads and interactions',
                    obsess: 'Track obsessions',
                    love: 'Track love',
                    install: 'Installing and updating',
                    wiki: 'Wiki editing'
                }
            },
            performance: {
                name: 'Fehlerbehebung',
                bio: 'Running into noticeable issues in theme loading? Try out these settings.',
                dev: {
                    name: 'Disable in-built theme loading',
                    bio: 'This allows you to load the in-built theme via Stylus instead, which may be more performant.',
                    modals: {
                        prompt: {
                            alert: 'Once you refresh the page, the in-built bleh theme will be disabled (unless you disable this option again).',
                            stylus: 'If you do not already have the <strong>Stylus</strong> extension, choose your browser below:',
                            browsers: {
                                chrome: {
                                    name: 'Chrome',
                                    bio: 'for Chrome, Edge, Brave, Opera'
                                },
                                firefox: {
                                    name: 'Firefox',
                                    bio: 'for Firefox only'
                                }
                            }
                        },
                        continue: {
                            next_step: 'Once you have the extension installed, hit "Install style" on the new tab that will open.'
                        },
                        finish: {
                            alert: 'All done! From now on, styling will be handled via Stylus.'
                        }
                    }
                },
                bug: {
                    name: 'Something wrong?',
                    bio: 'Report a bug in the bleh repo to get it fixed.'
                }
            },
            profiles: {
                name: 'Profil',
                bio: 'Manage your personal data and data stored on other profiles.',
                notes: {
                    name: 'Notes',
                    header: 'Note',
                    placeholder: 'Enter a local note for this user',
                    edit: 'Edit note',
                    delete: 'Remove note',
                    edit_user: 'Edit {u}\'s note',
                    delete_user: 'Remove {u}\'s note',
                    view: 'View your profile notes'
                },
                you: 'You'
            },
            redirects: {
                name: 'Weiterleitungen',
                bio: 'Manage last.fm\'s (not) handy redirection system as best as possible.',
                travis: {
                    name: 'Hide redirect messages on music pages',
                    bio: 'No, I didn\'t mean Travi$ Scott'
                },
                autocorrect: {
                    name: 'Scrobble auto-correction',
                    bio: 'By default, last.fm will \'auto-correct\' some of your scrobbles using this system. This will make your scrobbles appear as <i>Travis Scott</i> rather than <i>Travi$ Scott</i>, however the redirection system is not fully disabled.',
                    action: 'Open Settings'
                }
            },
            corrections: {
                name: 'Korrekturen',
                bio: 'Verwalte das Korrektursystem von bleh für Künstler-, Album- und Titel.',
                toggle: {
                    name: 'Aktiviere das Korrektursystem'
                },
                view: {
                    name: 'Aktuelle Korrekturen anzeigen',
                    bio: 'Lists all active in your install'
                },
                formatting: 'Smarte Musiktitel',
                format_guest_features: {
                    name: 'Formatiere Features und Song-Tags',
                    bio: 'Teilt Titel und Albentitel in einzelne Tags auf, beispielsweise Features, Versionen, Remixe.'
                },
                show_guest_features: {
                    name: 'Features im Titel und Künstler anzeigen',
                    bio: 'Durch deaktivieren werden sie von Titeln entfernt und das Künstlerfeld wird bevorzugt.'
                },
                stacked_chartlist_info: {
                    name: 'Name und Titel stapeln',
                    bio: 'Beide passen sich an den Streaming-Diensten an und erhöht die Länge dieser.'
                },
                show_remaster_tags: {
                    name: 'Remaster-Tags anzeigen',
                    bio: 'Nobody likes remasters (or the tags), if you\'d prefer to still listen but remove the annoyance hide them!'
                },
                submit: {
                    name: 'Neue Korrektur einreichen',
                    bio: 'Have a name that you feel is capitalised wrong?',
                    action: 'Submit'
                },
                listing: {
                    artists: 'Künstler',
                    albums_tracks: 'Alben und Titel'
                }
            },
            language: {
                name: 'Sprache',
                supported: 'Unterstützt von bleh',
                by: 'von {users}',
                submit: {
                    name: 'Sprichst du fließend eine andere Sprache?',
                    bio: 'Übersetzungen werden ausschließlich von der Community beigesteuert.',
                    action: 'Übersetzung einreichen'
                }
            },
            text: {
                name: 'Text',
                shout_preview_md: 'some <strong>completely</strong> random!<br>text that doesn\'t mean <a href="https://cutensilly.org">anything at all</a>',
                shout_preview: 'some completely random! text that doesn\'t mean anything at all',
                markdown: {
                    name: 'Markdown-Formatierung verwenden',
                    bio: 'Aktiviert Zeilenumbrüche, Fettdruck, Kursivschrift und Links.',
                    shouts: 'In Shouts',
                    profile: 'In Profilbiografien'
                },
                font: {
                    name: 'Font settings',
                    placeholder: 'Font name(s), separated by commas'
                },
                font_weight: {
                    name: 'Font weight',
                    bio: 'Used for most regular text'
                },
                font_weight_medium: {
                    name: 'Medium font weight',
                    bio: 'Used for bold text'
                },
                font_weight_bold: {
                    name: 'Bold font weight',
                    bio: 'Used for larger text such as headers'
                },
                font_emoji: {
                    name: 'Use compatibility emoji font',
                    bio: 'On Windows systems prior to 11, the emoji font is majorly outdated unless this option is used. (such as 🏳️‍⚧️)'
                }
            },
            inbuilt: {
                profile: {
                    name: 'Profil',
                    subtitle: {
                        name: 'Untertitel'
                    },
                    pronoun_tip: 'Wenn Pronomen an den Anfang gestellt werden, ändert sich „aka.“ in „Pronomen“.',
                    country: 'Land',
                    website: 'Website',
                    about: 'Über mich',
                    toggle_preview: {
                        name: 'Vorschau umschalten',
                        bio: 'Vorschau deiner biographie für andere',
                        note: 'Für nicht bleh Benutzer, mehrere Zeilen werden als Leerzeichen und Links angezeigt, Fett- und Kursivschrift wird als einfacher Text angezeigt. Jegliche eingelegte Bilder werden als Text angezeigt.'
                    },
                    banner_tip: 'Bilder können mithilfe von ![](link) eingelegt werden. Du kannst auch ein benutzerdefiniertes Banner mithilfe von ![banner](link) festlegen.',
                    avatar: {
                        name: 'Profilbild bearbeiten',
                        upload: 'Datei hochladen',
                        delete: 'Profilbild löschen'
                    }
                },
                charts: {
                    name: 'Charts',
                    recent: {
                        count: {
                            name: 'Tracks to display'
                        },
                        artwork: {
                            name: 'Display album artwork'
                        },
                        realtime: {
                            name: 'Update tracks in realtime',
                            bio: 'Your recent tracks will refresh while you are on your profile.'
                        }
                    },
                    artists: {
                        timeframe: {
                            name: 'Default timeframe'
                        },
                        style: {
                            name: 'Chart style'
                        },
                        length: {
                            name: 'Chart size'
                        }
                    },
                    albums: {
                        timeframe: {
                            name: 'Default timeframe'
                        },
                        style: {
                            name: 'Chart style'
                        },
                        length: {
                            name: 'Chart size'
                        }
                    },
                    tracks: {
                        count: {
                            name: 'Tracks to display'
                        },
                        timeframe: {
                            name: 'Default timeframe'
                        }
                    }
                },
                ignore: {
                    name: 'Communication',
                    consider: {
                        name: 'To consider',
                        good: [
                            'You will not see previous or new shouts globally',
                            'They cannot direct message you',
                            'They cannot leave a shout on your profile or under your shouts anywhere'
                        ],
                        bad: [
                            'You cannot delete pre-existing shouts from your profile',
                            'They can still view your profile'
                        ]
                    },
                    view: 'View {c} more',
                    count: 'You have {c} users hidden'
                },
                privacy: {
                    name: 'Datenschutz',
                    recent_listening: {
                        name: 'Hide your recent listening history',
                        bio: 'Keep your recent listens a secret o.O'
                    },
                    receiving_msgs: {
                        name: 'Control who can interact with you',
                        bio: 'This setting controls who can post shouts and message you privately.',
                        settings: {
                            everyone: {
                                name: 'Everyone',
                                bio: 'Everyone except who you have ignored'
                            },
                            neighbours: {
                                name: 'Who you follow and neighbours',
                                bio: 'Everyone who you have chosen to follow, along with your Last.fm neighbours'
                            },
                            follow: {
                                name: 'Who you follow only',
                                bio: 'Only users who you have chosen to follow'
                            }
                        }
                    },
                    disable_shoutbox: {
                        name: 'Hide your shoutbox',
                        bio: 'Your shoutbox will be hidden for you and anyone else.'
                    }
                }
            },
            actions: {
                import: {
                    name: 'Import',
                    modals: {
                        initial: {
                            name: 'Import settings from a previous install',
                            alert: 'Anything you import will override your current settings, if you are importing settings from online ensure you trust the source.'
                        },
                        failed: {
                            name: 'Import failed',
                            alert: 'The settings you attempted to import failed to parse, no changes were made.'
                        }
                    }
                },
                export: {
                    name: 'Export',
                    modals: {
                        initial: {
                            name: 'Export your current settings',
                            alert: 'Your current settings are in the textbox below ready for you to copy.'
                        }
                    }
                },
                reset: {
                    name: 'Zurücksetzen',
                    modals: {
                        initial: {
                            name: 'Reset your settings to default',
                            alert: 'Your settings will be <strong>reset to all defaults</strong> with no way to go back. Are you sure?',
                            confirm: 'Yes, reset my settings',
                            export: 'Export first'
                        }
                    }
                }
            }
        },
        setup: {
            start: {
                name: 'haiii :3 welcome to bleh!!',
                thanks: 'Thank you for installing, {m}',
                info: [
                    'This is the first-time setup to help you get started with common tasks for new users, which include:',
                    'Manage accessibility, such as reduced motion',
                    'Configuring your accent colour',
                    'Changing your interface theme',
                    'Adjusting song corrections and tagging',
                    'If you\'re already set, you can skip.'
                ]
            },
            appearance: {
                bio: 'Configure the colour of bleh from one of the available presets, or make your own colour combination!',
                subtext: 'During seasonal events, the default colour changes automatically.'
            }
        },
        gallery: {
            tabs: {
                overview: 'Fotos',
                bookmarks: 'Saved'
            },
            bookmarks: {
                name: 'Saved',
                bio: 'Gallery photos can be saved for future reference.',
                no_data: 'no images saved (・・ )',
                link: 'Alle favorisierten Bilder ansehen',
                button: {
                    image_is_bookmarked: {
                        name: 'You have saved this image'
                    },
                    bookmark_this_image: {
                        name: 'Speichern',
                        bio: 'Dieses Bild speichern'
                    },
                    unbookmark_this_image: {
                        name: 'Unsave',
                        bio: 'Dieses Bild nicht mehr speichern'
                    }
                }
            },
            empty: {
                title: 'No title',
                description: 'No description'
            },
            prefer: {
                name: 'Star'
            },
            report: {
                name: 'Melden'
            },
            open: {
                name: 'Vergrößern',
                tooltip: 'Dieses Bild auf gesamter Auflösung vergrößern'
            },
            up: 'Plusstimmen:',
            down: 'Minusstimmen:',
            vote: 'This is the sum of votes used for ordering.',
            view: 'Fotos anzeigen'
        },
        activities: {
            name: 'Kürzliche Aktivitäten',

            test: 'TEST {involved}',
            shout: 'Shout hinterlassen',
            image_upload: 'Bild hochgeladen',
            image_star: 'Bild favorisiert',
            obsess: 'Obsessed',
            unobsess: 'Nicht mehr obsessed',
            love: 'Liebst',
            unlove: 'Liebst nicht mehr',
            install_bwaa: 'bwaa installiert',
            update_bwaa: 'bwaa aktualisiert',
            install_bleh: 'bleh installiert',
            update_bleh: 'bleh aktualisiert',
            bookmark: 'Lesezeichen hinzugefügt',
            unbookmark: 'Lesezeichen entfernt',
            wiki: 'Wiki editiert'
        },
        artist: {
            name: 'Künstler',
            plural: 'Künstler',
            tooltip: 'Multiple artists are combined into this profile.'
        },
        album: {
            name: 'Album',
            plural: 'Alben'
        },
        track: {
            name: 'Titel',
            plural: 'Titel'
        },
        tag: {
            name: 'Tag'
        },
        search: {
            name: 'Suche',
            results_for: 'Results for {v}'
        },
        inbox: {
            name: 'Inbox',
            overview: 'Messages',
            sent_overview: 'Messages',
            compose: 'Messages',
            message_overview: 'Messages',
            sent_message: 'Messages',
            notifications: 'Notifications'
        },
        charts: {
            name: 'Charts',
            overview: 'Real time',
            weekly: 'Weekly',
            charts_for: 'Charts for {date}',
            view: 'View the charts',
            scroll: {
                name: 'Simulate horizontal scrolling',
                bio: 'Disable if you can scroll easily on a laptop for example.'
            }
        },
        bookmarks: {
            name: 'Bookmarks'
        },
        home: {
            name: 'Home',
            welcome: 'Welcome back {m}'
        }
    },
    pl: {
        badges: {
            missing: {
                name: 'No badges'
            },
            'user-status-subscriber': {
                name: 'Last.fm Pro',
                reason: 'Active Pro subscription'
            },
            'user-status-staff': {
                name: 'Staff',
                reason: 'Staff member of Last.fm'
            },
            'label--fade': {
                reason: 'They follow you'
            },
            contributor: {
                name: 'bleh contributor',
                reason: 'Contributed to bleh via code or translations'
            },
            translation: {
                reason: 'Translated for a supported language'
            },
            cat: {
                name: 'it\'s a kitty!!'
            },
            sponsor: {
                name: 'Sponsoring',
                reason: 'Sponsored bleh and bwaa :3'
            },
            cute: {
                reason: 'Reserved for special users'
            },
            reserved: {
                reason: 'Reserved for certain users'
            }
        },
        avatar_for_me: 'Your avatar',
        avatar_for_user: 'Avatar for ',
        actions: {
            view_profile: 'View profile',
            view_library: 'Library',
            leave_a_shout: 'Shouts'
        },
        lotus: {
            artist: 'Artist corrections have been downloaded!',
            album_track: 'Album and track corrections have been downloaded!',
            version: 'You are running lotus version {v}.',
            tooltip: 'lotus is the community correction system used in bleh and bwaa',
            check: 'Check for updates',
            correct: {
                name: 'Correct capitalisation',
                tooltip: 'Submit name correction',
                tooltip_active: 'Active name correction'
            }
        },
        glacier: {
            name: 'Library refresh',
            by_artist: ' by {a}',
            meta: {
                artists: 'Artists',
                albums: 'Albums',
                tracks: 'Tracks',
                average: 'Average'
            },
            view: {
                grid: 'Grid',
                list: 'List',
                line: 'Line',
                pie: 'Pie',
                bar: 'Bar'
            },
            axis: {
                horizontal: 'Horizontal',
                vertical: 'Vertical'
            },
            dates: {
                last_year: 'Last year',
                this_year: 'This year'
            },
            edit: 'Edit',
            delete: 'Delete',
            love: 'Love',
            bulk_edit: 'Bulk edit',
            option: {
                name: 'Use new graphs in library',
                bio: 'This can add a little amount of slow-down in some cases but with the benefit of awesome graphs.'
            }
        },
        changelog: {
            name: 'What’s New?',
            subtitle: 'from {u}',
            type: {
                major: 'Major release',
                minor: 'Minor release',
                general: 'General improvements',
                fix: 'Bug fix'
            },
            latest: 'Latest',
            view_major: 'View latest major release'
        },
        auth_menu: {
            dev: 'Przełącz tryb deweloperski',
            configure_bleh: 'Skonfiguruj bleh',
            library: 'Library',
            shouts: 'Wiadomości',
            obsessions: 'Obsessions',
            labs: 'Labs',
            bookmarks: 'Bookmarks',
            settings: 'Settings',
            logout: 'Logout'
        },
        music: {
            submit_lastfm_correction: 'Submit correction to Last.fm',
            search_variations: {
                name: 'Search',
                tooltip: 'Search for variations of this title'
            },
            search_genius: 'Search lyrics',
            fetch_plays: {
                name: 'Tracklist',
                info: 'Sourced from your own plays as an official tracklist is unavailable',
                loading: 'Fetching your plays on this album',
                fail: 'You do not have any plays on this album',
                open_as_track: 'Open album title as a track'
            },
            from_the_album: 'From the album: {album}',
            listens: {
                count_listens: '{c} listens',
                loading_listens: 'listens',
                other_listeners: '{c} others',
                custom: {
                    tooltip: 'Pick a user',
                    name: 'View listens from another user'
                }
            },
            wiki: 'About',
            wiki_edit: 'edit wiki',
            wiki_read: 'read more',
            refresh: 'Refresh',
            refresh_tracks: 'Refresh tracks',
            menu: 'Extra options',
            obsession: 'Obsess',
            obsession_first: 'First to claim this obsession!',
            compare: {
                name: 'Compare',
                header: 'Compare plays'
            },
            about: 'About',
            about_guests: 'Others featured',
            view_profile: 'View profile'
        },
        error: {
            name: 'This page is missing...',
            go_back: 'Go back',
            visit_profile: 'Visit profile',
            try_again: 'Try again'
        },
        statistics: {
            scrobbles: {
                name: 'Twoje scrobble'
            },
            plays: {
                name: 'odtworzeń'
            }
        },
        profile: {
            name: 'Profile',
            on_ignore_list: 'Jesteś na liście ignorowanych tego użytkownika.',
            friends: {
                name: 'Friends'
            },
            display_name: {
                aka: 'aka.',
                pronouns: 'pronouns'
            },
            created: {
                name: 'created',

                replace: '• scrobbling since '
            },
            edit: 'Edit profile',
            obsess: 'Obsess',
            message: 'Private message',
            shortcut: {
                add: 'Add as shortcut',
                remove: 'Your profiles are linked!'
            },
            scrobbles: 'Scrobbles',
            artists: 'Artists',
            loved: 'Loved tracks',
            taste: 'Taste similarity',
            taste_meter: {
                level: {
                    super: 'Super',
                    very_high: 'Very High',
                    high: 'High',
                    medium: 'Medium',
                    low: 'Low',
                    very_low: 'Very Low',
                    unknown: 'Unknown'
                },
                you_share_1: 'You share {artist}',
                you_share_2: 'You share {artist1} and {artist2}',
                you_share_3: 'You share {artist1}, {artist2}, and {artist3}'
            },
            open_avatar: 'Open in a new tab',
            settings: 'Configure',
            events: 'Events',
            top_badge: 'Top Badge',
            progress: {
                to_go: '{s} scrobbles to go',
                tier: 'Tier {t}',
                explain: 'For each tier, you unlock a new badge'
            }
        },
        event: {
            name: 'Event',
            going: '{c} going',
            maybe: '{c} interested',
            you_know: 'Who you know',
            all_time: 'All time',
            total: '{c} total'
        },
        messaging: {
            update: 'bleh has updated to version {v}!'
        },
        wiki: {
            latest: 'View latest version',
            syntax: {
                name: 'Use fancy syntax when editing',
                links_to: 'Links to {link}'
            },
            presets: {
                name: 'Symbol presets'
            }
        },
        settings: {
            name: 'Settings',
            save: 'Zapisz',
            cancel: 'Anuluj',
            close: 'Zamknij',
            clear: 'Wyczyść',
            create: 'Create',
            add: 'Add',
            remove: 'Remove',
            done: 'Gotowe',
            finish: 'Finish',
            continue: 'Kontynuuj',
            reset: 'Przywróć domyślne',
            go: 'Go',
            skip: 'Skip',
            back: 'Back',
            right_click: 'Right-click for more options',
            reload: {
                name: 'Refresh pending',
                body: 'A setting you changed requires a page refresh to take effect.'
            },
            new: 'New',
            beta: 'Beta',
            configure: 'Configure',
            pages: {
                overview: 'Profile',
                privacy: 'Privacy',
                account_overview: 'Account',
                website: 'Website',
                subscription_overview: 'Pro',
                applications_overview: 'Applications'
            },
            examples: {
                button: 'Przycisk przykładowy'
            },
            skip_to: {
                name: 'Skip to'
            },
            home: {
                name: 'Strona główna',
                brand: 'bleh',
                version: 'Wersja {v}',
                recommended: 'Zalecane ustawienia',
                issues: {
                    name: 'Problemy',
                    bio: 'Zgłoś błędy'
                },
                update: {
                    name: 'Updates',
                    css: 'Update style',
                    bio: 'Check now',
                    notice: 'There are updates available!',
                    ignore: 'Ignore temporarily',

                    update_now: 'Update now',
                    update_to_v: 'Update to {v}'
                },
                setup: {
                    name: 'Setup',
                    bio: 'Re-enter setup'
                },
                colours: {
                    name: 'Kolory',
                    bio: 'Wybierz swój ulubiony!'
                },
                thanks: 'Welcome {m}, you are running bleh version {v}.',
                sponsor: {
                    name: 'Sponsor',
                    header: 'Sponsor the development of bleh and bwaa',
                    bio: 'If you feel my work on these projects is worthy of donations you are welcome to sponsor me on GitHub. This is of course optional and bleh will forever be open-source and free.',
                    thanks: 'Thank you for sponsoring {m}, you are running bleh version {v}.',
                    status: {
                        yes: 'You are a sponsor, thank you!',
                        no: 'Become a sponsor to get a custom badge',
                        badge: 'To configure your custom badge, get in touch with me.',
                        one_time: 'A custom badge is available only when selecting monthly.'
                    },
                    manage: 'Manage sponsorship',
                    check: 'Refresh badges',
                    download: 'Sponsorship and badge data downloaded!',
                    version: 'You have version {v} of the sponsorship/badge data downloaded.'
                }
            },
            appearance: {
                name: 'Appearance'
            },
            themes: {
                name: 'Motywy',
                bio: 'Wybierz od jasnego do ciemnego.',
                dark: {
                    name: 'Ciemny',
                    bio: 'Domyślna wersja bleh'
                },
                darker: {
                    name: 'Ciemniejszy',
                    bio: 'Coś pomiędzy'
                },
                oled: {
                    name: 'Północny',
                    bio: 'Całkowita ciemność'
                },
                light: {
                    name: 'Jasny',
                    bio: 'Mało koloru i dużo światła'
                },
                classic: {
                    name: 'Classic',
                    bio: 'Re-live early computing'
                }
            },
            music: {
                name: 'Music',
                header: 'Music configuration',
                bio: 'Configure your music-related settings for profiles, artists, albums, and tracks.',
                profile_shortcut: {
                    name: 'Profile shortcut',
                    bio: 'Quickly access a user\'s plays on an artist, album, or track page.',
                    placeholder: 'Profile',
                    header: 'Enter username',
                    saved: 'Profile shortcut is valid',
                    failed: 'Profile does not exist or failed to load'
                },
                show_bulk_edit_album: {
                    name: 'Show album in chartlists',
                    bio: 'This is disabled by default as hovering over tracks reveals the album title in all areas',
                    require: 'Only applicable with the ‘Last.fm Bulk Edit’ extension'
                },
                grid_glow: {
                    name: 'Show a glow around grid items'
                }
            },
            accessibility: {
                name: 'Accessibility',
                shout_preview: 'jakikolwiek losowy tekst, który <a href="https://cutensilly.org">nic nie znaczy</a>',
                accessible_name_colours: {
                    name: 'Preferowane kolory dostępnej nazwy',
                    bio: 'Użyj domyślnego koloru tekstu nagłówka zamiast koloru akcentowego.'
                },
                underline_links: {
                    name: 'Zawsze podkreślaj linki',
                    bio: 'Podkreślaj linki do elementów interaktywnych.'
                },
                reduced_motion: {
                    name: 'Reduce animations around interfaces',
                    bio: 'Will in most cases either slowly fade or hard-cut, no scaling.'
                },
                toggle_icon: {
                    name: 'Add indicator icon to toggles',
                    bio: 'Display a checkmark or a cross depending on toggle state.'
                }
            },
            layout: {
                name: 'Layout',
                header: 'Manage header layout',
                avatar_action: {
                    name: 'Default avatar action',
                    bio: 'What do you want to happen when you click avatars?',
                    gallery: 'View photos (or featured album for tracks)',
                    album: 'View featured album'
                },
                quick_artist_button: {
                    name: 'Quick artist button',
                    bio: 'Control the right-side button on artist profiles.',
                    shouts: 'View shouts',
                    wiki: 'View biography',
                    listens: 'View listeners'
                }
            },
            customise: {
                name: 'Dostosuj',
                colours: {
                    name: 'Kolory',
                    presets: 'Ustawienia wstępne',
                    manual: 'Ręcznie',
                    custom: 'Stwórz niestandardowy kolor',
                    default_with_season: 'Default colour for {season}',
                    default: 'Default colour',
                    modals: {
                        custom_colour: {
                            preface: 'Kolory są kontrolowane przez trzy wartości: odcień (hue), nasycenie (saturation) i jasność (lightness). Przesuń suwaki, aby dostosować kolor.',
                            hue: 'Kolor akcentu (hue)',
                            sat: 'Nasycenie (saturation)',
                            lit: 'Jasność (lightness)',
                            seasonal_alert: 'The current season is overriding your accent colour, adjust sliders to disable.'
                        }
                    }
                },
                high_contrast: {
                    name: 'Enable high contrast mode'
                },
                seasonal: {
                    name: 'Seasonal',
                    timeline: 'Seasonal timeline',
                    bio: 'During seasonal events, bleh can automatically change the default accent colour, add particles, and add overlays to various interface elements.',
                    info: 'Seasonal events try to match your timezone, for reference we calculated {offset}',
                    started: 'Started',
                    ends_in: 'Ends in',
                    listing: {
                        none: 'No active season',
                        easter: 'Easter',
                        pride: 'Pride',
                        halloween: 'Halloween',
                        pre_fall: 'Pre-Fall',
                        fall: 'Fall',
                        christmas: 'Christmas',
                        new_years: 'New Years'
                    },
                    option: {
                        name: 'Enable seasonal event system'
                    },
                    marker: {
                        current: 'The current season is {season} for {time}.',
                        started: 'started {time}',
                        none: 'There is no active season currently.',
                        disabled: 'You have seasons disabled, enable to view current event.'
                    },
                    particles: {
                        name: 'Display particles during select seasons',
                        bio: 'During winter seasons you get snowflakes!'
                    },
                    show_less_particles: {
                        name: 'Display a reduced number of particles'
                    },
                    fps_particles: {
                        name: 'Display particles without fancy effects',
                        bio: 'This might be more demanding on some systems'
                    },
                    overlays: {
                        name: 'Display additional seasonal effects',
                        bio: 'During winter seasons this is used for ice effects, otherwise mainly just gradients.'
                    },
                    announce: 'It is now {s}!',
                    nonsense: 'A Nonsense Christmas',
                    fruitcake: 'fruitcake',
                    mistletoe: 'Mistletoe',
                    festival: 'Christmas Eve',
                    exclusive_for_season: 'Exclusive for <span class="season-name">{season}</span>',
                    exclusive_for_season_and_more: 'Exclusive for <span class="season-name">{season}</span> and 1 more',
                    view: 'Open seasonal tab'
                },
                artwork: {
                    name: 'Okładka'
                },
                hue_from_album: {
                    name: 'Automatically colour album pages',
                    bio: 'Picks the primary colour from an album cover to paint the page.'
                },
                gloss: {
                    name: 'Nakładka błyszcząca',
                    bio: 'Dodaj odblasku do wszystkich okładek.'
                },
                display: {
                    name: 'Wyświetlacz'
                },
                colourful_counts: {
                    name: 'Użyj gradientu kolorów dla wszystkich czasów rankingów',
                    bio: 'Kolor jest przypisywany na podstawie twojej pozycji w wszechczasowych statystykach artystów.'
                },
                colourful_tracks: {
                    name: 'Colour actively scrobbling tracks based on album art',
                    bio: 'Picks the primary colour from the associated cover to paint the track.'
                },
                gendered_tags: {
                    name: 'Ukryj tagi związane z płcią',
                    bio: 'Domyślnie tagi związane z płcią są ukryte w bleh ze względu na ich nieuporządkowaną i problematyczną nature.'
                },
                rain: {
                    name: 'Niech pada!',
                    bio: 'deszcz :3c (może wpływać na wydajność!! może też wyglądać źle!!)'
                },
                show_your_progress: {
                    name: 'Show your weekly progress',
                    bio: 'too many numbers ~w~'
                },
                profile_header: {
                    name: 'Display profile backgrounds',
                    see_type: 'Source from avatar instead of top artist',
                    view_on: 'View backgrounds on',
                    for_own: 'My own profile',
                    for_others: 'Other profiles'
                },
                sat_bg: {
                    name: 'Card background saturation',
                    bio: 'Control the colour of backgrounds in addition to main accent'
                }
            },
            activities: {
                name: 'Activities',
                bio: 'Track your most recent activities locally on your profile.',
                toggle: {
                    name: 'Enable activity tracking',
                    bio: 'Events will only be registered and displayed while enabled.'
                },
                types: {
                    shout: 'Shouts',
                    image: 'Image uploads and interactions',
                    obsess: 'Track obsessions',
                    love: 'Track love',
                    install: 'Installing and updating',
                    wiki: 'Wiki editing'
                }
            },
            performance: {
                name: 'Wydajność',
                bio: 'Napotykasz problemy z ładowaniem motywu? Wypróbuj te ustawienia.',
                dev: {
                    name: 'Wyłącz wbudowane ładowanie motywu',
                    bio: 'Pozwala to na ładowanie wbudowanego motywu za pomocą rozszerzenia Stylus, co może być bardziej wydajne.',
                    modals: {
                        prompt: {
                            alert: 'Po odświeżeniu strony wbudowany motyw bleh zostanie wyłączony (chyba że ponownie wyłączysz tę opcję).',
                            stylus: 'Jeśli nie masz jeszcze rozszerzenia <strong>Stylus</strong>, wybierz swoją przeglądarkę poniżej:',
                            browsers: {
                                chrome: {
                                    name: 'Chrome',
                                    bio: 'dla Chrome, Edge, Brave, Opera'
                                },
                                firefox: {
                                    name: 'Firefox',
                                    bio: 'tylko dla Firefox'
                                }
                            }
                        },
                        continue: {
                            next_step: 'Gdy już zainstalujesz rozszerzenie, kliknij "Zainstaluj styl" na nowej karcie, która się otworzy.'
                        },
                        finish: {
                            alert: 'Gotowe! Od teraz motyw będzie obsługiwany za pomocą Stylus.'
                        }
                    }
                },
                bug: {
                    name: 'Something wrong?',
                    bio: 'Report a bug in the bleh repo to get it fixed.'
                }
            },
            profiles: {
                name: 'Profil',
                bio: 'Zarządzaj swoimi danymi i danymi zapisanych na innych profilach.',
                notes: {
                    name: 'Notatki',
                    header: 'Notatka',
                    placeholder: 'Wprowadź lokalną notatkę dla tego użytkownika',
                    edit: 'Edytuj notatkę',
                    delete: 'Usuń notatkę',
                    edit_user: 'Edytuj notatkę dla {u}',
                    delete_user: 'Usuń notatkę dla {u}'
                },
                you: 'You'
            },
            redirects: {
                name: 'Redirects',
                bio: 'Manage last.fm\'s (not) handy redirection system as best as possible.',
                travis: {
                    name: 'Hide redirect messages on music pages',
                    bio: 'No, I didn\'t mean Travi$ Scott'
                },
                autocorrect: {
                    name: 'Scrobble auto-correction',
                    bio: 'By default, last.fm will \'auto-correct\' some of your scrobbles using this system. This will make your scrobbles appear as <i>Travis Scott</i> rather than <i>Travi$ Scott</i>, however the redirection system is not fully disabled.',
                    action: 'Open Settings'
                }
            },
            corrections: {
                name: 'Corrections',
                bio: 'Manage bleh\'s in-built correction system for artist, album, and track titles.',
                toggle: {
                    name: 'Enable the correction system'
                },
                view: {
                    name: 'View current corrections',
                    bio: 'Lists all active in your install'
                },
                formatting: 'Smart music titles',
                format_guest_features: {
                    name: 'Formatuj występy i tagi utworów',
                    bio: 'Mniej eksponuje występy i tagi utworów (np. Remix, Deluxe Edition, itp.)'
                },
                show_guest_features: {
                    name: 'Display guest features in title and artist',
                    bio: 'Turning off will remove from title and prefer artist field.'
                },
                stacked_chartlist_info: {
                    name: 'Stack track name and title',
                    bio: 'Both matches streaming services and increases max length of each.'
                },
                show_remaster_tags: {
                    name: 'Show remaster tags',
                    bio: 'Nobody likes remasters (or the tags), if you\'d prefer to still listen but remove the annoyance hide them!'
                },
                submit: {
                    name: 'Submit new correction',
                    bio: 'Have an artist, album, or track name that you feel is capitalised wrong?',
                    action: 'Submit'
                },
                listing: {
                    artists: 'Artists',
                    albums_tracks: 'Albums and tracks'
                }
            },
            language: {
                name: 'Language',
                supported: 'Supported by bleh',
                by: 'by {users}',
                submit: {
                    name: 'Are you fluent in another language?',
                    bio: 'Translations are purely community-contributed.',
                    action: 'Submit translation'
                }
            },
            text: {
                name: 'Text',
                shout_preview_md: 'jakikolwiek <strong>losowy</strong> tekst,<br>który <a href="https://cutensilly.org">nic nie znaczy</a>',
                shout_preview: 'jakikolwiek losowy tekst, który nic nie znaczy',
                markdown: {
                    name: 'Use markdown formatting',
                    bio: 'Enables line-breaks, bold, italics, and links.',
                    shouts: 'In shouts',
                    profile: 'In profile bios'
                },
                font: {
                    name: 'Font settings',
                    placeholder: 'Font name(s), separated by commas'
                },
                font_weight: {
                    name: 'Font weight',
                    bio: 'Used for most regular text'
                },
                font_weight_medium: {
                    name: 'Medium font weight',
                    bio: 'Used for bold text'
                },
                font_weight_bold: {
                    name: 'Bold font weight',
                    bio: 'Used for larger text such as headers'
                },
                font_emoji: {
                    name: 'Use compatibility emoji font',
                    bio: 'On Windows systems prior to 11, the emoji font is majorly outdated unless this option is used. (such as 🏳️‍⚧️)'
                }
            },
            inbuilt: {
                profile: {
                    name: 'Profil',
                    subtitle: {
                        name: 'Podtytuł',
                        aka: 'aka.',
                        pronouns: 'zaimki'
                    },
                    pronoun_tip: 'Jeśli zaimki są umieszczone jako pierwsze, "aka." zmieni się na "zaimki".',
                    country: 'Kraj',
                    website: 'Strona internetowa',
                    about: 'O mnie',
                    toggle_preview: {
                        name: 'Przełącz podgląd',
                        bio: 'Podgląd, jak twój profil wygląda dla innych',
                        note: 'Uwaga: Nowe linie, linki itp. są widoczne tylko dla innych użytkowników bleh, zwykli użytkownicy Last.fm widzą nowe linie jako spacje.'
                    },
                    banner_tip: 'Images can be embedded using ![](link). You can also set a custom profile banner with ![banner](link).',
                    avatar: {
                        name: 'Edytuj awatar',
                        upload: 'Prześlij plik',
                        delete: 'Usuń awatar'
                    }
                },
                charts: {
                    name: 'Rankingi',
                    recent: {
                        count: {
                            name: 'Liczba utworów do wyświetlenia'
                        },
                        artwork: {
                            name: 'Wyświetl okładki albumów'
                        },
                        realtime: {
                            name: 'Aktualizuj utwory w czasie rzeczywistym'
                        }
                    },
                    artists: {
                        timeframe: {
                            name: 'Domyślny przedział czasowy'
                        },
                        style: {
                            name: 'Styl rankingu'
                        },
                        length: {
                            name: 'Chart size'
                        }
                    },
                    albums: {
                        timeframe: {
                            name: 'Domyślny przedział czasowy'
                        },
                        style: {
                            name: 'Styl rankingu'
                        },
                        length: {
                            name: 'Chart size'
                        }
                    },
                    tracks: {
                        count: {
                            name: 'Liczba utworów do wyświetlenia'
                        },
                        timeframe: {
                            name: 'Domyślny przedział czasowy'
                        }
                    }
                },
                ignore: {
                    name: 'Communication',
                    consider: {
                        name: 'To consider',
                        good: [
                            'You will not see previous or new shouts globally',
                            'They cannot direct message you',
                            'They cannot leave a shout on your profile or under your shouts anywhere'
                        ],
                        bad: [
                            'You cannot delete pre-existing shouts from your profile',
                            'They can still view your profile'
                        ]
                    },
                    view: 'View {c} more',
                    count: 'You have {c} users hidden'
                },
                privacy: {
                    name: 'Prywatność',
                    recent_listening: {
                        name: 'Ukryj historię ostatnich odsłuchów',
                        bio: 'Zachowaj tajemnicę swoich ostatnich odsłuchów o.O'
                    },
                    receiving_msgs: {
                        name: 'Kontroluj kto może się z Tobą zkontaktować',
                        bio: 'To ustawienie kontroluje kto może wysyłać wiadomosci i prywatne wiadomości do ciebie.',
                        settings: {
                            everyone: {
                                name: 'Każdy',
                                bio: 'Każdy oprócz osób które zostały przez ciebie zignorowane'
                            },
                            neighbours: {
                                name: 'Osoby których obserwujesz i sąsiadujący',
                                bio: 'Wszyscy których obserwujesz oraz Twoi sąsiedzi na Last.fm'
                            },
                            follow: {
                                name: 'Tylko osoby które obserwujesz',
                                bio: 'Tylko użytkownicy których obserwujesz'
                            }
                        }
                    },
                    disable_shoutbox: {
                        name: 'Ukryj swój shoutbox',
                        bio: 'Twój shoutbox zostanie ukryty dla ciebie i dla innych użytkowników.'
                    }
                }
            },
            actions: {
                import: {
                    name: 'Importuj',
                    modals: {
                        initial: {
                            name: 'Importuj ustawienia z poprzedniej instalacji',
                            alert: 'Wszystko co zaimportujesz zastąpi twoje bieżące ustawienia. Importując ustawienia z internetu upewnij się że źródło jest zaufane.'
                        },
                        failed: {
                            name: 'Import nie powiódł się',
                            alert: 'Nie udało się przetworzyć importowanych ustawień. Żadne zmiany nie zostały wprowadzone.'
                        }
                    }
                },
                export: {
                    name: 'Eksportuj',
                    modals: {
                        initial: {
                            name: 'Eksportuj swoje bieżące ustawienia',
                            alert: 'Twoje bieżące ustawienia są w polu tekstowym poniżej, gotowe do skopiowania.'
                        }
                    }
                },
                reset: {
                    name: 'Resetuj',
                    modals: {
                        initial: {
                            name: 'Resetuj ustawienia do domyślnych',
                            alert: 'Twoje ustawienia zostaną <strong>zresetowane do domyślnych</strong> bez możliwości cofnięcia. Czy na pewno chcesz kontynuować?',
                            confirm: 'Tak, resetuj moje ustawienia',
                            export: 'Eksportuj najpierw'
                        }
                    }
                }
            }
        },
        gallery: {
            tabs: {
                overview: 'Zdjęcia',
                bookmarks: 'Zapisane'
            },
            bookmarks: {
                name: 'Zapisane',
                bio: 'Zdjęcia galerii można zapisać na przyszłość.',
                no_data: 'brak zapisanych zdjęć (・・ )',
                link: 'View all saved photos',
                button: {
                    image_is_bookmarked: {
                        name: 'Masz to zdjęcie zapisane'
                    },
                    bookmark_this_image: {
                        name: 'Zapisz to zdjęcie',
                        bio: 'Zapisz to zdjęcie na później'
                    },
                    unbookmark_this_image: {
                        name: 'Usuń zapis tego zdjęcia',
                        bio: 'Usuń zapis tego zdjęcia'
                    }
                }
            },
            empty: {
                title: 'No title',
                description: 'No description'
            },
            prefer: {
                name: 'Star'
            },
            report: {
                name: 'Report'
            },
            open: {
                name: 'Expand',
                tooltip: 'Expand image to full resolution'
            },
            up: 'Up votes:',
            down: 'Down votes:',
            vote: 'This is the sum of votes used for ordering.'
        },
        activities: {
            name: 'Recent Activity',

            test: 'TEST {involved}',
            shout: 'You left a shout for {i}',
            image_upload: 'You uploaded an image for {i}',
            image_star: 'You starred an image for {i}',
            obsess: 'You’re obsessed with {i}',
            unobsess: 'You’re no longer obsessed with {i}',
            love: 'You love {i}',
            unlove: 'You no longer love {i}',
            install_bwaa: 'You installed bwaa',
            update_bwaa: 'You updated bwaa to {i}',
            install_bleh: 'You installed bleh',
            update_bleh: 'You updated bleh to {i}',
            bookmark: 'You bookmarked {i}',
            unbookmark: 'You removed {i}’s bookmark',
            wiki: 'You edited on {i}'
        },
        artist: {
            name: 'Artist',
            plural: 'Artists',
            tooltip: 'Multiple artists are combined into this profile.'
        },
        album: {
            name: 'Album',
            plural: 'Albums'
        },
        track: {
            name: 'Track',
            plural: 'Tracks'
        },
        tag: {
            name: 'Tag'
        },
        search: {
            name: 'Search',
            results_for: 'Results for {v}'
        },
        inbox: {
            name: 'Inbox',
            overview: 'Messages',
            sent_overview: 'Messages',
            compose: 'Messages',
            message_overview: 'Messages',
            sent_message: 'Messages',
            notifications: 'Notifications'
        },
        charts: {
            name: 'Charts',
            overview: 'Real time',
            weekly: 'Weekly',
            charts_for: 'Charts for {date}',
            view: 'View the charts',
            scroll: {
                name: 'Simulate horizontal scrolling',
                bio: 'Disable if you can scroll easily on a laptop for example.'
            }
        },
        bookmarks: {
            name: 'Bookmarks'
        },
        home: {
            name: 'Home',
            welcome: 'Welcome back {m}'
        }
    },
}
moment.updateLocale('de', {
    relativeTime : {
        future: 'in %s',
        past:   'vor %s',
        s:      'ein paar Sekunden',
        ss:     '%d Sekunden',
        m:      'eine Minute',
        mm:     '%d Minuten',
        h:      'eine Stunde',
        hh:     '%d Stunden',
        d:      'ein Tag',
        dd:     '%d Tagen',
        w:      'eine Woche',
        ww:     '%d Wochen',
        M:      'im Monat',
        MM:     '%d Monate',
        y:      'ein Jahr',
        yy:     '%d Jahre'
    }
});

export function tl(key) {
    if (!key) {
        log('your key is undefined', 'trans');
        return 'NO_TRANSLATION_FOUND';
    }

    if (key[lang])
        return key[lang];

    log(`no translation found for ${JSON.stringify(key)}`, 'trans');
    return key.en;
}

export function lookup_lang() {
    const troot = document.querySelector('.masthead-logo a');

    console.log(troot)
    if (!troot) {
        handle_error_500();
        return;
    }

    console.log(troot.getAttribute("href"));

    setRoot(troot.getAttribute('href'));

    let previous_avi = auth.avatar;
    if (auth_link.state) {
        auth.avatar = auth_link.state.querySelector('img').getAttribute('src');

        if (auth.avatar != previous_avi) {
            let avatar = auth_link.state.querySelector('img');
            avatar.setAttribute('crossorigin', 'anonymous');

            try {
                avatar.addEventListener('load', function() {
                    let thief = new ColorThief();
                    let colour = thief.getColor(avatar);

                    let hsl = rgb_to_hsl(colour[0], colour[1], colour[2]);

                    auth.sets.hue = hsl.h;
                    auth.sets.sat = clamp_sat((hsl.s / 100) * 3);
                    auth.sets.lit = 1;
                });
            } catch(e) {}
        }
    }
    lang = document.documentElement.getAttribute('lang');
    non_override_lang = lang;

    if (!valid_langs.includes(lang)) {
        log(`language fallback from ${lang} to en - not supported`, 'trans');
        lang = 'en';
    }

    moment.locale(lang);
}