// ==UserScript==
// @name         bleh
// @namespace    http://last.fm/
// @version      2024.1020
// @description  bleh!!! ^-^
// @author       kate
// @match        https://www.last.fm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=last.fm
// @grant        GM_addStyle
// @updateURL    https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.js
// @downloadURL  https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.js
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js
// @require      https://unpkg.com/@popperjs/core@2
// @require      https://unpkg.com/tippy.js@6
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js
// @require      https://katelyynn.github.io/bleh/fm/js/snow.js?a=b
// ==/UserScript==

let version = {
    build: '2024.1020',
    sku: 'falter',
    feature_flags: {
        bleh_settings_tabs: {
            default: false,
            name: 'Utilise new bleh settings tabs',
            date: '2024-07-09'
        },
        high_contrast: {
            default: false,
            name: 'Enable visibility of high contrast (experimental)',
            date: '2024-10-04'
        },
        redesigned_profile_header: {
            default: true,
            name: 'Redesigned profile header info',
            date: '2024-10-09'
        },
        show_wiki_label: {
            default: false,
            name: 'Show \'About\' label above wikis',
            date: '2024-10-11'
        }
    }
}
let theme_version = getComputedStyle(document.body).getPropertyValue('--version-build').replaceAll("'", ''); // remove quotations

// loads your selected language in last.fm
let lang;
let non_override_lang;
// WARN: fill this out if translating
// lists all languages with valid bleh translations
// any custom translations will not load if not listed here!!
let valid_langs = ['en', 'de', 'pl'];

let lang_info = {
    en: {
        name: 'English',
        by: ['cutensilly'],
        last_updated: 'latest'
    },
    de: {
        name: 'Deutsch',
        by: ['inozom', 'cutensilly'],
        last_updated:  'latest',
        new: true
    },
    pl: {
        name: 'Polski',
        by: ['twolay'],
        last_updated:  '2024-06-17'
    }
}

