// ==UserScript==
// @name         bleh
// @namespace    http://last.fm/
// @version      2024.0830
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

let version = {
    build: '2024.0830',
    sku: 'main',
    feature_flags: {}
}

let lang = document.documentElement.getAttribute('lang');
let valid_langs = ['en', 'pl'];

if (!valid_langs.includes(lang)) {
    console.info('bleh - language fallback from', lang, 'to en (lang is not listed as valid)', valid_langs);
    lang = 'en';
}

const trans = {
    en: {
        auth_menu: {
            dev: 'Toggle dev mode',
            configure_bleh: 'Configure bleh',
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
            }
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
            cannot_follow_user: 'You cannot follow this user.',
            on_ignore_list: 'You are on this user\'s ignore list.',
            friends: {
                name: 'Friends'
            }
        },
        settings: {
            save: 'Save',
            cancel: 'Cancel',
            close: 'Close',
            clear: 'Clear',
            done: 'Done',
            continue: 'Continue',
            reset: 'Reset to default',
            go: 'Go',
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
                colours: {
                    name: 'Colours',
                    bio: 'Pick your favourite!'
                }
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
                }
            },
            accessibility: {
                name: 'Accessibility',
                accessible_name_colours: {
                    name: 'Prefer accessible name colours',
                    bio: 'Use the default header text colour over a accented text colour.'
                },
                underline_links: {
                    name: 'Always underline links',
                    bio: 'Make links to interactables stand out.'
                }
            },
            customise: {
                name: 'Customise',
                colours: {
                    name: 'Colours',
                    presets: 'Presets',
                    manual: 'Manual',
                    custom: 'Create a custom colour',
                    modals: {
                        custom_colour: {
                            preface: 'Colours are controlled by three values: hue, saturation, and lightness. Try out the sliders to get a feel.',
                            hue: 'Accent colour',
                            sat: 'Saturation',
                            lit: 'Lightness'
                        }
                    }
                },
                artwork: {
                    name: 'Artwork'
                },
                gloss: {
                    name: 'Gloss overlay',
                    bio: 'Apply flair to all cover arts.'
                },
                display: {
                    name: 'Display',
                    shout_preview: 'some completely random text that doesn\'t mean <a href="https://cutensilly.org">anything at all</a>'
                },
                colourful_counts: {
                    name: 'Use a colour gradient for all-time charts',
                    bio: 'Assigns a colour from a gradient based on your position in all-time artist scrobbles.'
                },
                gendered_tags: {
                    name: 'Hide gendered tags',
                    bio: 'By default, gendered tags are hidden in bleh due to their unorganised and impossible nature.'
                },
                rain: {
                    name: 'Let it rain!',
                    bio: 'rain :3c (may have performance impacts !! also may look bad !!)'
                },
                show_your_progress: {
                    name: 'Show your weekly progress',
                    bio: 'too many numbers ~w~'
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
                    delete_user: 'Remove {u}\'s note'
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
                    name: 'Format guest features and song tags',
                    bio: 'Visually places less priority on song features and tags (eg. Remix, Deluxe Edition, etc.)'
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
            inbuilt: {
                profile: {
                    name: 'Profile',
                    subtitle: {
                        name: 'Subtitle',
                        aka: 'aka.',
                        pronouns: 'pronouns'
                    },
                    pronoun_tip: 'Tip: If pronouns are placed first, "aka." will change to "pronouns".',
                    country: 'Country',
                    website: 'Website',
                    about: 'About',
                    toggle_preview: {
                        name: 'Toggle preview',
                        bio: 'Preview how your bio looks to others',
                        note: 'Note: New-lines, links, etc. only display to other bleh users, regular Last.fm users see new-lines as spaces.'
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
            search_variations: 'Search for variations of this title'
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
            on_ignore_list: 'Jesteś na liście ignorowanych tego użytkownika.'
        },
        settings: {
            save: 'Zapisz',
            cancel: 'Anuluj',
            close: 'Zamknij',
            clear: 'Wyczyść',
            done: 'Gotowe',
            continue: 'Kontynuuj',
            reset: 'Przywróć domyślne',
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
                }
            },
            accessibility: {
                name: 'Accessibility',
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
                gloss: {
                    name: 'Nakładka błyszcząca',
                    bio: 'Dodaj odblasku do wszystkich okładek.'
                },
                display: {
                    name: 'Wyświetlacz',
                    shout_preview: 'jakikolwiek losowy tekst, który <a href="https://cutensilly.org">nic nie znaczy</a>'
                },
                colourful_counts: {
                    name: 'Użyj gradientu kolorów dla wszystkich czasów rankingów',
                    bio: 'Kolor jest przypisywany na podstawie twojej pozycji w wszechczasowych statystykach artystów.'
                },
                format_guest_features: {
                    name: 'Formatuj występy i tagi utworów',
                    bio: 'Mniej eksponuje występy i tagi utworów (np. Remix, Deluxe Edition, itp.)'
                },
                gendered_tags: {
                    name: 'Ukryj tagi związane z płcią',
                    bio: 'Domyślnie tagi związane z płcią są ukryte w bleh ze względu na ich nieuporządkowaną i problematyczną nature.'
                },
                rain: {
                    name: 'Niech pada!',
                    bio: 'deszcz :3c (może wpływać na wydajność!! może też wyglądać źle!!)'
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
            inbuilt: {
                profile: {
                    name: 'Profil',
                    subtitle: {
                        name: 'Podtytuł',
                        aka: 'aka.',
                        pronouns: 'zaimki'
                    },
                    pronoun_tip: 'Wskazówka: Jeśli zaimki są umieszczone jako pierwsze, "aka." zmieni się na "zaimki".',
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

tippy.setDefaultProps({
    arrow: false,
    duration: [100, 300],
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
    'Mitsu': 'mitsu'
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
        'A Date w Karma (V1)': 'a date w karma (v1)'
    },
    'juice wrld': {
        'Off the rip': 'Off the Rip',
        'lace it (with eminem & benny blanco)': 'Lace It (with Eminem & benny blanco)'
    },
    'travis scott': {
        'Days Before Rodeo': 'DAYS BEFORE RODEO',
        'Mamacita (Feat. Rich Homie Quan & Young Thug)': 'Mamacita (feat. Rich Homie Quan & Young Thug)',
        'Basement Freestyle (Live)': 'BASEMENT FREESTYLE (Live)',
        'Mamacita (live)': 'MAMACITA (Live)'
    },
    'yumi': {
        'Dance': 'DANCE'
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
        'ft.'
    ],
    versions: [
        '(taylor', '- spotify singles'
    ],
    mixes: [
        '- devonshire mix', '(devonshire mix',
        '- remaster', '(remaster', 'mike dean master',
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
        '(v1', '(v2', '(v3', '(v4', '(v5', '(v6', '(v7', '(v8', '(v9'
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
        '- anniversary', '(anniversary', '[anniversary',
        '- b-side', '- c-side', '(b-side', '(c-side',
        '- lp', '- ep', '(lp', '(ep',
        '- single', '(single',
        '- 19', '- 20', '(19', '(20'
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
            name: 'translated bleh into polish'
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
    }
};


let settings_template = {
    theme: 'dark',
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
    underline_links: false,
    big_numbers: false,
    format_guest_features: true,
    corrections: true,
    colourful_counts: true,
    rain: false,
    feature_flags: {},
    show_your_progress: true,
    travis: false,
    list_view: 1
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
        type: 'toggle'
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
    }
}
let latest_settings_cache = {};

// use the top-right link to determine the current user
let auth = '';

let root = '';

let bleh_url = 'https://www.last.fm/bleh';
let bleh_regex = new RegExp('^https://www\.last\.fm/[a-z]+/bleh$');


(function() {
    'use strict';

    root = document.querySelector('.masthead-logo a').getAttribute('href');
    auth = document.querySelector('a.auth-link img').getAttribute('alt');
    initia();

    console.info('loading bleh', version.build, 'with sku', version.sku);

    function initia() {
        let performance_start = performance.now();

        append_style();
        load_settings();
        //get_scrobbles(document.body);
        append_nav(document.body);
        patch_masthead(document.body);
        load_notifs();

        start_rain();

        console.log(bleh_url,window.location.href,bleh_regex.test(window.location.href));

        if (window.location.href == bleh_url || bleh_regex.test(window.location.href)) {
            bleh_settings();
        } else {
            patch_actions();
            patch_profile(document.body);
            patch_shouts(document.body);
            patch_lastfm_settings(document.body);
            patch_artist_ranks(document.body);
            patch_header_menu();
            patch_gallery_page();

            album_missing_a_tracklist();
            prep_combo_settings();

            patch_header_title(document.body);
            patch_artist_grids(document.body);
            patch_titles(document.body);
            correct_generic_combo_no_artist('artist-header-featured-items-item');
            correct_generic_combo_no_artist('artist-top-albums-item');
            correct_generic_combo('source-album-details');
            correct_generic_combo('resource-list--release-list-item');
            correct_generic_combo('similar-albums-item');
            correct_generic_combo('track-similar-tracks-item');
            correct_generic_combo('similar-items-sidebar-item');
            patch_about_this_artist();
        }

        // last.fm is a single page application
        const observer = new MutationObserver((mutations) => {
            load_settings();
            //get_scrobbles(node);
            append_nav(document.body);
            patch_masthead(document.body);

            if (window.location.href == bleh_url || bleh_regex.test(window.location.href)) {
                bleh_settings();
            } else {
                patch_actions();
                patch_profile(document.body);
                patch_shouts(document.body);
                patch_lastfm_settings(document.body);
                patch_artist_ranks(document.body);
                patch_header_menu();
                patch_gallery_page();

                album_missing_a_tracklist();
                prep_combo_settings();

                patch_header_title(document.body);
                patch_artist_grids(document.body);
                patch_titles(document.body);
                correct_generic_combo_no_artist('artist-header-featured-items-item');
                correct_generic_combo_no_artist('artist-top-albums-item');
                correct_generic_combo('source-album-details');
                correct_generic_combo('resource-list--release-list-item');
                correct_generic_combo('similar-albums-item');
                correct_generic_combo('track-similar-tracks-item');
                correct_generic_combo('similar-items-sidebar-item');
                patch_about_this_artist();
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

            let version_text = document.createElement('p');
            version_text.classList.add('bleh--version');
            version_text.textContent = `${version.build}.${version.sku}`;

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
                                <span class="auth-dropdown-item-left">${trans[lang].settings.themes.name}</span>
                                <span class="auth-dropdown-item-right" id="theme-value">${trans[lang].settings.themes[settings.theme].name}</span>
                            </span>
                        </button>
                    </li>
                    <li>
                        <button class="auth-dropdown-menu-item bleh--dev-menu-item" onclick="toggle_setting('dev')">
                            <span class="auth-dropdown-item-row">
                                <span class="auth-dropdown-item-left">${trans[lang].auth_menu.dev}</span>
                            </span>
                        </button>
                    </li>
                    <li>
                        <a class="auth-dropdown-menu-item bleh--configure-menu-item" href="/bleh">
                            <span class="auth-dropdown-item-row">
                                <span class="auth-dropdown-item-left">${trans[lang].auth_menu.configure_bleh}</span>
                            </span>
                        </a>
                    </li>
                    `);
            } else {
                bleh_nav.innerHTML = (`
                    <li>
                        <button class="auth-dropdown-menu-item bleh--theme-menu-item" onclick="toggle_theme()">
                            <span class="auth-dropdown-item-row">
                                <span class="auth-dropdown-item-left">${trans[lang].settings.themes.name}</span>
                                <span class="auth-dropdown-item-right" id="theme-value">${trans[lang].settings.themes[settings.theme].name}</span>
                            </span>
                        </button>
                    </li>
                    <li>
                        <a class="auth-dropdown-menu-item bleh--configure-menu-item" href="/bleh">
                            <span class="auth-dropdown-item-row">
                                <span class="auth-dropdown-item-left">${trans[lang].auth_menu.configure_bleh}</span>
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
                            <span class="auth-dropdown-item-left">${trans[lang].auth_menu.shouts}</span>
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

        document.getElementById('theme-value').textContent = trans[lang].settings.themes[current_theme].name;

        // save value
        settings.theme = current_theme;
        document.documentElement.setAttribute(`data-bleh--theme`, `${current_theme}`);

        // save to settings
        localStorage.setItem('bleh', JSON.stringify(settings));
    }

    unsafeWindow.change_theme_from_settings = function(theme) {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

        document.getElementById('theme-value').textContent = trans[lang].settings.themes[theme].name;

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
            <form action="/settings#update-chart" name="chart-form" method="post">
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
                        <form action="/settings#update-profile" name="profile-form" data-form-type="identity" method="post">
                            <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
                            <div class="info-row">
                                <div class="title">
                                    ${trans[lang].settings.inbuilt.profile.subtitle.name}
                                </div>
                                <div class="input">
                                    <input type="text" name="full_name" value="${form_display_name}" maxlength="50" id="id_full_name" oninput="_update_display_name(this.value)" data-form-type="other">
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
        let pronouns = false;
        let display_name_no_spaces = value.replaceAll(' ','');
        if (
            display_name_no_spaces.startsWith('she/') ||
            display_name_no_spaces.startsWith('he/') ||
            display_name_no_spaces.startsWith('they/') ||
            display_name_no_spaces.startsWith('it/')
        ) pronouns = true;

        document.getElementById('header-title-display-name--pre').textContent = pronouns ? 'pronouns' : 'aka.';
    }


    unsafeWindow._open_avatar_changer = function(token) {
        open_avatar_changer(token);
    }
    function open_avatar_changer(token) {
        create_window('edit_avatar',trans[lang].settings.inbuilt.profile.avatar.name,`
            <div class="bleh--upload-avatar-container">
                <form class="avatar-upload-form bleh--upload-avatar-form" action="/settings" name="avatar-form" method="post" enctype="multipart/form-data">
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
                <form class="image-remove-form bleh--upload-avatar-form" action="/settings/avatar/delete" method="post">
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
        document.getElementById('bleh--window-edit_avatar--body').style.setProperty('pointer-events', 'none');
        document.getElementById('bleh--window-edit_avatar--body').style.setProperty('opacity', '0.6');

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
        .replace(/([@])([a-zA-Z0-9_]+)/g, '[$1$2](/user/$2)')
        .replace(/\[artist\]([a-zA-Z0-9]+)\[\/artist\]/g, '[$1](/music/$1)')
        .replace(/\[album artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/album\]/g, '[$2](/music/$1/$2)')
        .replace(/\[track artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/track\]/g, '[$2](/music/$1/_/$2)')
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
            <form action="/settings/privacy" name="privacy" method="post">
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
        let profile_header = element.querySelector('.header-title-label-wrap');

        if (profile_header == undefined)
            return;

        patch_profile_following();
        patch_profile_tracks();

        let profile_name = profile_header.querySelector('a');

        // profile note
        let profile_notes = JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
        let profile_note = profile_notes[profile_name.textContent];

        let profile_has_note = false;
        if (profile_note != undefined)
            profile_has_note = true;

        if (!profile_header.hasAttribute('data-kate-processed')) {
            profile_header.setAttribute('data-kate-processed', 'true');

            // is this their profile?
            if (profile_name.textContent == auth) {
                // make avatar clickable
                let header_avatar = document.querySelector('.header-avatar .avatar');

                let avatar_link = document.createElement('a');
                avatar_link.classList.add('bleh--avatar-clickable-link');
                avatar_link.href = '/settings';
                header_avatar.appendChild(avatar_link);
            } else {
                // is there a follow button?
                let header_avatar = document.querySelector('.header--overview .header-avatar');

                if (header_avatar != undefined) {
                    let header_follow_btn = header_avatar.querySelector('form');

                    if (header_follow_btn == undefined) {
                        // user is on their ignore list
                        let toggle_btn = document.createElement('button');
                        toggle_btn.classList.add('toggle-button','header-follower-btn','header-follower-btn--denied');
                        toggle_btn.textContent = trans[lang].profile.cannot_follow_user;

                        tippy(toggle_btn, {
                            content: trans[lang].profile.on_ignore_list
                        });
                        header_avatar.appendChild(toggle_btn);
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
            if (profile_name.textContent == 'cutensilly') {
                profile_name.classList.add('bleh--name-is-cute');
            }

            // secondary text
            let profile_sub_text = element.querySelector('.header-title-secondary');

            if (profile_sub_text == undefined)
                return;

            let display_name = profile_sub_text.querySelector('.header-title-display-name');
            let scrobble_since = profile_sub_text.querySelector('.header-scrobble-since');
            scrobble_since.textContent = scrobble_since.textContent.replace('• scrobbling since ','');

            // pronouns?
            let pronouns = false;
            let display_name_no_spaces = display_name.textContent.replaceAll(' ','');
            if (
                display_name_no_spaces.startsWith('she/') ||
                display_name_no_spaces.startsWith('he/') ||
                display_name_no_spaces.startsWith('they/') ||
                display_name_no_spaces.startsWith('it/')
            ) pronouns = true;

            let display_name_pre = document.createElement('span');
            display_name_pre.classList.add('header-title-secondary--pre');
            display_name_pre.textContent = pronouns ? 'pronouns' : 'aka.';
            profile_sub_text.insertBefore(display_name_pre, display_name);

            let scrobble_since_pre = document.createElement('span');
            scrobble_since_pre.classList.add('header-title-secondary--pre');
            scrobble_since_pre.textContent = 'created';
            profile_sub_text.insertBefore(scrobble_since_pre, scrobble_since);
        }

        let about_me_sidebar = element.querySelector('.about-me-sidebar');

        if (about_me_sidebar == undefined)
            return;

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
            .replace(/([@])([a-zA-Z0-9_]+)/g, '[$1$2](/user/$2)')
            .replace(/\[artist\]([a-zA-Z0-9]+)\[\/artist\]/g, '[$1](/music/$1)')
            .replace(/\[album artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/album\]/g, '[$2](/music/$1/$2)')
            .replace(/\[track artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/track\]/g, '[$2](/music/$1/_/$2)')
            .replace(/https:\/\/open\.spotify\.com\/user\/([A-Za-z0-9]+)/g, '[@$1](https://open.spotify.com/user/$1)')
            .replace(/https:\/\/open\.spotify\.com\/user\/([A-Za-z0-9]+)\?si=([A-Za-z0-9]+)/g, '[@$1](https://open.spotify.com/user/$1)')
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
                    content: trans[lang].settings.profiles.notes.edit_user.replace('{u}', profile_name.textContent)
                });

                let about_me_header = about_me_sidebar.querySelector('h2');
                about_me_header.appendChild(add_note_button);
            } else {
                create_profile_note_panel(profile_name.textContent, true);
            }
        }
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
            content: 'Refresh tracks'
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
                <button class="btn list-view-item" id="toggle-list_view-1" data-toggle="list_view" data-toggle-value="1" onclick="_update_item('list_view', 1)">
                    Grid
                </button>
                <button class="btn list-view-item" id="toggle-list_view-0" data-toggle="list_view" data-toggle-value="0" onclick="_update_item('list_view', 0)">
                    List
                </button>
            </div>
        `);
        col_main.insertBefore(view_buttons, col_main.firstElementChild);

        refresh_all();
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
                .replace(/([@])([a-zA-Z0-9_]+)/g, '[$1$2](/user/$2)')
                .replace(/\[artist\]([a-zA-Z0-9]+)\[\/artist\]/g, '[$1](/music/$1)')
                .replace(/\[album artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/album\]/g, '[$2](/music/$1/$2)')
                .replace(/\[track artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/track\]/g, '[$2](/music/$1/_/$2)')
                .replace(/https:\/\/open\.spotify\.com\/user\/([A-Za-z0-9]+)\?si=([A-Za-z0-9]+)/g, '[@$1](https://open.spotify.com/user/$1)')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;'));
                console.log(shout_body.textContent, parsed_body);
                shout_body.innerHTML = parsed_body;

                patch_avatar(shout_avatar, shout_name);
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

                tippy(badge, {
                    content: `${name}, ${this_badge.name}`
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




    // artist ranks
    function patch_artist_ranks(element) {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

        if (settings.colourful_counts) {
            patch_artist_ranks_in_grid_view(document.body);

            let personal_statistic = element.querySelector('.header-new--artist + .page-content .personal-stats-item--scrobbles');

            if (personal_statistic == undefined)
                return;

            if (!personal_statistic.hasAttribute('data-kate-processed')) {
                personal_statistic.setAttribute('data-kate-processed','true');

                let scrobbles = parseInt(personal_statistic.querySelector('.link-block-target').textContent.replaceAll(',',''));
                let parsed_scrobble_as_rank = parse_scrobbles_as_rank(scrobbles);

                personal_statistic.setAttribute('data-bleh--scrobble-milestone',parsed_scrobble_as_rank.milestone);
                personal_statistic.style.setProperty('--hue',parsed_scrobble_as_rank.hue);
                personal_statistic.style.setProperty('--sat',parsed_scrobble_as_rank.sat);
                personal_statistic.style.setProperty('--lit',parsed_scrobble_as_rank.lit);
            }
        }
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

                    let scrobbles = parseInt(artist_statistic.textContent.replaceAll(',','').replace(` ${trans[lang].statistics.plays.name}`,''));
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

        let count = parseInt(count_bar.querySelector('.chartlist-count-bar-value').textContent.replaceAll(',','').replace(' scrobbles',''));

        if (!count_bar.hasAttribute('data-kate-processed')) {
            count_bar.setAttribute('data-kate-processed','true');

            let parsed_scrobble_as_rank = parse_scrobbles_as_rank(count);

            count_bar.setAttribute('data-bleh--scrobble-milestone',parsed_scrobble_as_rank.milestone);
            count_bar.style.setProperty('--hue',parsed_scrobble_as_rank.hue);
            count_bar.style.setProperty('--sat',parsed_scrobble_as_rank.sat);
            count_bar.style.setProperty('--lit',parsed_scrobble_as_rank.lit);
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
                    artist_name.setAttribute('href', `/music/${corrected_artist_name}`);
                    artist_name.setAttribute('title', corrected_artist_name);
                }
            }
        });
    }


    function prep_combo_settings() {
        latest_settings_cache = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();
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

        console.info(latest_settings_cache);

        if (!latest_settings_cache.corrections)
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

        console.info(latest_settings_cache);

        if (!latest_settings_cache.corrections)
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

        console.info(latest_settings_cache);

        if (!latest_settings_cache.corrections)
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

        console.info(latest_settings_cache);

        if (!latest_settings_cache.corrections)
            return artist;

        if (artist_corrections.hasOwnProperty(artist)) {
            console.info('bleh - correction handler: corrected as', artist_corrections[artist]);
            return artist_corrections[artist];
        } else {
            return artist;
        }
    }




    function patch_about_this_artist() {
        if (!latest_settings_cache.corrections)
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


    function patch_actions() {
        let actions = document.body.querySelector('.header-new-actions');

        if (actions == undefined)
            return;

        if (actions.hasAttribute('data-kate-processed'))
            return;
        actions.setAttribute('data-kate-processed', 'true');

        let type = document.querySelector('.header-new').classList[1].replace('header-new--', '');

        let text = document.querySelector('.header-new-title').textContent.replaceAll(' ', '+');

        let artist = document.querySelector('.header-new-crumb');
        if (artist != undefined)
            text = `${text}+${artist.textContent.replaceAll(' ', '+')}`;

        let search_btn = document.createElement('a');
        search_btn.classList.add('btn', 'search-similar-btn');
        search_btn.textContent = trans[lang].music.search_variations;
        search_btn.href = `${root}search/${type}s?q=${text}`;
        search_btn.target = '_blank';

        tippy(search_btn, {
            content: trans[lang].music.search_variations
        });

        actions.appendChild(search_btn);
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
                            ${trans[lang].settings.home.name}
                        </button>
                        <button class="btn bleh--btn" data-bleh-page="themes" onclick="_change_settings_page('themes')">
                            ${trans[lang].settings.themes.name}
                        </button>
                        <button class="btn bleh--btn" data-bleh-page="customise" onclick="_change_settings_page('customise')">
                            ${trans[lang].settings.customise.name}
                        </button>
                        <button class="btn bleh--btn" data-bleh-page="profiles" onclick="_change_settings_page('profiles')">
                            ${trans[lang].settings.profiles.name}
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
        if (page == 'home') {
            return (`
            <div class="bleh--panel">
                <h3>${trans[lang].settings.home.name}</h3>
                <div class="screen-row">
                    <div class="screen-wrap">
                        <img class="screen" src="https://cutensilly.org/img/bleh3-theme-${document.documentElement.getAttribute('data-bleh--theme')}.png" alt="bleh">
                        <div class="text">
                            <h5>${trans[lang].settings.home.brand}</h5>
                            <p>${trans[lang].settings.home.version.replace('{v}', version.build)}</p>
                        </div>
                    </div>
                    <div class="actions">
                        <a class="btn action" href="https://github.com/katelyynn/bleh/issues" target="_blank">
                            <div class="icon bleh--issues"></div>
                            <span class="text">
                                <h5>${trans[lang].settings.home.issues.name}</h5>
                                <p>${trans[lang].settings.home.issues.bio}</p>
                            </span>
                        </a>
                    </div>
                </div>
                <h4>${trans[lang].settings.home.recommended}</h4>
                <div class="setting-items">
                    <div class="side-left">
                        <button class="btn setting-item has-image" onclick="_change_settings_page('themes')">
                            <div class="image">
                                <div class="icon bleh--themes"></div>
                            </div>
                            <div class="text">
                                <h5>${trans[lang].settings.themes.name}</h5>
                                <p>${trans[lang].settings.themes.bio}</p>
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
                                <h5>${trans[lang].settings.home.colours.name}</h5>
                                <p>${trans[lang].settings.home.colours.bio}</p>
                            </div>
                        </button>
                        <button class="btn setting-item" onclick="_change_settings_page('customise')">
                            <div class="icon bleh--link"></div>
                            <div class="text">
                                <h5>${trans[lang].settings.accessibility.underline_links.name}</h5>
                                <p>${trans[lang].settings.accessibility.underline_links.bio}</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            `);
        } else if (page == 'themes') {
            return (`
                <div class="bleh--panel">
                    <h3>${trans[lang].settings.themes.name}</h3>
                    <h4>${trans[lang].settings.themes.dark.name}</h4>
                    <div class="setting-items">
                        <div class="side-left full more">
                            <button class="btn setting-item has-image" data-bleh-theme="dark" onclick="change_theme_from_settings('dark')">
                                <div class="image">
                                    <div class="icon bleh--theme-dark"></div>
                                </div>
                                <div class="text">
                                    <h5>${trans[lang].settings.themes.dark.name}</h5>
                                    <p>${trans[lang].settings.themes.dark.bio}</p>
                                </div>
                                <div class="image-row">
                                    <img src="https://cutensilly.org/img/bleh3-theme-dark.png" alt="Screenshot of bleh's default dark theme">
                                </div>
                            </button>
                            <button class="btn setting-item has-image" data-bleh-theme="darker" onclick="change_theme_from_settings('darker')">
                                <div class="image">
                                    <div class="icon bleh--theme-darker"></div>
                                </div>
                                <div class="text">
                                    <h5>${trans[lang].settings.themes.darker.name}</h5>
                                    <p>${trans[lang].settings.themes.darker.bio}</p>
                                </div>
                                <div class="image-row">
                                    <img src="https://cutensilly.org/img/bleh3-theme-darker.png" alt="Screenshot of bleh's darker theme">
                                </div>
                            </button>
                            <button class="btn setting-item has-image" data-bleh-theme="oled" onclick="change_theme_from_settings('oled')">
                                <div class="image">
                                    <div class="icon bleh--theme-oled"></div>
                                </div>
                                <div class="text">
                                    <h5>${trans[lang].settings.themes.oled.name}</h5>
                                    <p>${trans[lang].settings.themes.oled.bio}</p>
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
                                    <div class="icon bleh--theme-light"></div>
                                </div>
                                <div class="text">
                                    <h5>${trans[lang].settings.themes.light.name}</h5>
                                    <p>${trans[lang].settings.themes.light.bio}</p>
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
                    <h3>${trans[lang].settings.customise.colours.name}</h3>
                    <h5>${trans[lang].settings.customise.colours.presets}</h5>
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
                    <h5>${trans[lang].settings.customise.colours.manual}</h5>
                    <button class="btn primary btn--has-icon btn--has-icon-left btn--custom-colour" onclick="_create_a_custom_colour()">
                        ${trans[lang].settings.customise.colours.custom}
                    </button>
                </div>
                <div class="bleh--panel">
                    <h3>${trans[lang].settings.customise.artwork.name}</h3>
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
                        <button class="btn reset" onclick="_reset_item('gloss')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.gloss.name}</h5>
                            <p>${trans[lang].settings.customise.gloss.bio}</p>
                        </div>
                        <div class="slider">
                            <input type="range" min="0" max="1" value="0" step="0.05" id="slider-gloss" oninput="_update_item('gloss', this.value)">
                            <p id="value-gloss">0</p>
                        </div>
                    </div>
                </div>
                <div class="bleh--panel">
                    <h3>${trans[lang].settings.customise.display.name}</h3>
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
                                <p>${trans[lang].settings.customise.display.shout_preview}</p>
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
                    <div class="sep"></div>
                    <div class="inner-preview pad">
                        <div class="personal-stats-preview bleh--personal-stats-if-colourful">
                            <div class="personal-stats-item personal-stats-item--scrobbles link-block js-link-block" data-kate-processed="true" data-bleh--scrobble-milestone="10" style="--hue: -14.921125; --sat: 1.5; --lit: 0.875;">
                                <div class="personal-stats-inner">
                                    <ul class="header-metadata">
                                        <li class="header-metadata-item">
                                            <h4 class="header-metadata-title">
                                                ${trans[lang].statistics.scrobbles.name}
                                            </h4>
                                            <div class="header-metadata-display">
                                                <a class="link-block-target">
                                                    13,041
                                                </a>
                                            </div>
                                        </li>
                                    </ul>
                                    <span class="avatar personal-stats-avatar">
                                        <img src="https://lastfm.freetls.fastly.net/i/u/avatar70s/198d1a3bd66a0d586e8e7af8a31febe4.jpg" alt="Your avatar" loading="lazy">
                                        <span class="avatar-status-dot user-status--bleh-queen user-status--bleh-user-cutensilly" data-kate-processed="true"></span>
                                    </span>
                                </div>
                            </div>
                            <div class="personal-stats-item personal-stats-item--scrobbles link-block js-link-block" data-kate-processed="true" data-bleh--scrobble-milestone="5" style="--hue: 96.59066666666666; --sat: 1.35; --lit: 0.925;">
                                <div class="personal-stats-inner">
                                    <ul class="header-metadata">
                                        <li class="header-metadata-item">
                                            <h4 class="header-metadata-title">
                                                ${trans[lang].statistics.scrobbles.name}
                                            </h4>
                                            <div class="header-metadata-display">
                                                <a class="link-block-target">
                                                    1,627
                                                </a>
                                            </div>
                                        </li>
                                    </ul>
                                    <span class="avatar personal-stats-avatar">
                                        <img src="https://lastfm.freetls.fastly.net/i/u/avatar70s/198d1a3bd66a0d586e8e7af8a31febe4.jpg" alt="Your avatar" loading="lazy">
                                        <span class="avatar-status-dot user-status--bleh-queen user-status--bleh-user-cutensilly" data-kate-processed="true"></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="personal-stats-preview bleh--personal-stats-if-not-colourful">
                            <div class="personal-stats-item personal-stats-item--scrobbles link-block js-link-block">
                                <div class="personal-stats-inner">
                                    <ul class="header-metadata">
                                        <li class="header-metadata-item">
                                            <h4 class="header-metadata-title">
                                                ${trans[lang].statistics.scrobbles.name}
                                            </h4>
                                            <div class="header-metadata-display">
                                                <a class="link-block-target">
                                                    13,041
                                                </a>
                                            </div>
                                        </li>
                                    </ul>
                                    <span class="avatar personal-stats-avatar">
                                        <img src="https://lastfm.freetls.fastly.net/i/u/avatar70s/198d1a3bd66a0d586e8e7af8a31febe4.jpg" alt="Your avatar" loading="lazy">
                                        <span class="avatar-status-dot user-status--bleh-queen user-status--bleh-user-cutensilly" data-kate-processed="true"></span>
                                    </span>
                                </div>
                            </div>
                            <div class="personal-stats-item personal-stats-item--scrobbles link-block js-link-block">
                                <div class="personal-stats-inner">
                                    <ul class="header-metadata">
                                        <li class="header-metadata-item">
                                            <h4 class="header-metadata-title">
                                                ${trans[lang].statistics.scrobbles.name}
                                            </h4>
                                            <div class="header-metadata-display">
                                                <a class="link-block-target">
                                                    1,627
                                                </a>
                                            </div>
                                        </li>
                                    </ul>
                                    <span class="avatar personal-stats-avatar">
                                        <img src="https://lastfm.freetls.fastly.net/i/u/avatar70s/198d1a3bd66a0d586e8e7af8a31febe4.jpg" alt="Your avatar" loading="lazy">
                                        <span class="avatar-status-dot user-status--bleh-queen user-status--bleh-user-cutensilly" data-kate-processed="true"></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="sep"></div>
                        <table class="chartlist chartlist--with-index chartlist--with-index--length-2 chartlist--with-image chartlist--with-bar">
                            <tbody>
                                <tr class="chartlist-row chartlist-row--highlight">
                                    <td class="chartlist-index">
                                        1
                                    </td>
                                    <td class="chartlist-image">
                                        <span class="avatar">
                                            <img src="https://lastfm.freetls.fastly.net/i/u/avatar70s/198d1a3bd66a0d586e8e7af8a31febe4.jpg" alt="Your avatar" loading="lazy">
                                        </span>
                                    </td>
                                    <td class="chartlist-name">
                                        <a class="link-block-target">
                                            cutensilly
                                        </a>
                                    </td>
                                    <td class="chartlist-bar">
                                        <span class="chartlist-count-bar bleh--personal-stats-if-colourful" data-bleh--scrobble-milestone="11" style="--hue: -33.2225; --sat: 1.3286979166666666; --lit: 0.8681479166666667;">
                                            <span class="chartlist-count-bar-link">
                                                <span class="chartlist-count-bar-slug" style="width:36.08268870690144%;"></span>
                                                <span class="chartlist-count-bar-value">
                                                    19,078
                                                </span>
                                            </span>
                                        </span>
                                        <span class="chartlist-count-bar bleh--personal-stats-if-not-colourful">
                                            <span class="chartlist-count-bar-link">
                                                <span class="chartlist-count-bar-slug" style="width:36.08268870690144%;"></span>
                                                <span class="chartlist-count-bar-value">
                                                    19,078
                                                </span>
                                            </span>
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="toggle-container" id="container-colourful_counts">
                        <button class="btn reset" onclick="_reset_item('colourful_counts')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.colourful_counts.name}</h5>
                            <p>${trans[lang].settings.customise.colourful_counts.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-colourful_counts" onclick="_update_item('colourful_counts')" aria-checked="true">
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
                        <button class="btn reset" onclick="_reset_item('gendered_tags')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.gendered_tags.name}</h5>
                            <p>${trans[lang].settings.customise.gendered_tags.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-gendered_tags" onclick="_update_item('gendered_tags')" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="sep"></div>
                    <div class="toggle-container" id="container-show_your_progress">
                        <button class="btn reset" onclick="_reset_item('show_your_progress')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.show_your_progress.name}</h5>
                            <p>${trans[lang].settings.customise.show_your_progress.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-show_your_progress" onclick="_update_item('show_your_progress')" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="toggle-container" id="container-rain">
                        <button class="btn reset" onclick="_reset_item('rain')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.rain.name}</h5>
                            <p>${trans[lang].settings.customise.rain.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-rain" onclick="_update_item('rain')" aria-checked="true">
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
                    <div class="toggle-container" id="container-dev">
                        <button class="btn reset" onclick="_reset_item('dev')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.performance.dev.name}</h5>
                            <p>${trans[lang].settings.performance.dev.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-dev" onclick="_update_item('dev')" aria-checked="false">
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
                    <div class="toggle-container" id="container-travis">
                        <button class="btn reset" onclick="_reset_item('travis')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.redirects.travis.name}</h5>
                            <p>${trans[lang].settings.redirects.travis.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-travis" onclick="_update_item('travis')" aria-checked="true">
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
                    <div class="toggle-container" id="container-corrections">
                        <button class="btn reset" onclick="_reset_item('corrections')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.corrections.toggle.name}</h5>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-corrections" onclick="_update_item('corrections')" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <div class="toggle-container">
                        <div class="heading">
                            <h5>${trans[lang].settings.corrections.submit.name}</h5>
                            <p>${trans[lang].settings.corrections.submit.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <a class="btn bleh--btn primary" href="https://github.com/katelyynn/bleh/issues/new/choose" target="_blank">${trans[lang].settings.corrections.submit.action}</a>
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
                    <div class="sep"></div>
                    <h4>${trans[lang].settings.corrections.listing.artists}</h4>
                    <div class="corrections artist" id="corrections-artist"></div>
                    <h4>${trans[lang].settings.corrections.listing.albums_tracks}</h4>
                    <div class="corrections album_tracks" id="corrections-albums_tracks"></div>
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
        else if (page == 'customise' || page == 'performance' || page == 'redirects' || page == 'corrections')
            refresh_all();
        else if (page == 'profiles')
            init_profile_notes();

        if (page == 'corrections')
            prepare_corrections_page();
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
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();
        create_window('custom_colour',trans[lang].settings.customise.colours.custom,`
        <p>${trans[lang].settings.customise.colours.modals.custom_colour.preface}</p>
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
        <div class="slider-container dim-using-hue-gradient" id="container-hue">
            <button class="btn reset" onclick="_reset_item('hue')">${trans[lang].settings.reset}</button>
            <div class="heading">
                <h5>${trans[lang].settings.customise.colours.modals.custom_colour.hue}</h5>
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
            <button class="btn reset" onclick="_reset_item('sat')">${trans[lang].settings.reset}</button>
            <div class="heading">
                <h5>${trans[lang].settings.customise.colours.modals.custom_colour.sat}</h5>
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
            <button class="btn reset" onclick="_reset_item('lit')">${trans[lang].settings.reset}</button>
            <div class="heading">
                <h5>${trans[lang].settings.customise.colours.modals.custom_colour.lit}</h5>
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
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

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

        if (song_title_corrections.hasOwnProperty(original_artist.toLowerCase()) && latest_settings_cache.corrections) {
            if (song_title_corrections[original_artist.toLowerCase()].hasOwnProperty(formatted_title))
                formatted_title = song_title_corrections[original_artist.toLowerCase()][formatted_title];
        }

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
            let field_text = extras[extra].text.replace(' feat. ','').replace('feat. ','').replace('w/ ','').replace('with ','').replaceAll(' & ',';').replaceAll(', ',';').replaceAll('Tyler;the', 'Tyler, the').replaceAll(' with ',';').replaceAll('- ', '');

            if (field_group == 'guests')
                song_guests = field_text.split(';');
        }


        // song artist
        if (artist_corrections.hasOwnProperty(original_artist))
            original_artist = artist_corrections[original_artist];


        if (extras.length > 0)
            return [formatted_title, extras, original_artist, song_guests];
        else
            return [formatted_title, [], original_artist, song_guests];
    }


    function patch_titles(element) {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

        let tracks = element.querySelectorAll('.chartlist-row:not(.chartlist__placeholder-row)');

        if (tracks == undefined)
            return;

        tracks.forEach((track => {
            if (!track.hasAttribute('data-kate-processed')) {
                track.setAttribute('data-kate-processed','true');

                // duration
                let track_timestamp = track.querySelector('.chartlist-timestamp span');
                if (track_timestamp != undefined) {
                    tippy(track_timestamp, {
                        content: track_timestamp.getAttribute('title')
                    });
                    track_timestamp.setAttribute('title','');
                }


                // image
                let track_image = track.querySelector('.chartlist-image span');

                if (track_image != undefined) {
                    let track_image_img = track_image.querySelector('img');
                    tippy(track_image, {
                        content: track_image_img.getAttribute('alt')
                    })


                    // artist statistic
                    if (track_image.classList.contains('avatar') && settings.colourful_counts) {
                        patch_artist_ranks_in_list_view(track);
                        return;
                    }
                }

                if (settings.format_guest_features) {
                    let track_title = track.querySelector('.chartlist-name a');
                    console.info('bleh - guest features, track title:', track_title);

                    if (track_title == undefined)
                        return;

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
                            // replaces with corrected artist if applicable
                            song_artist_element.innerHTML = `<a href="/music/${formatted_title[2]}" title="${formatted_title[2]}">${formatted_title[2]}</a>`;

                            // append guests
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
                } else if (latest_settings_cache.corrections) {
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
            }
        }));
    }

    function patch_header_title(element) {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

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
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

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

            if (focused_image_details == undefined)
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
        bookmark_nav.classList.add('bleh--nav-wrap');
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
    function patch_gallery_focused_image(focused_image_details) {
        console.info(focused_image_details);
        if (focused_image_details.hasAttribute('data-kate-processed'))
            return;

        focused_image_details.setAttribute('data-kate-processed', 'true');

        let artist_name = document.body.querySelector('.header-new-title').textContent;
        let focused_image_id = focused_image_details.querySelector('div[data-image-url]').getAttribute('data-image-url').split('/')[4];

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

    unsafeWindow._force_refresh_theme = function() {
        localStorage.removeItem('bleh_cached_style');
        localStorage.removeItem('bleh_cached_style_timeout');
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
        })
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

    unsafeWindow._deliver_notif = function(content, persist=false) {
        deliver_notif(content, persist);
    }
    function deliver_notif(content, persist=false, has_icon=false, append_class='') {
        let notif = document.createElement('button');
        notif.classList.add('bleh-notif');
        notif.setAttribute('onclick', '_kill_notif(this)');
        notif.textContent = content;

        document.getElementById('bleh-notifs').appendChild(notif);

        if (has_icon)
            notif.classList.add('btn--has-icon');

        if (append_class != '')
            notif.classList.add(append_class);

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




    function album_missing_a_tracklist() {
        let header = document.querySelector('.header-new--album');
        if (header == null)
            return;

        if (header.hasAttribute('data-kate-processed'))
            return;
        header.setAttribute('data-kate-processed', 'true');

        // tracklist
        let tracklist = document.getElementById('tracklist');
        if (tracklist == null) {
            let masonry = document.querySelector('.masonry-left-bottom');

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
})();