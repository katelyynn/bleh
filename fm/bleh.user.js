// ==UserScript==
// @name         bleh
// @namespace    http://last.fm/
// @version      2024.0708
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
    build: '2024.0709',
    sku: 'refresh',
    feature_flags: {
        dev: {
            default: false,
            name: 'Use developer mode, which disables style loading',
            date: '2024-06-07'
        },
        experimental_top_nav: {
            default: false,
            name: 'Experimental top nav, its ugly',
            date: '2024-07-04'
        },
        use_flexible_numbers: {
            default: false,
            name: 'Use Roboto Flex for numbers in chartlists',
            date: '2024-07-08'
        },
        use_new_logo: {
            default: false,
            name: 'Use new logo sizing',
            date: '2024-07-08'
        },
        card_animations: {
            default: true,
            name: 'Use card animations',
            date: '2024-07-08'
        },
        aero: {
            default: false,
            name: 'Aero',
            date: '2024-07-09'
        },
        shrikhand_lyrics_blurb: {
            default: true,
            name: 'Shrikhand lyrics blurb',
            date: '2024-07-09'
        },
        bleh_settings_tabs: {
            default: true,
            name: 'Utilise new bleh settings tabs',
            date: '2024-07-09'
        },
        header_refresh: {
            default: false,
            name: 'Header refresh',
            date: '2024-07-09'
        }
    }
}

let lang = document.documentElement.getAttribute('lang');
let valid_langs = ['en', 'pl'];

if (!valid_langs.includes(lang)) {
    console.info('bleh - language fallback from', lang, 'to en (lang is not listed as valid)', valid_langs);
    lang = 'en';
}