const trans = {
    en: {
        auth_menu: {
            dev: 'Toggle dev mode',
            configure_bleh: 'Configure bleh',
            library: 'Library',
            shouts: 'Shouts'
        },
        music: {
            submit_lastfm_correction: 'Submit correction to Last.fm',
            submit_bleh_correction: 'Submit correction to bleh',
            search_variations: 'Search for variations of this title',
            fetch_plays: {
                name: 'Tracklist',
                loading: 'Fetching your plays on this album',
                fail: 'You do not have any plays on this album',
                open_as_track: 'Open album title as a track'
            },
            from_the_album: 'From the album: {album}',
            listens: {
                count_listens: '{c} listens',
                loading_listens: 'listens',
                other_listeners: '{c} others'
            },
            wiki: 'About',
            refresh_tracks: 'Refresh tracks'
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
            on_ignore_list: 'You are on this user\'s ignore list.',
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
            }
        },
        messaging: {
            update: 'bleh has updated to version {v}!'
        },
        settings: {
            save: 'Save',
            cancel: 'Cancel',
            close: 'Close',
            clear: 'Clear',
            done: 'Done',
            finish: 'Finish',
            continue: 'Continue',
            reset: 'Reset to default',
            go: 'Go',
            skip: 'Skip',
            back: 'Back',
            reload: 'A setting you changed requires a page reload to take effect, click to reload.',
            new: 'New',
            examples: {
                button: 'Example button'
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
                    notice: 'bleh is out of date! - use the update buttons below',
                    ignore: 'Ignore for 1 hour'
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
                bio: 'Configure your music-related settings for profiles, artists, albums, and tracks.',
                profile_shortcut: {
                    name: 'Profile shortcut',
                    bio: 'Quickly access a user\'s plays on an artist, album, or track page.',
                    placeholder: 'Profile',
                    header: 'Enter username',
                    saved: 'Profile shortcut is valid',
                    failed: 'Profile does not exist or failed to load'
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
                }
            },
            customise: {
                name: 'Customise',
                colours: {
                    name: 'Colours',
                    presets: 'Presets',
                    manual: 'Manual',
                    custom: 'Create a custom colour',
                    default_with_season: 'Default colour for {season}',
                    default: 'Default colour',
                    modals: {
                        custom_colour: {
                            preface: 'Colours are controlled by three values: hue, saturation, and lightness. Try out the sliders to get a feel.',
                            hue: 'Accent colour',
                            sat: 'Saturation',
                            lit: 'Lightness',
                            seasonal_alert: 'The current season is overriding your accent colour, adjust sliders to disable.'
                        }
                    }
                },
                high_contrast: {
                    name: 'Enable high contrast mode'
                },
                seasonal: {
                    name: 'Seasonal',
                    bio: 'During seasonal events, bleh can automatically change the default accent colour, add particles, and add overlays to various interface elements.',
                    listing: {
                        easter: 'Easter',
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
                    overlays: {
                        name: 'Display additional seasonal effects',
                        bio: 'During winter seasons this is used for ice effects, otherwise mainly just gradients.'
                    }
                },
                artwork: {
                    name: 'Artwork'
                },
                hue_from_album: {
                    name: 'Automatically colour album pages',
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
                pretty_obsessions: {
                    name: 'Pretty obsessions'
                },
                profile_header: {
                    name: 'Display profile backgrounds',
                    for_own: 'On my profile',
                    for_others: 'On other profiles'
                }
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
                name: 'Profiles',
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
                }
            },
            redirects: {
                name: 'Redirects',
                bio: 'Manage last.fm\'s (not) handy redirection system as best as possible.',
                travis: {
                    name: 'No, I didn\'t mean Travi$ Scott',
                    bio: 'Hides redirect messages from the top of pages.'
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
                    name: 'Format guest features and song tags',
                    bio: 'Splits track and album titles into their individual tags such as guest features, versions, remixes.'
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
                        note: 'For non-bleh users, multiple lines display as spaces and links, bold, italics will be plain text.'
                    },
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
                        }
                    },
                    albums: {
                        timeframe: {
                            name: 'Default timeframe'
                        },
                        style: {
                            name: 'Chart style'
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
                },
                wiki: {
                    syntax: {
                        name: 'Use fancy syntax when editing',
                        links_to: 'Links to {link}'
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
                overview: 'Photos',
                bookmarks: 'Saved'
            },
            bookmarks: {
                name: 'Saved',
                bio: 'Gallery photos can be saved for future reference.',
                no_data: 'no images saved (・・ )',
                button: {
                    image_is_bookmarked: {
                        name: 'You have saved this image'
                    },
                    bookmark_this_image: {
                        name: 'Save this image',
                        bio: 'Save this image for later'
                    },
                    unbookmark_this_image: {
                        name: 'Unsave this image',
                        bio: 'Unsave this image'
                    }
                }
            }
        }
    },
    de: {
        auth_menu: {
            dev: 'Toggle dev mode',
            configure_bleh: 'bleh einstellen',
            library: 'Musiksammlung',
            shouts: 'Shouts'
        },
        music: {
            submit_lastfm_correction: 'Submit correction to Last.fm',
            submit_bleh_correction: 'Submit correction to bleh',
            search_variations: 'Search for variations of this title',
            fetch_plays: {
                name: 'Titelliste',
                loading: 'Deine Wiedergaben auf diesem Album werden abgerufen',
                fail: 'Du hast keine Scrobbel auf diesem Album',
                open_as_track: 'Albumtitel als Titel öffnen'
            },
            from_the_album: 'Aus dem Album: {album}',
            listens: {
                count_listens: '{c} scrobbels',
                loading_listens: 'scrobbels',
                other_listeners: '{c} hörer'
            },
            wiki: 'Über',
            refresh_tracks: 'Titel aktualisieren'
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
            shortcut: {
                add: 'Als Verknüpfung hinzufügen',
                remove: 'Deine Profile sind verlinkt!'
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
                you_share_1: 'Ihr hört {artist}',
                you_share_2: 'Ihr hört {artist1} und {artist2}',
                you_share_3: 'Ihr hört {artist1}, {artist2}, und {artist3}'
            }
        },
        messaging: {
            update: 'bleh wurde auf Version {v} aktualisiert!'
        },
        settings: {
            save: 'Speichern',
            cancel: 'Abbrechen',
            close: 'Schließen',
            clear: 'Leeren',
            done: 'Fertig',
            finish: 'Beenden',
            continue: 'Fortsetzen',
            reset: 'Auf Werkseinstellung Zurücksetzen',
            go: 'Fortfahren',
            skip: 'Überspringen',
            back: 'Zurück',
            reload: 'Klicke zum Neuladen, um deine Einstellungen zu übernehmen.',
            new: 'Neu',
            examples: {
                button: 'Beispiel-Taste'
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
                    notice: 'bleh is out of date! - use the update buttons below',
                    ignore: 'Ignore for 1 hour'
                },
                setup: {
                    name: 'Setup',
                    bio: 'Re-enter setup'
                },
                colours: {
                    name: 'Farbe',
                    bio: 'Pick your favourite!'
                },
                thanks: 'Willkommen {m}, du verwendest bleh Version {v}.'
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
                bio: 'Konfiguriere deine musikbezogene Einstellungen für Profile, Künstler, Alben und Titel.',
                profile_shortcut: {
                    name: 'Profilverknüpfung',
                    bio: 'Schnell auf die Wiedergaben eines Benutzers auf einer Künstler-, Album- oder Titelseite zugreifen.',
                    placeholder: 'Profil',
                    header: 'Benutzernamen eingeben',
                    saved: 'Die Profilverknüpfung ist gültig',
                    failed: 'Das Profil existiert nicht oder konnte nicht geladen werden.'
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
                    bio: 'Während saisonaler Ereignisse kann bleh automatisch die Standardakzentfarbe ändern, Partikel hinzufügen und verschiedenen Schnittstellenelementen Overlays hinzufügen.',
                    listing: {
                        easter: 'Ostern',
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
                    overlays: {
                        name: 'Zusätzliche saisonale Effekte anzeigen',
                        bio: 'During winter seasons this is used for ice effects, otherwise mainly just gradients.'
                    }
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
                pretty_obsessions: {
                    name: 'Pretty obsessions'
                },
                profile_header: {
                    name: 'Profilhintergründe anzeigen',
                    for_own: 'Auf meinem Profil',
                    for_others: 'Auf anderen Profilen'
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
                }
            },
            redirects: {
                name: 'Weiterleitungen',
                bio: 'Manage last.fm\'s (not) handy redirection system as best as possible.',
                travis: {
                    name: 'No, I didn\'t mean Travi$ Scott',
                    bio: 'Hides redirect messages from the top of pages.'
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
                        note: 'Für nicht bleh Benutzer, mehrere Zeilen werden als Leerzeichen und Links angezeigt, Fett- und Kursivschrift wird als einfacher Text angezeigt.'
                    },
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
                        }
                    },
                    albums: {
                        timeframe: {
                            name: 'Default timeframe'
                        },
                        style: {
                            name: 'Chart style'
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
                },
                wiki: {
                    syntax: {
                        name: 'Use fancy syntax when editing',
                        links_to: 'Links to {link}'
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
                overview: 'Photos',
                bookmarks: 'Saved'
            },
            bookmarks: {
                name: 'Saved',
                bio: 'Gallery photos can be saved for future reference.',
                no_data: 'no images saved (・・ )',
                button: {
                    image_is_bookmarked: {
                        name: 'You have saved this image'
                    },
                    bookmark_this_image: {
                        name: 'Save this image',
                        bio: 'Save this image for later'
                    },
                    unbookmark_this_image: {
                        name: 'Unsave this image',
                        bio: 'Unsave this image'
                    }
                }
            }
        }
    },
    pl: {
        auth_menu: {
            dev: 'Przełącz tryb deweloperski',
            configure_bleh: 'Skonfiguruj bleh',
            shouts: 'Wiadomości'
        },
        music: {
            submit_lastfm_correction: 'Submit correction to Last.fm',
            submit_bleh_correction: 'Submit correction to bleh',
            search_variations: 'Search for variations of this title',
            fetch_plays: {
                name: 'Tracklist',
                loading: 'Fetching your plays on this album',
                fail: 'You do not have any plays on this album',
                open_as_track: 'Open album title as a track'
            }
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
            cannot_follow_user: 'Nie możesz zaobserwować tego użytkownika.',
            on_ignore_list: 'Jesteś na liście ignorowanych tego użytkownika.',
            friends: {
                name: 'Friends'
            }
        },
        settings: {
            save: 'Zapisz',
            cancel: 'Anuluj',
            close: 'Zamknij',
            clear: 'Wyczyść',
            done: 'Gotowe',
            continue: 'Kontynuuj',
            reset: 'Przywróć domyślne',
            go: 'Go',
            examples: {
                button: 'Przycisk przykładowy'
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
                colours: {
                    name: 'Kolory',
                    bio: 'Wybierz swój ulubiony!'
                }
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
                }
            },
            customise: {
                name: 'Dostosuj',
                colours: {
                    name: 'Kolory',
                    presets: 'Ustawienia wstępne',
                    manual: 'Ręcznie',
                    custom: 'Stwórz niestandardowy kolor',
                    modals: {
                        custom_colour: {
                            preface: 'Kolory są kontrolowane przez trzy wartości: odcień (hue), nasycenie (saturation) i jasność (lightness). Przesuń suwaki, aby dostosować kolor.',
                            hue: 'Kolor akcentu (hue)',
                            sat: 'Nasycenie (saturation)',
                            lit: 'Jasność (lightness)'
                        }
                    }
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
                pretty_obsessions: {
                    name: 'Pretty obsessions'
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
                name: 'Profile',
                bio: 'Zarządzaj swoimi danymi i danymi zapisanych na innych profilach.',
                notes: {
                    name: 'Notatki',
                    header: 'Notatka',
                    placeholder: 'Wprowadź lokalną notatkę dla tego użytkownika',
                    edit: 'Edytuj notatkę',
                    delete: 'Usuń notatkę',
                    edit_user: 'Edytuj notatkę dla {u}',
                    delete_user: 'Usuń notatkę dla {u}'
                }
            },
            redirects: {
                name: 'Redirects',
                bio: 'Manage last.fm\'s (not) handy redirection system as best as possible.',
                travis: {
                    name: 'No, I didn\'t mean Travi$ Scott',
                    bio: 'Hides redirect messages from the top of pages.'
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
                format_guest_features: {
                    name: 'Formatuj występy i tagi utworów',
                    bio: 'Mniej eksponuje występy i tagi utworów (np. Remix, Deluxe Edition, itp.)'
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
                        }
                    },
                    albums: {
                        timeframe: {
                            name: 'Domyślny przedział czasowy'
                        },
                        style: {
                            name: 'Styl rankingu'
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
            }
        }
    },
}
moment.updateLocale('de', {
    relativeTime : {
        future: 'in %s',
        past:   'vor %s',
        s  : 'ein paar Sekunden',
        ss : '%d Sekunden',
        m:  'eine Minute',
        mm: '%d Minuten',
        h:  'eine Stunde',
        hh: '%d Stunden',
        d:  'ein Tag',
        dd: '%d Tagen',
        w:  'eine Woche',
        ww: '%d Wochen',
        M:  'im Monat',
        MM: '%d Monate',
        y:  'ein Jahr',
        yy: '%d Jahre'
    }
});

function lookup_lang() {
    root = document.querySelector('.masthead-logo a').getAttribute('href');
    if (auth_link != null)
        my_avi = auth_link.querySelector('img').getAttribute('src');
    lang = document.documentElement.getAttribute('lang');
    non_override_lang = lang;

    if (!valid_langs.includes(lang)) {
        console.info('bleh - language fallback from', lang, 'to en (language is not listed as valid)', valid_langs);
        lang = 'en';
    }

    moment.locale(lang);
}

// seasonal
let stored_season = {
    id: 'none'
};
let seasonal_events = [
    {
        id: 'new_years',
        name: 'New Years',
        start: 'y0-01-01',
        end: 'y0-01-10T23:59:59',

        snowflakes: {
            state: true,
            count: 50
        }
    },
    {
        id: 'easter',
        name: 'Easter',
        start: 'y0-04-05',
        end: 'y0-04-30T23:59:59',

        snowflakes: {
            state: false
        }
    },
    {
        id: 'halloween',
        name: 'Halloween',
        start: 'y0-09-22',
        end: 'y0-11-02T23:59:59',

        snowflakes: {
            state: false
        }
    },
    {
        id: 'pre_fall',
        name: 'Pre-Fall',
        start: 'y0-11-05',
        end: 'y0-11-12T23:59:59',

        snowflakes: {
            state: true,
            count: 2
        }
    },
    {
        id: 'fall',
        name: 'Fall',
        start: 'y0-11-13',
        end: 'y0-11-22T23:59:59',

        snowflakes: {
            state: true,
            count: 16
        }
    },
    {
        id: 'christmas',
        name: 'Christmas',
        start: 'y0-11-23',
        end: 'y0-12-31T23:59:59',

        snowflakes: {
            state: true,
            count: 80
        }
    }
];

function set_season() {
    if (!settings.seasonal)
        return;

    let now = new Date();

    let current_year = now.getFullYear();

    seasonal_events.forEach((season) => {
        if (
            now >= new Date(season.start.replace('y0', current_year)) &&
            now <= new Date(season.end.replace('y0', current_year))
        ) {
            stored_season = season;
            stored_season.now = now;
            stored_season.year = current_year;
            console.info('bleh - it is season', season.name, 'starting', season.start, 'ending', season.end, season);

            document.documentElement.setAttribute('data-bleh--season', season.id);

            // snow
            if (season.snowflakes.state && settings.seasonal_particles) {
                prep_snow();

                snowflakes_enabled = true;
                snowflakes_count = season.snowflakes.count;
                begin_snowflakes();
            }
        }
    });
}

function prep_snow() {
    let prev_container = document.getElementById('snowflakes');
    if (prev_container != null)
        return;

    let container = document.createElement('div');
    container.classList.add('snow-container');
    container.setAttribute('id', 'snowflakes');
    container.innerHTML = (`
        <span class="snow snowflake"></span>
    `);

    document.documentElement.appendChild(container);
}

let theme_preview = (`
    <div class="preview-inner">
        <div class="preview-card">
            <div class="preview-header"></div>
            <div class="preview-text"></div>
            <div class="preview-text row-2"></div>
            <div class="preview-buttons">
                <div class="preview-button preview-button-primary">

                </div>
                <div class="preview-button">

                </div>
            </div>
        </div>
    </div>
`);

let cute = ['cutensilly', 'inozom'];

// require page reload
let reload_pending = false;

tippy.setDefaultProps({
    arrow: false,
    duration: [150, 250],
    delay: [null, 50]
});

let artist_corrections = {
    'Miraie': 'miraie',
    'Julie': 'julie',
    'Glaive': 'glaive',
    'Yandere': 'yandere',
    'Mental': 'mental',
    'Valorant': 'VALORANT',
    'Tuyu': 'TUYU',
    'Hivemind': 'HIVEMIND',
    'MGK': 'mgk',
    'Horrormovies': 'horrormovies',
    'Lieu': 'lieu',
    'Funeral': 'funeral',
    'Kuru': 'kuru',
    'Quinn': 'quinn',
    'Charli XCX': 'Charli xcx',
    'Underscores': 'underscores',
    'Thrown': 'thrown',
    'Mitsu': 'mitsu',
    'Vexed': 'VEXED',
    'HeavensGate': 'HEAVENSGATE',
    'Tool': 'TOOL',
    'Blackshape': 'BLACKSHAPE',
    'Olivia': 'OLIVIA',
    'Diesect': 'DIESECT',
    'Milet': 'milet',
    'Ino': 'ino',
    'Hana': 'HANA',
    'Boa': 'BoA',
    'Paris Match': 'paris match',
    'Iri': 'iri',
    //
    'ty dolla $ign': 'Ty Dolla $ign',
    'juicy J': 'Juicy J',
    'eminem': 'Eminem',
    'project pat': 'Project Pat',
    'kenny Mason': 'Kenny Mason',
    'SKI mask THE slump God': 'Ski Mask The Slump God',
    'that mexican ot': 'That Mexican OT',
    'TWELVE\'LEN': 'Twelve\'len',
    'ariana grande': 'Ariana Grande',
    'robyn': 'Robyn',
    'yung lean': 'Yung Lean',
    'troye sivan': 'Troye Sivan',
    'addison rae': 'Addison Rae',
    'a. g. cook': 'A. G. Cook',
    'lorde': 'Lorde',
    'the japanese house': 'The Japanese House',
    'tinashe': 'Tinashe',
    'julian casablancas': 'Julian Casablancas',
    'bon iver': 'Bon Iver',
    'shygirl': 'Shygirl',
    'billie eilish': 'Billie Eilish',
    //
    'J.I.D | J.1.D': 'JID',
    'ZILLAKAMI | JPEGMAF1A + Z1LLAKAM1': 'ZILLAKAMI',
    'GOLDLINK | TWELVE\'LEN + GOLDL1NK': 'GoldLink',
    'Pharrell': 'Pharrell Williams'
}
let song_title_corrections = {
    'quadeca': {
        'BORN YESTERDAY': 'born yesterday',
        'Tell Me A Joke': 'tell me a joke',
        'Gone Gone': 'gone gone',
        'Guess Who?': 'GUESS WHO?',
        'UNDER My Skin': 'UNDER MY SKIN',
        'being yourself': 'BEING YOURSELF',
        'I Make It Look Effortless': 'I MAKE IT LOOK EFFORTLESS',
        'Scrapyard': 'SCRAPYARD',
        'i didn\'t mean to haunt you': 'I Didn\'t Mean To Haunt You',
        'Scrapyard II - Single': 'SCRAPYARD II - Single'
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
    'young thug': {
        'Pick up the Phone': 'pick up the phone'
    },
    'nirvana': {
        'Tourette\'s - 1992/Live at Reading': 'tourette\'s - 1992/Live at Reading',
        'Tourette\'s (Alternative Mix)': 'tourette\'s (Alternative Mix)',
        'Tourette\'s (2013 Mix)': 'tourette\'s (2013 Mix)',
        'Tourette\'s - 2013 Mix': 'tourette\'s - 2013 Mix',
        'Tourette\'s (Demo / Instrumental)': 'tourette\'s (Demo / Instrumental)',
        'Tourette\'s - Demo / Instrumental': 'tourette\'s - Demo / Instrumental'
    },
    'julie': {
        'April’s-Bloom': 'april’s-bloom',
        'Pushing Daises': 'pushing daises',
        'Starjump / Kit': 'starjump/kit'
    },
    '21 savage': {
        'Savage Mode II': 'SAVAGE MODE II'
    },
    'future': {
        'OUT OF MY HANDS': 'Out Of My Hands',
        'NIGHTS LIKE THIS': 'Night Like This',
        'BEAT IT': 'Beat It',
        'ONE BIG FAMILY': 'One Big Family',
        'YOUNG METRO': 'Young Metro',
        'ICE ATTACK': 'Ice Attack',
        'TYPE SHIT': 'Type Shit',
        'CLAUSTROPHOBIC': 'Claustrophobic',
        'SLIMED IN': 'Slimed In',
        'MAGIC DON JUAN (PRINCESS DIANA)': 'Magic Don Juan (Princess Diana)',
        'RUNNIN OUTTA TIME': 'Runnin Outta Time',
        'FRIED (SHE A VIBE)': 'Fried (She a Vibe)',
        'AIN\'T NO LOVE': 'Ain\'t No Love',
        'EVERYDAY HUSTLE': 'Everyday Hustle',
        'SEEN IT ALL': 'Seen it All'
    },
    'tyler, the creator': {
        'What A Day': 'WHAT A DAY',
        'Sorry Not Sorry': 'SORRY NOT SORRY'
    },
    'quinn': {
        'Quinn': 'quinn'
    },
    'glaive': {
        'Huh': 'huh',
        'Prick (feat. Midwxst)': 'prick (feat. midwxst)',
        '17250 (V2)': '17250 (v2)',
        'Hate 2 See U Cry': 'hate 2 see u cry',
        'Bastard (V2)': 'bastard (v2)',
        'Stay + Love Story (Cover)': 'stay + love story (cover)',
        'SYNOPSIS (demo)': 'synopsis (demo)',
        'Living Proof (That It Hurts)': 'living proof (that it hurts)',
        'Shoreditch (Bsun N Thr6x Remix)': 'shoreditch (bsun n thr6x remix)',
        'Que Onda': 'que onda',
        'A Date w Karma (V1)': 'a date w karma (v1)',
        'Minnesota is a place that exists (V2)': 'minnesota is a place that exists (v2)',
        //
        'may it never falter': 'May It Never Falter',
        'may it never falter (sessions)': 'May It Never Falter (Sessions)',
        'for god and country': 'For God and country',
        'count it up': 'Count It Up',
        'knock, draw, release': 'Knock, Draw, Release',
        'everydog has its day': 'Everydog has its day',
        'Nobodys fault / Accept my own': 'Nobodys Fault / Accept My Own',
        'by birthright': 'By Birthright'
    },
    'juice wrld': {
        'Off the rip': 'Off the Rip',
        'lace it (with eminem & benny blanco)': 'Lace It (with Eminem & benny blanco)'
    },
    'travis scott': {
        'Days Before Rodeo': 'DAYS BEFORE RODEO',
        'Mamacita (Feat. Rich Homie Quan & Young Thug)': 'Mamacita (feat. Rich Homie Quan & Young Thug)',
        'Basement Freestyle (Live)': 'BASEMENT FREESTYLE (Live)',
        'Mamacita (live)': 'MAMACITA (Live)',
        'Astroworld [Explicit]': 'ASTROWORLD [Explicit]'
    },
    'yumi': {
        'Dance': 'DANCE'
    },
    'ericdoa': {
        'Search & Destroy': 'search & destroy'
    },
    'playboi carti': {
        'All Red': 'ALL RED',
        'Music': 'MUSIC'
    },
    '2hollis': {
        'TEENAGE SOLDIER': 'teenage soldier'
    },
    'denzel curry': {
        'cole pImp (with ty dolla $ign & juicy J)': 'COLE PIMP (with Ty Dolla $ign & Juicy J)',
        'sked (with kenny Mason & project pat)': 'SKED (with Kenny Mason & Project Pat)',
        'black FlAG freestyle (with that mexican ot)': 'BLACK FLAG FREESTYLE (with That Mexican OT)'
    },
    'olivia rodrigo': {
        'Guts': 'GUTS'
    },
    'charli xcx': {
        'talk talk featuring troye sivan': 'Talk talk featuring Troye Sivan',
        'guess featuring billie eilish': 'Guess featuring billie eilish'
    },
    'my bloody valentine': {
        'Loveless': 'loveless',
        'Only Shallow': 'only shallow',
        'Loomer': 'loomer',
        'Touched': 'touched',
        'To Here Knows When': 'to here knows when',
        'When You Sleep': 'when you sleep',
        'I Only Said': 'i only said',
        'Come in Alone': 'come in alone',
        'Sometimes': 'sometimes',
        'Blown a Wish': 'blown a wish',
        'What You Want': 'what you want',
        'Soon': 'soon'
    },
    'jpegmafia': {
        'Are you happy?': 'ARE YOU HAPPY?'
    }
};

let ranks = {
    15: {
        start: 62_000,
        hue: -135,
        sat: 1.5,
        lit: 0.35
    },
    14: {
        start: 50_000,
        hue: -105,
        sat: 1,
        lit: 0.85
    },
    13: {
        start: 38_000,
        hue: -85,
        sat: 1.2,
        lit: 0.95
    },
    12: {
        start: 24_000,
        hue: -55,
        sat: 0.875,
        lit: 0.85
    },
    11: {
        start: 16_000,
        hue: -25,
        sat: 1.5,
        lit: 0.875
    },
    10: {
        start: 12_500,
        hue: -7,
        sat: 1.5,
        lit: 0.875
    },
    9: {
        start: 6_000,
        hue: 4,
        sat: 1.425,
        lit: 0.9
    },
    8: {
        start: 4_300,
        hue: 25,
        sat: 1.425,
        lit: 0.925
    },
    7: {
        start: 3_200,
        hue: 60,
        sat: 1.375,
        lit: 0.95
    },
    6: {
        start: 2_250,
        hue: 80,
        sat: 1.35,
        lit: 0.925
    },
    5: {
        start: 1_500,
        hue: 103,
        sat: 1.35,
        lit: 0.925
    },
    4: {
        start: 1_000,
        hue: 130,
        sat: 1.35,
        lit: 0.925
    },
    3: {
        start: 500,
        hue: 148,
        sat: 1.35,
        lit: 0.925
    },
    2: {
        start: 300,
        hue: 160,
        sat: 1.5,
        lit: 0.925
    },
    1: {
        start: 100,
        hue: 180,
        sat: 1.5,
        lit: 0.875
    },
    0: {
        start: 0,
        hue: 200,
        sat: 1.5,
        lit: 0.925
    }
}

let includes = {
    guests: [
        'feat.', 'featuring',
        '- with', '(with', '[with', 'w/ ',
        'ft.',
        'ref.'
    ],
    versions: [
        '(taylor', '- spotify singles'
    ],
    remasters: [
        '- remaster', '(remaster',
        '- 19', '- 20', '(19', '(20'
    ],
    mixes: [
        '- devonshire mix', '(devonshire mix',
        'mike dean master',
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
        '- chopped', '(chopped', '[chopped',
        '(kate',
        '(asmr',
        '(agressive', '(aggressive', 'brazilian phonk', // lol
        '- sped up', '(sped up', '- slow', '(slow',
        'a. g. cook remix',
        '- offline', '- og mix'
    ],
    mixes_numbers: [
        '(v1', '(v2', '(v3', '(v4', '(v5', '(v6', '(v7', '(v8', '(v9',
        '[v1', '[v2', '[v3', '[v4', '[v5', '[v6', '[v7', '[v8', '[v9'
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
        '- outro', '(outro', '[outro', 'dean outro',
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
        '- expanded', '(expanded', '[expanded',
        '- anniversary', '(anniversary', '[anniversary',
        '- b-side', '- c-side', '(b-side', '(c-side',
        '- lp', '- ep', '(lp', '(ep',
        '- single', '(single',
        '- box set', '(box set',
        //,
        '- 19', '- 20', '(19', '(20',
        '- 10th', '- 19th', '- 20th', '- 25th', '- 30th', '- 35th', '- 40th', '- 50th', '- 60th',
        '(10th', '(19th', '(20th', '(25th', '(30th', '(35th', '(40th', '(50th', '(60th'
    ]
}

let profile_badges = {
    'cutensilly': [
        {
            type: 'contributor',
            name: 'bleh contributor'
        },
        {
            type: 'queen',
            name: 'blehhhhhhhhhh!!'
        },
        {
            type: 'cute',
            name: 'cute'
        }
    ],
    'Iexyy': {
        type: 'cat',
        name: 'it\'s a kitty!!'
    },
    'bIeak': [
        {
            type: 'cat',
            name: 'it\'s a kitty!!'
        },
        {
            type: 'glaive',
            name: '#1 glaive fan'
        }
    ],
    'peoplepleasr': {
        type: 'cat',
        name: 'it\'s a kitty!!'
    },
    'twolay': [
        {
            type: 'cat',
            name: 'it\'s a kitty!!'
        },
        {
            type: 'translation',
            name: 'translated bleh into Polski'
        },
        {
            type: 'contributor',
            name: 'bleh contributor'
        }
    ],
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
    },
    'inozom': [
        {
            type: 'contributor',
            name: 'bleh contributor'
        },
        {
            type: 'translation',
            name: 'translated bleh into Deutsch'
        },
        {
            type: 'cute',
            name: 'cute'
        }
    ]
};


let settings;
let settings_template = {
    theme: 'dark',
    high_contrast: false,
    gloss: 0,
    gendered_tags: true,
    show_extra_nav: true,
    hue: 255,
    sat: 1,
    lit: 1,
    invert_interactable_colour: false,
    dev: false,
    hide_hateful: true,
    accessible_name_colours: false,
    reduced_motion: false,
    underline_links: false,
    big_numbers: false,
    format_guest_features: true,
    show_guest_features: false,
    stacked_chartlist_info: true,
    show_remaster_tags: true,
    corrections: true,
    colourful_counts: true,
    rain: false,
    feature_flags: {},
    show_your_progress: true,
    travis: false,
    list_view: 1,
    shout_markdown: true,
    bio_markdown: true,
    pretty_obsessions: true,
    hue_from_album: true,
    seasonal: true,
    seasonal_particles: true,
    seasonal_overlays: true,
    profile_header_own: true,
    profile_header_others: true,
    profile_shortcut: ''
};
let settings_base = {
    high_contrast: {
        css: 'high_contrast',
        unit: '',
        value: false,
        values: [true, false],
        type: 'toggle'
    },
    hue: {
        css: 'hue-user',
        unit: '',
        value: 255,
        type: 'slider'
    },
    sat: {
        css: 'sat-user',
        unit: '',
        value: 1,
        type: 'slider'
    },
    lit: {
        css: 'lit-user',
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
    reduced_motion: {
        css: 'reduced_motion',
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
    },
    show_guest_features: {
        css: 'show_guest_features',
        unit: '',
        value: false,
        values: [true, false],
        type: 'toggle'
    },
    stacked_chartlist_info: {
        css: 'stacked_chartlist_info',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    show_remaster_tags: {
        css: 'show_remaster_tags',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    corrections: {
        css: 'corrections',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    colourful_counts: {
        css: 'colourful_counts',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    rain: {
        css: 'rain',
        unit: '',
        value: false,
        values: [true, false],
        type: 'toggle',
        require_reload: true
    },
    show_your_progress: {
        css: 'show_your_progress',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    travis: {
        css: 'travis',
        unit: '',
        value: false,
        values: [true, false],
        type: 'toggle'
    },
    list_view: {
        css: 'list_view',
        unit: '',
        value: 0,
        type: 'options'
    },
    shout_markdown: {
        css: 'shout_markdown',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    bio_markdown: {
        css: 'bio_markdown',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    pretty_obsessions: {
        css: 'pretty_obsessions',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    hue_from_album: {
        css: 'hue_from_album',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    seasonal: {
        css: 'seasonal',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle',
        require_reload: true
    },
    seasonal_particles: {
        css: 'seasonal_particles',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle',
        require_reload: true
    },
    seasonal_overlays: {
        css: 'seasonal_overlays',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    profile_header_own: {
        css: 'profile_header_own',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    profile_header_others: {
        css: 'profile_header_others',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    }
};
let inbuilt_settings = {
    recent_artwork: {
        css: 'recent_artwork',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    recent_realtime: {
        css: 'recent_realtime',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    recent_listening: {
        css: 'recent_listening',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    disable_shoutbox: {
        css: 'disable_shoutbox',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    profile_shortcut: {}
}

// use the top-right link to determine the current user
let auth = '';
let auth_link = '';

// stores ur current authorised avatar
let my_avi = '';

// stores the current root of the page, most applicable in other languages:
// en: /
// jp: /jp/
// etc.
let root = '';

let bleh_url = 'https://www.last.fm/bleh';
let bleh_regex = new RegExp('^https://www\.last\.fm/[a-z]+/bleh$');

let setup_url = 'https://www.last.fm/bleh/setup';
let setup_regex = new RegExp('^https://www\.last\.fm/[a-z]+/bleh/setup$');


(function() {
    'use strict';

    // this runs on page load only once!
    auth_link = document.querySelector('a.auth-link');
    if (auth_link != null)
        auth = auth_link.querySelector('img').getAttribute('alt');

    console.info('loading bleh', version.build, 'with sku', version.sku);

    initia();

    function initia() {
        let performance_start = performance.now();

        load_settings();
        lookup_lang();
        append_style();
        patch_masthead(document.body);
        load_notifs();

        // load seasonal data
        set_season();

        start_rain();

        // everything past this point requires authorisation
        if (auth == '')
            return;

        append_nav();

        notify_if_new_update();

        console.log(bleh_url,window.location.href,bleh_regex.test(window.location.href));

        if (window.location.href == bleh_url || bleh_regex.test(window.location.href)) {
            // start bleh settings
            bleh_settings();
        } else if (window.location.href == setup_url || setup_regex.test(window.location.href)) {
            // start bleh setup
            bleh_setup();
        } else {
            patch_profile(document.body);
            patch_shouts(document.body);
            patch_lastfm_settings(document.body);
            patch_artist_ranks(document.body);
            patch_header_menu();
            patch_gallery_page();

            album_missing_a_tracklist();

            patch_header_title(document.body);
            patch_artist_grids(document.body);
            patch_titles(document.body);

            show_your_scrobbles();

            if (settings.corrections) {
                correct_generic_combo_no_artist('artist-header-featured-items-item');
                correct_generic_combo_no_artist('artist-top-albums-item');
                correct_generic_combo('source-album-details');
                correct_generic_combo('resource-list--release-list-item');
                correct_generic_combo('similar-albums-item');
                correct_generic_combo('track-similar-tracks-item');
                correct_generic_combo('similar-items-sidebar-item');
            }

            patch_about_this_artist();
            patch_obsession_view();
            patch_wiki_editor();

            error_page();
        }

        // last.fm is a single page application
        const observer = new MutationObserver((mutations) => {
            console.log('new bleh mutation');
            load_settings();
            lookup_lang();
            append_nav(document.body);
            patch_masthead(document.body);

            // load seasonal data
            set_season();

            if (window.location.href == bleh_url || bleh_regex.test(window.location.href)) {
                // start bleh settings
                bleh_settings();
            } else if (window.location.href == setup_url || setup_regex.test(window.location.href)) {
                // start bleh setup
                bleh_setup();
            } else {
                patch_profile(document.body);
                patch_shouts(document.body);
                patch_lastfm_settings(document.body);
                patch_artist_ranks(document.body);
                patch_header_menu();
                patch_gallery_page();

                album_missing_a_tracklist();

                patch_header_title(document.body);
                patch_artist_grids(document.body);
                patch_titles(document.body);

                show_your_scrobbles();

                if (settings.corrections) {
                    correct_generic_combo_no_artist('artist-header-featured-items-item');
                    correct_generic_combo_no_artist('artist-top-albums-item');
                    correct_generic_combo('source-album-details');
                    correct_generic_combo('resource-list--release-list-item');
                    correct_generic_combo('similar-albums-item');
                    correct_generic_combo('track-similar-tracks-item');
                    correct_generic_combo('similar-items-sidebar-item');
                }

                patch_about_this_artist();
                patch_obsession_view();
                patch_wiki_editor();

                error_page();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        let performance_end = performance.now();
        console.info('bleh finished loading in', performance_end - performance_start);
    }

    function append_style() {
        let cached_style = localStorage.getItem('bleh_cached_style') || '';
        let body = document.body.classList;

        // style is not fetched in dev mode
        if (settings.dev || body.contains('namespace--user_listening-report_playback') || (body.contains('labs-section') && !body.contains('namespace--labs_overview')))
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
        setTimeout(function() {
            document.body.classList.add('bleh');
            theme_version = getComputedStyle(document.body).getPropertyValue('--version-build').replaceAll("'", ''); // remove quotations
        }, 200);
    }

    function check_if_style_cache_is_valid() {
        let cached_style_timeout = new Date(localStorage.getItem('bleh_cached_style_timeout'));
        let current_time = new Date();

        // check if timeout has expired
        if (cached_style_timeout < current_time) {
            // in versions 2024.1019 and onwards, the css stores version itself
            // we can use this to compare if we should fetch a new one
            // as we don't want to fetch a new css while the js is out of date
            if (theme_version != version.build && theme_version != '') {
                // script is either out of date, or more in date (not gonna happen)
                console.info('bleh - attempted to fetch new style, however theme returned version', theme_version, 'meanwhile script is running', version.build, '- halted');

                prompt_for_update();
                return;
            }

            console.info('bleh - fetching new style, timeout has expired');
            fetch_new_style();
        } else {
            console.info('bleh - style timeout is still valid');
        }
    }

    unsafeWindow._prompt_for_update = function() {
        prompt_for_update();
    }
    function prompt_for_update() {
        // prompt the user
        create_window('bleh_update',trans[lang].settings.home.update.name,(`
            <div class="alert alert-update">${trans[lang].settings.home.update.notice}</div>
            <div class="screen-row actions-only">
                <div class="actions">
                    <a class="btn action" href="https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.js">
                        <div class="icon bleh--updates"></div>
                        <span class="text">
                            <h5>${trans[lang].settings.home.update.name}</h5>
                            <p>${trans[lang].settings.home.update.bio}</p>
                        </span>
                    </a>
                    ${(!settings.dev ? (`
                    <button class="btn action" onclick="_force_refresh_theme()">
                        <div class="icon bleh--updates"></div>
                        <span class="text">
                            <h5>${trans[lang].settings.home.update.css}</h5>
                            <p>${trans[lang].settings.home.update.bio}</p>
                        </span>
                    </button>
                    `) : '')}
                    ${(settings.dev ? (`
                    <a class="btn action" href="https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.css">
                        <div class="icon bleh--updates"></div>
                        <span class="text">
                            <h5>${trans[lang].settings.home.update.css}</h5>
                            <p>${trans[lang].settings.home.update.bio}</p>
                        </span>
                    </a>
                    `) : '')}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn" onclick="_ignore_update()">
                    ${trans[lang].settings.home.update.ignore}
                </button>
                <button class="btn primary continue" onclick="_invoke_reload()">
                    ${trans[lang].settings.continue}
                </button>
            </div>
        `));
    }

    unsafeWindow._ignore_update = function() {
        kill_window('bleh_update');

        // set expire date
        let api_expire = new Date();
        api_expire.setHours(api_expire.getHours() + 1);
        localStorage.setItem('bleh_cached_style_timeout',api_expire);
        console.info('bleh - style is cached until', api_expire);
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
            theme_version = getComputedStyle(document.body).getPropertyValue('--version-build').replaceAll("'", ''); // remove quotations


            // in versions 2024.1019 and onwards, the css stores version itself
            // we can use this to compare if we should fetch a new one
            // as we don't want to fetch a new css while the js is out of date
            if (theme_version != version.build && theme_version != '') {
                // script is either out of date, or more in date (not gonna happen)
                console.info('bleh - attempted to fetch new style, however theme returned version', theme_version, 'meanwhile script is running', version.build, '- halted');

                prompt_for_update();
                return;
            }
        }

        xhr.send();
    }


    function add_menu_item(parent, id, type, name, action, open_externally=false, is_auth=false) {
        let menu_item = document.createElement('li');
        let menu_item_btn = document.createElement(type == 'btn' ? 'button' : 'a');
        menu_item_btn.classList.add(
            is_auth ? 'auth-dropdown-menu-item' : 'dropdown-menu-clickable-item',
            `bleh--menu-item-${id}`
        );
        menu_item_btn.setAttribute(
            type == 'btn' ? 'onclick' : 'href',
            action
        );
        if (open_externally) menu_item_btn.setAttribute('_target', '_blank');
        menu_item_btn.textContent = name;

        menu_item.appendChild(menu_item_btn);
        parent.appendChild(menu_item);
    }


    function patch_masthead(element) {
        let masthead_logo = element.querySelector('.masthead-logo');

        if (!masthead_logo.hasAttribute('data-kate-processed')) {
            masthead_logo.setAttribute('data-kate-processed','true');

            let version_text = document.createElement('a');
            version_text.classList.add('bleh--version');
            version_text.setAttribute('href', `${root}bleh`);
            version_text.textContent = `${version.build}.${version.sku}`;

            masthead_logo.appendChild(version_text);
        }
    }

    function append_nav() {
        let auth_link = document.body.querySelector('.auth-link');

        if (auth_link.hasAttribute('data-bleh'))
            return;
        auth_link.setAttribute('data-bleh', 'true');

        let text = document.createElement('p');
        text.textContent = auth;
        auth_link.appendChild(text);


        let notif_btn = document.body.querySelector('.masthead-nav-control[data-analytics-label="notifications"]');
        let notif_count = notif_btn.querySelector('.notification-count-badge');
        if (notif_count != null) {
            tippy(notif_btn, {
                content: `${notif_count.textContent} notifications`
            });
        } else {
            tippy(notif_btn, {
                content: 'No new notifications'
            });
        }

        let inbox_btn = document.body.querySelector('.masthead-nav-control[data-analytics-label="inbox"]');
        let inbox_count = inbox_btn.querySelector('.notification-count-badge');
        if (inbox_count != null) {
            tippy(inbox_btn, {
                content: `${inbox_count.textContent} messages`
            });
        } else {
            tippy(inbox_btn, {
                content: 'No new messages'
            });
        }

        let inbox_container = document.body.querySelector('.masthead-nav-item:has([data-analytics-label="inbox"])');
        let bleh_container = document.createElement('li');
        bleh_container.classList.add('masthead-nav-item');
        bleh_container.innerHTML = (`
            <a class="masthead-nav-control" href="${root}bleh" data-bleh--label="bleh">
                ${trans[lang].auth_menu.configure_bleh}
            </a>
        `);
        tippy(bleh_container, {
            content: trans[lang].auth_menu.configure_bleh
        });
        inbox_container.after(bleh_container);


        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();
        let user_nav = document.body.querySelectorAll('.auth-dropdown-menu > li')[0];
        let inbox_nav = document.body.querySelectorAll('.auth-dropdown-menu > li')[2];

        document.querySelector('.auth-dropdown-menu').style.setProperty('--url', `url(${my_avi.replace('avatar42s', 'avatar170s')})`);

        if (!inbox_nav.hasAttribute('data-bleh')) {
            inbox_nav.setAttribute('data-bleh','true');
            let profile_link = user_nav.querySelector('a').getAttribute('href');

            let extra_nav = document.createElement('li');
            extra_nav.innerHTML = (`
                <li>
                    <a class="auth-dropdown-menu-item bleh--shortcut-menu-item" data-profile-shortcut="${settings.profile_shortcut}" id="profile_shortcut" href="${root}user/${settings.profile_shortcut}">
                        ${settings.profile_shortcut}
                    </a>
                </li>
                <li>
                    <a class="auth-dropdown-menu-item bleh--library-menu-item" href="${profile_link}/library">
                        <span class="auth-dropdown-item-row">
                            <span class="auth-dropdown-item-left">${trans[lang].auth_menu.library}</span>
                        </span>
                    </a>
                </li>
                <li>
                    <a class="auth-dropdown-menu-item bleh--shouts-menu-item" href="${profile_link}/shoutbox">
                        <span class="auth-dropdown-item-row">
                            <span class="auth-dropdown-item-left">${trans[lang].auth_menu.shouts}</span>
                        </span>
                    </a>
                </li>
                `);

            user_nav.appendChild(extra_nav);
        }

        if (!user_nav.hasAttribute('data-bleh')) {
            user_nav.setAttribute('data-bleh','true');

            let bleh_nav = document.createElement('li');
            bleh_nav.innerHTML = (`
                <li>
                    <button class="auth-dropdown-menu-item bleh--theme-menu-item" id="theme_menu_item" onclick="toggle_theme()">
                        <span class="auth-dropdown-item-row">
                            <span class="auth-dropdown-item-left">${trans[lang].settings.themes.name}</span>
                            <span class="auth-dropdown-item-right" id="theme-value">${trans[lang].settings.themes[settings.theme].name}</span>
                        </span>
                    </button>
                </li>
                ${(settings.feature_flags.dev) ? (`
                <li>
                    <button class="auth-dropdown-menu-item bleh--dev-menu-item" onclick="_update_flag_toggle('dev', this)" aria-checked="true">
                        <span class="auth-dropdown-item-row">
                            <span class="auth-dropdown-item-left">${trans[lang].auth_menu.dev}</span>
                        </span>
                    </button>
                </li>
                `) : ''}
                <li>
                    <a class="auth-dropdown-menu-item bleh--configure-menu-item" href="${root}bleh">
                        <span class="auth-dropdown-item-row">
                            <span class="auth-dropdown-item-left">${trans[lang].auth_menu.configure_bleh}</span>
                        </span>
                    </a>
                </li>
            `);
            user_nav.appendChild(bleh_nav);

            let theme_menu_item = tippy(document.getElementById('theme_menu_item'), {
                theme: 'menu',
                content: (`
                    <button class="dropdown-menu-clickable-item theme-item-in-menu" data-bleh-theme="light" onclick="change_theme_from_menu('light')">
                        ${trans[lang].settings.themes.light.name}
                    </button>
                    <button class="dropdown-menu-clickable-item theme-item-in-menu" data-bleh-theme="dark" onclick="change_theme_from_menu('dark')">
                        ${trans[lang].settings.themes.dark.name}
                    </button>
                    <button class="dropdown-menu-clickable-item theme-item-in-menu" data-bleh-theme="darker" onclick="change_theme_from_menu('darker')">
                        ${trans[lang].settings.themes.darker.name}
                    </button>
                    <button class="dropdown-menu-clickable-item theme-item-in-menu" data-bleh-theme="oled" onclick="change_theme_from_menu('oled')">
                        ${trans[lang].settings.themes.oled.name}
                    </button>
                `),
                allowHTML: true,
                placement: 'left',
                hideOnClick: false,
                interactive: true,
                interactiveBorder: 10,

                onShow(instance) {
                    show_theme_change_in_menu('', instance.popper);
                }
            });
        }


        // language
        let selected_language = document.querySelector('.footer-language--active strong').textContent;
        let language_options = document.querySelectorAll('.footer-language-form');

        let language_menu = document.createElement('div');
        language_menu.classList.add('language-menu');

        let sel_button = document.createElement('button');
        sel_button.classList.add('dropdown-menu-clickable-item', 'lang-item', 'active');
        sel_button.setAttribute('data-lang', non_override_lang);
        sel_button.style.setProperty('--flag-url', `url('https://katelyynn.github.io/bleh/fm/flags/${non_override_lang}.svg')`);
        sel_button.textContent = selected_language;

        language_menu.appendChild(sel_button);

        language_options.forEach((language_option) => {
            let button = language_option.querySelector('button');
            button.classList.remove('mimic-link');
            button.classList.add('dropdown-menu-clickable-item', 'lang-item');
            button.setAttribute('data-lang', button.getAttribute('name'));
            button.style.setProperty('--flag-url', `url('https://katelyynn.github.io/bleh/fm/flags/${button.getAttribute('name')}.svg')`);

            language_menu.appendChild(language_option);
        });

        let language_nav = document.createElement('a');
        language_nav.classList.add('language-nav');
        language_nav.innerHTML = (`
            <span data-lang="${non_override_lang}" style="--flag-url: url('https://katelyynn.github.io/bleh/fm/flags/${non_override_lang}.svg');">${selected_language}</span>
        `);

        tippy(language_nav, {
            theme: 'language-menu',
            content: (`
                ${language_menu.innerHTML}
            `),
            allowHTML: true,
            delay: [100, 50],
            placement: 'bottom',
            //trigger: 'click',
            interactive: true
        });

        let inner = document.body.querySelector('.masthead-nav-wrap');
        let auth_container = inner.querySelector('.site-auth');

        inner.insertBefore(language_nav, auth_container);
    }

    // create blank settings
    function create_settings_template() {
        localStorage.setItem('bleh', JSON.stringify(settings_template));
        return settings_template;
    }

    // load settings
    function load_settings() {
        settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

        // missing? set to default value
        for (let setting in settings_template)
            if (settings[setting] == undefined)
                settings[setting] = settings_template[setting];

        // todo: remove
        if (settings.dev == 1)
            settings.dev = true;

        // save setting into body
        for (let setting in settings) {
            if (
                (setting == 'hue' || setting == 'sat' || setting == 'lit') &&
                settings.hue == settings_base.hue.value &&
                settings.sat == settings_base.sat.value &&
                settings.lit == settings_base.lit.value
            ) continue;

            try {
                document.body.style.setProperty(`--${settings_base[setting].css}`, settings[setting]);
            } catch(e) {}
            document.documentElement.setAttribute(`data-bleh--${setting}`, `${settings[setting]}`);
        }

        load_skus();

        // save to settings
        localStorage.setItem('bleh', JSON.stringify(settings));

        // override theme when browsing listening reports
        if (document.body.classList.contains('user-dashboard-layout'))
            document.documentElement.setAttribute('data-bleh--theme', 'oled');
    }

    // save a setting
    function setting(setting, value) {
        // save value
        settings[setting] = value;
        document.body.style.setProperty(`--${settings_base[setting].css}`, value);
        document.documentElement.setAttribute(`data-bleh--${setting}`, `${value}`);

        // save to settings
        localStorage.setItem('bleh', JSON.stringify(settings));
    }


    // toggle setting
    unsafeWindow.toggle_setting = function(setting) {

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
        let current_theme = settings.theme;

        if (current_theme == 'dark')
            current_theme = 'darker';
        else if (current_theme == 'darker')
            current_theme = 'oled';
        else if (current_theme == 'oled' || current_theme == 'classic')
            current_theme = 'light';
        else if (current_theme == 'light')
            current_theme = 'dark';

        document.getElementById('theme-value').textContent = trans[lang].settings.themes[current_theme].name;
        show_theme_change_in_menu(current_theme);

        // save value
        settings.theme = current_theme;
        document.documentElement.setAttribute(`data-bleh--theme`, `${current_theme}`);

        // save to settings
        localStorage.setItem('bleh', JSON.stringify(settings));
    }

    unsafeWindow.change_theme_from_settings = function(theme) {
        document.getElementById('theme-value').textContent = trans[lang].settings.themes[theme].name;

        // save value
        settings.theme = theme;
        document.documentElement.setAttribute(`data-bleh--theme`, `${theme}`);

        // show in settings
        show_theme_change_in_settings(theme);
        show_theme_change_in_menu(theme);

        // save to settings
        localStorage.setItem('bleh', JSON.stringify(settings));
    }
    unsafeWindow.change_theme_from_menu = function(theme) {
        document.getElementById('theme-value').textContent = trans[lang].settings.themes[theme].name;

        // save value
        settings.theme = theme;
        document.documentElement.setAttribute(`data-bleh--theme`, `${theme}`);

        // show in settings
        show_theme_change_in_menu(theme);

        // save to settings
        localStorage.setItem('bleh', JSON.stringify(settings));
    }


    // patch last.fm settings
    function patch_lastfm_settings(element) {
        patch_settings_profile_tab();
        patch_settings_privacy_tab();
    }


    function patch_settings_profile_tab() {
        let update_picture = document.getElementById('update-picture');

        if (update_picture == undefined)
            return;

        // if we can continue, we are on profile tab
        let token = document.body.querySelector('[name="csrfmiddlewaretoken"]').getAttribute('value');

        patch_settings_profile_panel(token, update_picture);
        patch_settings_charts_panel(token);
    }

    function patch_settings_charts_panel(token) {
        let charts_panel = document.getElementById('update-chart');

        if (charts_panel.hasAttribute('data-kate-processed'))
            return;

        charts_panel.setAttribute('data-kate-processed', 'true');
        charts_panel.classList.add('bleh--panel');

        // get info before destroying
        let original_chart_settings = {
            recent: {
                recent_artwork: document.getElementById('id_show_recent_tracks_artwork').checked,
                count: document.getElementById('id_chart_length_recent_tracks').outerHTML,
                realtime: document.getElementById('id_auto_refresh_recent_tracks').checked
            },
            artists: {
                timeframe: document.getElementById('id_chart_range_top_artists').outerHTML,
                style: document.getElementById('id_chart_style_and_length_top_artists').outerHTML
            },
            albums: {
                timeframe: document.getElementById('id_chart_range_top_albums').outerHTML,
                style: document.getElementById('id_chart_style_and_length_top_albums').outerHTML
            },
            tracks: {
                count: document.getElementById('id_chart_length_top_tracks').outerHTML,
                timeframe: document.getElementById('id_chart_range_top_tracks').outerHTML
            }
        };

        charts_panel.innerHTML = (`
            <h3>${trans[lang].settings.inbuilt.charts.name}</h3>
            <form action="${root}settings#update-chart" name="chart-form" method="post">
                <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
                <div class="inner-preview pad">
                    <div class="tracks recent">
                        <div class="track realtime">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="artist"></div>
                            <div class="time"></div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="artist"></div>
                            <div class="time"></div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="artist"></div>
                            <div class="time"></div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="artist"></div>
                            <div class="time"></div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="artist"></div>
                            <div class="time"></div>
                        </div>
                    </div>
                </div>
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans[lang].settings.inbuilt.charts.recent.count.name}</h5>
                    </div>
                    <div class="select-wrap">
                        ${original_chart_settings.recent.count}
                    </div>
                </div>
                <div class="toggle-container" id="container-recent_artwork">
                    <button class="btn reset" onclick="_reset_inbuilt_item('recent_artwork')">Reset to default</button>
                    <div class="heading">
                        <h5>${trans[lang].settings.inbuilt.charts.recent.artwork.name}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <input class="companion-checkbox" type="checkbox" name="show_recent_tracks_artwork" id="inbuilt-companion-checkbox-recent_artwork">
                        <span class="btn toggle" id="toggle-recent_artwork" onclick="_update_inbuilt_item('recent_artwork')" aria-checked="false">
                            <div class="dot"></div>
                        </span>
                    </div>
                </div>
                <div class="toggle-container" id="container-recent_realtime">
                    <button class="btn reset" onclick="_reset_inbuilt_item('recent_realtime')">Reset to default</button>
                    <div class="heading">
                        <h5>${trans[lang].settings.inbuilt.charts.recent.realtime.name}</h5>
                        <p>${trans[lang].settings.inbuilt.charts.recent.realtime.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <input class="companion-checkbox" type="checkbox" name="auto_refresh_recent_tracks" id="inbuilt-companion-checkbox-recent_realtime">
                        <span class="btn toggle" id="toggle-recent_realtime" onclick="_update_inbuilt_item('recent_realtime')" aria-checked="false">
                            <div class="dot"></div>
                        </span>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="inner-preview pad">
                    <div class="item-grid artist">
                        <div class="grid-primary artist">
                            <div class="grid-item"></div>
                        </div>
                        <div class="grid-mains">
                            <div class="grid-main artist">
                                <div class="grid-item grid-item--extra artist"></div>
                                <div class="grid-item grid-item--extra artist"></div>
                                <div class="grid-item"></div>
                                <div class="grid-item"></div>
                            </div>
                            <div class="grid-main artist">
                                <div class="grid-item grid-item--extra artist"></div>
                                <div class="grid-item grid-item--extra artist"></div>
                                <div class="grid-item"></div>
                                <div class="grid-item"></div>
                            </div>
                        </div>
                    </div>
                    <div class="tracks artist">
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="bar">
                                <div class="fill" style="width: 100%"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="bar">
                                <div class="fill" style="width: 85%"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="bar">
                                <div class="fill" style="width: 60%"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="bar">
                                <div class="fill" style="width: 30%"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="bar">
                                <div class="fill" style="width: 5%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans[lang].settings.inbuilt.charts.artists.timeframe.name}</h5>
                    </div>
                    <div class="select-wrap">
                        ${original_chart_settings.artists.timeframe}
                    </div>
                </div>
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans[lang].settings.inbuilt.charts.artists.style.name}</h5>
                    </div>
                    <div class="select-wrap">
                        ${original_chart_settings.artists.style}
                    </div>
                </div>
                <div class="sep"></div>
                <div class="inner-preview pad">
                    <div class="item-grid album">
                        <div class="grid-primary album">
                            <div class="grid-item"></div>
                        </div>
                        <div class="grid-mains">
                            <div class="grid-main album">
                                <div class="grid-item"></div>
                                <div class="grid-item"></div>
                                <div class="grid-item grid-item--extra album"></div>
                                <div class="grid-item grid-item--extra album"></div>
                            </div>
                            <div class="grid-main album">
                                <div class="grid-item"></div>
                                <div class="grid-item"></div>
                                <div class="grid-item grid-item--extra album"></div>
                                <div class="grid-item grid-item--extra album"></div>
                            </div>
                        </div>
                    </div>
                    <div class="tracks album">
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="bar">
                                <div class="fill" style="width: 100%"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="bar">
                                <div class="fill" style="width: 85%"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="bar">
                                <div class="fill" style="width: 60%"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="bar">
                                <div class="fill" style="width: 30%"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="bar">
                                <div class="fill" style="width: 5%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans[lang].settings.inbuilt.charts.albums.timeframe.name}</h5>
                    </div>
                    <div class="select-wrap">
                        ${original_chart_settings.albums.timeframe}
                    </div>
                </div>
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans[lang].settings.inbuilt.charts.albums.style.name}</h5>
                    </div>
                    <div class="select-wrap">
                        ${original_chart_settings.albums.style}
                    </div>
                </div>
                <div class="sep"></div>
                <div class="inner-preview pad">
                    <div class="tracks">
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="artist"></div>
                            <div class="bar">
                                <div class="fill" style="width: 100%"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="artist"></div>
                            <div class="bar">
                                <div class="fill" style="width: 85%"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="artist"></div>
                            <div class="bar">
                                <div class="fill" style="width: 60%"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="artist"></div>
                            <div class="bar">
                                <div class="fill" style="width: 30%"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="artist"></div>
                            <div class="bar">
                                <div class="fill" style="width: 5%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans[lang].settings.inbuilt.charts.tracks.timeframe.name}</h5>
                    </div>
                    <div class="select-wrap">
                        ${original_chart_settings.tracks.timeframe}
                    </div>
                </div>
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans[lang].settings.inbuilt.charts.tracks.count.name}</h5>
                    </div>
                    <div class="select-wrap">
                        ${original_chart_settings.tracks.count}
                    </div>
                </div>
                <div class="sep"></div>
                <div class="settings-footer">
                    <button type="submit" class="btn-primary">
                        ${trans[lang].settings.save}
                    </button>
                    <input type="hidden" value="chart" name="submit">
                </div>
            </form>
        `);

        for (let category in original_chart_settings) {
            for (let setting in original_chart_settings[category]) {
                update_inbuilt_item(setting, original_chart_settings[category][setting], false);
            }
        }

        let selects = document.body.querySelectorAll('select');
        selects.forEach((select) => {
            select.setAttribute('onchange', `_update_inbuilt_select('${select.getAttribute('id')}', this.value)`);
            update_inbuilt_select(select.getAttribute('id'), select.value);
        })
    }

    unsafeWindow._update_inbuilt_select = function(id, value) {
        update_inbuilt_select(id, value);
    }
    function update_inbuilt_select(id, value) {
        document.documentElement.setAttribute(`data-bleh--inbuilt-${id}`, value);
    }

    function patch_settings_profile_panel(token, update_picture) {
        if (update_picture.hasAttribute('data-kate-processed'))
            return;

        update_picture.setAttribute('data-kate-processed', 'true');
        update_picture.classList.add('bleh--panel');

        let avatar_url = document.body.querySelector('.image-upload-preview img').getAttribute('src');

        let form_display_name = document.getElementById('id_full_name').value;
        let form_website = document.getElementById('id_homepage').value;
        let form_country = document.getElementById('id_country').outerHTML;
        let form_about_me = document.getElementById('id_about_me').textContent;

        document.getElementById('update-profile').outerHTML = '';

        update_picture.innerHTML = (`
            <h3>${trans[lang].settings.inbuilt.profile.name}</h3>
            <div class="profile-container">
                <div class="avatar-side">
                    <div class="avatar image-upload-preview" onclick="_open_avatar_changer('${token}')">
                        <img src="${avatar_url}" alt="Your avatar" loading="lazy">
                        <div class="avatar-overlay"></div>
                    </div>
                </div>
                <div class="info-side">
                    <div class="header-info">
                        <div class="header">
                            <h1>${auth}</h1>
                        </div>
                        <div class="header-title-secondary">
                            <span class="header-title-secondary--pre" id="header-title-display-name--pre"></span>
                            <span class="header-title-display-name" id="header-title-display-name"></span>
                            <!--<span class="header-title-secondary--pre" id="header-scrobble-since--pre">created</span>
                            <span class="header-scrobble-since" id="header-scrobble-since"></span>-->
                        </div>
                    </div>
                    <div class="sub-info">
                        <form action="${root}settings#update-profile" name="profile-form" data-form-type="identity" method="post">
                            <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
                            <div class="info-row">
                                <div class="title">
                                    ${trans[lang].settings.inbuilt.profile.subtitle.name}
                                </div>
                                <div class="input">
                                    <input type="text" name="full_name" value="${form_display_name}" maxlength="36" id="id_full_name" oninput="_update_display_name(this.value)" data-form-type="other">
                                    <div class="tip">${trans[lang].settings.inbuilt.profile.pronoun_tip}</div>
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="title">
                                    ${trans[lang].settings.inbuilt.profile.country}
                                </div>
                                <div class="input">
                                    ${form_country}
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="title">
                                    ${trans[lang].settings.inbuilt.profile.website}
                                </div>
                                <div class="input">
                                    <input type="url" name="homepage" value="${form_website}" id="id_homepage" data-form-type="website">
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="title">
                                    ${trans[lang].settings.inbuilt.profile.about}
                                </div>
                                <div class="input about-me" data-bleh--show-preview="false" id="about_me">
                                    <textarea name="about_me" cols="40" rows="10" class="textarea--s" maxlength="500" id="id_about_me" oninput="_update_about_me_preview(this.value)" data-form-type="other">${form_about_me}</textarea>
                                    <span class="bleh--about-me-preview" id="about_me_preview"></span>
                                    <div class="tip bleh--about-me-preview-only">${trans[lang].settings.inbuilt.profile.toggle_preview.note}</div>
                                </div>
                            </div>
                            <div class="save-row">
                                <span class="btn btn--has-icon btn--has-icon-left btn--toggle-about-me-preview" id="btn--toggle-about-me-preview" onclick="_toggle_about_me_preview()">
                                    ${trans[lang].settings.inbuilt.profile.toggle_preview.name}
                                </span>
                                <div class="form-submit">
                                    <button type="submit" class="btn-primary" data-form-type="action">
                                        ${trans[lang].settings.save}
                                    </button>
                                    <input type="hidden" value="profile" name="submit">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `);


        // about me
        let about_me_box = document.getElementById('id_about_me');
        update_about_me_preview(about_me_box.value);

        // subtitle
        update_display_name(form_display_name);

        // preview
        tippy(document.getElementById('btn--toggle-about-me-preview'), {
            content: trans[lang].settings.inbuilt.profile.toggle_preview.bio
        });
    }

    unsafeWindow._toggle_about_me_preview = function() {
        toggle_about_me_preview();
    }
    function toggle_about_me_preview() {
        let about_me = document.getElementById('about_me');
        if (about_me.getAttribute('data-bleh--show-preview') == 'false')
            about_me.setAttribute('data-bleh--show-preview', 'true');
        else
            about_me.setAttribute('data-bleh--show-preview', 'false');
    }

    unsafeWindow._update_display_name = function(value) {
        update_display_name(value);
    }
    function update_display_name(value) {
        document.getElementById('header-title-display-name').textContent = value;

        // pronouns?
        let pronouns = use_pronouns(value);

        document.getElementById('header-title-display-name--pre').textContent = pronouns ? trans[lang].profile.display_name.pronouns : trans[lang].profile.display_name.aka;
    }


    function use_pronouns(value) {
        // no spaces, easier to detect
        value = value.replaceAll(' ', '');

        if (value.startsWith('she/') ||
            value.startsWith('he/') ||
            value.startsWith('they/') ||
            value.startsWith('it/') ||
            value.startsWith('xe/') ||
            value.startsWith('any/')
        ) return true;

        return false;
    }


    unsafeWindow._open_avatar_changer = function(token) {
        open_avatar_changer(token);
    }
    function open_avatar_changer(token) {
        create_window('edit_avatar',trans[lang].settings.inbuilt.profile.avatar.name,`
            <div class="bleh--upload-avatar-container">
                <form class="avatar-upload-form bleh--upload-avatar-form" action="${root}settings" name="avatar-form" method="post" enctype="multipart/form-data">
                    <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
                    <div class="form-group form-group--avatar js-form-group">
                        <div class="js-form-group-controls form-group-controls">
                            <span class="btn-secondary btn primary btn-file" data-kate-processed="true">
                            Choose file
                                <input type="file" name="avatar" data-require="components/file-input" data-file-input-copy="Choose file" data-no-file-copy="No file chosen" accept="image/*" required="" id="id_avatar" data-kate-processed="true">
                            </span>
                        </div>
                        ${trans[lang].settings.inbuilt.profile.avatar.upload}
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn-primary" onclick="_save_avatar_changer()">
                            ${trans[lang].settings.save}
                        </button>
                        <input type="hidden" value="avatar" name="submit">
                    </div>
                </form>
                <form class="image-remove-form bleh--upload-avatar-form" action="${root}settings/avatar/delete" method="post">
                    <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
                    <div class="form-group">
                        <button class="mimic-link image-upload-remove" type="submit" value="delete-avatar" name="delete-avatar">Delete picture</button>
                        ${trans[lang].settings.inbuilt.profile.avatar.delete}
                    </div>
                    <div class="modal-footer">
                        <button class="btn" onclick="_kill_window('edit_avatar')">${trans[lang].settings.cancel}</button>
                    </div>
                </form>
            </div>
            `);
    }


    unsafeWindow._save_avatar_changer = function() {
        document.getElementById('bleh--window-edit_avatar--body').classList.add('modal-processing');

        setTimeout(function() {
            kill_window('edit_avatar')
        }, 5000);
    }


    unsafeWindow._update_about_me_preview = function(value) {
        update_about_me_preview(value);
    }
    function update_about_me_preview(value) {
        let converter = new showdown.Converter({
            emoji: true,
            excludeTrailingPunctuationFromURLs: true,
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
        .replace(/([@])([a-zA-Z0-9_]+)/g, `[$1$2](${root}user/$2)`)
        .replace(/\[artist\]([a-zA-Z0-9]+)\[\/artist\]/g, `[$1](${root}music/$1)`)
        .replace(/\[album artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/album\]/g, `[$2](${root}music/$1/$2)`)
        .replace(/\[track artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/track\]/g, `[$2](${root}music/$1/_/$2)`)
        .replace(/https:\/\/open\.spotify\.com\/user\/([A-Za-z0-9]+)\?si=([A-Za-z0-9]+)/g, '[@$1](https://open.spotify.com/user/$1)')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;'));
        document.getElementById('about_me_preview').innerHTML = parsed_body;
    }


    // privacy
    function patch_settings_privacy_tab() {
        let privacy_panel = document.getElementById('privacy');

        if (privacy_panel == undefined)
            return;

        // if we can continue, we are on privacy tab
        let token = document.body.querySelector('[name="csrfmiddlewaretoken"]').getAttribute('value');

        patch_settings_privacy_panel(token, privacy_panel);
    }

    function patch_settings_privacy_panel(token, privacy_panel) {
        if (privacy_panel.hasAttribute('data-kate-processed'))
            return;

        privacy_panel.setAttribute('data-kate-processed', 'true');
        privacy_panel.classList.add('bleh--panel');

        // get info before destroying
        let original_privacy_settings = {
            recent_listening: document.getElementById('id_hide_realtime').checked,
            receiving_msgs: document.getElementById('id_message_privacy').outerHTML,
            disable_shoutbox: document.getElementById('id_shoutbox_disabled').checked
        }

        privacy_panel.innerHTML = (`
            <h3>${trans[lang].settings.inbuilt.privacy.name}</h3>
            <form action="${root}settings/privacy" name="privacy" method="post">
                <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
                <div class="inner-preview pad">
                    <div class="tracks recent_listening">
                        <div class="track realtime">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="artist"></div>
                            <div class="time"></div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="artist"></div>
                            <div class="time"></div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="artist"></div>
                            <div class="time"></div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="artist"></div>
                            <div class="time"></div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="artist"></div>
                            <div class="time"></div>
                        </div>
                    </div>
                </div>
                <div class="toggle-container" id="container-recent_listening">
                    <button class="btn reset" onclick="_reset_inbuilt_item('recent_listening')">Reset to default</button>
                    <div class="heading">
                        <h5>${trans[lang].settings.inbuilt.privacy.recent_listening.name}</h5>
                        <p>${trans[lang].settings.inbuilt.privacy.recent_listening.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <input class="companion-checkbox" type="checkbox" name="hide_realtime" id="inbuilt-companion-checkbox-recent_listening">
                        <span class="btn toggle" id="toggle-recent_listening" onclick="_update_inbuilt_item('recent_listening')" aria-checked="false">
                            <div class="dot"></div>
                        </span>
                    </div>
                </div>
                <div class="sep"></div>
                <h5>Who can send you messages?</h5>
                <div class="primary-selections">
                    ${original_privacy_settings.receiving_msgs}
                    <div class="btn primary-selection" id="primary-selection-receiving_msgs-everyone" onclick="_update_inbuilt_selection('id_message_privacy', 0)">
                        <h5>${trans[lang].settings.inbuilt.privacy.receiving_msgs.settings.everyone.name}</h5>
                        <p>${trans[lang].settings.inbuilt.privacy.receiving_msgs.settings.everyone.bio}</p>
                    </div>
                    <div class="btn primary-selection" id="primary-selection-receiving_msgs-neighbours" onclick="_update_inbuilt_selection('id_message_privacy', 1)">
                        <h5>${trans[lang].settings.inbuilt.privacy.receiving_msgs.settings.neighbours.name}</h5>
                        <p>${trans[lang].settings.inbuilt.privacy.receiving_msgs.settings.neighbours.bio}</p>
                    </div>
                    <div class="btn primary-selection" id="primary-selection-receiving_msgs-follow" onclick="_update_inbuilt_selection('id_message_privacy', 2)">
                        <h5>${trans[lang].settings.inbuilt.privacy.receiving_msgs.settings.follow.name}</h5>
                        <p>${trans[lang].settings.inbuilt.privacy.receiving_msgs.settings.follow.bio}</p>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="inner-preview pad">
                    <div class="shouts">
                        <div class="shout">
                            <div class="avatar-side">
                                <div class="shout-avatar-placeholder"></div>
                            </div>
                            <div class="info-side">
                                <div class="header">
                                    <div class="shout-username"></div>
                                    <div class="shout-time"></div>
                                </div>
                                <div class="shout-contents"></div>
                                <div class="shout-contents"></div>
                            </div>
                        </div>
                        <div class="shout">
                            <div class="avatar-side">
                                <div class="shout-avatar-placeholder"></div>
                            </div>
                            <div class="info-side">
                                <div class="header">
                                    <div class="shout-username"></div>
                                    <div class="shout-time"></div>
                                </div>
                                <div class="shout-contents"></div>
                                <div class="shout-contents"></div>
                            </div>
                        </div>
                        <div class="shout">
                            <div class="avatar-side">
                                <div class="shout-avatar-placeholder"></div>
                            </div>
                            <div class="info-side">
                                <div class="header">
                                    <div class="shout-username"></div>
                                    <div class="shout-time"></div>
                                </div>
                                <div class="shout-contents"></div>
                                <div class="shout-contents"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="toggle-container" id="container-disable_shoutbox">
                    <button class="btn reset" onclick="_reset_inbuilt_item('disable_shoutbox')">Reset to default</button>
                    <div class="heading">
                        <h5>${trans[lang].settings.inbuilt.privacy.disable_shoutbox.name}</h5>
                        <p>${trans[lang].settings.inbuilt.privacy.disable_shoutbox.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <input class="companion-checkbox" type="checkbox" name="shoutbox_disabled" id="inbuilt-companion-checkbox-disable_shoutbox">
                        <span class="btn toggle" id="toggle-disable_shoutbox" onclick="_update_inbuilt_item('disable_shoutbox')" aria-checked="false">
                            <div class="dot"></div>
                        </span>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="settings-footer">
                    <button type="submit" class="btn-primary">
                        ${trans[lang].settings.save}
                    </button>
                    <input type="hidden" value="privacy" name="submit">
                </div>
            </form>
        `)

        for (let setting in original_privacy_settings) {
            update_inbuilt_item(setting, original_privacy_settings[setting], false);
        }

        let selects = document.body.querySelectorAll('select');
        selects.forEach((select) => {
            select.setAttribute('onchange', `_update_inbuilt_select('${select.getAttribute('id')}', this.value)`);
            update_inbuilt_select(select.getAttribute('id'), select.value);
        });
    }


    unsafeWindow._update_inbuilt_selection = function(id, index) {
        document.getElementById(id).selectedIndex = index;
        update_inbuilt_select(id, document.getElementById(id).value);
    }




    // patch profile pages
    function patch_profile(element) {
        let profile_header = element.querySelector('.header--user .header-title-label-wrap');

        if (profile_header == null)
            return;

        patch_profile_following();
        patch_profile_tracks();

        let profile_name = profile_header.querySelector('a');
        let is_own_profile = (profile_name.textContent == auth);

        if (is_own_profile)
            document.body.querySelector('.header--user').setAttribute('data-is-own-profile', 'true');

        // profile note
        let profile_notes = JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
        let profile_note = profile_notes[profile_name.textContent];

        let profile_has_note = false;
        if (profile_note != undefined)
            profile_has_note = true;

        if (!profile_header.hasAttribute('data-kate-processed')) {
            profile_header.setAttribute('data-kate-processed', 'true');

            let adaptive_skin = document.body.querySelector('.adaptive-skin-container');
            let content_top = adaptive_skin.querySelector('.content-top');

            // has header?
            if (content_top.querySelector('h1') == null && content_top.querySelector('.navlist') == null)
                adaptive_skin.removeChild(content_top);

            if (settings.feature_flags.redesigned_profile_header != false)
                redesign_profile_header(profile_name, is_own_profile);

            patch_profile_obsession();

            // is this their profile?
            if (is_own_profile) {
                // make avatar clickable
                let header_avatar = document.querySelector('.header-avatar .avatar');

                let avatar_link = document.createElement('a');
                avatar_link.classList.add('bleh--avatar-clickable-link');
                avatar_link.href = `${root}settings`;
                header_avatar.appendChild(avatar_link);
            } else {
                // is there a follow button?
                let header_avatar = document.querySelector('.header--overview .header-avatar');

                if (header_avatar != undefined && settings.feature_flags.redesigned_profile_header == false) {
                    let header_follow_btn = header_avatar.querySelector('form');

                    if (header_follow_btn == undefined) {
                        // user is on their ignore list
                        let toggle_btn = document.createElement('button');
                        toggle_btn.classList.add('toggle-button','header-follower-btn','header-follower-btn--denied');
                        toggle_btn.textContent = trans[lang].profile.on_ignore_list;

                        tippy(toggle_btn, {
                            content: trans[lang].profile.on_ignore_list
                        });
                        header_avatar.appendChild(toggle_btn);
                    } else {
                        let inner_btn = header_follow_btn.querySelector('button');
                        let inner_btn_tooltip = tippy(inner_btn, {
                            content: inner_btn.textContent
                        });

                        console.info(inner_btn_tooltip);

                        inner_btn.addEventListener('click', () => {
                            window.setTimeout(() => {
                                inner_btn_tooltip.setContent(inner_btn.textContent);
                            }, 50);
                        });
                    }
                }
            }

            // badges
            console.info('bleh - checking if user', profile_name.textContent, 'has any badges');
            if (profile_badges.hasOwnProperty(profile_name.textContent)) {
                if (!Array.isArray(profile_badges[profile_name.textContent])) {
                    // default
                    console.info('bleh - user has 1 badge', profile_badges[profile_name.textContent]);
                    let this_badge = profile_badges[profile_name.textContent];

                    let badge = document.createElement('span');
                    badge.classList.add('label',`user-status--bleh-${this_badge.type}`,`user-status--bleh-user-${profile_name.textContent}`);
                    badge.textContent = this_badge.name;
                    profile_header.appendChild(badge);
                } else {
                    // multiple
                    console.info('bleh - user has multiple badges', profile_badges[profile_name.textContent]);
                    for (let badge_entry in profile_badges[profile_name.textContent]) {
                        let this_badge = profile_badges[profile_name.textContent][badge_entry];

                        let badge = document.createElement('span');
                        badge.classList.add('label',`user-status--bleh-${this_badge.type}`,`user-status--bleh-user-${profile_name.textContent}`);
                        badge.textContent = this_badge.name;
                        profile_header.appendChild(badge);
                    }
                }
            }

            // me :3
            if (cute.includes(profile_name.textContent)) {
                profile_name.classList.add('bleh--name-is-cute');
            }

            // secondary text
            let profile_sub_text = element.querySelector('.header-title-secondary');

            if (profile_sub_text == undefined)
                return;

            let display_name = profile_sub_text.querySelector('.header-title-display-name');
            let scrobble_since = profile_sub_text.querySelector('.header-scrobble-since');
            scrobble_since.textContent = scrobble_since.textContent.replace(trans[lang].profile.created.replace,'');

            // pronouns?
            let pronouns = use_pronouns(display_name.textContent);

            let display_name_pre = document.createElement('span');
            display_name_pre.classList.add('header-title-secondary--pre');
            display_name_pre.textContent = pronouns ? trans[lang].profile.display_name.pronouns : trans[lang].profile.display_name.aka;
            profile_sub_text.insertBefore(display_name_pre, display_name);

            let scrobble_since_pre = document.createElement('span');
            scrobble_since_pre.classList.add('header-title-secondary--pre');
            scrobble_since_pre.textContent = trans[lang].profile.created.name;
            profile_sub_text.insertBefore(scrobble_since_pre, scrobble_since);
        }

        let about_me_sidebar = element.querySelector('.about-me-sidebar');

        if (about_me_sidebar == undefined)
            return;

        if (!about_me_sidebar.hasAttribute('data-kate-processed')) {
            about_me_sidebar.setAttribute('data-kate-processed','true');

            if (settings.bio_markdown) {
                // parse body
                let about_me_text = about_me_sidebar.querySelector('p');
                let converter = new showdown.Converter({
                    emoji: true,
                    excludeTrailingPunctuationFromURLs: true,
                    ghMentions: true,
                    ghMentionsLink: `${root}user/{u}`,
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
                .replace(/([@])([a-zA-Z0-9_]+)/g, `[$1$2](${root}user/$2)`)
                .replace(/\[artist\]([a-zA-Z0-9]+)\[\/artist\]/g, `[$1](${root}music/$1)`)
                .replace(/\[album artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/album\]/g, `[$2](${root}music/$1/$2)`)
                .replace(/\[track artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/track\]/g, `[$2](${root}music/$1/_/$2)`)
                .replace(/https:\/\/open\.spotify\.com\/user\/([A-Za-z0-9]+)\?si=([A-Za-z0-9]+)/g, '[@$1](https://open.spotify.com/user/$1)')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;'));
                about_me_text.innerHTML = parsed_body;
            }

            // add note button
            if (!profile_has_note) {
                let add_note_button = document.createElement('button');
                add_note_button.classList.add('btn','bleh--add-note');
                add_note_button.setAttribute('id','bleh--add-note');
                add_note_button.textContent = 'Add note';
                add_note_button.setAttribute('onclick',`_add_profile_note('${profile_name.textContent}',${profile_has_note})`);

                tippy(add_note_button, {
                    content: trans[lang].settings.profiles.notes.edit_user.replace('{u}', profile_name.textContent)
                });

                let about_me_header = about_me_sidebar.querySelector('h2');
                about_me_header.appendChild(add_note_button);
            } else {
                create_profile_note_panel(profile_name.textContent, true);
            }
        }
    }

    function patch_profile_obsession() {
        let header_featured_track = document.body.querySelector('.featured-item-details');

        if (header_featured_track == null)
            return;

        let name_elem = header_featured_track.querySelector('.featured-item-name');
        let artist_elem = header_featured_track.querySelector('.featured-item-artist');

        let name = correct_item_by_artist(name_elem.textContent.trim(), artist_elem.textContent.trim());
        let artist = correct_artist(artist_elem.textContent.trim());

        name_elem.textContent = name;
        artist_elem.textContent = artist;
    }

    function redesign_profile_header(profile_name, is_own_profile) {
        let base_header = document.body.querySelector('.header-info-secondary');

        if (base_header == null)
            return;

        profile_name = profile_name.textContent.trim();

        let header_meta = base_header.querySelector('.header-metadata');
        header_meta.classList.add('profile-header-metadata-legacy');

        // acquire info
        let metadata = header_meta.querySelectorAll('.header-metadata-display');

        let scrobbles = 0;
        let average = 0;
        let artists = 0;
        let loved = 0;

        metadata.forEach((item, index) => {
            if (index == 0) {
                let para = item.querySelector('p');

                scrobbles = clean_number(para.textContent.trim());
                average = para.getAttribute('title');
            } else if (index == 1) {
                artists = clean_number(item.textContent.trim());
            } else if (index == 2) {
                loved = clean_number(item.textContent.trim());
            }
        });


        // taste
        let taste = '';
        let taste_percentage = '';
        let taste_artists = [];
        let profile_avi = '';

        if (!is_own_profile) {
            let taste_meter = base_header.querySelector('.tasteometer');

            taste = taste_meter.classList[1].replace('tasteometer-compat-', '');

            let artists = taste_meter.querySelectorAll('a');
            artists.forEach((artist) => {
                taste_artists.push(correct_artist(artist.textContent.trim()));
            });

            profile_avi = document.body.querySelector('.header-avatar img');
            if (profile_avi != null)
                profile_avi = profile_avi.getAttribute('src');
            else
                profile_avi = '';

            taste_percentage = taste_meter.querySelector('.tasteometer-viz').getAttribute('title');
            if (taste_percentage == '99%')
                taste_percentage = '100%';
        }


        // create new
        let profile_header = document.createElement('div');
        profile_header.classList.add('profile-top-header', 'view-buttons');

        if (!is_own_profile) {
            // follow
            let follow_wrap = document.body.querySelector('.header-avatar .class > div');

            if (follow_wrap != null) {
                let follow_btn = follow_wrap.querySelector('button');
                follow_btn.classList.add('btn', 'profile-top-item', 'profile-top-item--follow', 'view-item');
                follow_btn.classList.remove('toggle-button', 'header-follower-btn');
                profile_header.appendChild(follow_wrap);

                tippy(follow_btn, {
                    content: follow_btn.textContent
                });

                follow_btn.addEventListener('click', () => {
                    window.setTimeout(() => {
                        follow_btn._tippy.setContent(follow_btn.textContent);
                    }, 50);
                });
            } else {
                // ignore list
                let follow_placeholder = document.createElement('button');
                follow_placeholder.classList.add('btn', 'profile-top-item', 'profile-top-item--follow', 'view-item');
                follow_placeholder.textContent = trans[lang].profile.cannot_follow_user;

                follow_placeholder.setAttribute('data-ignored', 'true');

                tippy(follow_placeholder, {
                    content: trans[lang].profile.on_ignore_list
                });

                profile_header.appendChild(follow_placeholder);
            }

            // shortcut
            create_profile_top_item(profile_header, {
                name: profile_name,
                type: 'shortcut',
                link: `_set_profile_as_shortcut(this, '${profile_name}')`,
                action: 'button'
            });
        } else {
            // edit
            create_profile_top_item(profile_header, {
                name: profile_name,
                type: 'edit',
                link: `${root}settings`
            });
        }

        let listen_divider = document.createElement('div');
        listen_divider.classList.add('listen-divider');

        profile_header.appendChild(listen_divider);

        create_profile_top_item(profile_header, {
            name: profile_name,
            text: scrobbles,
            type: 'scrobbles',
            link: `${root}user/${profile_name}/library`
        });
        create_profile_top_item(profile_header, {
            name: profile_name,
            text: artists,
            type: 'artists',
            link: `${root}user/${profile_name}/library/artists`
        });
        create_profile_top_item(profile_header, {
            name: profile_name,
            text: loved,
            type: 'loved',
            link: `${root}user/${profile_name}/loved`
        });

        if (!is_own_profile) {
            // taste
            create_profile_top_item(profile_header, {
                name: profile_name,
                type: 'taste',
                link: `${root}user/${profile_name}/library/artists?date_preset=LAST_7_DAYS&page=1`,
                taste: taste,
                artists: taste_artists,
                avi: profile_avi,
                percent: taste_percentage
            });
        }

        base_header.appendChild(profile_header);
    }

    function create_profile_top_item(parent, {name, link, text='', type, taste='', artists=[], avi='', percent='', action=''}) {
        console.info('bleh - creating profile top item', name, link, text);

        let listen_item = document.createElement((action != 'button') ? 'a' : 'button');
        listen_item.classList.add('btn', 'profile-top-item', `profile-top-item--${type}`, 'view-item');

        if (action != 'button') {
            listen_item.setAttribute('href', link);
            listen_item.setAttribute('target', '_blank');
        } else {
            listen_item.setAttribute('onclick', link);
        }

        if (type != 'taste') {
            text = text.toLocaleString(lang);
            listen_item.innerHTML = text;
        } else {
            // taste
            listen_item.setAttribute('data-taste', taste);
            listen_item.style.setProperty('--data-taste-percent', percent);
            listen_item.innerHTML = (`
                <img class="view-item-avatar" src="${avi}" alt="${name}">
                <img class="view-item-avatar" src="${my_avi}" alt="${auth}">
                <!--<div class="taste-badge">${trans[lang].profile.taste_meter.level[taste]}</div>-->
                <div class="taste-badge">${percent}</div>
                ${(artists.length == 1) ? trans[lang].profile.taste_meter.you_share_1.replace('{artist}', artists[0]) : ''}
                ${(artists.length == 2) ? trans[lang].profile.taste_meter.you_share_2.replace('{artist1}', artists[0]).replace('{artist2}', artists[1]) : ''}
                ${(artists.length == 3) ? trans[lang].profile.taste_meter.you_share_3.replace('{artist1}', artists[0]).replace('{artist2}', artists[1]).replace('{artist3}', artists[2]) : ''}
            `);
        }

        parent.appendChild(listen_item);

        if (type == 'shortcut') {
            if (name == settings.profile_shortcut) {
                listen_item.setAttribute('data-is-shortcut', 'true');
                listen_item.removeAttribute('onclick');
                tippy(listen_item, {
                    content: trans[lang].profile.shortcut.remove
                });
            } else {
                listen_item.setAttribute('data-is-shortcut', 'false');
                tippy(listen_item, {
                    content: trans[lang].profile.shortcut.add
                });
            }

            return;
        }

        tippy(listen_item, {
            content: trans[lang].profile[type]
        });
    }

    function patch_profile_tracks() {
        // tracklist
        let tracklist_panel = document.getElementById('recent-tracks-section');

        if (tracklist_panel == null)
            return;

        if (tracklist_panel.hasAttribute('data-kate-processed'))
            return;
        tracklist_panel.setAttribute('data-kate-processed', 'true');

        let refresh_btn = document.createElement('button');
        refresh_btn.classList.add('refresh-tracklist-btn');
        refresh_btn.textContent = 'Refresh';
        refresh_btn.setAttribute('onclick', '_refresh_tracks(this)');

        tippy(refresh_btn, {
            content: trans[lang].music.refresh_tracks
        });

        tracklist_panel.appendChild(refresh_btn);
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
            <h2>${trans[lang].settings.profiles.notes.header}</h2>
            <div class="content-form">
                <textarea id="bleh--profile-note" placeholder="${trans[lang].settings.profiles.notes.placeholder}">${JSON.parse(localStorage.getItem('bleh_profile_notes'))[username]}</textarea>
            </div>
            <div class="actions">
                <button class="btn" onclick="_clear_profile_note('${username}')">${trans[lang].settings.clear}</button>
                <button class="btn primary" onclick="_save_profile_note('${username}')">${trans[lang].settings.save}</button>
            </div>
            `);
        } else {
            note_panel.innerHTML = (`
            <h2>Your notes</h2>
            <div class="content-form">
                <textarea id="bleh--profile-note" placeholder="${trans[lang].settings.profiles.notes.placeholder}"></textarea>
            </div>
            <div class="actions">
                <button class="btn" onclick="_clear_profile_note('${username}')">${trans[lang].settings.clear}</button>
                <button class="btn primary" onclick="_save_profile_note('${username}')">${trans[lang].settings.save}</button>
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


    // patch following
    function patch_profile_following() {
        // this happens on your main profile, no matter the tab
        let following_tab = document.body.querySelector('.secondary-nav-item--following');
        let following_tab_html = following_tab.outerHTML;
        if (following_tab == undefined)
            return;

        if (following_tab.hasAttribute('data-kate-processed'))
            return;

        following_tab.setAttribute('data-kate-processed', 'true');
        following_tab.querySelector('a').textContent = trans[lang].profile.friends.name;


        // the rest happens on a following/followers page
        let on_following_page = document.body.classList.contains('namespace--user_following');
        let on_followers_page = document.body.classList.contains('namespace--user_followers');
        let on_neighbours_page = document.body.classList.contains('namespace--user_neighbours');

        if (!on_following_page && !on_followers_page && !on_neighbours_page)
            return;

        //let following_tab = document.body.querySelector('.secondary-nav-item--following');
        let followers_tab = document.body.querySelector('.secondary-nav-item--followers');
        let followers_tab_html = followers_tab.outerHTML;
        let neighbours_tab = document.body.querySelector('.secondary-nav-item--neighbours');
        let neighbours_tab_html = neighbours_tab.outerHTML;

        let tab = undefined;
        if (on_followers_page)
            tab = followers_tab;
        else if (on_following_page)
            tab = following_tab;
        else
            tab = neighbours_tab;

        tab.querySelector('a').textContent = trans[lang].profile.friends.name;


        let adaptive_skin = document.body.querySelector('.adaptive-skin-container');
        let page_content = adaptive_skin.querySelector('.page-content');


        // create nav
        let follow_nav = document.createElement('div');
        follow_nav.classList.add('bleh--nav-wrap', 'bleh--friends-nav');
        follow_nav.innerHTML = (`
            <nav class="navlist secondary-nav">
                <ul class="navlist-items bleh--navlist-items">
                    ${following_tab_html}
                    ${followers_tab_html}
                    ${neighbours_tab_html}
                </ul>
            </nav>
        `);

        adaptive_skin.insertBefore(follow_nav, page_content);


        // view-related buttons
        let col_main = page_content.querySelector('.col-main');
        if (col_main == null)
            col_main = page_content.querySelector('.neighbours-items-section');

        col_main.classList.add('friends-col-main');

        let view_buttons = document.createElement('div');
        view_buttons.classList.add('view-buttons-wrapper');
        view_buttons.innerHTML = (`
            <div class="view-buttons">
                <button class="btn view-item" id="toggle-list_view-1" data-toggle="list_view" data-toggle-value="1" onclick="_update_item('list_view', 1)">
                    Grid
                </button>
                <button class="btn view-item" id="toggle-list_view-0" data-toggle="list_view" data-toggle-value="0" onclick="_update_item('list_view', 0)">
                    List
                </button>
            </div>
        `);
        col_main.insertBefore(view_buttons, col_main.firstElementChild);

        refresh_all();
    }


    // patch shouts
    function patch_shouts(element) {
        let shouts = element.querySelectorAll('.shout:not([data-kate-processed])');

        shouts.forEach((shout) => {
            try {
                shout.setAttribute('data-kate-processed', 'true');

                let shout_name = shout.querySelector('.shout-user a');

                if (shout_name == null)
                    return;
                shout_name = shout_name.textContent;

                let shout_avatar = shout.querySelector('.shout-user-avatar');

                patch_avatar(shout_avatar, shout_name, 'shout');

                if (settings.shout_markdown) {
                    let shout_body = shout.querySelector('.shout-body p');

                    let converter = new showdown.Converter({
                        emoji: true,
                        excludeTrailingPunctuationFromURLs: true,
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
                    .replace(/([@])([a-zA-Z0-9_]+)/g, `[$1$2](${root}user/$2)`)
                    .replace(/\[artist\]([a-zA-Z0-9]+)\[\/artist\]/g, `[$1](${root}music/$1)`)
                    .replace(/\[album artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/album\]/g, `[$2](${root}music/$1/$2)`)
                    .replace(/\[track artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/track\]/g, `[$2](${root}music/$1/_/$2)`)
                    .replace(/https:\/\/open\.spotify\.com\/user\/([A-Za-z0-9]+)\?si=([A-Za-z0-9]+)/g, '[@$1](https://open.spotify.com/user/$1)')
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;'));
                    console.log(shout_body.textContent, parsed_body);
                    shout_body.innerHTML = parsed_body;
                }
            } catch(e) {
                deliver_notif('a shout on this page failed to be modified :(');
                console.error('bleh - a shout failed to patch', e);
            }
        });

        // enter a shout field
        let shout_forms = document.querySelectorAll('.shout-form:not([data-kate-processed])');
        shout_forms.forEach((shout_form) => {
            shout_form.setAttribute('data-kate-processed', 'true');
            let shout_avatar = shout_form.querySelector('.shout-user-avatar');

            patch_avatar(shout_avatar, auth);
        });
    }

    unsafeWindow._show_hidden_shout = function(shout_id) {
        document.getElementById(`bleh--shout-${shout_id}`).setAttribute('data-bleh--shout-expanded','true');
    }


    // patch avatar
    function patch_avatar(element, name, type = '') {
        if (!element.hasAttribute('data-kate-processed')) {
            element.setAttribute('data-kate-processed', 'true');

            if (profile_badges.hasOwnProperty(name)) {
                // remove pre-existing badge
                let pre_existing_badge = element.querySelector('.avatar-status-dot');
                if (pre_existing_badge !== null)
                    element.removeChild(pre_existing_badge);

                element.setAttribute('title','');

                let this_badge = profile_badges[name];
                if (!Array.isArray(profile_badges[name])) {
                    // default
                    console.info('bleh - user has 1 badge', profile_badges[name]);
                } else {
                    // multiple
                    console.info('bleh - user has multiple badges', profile_badges[name]);
                    let badges_length = Object.keys(profile_badges[name]).length - 1;
                    this_badge = profile_badges[name][badges_length];
                    console.info('bleh - using badge', badges_length, profile_badges[name][badges_length], 'as primary badge');
                }

                // make new badge
                let badge = document.createElement('span');
                badge.classList.add('avatar-status-dot',`user-status--bleh-${this_badge.type}`,`user-status--bleh-user-${name}`);
                element.appendChild(badge);

                tippy(element, {
                    theme: 'user',
                    content: (`
                        <div class="image">
                            <div class="inner-image">
                                ${element.querySelector('img').outerHTML}
                            </div>
                        </div>
                        <div class="info">
                            <h5 class="title ${(cute.includes(name)) ? 'bleh--name-is-cute-less' : ''}">${name}</h5>
                            <p class="descriptor">Top Badge</p>
                            <p class="badge user-status--bleh-${this_badge.type} user-status--bleh-user-${name}" data-badge-type="${this_badge.type}" data-badge-user="${name}">${this_badge.name}</p>
                        </div>
                    `),
                    allowHTML: true,
                    delay: [100, 50],
                    placement: 'bottom'
                });
            } else {
                let pre_existing_badge = element.querySelector('.avatar-status-dot');
                if (pre_existing_badge == null) {
                    tippy(element, {
                        theme: 'user',
                        content: (`
                            <div class="image">
                                <div class="inner-image">
                                    ${element.querySelector('img').outerHTML}
                                </div>
                            </div>
                            <div class="info">
                                <h5 class="title ${(cute.includes(name)) ? 'bleh--name-is-cute-less' : ''}">${name}</h5>
                            </div>
                        `),
                        allowHTML: true,
                        delay: [100, 50],
                        placement: 'bottom'
                    });
                } else {
                    tippy(element, {
                        theme: 'user',
                        content: (`
                            <div class="image">
                                <div class="inner-image">
                                    ${element.querySelector('img').outerHTML}
                                </div>
                            </div>
                            <div class="info">
                                <h5 class="title ${(cute.includes(name)) ? 'bleh--name-is-cute-less' : ''}">${name}</h5>
                                <p class="descriptor">Top Badge</p>
                                <p class="badge ${pre_existing_badge.classList[1]}">${element.getAttribute('title')}</p>
                            </div>
                        `),
                        allowHTML: true,
                        delay: [100, 50],
                        placement: 'bottom'
                    });
                    element.setAttribute('title', '');
                }
            }
        }
    }




    // artist ranks
    function patch_artist_ranks(element) {

        if (settings.colourful_counts) {
            patch_artist_ranks_in_grid_view(document.body);
        }
    }

    function clean_number(string) {
        return parseInt(string
        .replaceAll(',','')
        .replaceAll('.','')
        );
    }

    function patch_artist_ranks_in_grid_view(element) {
        let artist_statistics = element.querySelectorAll('.grid-items-item-aux-text a');

        if (artist_statistics == undefined)
            return;

        artist_statistics.forEach((artist_statistic) => {
            if (!artist_statistic.hasAttribute('data-kate-processed')) {
                artist_statistic.setAttribute('data-kate-processed','true');

                if (!artist_statistic.getAttribute('href').endsWith('DAYS') && !artist_statistic.classList.contains('grid-items-item-aux-block')) {
                    console.info('bleh - artist grid plays match');

                    let scrobbles = clean_number(artist_statistic.textContent.replace(` ${trans[lang].statistics.plays.name}`,''));
                    let parsed_scrobble_as_rank = parse_scrobbles_as_rank(scrobbles);

                    artist_statistic.setAttribute('data-bleh--scrobble-milestone',parsed_scrobble_as_rank.milestone);
                    artist_statistic.style.setProperty('--hue',parsed_scrobble_as_rank.hue);
                    artist_statistic.style.setProperty('--sat',parsed_scrobble_as_rank.sat);
                    artist_statistic.style.setProperty('--lit',parsed_scrobble_as_rank.lit);
                }
            }
        });
    }

    function patch_artist_ranks_in_list_view(track) {
        let count_bar = track.querySelector('.chartlist-count-bar');

        if (count_bar == undefined)
            return;

        let count_bar_link = count_bar.querySelector('.chartlist-count-bar-link');
        if (count_bar_link.getAttribute('href').endsWith('DAYS'))
            return;

        let count = clean_number(count_bar.querySelector('.chartlist-count-bar-value').textContent.trim().replace(' scrobbles',''));

        if (!count_bar.hasAttribute('data-kate-processed')) {
            count_bar.setAttribute('data-kate-processed','true');

            let parsed_scrobble_as_rank = parse_scrobbles_as_rank(count);

            count_bar.setAttribute('data-bleh--scrobble-milestone',parsed_scrobble_as_rank.milestone);
            count_bar.style.setProperty('--hue-over',parsed_scrobble_as_rank.hue);
            count_bar.style.setProperty('--sat-over',parsed_scrobble_as_rank.sat);
            count_bar.style.setProperty('--lit-over',parsed_scrobble_as_rank.lit);
        }
    }


    function parse_scrobbles_as_rank(scrobbles) {
        let scrobble_milestone = 0;
        let scrobble_proximity = 1;
        let max_rank = 15;

        for (let rank = max_rank; rank >= 0; rank--) {
            if (scrobbles > ranks[rank].start) {
                //console.info('bleh - PARSING RANK:', rank, ranks[rank].start);

                let this_rank = parseInt(rank);

                scrobble_milestone = this_rank;

                let next_rank = this_rank + 1;
                let prev_rank = this_rank - 1;

                if (this_rank != max_rank && this_rank != 0)
                    scrobble_proximity = (scrobbles - ranks[prev_rank].start) / ranks[next_rank].start;

                break;
            }
        }

        let milestone_hue = ranks[scrobble_milestone].hue;
        let milestone_sat = ranks[scrobble_milestone].sat;
        let milestone_lit = ranks[scrobble_milestone].lit;

        //console.info('bleh - default values will be', milestone_hue, milestone_sat, milestone_lit);

        if (scrobble_milestone != max_rank) {
            let next_milestone_hue = ranks[scrobble_milestone + 1].hue;
            let next_milestone_sat = ranks[scrobble_milestone + 1].sat;
            let next_milestone_lit = ranks[scrobble_milestone + 1].lit;

            //console.info('bleh - next up values will be', next_milestone_hue, next_milestone_sat, next_milestone_lit);

            if (milestone_hue > next_milestone_hue)
                milestone_hue += (next_milestone_hue - milestone_hue) * scrobble_proximity;

            if (milestone_sat < next_milestone_sat)
                milestone_sat += (milestone_sat - next_milestone_sat) * scrobble_proximity;
            else
                milestone_sat += (next_milestone_sat - milestone_sat) * scrobble_proximity;

            if (milestone_lit < next_milestone_lit)
                milestone_lit += (milestone_lit - next_milestone_lit) * scrobble_proximity;
            else
                milestone_lit += (next_milestone_lit - milestone_lit) * scrobble_proximity;

            //console.info('bleh - created proximity values', milestone_hue, milestone_sat, milestone_lit);
        }



        console.info('bleh - scrobble milestone for artist is', scrobble_milestone, 'with', scrobbles,'scrobbles', '- scrobble proximity of', scrobble_proximity, [milestone_hue, milestone_sat, milestone_lit]);

        return {
            milestone: scrobble_milestone,
            proximity: scrobble_proximity,
            hue: milestone_hue,
            sat: milestone_sat,
            lit: milestone_lit
        };
    }




    // artist corrections in grid view
    function patch_artist_grids(element) {
        let artists = element.querySelectorAll('.grid-items-item-details');

        if (artists == undefined)
            return;

        artists.forEach((artist) => {
            if (!artist.hasAttribute('data-kate-processed')) {
                artist.setAttribute('data-kate-processed','true');

                // test if this grid item is an album
                let album_artist = artist.querySelector('.grid-items-item-aux-block');

                if (album_artist != undefined) {
                    // it is an album!
                    let artist_name = artist.querySelector('.grid-items-item-aux-block');
                    let corrected_artist_name = correct_artist(artist_name.textContent);
                    artist_name.textContent = corrected_artist_name;
                    artist_name.setAttribute('title', corrected_artist_name);

                    // album name
                    let album_name = artist.querySelector('.grid-items-item-main-text a');
                    let corrected_album_name = correct_item_by_artist(album_name.textContent, artist_name.textContent);
                    album_name.textContent = corrected_album_name;
                    album_name.setAttribute('title', corrected_album_name);
                } else {
                    // not an album, must be an artist
                    let artist_name = artist.querySelector('.grid-items-item-main-text a');
                    let corrected_artist_name = correct_artist(artist_name.textContent);
                    artist_name.textContent = corrected_artist_name;
                    artist_name.setAttribute('href', `${root}music/${corrected_artist_name}`);
                    artist_name.setAttribute('title', corrected_artist_name);
                }
            }
        });
    }


    /**
     * correct capitalisation of a generic album/track name & artist combo
     * @param {string} parent individual css selector for each item wrapper
     * @returns if not found
     */
    function correct_generic_combo(parent) {
        let albums = document.body.querySelectorAll(`.${parent}`);

        if (albums == undefined)
            return;

        if (!settings.corrections)
            return;

        albums.forEach((album) => {
            if (!album.hasAttribute('data-kate-processed')) {
                album.setAttribute('data-kate-processed','true');
                console.info('bleh - correcting generic combo for a child of', parent);

                let album_name = album.querySelector(`.${parent.replace('-details','')}-name a`);
                let artist_name = album.querySelector(`.${parent.replace('-details','')}-artist a`);

                if (artist_name == undefined)
                    return;

                let corrected_album_name = correct_item_by_artist(album_name.textContent, artist_name.textContent);
                let corrected_artist_name = correct_artist(artist_name.textContent);

                album_name.textContent = corrected_album_name;
                artist_name.textContent = corrected_artist_name;
            }
        });
    }
    /**
     * correct capitalisation of a generic album/track name (no artist field!!) combo
     * @param {string} parent individual css selector for each item wrapper
     * @returns if not found
     */
    function correct_generic_combo_no_artist(parent) {
        let albums = document.body.querySelectorAll(`.${parent}`);

        if (albums == undefined)
            return;

        albums.forEach((album) => {
            if (!album.hasAttribute('data-kate-processed')) {
                album.setAttribute('data-kate-processed','true');
                console.info('bleh - correcting generic combo (no artist) for a child of', parent);

                let album_name = album.querySelector(`.${parent.replace('-details','')}-name a`);
                let artist_name = album_name.getAttribute('href').split('/')[2].replaceAll('+',' ');

                let corrected_album_name = correct_item_by_artist(album_name.textContent, artist_name);
                album_name.textContent = corrected_album_name;
            }
        });
    }


    // correction handler
    /**
     * correct item based on artist
     * @param {string} item either a track/album title
     * @param {string} artist artist name (is converted to lowercase)
     * @returns corrected title if applicable or original title
     */
    function correct_item_by_artist(item, artist) {
        artist = artist.toLowerCase();
        console.info('bleh - correction handler: correcting', item, 'by', artist);

        if (!settings.corrections)
            return item;

        if (song_title_corrections.hasOwnProperty(artist)) {
            if (song_title_corrections[artist].hasOwnProperty(item)) {
                console.info('bleh - correction handler: corrected as', song_title_corrections[artist][item]);
                return song_title_corrections[artist][item];
            } else {
                return item;
            }
        } else {
            return item;
        }
    }
    /**
     * correct artist
     * @param {string} artist artist name (NOT converted to lowercase)
     * @returns corrected artist if applicable or original artist
     */
    function correct_artist(artist) {
        console.info('bleh - correction handler: correcting', artist);

        if (!settings.corrections)
            return artist;

        if (artist_corrections.hasOwnProperty(artist)) {
            console.info('bleh - correction handler: corrected as', artist_corrections[artist]);
            return artist_corrections[artist];
        } else {
            return artist;
        }
    }




    function patch_about_this_artist() {
        if (!settings.corrections)
            return;

        let about_artist_name = document.querySelector('.about-artist-name');

        if (about_artist_name == null)
            return;

        if (about_artist_name.hasAttribute('data-kate-processed'))
            return;
        about_artist_name.setAttribute('data-kate-processed', 'true');

        let artist_name = about_artist_name.querySelector('a');
        artist_name.textContent = correct_artist(artist_name.textContent);
    }




    // patch track/album/artist menu
    function patch_header_menu() {
        let menu = document.body.querySelector('.header-new-more-actions-menu');

        if (menu == undefined)
            return;

        if (!menu.hasAttribute('data-kate-processed')) {
            menu.setAttribute('data-kate-processed','true');

            let extra_items = document.createElement('li');
            extra_items.innerHTML = (`
            <a class="dropdown-menu-clickable-item more-item--submit-correction" href="https://docs.google.com/forms/d/e/1FAIpQLScRzZaMfpjgKUq4CCA8iuEQCxVdalyv9bwnZEjPDm7lit_Ohg/viewform" target="_blank">
                ${trans[lang].music.submit_lastfm_correction}
            </a>
            <a class="dropdown-menu-clickable-item more-item--submit-correction-bleh" href="https://github.com/katelyynn/bleh/issues/new/choose" target="_blank">
                ${trans[lang].music.submit_bleh_correction}
            </a>
            `);

            menu.appendChild(extra_items);
        }
    }




    // bleh settings
    unsafeWindow.open_bleh_settings = function() {
        create_window('bleh_settings','Theme settings','');
    }

    function bleh_settings() {
        document.body.style.removeProperty('--hue-album');
        document.body.style.removeProperty('--sat-album');
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
                            ${trans[lang].settings.home.name}
                        </button>
                        <button class="btn bleh--btn" data-bleh-page="themes" onclick="_change_settings_page('themes')">
                            ${trans[lang].settings.appearance.name}
                        </button>
                        <button class="btn bleh--btn" data-bleh-page="music" onclick="_change_settings_page('music')">
                            ${trans[lang].settings.music.name}
                        </button>
                        <button class="btn bleh--btn" data-bleh-page="accessibility" onclick="_change_settings_page('accessibility')">
                            ${trans[lang].settings.accessibility.name}
                        </button>
                        <button class="btn bleh--btn" data-bleh-page="seasonal" data-season="${stored_season.id}" onclick="_change_settings_page('seasonal')">
                            ${trans[lang].settings.customise.seasonal.name}
                        </button>
                        <button class="btn bleh--btn" data-bleh-page="customise" onclick="_change_settings_page('customise')">
                            ${trans[lang].settings.customise.name}
                        </button>
                    </div>
                    <div class="btns sep">
                        <button class="btn bleh--btn" data-bleh-page="text" onclick="_change_settings_page('text')">
                            ${trans[lang].settings.text.name}
                        </button>
                        <button class="btn bleh--btn" data-bleh-page="language" onclick="_change_settings_page('language')">
                            ${trans[lang].settings.language.name}
                        </button>
                        <button class="btn bleh--btn" data-bleh-page="sku" onclick="_change_settings_page('sku')">
                            shhh...
                        </button>
                    </div>
                    <div class="btns sep">
                        <button class="btn bleh--btn" data-bleh-page="corrections" onclick="_change_settings_page('corrections')">
                            ${trans[lang].settings.corrections.name}
                        </button>
                        <button class="btn bleh--btn" data-bleh-page="redirects" onclick="_change_settings_page('redirects')">
                            ${trans[lang].settings.redirects.name}
                        </button>
                    </div>
                    <div class="btns sep">
                        <button class="btn" data-bleh-action="import" onclick="_import_settings()">
                            ${trans[lang].settings.actions.import.name}
                        </button>
                        <button class="btn" data-bleh-action="export" onclick="_export_settings()">
                            ${trans[lang].settings.actions.export.name}
                        </button>
                    </div>
                    <div class="btns sep">
                        <button class="btn bleh--btn" data-bleh-page="profiles" onclick="_change_settings_page('profiles')">
                            ${trans[lang].settings.profiles.name}
                        </button>
                        <button class="btn bleh--btn" data-bleh-page="performance" onclick="_change_settings_page('performance')">
                            ${trans[lang].settings.performance.name}
                        </button>
                        <button class="btn" data-bleh-action="reset" onclick="_reset_settings()">
                            ${trans[lang].settings.actions.reset.name}
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
        console.info(theme_version != version.build, theme_version, version.build, typeof(theme_version), typeof(version.build));
        if (page == 'home') {
            return (`
            <div class="bleh--panel">
                <h3>${trans[lang].settings.home.name}</h3>
                <div class="user-top-panel">
                    <div class="user-top-avatar user-top-avatar-side-left"></div>
                    <img class="user-top-avatar user-top-avatar-main" src="${my_avi.replace('avatar42s', 'avatar170s')}" alt="${auth}">
                    <div class="user-top-avatar user-top-avatar-side-right"></div>
                </div>
                <h4>${trans[lang].settings.home.thanks
                .replace('{m}', `<a class="mention" href="${root}user/${auth}">@${auth}</a>`)
                .replace('{v}', `<span class="version-link" onclick="_change_settings_page('sku')">${version.build}.${version.sku}</span>`)}</h4>
                ${(theme_version != version.build && theme_version != '') ? `<div class="alert alert-update">${trans[lang].settings.home.update.notice}</div>` : ''}
                <div class="screen-row actions-only">
                    <div class="actions">
                        <a class="btn action" href="https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.js">
                            <div class="icon bleh--updates"></div>
                            <span class="text">
                                <h5>${trans[lang].settings.home.update.name}</h5>
                                <p>${trans[lang].settings.home.update.bio}</p>
                            </span>
                        </a>
                        ${((!settings.dev && theme_version != version.build && theme_version != '') ? (`
                        <button class="btn action" onclick="_force_refresh_theme()">
                            <div class="icon bleh--updates"></div>
                            <span class="text">
                                <h5>${trans[lang].settings.home.update.css}</h5>
                                <p>${trans[lang].settings.home.update.bio}</p>
                            </span>
                        </button>
                        `) : '')}
                        ${(settings.dev ? (`
                        <a class="btn action" href="https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.css">
                            <div class="icon bleh--updates"></div>
                            <span class="text">
                                <h5>${trans[lang].settings.home.update.css}</h5>
                                <p>${trans[lang].settings.home.update.bio}</p>
                            </span>
                        </a>
                        `) : '')}
                        <a class="btn action" href="https://github.com/katelyynn/bleh/issues" target="_blank">
                            <div class="icon bleh--issues"></div>
                            <span class="text">
                                <h5>${trans[lang].settings.home.issues.name}</h5>
                                <p>${trans[lang].settings.home.issues.bio}</p>
                            </span>
                        </a>
                    </div>
                </div>
                <div class="sep"></div>
                <h4>${trans[lang].settings.customise.seasonal.name}</h4>
                <div class="inner-preview pad click-thru">
                    <div class="current-season-container">
                        <div class="current-season" data-season="${stored_season.id}" id="current_season">
                            ${(stored_season.id != 'none')
                            ? trans[lang].settings.customise.seasonal.marker.current.replace('{season}', trans[lang].settings.customise.seasonal.listing[stored_season.id]).replace('{time}', moment(stored_season.end.replace('y0', stored_season.year)).to(stored_season.now, true))
                            : (settings.seasonal) ? trans[lang].settings.customise.seasonal.marker.none : trans[lang].settings.customise.seasonal.marker.disabled}
                        </div>
                        <div class="current-season-started" id="current_season_start">
                            ${(stored_season.id != 'none')
                            ? trans[lang].settings.customise.seasonal.marker.started.replace('{time}', moment(stored_season.start.replace('y0', stored_season.year)).from(stored_season.now))
                            : ''}
                        </div>
                    </div>
                </div>
                <h4>${trans[lang].settings.home.recommended}</h4>
                <div class="setting-items full">
                    <div class="side-right full">
                        <button class="btn setting-item" onclick="_change_settings_page('themes')">
                            <div class="icon bleh--themes"></div>
                            <div class="text">
                                <h5>${trans[lang].settings.themes.name}</h5>
                                <p>${trans[lang].settings.themes.bio}</p>
                            </div>
                        </button>
                        <button class="btn setting-item" onclick="_change_settings_page('themes')">
                            <div class="icon bleh--palette"></div>
                            <div class="text">
                                <h5>${trans[lang].settings.home.colours.name}</h5>
                                <p>${trans[lang].settings.home.colours.bio}</p>
                            </div>
                        </button>
                        <button class="btn setting-item" onclick="_change_settings_page('corrections')">
                            <div class="icon bleh--corrections"></div>
                            <div class="text">
                                <h5>${trans[lang].settings.corrections.name}</h5>
                                <p>${trans[lang].settings.corrections.bio}</p>
                            </div>
                        </button>
                        <button class="btn setting-item" onclick="_change_settings_page('accessibility')">
                            <div class="icon bleh--motion"></div>
                            <div class="text">
                                <h5>${trans[lang].settings.accessibility.reduced_motion.name}</h5>
                                <p>${trans[lang].settings.accessibility.reduced_motion.bio}</p>
                            </div>
                        </button>
                        <button class="btn setting-item" onclick="_change_settings_page('accessibility')">
                            <div class="icon bleh--link"></div>
                            <div class="text">
                                <h5>${trans[lang].settings.accessibility.underline_links.name}</h5>
                                <p>${trans[lang].settings.accessibility.underline_links.bio}</p>
                            </div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <h4>Try out the latest</h4>
                <div class="setting-items">
                    <div class="side-left">
                        <a class="btn setting-item has-image" href="https://cutensilly.org/bwaa/fm" target="_blank">
                            <div class="image">
                                <div class="icon bleh--bwaa"></div>
                            </div>
                            <div class="text">
                                <h5>bwaa (BETA) for Last.fm</h5>
                                <p>bring last.fm back to 2012 while retaining all modern features. (includes a dark mode)</p>
                            </div>
                            <div class="image-row">
                                <img src="https://cutensilly.org/img/bwaa-image.png">
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            `);
        } else if (page == 'themes') {
            let preview_bar = 'background: linear-gradient(90deg';
            let preview_bar_text = '';

            // global sat/lit is used to substitute the values computed in h3 sat/lit
            // as they return eg. calc(0.85 * 50%), so we use global_sat to get 0.85
            // which can then be used in a .replace(global_sat, 'whatever we want')
            let global_sat = getComputedStyle(document.body).getPropertyValue('--sat');
            let global_lit = getComputedStyle(document.body).getPropertyValue('--lit');
            let h3_sat = getComputedStyle(document.body).getPropertyValue('--h3-sat');
            let h3_lit = getComputedStyle(document.body).getPropertyValue('--h3-lit');

            let maximum = 16_000;
            let max_rank = 11;

            //console.info(maximum, max_rank);
            for (let rank = 0; rank <= max_rank; rank++) {
                let this_rank = ranks[parseInt(rank)];
                //console.info(this_rank);

                let percent = ((this_rank.start / maximum) * 100);
                preview_bar = `${preview_bar}, hsl(${this_rank.hue}, ${h3_sat.replace(global_sat, this_rank.sat)}, ${h3_lit.replace(global_lit, this_rank.lit)}) ${percent}%`;

                if ((this_rank.start > 500 || this_rank.start == 0) && this_rank.start != 1500) {
                    let text = `${this_rank.start}`;

                    preview_bar_text = `${preview_bar_text}<div class="preview-bar-text-entry" style="left: ${percent}%">${text.replaceAll('_', ',')}</div>`;
                }
            }

            preview_bar = `${preview_bar});`;
            //console.info('preview bar', preview_bar, global_sat, h3_sat, global_lit, h3_lit);

            return (`
                <div class="bleh--panel">
                    <h3>${trans[lang].settings.appearance.name}</h3>
                    <h4>${trans[lang].settings.themes.name}</h4>
                    <!--<h4>${trans[lang].settings.themes.dark.name}</h4>-->
                    <div class="setting-items full">
                        <div class="side-left full even-more">
                            <button class="btn theme-item" data-bleh-theme="light" onclick="change_theme_from_settings('light')">
                                <div class="preview" data-bleh--theme="light">
                                    ${theme_preview}
                                </div>
                                <div class="text">
                                    <h5>${trans[lang].settings.themes.light.name}</h5>
                                </div>
                            </button>
                            <button class="btn theme-item" data-bleh-theme="dark" onclick="change_theme_from_settings('dark')">
                                <div class="preview" data-bleh--theme="dark">
                                    ${theme_preview}
                                </div>
                                <div class="text">
                                    <h5>${trans[lang].settings.themes.dark.name}</h5>
                                </div>
                            </button>
                            <button class="btn theme-item" data-bleh-theme="darker" onclick="change_theme_from_settings('darker')">
                                <div class="preview" data-bleh--theme="darker">
                                    ${theme_preview}
                                </div>
                                <div class="text">
                                    <h5>${trans[lang].settings.themes.darker.name}</h5>
                                </div>
                            </button>
                            <button class="btn theme-item" data-bleh-theme="oled" onclick="change_theme_from_settings('oled')">
                                <div class="preview" data-bleh--theme="oled">
                                    ${theme_preview}
                                </div>
                                <div class="text">
                                    <h5>${trans[lang].settings.themes.oled.name}</h5>
                                </div>
                            </button>
                        </div>
                    </div>
                    ${(settings.feature_flags.high_contrast) ? (`
                    <div class="toggle-container" id="container-high_contrast" onclick="_update_item('high_contrast')">
                        <button class="btn reset" onclick="_reset_item('high_contrast')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.high_contrast.name}</h5>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-high_contrast" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    `) : ''}
                    <div class="sep"></div>
                    <h4>${trans[lang].settings.customise.colours.name}</h4>
                    <!--<h5>${trans[lang].settings.customise.colours.presets}</h5>-->
                    <div class="palette options colours" id="custom_colours">
                        <button class="swatch btn default" style="
                            --hue: var(--hue-seasonal, 255);
                            --sat: var(--sat-seasonal, 1);
                            --lit: var(--lit-seasonal, 1)" onclick="_update_params({
                            hue: 255,
                            sat: 1,
                            lit: 1
                        })"></button>
                        <button class="swatch btn custom" style="
                            --hue: var(--hue-user, 255);
                            --sat: var(--sat-user, 1);
                            --lit: var(--lit-user, 1)" onclick="_create_a_custom_colour()"></button>
                    </div>
                    <div class="palette options colours">
                        <div class="side">
                            <button class="swatch btn" style="
                                --hue: -2;
                                --sat: 1.35;
                                --lit: 0.85" onclick="_update_params({
                                hue: -2,
                                sat: 1.35,
                                lit: 0.85
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: -2;
                                --sat: 1.25;
                                --lit: 0.85" onclick="_update_params({
                                hue: -2,
                                sat: 1.25,
                                lit: 0.85
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 356;
                                --sat: 1.25;
                                --lit: 0.9" onclick="_update_params({
                                hue: 356,
                                sat: 1.25,
                                lit: 0.9
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 351;
                                --sat: 1.2;
                                --lit: 0.9" onclick="_update_params({
                                hue: 351,
                                sat: 1.2,
                                lit: 0.9
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 346;
                                --sat: 1.3;
                                --lit: 0.85" onclick="_update_params({
                                hue: 346,
                                sat: 1.3,
                                lit: 0.85
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 339;
                                --sat: 1.3;
                                --lit: 0.85" onclick="_update_params({
                                hue: 339,
                                sat: 1.3,
                                lit: 0.85
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 331;
                                --sat: 1.1;
                                --lit: 0.8" onclick="_update_params({
                                hue: 331,
                                sat: 1.1,
                                lit: 0.8
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 310;
                                --sat: 1.2;
                                --lit: 0.85" onclick="_update_params({
                                hue: 310,
                                sat: 1.2,
                                lit: 0.85
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 286;
                                --sat: 1.2;
                                --lit: 0.9" onclick="_update_params({
                                hue: 286,
                                sat: 1.2,
                                lit: 0.9
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 274;
                                --sat: 1.25;
                                --lit: 0.9" onclick="_update_params({
                                hue: 274,
                                sat: 1.25,
                                lit: 0.9
                            })"></button>
                        </div>
                        <div class="side">
                            <button class="swatch btn" style="
                                --hue: 7;
                                --sat: 1.35;
                                --lit: 0.8" onclick="_update_params({
                                hue: 7,
                                sat: 1.35,
                                lit: 0.8
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 9;
                                --sat: 1.25;
                                --lit: 0.84" onclick="_update_params({
                                hue: 9,
                                sat: 1.25,
                                lit: 0.84
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 14;
                                --sat: 1.25;
                                --lit: 0.88" onclick="_update_params({
                                hue: 14,
                                sat: 1.25,
                                lit: 0.88
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 18;
                                --sat: 1.2;
                                --lit: 0.9" onclick="_update_params({
                                hue: 18,
                                sat: 1.2,
                                lit: 0.9
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 24;
                                --sat: 1.2;
                                --lit: 0.93" onclick="_update_params({
                                hue: 24,
                                sat: 1.2,
                                lit: 0.93
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 30;
                                --sat: 1.3;
                                --lit: 1" onclick="_update_params({
                                hue: 30,
                                sat: 1.3,
                                lit: 1
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 38;
                                --sat: 1.3;
                                --lit: 0.98" onclick="_update_params({
                                hue: 38,
                                sat: 1.3,
                                lit: 0.98
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 49;
                                --sat: 1.3;
                                --lit: 0.98" onclick="_update_params({
                                hue: 49,
                                sat: 1.3,
                                lit: 0.98
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 53;
                                --sat: 1.3;
                                --lit: 0.95" onclick="_update_params({
                                hue: 53,
                                sat: 1.3,
                                lit: 0.95
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 62;
                                --sat: 1.25;
                                --lit: 0.95" onclick="_update_params({
                                hue: 62,
                                sat: 1.25,
                                lit: 0.95
                            })"></button>
                        </div>
                        <div class="side">
                            <button class="swatch btn" style="
                                --hue: 75;
                                --sat: 1.1;
                                --lit: 1" onclick="_update_params({
                                hue: 75,
                                sat: 1.1,
                                lit: 1
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 85;
                                --sat: 1;
                                --lit: 1" onclick="_update_params({
                                hue: 85,
                                sat: 1,
                                lit: 1
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 95;
                                --sat: 1.1;
                                --lit: 1" onclick="_update_params({
                                hue: 95,
                                sat: 1.1,
                                lit: 1
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 115;
                                --sat: 1;
                                --lit: 1" onclick="_update_params({
                                hue: 115,
                                sat: 1,
                                lit: 1
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 130;
                                --sat: 1.2;
                                --lit: 0.95" onclick="_update_params({
                                hue: 130,
                                sat: 1.2,
                                lit: 0.95
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 140;
                                --sat: 1.2;
                                --lit: 0.9" onclick="_update_params({
                                hue: 140,
                                sat: 1.2,
                                lit: 0.9
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 155;
                                --sat: 1.2;
                                --lit: 0.85" onclick="_update_params({
                                hue: 155,
                                sat: 1.2,
                                lit: 0.85
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 165;
                                --sat: 1.1;
                                --lit: 0.8" onclick="_update_params({
                                hue: 165,
                                sat: 1.1,
                                lit: 0.8
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 174;
                                --sat: 1.1;
                                --lit: 0.8" onclick="_update_params({
                                hue: 174,
                                sat: 1.1,
                                lit: 0.8
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 184;
                                --sat: 1.05;
                                --lit: 0.75" onclick="_update_params({
                                hue: 184,
                                sat: 1.05,
                                lit: 0.75
                            })"></button>
                        </div>
                        <div class="side">
                            <button class="swatch btn" style="
                                --hue: 205;
                                --sat: 1;
                                --lit: 1" onclick="_update_params({
                                hue: 205,
                                sat: 1,
                                lit: 1
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 222;
                                --sat: 1;
                                --lit: 0.9" onclick="_update_params({
                                hue: 222,
                                sat: 1,
                                lit: 0.9
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 230;
                                --sat: 1.3;
                                --lit: 0.9" onclick="_update_params({
                                hue: 230,
                                sat: 1.3,
                                lit: 0.9
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 230;
                                --sat: 1.3;
                                --lit: 0.825" onclick="_update_params({
                                hue: 230,
                                sat: 1.3,
                                lit: 0.825
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 243;
                                --sat: 1.3;
                                --lit: 0.9" onclick="_update_params({
                                hue: 243,
                                sat: 1.3,
                                lit: 0.9
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 249;
                                --sat: 1.3;
                                --lit: 0.9" onclick="_update_params({
                                hue: 249,
                                sat: 1.3,
                                lit: 0.9
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 255;
                                --sat: 1.2;
                                --lit: 0.9" onclick="_update_params({
                                hue: 255,
                                sat: 1.2,
                                lit: 0.9
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 263;
                                --sat: 1.2;
                                --lit: 0.9" onclick="_update_params({
                                hue: 263,
                                sat: 1.2,
                                lit: 0.9
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 260;
                                --sat: 1.1;
                                --lit: 0.95" onclick="_update_params({
                                hue: 260,
                                sat: 1.1,
                                lit: 0.95
                            })"></button>
                            <button class="swatch btn" style="
                                --hue: 255;
                                --sat: 1;
                                --lit: 0.95" onclick="_update_params({
                                hue: 255,
                                sat: 1,
                                lit: 0.95
                            })"></button>
                        </div>
                    </div>
                    <div class="sep"></div>
                    <div class="inner-preview pad">
                        <div class="personal-stats-preview-bar-container">
                            <div class="personal-stats-preview-bar" style="${preview_bar}"></div>
                            <div class="personal-stats-preview-text">${preview_bar_text}</div>
                        </div>
                        <div class="sep"></div>
                        <div class="tracks">
                            <div class="track">
                                <div class="cover"></div>
                                <div class="title"></div>
                                <div class="bar">
                                    <div class="fill not-colourful" style="width: 100%"></div>
                                    <div class="fill colourful" style="width: 100%; --hue: -16.888749999999998; --sat: 1.5; --lit: 0.875"></div>
                                </div>
                            </div>
                            <div class="track">
                                <div class="cover"></div>
                                <div class="title"></div>
                                <div class="bar">
                                    <div class="fill not-colourful" style="width: 85%"></div>
                                    <div class="fill colourful" style="width: 85%; --hue: 0.21863999999999972; --sat: 1.399218; --lit: 0.891406"></div>
                                </div>
                            </div>
                            <div class="track">
                                <div class="cover"></div>
                                <div class="title"></div>
                                <div class="bar">
                                    <div class="fill not-colourful" style="width: 60%"></div>
                                    <div class="fill colourful" style="width: 60%; --hue: 18.77; --sat: 1.425; --lit: 0.9175833333333334"></div>
                                </div>
                            </div>
                            <div class="track">
                                <div class="cover"></div>
                                <div class="title"></div>
                                <div class="bar">
                                    <div class="fill not-colourful" style="width: 30%"></div>
                                    <div class="fill colourful" style="width: 30%; --hue: 50.769767441860466; --sat: 1.361813953488372; --lit: 0.943406976744186"></div>
                                </div>
                            </div>
                            <div class="track">
                                <div class="cover"></div>
                                <div class="title"></div>
                                <div class="bar">
                                    <div class="fill not-colourful" style="width: 5%"></div>
                                    <div class="fill colourful" style="width: 5%; --hue: 92.42; --sat: 1.35; --lit: 0.925"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="toggle-container" id="container-colourful_counts" onclick="_update_item('colourful_counts')">
                        <button class="btn reset" onclick="_reset_item('colourful_counts')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.colourful_counts.name}</h5>
                            <p>${trans[lang].settings.customise.colourful_counts.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-colourful_counts" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                </div>
                `);
        } else if (page == 'customise') {
            return (`
                <div class="bleh--panel">
                    <h3>${trans[lang].settings.customise.artwork.name}</h3>
                    <div class="inner-preview pad">
                        <div class="palette albums" style="height: fit-content">
                            <div class="album-cover swatch" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/1569198c4cf0a3b2ff8728975e8359fa.jpg')"></div>
                            <div class="album-cover swatch" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/b897255bf422baa93a42536af293f9f8.jpg')"></div>
                            <div class="album-cover swatch" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/def68d94aae8e52ef2d1c0c9d3e16ff4.jpg')"></div>
                            <div class="album-cover swatch" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/e9dd5c8d3294ca0a0f58cbf7ad5fd6a6.jpg')"></div>
                            <div class="album-cover swatch" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/570021b68d3d9d2db08bc99a473303b0.jpg')"></div>
                            <div class="album-cover swatch" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/4cc13056c7568b5c207dd7aee03fdb0f.jpg')"></div>
                        </div>
                    </div>
                    <div class="toggle-container" id="container-hue_from_album">
                        <button class="btn reset" onclick="_reset_item('hue_from_album')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.hue_from_album.name}</h5>
                            <p>${trans[lang].settings.customise.hue_from_album.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-hue_from_album" onclick="_update_item('hue_from_album')" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="slider-container" id="container-gloss">
                        <button class="btn reset" onclick="_reset_item('gloss')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.gloss.name}</h5>
                            <p>${trans[lang].settings.customise.gloss.bio}</p>
                        </div>
                        <div class="slider">
                            <div class="slider-track" id="slider-track-gloss"><div class="slider-fill"></div><div class="slider-nub"></div></div>
                            <input type="range" min="0" max="1" value="0" step="0.05" id="slider-gloss" oninput="_update_item('gloss', this.value)">
                            <p id="value-gloss">0</p>
                        </div>
                    </div>
                </div>
                <div class="bleh--panel">
                    <h3>${trans[lang].settings.customise.display.name}</h3>
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
                    <div class="toggle-container" id="container-gendered_tags" onclick="_update_item('gendered_tags')">
                        <button class="btn reset" onclick="_reset_item('gendered_tags')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.gendered_tags.name}</h5>
                            <p>${trans[lang].settings.customise.gendered_tags.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-gendered_tags" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="sep"></div>
                    <h4>${trans[lang].settings.customise.profile_header.name}</h4>
                    <div class="toggle-container" id="container-profile_header_own" onclick="_update_item('profile_header_own')">
                        <button class="btn reset" onclick="_reset_item('profile_header_own')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.profile_header.for_own}</h5>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-profile_header_own" aria-checked="false">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="toggle-container" id="container-profile_header_others" onclick="_update_item('profile_header_others')">
                        <button class="btn reset" onclick="_reset_item('profile_header_others')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.profile_header.for_others}</h5>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-profile_header_others" aria-checked="false">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="sep"></div>
                    <div class="toggle-container" id="container-show_your_progress" onclick="_update_item('show_your_progress')">
                        <button class="btn reset" onclick="_reset_item('show_your_progress')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.show_your_progress.name}</h5>
                            <p>${trans[lang].settings.customise.show_your_progress.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-show_your_progress" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="sep"></div>
                    <div class="toggle-container" id="container-pretty_obsessions" onclick="_update_item('pretty_obsessions')">
                        <button class="btn reset" onclick="_reset_item('pretty_obsessions')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.pretty_obsessions.name}</h5>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-pretty_obsessions" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="sep"></div>
                    <div class="toggle-container" id="container-rain" onclick="_update_item('rain')">
                        <button class="btn reset" onclick="_reset_item('rain')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.rain.name}</h5>
                            <p>${trans[lang].settings.customise.rain.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-rain" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                </div>
                `);
        } else if (page == 'seasonal') {
            return (`
                <div class="bleh--panel">
                    <h3>${trans[lang].settings.customise.seasonal.name}</h3>
                    <p>${trans[lang].settings.customise.seasonal.bio}</p>
                    <div class="inner-preview pad click-thru">
                        <div class="current-season-container">
                            <div class="current-season" data-season="${stored_season.id}" id="current_season">
                                ${(stored_season.id != 'none')
                                ? trans[lang].settings.customise.seasonal.marker.current.replace('{season}', trans[lang].settings.customise.seasonal.listing[stored_season.id]).replace('{time}', moment(stored_season.end.replace('y0', stored_season.year)).to(stored_season.now, true))
                                : (settings.seasonal) ? trans[lang].settings.customise.seasonal.marker.none : trans[lang].settings.customise.seasonal.marker.disabled}
                            </div>
                            <div class="current-season-started" id="current_season_start">
                                ${(stored_season.id != 'none')
                                ? trans[lang].settings.customise.seasonal.marker.started.replace('{time}', moment(stored_season.start.replace('y0', stored_season.year)).from(stored_season.now))
                                : ''}
                            </div>
                        </div>
                    </div>
                    <div class="toggle-container" id="container-seasonal" onclick="_update_item('seasonal')">
                        <button class="btn reset" onclick="_reset_item('seasonal')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.seasonal.option.name}</h5>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-seasonal" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="sep"></div>
                    <div class="toggle-container hide-if-seasonal-disabled" id="container-seasonal_particles" onclick="_update_item('seasonal_particles')">
                        <button class="btn reset" onclick="_reset_item('seasonal_particles')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.seasonal.particles.name}</h5>
                            <p>${trans[lang].settings.customise.seasonal.particles.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-seasonal_particles" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="toggle-container hide-if-seasonal-disabled" id="container-seasonal_overlays" onclick="_update_item('seasonal_overlays')">
                        <button class="btn reset" onclick="_reset_item('seasonal_overlays')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.seasonal.overlays.name}</h5>
                            <p>${trans[lang].settings.customise.seasonal.overlays.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-seasonal_overlays" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                </div>
            `);
        } else if (page == 'performance') {
            return (`
                <div class="bleh--panel">
                    <h3>${trans[lang].settings.performance.name}</h3>
                    <p>${trans[lang].settings.performance.bio}</p>
                    <div class="toggle-container">
                        <div class="heading">
                            <h5>Refresh theme</h5>
                            <p>Force download the latest version of the stylesheet</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="bleh--btn primary" onclick="_force_refresh_theme()">Refresh</button>
                        </div>
                    </div>
                    <div class="toggle-container" id="container-dev" onclick="_update_item('dev')">
                        <button class="btn reset" onclick="_reset_item('dev')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.performance.dev.name}</h5>
                            <p>${trans[lang].settings.performance.dev.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-dev" aria-checked="false">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="sep"></div>
                    <div class="toggle-container">
                        <div class="heading">
                            <h5>${trans[lang].settings.performance.bug.name}</h5>
                            <p>${trans[lang].settings.performance.bug.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <a class="btn bleh--btn primary" href="https://github.com/katelyynn/bleh/issues/new/choose" target="_blank">${trans[lang].settings.go}</a>
                        </div>
                    </div>
                    <div class="sep"></div>
                    <h5>Debug information</h5>
                    <ul>
                        <li>Theme loading is currently ${settings.dev}</li>
                        <li>Theme will expire at ${new Date(localStorage.getItem('bleh_cached_style_timeout'))}</li>
                        <li>It is currently ${new Date()}</li>
                        <li>Has the timeout expired? ${new Date(localStorage.getItem('bleh_cached_style_timeout')) < new Date()}</li>
                    </ul>
                </div>
                `);
        } else if (page == 'profiles') {
            return (`
                <div class="bleh--panel">
                    <h3>${trans[lang].settings.profiles.name}</h3>
                    <p>${trans[lang].settings.profiles.bio}</p>
                    <h4>${trans[lang].settings.profiles.notes.name}</h4>
                    <div class="profile-notes" id="profile-notes"></div>
                </div>
                `);
        } else if (page == 'redirects') {
            return (`
                <div class="bleh--panel">
                    <h3>${trans[lang].settings.redirects.name}</h3>
                    <p>${trans[lang].settings.redirects.bio}</p>
                    <div class="inner-preview">
                        <div class="nag-bar nag-bar--corrections nag-bar--corrections--artist preview-bar">
                            <div class="container">
                                <p class="nag-bar-message">
                                    Did you mean <strong><a href="/music/Travi$+Scott">Travi$ Scott</a></strong>? <strong><a href="/music/Lil%27+Wayne">Lil' Wayne</a></strong> maybe?
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="toggle-container" id="container-travis" onclick="_update_item('travis')">
                        <button class="btn reset" onclick="_reset_item('travis')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.redirects.travis.name}</h5>
                            <p>${trans[lang].settings.redirects.travis.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-travis" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="toggle-container">
                        <div class="heading">
                            <h5>${trans[lang].settings.redirects.autocorrect.name}</h5>
                            <p>${trans[lang].settings.redirects.autocorrect.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <a class="btn bleh--btn primary" href="${root}settings/website" target="_blank">${trans[lang].settings.redirects.autocorrect.action}</a>
                        </div>
                    </div>
                </div>
                `);
        } else if (page == 'corrections') {
            return (`
                <div class="bleh--panel">
                    <h3>${trans[lang].settings.corrections.name}</h3>
                    <p>${trans[lang].settings.corrections.bio}</p>
                    <h4>${trans[lang].settings.corrections.listing.artists}</h4>
                    <div class="corrections artist" id="corrections-artist"></div>
                    <h4>${trans[lang].settings.corrections.listing.albums_tracks}</h4>
                    <div class="corrections album_tracks" id="corrections-albums_tracks"></div>
                </div>
                `);
        } else if (page == 'language') {
            return (`
                <div class="bleh--panel">
                    <h3>${trans[lang].settings.language.name}</h3>
                    ${(!valid_langs.includes(document.documentElement.getAttribute('lang'))) ? `
                    <div class="alert alert-error">Selected language is not currently supported in bleh, sorry for the inconvenience.</div>
                    ` : ''}
                    <h4>${trans[lang].settings.language.supported}</h4>
                    <div class="languages" id="languages"></div>
                    <div class="sep"></div>
                    <div class="alert alert-warning">This page is still under construction! A wiki page dedicated to submitting a language is not available currently.</div>
                    <div class="toggle-container">
                        <div class="heading">
                            <h5>${trans[lang].settings.language.submit.name}</h5>
                            <p>${trans[lang].settings.language.submit.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <a class="btn bleh--btn primary" href="https://github.com/katelyynn/bleh/wiki" target="_blank">${trans[lang].settings.language.submit.action}</a>
                        </div>
                    </div>
                </div>
                `);
        } else if (page == 'accessibility') {
            return (`
                <div class="bleh--panel">
                    <h3>${trans[lang].settings.accessibility.name}</h3>
                    <div class="toggle-container" id="container-reduced_motion" onclick="_update_item('reduced_motion')">
                        <button class="btn reset" onclick="_reset_item('reduced_motion')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.accessibility.reduced_motion.name}</h5>
                            <p>${trans[lang].settings.accessibility.reduced_motion.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-reduced_motion" aria-checked="false">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="inner-preview pad flex">
                        <div class="shout js-shout js-link-block" data-kate-processed="true">
                            <h3 class="shout-user">
                                <a>${auth}</a>
                            </h3>
                            <span class="avatar shout-user-avatar avatar--bleh-missing">
                                <img src="" alt="Your avatar" loading="lazy">
                            </span>
                            <a class="shout-permalink shout-timestamp">
                                <time datetime="2024-06-05T02:33:39+01:00" title="Wednesday 5 Jun 2024, 2:33am">
                                    5 Jun 2:33am
                                </time>
                            </a>
                            <div class="shout-body">
                                <p>${trans[lang].settings.accessibility.shout_preview}</p>
                            </div>
                        </div>
                    </div>
                    <div class="toggle-container" id="container-accessible_name_colours" onclick="_update_item('accessible_name_colours')">
                        <button class="btn reset" onclick="_reset_item('accessible_name_colours')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.accessibility.accessible_name_colours.name}</h5>
                            <p>${trans[lang].settings.accessibility.accessible_name_colours.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-accessible_name_colours" aria-checked="false">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="toggle-container" id="container-underline_links" onclick="_update_item('underline_links')">
                        <button class="btn reset" onclick="_reset_item('underline_links')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.accessibility.underline_links.name}</h5>
                            <p>${trans[lang].settings.accessibility.underline_links.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-underline_links" aria-checked="false">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="sep"></div>
                    <h4>${trans[lang].settings.customise.profile_header.name}</h4>
                    <div class="toggle-container" id="container-profile_header_own" onclick="_update_item('profile_header_own')">
                        <button class="btn reset" onclick="_reset_item('profile_header_own')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.profile_header.for_own}</h5>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-profile_header_own" aria-checked="false">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="toggle-container" id="container-profile_header_others" onclick="_update_item('profile_header_others')">
                        <button class="btn reset" onclick="_reset_item('profile_header_others')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.profile_header.for_others}</h5>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-profile_header_others" aria-checked="false">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                </div>
                `);
        } else if (page == 'text') {
            return (`
                <div class="bleh--panel">
                    <h3>${trans[lang].settings.text.name}</h3>
                    <div class="inner-preview pad flex">
                        <div class="shout js-shout js-link-block" data-kate-processed="true">
                            <h3 class="shout-user">
                                <a>${auth}</a>
                            </h3>
                            <span class="avatar shout-user-avatar avatar--bleh-missing">
                                <img src="" alt="Your avatar" loading="lazy">
                            </span>
                            <a class="shout-permalink shout-timestamp">
                                <time datetime="2024-06-05T02:33:39+01:00" title="Wednesday 5 Jun 2024, 2:33am">
                                    5 Jun 2:33am
                                </time>
                            </a>
                            <div class="shout-body if-markdown-on">
                                <p>${trans[lang].settings.text.shout_preview_md}</p>
                            </div>
                            <div class="shout-body if-markdown-off">
                                <p>${trans[lang].settings.text.shout_preview}</p>
                            </div>
                        </div>
                    </div>
                    <h4>${trans[lang].settings.text.markdown.name}</h4>
                    <p>${trans[lang].settings.text.markdown.bio}</p>
                    <div class="toggle-container" id="container-shout_markdown" onclick="_update_item('shout_markdown')">
                        <button class="btn reset" onclick="_reset_item('shout_markdown')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.text.markdown.shouts}</h5>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-shout_markdown" aria-checked="false">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="toggle-container" id="container-bio_markdown" onclick="_update_item('bio_markdown')">
                        <button class="btn reset" onclick="_reset_item('bio_markdown')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.text.markdown.profile}</h5>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-bio_markdown" aria-checked="false">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                </div>
                `);
        } else if (page == 'sku') {
            return (`
                <div class="bleh--panel shh">
                    ☆⌒(>w<)
                    <div class="screen-row">
                        <div class="actions">
                            <a class="btn action">
                                <span class="text">
                                    <h5>build</h5>
                                    <p>${version.build}</p>
                                </span>
                            </a>
                            <a class="btn action">
                                <span class="text">
                                    <h5>sku</h5>
                                    <p>${version.sku}</p>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="bleh--panel">
                    <h3>Feature Flags</h3>
                    <div class="feature-flags" id="feature-flags"></div>
                </div>
                `);
        } else if (page == 'music') {
            return (`
                <div class="bleh--panel">
                    <h3>${trans[lang].settings.music.name}</h3>
                    <p>${trans[lang].settings.music.bio}</p>
                    <div class="inner-preview pad">
                        <div class="tracks">
                            <div class="track realtime">
                                <div class="cover"></div>
                                <div class="info">
                                    <div class="title"></div>
                                    <div class="artist"></div>
                                </div>
                                <div class="time"></div>
                            </div>
                            <div class="track">
                                <div class="cover"></div>
                                <div class="info">
                                    <div class="title"></div>
                                    <div class="artist"></div>
                                </div>
                                <div class="time"></div>
                            </div>
                            <div class="track">
                                <div class="cover"></div>
                                <div class="info">
                                    <div class="title"></div>
                                    <div class="artist"></div>
                                </div>
                                <div class="time"></div>
                            </div>
                            <div class="track">
                                <div class="cover"></div>
                                <div class="info">
                                    <div class="title"></div>
                                    <div class="artist"></div>
                                </div>
                                <div class="time"></div>
                            </div>
                            <div class="track">
                                <div class="cover"></div>
                                <div class="info">
                                    <div class="title"></div>
                                    <div class="artist"></div>
                                </div>
                                <div class="time"></div>
                            </div>
                        </div>
                    </div>
                    <div class="toggle-container" id="container-stacked_chartlist_info" onclick="_update_item('stacked_chartlist_info')">
                        <button class="btn reset" onclick="_reset_item('stacked_chartlist_info')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.corrections.stacked_chartlist_info.name}</h5>
                            <p>${trans[lang].settings.corrections.stacked_chartlist_info.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-stacked_chartlist_info" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="sep"></div>
                    <h4>${trans[lang].settings.music.profile_shortcut.name} <div class="new-badge">${trans[lang].settings.new}</div></h4>
                    <p>${trans[lang].settings.music.profile_shortcut.bio}</p>
                    <div class="text-container" id="container-profile_shortcut">
                        <button class="btn reset" onclick="_reset_item('profile_shortcut')">${trans[lang].settings.reset}</button>
                        <div class="avatar-container">
                            <div class="avatar-inner" id="avatar-profile_shortcut">
                                <img id="avatar_src-profile_shortcut" src="${localStorage.getItem('bleh_profile_shortcut_avi') || ''}">
                            </div>
                        </div>
                        <div class="heading content-form">
                            <h5>${trans[lang].settings.music.profile_shortcut.placeholder}</h5>
                            <div class="input-container">
                                <input type="text" maxlength="40" id="text-profile_shortcut" value="${settings.profile_shortcut}" placeholder="${trans[lang].settings.music.profile_shortcut.header}">
                                <button class="bleh--btn primary" onclick="_save_profile_shortcut()">${trans[lang].settings.save}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bleh--panel">
                    <h3>${trans[lang].settings.corrections.name}</h3>
                    <p>${trans[lang].settings.corrections.bio}</p>
                    <!--<div class="screen-row actions-only">
                        <div class="actions">
                            <a class="btn action" href="https://github.com/katelyynn/bleh/issues/new/choose" target="_blank">
                                <div class="icon bleh--correction"></div>
                                <span class="text">
                                    <h5>${trans[lang].settings.corrections.submit.name}</h5>
                                </span>
                            </a>
                            <button class="btn action" onclick="_open_correction_modal()">
                                <div class="icon bleh--correction_modal"></div>
                                <span class="text">
                                    <h5>${trans[lang].settings.corrections.view.name}</h5>
                                </span>
                            </button>
                        </div>
                    </div>-->
                    <div class="screen-row actions-only">
                        <div class="actions">
                            <a class="btn primary external" href="https://github.com/katelyynn/bleh/issues/new/choose" target="_blank">
                                ${trans[lang].settings.corrections.submit.name}
                            </a>
                            <!--<button class="btn continue" onclick="_open_correction_modal()">
                                ${trans[lang].settings.corrections.view.name}
                            </button>-->
                            <!-- TEMP: make a modal for this like above -->
                            <button class="btn continue" onclick="_change_settings_page('corrections')">
                                ${trans[lang].settings.corrections.view.name}
                            </button>
                        </div>
                    </div>
                    <div class="toggle-container" id="container-corrections" onclick="_update_item('corrections')">
                        <button class="btn reset" onclick="_reset_item('corrections')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.corrections.toggle.name}</h5>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-corrections" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="sep"></div>
                    <h4>${trans[lang].settings.corrections.formatting}</h4>
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
                                            <span class="feat" data-bleh--tag-group="guests">feat. Sunday Service Choir</span>
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
                    <div class="toggle-container" id="container-format_guest_features" onclick="_update_item('format_guest_features')">
                        <button class="btn reset" onclick="_reset_item('format_guest_features')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.corrections.format_guest_features.name}</h5>
                            <p>${trans[lang].settings.corrections.format_guest_features.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-format_guest_features" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="toggle-container hide-if-format-guest-disabled" id="container-show_guest_features" onclick="_update_item('show_guest_features')">
                        <button class="btn reset" onclick="_reset_item('show_guest_features')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.corrections.show_guest_features.name}</h5>
                            <p>${trans[lang].settings.corrections.show_guest_features.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-show_guest_features" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="toggle-container hide-if-format-guest-disabled" id="container-show_remaster_tags" onclick="_update_item('show_remaster_tags')">
                        <button class="btn reset" onclick="_reset_item('show_remaster_tags')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.corrections.show_remaster_tags.name}</h5>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-show_remaster_tags" aria-checked="true">
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
        if (!settings.feature_flags.bleh_settings_tabs)
            document.getElementById('bleh--panel-main').innerHTML = '';
        else
            document.getElementById('bleh--panel-main').innerHTML = (`
                <nav class="navlist secondary-nav navlist--more">
                    <ul class="navlist-items">
                        <li class="navlist-item secondary-nav-item">
                            <a class="secondary-nav-item-link bleh--nav" data-bleh-page="home" onclick="_change_settings_page('home')">
                                ${trans[lang].settings.home.name}
                            </a>
                        </li>
                        <li class="navlist-item secondary-nav-item">
                            <a class="secondary-nav-item-link bleh--nav" data-bleh-page="themes" onclick="_change_settings_page('themes')">
                                ${trans[lang].settings.appearance.name}
                            </a>
                        </li>
                        <li class="navlist-item secondary-nav-item">
                            <a class="secondary-nav-item-link bleh--nav" data-bleh-page="accessibility" onclick="_change_settings_page('accessibility')">
                                ${trans[lang].settings.accessibility.name}
                            </a>
                        </li>
                        <li class="navlist-item secondary-nav-item">
                            <a class="secondary-nav-item-link bleh--nav" data-bleh-page="seasonal" onclick="_change_settings_page('seasonal')">
                                ${trans[lang].settings.customise.seasonal.name}
                            </a>
                        </li>
                        <li class="navlist-item secondary-nav-item">
                            <a class="secondary-nav-item-link bleh--nav" data-bleh-page="customise" onclick="_change_settings_page('customise')">
                                ${trans[lang].settings.customise.name}
                            </a>
                        </li>
                        <li class="navlist-item secondary-nav-item">
                            <a class="secondary-nav-item-link bleh--nav" data-bleh-page="text" onclick="_change_settings_page('text')">
                                ${trans[lang].settings.text.name}
                            </a>
                        </li>
                        <li class="navlist-item secondary-nav-item">
                            <a class="secondary-nav-item-link bleh--nav" data-bleh-page="language" onclick="_change_settings_page('language')">
                                ${trans[lang].settings.language.name}
                            </a>
                        </li>
                        <li class="navlist-item secondary-nav-item">
                            <a class="secondary-nav-item-link bleh--nav" data-bleh-page="corrections" onclick="_change_settings_page('corrections')">
                                ${trans[lang].settings.corrections.name}
                            </a>
                        </li>
                        <li class="navlist-item secondary-nav-item">
                            <a class="secondary-nav-item-link bleh--nav" data-bleh-page="redirects" onclick="_change_settings_page('redirects')">
                                ${trans[lang].settings.redirects.name}
                            </a>
                        </li>
                        <li class="navlist-item secondary-nav-item">
                            <a class="secondary-nav-item-link bleh--nav" data-bleh-page="profiles" onclick="_change_settings_page('profiles')">
                                ${trans[lang].settings.profiles.name}
                            </a>
                        </li>
                        <li class="navlist-item secondary-nav-item">
                            <a class="secondary-nav-item-link bleh--nav" data-bleh-page="performance" onclick="_change_settings_page('performance')">
                                ${trans[lang].settings.performance.name}
                            </a>
                        </li>
                        <li class="navlist-item secondary-nav-item">
                            <a class="secondary-nav-item-link bleh--nav" data-bleh-page="sku" onclick="_change_settings_page('sku')">
                                shhh...
                            </a>
                        </li>
                    </ul>
                </nav>
            `);

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

        if (page == 'themes') {
            refresh_all();
            show_theme_change_in_settings();
        } else if (page == 'customise' || page == 'performance' || page == 'redirects' || page == 'corrections' || page == 'accessibility' || page == 'text' || page == 'seasonal' || page == 'music') {
            refresh_all();
        } else if (page == 'profiles') {
            init_profile_notes();
        } else if (page == 'language') {
            prepare_language_page();
        } else if (page == 'sku') {
            bleh_sku_page();
        }

        if (page == 'corrections')
            prepare_corrections_page();

        if (page == 'themes') {
            tippy(document.body.querySelector('.swatch.default'), {
                content: (stored_season.id != 'none')
                ? trans[lang].settings.customise.colours.default_with_season.replace('{season}', trans[lang].settings.customise.seasonal.listing[stored_season.id])
                : trans[lang].settings.customise.colours.default
            });
            tippy(document.body.querySelector('.swatch.custom'), {
                content: trans[lang].settings.customise.colours.custom
            });
        }

        if ((page == 'seasonal' || page == 'home') && settings.seasonal && stored_season.id != 'none') {
            tippy(document.getElementById('current_season'), {
                content: new Date(stored_season.end.replace('y0', stored_season.year)).toLocaleString(lang)
            });
            tippy(document.getElementById('current_season_start'), {
                content: new Date(stored_season.start.replace('y0', stored_season.year)).toLocaleString(lang)
            });
        }
    }

    function show_theme_change_in_settings(theme = '') {
        if (theme != '')
            settings.theme = theme;

        let btns = document.querySelectorAll('.theme-item');
        btns.forEach((btn) => {
            console.log(btn.getAttribute('data-bleh-theme'),settings.theme);
            if (btn.getAttribute('data-bleh-theme') != settings.theme) {
                btn.classList.remove('active');
            } else {
                btn.classList.add('active');
            }
        });
    }
    function show_theme_change_in_menu(theme = '', element = document.body) {
        if (theme != '')
            settings.theme = theme;

        let btns = element.querySelectorAll('.theme-item-in-menu');
        btns.forEach((btn) => {
            console.log(btn.getAttribute('data-bleh-theme'),settings.theme);
            if (btn.getAttribute('data-bleh-theme') != settings.theme) {
                btn.classList.remove('active');
            } else {
                btn.classList.add('active');
            }
        });
    }


    function load_skus() {
        for (let flag in version.feature_flags) {
            let current_state = version.feature_flags[flag].default;
            console.info('flag', flag, current_state);
            if (settings.feature_flags[flag] != undefined) current_state = settings.feature_flags[flag];
            console.info('flag', flag, current_state);

            document.documentElement.setAttribute(`data-ff--${flag}`, current_state);
        }
    }

    function bleh_sku_page() {
        let flags_container = document.getElementById('feature-flags');

        for (let flag in version.feature_flags) {
            let current_state = version.feature_flags[flag].default;
            if (settings.feature_flags[flag] != undefined) current_state = settings.feature_flags[flag];

            let feature_flag_element = document.createElement('div');
            feature_flag_element.classList.add('toggle-container');
            feature_flag_element.innerHTML = (`
                <div class="heading">
                    <h5>${version.feature_flags[flag].name}</h5>
                    <div class="info-row">
                        <div class="default-flag flag-${version.feature_flags[flag].default}">${version.feature_flags[flag].default}</div><p class="date">${version.feature_flags[flag].date}</p><p>${flag}</p>
                    </div>
                </div>
                <div class="toggle-wrap">
                    <button id="feature-flag-toggle-${flag}" class="toggle" onclick="_update_flag_toggle('${flag}', this)" aria-checked="${current_state}">
                        <div class="dot"></div>
                    </button>
                </div>
            `);

            flags_container.appendChild(feature_flag_element);

            document.documentElement.setAttribute(`data-ff--${flag}`, current_state);
        }
    }

    unsafeWindow._update_flag_toggle = function(flag, button) {
        update_flag_toggle(flag, button);
    }
    function update_flag_toggle(flag, button) {
        let current_state = version.feature_flags[flag].default;
        if (settings.feature_flags[flag] != undefined) current_state = settings.feature_flags[flag];

        if (current_state == true) {
            button.setAttribute('aria-checked', 'false');
            settings.feature_flags[flag] = false;
            document.documentElement.setAttribute(`data-ff--${flag}`, false);
        } else {
            button.setAttribute('aria-checked', 'true');
            settings.feature_flags[flag] = true;
            document.documentElement.setAttribute(`data-ff--${flag}`, true);
        }

        // save to settings
        localStorage.setItem('bleh', JSON.stringify(settings));
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
                <h5><a class="mention" href="${root}user/${user}">@${user}</a></h5>
            </div>
            <div class="note-preview">
                <p id="profile-note-row-preview--${user}">${profile_notes[user]}</p>
            </div>
            <div class="actions">
                <button class="btn bleh--edit-note" id="profile-note-row-edit--${user}" onclick="_edit_profile_note('${user}')">
                    ${trans[lang].settings.profiles.notes.edit}
                </button>
                <button class="btn bleh--delete-note" id="profile-note-row-delete--${user}" onclick="_delete_profile_note('${user}')">
                    ${trans[lang].settings.profiles.notes.delete}
                </button>
            </div>
            `);

            profile_notes_table.appendChild(profile_note);
            tippy(document.getElementById(`profile-note-row-edit--${user}`), {
                content: trans[lang].settings.profiles.notes.edit_user.replace('{u}', user)
            });
            tippy(document.getElementById(`profile-note-row-delete--${user}`), {
                content: trans[lang].settings.profiles.notes.delete_user.replace('{u}', user)
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

        create_window('edit_profile_note',trans[lang].settings.profiles.notes.edit_user.replace('{u}', username),`
        <textarea id="bleh--profile-note" placeholder="Enter a local note for this user">${profile_notes[username]}</textarea>
        <div class="modal-footer">
            <button class="btn primary" onclick="_save_profile_note_in_window('${username}')">
                ${trans[lang].settings.save}
            </button>
            <button class="btn" onclick="_kill_window('edit_profile_note')">
                ${trans[lang].settings.cancel}
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




    function prepare_corrections_page() {
        let corrections_table_artist = document.getElementById('corrections-artist');

        for (let artist in artist_corrections) {
            let correction = document.createElement('div');
            correction.classList.add('correction-row');
            correction.innerHTML = (`
            <div class="primary-name pre-transition">
                <h5>${artist}</h5>
            </div>
            <div class="arrow-divider"></div>
            <div class="primary-name post-transition">
                <h5>${artist_corrections[artist]}</h5>
            </div>
            `);

            corrections_table_artist.appendChild(correction);
        }

        //

        let corrections_table_albums_tracks = document.getElementById('corrections-albums_tracks');

        for (let artist in song_title_corrections) {
            let artist_row = document.createElement('div');
            artist_row.classList.add('artist-row');
            artist_row.innerHTML = (`
                <h5>${artist}</h5>
            `);

            corrections_table_albums_tracks.appendChild(artist_row);

            for (let media in song_title_corrections[artist]) {
                let correction = document.createElement('div');
                correction.classList.add('correction-row');
                correction.innerHTML = (`
                <div class="primary-name pre-transition">
                    <h5>${media}</h5>
                </div>
                <div class="arrow-divider"></div>
                <div class="primary-name post-transition">
                    <h5>${song_title_corrections[artist][media]}</h5>
                </div>
                `);

                corrections_table_albums_tracks.appendChild(correction);
            }
        }
    }


    function prepare_language_page() {
        let languages_table = document.getElementById('languages');

        for (let language in lang_info) {
            let lang_row = document.createElement('div');
            lang_row.classList.add('language-row');

            if (non_override_lang == language)
                lang_row.classList.add('active');

            let users = '';
            for (let user in lang_info[language].by)
                users = `${users}<a class="mention" href="${root}user/${lang_info[language].by[user]}" target="_blank">@${lang_info[language].by[user]}</a> `;

            lang_row.innerHTML = (`
            <div class="flag-container">
                <img src="https://katelyynn.github.io/bleh/fm/flags/${language}.svg" alt="flag for ${language}">
            </div>
            <div class="name">
                <h5>${lang_info[language].name}</h5>
                <p>${trans[lang].settings.language.by.replace('{users}', users)}</p>
            </div>
            ${(lang_info[language].new ? (`
            <div class="badges">
                <div class="new-badge">${trans[lang].settings.new}</div>
            </div>
            `): '<div class="badges"></div>')}
            <div class="date">
                <p>${(lang_info[language].last_updated != 'latest') ? moment(lang_info[language].last_updated).fromNow() : lang_info[language].last_updated}</p>
            </div>
            `);

            languages_table.appendChild(lang_row);
        }
    }




    // settings-page specific
    function reset_all() {
        for (let item in settings_base)
            reset_item(item);
    }

    function refresh_all() {
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
        // is this a new value?
        let new_value = false;
        if (value != settings[item])
            new_value = true;

        if (settings_base[item].require_reload && new_value)
            request_reload();


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
                let slider = document.getElementById(`slider-${item}`);

                document.getElementById(`value-${item}`).textContent = `${settings[item]}${settings_base[item].unit}`;
                slider.value = settings[item];
                document.getElementById(`slider-track-${item}`).style.setProperty('--percent', `${(settings[item] / slider.getAttribute('max')) * 100}%`);

                if (settings[item] != settings_base[item].value)
                    document.getElementById(`container-${item}`).classList.add('modified');
                else
                    document.getElementById(`container-${item}`).classList.remove('modified');
            } catch(e) {}

            // save setting into body
            document.body.style.setProperty(`--${settings_base[item].css}`, value);
            document.documentElement.setAttribute(`data-bleh--${item}`, `${value}`);

            document.documentElement.setAttribute('data-bleh--hsl-override', 'false');

            if (
                (item == 'hue' || item == 'sat' || item == 'lit') &&
                settings.hue == settings_base.hue.value &&
                settings.sat == settings_base.sat.value &&
                settings.lit == settings_base.lit.value &&
                settings.seasonal && stored_season.id != 'none'
            ) {
                document.body.style.removeProperty(`--${settings_base.hue.css}`);
                document.body.style.removeProperty(`--${settings_base.sat.css}`);
                document.body.style.removeProperty(`--${settings_base.lit.css}`);
                document.documentElement.setAttribute('data-bleh--hsl-override', 'true');
            }
        } else if (settings_base[item].type == 'toggle') {
            if (settings[item] == settings_base[item].values[0] && modify) {
                settings[item] = settings_base[item].values[1];
                document.getElementById(`toggle-${item}`).setAttribute('aria-checked',false);

                // save setting into body
                document.body.style.setProperty(`--${item}`,settings_base[item].values[1]);
                document.documentElement.setAttribute(`data-bleh--${item}`, `${settings_base[item].values[1]}`);
            } else if (modify) {
                settings[item] = settings_base[item].values[0];
                console.log(`toggle-${item}`);
                document.getElementById(`toggle-${item}`).setAttribute('aria-checked',true);


                if (item == 'dev') {
                    create_window('prompt_dev',trans[lang].settings.performance.dev.name,`
                        <p class="alert alert-info">${trans[lang].settings.performance.dev.modals.prompt.alert}</p>
                        <br>
                        ${trans[lang].settings.performance.dev.modals.prompt.stylus}
                        <br>
                        <div class="browser-choices">
                            <button class="btn browser" onclick="_chosen_chrome()">
                                <img class="browser-icon" src="https://cutensilly.org/img/chrome.png">
                                <p>${trans[lang].settings.performance.dev.modals.prompt.browsers.chrome.name}</p>
                                <p class="caption">${trans[lang].settings.performance.dev.modals.prompt.browsers.chrome.bio}</p>
                            </button>
                            <button class="btn browser" onclick="_chosen_firefox()">
                                <img class="browser-icon" src="https://cutensilly.org/img/firefox.png">
                                <p>${trans[lang].settings.performance.dev.modals.prompt.browsers.firefox.name}</p>
                                <p class="caption">${trans[lang].settings.performance.dev.modals.prompt.browsers.firefox.bio}</p>
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
        } else if (settings_base[item].type == 'options') {
            if (modify) {
                document.getElementById(`toggle-${item}-${value}`).setAttribute('aria-checked', true);
                settings[item] = value;

                let other_toggles = document.querySelectorAll(`[data-toggle="${item}"]`);
                other_toggles.forEach((toggle) => {
                    let other_value = toggle.getAttribute('data-toggle-value');
                    if (other_value == value)
                        return;
                    else
                        toggle.setAttribute('aria-checked', false);
                });

                // save setting into body
                document.body.style.setProperty(`--${item}`, value);
                document.documentElement.setAttribute(`data-bleh--${item}`, value);
            } else {
                // dont modify, just show
                if (settings[item] == value) {
                    document.getElementById(`toggle-${item}-${value}`).setAttribute('aria-checked', true);
                } else {
                    document.getElementById(`toggle-${item}-${value}`).setAttribute('aria-checked', false);
                }
            }
        }

        // save to settings
        localStorage.setItem('bleh', JSON.stringify(settings));
        } catch(e) {}

        /*if (item.startsWith('seasonal') && modify) {
            document.getElementById('bleh--panel-main').innerHTML = render_setting_page('customise');
            refresh_all();
        }*/

        if (item == 'hue' || item == 'sat' || item == 'lit') {
            update_colour_swatches();
        }
    }

    function request_reload() {
        reload_pending = true;
        deliver_notif(trans[lang].settings.reload, true, false, '', '_invoke_reload()');
    }
    unsafeWindow._invoke_reload = function() {
        invoke_reload();
    }
    function invoke_reload() {
        window.location.reload();
    }

    function update_colour_swatches() {
        let swatches = document.body.querySelectorAll('.swatch');
        swatches.forEach((swatch) => {
            let h = swatch.style.getPropertyValue('--hue');
            let s = swatch.style.getPropertyValue('--sat');
            let l = swatch.style.getPropertyValue('--lit');

            if (
                (h == settings.hue && s == settings.sat && l == settings.lit) ||
                (swatch.classList.contains('default') && settings.hue == 255 && settings.sat == 1 && settings.lit == 1) // default
            ) {
                swatch.classList.add('selected');
            } else {
                swatch.classList.remove('selected');
            }
        });
    }


    unsafeWindow._reset_inbuilt_item = function(item) {
        reset_inbuilt_item(item);
    }
    unsafeWindow._update_inbuilt_params = function(params={}) {
        update_inbuilt_params(params);
    }
    unsafeWindow._update_inbuilt_item = function(item, value) {
        update_inbuilt_item(item, value);
    }

    function update_inbuilt_item(item, value, modify=true) {
        console.log('update item',item,value);

        let test_if_valid = document.getElementById(`toggle-${item}`);
        console.info(test_if_valid, item, value, inbuilt_settings[item], 'modify', modify);
        if (test_if_valid == undefined)
            return;

        if (inbuilt_settings[item].type == 'toggle') {
            if (modify) {
                value = (document.getElementById(`toggle-${item}`).getAttribute('aria-checked') === 'true');
                console.info('new value', value);
            }

            console.info(value, inbuilt_settings[item].values[0], value == inbuilt_settings[item].values[0], modify);

            if (value == inbuilt_settings[item].values[0] && modify) {
                document.getElementById(`inbuilt-companion-checkbox-${item}`).checked = false;
                document.getElementById(`toggle-${item}`).setAttribute('aria-checked', false);
                document.documentElement.setAttribute(`data-bleh--inbuilt-${item}`, inbuilt_settings[item].values[1]);
            } else if (modify) {
                document.getElementById(`inbuilt-companion-checkbox-${item}`).checked = true;
                document.getElementById(`toggle-${item}`).setAttribute('aria-checked', true);
                document.documentElement.setAttribute(`data-bleh--inbuilt-${item}`, inbuilt_settings[item].values[0]);
            } else {
                // dont modify, just show
                if (value == inbuilt_settings[item].values[0]) {
                    document.getElementById(`inbuilt-companion-checkbox-${item}`).checked = true;
                    document.getElementById(`toggle-${item}`).setAttribute('aria-checked', true);
                    document.documentElement.setAttribute(`data-bleh--inbuilt-${item}`, inbuilt_settings[item].values[0]);
                } else {
                    document.getElementById(`inbuilt-companion-checkbox-${item}`).checked = false;
                    document.getElementById(`toggle-${item}`).setAttribute('aria-checked', false);
                    document.documentElement.setAttribute(`data-bleh--inbuilt-${item}`, inbuilt_settings[item].values[1]);
                }
            }
        }
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
        create_window('continue_dev',trans[lang].settings.performance.dev.name,`
            ${trans[lang].settings.performance.dev.modals.continue.next_step}
            <div class="modal-footer">
                <button class="btn primary" onclick="_finish_dev()">
                    ${trans[lang].settings.continue}
                </button>
            </div>
        `);
    }

    unsafeWindow._finish_dev = function() {
        open('https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.css');
        kill_window('continue_dev');
        create_window('finish_dev',trans[lang].settings.performance.dev.name,`
            <p class="alert alert-success">${trans[lang].settings.performance.dev.modals.finish.alert}</p>
            <div class="modal-footer">
                <button class="btn primary" onclick="_kill_window('finish_dev')">
                    ${trans[lang].settings.done}
                </button>
            </div>
        `);
    }


    // create a custom colour
    unsafeWindow._create_a_custom_colour = function() {
        create_window('custom_colour',trans[lang].settings.customise.colours.custom,`
        <p>${trans[lang].settings.customise.colours.modals.custom_colour.preface}</p>
        <br>
        <div class="inner-preview pad">
            <div class="palette">
                <div class="swatch" style="--col: hsl(var(--l2-c))"></div>
                <div class="swatch" style="--col: hsl(var(--l3-c))"></div>
                <div class="swatch" style="--col: hsl(var(--l4-c))"></div>
                <div class="swatch" style="--col: hsl(var(--l2))"></div>
                <div class="swatch" style="--col: hsl(var(--l3))"></div>
                <div class="swatch" style="--col: hsl(var(--l4))"></div>
            </div>
            <div class="sep"></div>
            <div class="btn-row">
                <button class="btn">${trans[lang].settings.examples.button}</button>
                <button class="btn primary">${trans[lang].settings.examples.button}</button>
                <div class="chartlist-count-bar">
                    <a class="chartlist-count-bar-link">
                        <span class="chartlist-count-bar-slug" style="width: 60%"></span>
                        <span class="chartlist-count-bar-value">44,551</span>
                    </a>
                </div>
            </div>
        </div>
        <br>
        <div class="alert alert-info seasonal-hsl-alert">
            ${trans[lang].settings.customise.colours.modals.custom_colour.seasonal_alert}
        </div>
        <div class="slider-container dim-using-hue-gradient dim-during-seasonal" id="container-hue">
            <button class="btn reset" onclick="_reset_item('hue')">${trans[lang].settings.reset}</button>
            <div class="heading">
                <h5>${trans[lang].settings.customise.colours.modals.custom_colour.hue}</h5>
            </div>
            <div class="slider">
                <div class="slider-track" id="slider-track-hue"><div class="slider-fill"></div><div class="slider-nub"></div></div>
                <input type="range" min="0" max="360" value="${settings.hue}" id="slider-hue" oninput="_update_item('hue', this.value)">
                <p id="value-hue">${settings.hue}${settings_base.hue.unit}</p>
            </div>
            <div class="hint">
                <p style="left: 0">0</p>
                <p style="left: calc((255 / 360) * 100%)">255</p>
                <p style="left: 100%">360</p>
            </div>
        </div>
        <div class="slider-container dim-using-hue-gradient dim-during-seasonal" id="container-sat">
            <button class="btn reset" onclick="_reset_item('sat')">${trans[lang].settings.reset}</button>
            <div class="heading">
                <h5>${trans[lang].settings.customise.colours.modals.custom_colour.sat}</h5>
            </div>
            <div class="slider">
                <div class="slider-track" id="slider-track-sat"><div class="slider-fill"></div><div class="slider-nub"></div></div>
                <input type="range" min="0" max="1.5" value="${settings.sat}" step="0.025" id="slider-sat" oninput="_update_item('sat', this.value)">
                <p id="value-sat">${settings.sat}${settings_base.sat.unit}</p>
            </div>
            <div class="hint">
                <p style="left: 0">0</p>
                <p style="left: calc((1 / 1.5) * 100%)">1</p>
                <p style="left: 100%">1.5</p>
            </div>
        </div>
        <div class="slider-container dim-using-hue-gradient dim-during-seasonal" id="container-lit">
            <button class="btn reset" onclick="_reset_item('lit')">${trans[lang].settings.reset}</button>
            <div class="heading">
                <h5>${trans[lang].settings.customise.colours.modals.custom_colour.lit}</h5>
            </div>
            <div class="slider">
                <div class="slider-track" id="slider-track-lit"><div class="slider-fill"></div><div class="slider-nub"></div></div>
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
                ${trans[lang].settings.done}
            </button>
        </div>
        `);

        // this displays the "reset to default" button if you are not on the defaults
        update_item('hue',settings.hue);
        update_item('sat',settings.sat);
        update_item('lit',settings.lit);
    }




    // create a window
    function create_window(id, title, inner_content, classname='') {
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

        if (classname != '')
            body.classList.add(`modal--${classname}`);

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
        try {
            document.body.removeChild(document.getElementById(`bleh--window-${id}--background`));
            document.body.removeChild(document.getElementById(`bleh--window-${id}--wrapper`));
        } catch(e) {}
    }

    unsafeWindow._kill_window = function(id) {
        kill_window(id);
    }




    // import settings
    unsafeWindow._import_settings = function() {
        create_window('import_settings',trans[lang].settings.actions.import.modals.initial.name,`
            <p class="alert alert-warning">${trans[lang].settings.actions.import.modals.initial.alert}</p>
            <br>
            <textarea id="import_area"></textarea>
            <div class="modal-footer">
                <button class="btn primary" onclick="_confirm_import()">
                    ${trans[lang].settings.actions.import.name}
                </button>
                <button class="btn" onclick="_kill_window('import_settings')">
                    ${trans[lang].settings.cancel}
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
            create_window('import_failed',trans[lang].settings.actions.import.modals.failed.name,`
            <p class="alert alert-error">${trans[lang].settings.actions.import.modals.failed.alert}</p>
            <div class="modal-footer">
                <button class="btn primary" onclick="_kill_window('import_failed')">
                    ${trans[lang].settings.done}
                </button>
            </div>
            `);
        }
    }


    // export settings
    function export_settings() {

        create_window('export_settings',trans[lang].settings.actions.export.modals.initial.name,`
            <p class="alert alert-success">${trans[lang].settings.actions.export.modals.initial.alert}</p>
            <br>
            <textarea>${JSON.stringify(settings)}</textarea>
            <div class="modal-footer">
                <button class="btn primary" onclick="_kill_window('export_settings')">
                    ${trans[lang].settings.done}
                </button>
            </div>
        `);
    }
    unsafeWindow._export_settings = function() {
        export_settings();
    }


    // reset settings
    unsafeWindow._reset_settings = function() {
        create_window('reset_settings',trans[lang].settings.actions.reset.modals.initial.name,`
            <p class="alert alert-warning">${trans[lang].settings.actions.reset.modals.initial.alert}</p>
            <div class="modal-footer">
                <button class="btn" onclick="_confirm_reset()">
                    ${trans[lang].settings.actions.reset.modals.initial.confirm}
                </button>
                <button class="btn" onclick="_export_first()">
                    ${trans[lang].settings.actions.reset.modals.initial.export}
                </button>
                <button class="btn primary" onclick="_kill_window('reset_settings')">
                    ${trans[lang].settings.cancel}
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

        if (song_title_corrections.hasOwnProperty(original_artist.toLowerCase()) && settings.corrections) {
            if (song_title_corrections[original_artist.toLowerCase()].hasOwnProperty(formatted_title))
                formatted_title = song_title_corrections[original_artist.toLowerCase()][formatted_title];
        }

        // remove double feature detection in titles breakign things
        // eg. (with A$AP Rocky & feat. Takeoff)
        formatted_title = formatted_title
        .replaceAll(' & feat. ', ';')
        .replaceAll(' & with ', ';');

        let lowercase_title = formatted_title.toLowerCase();
        console.log('lowercase', lowercase_title);
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

                    // featuring ty dolla $ign
                    // skips if this is the first character
                    if (chr < 1)
                        return;

                    // differentiate 2017 remaster to 20th deluxe
                    console.log(group, group == 'remasters', lowercase_title.includes(' remaster'));
                    if (group == 'remasters' && !lowercase_title.includes(' remaster')) {
                        continue;
                    } else {
                        // everything else
                        extras.push({
                            type: includes[group][possible_match],
                            group: group,
                            chr: chr
                        });
                    }
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
            console.log(extras[extra]);
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
            let field_text = extras[extra].text
            .replace(' feat. ', '').replace('feat. ', '').replace('featuring ', '').replace('Feat. ', '').replace('ft. ', '').replace('FEAT. ', '').replace('WITH', 'with')
            .replace('w/ ', '').replace('with ', '')
            .replaceAll(' & ', ';').replaceAll(', ', ';').replaceAll(' and ', ';')
            .replaceAll('Tyler;the', 'Tyler, the').replaceAll(' with ', ';')
            .replaceAll('- ', '')
            .replaceAll(',; ', ';');

            console.log('pre-split', field_text);

            if (field_group == 'guests') {
                song_guests = field_text.split(';');

                for (let guest in song_guests)
                    song_guests[guest] = correct_artist(song_guests[guest]);
            }
        }


        // song artist
        if (artist_corrections.hasOwnProperty(original_artist))
            original_artist = correct_artist(artist_corrections[original_artist]);


        if (extras.length > 0)
            return [formatted_title, extras, original_artist, song_guests];
        else
            return [formatted_title, [], original_artist, song_guests];
    }


    function patch_titles(element) {
        let tracklists = element.querySelectorAll('.chartlist:not(.chartlist__placeholder)');

        tracklists.forEach((tracklist) => {
            if (tracklist == null)
                return;

            console.log('tracklist found', tracklist);

            // used to ensure this hasnt been ran thru
            if (tracklist.querySelector('tbody > .chartlist-row:first-child > .kate-placeholder') != null)
                return;

            console.log('tracklist has not been run thru', tracklist);

            let tracks = tracklist.querySelectorAll('.chartlist-row:not(.chartlist__placeholder-row)');

            tracks.forEach((track => {
                console.log('track', track);

                let bla = document.createElement('div');
                bla.classList.add('kate-placeholder');
                track.appendChild(bla);

                // image
                let track_image = track.querySelector('.chartlist-image a.cover-art');

                if (track_image == null) {
                    // is there an avatar?
                    track_image = track.querySelector('.chartlist-image > span');

                    if (track_image != null) {
                        // artist statistic
                        if (track_image.classList.contains('avatar') && settings.colourful_counts) {
                            patch_artist_ranks_in_list_view(track);
                            return;
                        }
                    }
                }
                track.classList.add('chartlist-row--with-artist');

                // duration
                let track_timestamp = track.querySelector('.chartlist-timestamp span');
                if (track_timestamp != undefined) {
                    tippy(track_timestamp, {
                        content: track_timestamp.getAttribute('title')
                    });
                    track_timestamp.setAttribute('title', '');
                }

                if (settings.format_guest_features) {
                    let track_title = track.querySelector('.chartlist-name a');
                    console.info('bleh - guest features, track title:', track_title);

                    if (track_title == undefined)
                        return;

                    let is_user = (track.querySelector('.chartlist-image .avatar') != null);
                    let is_album = ((!is_user && track.querySelector('.chartlist-artist') == null && track.querySelector('.chartlist-love-button') == null) || track.classList.contains('bleh--is-album'));
                    if (is_album)
                        track.classList.add('bleh--is-album');

                    let track_artist = return_artist_from_track(track_title.getAttribute('href'), is_album);

                    let formatted_title = name_includes(track_title.getAttribute('title'), track_artist);
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
                    if (song_artist_element == null && !is_user) {
                        song_artist_element = document.createElement('td');
                        song_artist_element.classList.add('chartlist-artist');
                        track.appendChild(song_artist_element);
                    }

                    // if artist matches OR artist is blank
                    if (song_artist_element.textContent.replaceAll('+', ' ').trim() == track_artist || song_artist_element.textContent.trim() == '') {
                        // replaces with corrected artist if applicable
                        song_artist_element.innerHTML = `<a href="${root}music/${sanitise(formatted_title[2])}" title="${formatted_title[2]}">${formatted_title[2]}</a>`;

                        // append guests
                        let song_guests = formatted_title[3];
                        for (let guest in song_guests) {
                            // &
                            song_artist_element.innerHTML = `${song_artist_element.innerHTML},`;

                            let guest_element = document.createElement('a');
                            guest_element.setAttribute('href', `${root}music/${sanitise(song_guests[guest])}`);
                            guest_element.setAttribute('title', song_guests[guest]);
                            guest_element.textContent = song_guests[guest];

                            song_artist_element.appendChild(guest_element);
                        }
                    }

                    // tooltip
                    if (track_image == null || song_artist_element == null)
                        return;

                    tippy(track, {
                        theme: 'track',
                        content: (`
                            <div class="image">
                                <div class="inner-image">
                                    ${track_image.querySelector('img').outerHTML}
                                </div>
                            </div>
                            <div class="info">
                                <h5 class="title">${formatted_title[0]}</h5>
                                <p class="artist">${song_artist_element.innerHTML}</p>
                                <div class="tags">${song_tags_text}</div>
                                ${(is_album) ? '' : `<p class="album">${trans[lang].music.from_the_album.replace('{album}', correct_item_by_artist(track_image.querySelector('img').getAttribute('alt'), track_artist))}</p>`}
                            </div>
                        `),
                        allowHTML: true,
                        delay: [500, 50],
                        placement: 'bottom'/*,
                        hideOnClick: false*/
                    });
                } else if (settings.corrections) {
                    let track_title = track.querySelector('.chartlist-name a');

                    if (track_title == undefined)
                        return;

                    let song_artist_element = track.querySelector('.chartlist-artist a');
                    if (song_artist_element != undefined) {
                        let corrected_title = correct_item_by_artist(track_title.textContent, song_artist_element.textContent);
                        track_title.textContent = corrected_title;
                        track_title.setAttribute('title', corrected_title);

                        let corrected_artist = correct_artist(song_artist_element.textContent);
                        song_artist_element.textContent = corrected_artist;
                        song_artist_element.setAttribute('title', corrected_artist);
                    } else {
                        let track_artist = track_title.getAttribute('href').split('/')[2].replaceAll('+',' ');
                        let corrected_title = correct_item_by_artist(track_title.textContent, track_artist);
                        track_title.textContent = corrected_title;
                        track_title.setAttribute('title', corrected_title);
                    }
                }
            }));
        });
    }

    function patch_header_title(element) {

        let track_title = element.querySelector('.header-new-title');
        let track_artist = element.querySelector('.header-new-crumb span');

        if (track_title == undefined)
            return;

        // correct artist
        if (track_artist == undefined) {
            // must be on artist page
            if (artist_corrections.hasOwnProperty(track_title.textContent)) {
                let corrected_artist = artist_corrections[track_title.textContent];
                track_title.textContent = corrected_artist;
            }
        } else {
            // album/track page
            if (artist_corrections.hasOwnProperty(track_artist.textContent)) {
                let corrected_artist = artist_corrections[track_artist.textContent];
                track_artist.textContent = corrected_artist;
            }
        }

        if (track_artist == undefined)
            return;

        if (settings.format_guest_features) {
            try {
            if (!track_title.hasAttribute('data-kate-processed')) {
                track_title.setAttribute('data-kate-processed','true');

                let formatted_title = name_includes(track_title.textContent, track_artist.textContent);
                let song_title = formatted_title[0];
                let song_tags = formatted_title[1];

                // parse tags into text
                let song_tags_text = '';
                for (let song_tag in song_tags) {
                    song_tags_text = `${song_tags_text}<div class="feat" data-bleh--tag-type="${song_tags[song_tag].type}" data-bleh--tag-group="${song_tags[song_tag].group}">${song_tags[song_tag].text}</div>`;
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
                    guest_element.setAttribute('href',`${root}music/${sanitise(song_guests[guest])}`);
                    guest_element.setAttribute('title',song_guests[guest]);
                    guest_element.textContent = song_guests[guest];

                    song_artist_element.appendChild(guest_element);
                }
            }
            } catch(e) {}
        } else {
            if (!track_title.hasAttribute('data-kate-processed')) {
                track_title.setAttribute('data-kate-processed','true');

                let corrected_title = correct_item_by_artist(track_title.textContent, track_artist.textContent);
                track_title.textContent = corrected_title;
            }
        }
    }




    // rain
    function rain() {
        // clear old
        let rain_container_old = document.getElementById('rain-container');
        if (rain_container_old != undefined)
            document.body.removeChild(rain_container_old);

        // make anew
        let rain_container = document.createElement('div');
        rain_container.classList.add('rain-container');
        rain_container.setAttribute('id', 'rain-container');
        rain_container.innerHTML = (`
            <div class="rain" id="rain"></div>
            <div class="rain rain-back" id="rain-back"></div>
        `);
        document.body.appendChild(rain_container);

        let increment = 0;
        let drops = '';
        let subtle_drops = '';

        let rain_main = document.getElementById('rain');
        let rain_back = document.getElementById('rain-back');

        while (increment < 60) {
            // random numbers
            let randoms = [
                (Math.floor(Math.random() * (98 - 1 + 1) + 1)),
                (Math.floor(Math.random() * (5 - 2 + 1) + 2))
            ];

            increment += randoms[1];

            drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoms[1] + randoms[1] - 1 + 280) + '%; animation-delay: 0.' + randoms[0] + 's; animation-duration: 0.5' + randoms[0] + 's;"><div class="stem" style="animation-delay: 0.' + randoms[0] + 's; animation-duration: 0.5' + randoms[0] + 's;"></div><div class="splat" style="animation-delay: 0.' + randoms[0] + 's; animation-duration: 0.5' + randoms[0] + 's;"></div></div>';
            subtle_drops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoms[1] + randoms[1] - 1 + 280) + '%; animation-delay: 0.' + randoms[0] + 's; animation-duration: 0.5' + randoms[0] + 's;"><div class="stem" style="animation-delay: 0.' + randoms[0] + 's; animation-duration: 0.5' + randoms[0] + 's;"></div><div class="splat" style="animation-delay: 0.' + randoms[0] + 's; animation-duration: 0.5' + randoms[0] + 's;"></div></div>';

            rain_main.innerHTML = drops;
            rain_back.innerHTML = subtle_drops;
        }
    }

    function start_rain() {

        if (settings.rain)
            rain();
    }




    // patch gallery pages
    function patch_gallery_page() {
        let header = document.body.querySelector('header');

        if (header == undefined)
            return;

        if (header.classList.contains('header-new--album'))
            return;

        let image_list = document.body.querySelector('.image-list');

        if (image_list == undefined) {
            // dont return yet, check to see if we're focused on a gallery image

            let focused_image_details = document.body.querySelector('.gallery-sidebar');

            if (focused_image_details == null)
                return;

            // we are focused on a gallery image
            patch_gallery_focused_image(focused_image_details);
        } else {
            // we are on the gallery main page
            patch_gallery_image_listing(image_list);
        }
    }

    // gallery main page
    function patch_gallery_image_listing(image_list) {
        if (image_list.hasAttribute('data-kate-processed'))
            return;

        image_list.setAttribute('data-kate-processed', 'true');

        let bookmarked_images = JSON.parse(localStorage.getItem('bleh_bookmarked_images')) || {};

        let artist_name = document.body.querySelector('.header-new-title').textContent;

        let adaptive_skin = document.body.querySelector('.adaptive-skin-container');
        let page_content = adaptive_skin.querySelector('.page-content');

        document.body.setAttribute('data-bleh--gallery-tab', 'overview');


        // create nav
        let bookmark_nav = document.createElement('div');
        bookmark_nav.classList.add('bleh--nav-wrap', 'bleh--nav-wrap--bookmarks');
        bookmark_nav.innerHTML = (`
            <nav class="navlist secondary-nav">
                <ul class="navlist-items">
                    <li class="navlist-item secondary-nav-item secondary-nav-item--gallery-overview">
                        <a class="secondary-nav-item-link" onclick="_set_gallery_page('overview')">
                            ${trans[lang].gallery.tabs.overview}
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--gallery-bookmarks">
                        <a class="secondary-nav-item-link" onclick="_set_gallery_page('bookmarks')">
                            ${trans[lang].gallery.tabs.bookmarks}
                        </a>
                    </li>
                </ul>
            </nav>
        `);

        adaptive_skin.insertBefore(bookmark_nav, page_content);


        // content
        let bookmarks_content = document.createElement('div');
        bookmarks_content.classList.add('container', 'page-content', 'bleh--bookmarks');
        bookmarks_content.innerHTML = (`
            <div class="row buffer-4">
                <div class="col-main">
                    <h2>${trans[lang].gallery.bookmarks.name}</h2>
                    <p>${trans[lang].gallery.bookmarks.bio}</p>
                    <ul class="image-list" id="bleh--bookmarked-images" data-kate-processed="true"></ul>
                </div>
                <div class="col-sidebar"></div>
            </div>
        `);

        adaptive_skin.insertBefore(bookmarks_content, page_content);


        // append images
        if (bookmarked_images.hasOwnProperty(artist_name)) {
            bookmarked_images[artist_name].forEach((image) => {
                console.info(image);
                let image_element = document.createElement('li');
                image_element.classList.add('image-list-item-wrapper');
                // link has to open in new tab as sometimes last.fm breaks the rendering
                // of the gallery image, no clue..
                image_element.innerHTML = (`
                    <a class="image-list-item" href="/music/${artist_name}/+images/${image}">
                        <img src="https://lastfm.freetls.fastly.net/i/u/avatar170s/${image}" loading="lazy">
                    </a>
                `);

                document.getElementById('bleh--bookmarked-images').appendChild(image_element);
            });


            // mark images as bookmarked
            let col_main = page_content.querySelector('.col-main');
            let image_list = col_main.querySelectorAll('.image-list-item');
            image_list.forEach((image_list_item) => {
                let image_id_split = image_list_item.getAttribute('href').split('/');
                let image_id_length = image_id_split.length;
                let image_id = image_id_split[image_id_length - 1];

                if (bookmarked_images[artist_name].includes(image_id)) {
                    image_list_item.classList.add('image-list-item-bookmarked');
                }
            });
        } else {
            document.getElementById('bleh--bookmarked-images').outerHTML = (`
                <div class="no-data-message bleh--no-image-bookmarks">
                    <p>${trans[lang].gallery.bookmarks.no_data}</p>
                </div>
            `);
        }
    }

    unsafeWindow._set_gallery_page = function(id) {
        set_gallery_page(id);
    }
    function set_gallery_page(id) {
        document.body.setAttribute('data-bleh--gallery-tab', id);
    }

    // gallery focused image
    function patch_gallery_focused_image(sidebar) {
        let focused_image_details = sidebar.querySelector('.js-gallery-image-details > div');
        if (focused_image_details == null)
            return;

        if (focused_image_details.hasAttribute('data-kate-processed'))
            return;
        focused_image_details.setAttribute('data-kate-processed', 'true');

        let artist_name = document.body.querySelector('.header-new-title').textContent;
        let focused_image_id = focused_image_details.getAttribute('data-image-url').split('/')[4];

        let bookmarked_images = JSON.parse(localStorage.getItem('bleh_bookmarked_images')) || {};
        let image_is_bookmarked = false;
        if (bookmarked_images.hasOwnProperty(artist_name)) {
            if (bookmarked_images[artist_name].includes(focused_image_id)) {
                image_is_bookmarked = true;
                console.info('bleh - focused image is bookmarked');
            }
        }

        let gallery_interactions = focused_image_details.querySelector('.gallery-image-buttons');
        if (gallery_interactions == undefined)
            return;

        // append a bookmark button
        let gallery_bookmark_button = document.createElement('button');
        gallery_bookmark_button.classList.add('bleh--gallery-bookmark-image-btn', 'btn--has-icon');
        gallery_bookmark_button.setAttribute('data-bleh--image-is-bookmarked', image_is_bookmarked);
        gallery_bookmark_button.setAttribute('onclick', `_update_image_bookmark(this, '${artist_name}', '${focused_image_id}')`)
        // true / false
        gallery_bookmark_button.textContent = (image_is_bookmarked)
        ? trans[lang].gallery.bookmarks.button.unbookmark_this_image.name
        : trans[lang].gallery.bookmarks.button.bookmark_this_image.name;

        unsafeWindow.bookmark_tooltip = tippy(gallery_bookmark_button, {
            content: (image_is_bookmarked)
            ? trans[lang].gallery.bookmarks.button.unbookmark_this_image.bio
            : trans[lang].gallery.bookmarks.button.bookmark_this_image.bio
        });

        gallery_interactions.appendChild(gallery_bookmark_button);
    }

    unsafeWindow._update_image_bookmark = function(button, artist, id) {
        update_image_bookmark(button, artist, id);
    }
    function update_image_bookmark(button, artist, id) {
        let bookmarked_images = JSON.parse(localStorage.getItem('bleh_bookmarked_images')) || {};
        let is_bookmarked = (button.getAttribute('data-bleh--image-is-bookmarked') === 'true');

        button.textContent = (is_bookmarked)
        ? trans[lang].gallery.bookmarks.button.unbookmark_this_image.name
        : trans[lang].gallery.bookmarks.button.bookmark_this_image.name;

        console.info(unsafeWindow.bookmark_tooltip);
        unsafeWindow.bookmark_tooltip.setContent(
            (!is_bookmarked)
            ? trans[lang].gallery.bookmarks.button.unbookmark_this_image.bio
            : trans[lang].gallery.bookmarks.button.bookmark_this_image.bio
        );

        if (!bookmarked_images.hasOwnProperty(artist))
            bookmarked_images[artist] = [];

        if (is_bookmarked) {
            // remove from bookmarks

            button.setAttribute('data-bleh--image-is-bookmarked', 'false');

            let new_artist_bookmarks = [];
            for (let image in bookmarked_images[artist]) {
                if (bookmarked_images[artist][image] != id) {
                    new_artist_bookmarks.push(bookmarked_images[artist][image]);
                }
            }
            bookmarked_images[artist] = new_artist_bookmarks;

            console.info('bleh - image', id, 'from artist', artist, 'has been removed from bookmarks');
        } else {
            // add to bookmarks

            button.setAttribute('data-bleh--image-is-bookmarked', 'true');
            bookmarked_images[artist].push(id);
            console.info('bleh - image', id, 'from artist', artist, 'has been added to bookmarks');
        }

        localStorage.setItem('bleh_bookmarked_images', JSON.stringify(bookmarked_images));
    }




    unsafeWindow._force_refresh_theme = function() {
        localStorage.removeItem('bleh_cached_style');
        localStorage.removeItem('bleh_cached_style_timeout');

        window.setTimeout(invoke_reload, 400);
    }




    unsafeWindow._refresh_tracks = function(button) {
        refresh_tracks(button);
    }
    function refresh_tracks(button) {
        button.setAttribute('onclick', '');
        button.setAttribute('disabled', '');

        // we need to fetch the tracklist, this function presumes that
        // the user has a tracklist to begin with, as that is the only
        // way to call the function on the frontend
        fetch(window.location.href)
        .then(function(response) {
            console.error('returned', response, response.text);

            return response.text();
        })
        .then(function(html) {
            let doc = new DOMParser().parseFromString(html, 'text/html');
            console.error('DOC', doc);

            deliver_notif('refreshed tracks');

            let tracklist_panel = doc.getElementById('recent-tracks-section');

            if (tracklist_panel == null) {
                deliver_notif('recent tracks could not be found ;-;');
                return;
            }

            document.getElementById('recent-tracks-section').innerHTML = tracklist_panel.innerHTML;

            let refresh_btn = document.createElement('button');
            refresh_btn.classList.add('refresh-tracklist-btn');
            refresh_btn.textContent = 'Refresh';
            refresh_btn.setAttribute('onclick', '_refresh_tracks(this)');

            tippy(refresh_btn, {
                content: 'Refresh tracks'
            });

            document.getElementById('recent-tracks-section').appendChild(refresh_btn);
        });
    }




    // notifs
    function load_notifs() {
        let prev_notif = document.getElementById('bleh-notifs');
        if (prev_notif == null) {
            let notifs = document.createElement('div');
            notifs.classList.add('bleh-notifs');
            notifs.setAttribute('id', 'bleh-notifs');
            document.body.appendChild(notifs);
        }
    }

    unsafeWindow._deliver_notif = function(content, persist=false, has_icon=false, append_class='', action='') {
        deliver_notif(content, persist, has_icon, append_class, action);
    }
    function deliver_notif(content, persist=false, has_icon=false, append_class='', action='') {
        let notif = document.createElement('button');
        notif.classList.add('bleh-notif');
        notif.setAttribute('onclick', '_kill_notif(this)');
        notif.textContent = content;

        document.getElementById('bleh-notifs').appendChild(notif);

        if (has_icon)
            notif.classList.add('btn--has-icon');

        if (append_class != '')
            notif.classList.add(append_class);

        if (action != '')
            notif.setAttribute('onclick', action);

        if (persist)
            return;

        setTimeout(function() {
            kill_notif(notif);
        }, 3500);
    }

    unsafeWindow._kill_notif = function(notif) {
        kill_notif(notif);
    }
    function kill_notif(notif) {
        notif.classList.add('fade-out');
        setTimeout(function() {
            document.getElementById('bleh-notifs').removeChild(notif);
        }, 400);
    }



    /* https://stackoverflow.com/questions/46432335/hex-to-hsl-convert-javascript */
    function hex_to_hsl(hex) {
        let result = new RegExp(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex);

        let r = parseInt(result[1], 16);
        let g = parseInt(result[2], 16);
        let b = parseInt(result[3], 16);

        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        h = Math.round(h * 360);
        s = s * 100;
        s = Math.round(s);
        l = l * 100;
        l = Math.round(l);

        return {
            h: h,
            s: s,
            l: l
        };
    }

    // saturation should not exceed 2, definitely not
    // reaching 3 or even 4 in some cases
    function clamp_sat(sat) {
        if (sat > 2)
            return 2;

        return sat;
    }

    function album_missing_a_tracklist() {
        document.body.style.removeProperty('--hue-album');
        document.body.style.removeProperty('--sat-album');

        let header = document.querySelector('.header-new--album');
        if (header == null)
            return;

        // cover
        if (settings.hue_from_album) {
            let header_inner = document.querySelector('.header-new-inner');
            try {
                let bg = header_inner.getAttribute('style').replace('background: #', '');
                let hsl = hex_to_hsl(bg);
                console.info('hsl', hsl);
                document.body.style.setProperty('--hue-album', hsl.h);
                document.body.style.setProperty('--sat-album', clamp_sat((hsl.s / 100) * 3));
            } catch(e) {
                console.info('bleh - album is missing a cover');
            }
        }

        if (header.hasAttribute('data-kate-processed'))
            return;
        header.setAttribute('data-kate-processed', 'true');

        // tracklist
        let tracklist = document.getElementById('tracklist');
        if (tracklist == null) {
            let masonry = document.querySelector('.masonry-left-bottom');

            if (masonry == null) {
                /*deliver_notif('an error occured loading your tracklist');*/
                return;
            }

            tracklist = document.createElement('section');
            tracklist.innerHTML = (`
                <h3 class="text-18">${trans[lang].music.fetch_plays.name}</h3>
                <div class="loading-data-container">
                    <p class="loading-data-text">${trans[lang].music.fetch_plays.loading}</p>
                </div>
            `);
            masonry.insertBefore(tracklist, masonry.firstElementChild);

            /*let url_split = window.location.href.split('/');
            let album_url = `${url_split[(url_split.length - 2)]}/${url_split[(url_split.length - 1)]}`;
            let album_as_track_url = window.location.href.replace(album_url, `${url_split[(url_split.length - 2)]}/_/${url_split[(url_split.length - 1)]}`);*/

            let url = document.querySelector('.header-metadata-display a');
            if (url == undefined) {
                let url_split = window.location.href.split('/');
                let album_url = `${url_split[(url_split.length - 2)]}/${url_split[(url_split.length - 1)]}`;
                let album_as_track_url = window.location.href.replace(album_url, `${url_split[(url_split.length - 2)]}/_/${url_split[(url_split.length - 1)]}`);

                tracklist.innerHTML = (`
                    <h3 class="text-18">${trans[lang].music.fetch_plays.name}</h3>
                    <div class="loading-data-container">
                        <p class="loading-data-text failed">${trans[lang].music.fetch_plays.fail}</p>
                        <a class="btn" href="${album_as_track_url}">${trans[lang].music.fetch_plays.open_as_track}</a>
                    </div>
                `);
                return;
            }
            url = url.getAttribute('href');


            // we need to fetch the tracklist
            fetch(url)
                .then(function(response) {
                    console.error('returned', response, response.text);

                    return response.text();
                })
                .then(function(html) {
                    let doc = new DOMParser().parseFromString(html, 'text/html');

                    //deliver_notif(`using url ${`/user/${auth}/library/music/${album_url}`}`);
                    console.error('DOC', doc);

                    let inner_tracklist = doc.querySelector('#top-tracks-section [v-else=""] .chartlist');
                    if (inner_tracklist == null) {
                        tracklist.innerHTML = (`
                            <h3 class="text-18">${trans[lang].music.fetch_plays.name}</h3>
                            <div class="loading-data-container">
                                <p class="loading-data-text failed">${trans[lang].music.fetch_plays.fail}</p>
                                <a class="btn" href="${album_as_track_url}">${trans[lang].music.fetch_plays.open_as_track}</a>
                            </div>
                        `);
                        return;
                    }

                    inner_tracklist.classList.remove('chartlist--with-image');

                    tracklist.innerHTML = (`
                        <h3 class="text-18">${trans[lang].music.fetch_plays.name}</h3>
                        <p>Tracks listed here are based on your album plays as this album does not have a tracklist available.</p>
                        ${inner_tracklist.outerHTML}
                    `);
                })
        }
    }




    function patch_obsession_view() {
        let obsession_container = document.querySelector('.obsession-container');

        if (obsession_container == null)
            return;

        if (obsession_container.hasAttribute('data-kate-processed'))
            return;
        obsession_container.setAttribute('data-kate-processed', 'true');

        let obsession_author = document.querySelector('.obsession-details-intro a').textContent;
        let obsession_avatar = document.querySelector('.obsession-details-intro-avatar-wrap .avatar');

        patch_avatar(obsession_avatar, obsession_author);


        // remove quotations
        let obsession_reason = document.querySelector('.obsession-reason');

        if (obsession_reason == null)
            return;

        let obsession_reason_text = obsession_reason.textContent;

        obsession_reason.textContent = obsession_reason_text.trim().substr(1).slice(0, -1);
    }




    function patch_wiki_editor() {
        let wiki_editor_container = document.querySelector('.wiki-edit-container');

        if (wiki_editor_container == null)
            return;

        if (wiki_editor_container.hasAttribute('data-kate-processed'))
            return;
        wiki_editor_container.setAttribute('data-kate-processed', 'true');


        let col_sidebar = document.querySelector('.col-sidebar');

        let wiki_syntax = document.createElement('section');
        wiki_syntax.classList.add('bleh--blank-panel', 'wiki-syntax-panel');
        wiki_syntax.innerHTML = (`
            <h3 class="text-18">${trans[lang].settings.inbuilt.wiki.syntax.name}</h3>
            <div class="syntax-listing">
                <div class="syntax-listing-item">
                    <div class="code-side">[artist]julie[/artist]</div>
                    <div class="detail-side">${trans[lang].settings.inbuilt.wiki.syntax.links_to.replace('{link}', `<a href="${root}music/julie" target="_blank">julie</a>`)}</div>
                </div>
                <div class="syntax-listing-item">
                    <div class="code-side">[album artist=julie]pushing daisies[/album]</div>
                    <div class="detail-side">${trans[lang].settings.inbuilt.wiki.syntax.links_to.replace('{link}', `<a href="${root}music/julie/pushing+daisies" target="_blank">pushing daisies</a>`)}</div>
                </div>
                <div class="syntax-listing-item">
                    <div class="code-side">[track artist=julie]very little effort[/track]</div>
                    <div class="detail-side">${trans[lang].settings.inbuilt.wiki.syntax.links_to.replace('{link}', `<a href="${root}music/julie/_/very+little+effort" target="_blank">very little effort</a>`)}</div>
                </div>
            </div>
            <div class="sep"></div>
            <div class="syntax-listing">
                <div class="syntax-listing-item">
                    <div class="code-side">[url]https://cutensilly.org/bleh/fm[/url]</div>
                    <div class="detail-side">${trans[lang].settings.inbuilt.wiki.syntax.links_to.replace('{link}', `<a href="https://cutensilly.org/bleh/fm" target="_blank">https://cutensilly.org/bleh/fm</a>`)}</div>
                </div>
                <div class="syntax-listing-item">
                    <div class="code-side">[url=https://cutensilly.org/bleh/fm]blehhh[/url]</div>
                    <div class="detail-side">${trans[lang].settings.inbuilt.wiki.syntax.links_to.replace('{link}', `<a href="https://cutensilly.org/bleh/fm" target="_blank">blehhh</a>`)}</div>
                </div>
            </div>
            <div class="sep"></div>
            <div class="syntax-listing">
                <div class="syntax-listing-item">
                    <div class="code-side">[tag]grunge[/tag]</div>
                    <div class="detail-side">${trans[lang].settings.inbuilt.wiki.syntax.links_to.replace('{link}', `<a href="${root}tag/grunge" target="_blank">grunge</a>`)}</div>
                </div>
                <div class="syntax-listing-item">
                    <div class="code-side">[user]${auth}[/user]</div>
                    <div class="detail-side">${trans[lang].settings.inbuilt.wiki.syntax.links_to.replace('{link}', `<a class="mention" href="${root}user/${auth}" target="_blank">@${auth}</a>`)}</div>
                </div>
            </div>
        `);

        col_sidebar.insertBefore(wiki_syntax, col_sidebar.firstElementChild);
    }


    function sanitise(text) {
        return text
        .replaceAll(' ', '+')
        .replaceAll('?', '%3F');
    }
    function desanitise(text) {
        return text
        .replaceAll('+', ' ')
        .replaceAll('%3F', '?');
    }


    function return_artist_from_track(url, is_album) {
        let split = url.split('/');
        let length = (split.length - 1);

        // lets treat unicode properly
        if (is_album)
            return decodeURI(desanitise(split[length - 1]));
        else
            return decodeURI(desanitise(split[length - 2]));
    }




    function bleh_setup() {
        document.body.style.removeProperty('--hue-album');
        document.body.style.removeProperty('--sat-album');

        console.info('bleh - loading first-time setup');

        let adaptive_skin_container = document.querySelector('.adaptive-skin-container:not([data-kate-processed])');

        if (adaptive_skin_container == null)
            return;
        adaptive_skin_container.setAttribute('data-kate-processed','true');

        // initial
        adaptive_skin_container.innerHTML = '';
        document.title = 'bleh setup | Last.fm';


        // go wild
        adaptive_skin_container.innerHTML = (`
            <div class="bleh--page-outer">
                <div class="bleh--page-inner bleh-setup-container"></div>
            </div>
        `);

        document.body.classList.add('bleh-setup');
        document.body.style.setProperty('background-image', `url(${my_avi})`);

        create_window('bleh_setup_start','',`
            <div class="setup-sides">
                <div class="setup-preview">
                    <div class="setup-icon setup-icon-main setup-icon-home"></div>
                </div>
                <div class="setup-body">
                    <div class="setup-body-main">
                        <h1>${trans[lang].setup.start.name}</h1>
                        <div class="user-top-panel">
                            <div class="user-top-avatar user-top-avatar-side-left"></div>
                            <img class="user-top-avatar user-top-avatar-main" src="${my_avi.replace('avatar42s', 'avatar170s')}" alt="${auth}">
                            <div class="user-top-avatar user-top-avatar-side-right"></div>
                        </div>
                        <h4>${trans[lang].setup.start.thanks.replace('{m}', `<a class="mention" href="${root}user/${auth}">@${auth}</a>`)}</h4>
                        <p>${trans[lang].setup.start.info[0]}</p>
                        <ul>
                            <li>${trans[lang].setup.start.info[1]}</li>
                            <li>${trans[lang].setup.start.info[2]}</li>
                            <li>${trans[lang].setup.start.info[3]}</li>
                            <li>${trans[lang].setup.start.info[4]}</li>
                        </ul>
                        <p>${trans[lang].setup.start.info[5]}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn skip" onclick="_setup_skip()">
                            ${trans[lang].settings.skip}
                        </button>
                        <button class="btn primary continue" onclick="_setup_accessibility()">
                            ${trans[lang].settings.continue}
                        </button>
                    </div>
                </div>
            </div>
        `, 'setup');
    }

    unsafeWindow._setup_accessibility = function() {
        kill_window('bleh_setup_start');
        kill_window('bleh_setup_appearance');
        create_window('bleh_setup_accessibility','',`
            <div class="setup-sides">
                <div class="setup-preview">
                    <div class="setup-icon setup-icon-main setup-icon-accessibility"></div>
                </div>
                <div class="setup-body">
                    <div class="setup-body-main">
                        <h1>${trans[lang].settings.accessibility.name}</h1>
                        <div class="toggle-container" id="container-reduced_motion">
                            <button class="btn reset" onclick="_reset_item('reduced_motion')">${trans[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans[lang].settings.accessibility.reduced_motion.name}</h5>
                                <p>${trans[lang].settings.accessibility.reduced_motion.bio}</p>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-reduced_motion" onclick="_update_item('reduced_motion')" aria-checked="false">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                        <div class="inner-preview pad flex">
                            <div class="shout js-shout js-link-block" data-kate-processed="true">
                                <h3 class="shout-user">
                                    <a>${auth}</a>
                                </h3>
                                <span class="avatar shout-user-avatar avatar--bleh-missing">
                                    <img src="" alt="Your avatar" loading="lazy">
                                </span>
                                <a class="shout-permalink shout-timestamp">
                                    <time datetime="2024-06-05T02:33:39+01:00" title="Wednesday 5 Jun 2024, 2:33am">
                                        5 Jun 2:33am
                                    </time>
                                </a>
                                <div class="shout-body">
                                    <p>${trans[lang].settings.accessibility.shout_preview}</p>
                                </div>
                            </div>
                        </div>
                        <div class="toggle-container" id="container-accessible_name_colours">
                            <button class="btn reset" onclick="_reset_item('accessible_name_colours')">${trans[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans[lang].settings.accessibility.accessible_name_colours.name}</h5>
                                <p>${trans[lang].settings.accessibility.accessible_name_colours.bio}</p>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-accessible_name_colours" onclick="_update_item('accessible_name_colours')" aria-checked="false">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                        <div class="toggle-container" id="container-underline_links">
                            <button class="btn reset" onclick="_reset_item('underline_links')">${trans[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans[lang].settings.accessibility.underline_links.name}</h5>
                                <p>${trans[lang].settings.accessibility.underline_links.bio}</p>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-underline_links" onclick="_update_item('underline_links')" aria-checked="false">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn back" disabled>
                            ${trans[lang].settings.back}
                        </button>
                        <div class="btn-fill"></div>
                        <button class="btn skip" onclick="_setup_skip()">
                            ${trans[lang].settings.skip}
                        </button>
                        <button class="btn primary continue" onclick="_setup_appearance()">
                            ${trans[lang].settings.continue}
                        </button>
                    </div>
                </div>
            </div>
        `, 'setup');
        refresh_all();
    }

    unsafeWindow._setup_appearance = function() {
        kill_window('bleh_setup_accessibility');
        kill_window('bleh_setup_theme');
        create_window('bleh_setup_appearance','',`
            <div class="setup-sides">
                <div class="setup-preview">
                    <div class="setup-icon setup-icon-main setup-icon-appearance">
                        <div class="setup-colour-behind for-appearance-0"></div>
                        <div class="setup-colour-behind for-appearance-1"></div>
                        <div class="setup-colour-behind for-appearance-2"></div>
                    </div>
                </div>
                <div class="setup-body">
                    <div class="setup-body-main">
                        <h1>${trans[lang].settings.appearance.name}</h1>
                        <p>${trans[lang].setup.appearance.bio}</p>
                        <h4>${trans[lang].settings.customise.colours.name}</h4>
                        <!--<h5>${trans[lang].settings.customise.colours.presets}</h5>-->
                        <div class="palette options colours" id="custom_colours">
                            <button class="swatch btn default" style="
                                --hue: var(--hue-seasonal, 255);
                                --sat: var(--sat-seasonal, 1);
                                --lit: var(--lit-seasonal, 1)" onclick="_update_params({
                                hue: 255,
                                sat: 1,
                                lit: 1
                            })"></button>
                            <button class="swatch btn custom" style="
                                --hue: var(--hue-user, 255);
                                --sat: var(--sat-user, 1);
                                --lit: var(--lit-user, 1)" onclick="_create_a_custom_colour()"></button>
                        </div>
                        <p class="subtext">${trans[lang].setup.appearance.subtext}</p>
                        <div class="palette options colours">
                            <div class="side">
                                <button class="swatch btn" style="
                                    --hue: -2;
                                    --sat: 1.35;
                                    --lit: 0.85" onclick="_update_params({
                                    hue: -2,
                                    sat: 1.35,
                                    lit: 0.85
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: -2;
                                    --sat: 1.25;
                                    --lit: 0.85" onclick="_update_params({
                                    hue: -2,
                                    sat: 1.25,
                                    lit: 0.85
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 356;
                                    --sat: 1.25;
                                    --lit: 0.9" onclick="_update_params({
                                    hue: 356,
                                    sat: 1.25,
                                    lit: 0.9
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 351;
                                    --sat: 1.2;
                                    --lit: 0.9" onclick="_update_params({
                                    hue: 351,
                                    sat: 1.2,
                                    lit: 0.9
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 346;
                                    --sat: 1.3;
                                    --lit: 0.85" onclick="_update_params({
                                    hue: 346,
                                    sat: 1.3,
                                    lit: 0.85
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 339;
                                    --sat: 1.3;
                                    --lit: 0.85" onclick="_update_params({
                                    hue: 339,
                                    sat: 1.3,
                                    lit: 0.85
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 331;
                                    --sat: 1.1;
                                    --lit: 0.8" onclick="_update_params({
                                    hue: 331,
                                    sat: 1.1,
                                    lit: 0.8
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 310;
                                    --sat: 1.2;
                                    --lit: 0.85" onclick="_update_params({
                                    hue: 310,
                                    sat: 1.2,
                                    lit: 0.85
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 286;
                                    --sat: 1.2;
                                    --lit: 0.9" onclick="_update_params({
                                    hue: 286,
                                    sat: 1.2,
                                    lit: 0.9
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 274;
                                    --sat: 1.25;
                                    --lit: 0.9" onclick="_update_params({
                                    hue: 274,
                                    sat: 1.25,
                                    lit: 0.9
                                })"></button>
                            </div>
                            <div class="side">
                                <button class="swatch btn" style="
                                    --hue: 7;
                                    --sat: 1.35;
                                    --lit: 0.8" onclick="_update_params({
                                    hue: 7,
                                    sat: 1.35,
                                    lit: 0.8
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 9;
                                    --sat: 1.25;
                                    --lit: 0.84" onclick="_update_params({
                                    hue: 9,
                                    sat: 1.25,
                                    lit: 0.84
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 14;
                                    --sat: 1.25;
                                    --lit: 0.88" onclick="_update_params({
                                    hue: 14,
                                    sat: 1.25,
                                    lit: 0.88
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 18;
                                    --sat: 1.2;
                                    --lit: 0.9" onclick="_update_params({
                                    hue: 18,
                                    sat: 1.2,
                                    lit: 0.9
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 24;
                                    --sat: 1.2;
                                    --lit: 0.93" onclick="_update_params({
                                    hue: 24,
                                    sat: 1.2,
                                    lit: 0.93
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 30;
                                    --sat: 1.3;
                                    --lit: 1" onclick="_update_params({
                                    hue: 30,
                                    sat: 1.3,
                                    lit: 1
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 38;
                                    --sat: 1.3;
                                    --lit: 0.98" onclick="_update_params({
                                    hue: 38,
                                    sat: 1.3,
                                    lit: 0.98
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 49;
                                    --sat: 1.3;
                                    --lit: 0.98" onclick="_update_params({
                                    hue: 49,
                                    sat: 1.3,
                                    lit: 0.98
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 53;
                                    --sat: 1.3;
                                    --lit: 0.95" onclick="_update_params({
                                    hue: 53,
                                    sat: 1.3,
                                    lit: 0.95
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 62;
                                    --sat: 1.25;
                                    --lit: 0.95" onclick="_update_params({
                                    hue: 62,
                                    sat: 1.25,
                                    lit: 0.95
                                })"></button>
                            </div>
                            <div class="side">
                                <button class="swatch btn" style="
                                    --hue: 75;
                                    --sat: 1.1;
                                    --lit: 1" onclick="_update_params({
                                    hue: 75,
                                    sat: 1.1,
                                    lit: 1
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 85;
                                    --sat: 1;
                                    --lit: 1" onclick="_update_params({
                                    hue: 85,
                                    sat: 1,
                                    lit: 1
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 95;
                                    --sat: 1.1;
                                    --lit: 1" onclick="_update_params({
                                    hue: 95,
                                    sat: 1.1,
                                    lit: 1
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 115;
                                    --sat: 1;
                                    --lit: 1" onclick="_update_params({
                                    hue: 115,
                                    sat: 1,
                                    lit: 1
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 130;
                                    --sat: 1.2;
                                    --lit: 0.95" onclick="_update_params({
                                    hue: 130,
                                    sat: 1.2,
                                    lit: 0.95
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 140;
                                    --sat: 1.2;
                                    --lit: 0.9" onclick="_update_params({
                                    hue: 140,
                                    sat: 1.2,
                                    lit: 0.9
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 155;
                                    --sat: 1.2;
                                    --lit: 0.85" onclick="_update_params({
                                    hue: 155,
                                    sat: 1.2,
                                    lit: 0.85
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 165;
                                    --sat: 1.1;
                                    --lit: 0.8" onclick="_update_params({
                                    hue: 165,
                                    sat: 1.1,
                                    lit: 0.8
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 174;
                                    --sat: 1.1;
                                    --lit: 0.8" onclick="_update_params({
                                    hue: 174,
                                    sat: 1.1,
                                    lit: 0.8
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 184;
                                    --sat: 1.05;
                                    --lit: 0.75" onclick="_update_params({
                                    hue: 184,
                                    sat: 1.05,
                                    lit: 0.75
                                })"></button>
                            </div>
                            <div class="side">
                                <button class="swatch btn" style="
                                    --hue: 205;
                                    --sat: 1;
                                    --lit: 1" onclick="_update_params({
                                    hue: 205,
                                    sat: 1,
                                    lit: 1
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 222;
                                    --sat: 1;
                                    --lit: 0.9" onclick="_update_params({
                                    hue: 222,
                                    sat: 1,
                                    lit: 0.9
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 230;
                                    --sat: 1.3;
                                    --lit: 0.9" onclick="_update_params({
                                    hue: 230,
                                    sat: 1.3,
                                    lit: 0.9
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 230;
                                    --sat: 1.3;
                                    --lit: 0.825" onclick="_update_params({
                                    hue: 230,
                                    sat: 1.3,
                                    lit: 0.825
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 243;
                                    --sat: 1.3;
                                    --lit: 0.9" onclick="_update_params({
                                    hue: 243,
                                    sat: 1.3,
                                    lit: 0.9
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 249;
                                    --sat: 1.3;
                                    --lit: 0.9" onclick="_update_params({
                                    hue: 249,
                                    sat: 1.3,
                                    lit: 0.9
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 255;
                                    --sat: 1.2;
                                    --lit: 0.9" onclick="_update_params({
                                    hue: 255,
                                    sat: 1.2,
                                    lit: 0.9
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 263;
                                    --sat: 1.2;
                                    --lit: 0.9" onclick="_update_params({
                                    hue: 263,
                                    sat: 1.2,
                                    lit: 0.9
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 260;
                                    --sat: 1.1;
                                    --lit: 0.95" onclick="_update_params({
                                    hue: 260,
                                    sat: 1.1,
                                    lit: 0.95
                                })"></button>
                                <button class="swatch btn" style="
                                    --hue: 255;
                                    --sat: 1;
                                    --lit: 0.95" onclick="_update_params({
                                    hue: 255,
                                    sat: 1,
                                    lit: 0.95
                                })"></button>
                            </div>
                        </div>
                        <div class="toggle-container" id="container-hue_from_album">
                            <button class="btn reset" onclick="_reset_item('hue_from_album')">${trans[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans[lang].settings.customise.hue_from_album.name}</h5>
                                <p>${trans[lang].settings.customise.hue_from_album.bio}</p>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-hue_from_album" onclick="_update_item('hue_from_album')" aria-checked="true">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn back" onclick="_setup_accessibility()">
                            ${trans[lang].settings.back}
                        </button>
                        <div class="btn-fill"></div>
                        <button class="btn skip" onclick="_setup_skip()">
                            ${trans[lang].settings.skip}
                        </button>
                        <button class="btn primary continue" onclick="_setup_theme()">
                            ${trans[lang].settings.continue}
                        </button>
                    </div>
                </div>
            </div>
        `, 'setup');
        refresh_all();

        tippy(document.body.querySelector('.swatch.default'), {
            content: (stored_season.id != 'none')
            ? trans[lang].settings.customise.colours.default_with_season.replace('{season}', trans[lang].settings.customise.seasonal.listing[stored_season.id])
            : trans[lang].settings.customise.colours.default
        });
        tippy(document.body.querySelector('.swatch.custom'), {
            content: trans[lang].settings.customise.colours.custom
        });
    }

    unsafeWindow._setup_theme = function() {
        kill_window('bleh_setup_appearance');
        kill_window('bleh_setup_corrections');
        create_window('bleh_setup_theme','',`
            <div class="setup-sides">
                <div class="setup-preview">
                    <div class="setup-icon setup-icon-main setup-icon-theme"></div>
                </div>
                <div class="setup-body">
                    <div class="setup-body-main">
                        <h1>${trans[lang].settings.appearance.name}</h1>
                        <h4>${trans[lang].settings.themes.name}</h4>
                        <!--<h4>${trans[lang].settings.themes.dark.name}</h4>-->
                        <div class="setting-items full">
                            <div class="side-left full even-more">
                                <button class="btn theme-item" data-bleh-theme="light" onclick="change_theme_from_settings('light')">
                                    <div class="preview" data-bleh--theme="light">
                                        ${theme_preview}
                                    </div>
                                    <div class="text">
                                        <h5>${trans[lang].settings.themes.light.name}</h5>
                                    </div>
                                </button>
                                <button class="btn theme-item" data-bleh-theme="dark" onclick="change_theme_from_settings('dark')">
                                    <div class="preview" data-bleh--theme="dark">
                                        ${theme_preview}
                                    </div>
                                    <div class="text">
                                        <h5>${trans[lang].settings.themes.dark.name}</h5>
                                    </div>
                                </button>
                                <button class="btn theme-item" data-bleh-theme="darker" onclick="change_theme_from_settings('darker')">
                                    <div class="preview" data-bleh--theme="darker">
                                        ${theme_preview}
                                    </div>
                                    <div class="text">
                                        <h5>${trans[lang].settings.themes.darker.name}</h5>
                                    </div>
                                </button>
                                <button class="btn theme-item" data-bleh-theme="oled" onclick="change_theme_from_settings('oled')">
                                    <div class="preview" data-bleh--theme="oled">
                                        ${theme_preview}
                                    </div>
                                    <div class="text">
                                        <h5>${trans[lang].settings.themes.oled.name}</h5>
                                    </div>
                                </button>
                            </div>
                        </div>
                        ${(settings.feature_flags.high_contrast) ? (`
                        <div class="toggle-container" id="container-high_contrast">
                            <button class="btn reset" onclick="_reset_item('high_contrast')">${trans[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans[lang].settings.customise.high_contrast.name}</h5>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-high_contrast" onclick="_update_item('high_contrast')" aria-checked="true">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                        `) : ''}
                    </div>
                    <div class="modal-footer">
                        <button class="btn back" onclick="_setup_appearance()">
                            ${trans[lang].settings.back}
                        </button>
                        <div class="btn-fill"></div>
                        <button class="btn skip" onclick="_setup_skip()">
                            ${trans[lang].settings.skip}
                        </button>
                        <button class="btn primary continue" onclick="_setup_corrections()">
                            ${trans[lang].settings.continue}
                        </button>
                    </div>
                </div>
            </div>
        `, 'setup');
        refresh_all();
        show_theme_change_in_settings();
    }

    unsafeWindow._setup_corrections = function() {
        kill_window('bleh_setup_theme');
        create_window('bleh_setup_corrections','',`
            <div class="setup-sides">
                <div class="setup-preview">
                    <div class="setup-icon setup-icon-main setup-icon-corrections"></div>
                </div>
                <div class="setup-body">
                    <div class="setup-body-main">
                        <h1>${trans[lang].settings.corrections.name}</h1>
                        <p>${trans[lang].settings.corrections.bio}</p>
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
                                                <span class="feat" data-bleh--tag-group="guests">feat. Sunday Serv..</span>
                                            </a>
                                        </td>
                                        <td class="chartlist-artist bleh--chartlist-name-without-features">
                                            <a href="/music/Quadeca" title="Quadeca">Quadeca</a>
                                        </td>
                                        <td class="chartlist-artist bleh--chartlist-name-with-features">
                                            <a href="/music/Quadeca" title="Quadeca">Quadeca</a>,
                                            <a href="/music/Quadeca" title="Quadeca">Sunday Service</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="toggle-container" id="container-format_guest_features">
                            <button class="btn reset" onclick="_reset_item('format_guest_features')">${trans[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans[lang].settings.corrections.format_guest_features.name}</h5>
                                <p>${trans[lang].settings.corrections.format_guest_features.bio}</p>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-format_guest_features" onclick="_update_item('format_guest_features')" aria-checked="true">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                        <div class="toggle-container" id="container-show_guest_features">
                            <button class="btn reset" onclick="_reset_item('show_guest_features')">${trans[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans[lang].settings.corrections.show_guest_features.name}</h5>
                                <p>${trans[lang].settings.corrections.show_guest_features.bio}</p>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-show_guest_features" onclick="_update_item('show_guest_features')" aria-checked="true">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                        <div class="toggle-container" id="container-show_remaster_tags">
                            <button class="btn reset" onclick="_reset_item('show_remaster_tags')">${trans[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans[lang].settings.corrections.show_remaster_tags.name}</h5>
                                <p>${trans[lang].settings.corrections.show_remaster_tags.bio}</p>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-show_remaster_tags" onclick="_update_item('show_remaster_tags')" aria-checked="true">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                        <div class="toggle-container" id="container-stacked_chartlist_info">
                            <button class="btn reset" onclick="_reset_item('stacked_chartlist_info')">${trans[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans[lang].settings.corrections.stacked_chartlist_info.name}</h5>
                                <p>${trans[lang].settings.corrections.stacked_chartlist_info.bio}</p>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-stacked_chartlist_info" onclick="_update_item('stacked_chartlist_info')" aria-checked="true">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn back" onclick="_setup_theme()">
                            ${trans[lang].settings.back}
                        </button>
                        <div class="btn-fill"></div>
                        <button class="btn primary continue" onclick="_setup_skip()">
                            ${trans[lang].settings.finish}
                        </button>
                    </div>
                </div>
            </div>
        `, 'setup');
        refresh_all();
    }

    unsafeWindow._setup_skip = function() {
        kill_window('bleh_setup_start');
        document.location.href = `${root}user/${auth}`;
    }




    /**
     * notify user if new update and stores in localStorage for next time
     * @returns if first-time installing, redirect to setup
     */
    function notify_if_new_update() {
        let last_version_used = localStorage.getItem('bleh_last_version_used') || '';

        // enter first-time setup
        if (last_version_used == '') {
            window.location.href = `${root}bleh/setup`;
            localStorage.setItem('bleh_last_version_used', version.build);
            return;
        }

        // otherwise, it's a usual update
        if (last_version_used != version.build) {
            deliver_notif(trans[lang].messaging.update.replace('{v}', `${version.build}.${version.sku}`), true);
            localStorage.setItem('bleh_last_version_used', version.build);
        }
    }




    unsafeWindow._set_profile_as_shortcut = function(button, profile_name) {
        let menu_item = document.getElementById('profile_shortcut');

        let avatar_src = document.body.querySelector('.header-avatar-inner-wrap img').getAttribute('src');
        localStorage.setItem('bleh_profile_shortcut_avi', avatar_src);
        deliver_notif(trans[lang].settings.music.profile_shortcut.saved);

        menu_item.setAttribute('data-profile-shortcut', profile_name);
        menu_item.setAttribute('href', `${root}user/${profile_name}`);
        menu_item.textContent = profile_name;

        // show on button
        button.setAttribute('data-is-shortcut', 'true');
        button.removeAttribute('onclick');
        button._tippy.setContent(trans[lang].profile.shortcut.remove);

        // save to settings
        settings.profile_shortcut = profile_name;
        localStorage.setItem('bleh', JSON.stringify(settings));
    }

    unsafeWindow._save_profile_shortcut = function() {
        let profile_name = document.getElementById('text-profile_shortcut').value;
        let profile_img = document.getElementById('avatar-profile_shortcut');

        let menu_item = document.getElementById('profile_shortcut');

        if (profile_name == '' || profile_name == auth) {
            localStorage.removeItem('bleh_profile_shortcut_avi');
            document.getElementById('avatar_src-profile_shortcut').setAttribute('src', '');

            menu_item.setAttribute('data-profile-shortcut', '');
            menu_item.setAttribute('href', '');
            menu_item.textContent = '';

            // save to settings
            settings.profile_shortcut = '';
            localStorage.setItem('bleh', JSON.stringify(settings));

            return;
        }

        profile_img.classList.add('requesting');

        fetch(`${root}user/${profile_name}/tags`)
        .then(function(response) {
            console.log('returned', response, response.text);

            return response.text();
        })
        .then(function(html) {
            let doc = new DOMParser().parseFromString(html, 'text/html');
            console.log('DOC', doc);

            profile_img.classList.remove('requesting');

            try {
                let avatar_src = doc.querySelector('.header-avatar-inner-wrap img').getAttribute('src');
                localStorage.setItem('bleh_profile_shortcut_avi', avatar_src);
                document.getElementById('avatar_src-profile_shortcut').setAttribute('src', avatar_src);
                deliver_notif(trans[lang].settings.music.profile_shortcut.saved);

                menu_item.setAttribute('data-profile-shortcut', profile_name);
                menu_item.setAttribute('href', `${root}user/${profile_name}`);
                menu_item.textContent = profile_name;

                // save to settings
                settings.profile_shortcut = profile_name;
                localStorage.setItem('bleh', JSON.stringify(settings));
            } catch(e) {
                deliver_notif(trans[lang].settings.music.profile_shortcut.failed);
                localStorage.removeItem('bleh_profile_shortcut_avi');
                document.getElementById('avatar_src-profile_shortcut').setAttribute('src', '');

                menu_item.setAttribute('data-profile-shortcut', '');
                menu_item.setAttribute('href', '');
                menu_item.textContent = '';
            }
        });
    }




    function show_your_scrobbles() {
        let header_new = document.body.querySelector('.header-new');

        if (header_new == null)
            return;

        if (header_new.classList.contains('header-new--subpage'))
            return;

        if (header_new.hasAttribute('data-bleh'))
            return;
        header_new.setAttribute('data-bleh', 'true');

        let header_type = header_new.classList[1].replace('header-new--', '');

        show_numbers_on_side(header_type);


        let col_main = document.body.querySelector('.top-overview-panel');
        if (col_main == null)
            col_main = document.body.querySelector('.col-main');


        // create container
        let top_container = document.createElement('div');
        top_container.classList.add('top-container');

        let listen_container = document.createElement('div');
        listen_container.classList.add('listen-container', 'view-buttons');


        // page url
        let page_url = window.location.href;
        let page_url_split = page_url.split('/');
        let page_url_length = (page_url_split.length - 1);

        // artist
        let scrobble_page = page_url_split[page_url_length];
        if (header_type == 'album') {
            scrobble_page = page_url_split[page_url_length - 1] + '/' + page_url_split[page_url_length];
        } else if (header_type == 'track') {
            scrobble_page = page_url_split[page_url_length - 2] + '/_/' + page_url_split[page_url_length];
        }


        // you
        let your_listens = {
            name: auth,
            listens: 0,
            link: scrobble_page,
            avi: my_avi
        };
        // check to see if you have scrobbles
        let scrobble_button = col_main.querySelector('.personal-stats-item--scrobbles .hidden-xs a');
        if (scrobble_button != null) {
            your_listens.listens = clean_number(scrobble_button.textContent.trim());
        }
        // create child for u
        create_listen_item(listen_container, your_listens, header_type);


        // profile shortcut :3
        if (settings.profile_shortcut != '') {
            let shortcut_listens = {
                name: settings.profile_shortcut,
                listens: -1,
                link: scrobble_page,
                avi: localStorage.getItem('bleh_profile_shortcut_avi')
            }
            // create child for them
            create_listen_item(listen_container, shortcut_listens);

            fetch(`${root}user/${shortcut_listens.name}/library/music/${scrobble_page}`)
            .then(function(response) {
                console.log('returned', response, response.text);

                return response.text();
            })
            .then(function(html) {
                let doc = new DOMParser().parseFromString(html, 'text/html');
                console.log('DOC', doc);

                let first_metadata_item = doc.querySelector('.metadata-item .metadata-display');

                let listens = 0;

                let listen_item = document.getElementById(`listen-item--${shortcut_listens.name}`);

                // sometimes this fails even thou they do have plays, this is just a last.fm bug
                // i dont feel comfortable displaying 0 here as it may not be true
                // but i guess i should?
                if (first_metadata_item != null)
                    listens = clean_number(first_metadata_item.textContent.trim());

                listen_item.setAttribute('data-listens', listens);

                listen_item.innerHTML = (`
                    <img class="view-item-avatar" src="${shortcut_listens.avi}" alt="${shortcut_listens.name}">${trans[lang].music.listens.count_listens.replace('{c}', listens.toLocaleString(lang))}
                `);

                // colourful counts
                if (settings.colourful_counts && header_type == 'artist') {
                    let parsed_scrobble_as_rank = parse_scrobbles_as_rank(listens);

                    listen_item.setAttribute('data-bleh--scrobble-milestone',parsed_scrobble_as_rank.milestone);
                    listen_item.style.setProperty('--hue-user',parsed_scrobble_as_rank.hue);
                    listen_item.style.setProperty('--sat-user',parsed_scrobble_as_rank.sat);
                    listen_item.style.setProperty('--lit-user',parsed_scrobble_as_rank.lit);
                }
            });
        }


        // append
        top_container.appendChild(listen_container);
        col_main.insertBefore(top_container, col_main.firstElementChild);


        // other listeners
        if (header_type == 'artist') {
            //
            let other_container = col_main.querySelector('.personal-stats-item--listeners');
            if (other_container == null)
                return;

            let listen_divider = document.createElement('div');
            listen_divider.classList.add('listen-divider');

            listen_container.appendChild(listen_divider);

            let avatars = other_container.querySelectorAll('.personal-stats-listener-avatar img');
            let count = other_container.querySelector('.header-metadata-display a');

            let other_listeners = {
                name: 'others',
                listens: -2,
                link: scrobble_page,
                avi: avatars,
                count: (count != null) ? clean_number(count.textContent.trim()) : 5
            }
            // create child for them
            create_listen_item(listen_container, other_listeners, header_type);
        }


        // interactables on the right
        let interact_container = document.createElement('div');
        interact_container.classList.add('interact-container', 'view-buttons');


        let text = document.body.querySelector('.header-new-title').textContent
        .replaceAll(' ', '+')
        .replaceAll('&', '%26');

        let artist = document.body.querySelector('.header-new-crumb');
        if (artist != undefined)
            text = `${text}+${artist.textContent
            .replaceAll(' ', '+')
            .replaceAll('&', '%26')}`;


        // temp probably
        let header_actions = document.body.querySelector('.header-new-actions');

        interact_container.innerHTML = header_actions.innerHTML;


        let buttons = interact_container.querySelectorAll('button');
        buttons.forEach((button) => {
            button.classList.add('btn', 'view-item', 'interact-item');

            if (button.classList[0] == 'header-new-more-button')
                interact_container.removeChild(button.parentElement);
        });
        let links = interact_container.querySelectorAll('a');
        links.forEach((button) => {
            button.classList.add('btn', 'view-item', 'interact-item');
        });


        // obsession
        let obsession_form = header_actions.querySelector('form[action$="obsessions"]');
        if (obsession_form != null) {
            let obsession_btn = obsession_form.querySelector('button');
            obsession_btn.classList = 'btn view-item interact-item obsession-btn';

            tippy(obsession_btn, {
                content: obsession_btn.textContent
            });

            interact_container.appendChild(obsession_form);
        }


        // search similar!
        let search_btn = document.createElement('a');
        search_btn.classList.add('btn', 'view-item', 'interact-item', 'search-similar-btn');
        search_btn.textContent = trans[lang].music.search_variations;
        search_btn.href = `${root}search/${header_type}s?q=${text}`;
        search_btn.target = '_blank';

        tippy(search_btn, {
            content: trans[lang].music.search_variations
        });

        interact_container.appendChild(search_btn);


        top_container.appendChild(interact_container);
    }

    function create_listen_item(parent, {name, listens, link, avi, count=0}, header_type) {
        console.info('bleh - creating listen item', name, listens, link, avi, count);

        let listen_item = document.createElement('a');
        listen_item.classList.add('btn', 'listen-item', 'view-item');
        listen_item.setAttribute('href', `${root}user/${name}/library/music/${link}`);
        listen_item.setAttribute('target', '_blank');
        listen_item.setAttribute('data-listens', listens);
        listen_item.setAttribute('id', `listen-item--${name}`);

        if (listens > -1) {
            // 0 listens
            listen_item.innerHTML = (`
                <img class="view-item-avatar" src="${avi}" alt="${name}">${trans[lang].music.listens.count_listens.replace('{c}', listens.toLocaleString(lang))}
            `);
        } else if (listens > -2) {
            // loading listens
            listen_item.innerHTML = (`
                <img class="view-item-avatar" src="${avi}" alt="${name}">${trans[lang].music.listens.loading_listens}
            `);
        } else {
            // other listeners by clicking this link (artist)
            listen_item.innerHTML = (`
                ${(avi[0] != null) ? `<img class="view-item-avatar" src="${avi[0].getAttribute('src')}">` : ''}
                ${(avi[1] != null) ? `<img class="view-item-avatar" src="${avi[1].getAttribute('src')}">` : ''}
                ${(avi[2] != null) ? `<img class="view-item-avatar" src="${avi[2].getAttribute('src')}">` : ''}
                ${trans[lang].music.listens.other_listeners.replace('{c}', count)}
            `);
            listen_item.setAttribute('href', `${window.location.href}/+listeners/you-know`);
        }

        // colourful counts
        if (settings.colourful_counts && listens > -1 && header_type == 'artist') {
            let parsed_scrobble_as_rank = parse_scrobbles_as_rank(listens);

            listen_item.setAttribute('data-bleh--scrobble-milestone',parsed_scrobble_as_rank.milestone);
            listen_item.style.setProperty('--hue-user',parsed_scrobble_as_rank.hue);
            listen_item.style.setProperty('--sat-user',parsed_scrobble_as_rank.sat);
            listen_item.style.setProperty('--lit-user',parsed_scrobble_as_rank.lit);
        }

        parent.appendChild(listen_item);

        // ensure proper listeners element
        if (listens < -1)
            return;

        tippy(listen_item, {
            content: name
        });
    }


    function show_numbers_on_side(header_type) {
        let metadata = document.body.querySelectorAll('.header-metadata-tnew-item');

        let listeners = {};
        let scrobbles = {};
        let metascore = {};

        metadata.forEach((item, index) => {
            let text = item.querySelector('.header-metadata-tnew-title').textContent.trim();
            let value = item.querySelector('.header-metadata-tnew-display abbr');

            if (index == 0) {
                listeners.text = text;
                listeners.value = clean_number(value.getAttribute('title'));
                listeners.abbr = value.textContent.trim();
            } else if (index == 1) {
                scrobbles.text = text;
                scrobbles.value = clean_number(value.getAttribute('title'));
                scrobbles.abbr = value.textContent.trim();
            } else if (index == 2) {
                let link = item.querySelector('a');
                if (link == null)
                    return;

                metascore.text = text;
                metascore.abbr = value.textContent.trim();
                metascore.link = link.getAttribute('href');
            }
        });


        // get panel
        let col_sidebar = document.body.querySelector('.col-sidebar:not(.track-overview-video-column, .masonry-right)');

        let panel = col_sidebar.querySelector('section.section-with-separator:has(.listener-trend)');

        if (panel == null) {
            panel = document.createElement('section');
            panel.classList.add('section-with-separator');

            col_sidebar.insertBefore(panel, col_sidebar.firstElementChild);
        }

        panel.classList.add('listen-panel');


        let row = document.createElement('div');
        row.classList.add('listener-row');
        row.innerHTML = (`
            <div class="listener-side" id="listeners">
                <h3>${listeners.text}</h3>
                <p>${listeners.abbr}</p>
            </div>
            <div class="scrobble-side" id="scrobbles">
                <h3>${scrobbles.text}</h3>
                <p>${scrobbles.abbr}</p>
            </div>
            ${(metascore.text != undefined) ? (`
            <div class="metascore-side">
                <h3>${metascore.text}</h3>
                <p><a href="${metascore.link}" target="_blank">${metascore.abbr}</a></p>
            </div>
            `) : ''}
        `);

        panel.insertBefore(row, panel.firstElementChild);

        tippy(document.getElementById('listeners'), {
            content: listeners.value.toLocaleString(lang)
        });
        tippy(document.getElementById('scrobbles'), {
            content: scrobbles.value.toLocaleString(lang)
        });


        // is there album artwork?
        if (header_type == 'album') {
            let album_artwork = document.body.querySelector('.artwork-and-metadata-row');

            if (album_artwork != null) {
                col_sidebar.insertBefore(album_artwork, col_sidebar.firstElementChild);
            }
        }

        let main_panel = document.body.querySelector('.col-main');
        if (header_type == 'album' || header_type == 'artist') {
            let upper = document.body.querySelector('.col-main');
            upper.classList.add('upper-overview-to-hide');

            let new_upper = document.createElement('section');
            new_upper.classList.add('top-overview-panel');
            new_upper.setAttribute('data-page-type', header_type);
            new_upper.innerHTML = upper.innerHTML;

            let col_main = document.body.querySelector('.col-main:not(.upper-overview-to-hide)');

            col_main.insertBefore(new_upper, col_main.firstElementChild);


            main_panel = new_upper;
        }


        // is there a video?
        if (header_type == 'track') {
            let video_col = document.body.querySelector('.track-overview-video-column.col-sidebar');
            let video = video_col.querySelector('.video-preview');

            console.info(video_col, video);

            if (video != null) {
                let container = document.createElement('div');
                container.classList.add('video-overlay-container');

                let view_buttons = document.createElement('div');
                view_buttons.classList.add('view-buttons');

                let playlink = video.querySelector('.video-preview-playlink a');
                let replace = video_col.querySelector('.video-preview-replace a');

                playlink.classList = 'btn view-item video-item video-item--play';
                replace.classList = 'btn view-item video-item video-item--edit';

                view_buttons.appendChild(playlink);
                view_buttons.appendChild(replace);

                container.appendChild(view_buttons);
                video.appendChild(container);

                tippy(playlink, {
                    content: playlink.textContent
                });
                tippy(replace, {
                    content: replace.textContent
                });
            }
        }


        // add info notes to things
        if (settings.feature_flags.show_wiki_label) {
            let wiki_col = main_panel.querySelector('.wiki-column');

            let wiki_header = document.createElement('h3');
            wiki_header.classList.add('text-18', 'subtle-header');
            wiki_header.textContent = trans[lang].music.wiki;

            wiki_col.insertBefore(wiki_header, wiki_col.firstElementChild);
        }
    }




    function error_page() {
        let page_content = document.body.querySelector('.page-content');

        if (page_content == null)
            return;

        let error_marvin = page_content.querySelector('.error-page-marvin:not([data-bleh])');

        if (error_marvin == null)
            return;
        error_marvin.setAttribute('data-bleh', 'true');


        let back_link = page_content.querySelector('a');

        page_content.classList.add('has-error');
        page_content.innerHTML = (`
            <div class="error-page">
                <h3>${trans[lang].error.name}</h3>
                <div class="button-footer">
                    <a class="btn back" href="${back_link.getAttribute('href')}">
                        ${trans[lang].error.go_back}
                    </a>
                    <a class="btn continue primary" href="${root}user/${auth}">
                        ${trans[lang].error.visit_profile}
                    </a>
                </div>
            </div>
        `);
    }
})();