let forbidden_nodes = ['path', 'clipPath', 'rect', 'text', 'g', 'svg', 'button', 'a', 'script'];

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
                format_guest_features: {
                    name: 'Format guest features and song tags',
                    bio: 'Visually places less priority on song features & tags (eg. Remix, Deluxe Edition, etc.)'
                },
                gendered_tags: {
                    name: 'Hide gendered tags',
                    bio: 'By default, gendered tags are hidden in bleh due to their unorganised and impossible nature.'
                },
                rain: {
                    name: 'Let it rain!',
                    bio: 'rain :3c (may have performance impacts !! also may look bad !!)'
                },
                hide_hateful: {
                    name: 'Hide hateful shouts',
                    bio: 'Hateful users are community-contributed, it is up to you if you prefer to view these shouts.'
                },
                show_your_progress: {
                    name: 'Show your weekly progress',
                    bio: 'too many numbers ~w~'
                }
            },
            performance: {
                name: 'Performance',
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
            submit_bleh_correction: 'Submit correction to bleh'
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
                },
                hide_hateful: {
                    name: 'Ukryj obraźliwe wiadomości',
                    bio: 'Użytkownicy są zgłaszani przez społeczność ze względu na obraźliwe treści. Decydujesz czy chcesz zobaczyć wiadomości od tych użytkowników.'
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
    'idkwhyy': 'Reposters #suck',
    'Quinn': 'quinn',
    'Charli XCX': 'Charli xcx',
    'Underscores': 'underscores'
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
        '- feat', 'feat.',
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
        '- choppednotslopped', '(choppednotslopped', '[choppednotslopped',
        '(v1', '(v2', '(v3', '(v4', '(v5', '(v6', '(v7', '(v8', '(v9',
        '- nevermind version', '(nevermind version'
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
    'cutensilly': [
        {
            type: 'k',
            name: 'k'
        },
        {
            type: 'a',
            name: 'a'
        },
        {
            type: 't',
            name: 't'
        },
        {
            type: 'e',
            name: 'e'
        },
        {
            type: 'queen',
            name: 'blehhhhhhhhhh!!'
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
    format_guest_features: true,
    colourful_counts: true,
    rain: false,
    feature_flags: {},
    show_your_progress: true
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


let redacted = [
    'sonicgamer420', 'punishedcav', 'whatisajuggalo', 'underthefl00d', 'u1655609395', 'spartan122s', 'ruszaj', 'chandiwila999', 'deadaptation', 'faceIDbroke', 'shamsrealm', 'dread1nat0r', 'oskxzr', 'supersonic2324', 'luna', 'daysbeforepazi', 'reypublican', 'urkel_waste', 'bloodtemptress', 'enderbro1945', 'nxtready', 'hammurabis', 'flammenjunge', 'hotgreekman', 'minajspace', 'Matiiia',
    'sudaengi', 'antisemitic', 'alfonsorivera07', 'gueulescassees', 'bit188', 'aryanorexic', 'archive44', 'goyslop', 'lzxy', 'i984june', 'babayoga88', 'goatuser', 'synagogueburner', 'cybercat2k6',
    'thekimsteraight', 'squiggins', 'atwistedpath', 'aeriscupid', 'nicefeetliberal', 'kanyebeststan', 'a-_-_-_-_-_-_-_', 'wurzel362', 'chaosophile', 'sagamore_br', 'account124', 'oliwally2', 'lucasthales', 'thedadbrains', 'artofiettinggo', 'lumyh', 'meltingwalls', 'meowpoopoo', 'aeest', 'ajrogers25', 'flvcko5000', 'yungrapunxota', 'sen_nn', 'chickenoflight', 'majorcbartl', 'entranas', 'julyrent', 'misaeld7', 'sircarno', 'getyuu', 'ifuckbees', 'bigbabygoat-116', 'matranc', 'andre3x', 'johanvillian666', 'souljahwitch_', 'selenabeer', 'kbasfm', 'c4alexo', 'aantoniotapia', 'bobbygordon4', 'con_8l', 'kebfm', 'alex5un', 'bluefacee', 'itachiu1', 'tardslayer87', 'sharosky',
    'craziidago',
    'calicowawawa', 'ieo-',
    'dyetzer09', 'sevendotz', 'geckogunner21',
    'bigman_kam', 'juanluisgg15', 'xxalesonikps2xx', 'noodlebaths',
    'entrys', 'haviebaby',
    'ifuckenhatebts', 'cuteandfunny', 'nickithebarbie', 'kristojk', 'lovethebabiesss', 'thecrybabygirl', 'faafasfjh12', 'lost', 'isucktoes_', 'rightangles', 'supadupaseb', 'septembersun-_-', 'yy02', 'breakpoint420', 'twillaz', 'angel-food', 'owenfomistu', 'nuhovich', 'sigmevious', 'lovedytea',
    'eminemiover911', 'ranmaru1232', 'littlegayman', 'overkektor', 'zigger0707', 'jtldn', 'bakaanon', 'thewatcher777', 'guicute', 'wempep', 'beingofevil', 'marie_cachet', 'rusnazi8814', 'go1nger', 'pranav777', 'creativezito', 'djangelinfinity', 'cowboy-robot', 'riskgrave', 'charmingaxelotl', 'naterade20', 'willgregg10', 'avantish', 'shaggy-maggot', 'slicejosiah', 'airshots22', 'tacomiw', 'davebfc', 'ukulilyfilly', 'speepyboo', 'roosterteethz', 'winter_demon', 'ddavid_', 'wess0', 'heruchris', 'mellowcolonel', 'dxp6986', 'leo_marlow', 'newmetallic', 'kotkaa', 'dodemea', 'cainripley', 'frajestic', 'danny_top23', 'molochthagod', 'kanyelover900', 'phosphoss', 'sugawarasatsuki', 'captivepleading', 'paddycm', 'burroughs3000', 'marblesodaa', 'muistu77', 'korimullanmusic', 'magikwand', 'empireograce', 'psychonau', 'sk8erboi03', 'dogtome', 'milkvveed', 'ghastlygoblin', 'lsihc', 'promethesis', 'nlcklmlnaj', 'so0catwoman', 'handsomegamer46', 'w28888ihateu', 'iithe2nd', 'jrwer', 'r0ann', 'hetzghor', 'umabon', 'karl_nicenstein', 'forestgaze', 'ghostcum', 'bigluke444', 'mozzaddy', 'ahuehauheauauh', 'kingjaxterk', 'setitaiiablaze', 'araicd', 'juliusvc', 'mzumii', 'masskollaps', 'belenio', 'hoosierballz', 'sh0ppingcart', 'brownieboy', 'martyrdomr', 'twenty10s', 'skuuuuuii', 'birodani115', 'lawlercopter_', 'samanthafox12', 'the_diabolus', 'momasoooooos', 'tigohc', 'ora4ngepm', 'minakonyaa', 'ryukoprop', 'antifafemboy', 'nlec', 'jediwarlock1', 'epowjgpwak', 'anxrcxy', 'pissturd1', 'adxail', 'suprremme', 'qwertyhomu', 'keblz', 'hotstep_', 'fadelooy', 'apesog', 'violentflowers', 'itsthiagobanger', 'syrettepurp', 'swagstica', 'htgs', 'grigoriybalbes', 'heliosi', 'buttfartdhshs', 'wonderglue', 'kanyewest2028', 'caeshijque', 'mysterybfdi', 'nikkilee8208', 'jck_fm', 'etherealbangerz', 'iseenothing', 'achondrogenesis', 'theandromedaxo', 'seanderbeste', 'jct08', 'thev3locity4545', 'humblegold', 'draincel', 'allyourbased', 'birdboiling', 'tharizdoom', 'suplnho', 'dashywashy', 'ox_yd', 'bernkastel__', 'fearcuit', 'gxlnd_', 'brittanymahomes', 'numetalfan69', 'safirestar', 'icespoon', 'issacj06', 'theprio', 'lovediaries', 'sillycelery1974', 'nyqmii', 'gauitier', 'rspbrysda', 'pnavarre2330', 'ltsup2me', 'noolr', 'dakota0824', 'goncalvesrafael', 'daequanbs', 'dwaqons', 'bogurodzica69', 'gtzgold', 'roy_05', 'niloymahir', 'ikarivktr', 'je1934', 'sugmaballs69', 'don-weaso', 'schrodngrsafety', 'okjosiah', 'anahausu', 'venusfleur', 'kristiyan47', 'mkulia', 'nick-valentine', 'raraee_', 'mj-xx', 'berk_ziya', 'thatpower1', 'phantomchasm', 'stupidmetalhead', 'daeae', 'drakedrank69'
];

// use the top-right link to determine the current user
let auth = '';
let auth_link = '';

let root = '';

let bleh_url = 'https://www.last.fm/bleh';
let bleh_regex = new RegExp('^https://www\.last\.fm/[a-z]+/bleh$');


(function() {
    'use strict';

    root = document.querySelector('.masthead-logo a').getAttribute('href');
    auth_link = document.querySelector('a.auth-link');
    auth = auth_link.querySelector('img').getAttribute('alt');
    initia();

    deliver_notif(`loading bleh ${version.build} with sku ${version.sku}`);

    function initia() {
        let performance_start = performance.now();

        append_style();
        load_settings();
        //get_scrobbles(document.body);
        append_nav(document.body);
        patch_masthead(document.body);
        load_notifs();

        start_rain();

        scroller();
        window.onscroll = function(e) {
            scroller();
        }

        console.log(bleh_url,window.location.href,bleh_regex.test(window.location.href));

        if (window.location.href == bleh_url || bleh_regex.test(window.location.href)) {
            bleh_settings();
        } else {
            patch_profile(document.body);
            patch_shouts(document.body);
            patch_titles(document.body);
            patch_header_title(document.body);
            patch_artist_ranks(document.body);
            patch_artist_grids(document.body);
            patch_header_menu();
            patch_gallery_page();

            // album pages
            bleh_album_pages();
            bleh_artist_pages();
            bleh_track_pages();
            bleh_profile_pages();
            patch_lastfm_settings();

            correct_generic_combo_no_artist('artist-header-featured-items-item');
            correct_generic_combo_no_artist('artist-top-albums-item');
            correct_generic_combo('source-album-details');
            correct_generic_combo('resource-list--release-list-item');
            correct_generic_combo('similar-albums-item');
            correct_generic_combo('track-similar-tracks-item');
            correct_generic_combo('similar-items-sidebar-item');
        }

        // last.fm is a single page application
        const observer = new MutationObserver((mutations) => {
            load_settings();
            //get_scrobbles(node);
            append_nav(document.body);
            patch_masthead(document.body);
            load_notifs();

            if (window.location.href == bleh_url || bleh_regex.test(window.location.href)) {
                bleh_settings();
            } else {
                patch_profile(document.body);
                patch_shouts(document.body);
                patch_titles(document.body);
                patch_header_title(document.body);
                patch_artist_ranks(document.body);
                patch_artist_grids(document.body);
                patch_header_menu();
                patch_gallery_page();

                // album pages
                bleh_album_pages();
                bleh_artist_pages();
                bleh_track_pages();
                bleh_profile_pages();
                patch_lastfm_settings();

                correct_generic_combo_no_artist('artist-header-featured-items-item');
                correct_generic_combo_no_artist('artist-top-albums-item');
                correct_generic_combo('source-album-details');
                correct_generic_combo('resource-list--release-list-item');
                correct_generic_combo('similar-albums-item');
                correct_generic_combo('track-similar-tracks-item');
                correct_generic_combo('similar-items-sidebar-item');
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        let performance_end = performance.now();
        deliver_notif(`bleh finished loading in ${performance_end - performance_start}`);
    }

    function scroller() {
        if (window.scrollY > 0)
            document.body.setAttribute('data-bleh--scrolled', 'true');
        else
            document.body.setAttribute('data-bleh--scrolled', 'false');
    }

    function append_style() {
        let cached_style = localStorage.getItem('bleh_cached_style') || '';
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();
        if (settings.feature_flags == undefined)
            settings.feature_flags = {};

        // style is not fetched in dev mode
        if (settings.feature_flags.dev)
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

        if (!masthead_logo.hasAttribute('data-bleh')) {
            masthead_logo.setAttribute('data-bleh','true');

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

        let my_avi = auth_link.querySelector('img').getAttribute('src').replace('avatar42s', 'avatar170s');
        document.querySelector('.auth-dropdown-menu').style.setProperty('--url', `url(${my_avi})`);

        if (!user_nav.hasAttribute('data-bleh')) {
            user_nav.setAttribute('data-bleh','true');

            let bleh_nav = document.createElement('li');
            bleh_nav.innerHTML = (`
                <li>
                    <button class="auth-dropdown-menu-item bleh--theme-menu-item" onclick="toggle_theme()">
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
                    <a class="auth-dropdown-menu-item bleh--configure-menu-item" href="/bleh">
                        <span class="auth-dropdown-item-row">
                            <span class="auth-dropdown-item-left">${trans[lang].auth_menu.configure_bleh}</span>
                        </span>
                    </a>
                </li>
            `);
            user_nav.appendChild(bleh_nav);
        }

        if (!inbox_nav.hasAttribute('data-bleh')) {
            inbox_nav.setAttribute('data-bleh','true');
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
        if (settings.dev) {
            settings.feature_flags.dev = true;
            settings.dev = false;
        }

        // save setting into body
        for (let setting in settings) {
            document.body.style.setProperty(`--${setting}`, settings[setting]);
            document.documentElement.setAttribute(`data-bleh--${setting}`, `${settings[setting]}`);
        }

        load_skus(settings);

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
    function patch_lastfm_settings() {
        // this is how we check we're in the settings
        if (!document.body.classList[2].startsWith('namespace--settings'))
            return;

        let col_main = document.body.querySelector('.col-main');

        if (col_main.hasAttribute('data-bleh'))
            return;
        col_main.setAttribute('data-bleh', 'true');

        let navlist = document.body.querySelector('.secondary-nav');
        col_main.insertBefore(navlist, col_main.firstChild);

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

        if (charts_panel.hasAttribute('data-bleh'))
            return;

        charts_panel.setAttribute('data-bleh', 'true');
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
        if (update_picture.hasAttribute('data-bleh'))
            return;

        update_picture.setAttribute('data-bleh', 'true');
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
                            <span class="btn-secondary btn primary btn-file" data-bleh="true">
                            Choose file
                                <input type="file" name="avatar" data-require="components/file-input" data-file-input-copy="Choose file" data-no-file-copy="No file chosen" accept="image/*" required="" id="id_avatar" data-bleh="true">
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
        if (privacy_panel.hasAttribute('data-bleh'))
            return;

        privacy_panel.setAttribute('data-bleh', 'true');
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

        return;

        patch_profile_following();

        let profile_name = profile_header.querySelector('a');

        // profile note
        let profile_notes = JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
        let profile_note = profile_notes[profile_name.textContent];

        let profile_has_note = false;
        if (profile_note != undefined)
            profile_has_note = true;

        if (!profile_header.hasAttribute('data-bleh')) {
            profile_header.setAttribute('data-bleh', 'true');

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
        }

        let about_me_sidebar = element.querySelector('.about-me-sidebar');

        if (about_me_sidebar == undefined)
            return;

        if (!about_me_sidebar.hasAttribute('data-bleh')) {
            about_me_sidebar.setAttribute('data-bleh','true');

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

        localStorage.setItem('bleh_profile_notes', JSON.stringify(profile_notes));

        deliver_notif(`cleared profile note for ${username}`);
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

        localStorage.setItem('bleh_profile_notes', JSON.stringify(profile_notes));

        deliver_notif(`saved profile note for ${username}, ${document.getElementById('bleh--profile-note').value}`);
    }


    unsafeWindow.undo_profile_hiding = function() {
        let main_content = document.querySelector('.main-content');
        main_content.classList.remove('content--bleh-redacted');
        document.body.removeChild(document.body.querySelector('.bleh--redacted-message'));
    }


    // patch following
    function patch_profile_following() {
        // this happens on your main profile, no matter the tab
        let following_tab = document.body.querySelector('.secondary-nav-item--following');
        let following_tab_html = following_tab.outerHTML;
        if (following_tab == undefined)
            return;

        if (following_tab.hasAttribute('data-bleh'))
            return;

        following_tab.setAttribute('data-bleh', 'true');
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


        let col_main = document.body.querySelector('.col-main');


        // create nav
        let bookmark_nav = document.createElement('nav');
        bookmark_nav.classList.add('navlist', 'secondary-nav', 'navlist--more', 'bleh--friends-nav');
        bookmark_nav.innerHTML = (`
            <ul class="navlist-items bleh--navlist-items">
                ${following_tab_html}
                ${followers_tab_html}
                ${neighbours_tab_html}
            </ul>
        `);

        col_main.insertBefore(bookmark_nav, col_main.firstChild);
    }


    // patch shouts
    function patch_shouts(element) {
        let shouts = element.querySelectorAll('.shout');

        shouts.forEach((shout) => {
            try {
            if (!shout.hasAttribute('data-bleh')) {
                shout.setAttribute('data-bleh', 'true');

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
        if (!element.hasAttribute('data-bleh')) {
            element.setAttribute('data-bleh', 'true');

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
                badge.classList.add('avatar-status-dot',`user-badge--${this_badge.type}`,`user-badge--user-${name}`);
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

            if (!personal_statistic.hasAttribute('data-bleh')) {
                personal_statistic.setAttribute('data-bleh','true');

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
            if (!artist_statistic.hasAttribute('data-bleh')) {
                artist_statistic.setAttribute('data-bleh','true');

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

        if (!count_bar.hasAttribute('data-bleh')) {
            count_bar.setAttribute('data-bleh','true');

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
            if (!artist.hasAttribute('data-bleh')) {
                artist.setAttribute('data-bleh','true');

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


    /**
     * correct capitalisation of a generic album/track name & artist combo
     * @param {string} parent individual css selector for each item wrapper
     * @returns if not found
     */
    function correct_generic_combo(parent) {
        let albums = document.body.querySelectorAll(`.${parent}`);

        if (albums == undefined)
            return;

        albums.forEach((album) => {
            if (!album.hasAttribute('data-bleh')) {
                album.setAttribute('data-bleh','true');
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
            if (!album.hasAttribute('data-bleh')) {
                album.setAttribute('data-bleh','true');
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

        if (artist_corrections.hasOwnProperty(artist)) {
            console.info('bleh - correction handler: corrected as', artist_corrections[artist]);
            return artist_corrections[artist];
        } else {
            return artist;
        }
    }




    // patch track/album/artist menu
    function patch_header_menu() {
        let menu = document.body.querySelector('.header-new-more-actions-menu');

        if (menu == undefined)
            return;

        if (!menu.hasAttribute('data-bleh')) {
            menu.setAttribute('data-bleh','true');

            let extra_items = document.createElement('li');
            extra_items.innerHTML = (`
            <a class="dropdown-menu-clickable-item more-item--submit-correction" href="https://docs.google.com/forms/d/e/1FAIpQLScRzZaMfpjgKUq4CCA8iuEQCxVdalyv9bwnZEjPDm7lit_Ohg/viewform" target="_blank">
                ${trans[lang].music.submit_lastfm_correction}
            </a>
            <a class="dropdown-menu-clickable-item more-item--submit-correction-bleh" href="https://github.com/katelyynn/bleh/issues/9" target="_blank">
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
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();
        let adaptive_skin_container = document.querySelector('.adaptive-skin-container');

        if (!adaptive_skin_container.hasAttribute('data-bleh')) {
            adaptive_skin_container.setAttribute('data-bleh','true');

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

            if (!settings.feature_flags.bleh_settings_tabs) {
                side.innerHTML = (`
                    <div class="bleh--panel">
                        <div class="btns">
                            <button class="btn bleh--btn bleh--nav" data-bleh-page="home" onclick="_change_settings_page('home')">
                                ${trans[lang].settings.home.name}
                            </button>
                            <button class="btn bleh--btn bleh--nav" data-bleh-page="themes" onclick="_change_settings_page('themes')">
                                ${trans[lang].settings.themes.name}
                            </button>
                            <button class="btn bleh--btn bleh--nav" data-bleh-page="customise" onclick="_change_settings_page('customise')">
                                ${trans[lang].settings.customise.name}
                            </button>
                            <button class="btn bleh--btn bleh--nav" data-bleh-page="profiles" onclick="_change_settings_page('profiles')">
                                ${trans[lang].settings.profiles.name}
                            </button>
                            <button class="btn bleh--btn bleh--nav" data-bleh-page="performance" onclick="_change_settings_page('performance')">
                                ${trans[lang].settings.performance.name}
                            </button>
                            <button class="btn bleh--btn" data-bleh-page="sku" onclick="_change_settings_page('sku')">
                                Configure your bleh sku
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
                            <button class="btn" data-bleh-action="reset" onclick="_reset_settings()">
                                ${trans[lang].settings.actions.reset.name}
                            </button>
                        </div>
                    </div>
                `);
            } else {
                side.innerHTML = (`
                    <div class="bleh--panel">
                        <div class="btns">
                            <button class="btn" data-bleh-action="import" onclick="_import_settings()">
                                ${trans[lang].settings.actions.import.name}
                            </button>
                            <button class="btn" data-bleh-action="export" onclick="_export_settings()">
                                ${trans[lang].settings.actions.export.name}
                            </button>
                        </div>
                        <div class="btns sep">
                            <button class="btn" data-bleh-action="reset" onclick="_reset_settings()">
                                ${trans[lang].settings.actions.reset.name}
                            </button>
                        </div>
                    </div>
                `);
            }


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
                            <p onclick="_change_settings_page('sku')">${trans[lang].settings.home.version.replace('{v}', `${version.build}.${version.sku}`)}</p>
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
                        <div class="shout js-shout js-link-block" data-bleh="true">
                            <h3 class="shout-user">
                                <a>cutensilly</a>
                            </h3>
                            <span class="avatar shout-user-avatar" title="Last.fm Pro user" data-bleh="true">
                                <img src="https://lastfm.freetls.fastly.net/i/u/avatar70s/198d1a3bd66a0d586e8e7af8a31febe4.jpg" alt="Your avatar" loading="lazy">
                                <span class="avatar-status-dot user-status--bleh-queen user-status--bleh-user-cutensilly" data-bleh="true"></span>
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
                            <div class="personal-stats-item personal-stats-item--scrobbles link-block js-link-block" data-bleh="true" data-bleh--scrobble-milestone="10" style="--hue: -14.921125; --sat: 1.5; --lit: 0.875;">
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
                                        <span class="avatar-status-dot user-status--bleh-queen user-status--bleh-user-cutensilly" data-bleh="true"></span>
                                    </span>
                                </div>
                            </div>
                            <div class="personal-stats-item personal-stats-item--scrobbles link-block js-link-block" data-bleh="true" data-bleh--scrobble-milestone="5" style="--hue: 96.59066666666666; --sat: 1.35; --lit: 0.925;">
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
                                        <span class="avatar-status-dot user-status--bleh-queen user-status--bleh-user-cutensilly" data-bleh="true"></span>
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
                                        <span class="avatar-status-dot user-status--bleh-queen user-status--bleh-user-cutensilly" data-bleh="true"></span>
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
                                        <span class="avatar-status-dot user-status--bleh-queen user-status--bleh-user-cutensilly" data-bleh="true"></span>
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
                            <h5>${trans[lang].settings.customise.format_guest_features.name}</h5>
                            <p>${trans[lang].settings.customise.format_guest_features.bio}</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-format_guest_features" onclick="_update_item('format_guest_features')" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                    <!--<div class="toggle-container" id="container-big_numbers">
                        <button class="btn reset" onclick="_reset_item('big_numbers')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>Use alternative numerical font</h5>
                            <p>A special font solely for numbers, check it out!</p>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-big_numbers" onclick="_update_item('big_numbers')" aria-checked="true">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>-->
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
                    <div class="toggle-container" id="container-hide_hateful">
                        <button class="btn reset" onclick="_reset_item('hide_hateful')">${trans[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans[lang].settings.customise.hide_hateful.name}</h5>
                            <p>${trans[lang].settings.customise.hide_hateful.bio}</p>
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
        } else if (page == 'sku') {
            return (`
                <div class="bleh--panel shh">
                    shhh...<br>let's not leak<br>our hard work
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
        }
    }

    unsafeWindow._change_settings_page = function(page) {
        change_settings_page(page);
    }

    function change_settings_page(page) {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

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
                                ${trans[lang].settings.themes.name}
                            </a>
                        </li>
                        <li class="navlist-item secondary-nav-item">
                            <a class="secondary-nav-item-link bleh--nav" data-bleh-page="customise" onclick="_change_settings_page('customise')">
                                ${trans[lang].settings.customise.name}
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

        let btns = document.querySelectorAll('.bleh--nav');
        btns.forEach((btn) => {
            console.log(btn.getAttribute('data-bleh-page'),page);
            if (btn.getAttribute('data-bleh-page') != page) {
                btn.classList.remove('active');
            } else {
                btn.classList.add('active');
            }
        });

        document.getElementById('bleh--panel-main').innerHTML = document.getElementById('bleh--panel-main').innerHTML + render_setting_page(page);

        if (page == 'themes')
            show_theme_change_in_settings();
        else if (page == 'customise' || page == 'performance')
            refresh_all();
        else if (page == 'profiles')
            init_profile_notes();
        else if (page == 'sku')
            bleh_sku_page();
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
        background.setAttribute('data-bleh','true');

        let wrapper = document.createElement('div');
        wrapper.classList.add('popup_wrapper','popup_wrapper_visible');
        wrapper.setAttribute('id',`bleh--window-${id}--wrapper`);
        wrapper.style = 'opacity: 1; visibility: visible; position: fixed; overflow: auto; width: 100%; height: 100%; top: 0px; left: 0px; text-align: center;';
        wrapper.setAttribute('data-bleh','true');


        // dialog
        let dialog = document.createElement('div');
        dialog.classList.add('modal-dialog');
        dialog.setAttribute('id',`bleh--window-${id}--dialog`);
        dialog.style = 'opacity: 1; visibility: visible; pointer-events: auto; display: inline-block; outline: none; text-align: left; position: relative; vertical-align: middle;';
        dialog.setAttribute('data-bleh','true');

        // content
        let content = document.createElement('div');
        content.classList.add('modal-content');
        content.setAttribute('id',`bleh--window-${id}--content`);
        content.setAttribute('data-bleh','true');

        // share content
        let share = document.createElement('div');
        share.classList.add('modal-share-content');
        share.setAttribute('id',`bleh--window-${id}--share`);
        share.setAttribute('data-bleh','true');

        // body
        let body = document.createElement('div');
        body.classList.add('modal-body');
        body.setAttribute('id',`bleh--window-${id}--body`);
        body.setAttribute('data-bleh','true');

        // title
        let header = document.createElement('h2');
        header.classList.add('modal-title');
        header.textContent = title;
        header.setAttribute('data-bleh','true');

        // inner content
        let inner_content_em = document.createElement('div');
        inner_content_em.classList.add('modal-inner-content');
        inner_content_em.innerHTML = inner_content;
        inner_content_em.setAttribute('data-bleh','true');


        let align = document.createElement('div');
        align.classList.add('popup_align');
        align.setAttribute('id',`bleh--window-${id}--align`);
        align.style = 'display: inline-block; vertical-align: middle; height: 100%;';
        align.setAttribute('data-bleh','true');


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

        if (song_title_corrections.hasOwnProperty(original_artist.toLowerCase())) {
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
            let field_text = extras[extra].text.replace(' feat. ','').replace('feat. ','').replace('w/ ','').replace('with ','').replaceAll(' & ',';').replaceAll(', ',';').replaceAll('Tyler;the', 'Tyler, the').replaceAll(' with ',';');

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
            if (!track.hasAttribute('data-bleh')) {
                track.setAttribute('data-bleh','true');

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
                } else {
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
            if (!track_title.hasAttribute('data-bleh')) {
                track_title.setAttribute('data-bleh','true');

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
            if (!track_title.hasAttribute('data-bleh')) {
                track_title.setAttribute('data-bleh','true');

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
        if (image_list.hasAttribute('data-bleh'))
            return;

        image_list.setAttribute('data-bleh', 'true');

        let bookmarked_images = JSON.parse(localStorage.getItem('bleh_bookmarked_images')) || {};

        let artist_name = document.body.querySelector('.header-new-title').textContent;

        let row = document.body.querySelector('.page-content .row');

        document.body.setAttribute('data-bleh--gallery-tab', 'overview');


        // content
        let bookmarks_content = document.createElement('div');
        bookmarks_content.classList.add('col-main', 'bleh--bookmarks');
        bookmarks_content.innerHTML = (`
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
            <section>
                <h2>${trans[lang].gallery.bookmarks.name}</h2>
                <p>${trans[lang].gallery.bookmarks.bio}</p>
                <ul class="image-list" id="bleh--bookmarked-images" data-bleh="true"></ul>
            </section>
        `);

        row.insertBefore(bookmarks_content, row.firstChild);


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
        if (focused_image_details.hasAttribute('data-bleh'))
            return;

        focused_image_details.setAttribute('data-bleh', 'true');

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




    // album pages
    function bleh_album_pages() {
        let album_header = document.body.querySelector('.header-new--album');

        if (album_header == undefined)
            return;

        if (album_header.hasAttribute('data-bleh'))
            return;
        album_header.setAttribute('data-bleh', 'true');

        let is_subpage = album_header.classList.contains('header-new--subpage');

        let row = document.body.querySelector('.row');
        let col_main = document.body.querySelector('.col-main:not(.visible-xs, .upper-overview)');
        let col_sidebar = document.body.querySelector('.col-sidebar:not(.masonry-right)');

        let navlist = album_header.querySelector('.navlist');
        if (!is_subpage) {
            navlist = document.createElement('nav');
            navlist.classList.add('navlist', 'secondary-nav', 'navlist--more');
            navlist.setAttribute('aria-label', 'Secondary navigation');
            navlist.setAttribute('data-require', 'components/collapsing-nav-v2');

            navlist.innerHTML = (`
                <ul class="navlist-items js-navlist-items" style="position: relative;">
                    <li class="navlist-item secondary-nav-item secondary-nav-item--overview">
                        <a class="secondary-nav-item-link secondary-nav-item-link--active" href="${window.location.href}">
                            Overview
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--wiki">
                        <a class="secondary-nav-item-link" href="${window.location.href}/+wiki">
                            Wiki
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--tags">
                        <a class="secondary-nav-item-link" href="${window.location.href}/+tags">
                            Tags
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--images">
                        <a class="secondary-nav-item-link" href="${window.location.href}/+images">
                            Artwork
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--shoutbox">
                        <a class="secondary-nav-item-link" href="${window.location.href}/+shoutbox">
                            Shouts
                        </a>
                    </li>
                </ul>
            `);
        }

        col_main.insertBefore(navlist, col_main.firstChild);
        col_sidebar.classList.add('album-sidebar');

        if (!is_subpage) {
            let col_main_overview = document.body.querySelector('.col-main.upper-overview');

            let album_artwork = document.body.querySelector('.col-sidebar.masonry-right').lastElementChild.outerHTML;
            let album_name = album_header.querySelector('.header-new-title').innerHTML;
            let album_artist = album_header.querySelector('.header-new-crumb span').innerHTML;
            let album_artist_link = album_header.querySelector('.header-new-crumb').getAttribute('href');

            let tags = document.body.querySelector('.catalogue-tags');

            let actions = album_header.querySelector('.header-new-actions');

            let album_metadata = album_header.querySelectorAll('.header-metadata-tnew-display');
            let plays = album_metadata[1].querySelector('abbr').textContent;
            let listeners = album_metadata[0].querySelector('abbr').textContent;

            let header_bg_html = album_header.querySelector('.header-new-background-image');
            let header_bg = '';
            if (header_bg_html != null)
                header_bg = header_bg_html.getAttribute('content');

            insert_top_nav(header_bg);


            // chart position
            let chart_position = album_header.querySelector('.header-new-chart-position-number');

            // about this album
            let release_year = 0;
            let release_date = 'never :(';
            let track_count = 'No tracks';
            let album_length = '0:00'

            let meta = col_main_overview.querySelectorAll('.metadata-column .catalogue-metadata-description');
            meta.forEach((meta_item, index) => {
                let meta_text = meta_item.textContent;
                deliver_notif(meta_text);

                if (index == 0) {
                    // track count & length
                    let split = meta_text.split(', ');

                    track_count = split[0];
                    if (split.length > 1)
                        album_length = split[1].trim();
                } else {
                    // release date
                    release_date = meta_text;
                    release_year = new Date(release_date).getFullYear();
                }
            });


            // panel
            let album_main_panel = document.createElement('section');
            album_main_panel.classList.add('album-main-panel');
            album_main_panel.innerHTML = (`
                <div class="top-cover">
                    ${album_artwork}
                </div>
                <div class="middle-info">
                    <h3>Album</h3>
                    <span class="top">
                        <h1>${album_name}</h1>
                        ${(chart_position != null) ? `<h1>${chart_position.outerHTML}</h1>` : ''}
                    </span>
                    <h2><a href="${album_artist_link}">${album_artist}</a></h2>
                </div>
                <div class="bottom-wiki">
                    ${get_wiki(col_main_overview)}
                    <div class="release-row">
                        <div class="date" id="date">
                            ${release_date}
                        </div>
                        <div class="length" id="length">
                            ${album_length}
                        </div>
                    </div>
                    ${tags.outerHTML}
                    ${actions.outerHTML}
                </div>
            `);
            col_sidebar.insertBefore(album_main_panel, col_sidebar.firstChild);

            tippy(document.getElementById('date'), {
                content: 'Release date'
            });
            tippy(document.getElementById('length'), {
                content: 'Album length'
            });


            // plays
            let my_avi = auth_link.querySelector('img').getAttribute('src');
            let scrobble_count_element = document.body.querySelector('.personal-stats-item--scrobbles .header-metadata-display a');
            let scrobble_count = 0;
            let scrobble_link = '';
            if (scrobble_count_element != undefined) {
                scrobble_count = scrobble_count_element.textContent;
                scrobble_link = scrobble_count_element.getAttribute('href');
            }

            let your_scrobbles = document.createElement('section');
            your_scrobbles.classList.add('album-listeners-panel', 'album-listeners-you-know-panel');
            your_scrobbles.innerHTML = (`
                <h2>Listeners</h2>
                <div class="listener-row">
                    <div class="you-side">
                        <h3><img src="${my_avi}"><a class="user" href="${auth_link}">You</a></h3>
                        <p><a class="scrobbles" href="${scrobble_link}">${scrobble_count}</a></p>
                    </div>
                </div>
            `);
            album_main_panel.after(your_scrobbles);


            // listeners
            let listener_trend = col_sidebar.querySelector('.listener-trend');

            let album_listeners_panel = document.createElement('section');
            album_listeners_panel.classList.add('album-listeners-panel');
            album_listeners_panel.innerHTML = (`
                <div class="listener-row">
                    <div class="listener-side">
                        <h3>Listeners</h3>
                        <p>${listeners}</p>
                    </div>
                    <div class="scrobbler-side">
                        <h3>Scrobbles</h3>
                        <p>${plays}</p>
                    </div>
                </div>
                <div class="listener-trend-row">
                    ${(listener_trend != null) ? listener_trend.outerHTML : 'There\'s no listener trend yet, check back later.'}
                </div>
            `);
            your_scrobbles.after(album_listeners_panel);


            // tracklist
            let tracklist = document.getElementById('tracklist');
            if (tracklist == null) {
                tracklist = document.createElement('section');
                tracklist.innerHTML = (`
                    <h3 class="text-18">Tracklist</h3>
                    <div class="no-data-message">
                        <p class="no-data-message">hmm.. we're missing a tracklist</p>
                        <p class="no-data-message">wait a sec for last.fm to fetch your plays on this album</p>
                    </div>
                `)
                navlist.after(tracklist);

                let url_split = window.location.href.split('/');
                let album_url = `${url_split[(url_split.length - 2)]}/${url_split[(url_split.length - 1)]}`;


                // we need to fetch the tracklist
                fetch(`/user/${auth}/library/music/${album_url}`)
                    .then(function(response) {
                        console.error('returned', response, response.text);

                        return response.text();
                    })
                    .then(function(html) {
                        let doc = new DOMParser().parseFromString(html, 'text/html');

                        deliver_notif(`using url ${`/user/${auth}/library/music/${album_url}`}`);
                        console.error('DOC', doc);

                        let inner_tracklist = doc.querySelector('#top-tracks-section [v-else=""] .chartlist');

                        tracklist.innerHTML = (`
                            <h3 class="text-18">Tracklist</h3>
                            ${inner_tracklist.outerHTML}
                        `);
                    })
            }
        } else {
            let album_name = album_header.querySelector('.header-new-title').innerHTML;
            let album_artist = album_header.querySelector('.header-new-crumb span').innerHTML;
            let album_artist_link = album_header.querySelector('.header-new-crumb').getAttribute('href');

            let header_bg_html = album_header.querySelector('.header-new-background-image');
            let header_bg = '';
            if (header_bg_html != null)
                header_bg = header_bg_html.getAttribute('content');

            insert_top_nav(header_bg);


            // panel
            let album_main_panel = document.createElement('section');
            album_main_panel.classList.add('album-main-panel');
            album_main_panel.innerHTML = (`
                <div class="top-cover">
                    <div class="item-has-metadata artwork-and-metadata-row buffer-standard buffer-reset@sm">
                        <div class="album-overview-cover-art js-focus-controls-container">
                            <a class="cover-art" href="${col_main.querySelector('.secondary-nav-item--images a').getAttribute('href')}">
                                <img src="${header_bg}" loading="lazy">
                            </a>
                        </div>
                    </div>
                </div>
                <div class="middle-info">
                    <h3>Album</h3>
                    <h1>${album_name}</h1>
                    <h2><a href="${album_artist_link}">${album_artist}</a></h2>
                </div>
            `);
            col_sidebar.insertBefore(album_main_panel, col_sidebar.firstChild);
        }

        album_header.innerHTML = '';
    }

    // artist pages
    function bleh_artist_pages() {
        let artist_header = document.body.querySelector('.header-new--artist');

        if (artist_header == undefined)
            return;

        if (artist_header.hasAttribute('data-bleh'))
            return;
        artist_header.setAttribute('data-bleh', 'true');

        let is_subpage = artist_header.classList.contains('header-new--subpage');

        let row = document.body.querySelector('.row');
        let col_main = document.body.querySelector('.col-main:not(.bleh--bookmarks).buffer-standard');
        let col_sidebar = document.body.querySelector('.col-sidebar:not(.section-with-separator)');

        let navlist = artist_header.querySelector('.navlist');
        if (!is_subpage) {
            navlist = document.createElement('nav');
            navlist.classList.add('navlist', 'secondary-nav', 'navlist--more');
            navlist.setAttribute('aria-label', 'Secondary navigation');
            navlist.setAttribute('data-require', 'components/collapsing-nav-v2');

            navlist.innerHTML = (`
                <ul class="navlist-items js-navlist-items" style="position: relative;">
                    <li class="navlist-item secondary-nav-item secondary-nav-item--overview">
                        <a class="secondary-nav-item-link secondary-nav-item-link--active" href="${window.location.href}">
                            Overview
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--tracks">
                        <a class="secondary-nav-item-link" href="${window.location.href}/+tracks">
                            Tracks
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--albums">
                        <a class="secondary-nav-item-link" href="${window.location.href}/+albums">
                            Albums
                            <span class="sr-only">(current section)</span>
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--images">
                        <a class="secondary-nav-item-link" href="${window.location.href}/+images">
                            Photos
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--similar">
                        <a class="secondary-nav-item-link" href="${window.location.href}/+similar">
                            Similar Artists
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--events">
                        <a class="secondary-nav-item-link" href="${window.location.href}/+events">
                            Events
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--wiki">
                        <a class="secondary-nav-item-link" href="${window.location.href}/+wiki">
                            Biography
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--tags">
                        <a class="secondary-nav-item-link" href="${window.location.href}/+tags">
                            Tags
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--shoutbox">
                        <a class="secondary-nav-item-link" href="${window.location.href}/+shoutbox">
                            Shouts
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--listeners">
                        <a class="secondary-nav-item-link" href="${window.location.href}/+listeners">
                            Listeners
                        </a>
                    </li>
                </ul>
            `);
        } else {
            // subpage
            col_main = document.body.querySelector('.col-main');
        }

        col_main.insertBefore(navlist, col_main.firstChild);
        col_sidebar.classList.add('artist-sidebar');

        if (!is_subpage) {
            let col_main_overview = document.body.querySelector('.col-main:not(.buffer-standard)');

            let artist_name = artist_header.querySelector('.header-new-title').innerHTML;

            let tags = document.body.querySelector('.catalogue-tags');

            let actions = artist_header.querySelector('.header-new-actions');

            let artist_metadata = artist_header.querySelectorAll('.header-metadata-tnew-display');
            let plays = artist_metadata[1].querySelector('abbr').textContent;
            let listeners = artist_metadata[0].querySelector('abbr').textContent;

            let header_bg_html = artist_header.querySelector('.header-new-background-image');
            let header_bg = '';
            if (header_bg_html != null)
                header_bg = header_bg_html.getAttribute('content');

            insert_top_nav(header_bg);


            // photos
            let gallery_sidebar_photos_ems = document.body.querySelectorAll('.sidebar-image-list-item');
            let gallery_sidebar_photos = [];
            for (let i = 1; i < 5; i++) {
                console.info('gallery', i, gallery_sidebar_photos_ems);
                if (gallery_sidebar_photos_ems[i] != null) {
                    gallery_sidebar_photos.push(gallery_sidebar_photos_ems[i].querySelector('a').outerHTML);
                } else {
                    gallery_sidebar_photos.push('');
                }
            }


            // chart position
            let chart_position = artist_header.querySelector('.header-new-chart-position-number');


            // panel
            let artist_main_panel = document.createElement('section');
            artist_main_panel.classList.add('artist-main-panel');
            artist_main_panel.innerHTML = (`
                <div class="top-cover">
                    <div class="artist-overview-cover-art">
                        <a class="cover-art" href="${col_main.querySelector('.secondary-nav-item--images a').getAttribute('href')}">
                            <img src="${header_bg.replace('i/u/ar0', 'i/u/500x500')}" loading="lazy">
                        </a>
                        ${gallery_sidebar_photos[0]}
                        ${gallery_sidebar_photos[1]}
                    </div>
                </div>
                <div class="middle-info">
                    <h3>Artist</h3>
                    <span class="top">
                        <h1>${artist_name}</h1>
                        ${(chart_position != null) ? `<h1>${chart_position.outerHTML}</h1>` : ''}
                    </span>
                </div>
                <div class="bottom-wiki">
                    ${get_wiki(col_main_overview)}
                    ${tags.outerHTML}
                    ${actions.outerHTML}
                </div>
            `);
            col_sidebar.insertBefore(artist_main_panel, col_sidebar.firstChild);


            // plays
            let my_avi = auth_link.querySelector('img').getAttribute('src');
            let scrobble_count_element = document.body.querySelector('.personal-stats-item--scrobbles .header-metadata-display a');
            let scrobble_count = 0;
            let scrobble_link = '';
            if (scrobble_count_element != undefined) {
                scrobble_count = scrobble_count_element.textContent;
                scrobble_link = scrobble_count_element.getAttribute('href');
            }

            // listeners you! know
            let listeners_you_know_element = document.body.querySelector('.personal-stats-item--listeners .header-metadata-display a');
            let listeners_count = 0;
            let listeners_link = '';
            if (listeners_you_know_element != undefined) {
                listeners_count = listeners_you_know_element.textContent;
                listeners_link = listeners_you_know_element.getAttribute('href');
            }

            let your_scrobbles = document.createElement('section');
            your_scrobbles.classList.add('artist-listeners-panel', 'artist-listeners-you-know-panel');
            your_scrobbles.innerHTML = (`
                <h2>Listeners</h2>
                <div class="listener-row">
                    <div class="you-side">
                        <h3><img src="${my_avi}"><a class="user" href="${auth_link}">You</a></h3>
                        <p><a class="scrobbles" href="${scrobble_link}">${scrobble_count}</a></p>
                    </div>
                    <div class="you-side">
                        <h3>Others you know</h3>
                        <p><a class="scrobbles" href="${listeners_link}">${listeners_count}</a></p>
                    </div>
                </div>
            `);
            artist_main_panel.after(your_scrobbles);


            // listeners
            let listener_trend = col_sidebar.querySelector('.listener-trend');

            let artist_listeners_panel = document.createElement('section');
            artist_listeners_panel.classList.add('artist-listeners-panel');
            artist_listeners_panel.innerHTML = (`
                <div class="listener-row">
                    <div class="listener-side">
                        <h3>Listeners</h3>
                        <p>${listeners}</p>
                    </div>
                    <div class="scrobbler-side">
                        <h3>Scrobbles</h3>
                        <p>${plays}</p>
                    </div>
                </div>
                <div class="listener-trend-row">
                    ${(listener_trend != null) ? listener_trend.outerHTML : 'There\'s no listener trend yet, check back later.'}
                </div>
            `);
            your_scrobbles.after(artist_listeners_panel);
        } else {

            let artist_name = artist_header.querySelector('.header-new-title').innerHTML;

            let header_bg_html = artist_header.querySelector('.header-new-background-image');
            let header_bg = '';
            if (header_bg_html != null)
                header_bg = header_bg_html.getAttribute('content');

            insert_top_nav(header_bg);


            // panel
            let artist_main_panel = document.createElement('section');
            artist_main_panel.classList.add('artist-main-panel');
            artist_main_panel.innerHTML = (`
                <div class="top-cover">
                    <div class="item-has-metadata artwork-and-metadata-row buffer-standard buffer-reset@sm">
                        <div class="album-overview-cover-art js-focus-controls-container">
                            <a class="cover-art" href="${col_main.querySelector('.secondary-nav-item--images a').getAttribute('href')}">
                                <img src="${header_bg.replace('i/u/ar0', 'i/u/500x500')}" loading="lazy">
                            </a>
                        </div>
                    </div>
                </div>
                <div class="middle-info">
                    <h3>Artist</h3>
                    <h1>${artist_name}</h1>
                </div>
            `);
            col_sidebar.insertBefore(artist_main_panel, col_sidebar.firstChild);
        }

        artist_header.innerHTML = '';
    }

    // track pages
    function bleh_track_pages() {
        let track_header = document.body.querySelector('.header-new--track');

        if (track_header == undefined)
            return;

        if (track_header.hasAttribute('data-bleh'))
            return;
        track_header.setAttribute('data-bleh', 'true');

        let is_subpage = track_header.classList.contains('header-new--subpage');

        let row = document.body.querySelector('.row');
        let col_main = document.body.querySelector('.col-main:not([class*="buffer-reset"])');
        let col_sidebar = document.body.querySelector('.col-sidebar:not(.track-overview-video-column)');

        let navlist = track_header.querySelector('.navlist');
        if (!is_subpage) {
            navlist = document.createElement('nav');
            navlist.classList.add('navlist', 'secondary-nav', 'navlist--more');
            navlist.setAttribute('aria-label', 'Secondary navigation');
            navlist.setAttribute('data-require', 'components/collapsing-nav-v2');

            navlist.innerHTML = (`
                <ul class="navlist-items js-navlist-items" style="position: relative;">
                    <li class="navlist-item secondary-nav-item secondary-nav-item--overview">
                        <a class="secondary-nav-item-link secondary-nav-item-link--active" href="${window.location.href}">
                            Overview
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--albums">
                        <a class="secondary-nav-item-link" href="${window.location.href}/+albums">
                            Albums
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--wiki">
                        <a class="secondary-nav-item-link" href="${window.location.href}/+wiki">
                            Wiki
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--tags">
                        <a class="secondary-nav-item-link" href="${window.location.href}/+tags">
                            Tags
                        </a>
                    </li>
                    <li class="navlist-item secondary-nav-item secondary-nav-item--shoutbox">
                        <a class="secondary-nav-item-link" href="${window.location.href}/+shoutbox">
                            Shouts
                        </a>
                    </li>
                </ul>
            `);
        }

        col_main.insertBefore(navlist, col_main.firstChild);
        col_sidebar.classList.add('track-sidebar');

        if (!is_subpage) {
            let col_main_overview = document.body.querySelector('.col-main[class*="buffer-reset"]');

            let track_artwork_element = document.body.querySelector('.source-album-art img');
            let track_artwork = '';
            if (track_artwork_element != undefined)
                track_artwork = track_artwork_element.getAttribute('src');

            let track_name = track_header.querySelector('.header-new-title').innerHTML;
            let track_artist = track_header.querySelector('.header-new-crumb span').innerHTML;
            let track_artist_link = track_header.querySelector('.header-new-crumb').getAttribute('href');

            let tags = document.body.querySelector('.catalogue-tags');

            let actions = track_header.querySelector('.header-new-actions');

            let track_metadata = track_header.querySelectorAll('.header-metadata-tnew-display');
            let plays = track_metadata[1].querySelector('abbr').textContent;
            let listeners = track_metadata[0].querySelector('abbr').textContent;

            let header_bg_html = track_header.querySelector('.header-new-background-image');
            let header_bg = '';
            if (header_bg_html != null)
                header_bg = header_bg_html.getAttribute('content');

            insert_top_nav(header_bg);


            // panel
            let track_main_panel = document.createElement('section');
            track_main_panel.classList.add('track-main-panel');
            track_main_panel.innerHTML = (`
                <div class="top-cover">
                    <div class="item-has-metadata artwork-and-metadata-row buffer-standard buffer-reset@sm">
                        <div class="album-overview-cover-art js-focus-controls-container">
                            <a class="cover-art">
                                <img src="${track_artwork.replace('i/u/300x300', 'i/u/500x500')}" loading="lazy">
                            </a>
                        </div>
                    </div>
                </div>
                <div class="middle-info">
                    <h3>Track</h3>
                    <h1>${track_name}</h1>
                    <h2><a href="${track_artist_link}">${track_artist}</a></h2>
                </div>
                <div class="bottom-wiki">
                    ${get_wiki(col_main_overview)}
                    ${tags.outerHTML}
                    ${actions.outerHTML}
                </div>
            `);
            col_sidebar.insertBefore(track_main_panel, col_sidebar.firstChild);


            // plays
            let my_avi = auth_link.querySelector('img').getAttribute('src');
            let scrobble_count_element = document.body.querySelector('.personal-stats-item--scrobbles .header-metadata-display a');
            let scrobble_count = 0;
            let scrobble_link = '';
            if (scrobble_count_element != undefined) {
                scrobble_count = scrobble_count_element.textContent;
                scrobble_link = scrobble_count_element.getAttribute('href');
            }

            let your_scrobbles = document.createElement('section');
            your_scrobbles.classList.add('track-listeners-panel', 'track-listeners-you-know-panel');
            your_scrobbles.innerHTML = (`
                <h2>Listeners</h2>
                <div class="listener-row">
                    <div class="you-side">
                        <h3><img src="${my_avi}"><a class="user" href="${auth_link}">You</a></h3>
                        <p><a class="scrobbles" href="${scrobble_link}">${scrobble_count}</a></p>
                    </div>
                </div>
            `);
            track_main_panel.after(your_scrobbles);


            // listeners
            let listener_trend = col_sidebar.querySelector('.listener-trend');

            let track_listeners_panel = document.createElement('section');
            track_listeners_panel.classList.add('track-listeners-panel');
            track_listeners_panel.innerHTML = (`
                <div class="listener-row">
                    <div class="listener-side">
                        <h3>Listeners</h3>
                        <p>${listeners}</p>
                    </div>
                    <div class="scrobbler-side">
                        <h3>Scrobbles</h3>
                        <p>${plays}</p>
                    </div>
                </div>
                <div class="listener-trend-row">
                    ${(listener_trend != null) ? listener_trend.outerHTML : 'There\'s no listener trend yet, check back later.'}
                </div>
            `);
            your_scrobbles.after(track_listeners_panel);


            // video
            let lyrics_em = document.body.querySelector('.lyrics-snippet-more-link a');
            let lyrics = 'hmm.. we don\'t know the lyrics yet';
            if (lyrics_em != null)
                lyrics = lyrics_em.textContent;

            let track_video = document.body.querySelector('.video-preview');
            if (track_video != null) {
                let track_video_panel = document.createElement('section');
                track_video_panel.classList.add('track-video-panel');
                track_video_panel.innerHTML = (`
                    <div class="video-inner">
                        ${document.body.querySelector('.video-preview').outerHTML}
                    </div>
                    <div class="actions-side">
                        <div class="lyric-panel">
                            <h2>Lyrics</h2>
                            <div class="lyrics-blurb">
                                ${lyrics}
                            </div>
                            <div class="actions-2">
                                <a class="btn btn--has-icon btn--has-icon-right search-lyrics search-lyrics-w-musixmatch" href="${window.location.href}/+lyrics">
                                    Musixmatch
                                </a>
                                <a class="btn btn--has-icon btn--has-icon-right search-lyrics search-lyrics-w-genius" href="" target="_blank">
                                    Genius
                                </a>
                            </div>
                        </div>
                    </div>
                `);
                navlist.after(track_video_panel);
            }
        } else {
            let track_name = track_header.querySelector('.header-new-title').innerHTML;
            let track_artist = track_header.querySelector('.header-new-crumb span').innerHTML;
            let track_artist_link = track_header.querySelector('.header-new-crumb').getAttribute('href');

            let header_bg_html = track_header.querySelector('.header-new-background-image');
            let header_bg = '';
            if (header_bg_html != null)
                header_bg = header_bg_html.getAttribute('content');

            insert_top_nav(header_bg);


            // panel
            let track_main_panel = document.createElement('section');
            track_main_panel.classList.add('track-main-panel');
            track_main_panel.innerHTML = (`
                <div class="top-cover">
                    <div class="item-has-metadata artwork-and-metadata-row buffer-standard buffer-reset@sm">
                        <div class="album-overview-cover-art js-focus-controls-container">
                            <a class="cover-art">
                                <img src="" loading="lazy">
                            </a>
                        </div>
                    </div>
                </div>
                <div class="middle-info">
                    <h3>Track</h3>
                    <h1>${track_name}</h1>
                    <h2><a href="${track_artist_link}">${track_artist}</a></h2>
                </div>
            `);
            col_sidebar.insertBefore(track_main_panel, col_sidebar.firstChild);
        }

        track_header.innerHTML = '';
    }

    // profile pages
    function bleh_profile_pages() {
        let profile_header = document.body.querySelector('.header--user');

        if (profile_header == undefined)
            return;

        patch_profile_following();

        if (profile_header.hasAttribute('data-bleh'))
            return;
        profile_header.setAttribute('data-bleh', 'true');

        let is_subpage = !profile_header.classList.contains('header--overview');

        let row = document.body.querySelector('.row:not(._buffer)');
        let col_main = document.body.querySelector('.col-main');
        let col_sidebar = document.body.querySelector('.col-sidebar');


        let header_bg_html = profile_header.querySelector('.header-background');
        let header_bg = '';
        if (header_bg_html != null && header_bg_html.hasAttribute('style'))
            header_bg = header_bg_html.getAttribute('style').replace('background-image: url(', '').replace(');', '');

        insert_top_nav(header_bg);


        let navlist = profile_header.querySelector('.navlist');

        if (col_main == null) {
            let row = document.createElement('div');
            row.classList.add('row');

            col_main = document.createElement('div');
            col_main.classList.add('col-main');

            col_sidebar = document.createElement('div');
            col_sidebar.classList.add('col-sidebar');

            row.appendChild(col_main);
            row.appendChild(col_sidebar);

            let page_content = document.body.querySelector('.container.page-content');

            page_content.insertBefore(row, page_content.firstChild);
        }

        col_main.insertBefore(navlist, col_main.firstChild);
        col_sidebar.classList.add('profile-sidebar');


        // global
        let profile_avatar = profile_header.querySelector('.avatar img');

        let profile_name = profile_header.querySelector('.header-title a').textContent;
        let profile_link = profile_header.querySelector('.header-title a').getAttribute('href');

        let is_self = (auth == profile_name);


        // badges
        let badges = [];
        if (profile_header.querySelector('.user-status-subscriber') != null)
            badges.push({
                type: 'subscriber',
                name: 'Subscriber'
            });

        // custom
        if (profile_badges.hasOwnProperty(profile_name)) {
            if (!Array.isArray(profile_badges[profile_name])) {
                // 1 badge
                badges.push(profile_badges[profile_name]);
            } else {
                // multiple
                profile_badges[profile_name].forEach((badge) => {
                    badges.push(badge);
                });
            }
        }
        badges.forEach((badge) => deliver_notif(`${profile_name} has badge ${badge.name}`));


        if (!is_subpage) {
            let profile_subtitle = profile_header.querySelector('.header-title-display-name').textContent;

            let scrobbling_since = profile_header.querySelector('.header-scrobble-since').textContent;

            let header_metadata = profile_header.querySelectorAll('.header-metadata-display p');
            let stat_scrobbles = header_metadata[0].textContent;
            let stat_artists = header_metadata[1].querySelector('a').textContent;
            let stat_loved_tracks = (header_metadata[2] != undefined) ? header_metadata[2].querySelector('a') : placeholder_loved_tracks();


            let profile_bio_raw = col_sidebar.querySelector('.about-me-sidebar p');
            let profile_bio_parsed = 'very mysterious . . .';
            let profile_is_empty = true;
            if (profile_bio_raw != null) {
                profile_is_empty = false;

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
                profile_bio_parsed = converter.makeHtml(profile_bio_raw.textContent
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
            }



            let follow_button_wrap = profile_header.querySelector('[data-toggle-button=""]');
            let msg_button = profile_header.querySelector('.header-message-user');

            let compat = profile_header.querySelector('.tasteometer');
            let compat_avi = profile_header.querySelector('.tasteometer-viz');
            let compat_lvl = profile_header.querySelector('.tasteometer-compat-description .tasteometer-compat-colour');
            let compat_artists = profile_header.querySelector('.tasteometer-shared-artists');
            if (compat_artists == null) {
                compat_artists = document.createElement('div');
                compat_artists.textContent = 'You have no artists in common :(';
            }

            deliver_notif(`on profile overview`);


            // pronouns?
            let pronouns = false;
            let display_name_no_spaces = profile_subtitle.replaceAll(' ','');
            if (
                display_name_no_spaces.startsWith('she/') ||
                display_name_no_spaces.startsWith('he/') ||
                display_name_no_spaces.startsWith('they/') ||
                display_name_no_spaces.startsWith('it/')
            ) pronouns = true;


            let profile_header_panel = document.createElement('section');
            profile_header_panel.classList.add('profile-header-panel');
            profile_header_panel.innerHTML = (`
                <div class="top-cover">
                    <div class="avatar-container">
                        ${profile_avatar.outerHTML}
                    </div>
                </div>
                <div class="middle-info">
                    <h3>User</h3>
                    <span class="top">
                        <h1>${profile_name}</h1>
                        <div class="user-badges" id="user-badges"></div>
                    </span>
                    <h4 class="subtitle"><div class="title">${(pronouns) ? 'pronouns' : 'aka.'}</div>${profile_subtitle}</h4>
                </div>
                <div class="bottom-wiki">
                    <div class="profile-bio ${(profile_is_empty) ? 'profile-bio-empty' : ''}">
                        ${profile_bio_parsed}
                    </div>
                    <div class="actions">
                        ${(msg_button != null) ? msg_button.outerHTML : ''}
                        ${(follow_button_wrap != null) ? follow_button_wrap.outerHTML : ''}
                        ${(is_self) ? `<a class="btn btn--has-icon btn--has-icon-left edit-profile-button" href="${root}settings">Edit profile</a>` : ''}
                    </div>
                </div>
            `);
            col_sidebar.insertBefore(profile_header_panel, col_sidebar.firstChild);

            // listens
            let listening_trend = col_sidebar.querySelector('.your-progress-component');


            let scrobbles_calculated = calculate_scrobbles(stat_scrobbles);


            let profile_listens_panel = document.createElement('section');
            profile_listens_panel.classList.add('profile-listens-panel');
            profile_listens_panel.innerHTML = (`
                <div class="scrobble-row">
                    <!--<div class="big-bar" id="scrobble-bar">
                        <div class="fill" style="width: ${scrobbles_calculated.percent}%"></div>
                        <div class="text">${stat_scrobbles} <div class="sub">scrobbles</div></div>
                    </div>-->
                    <div class="progress-bar" id="scrobble-bar">
                        <div class="fill" data-percent="${scrobbles_calculated.percent}" style="width: ${scrobbles_calculated.percent}%"></div>
                    </div>
                </div>
                <div class="listener-row">
                    <div class="scrobbles-side">
                        <h3>Scrobbles</h3>
                        <p><a href="${window.location.href}/library">${stat_scrobbles}</a></p>
                    </div>
                    <div class="artists-side">
                        <h3>Artists</h3>
                        <p><a href="${window.location.href}/library/artists?format=grid">${stat_artists}</a></p>
                    </div>
                    <!--<div class="since-side">
                        <h3>Since</h3>
                        <p>${scrobbling_since.replace('• scrobbling since ', '')}</p>
                    </div>-->
                </div>
                <div class="${(listening_trend != null ? 'listener-trend-row' : 'compat-row')}">
                    ${(listening_trend != null) ? listening_trend.outerHTML : create_compat(compat, compat_avi, compat_lvl.outerHTML, compat_artists.outerHTML, profile_avatar.outerHTML)}
                </div>
            `);
            profile_header_panel.after(profile_listens_panel);

            tippy(document.getElementById('scrobble-bar'), {
                content: `${Math.round(scrobbles_calculated.percent)}% to the next goal`
            })

            let compat_fill = document.getElementById('compat-fill');
            if (compat_fill != null) {
                tippy(compat_fill, {
                    content: `Musical compatibility score of ${compat_fill.getAttribute('data-percent')}`
                })
            }

            // note
            let profile_notes = JSON.parse(localStorage.getItem('bleh_profile_notes')) || {};
            let profile_note = profile_notes[profile_name];

            let profile_has_note = false;
            if (profile_note != undefined)
                profile_has_note = true;

            let profile_note_panel = document.createElement('section');
            profile_note_panel.classList.add('profile-note-panel');
            profile_note_panel.innerHTML = (`
                <div class="middle-info">
                    <h1>${trans[lang].settings.profiles.notes.header}</h1>
                    <div class="content-form">
                        ${(profile_has_note)
                        ? `<textarea id="bleh--profile-note" placeholder="${trans[lang].settings.profiles.notes.placeholder}">${JSON.parse(localStorage.getItem('bleh_profile_notes'))[profile_name]}</textarea>`
                        : `<textarea id="bleh--profile-note" placeholder="${trans[lang].settings.profiles.notes.placeholder}"></textarea>`
                        }
                    </div>
                </div>
                <div class="bottom-wiki">
                    <div class="actions">
                        <button class="btn" onclick="_clear_profile_note('${profile_name}')">${trans[lang].settings.clear}</button>
                        <button class="btn primary" onclick="_save_profile_note('${profile_name}')">${trans[lang].settings.save}</button>
                    </div>
                </div>
            `);
            profile_listens_panel.after(profile_note_panel);
        } else {
            let profile_header_panel = document.createElement('section');
            profile_header_panel.classList.add('profile-header-panel');
            profile_header_panel.innerHTML = (`
                <div class="top-cover">
                    <div class="avatar-container">
                        ${profile_avatar.outerHTML}
                    </div>
                </div>
                <div class="middle-info">
                    <h3>User</h3>
                    <span class="top">
                        <h1>${profile_name}</h1>
                        <div class="user-badges" id="user-badges"></div>
                    </span>
                </div>
            `);
            col_sidebar.insertBefore(profile_header_panel, col_sidebar.firstChild);


            // which subpage is it?
            let subpage_type = document.body.classList[1].replace('namespace--', '');
            deliver_notif(`on profile subpage ${subpage_type}`);

            if (subpage_type == 'user_obsessions_overview') {
                // obsessions history
                let obsession_history = document.body.querySelector('.obsession-history');
                let pagination = document.body.querySelector('.pagination');

                let obsession_container = document.createElement('section');
                obsession_container.classList.add('obsession-history-panel');
                obsession_container.appendChild(obsession_history);
                obsession_container.appendChild(pagination);

                col_main.appendChild(obsession_container);

                //

                let section_controls = document.body.querySelector('.section-controls');
                let section_title = section_controls.querySelector('.content-top-header').textContent;
                let play_all_btn = section_controls.querySelector('.obsession-history-play-all');
                let set_obsession_btn = section_controls.querySelector('.btn-primary');

                let sidebar_information_panel = document.createElement('section');
                sidebar_information_panel.classList.add('sidebar-information-panel', 'obsession-information-panel');
                sidebar_information_panel.innerHTML = (`
                    <div class="middle-info">
                        <h1>${section_title}</h1>
                    </div>
                    <div class="bottom-wiki">
                        <div class="actions">
                            ${(play_all_btn != null) ? play_all_btn.outerHTML : ''}
                            ${(set_obsession_btn != null) ? set_obsession_btn.outerHTML : ''}
                        </div>
                    </div>
                `);
                col_sidebar.appendChild(sidebar_information_panel);
            } else if (subpage_type == 'user_library_overview') {
                // let's grab the library navlist
                let library_controls = document.body.querySelector('.content-top .library-controls');
                let library_search = document.body.querySelector('.content-top .search-form');

                let library_control_header = document.createElement('div');
                library_control_header.classList.add('library-controls-header');
                library_control_header.innerHTML = (`
                    ${library_controls.outerHTML}
                    ${library_search.outerHTML}
                `);
                navlist.after(library_control_header);
            } else if (subpage_type == 'user_library_artists') {
                // let's grab the library navlist
                let library_controls = document.body.querySelector('.content-top .library-controls');
                let library_search = document.body.querySelector('.content-top .search-form');

                let library_control_header = document.createElement('div');
                library_control_header.classList.add('library-controls-header');
                library_control_header.innerHTML = (`
                    ${library_controls.outerHTML}
                    ${library_search.outerHTML}
                `);
                navlist.after(library_control_header);
            } else if (subpage_type == 'user_library_albums') {
                // let's grab the library navlist
                let library_controls = document.body.querySelector('.content-top .library-controls');
                let library_search = document.body.querySelector('.content-top .search-form');

                let library_control_header = document.createElement('div');
                library_control_header.classList.add('library-controls-header');
                library_control_header.innerHTML = (`
                    ${library_controls.outerHTML}
                    ${library_search.outerHTML}
                `);
                navlist.after(library_control_header);
            } else if (subpage_type == 'user_library_tracks') {
                // let's grab the library navlist
                let library_controls = document.body.querySelector('.content-top .library-controls');
                let library_search = document.body.querySelector('.content-top .search-form');

                let library_control_header = document.createElement('div');
                library_control_header.classList.add('library-controls-header');
                library_control_header.innerHTML = (`
                    ${library_controls.outerHTML}
                    ${library_search.outerHTML}
                `);
                navlist.after(library_control_header);
            }
        }

        // badges
        display_badges(badges, profile_name);
    }

    function display_badges(badges, profile_name) {
        badges.forEach((badge_data) => {
            let badge = document.createElement('button');
            badge.classList.add('user-badge', `user-badge--${badge_data.type}`, `user-badge--user-${profile_name}`);
            badge.setAttribute('onclick', `_display_badge_prompt('${badge_data.type}', "${badge_data.name}")`);

            tippy(badge, {
                content: badge_data.name
            });

            document.getElementById('user-badges').appendChild(badge);
        });
    }

    unsafeWindow._display_badge_prompt = function(type, name) {
        display_badge_prompt(type, name);
    }
    function display_badge_prompt(type, name) {
        deliver_notif(name, false, true, `user-badge--${type}`);
    }

    function placeholder_loved_tracks() {
        let placeholder = document.createElement('a');
        placeholder.setAttribute('href', '');
        placeholder.textContent = '0';

        return placeholder;
    }

    function create_compat(compat_element, avi, lvl, artists, profile_avi) {
        let percent = avi.getAttribute('title');
        let my_avi = auth_link.querySelector('img').getAttribute('src').replace('avatar42s', 'avatar170s');

        let raw_lvl = compat_element.classList[1].replace('tasteometer-compat-', '');


        // last.fm for some reason caps at 99%, which is annoying
        if (percent == '99%') percent = '100%';


        let compat = (`
            <div class="top">
                <div class="progress-bar lvl-${raw_lvl}">
                    <div class="fill" id="compat-fill" data-percent="${percent}" style="width: ${percent}"></div>
                </div>
            </div>
            <div class="bottom">
                <div class="avatar-side lvl-${raw_lvl}">
                    <div class="avatar-with-ring">
                        ${profile_avi}
                    </div>
                    <div class="avatar-with-ring secondary">
                        <img src="${my_avi}" alt="Your avatar">
                    </div>
                </div>
                <div class="info-side lvl-${raw_lvl}">
                    <div class="level">You share ${lvl} compatibility</div>
                    <div class="shared">${artists}</div>
                </div>
            </div>
        `);
        return compat;
    }


    function get_wiki(col_main) {
        if (col_main != null) {
            let wiki = col_main.querySelector('.wiki-block.visible-lg');
            if (wiki == null)
                wiki = col_main.querySelector('.wiki-block-cta');

            return wiki.outerHTML;
        } else {
            return document.body.querySelector('.coloured-cta--wiki-icon').outerHTML;
        }
    }

    function create_header_bg(header_bg) {
        let previous_background = document.getElementById('backing-bg');
        if (previous_background == null) {
            let background = document.createElement('div');
            background.classList.add('backing-bg');
            background.setAttribute('id', 'backing-bg');
            background.style.setProperty('background-image', `url(${header_bg})`);

            console.info('bg', header_bg, background);

            document.body.appendChild(background);
        } else {
            previous_background.style.setProperty('background-image', `url(${header_bg})`);
        }
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


    function insert_top_nav(header_bg) {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

        if (settings.feature_flags.experimental_top_nav) {
            let top_nav = document.getElementById('top-nav');
            let container = document.body.querySelector('.adaptive-skin-container');

            if (top_nav == null) {
                top_nav = document.createElement('section');
                top_nav.classList.add('top-nav');
                top_nav.setAttribute('id', 'top-nav');
                container.insertBefore(top_nav, container.firstChild);
            }

            top_nav.innerHTML = (`
                <div class="backing-bg" id="backing-bg" style="background-image: url(${header_bg})"></div>
                <div class="top-nav-inner">
                    profiles
                </div>
            `);
        } else {
            create_header_bg(header_bg);
        }
    }

    function calculate_scrobbles(count_original) {
        let count = parseInt(count_original.replaceAll(',', ''));
        let percent = 0;

        if (count <= 100_300) {
            percent = (count / 100_000) * 100;
        } else if (count <= 200_300) {
            count = count - 100_300;
            percent = (count / 100_000) * 100;
        } else if (count <= 300_300) {
            count = count - 200_300;
            percent = (count / 100_000) * 100;
        } else if (count <= 400_300) {
            count = count - 300_300;
            percent = (count / 100_000) * 100;
        }

        return {
            count: count,
            percent: percent
        }
    }


    function load_skus(settings) {
        for (let flag in version.feature_flags) {
            let current_state = version.feature_flags[flag].default;
            if (settings.feature_flags[flag] != undefined) current_state = settings.feature_flags[flag];

            document.documentElement.setAttribute(`data-ff--${flag}`, current_state);
        }
    }

    function bleh_sku_page() {
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();
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
        let settings = JSON.parse(localStorage.getItem('bleh')) || create_settings_template();

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

    unsafeWindow._force_refresh_theme = function() {
        localStorage.removeItem('bleh_cached_style');
        localStorage.removeItem('bleh_cached_style_timeout');
    }
})();