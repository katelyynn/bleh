//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { handle_error_500 } from '../page';
import { log } from './log';
import { auth, auth_link, setRoot } from './page';
import { clamp_lit, clamp_sat, rgb_to_hsl } from './tools';
import ColorThief from 'color-thief-browser';
import { Settings } from 'luxon';

// loads your selected language in last.fm
export let lang = 'en';
export let lang_browser = 'en';
// hello my name is stel :3
export let lang_info = {
    en: {
        name: 'English',
        by: ['clairedoll'],
        last_updated: 'latest'
    },
    de: {
        name: 'Deutsch',
        by: ['evangelicgirl', 'myraisounds', 'clairedoll'],
        last_updated: '2025-10-01'
    },
    es: {
        name: 'Español',
        by: ['soleilth'],
        last_updated: '2025-11-13'
    },
    pl: {
        name: 'Polski',
        by: ['iwas15with100k'],
        last_updated: '2024-06-17'
    },
    pt: {
        name: 'Português',
        by: ['ArthRMH', 'auwora', 'fr0r', 'urwq'],
        last_updated: '2025-11-13'
    },
    sv: {
        name: 'Svenska',
        by: ['Lrexie'],
        last_updated: '2025-11-05'
    },
    ru: {
        name: 'Русский',
        by: ['crawqxx'],
        last_updated: '2025-11-05'
    }
};

export const trans = {
    page_templates: {
        // these are used for browser tab titles
        // {page} is something like "Home" or "Profile"
        // {name} and {sister} is something like a profile name
        // {brand} is bleh
        // {build} and {sku} are version numbers
        type: {
            en: '{page} on {brand} {build}.{sku}',
            de: '{page} auf {brand} {build}.{sku}',
            es: '{page} en {brand} {build}.{sku}',
            pt: '{page} no {brand} {build}.{sku}',
            sv: '{page} på {brand} {build}.{sku}',
            ru: '{page} в {brand} {build}.{sku}'
        },
        name_type: {
            en: '{name} - {page} on {brand} {build}.{sku}',
            de: '{name} - {page} auf {brand} {build}.{sku}',
            es: '{name} - {page} en {brand} {build}.{sku}',
            pt: '{name} - {page} no {brand} {build}.{sku}',
            sv: '{name} - {page} på {brand} {build}.{sku}',
            ru: '{name} - {page} в {brand} {build}.{sku}'
        },
        name_sister_type: {
            en: '{name} by {sister} - {page} on {brand} {build}.{sku}',
            de: '{name} von {sister} - {page} auf {brand} {build}.{sku}',
            de: '{name} por {sister} - {page} en {brand} {build}.{sku}',
            pt: '{name} por {sister} - {page} no {brand} {build}.{sku}',
            sv: '{name} av {sister} - {page} på {brand} {build}.{sku}',
            ru: '{name} от {sister} - {page} в {brand} {build}.{sku}'
        }
    },
    badges: {
        missing: {
            name: {
                en: 'No badges',
                de: 'Keine Abzeichen',
                es: 'Sin emblemas',
                pt: 'Sem emblemas',
                sv: 'Inga emblem',
                ru: 'Нету значка'
            },
            reason: {
                en: 'Become a sponsor to get a badge!',
                de: 'Werde Sponsor, um ein Abzeichen zu erhalten!',
                es: '¡Sé un patrocinador y consigue un emblema!',
                pt: 'Se torne um apoiador para ganhar um emblema!',
                sv: 'Bli en sponsor för att få ett emblem!',
                ru: 'Стань спонсором для получения значка!'
            }
        },
        'user-status-subscriber': {
            name: {
                en: 'Last.fm Pro',
                de: 'Last.fm Pro',
                es: 'Last.fm Pro',
                pt: 'Last.fm Pro',
                sv: 'Last.fm Pro',
                ru: 'Last.fm Про'
            },
            reason: {
                en: 'Active Pro subscription',
                de: 'Aktives Pro-Abonnement',
                es: 'Suscripción Pro activa',
                pt: 'Plano Pro ativo',
                sv: 'Aktiv Pro prenumeration',
                ru: 'Активна Про подписка'
            }
        },
        'user-status-staff': {
            name: {
                en: 'Staff',
                de: 'Mitarbeiter',
                es: 'Personal',
                pt: 'Equipe',
                sv: 'Personal',
                ru: 'Администраторы'
            },
            reason: {
                en: 'Official member of Last.fm',
                de: 'Ofizielles Mitglied von Last.fm',
                es: 'Miembro oficial de Last.fm',
                pt: 'Membro oficial da Last.fm',
                sv: 'Officiell medlem på Last.fm',
                ru: 'Оффициальный участник Last.fm'
            }
        },
        'user-status-mod': {
            name: {
                en: 'Mod',
                de: 'Moderator',
                es: 'Moderador',
                pt: 'Moderador(a)',
                sv: 'Moderator',
                ru: 'Модератор'
            },
            reason: {
                en: 'Official member of Last.fm',
                de: 'Ofizielles Mitglied von Last.fm',
                es: 'Miembro oficial de Last.fm',
                pt: 'Membro oficial do Last.fm',
                sv: 'Officiell medlem på Last.fm',
                ru: 'Оффициальный участник Last.fm'
            }
        },
        'user-status-alum': {
            name: {
                en: 'Alum',
                es: 'Graduado',
                sv: 'Alumn',
                ru: 'Выпускник'
            },
            reason: {
                en: 'Former member of Last.fm',
                de: 'Ehemaliger Mitarbeiter von Last.fm',
                es: 'Antiguo miembro de Last.fm',
                sv: 'Före-detta medlem på Last.fm',
                ru: 'Бывший участник Last.fm',
                pt: 'Ex-membro da equipe do Last.fm'
            }
        },
        'label--fade': {
            reason: {
                en: 'They follow you!',
                de: 'Diese Person folgt dir!',
                es: '¡Te sigue!',
                pt: 'Ele(a) te segue!',
                sv: 'Denna medlem följer dig!',
                ru: 'Они на вас подписаны!'
            }
        },
        contributor: {
            name: {
                en: 'Contributor',
                de: 'Mitwirkender',
                es: 'Contribuidor',
                pt: 'Contribuidor(a)',
                sv: 'Bidragsgivare',
                ru: 'Участник'
            },
            reason: {
                en: 'Has worked on bleh or bwaa',
                de: 'Hat an bleh oder bwaa gearbeitet',
                es: 'Ha contribuido a bleh o bwaa',
                pt: 'Contribuiu para o bleh ou bwaa',
                sv: 'Har arbetat på bleh eller bwaa',
                ru: 'Помогал разработке bleh или bwaa'
            }
        },
        translation: {
            name: {
                en: 'Translations',
                de: 'Übersetzungen',
                es: 'Traducciones',
                pt: 'Traduções',
                sv: 'Översättningar',
                ru: 'Переводы'
            }
        },
        cat: {
            name: {
                en: 'it’s a kitty!!',
                de: 'ein Kätzchen!!!',
                es: '¡¡es un gatito!!',
                pt: 'é um(a) gatinho(a)!!',
                sv: 'en kissekatt!!',
                ru: 'это котикк!!!'
            }
        },
        sponsor: {
            name: {
                en: 'Sponsor',
                de: 'Sponsor',
                es: 'Patrocinador',
                pt: 'Apoiador(a)',
                sv: 'Sponsor',
                ru: 'Спонсор'
            },
            reason: {
                en: 'thank you from kate <3',
                de: 'danke von kate <3',
                es: 'Gracias de parte de kate <3',
                pt: 'obrigadão da kate <3',
                sv: 'tack ifrån kate <3',
                ru: 'спасибо от кейт <3'
            }
        },
        cute: {
            reason: {
                en: 'Reserved',
                de: 'Exklusiv',
                es: 'Reservado',
                pt: 'Reservado',
                sv: 'Exklusiv',
                ru: 'Зарезервированный'
            }
        },
        reserved: {
            reason: {
                en: 'Reserved',
                de: 'Exklusiv',
                es: 'Reservado',
                pt: 'Reservado',
                sv: 'Exklusiv',
                ru: 'Зарезервированный'
            }
        },
        plaster: {
            name: {
                en: 'band-aid',
                de: 'pflaster',
                es: 'curita',
                sv: 'låster',
                ru: 'пластырь',
                pt: 'atadura'
            },
            reason: {
                en: 'the sillyness caught up to me',
                de: 'der unfug hat mich eingeholt',
                es: 'la tontera me alcanzó',
                sv: 'det roliga kom ikapp mig',
                ru: 'милота на меня напала',
                pt: 'a bobeira me alcançou'
            }
        },
        'bubble-tea': {
            name: {
                en: 'escoffier :3',
                es: 'escoffier :3',
                sv: 'escoffier :3',
                ru: 'ескоффьер :3'
            },
            reason: {
                en: 'katelyn’s wife ~',
                es: 'esposa de katelyn ~',
                sv: 'katelyn’s fru ~',
                ru: 'жена кейтлин ~'
            }
        }
    },
    requires_higher_bleh_version: {
        en: 'Requires higher bleh version',
        de: 'Erfordert eine neuere bleh-Version',
        es: 'Requiere una versión más reciente de bleh',
        pt: 'Requer a versão mais recente do bleh',
        sv: 'Behöver en nyare version av bleh',
        ru: 'Требуется обновленная версия bleh'
    },
    home: {
        en: 'Home',
        de: 'Startseite',
        es: 'Inicio',
        pt: 'Início',
        sv: 'Startsida',
        ru: 'Дом'
    },
    library: {
        en: 'Library',
        de: 'Bibliothek',
        es: 'Colección',
        ja: 'ライブラリ',
        pt: 'Biblioteca',
        sv: 'Bibliotek',
        ru: 'Библиотека'
    },
    playlists: {
        en: 'Playlists',
        de: 'Playlists',
        es: 'Playlists',
        sv: 'Spellistor',
        ru: 'Плейлисты',
        pt: 'Playlists'
    },
    shouts: {
        en: 'Shouts',
        de: 'Shouts',
        es: 'Notas',
        pt: 'Mensagens',
        ja: 'シャウト',
        sv: 'Hojtningar',
        ru: 'Отзывы', // i'm not really sure with this one, it's like either comments or shouts, but trnaslated directly as "shouts", but "comments" could be mroe cleare here -- craw
    },
    send_quickly_with: {
        // send a shout quickly with (keyboard shortcut)
        en: 'Send quickly with {kbd}',
        de: 'Schnell senden mit {kbd}',
        es: 'Publica rápidamente con {kbd}',
        pt: 'Enviar rapidamente com {kbd}',
        sv: 'Skicka snabbt med {kbd}',
        ru: 'Быстрая отправка по {kbd}'
    },
    cant_shout: {
        en: 'You cannot leave shouts here',
        de: 'Du kannst hier keine Shouts hinterlassen',
        es: 'No puedes poner notas aquí',
        sv: 'Du kan inte hojta här',
        ru: 'Вы не можете оставлять тут отзывы',
        pt: 'Você não pode deixar comentários aqui'
    },
    failed_to_send: {
        en: 'Failed to send',
        de: 'Senden fehlgeschlagen',
        es: 'Error al publicar',
        pt: 'Falha ao enviar',
        sv: 'Gick inte att skicka',
        ru: 'Не удалось отправить'
    },
    sent: {
        en: 'Sent',
        de: 'Gesendet',
        es: 'Publicado',
        pt: 'Enviado',
        sv: 'Skickat',
        ru: 'Отправлено'
    },
    single_shout: {
        en: 'viewing a single shout',
        es: 'viendo una sola nota',
        pt: 'visualizando uma mensagem',
        sv: 'visar en enda hojtning',
        ru: 'просмотр единственного отзыва'
    },
    about: {
        // about me panel
        en: 'About',
        de: 'Über',
        es: 'Sobre mí',
        pt: 'Sobre',
        sv: 'Om',
        ru: 'О себе'
    },
    about_me_preview: {
        // About Me
        en: 'About (preview)',
        de: 'Über (Vorschau)',
        es: 'Sobre mí (vista previa)',
        pt: 'Sobre (prévia)',
        sv: 'Om (förhandsvisning)',
        ru: 'О себе (превью)'
    },
    no_about: {
        // username
        en: '{u} is keeping quiet',
        de: '{u} ist wohl etwas schweigsam',
        es: '{u} se está quedando callado',
        pt: '{u} está bem quietinho(a)',
        sv: '{u} håller sig tyst',
        ru: '{u} ничего не написал о себе'
    },
    edit_wiki: {
        en: 'Edit wiki',
        de: 'Wiki bearbeiten',
        es: 'Editar wiki',
        pt: 'Editar wiki',
        sv: 'Redigera wiki',
        ru: 'Редактировать информацию'
    },
    read_more: {
        en: 'Read more',
        de: 'Mehr anzeigen',
        es: 'Leer más',
        pt: 'Ler mais',
        ja: 'もっと読む',
        sv: 'Läs mer',
        ru: 'Читать более'
    },
    refresh: {
        en: 'Refresh',
        de: 'Aktualisieren',
        es: 'Recargar',
        pt: 'Atualizar',
        sv: 'Ladda om',
        ru: 'Перезагрузить'
    },
    refreshed: {
        en: 'Refreshed',
        de: 'Aktualisiert',
        es: 'Recargado',
        pt: 'Atualizado',
        sv: 'Laddats om',
        ru: 'Перезагружено'
    },
    refresh_tracks: {
        en: 'Refresh tracks',
        de: 'Titel aktualisieren',
        es: 'Recargar temas',
        pt: 'Atualizar faixas',
        sv: 'Ladda om låtar',
        ru: 'Перезагрузить треки'
    },
    unavailable: {
        en: 'Unavailable',
        de: 'Nicht verfügbar',
        es: 'No disponible',
        pt: 'Indisponível',
        sv: 'Otillgänglig',
        ru: 'Недоступно'
    },
    set_obsession: {
        en: 'Obsess',
        de: 'Obsessen',
        es: 'Obsesionar',
        pt: 'Obsessão',
        sv: 'Besatthet',
        ru: 'Зависимость'
    },
    obsession_first: {
        en: 'First to claim this obsession!',
        de: 'Die erste Person, die sich diese Obsession für sich beansprucht!',
        es: '¡Primero en establecer esta obsesión!',
        pt: 'Primeiro(a) a ter esta obsessão!',
        sv: 'Den första personen att bli besatt av denna!',
        ru: 'Первый кто имеет эту зависимость!'
    },
    compare: {
        en: 'Compare',
        de: 'Vergleichen',
        es: 'Comparar',
        pt: 'Comparar',
        sv: 'Jämför',
        ru: 'Сравнить'
    },
    compare_plays: {
        en: 'Compare plays',
        de: 'Plays vergleichen',
        es: 'Comparar reproducciones',
        pt: 'Comparar reproduções',
        sv: 'Jämför spelningar',
        ru: 'Сравнить сыгранное'
    },
    inverse_compare: {
        name: {
            en: 'Inverse comparison method',
            de: 'Umgekehrte Vergleichsmethode',
            es: 'Comparación inversa',
            sv: 'Invertera jämförelse',
            ru: 'Обратный метод сравнения',
            pt: 'Método de comparação inversa'
        },
        body: {
            en: 'Show items you do not share instead',
            de: 'Zeige stattdessen Objekte, die ihr nicht teilt',
            es: 'Mostrar ítems que no comparten en su lugar',
            sv: 'Visa istället objekt ni inte delar alls',
            ru: 'Вместо этого показать несовпадающие элементы',
            pt: 'Em vez disso, mostre itens que você não compartilha'
        }
    },
    one_page: {
        en: '1 page',
        de: '1 Seite',
        es: '1 página',
        pt: '1 página',
        sv: '1 sida',
        ru: '1 страница'
    },
    count_pages: {
        en: '{c} pages',
        de: '{c} Seiten',
        es: '{c} páginas',
        pt: '{c} páginas',
        sv: '{c} sidor',
        ru: '{c} страниц', // can't have the exact here due to russian have "3 страницы" and "5 страниц"
    },
    gathering_plays_for_user_pages: {
        en: 'Gathering plays for {u} ({current_page}/{pages})',
        de: 'Sammle Plays für {u} ({current_page}/{pages})',
        es: 'Recopilando reproducciones para {u} ({current_page}/{pages})',
        pt: 'Reunindo reproduções para {u} ({current_page}/{pages})',
        sv: 'Samlar spelningar av {u} ({current_page}/{pages})',
        ru: 'Сбор прослушиваний для {u} (страница {current_page} из {pages})'
    },
    nothing_in_common: {
        en: 'Nothing in common (๑-﹏-๑)',
        de: 'Nichts gemeinsam (๑-﹏-๑)',
        es: 'Nada en común (๑-﹏-๑)',
        pt: 'Nada em comum (๑-﹏-๑)',
        sv: 'Inget gemensamt (๑-﹏-๑)',
        ru: 'Ничего общего (๑-﹏-๑)'
    },
    others_featured: {
        // guest features on a song or album
        en: 'Others featured',
        de: 'Andere gefeatured',
        es: 'Otros incluidos',
        pt: 'Outros em destaque',
        sv: 'Gästartister',
        ru: 'Другие исполнители'
    },
    your_scrobbles: {
        en: 'Your scrobbles',
        de: 'Deine Scrobbles',
        es: 'Tus scrobblings',
        pt: 'Seus scrobbles',
        sv: 'Dina skrobblingar',
        ru: 'Ваши скробблы'
    },
    play: {
        // play a song
        en: 'Play',
        de: 'Abspielen',
        es: 'Escuchar',
        sv: 'Spela upp',
        ru: 'Воспроизвести',
        pt: 'Reproduzir'
    },
    plays: {
        // your play count on a song or album or whatever
        en: 'Plays',
        de: 'Plays',
        es: 'Reproducciones',
        pt: 'Reproduções',
        sv: 'Spelningar',
        ru: 'Прослушивания'
    },
    try_again: {
        en: 'Try again',
        de: 'Erneut versuchen',
        es: 'Intenta de nuevo',
        pt: 'Tentar novamente',
        sv: 'Försök igen',
        ru: 'Повторить'
    },
    back: {
        en: 'Back',
        de: 'Zurück',
        es: 'Atrás',
        pt: 'Voltar',
        sv: 'Tillbaks',
        ru: 'Назад'
    },
    settings: {
        en: 'Settings',
        de: 'Einstellungen',
        es: 'Configuración',
        pt: 'Configurações',
        ja: '設定',
        sv: 'Inställningar',
        ru: 'Настройки'
    },
    on_ignore_list: {
        en: 'Ignored',
        de: 'Ignoriert',
        es: 'Ignorado',
        pt: 'Ignorados',
        sv: 'Ignorerad',
        ru: 'Игнорируется'
    },
    friends: {
        en: 'Friends',
        de: 'Freunde',
        es: 'Amigos',
        pt: 'Amigos',
        sv: 'Vänner',
        ru: 'Друзья'
    },
    friends_setting: {
        en: 'Keep up to date on what your friends are listening to',
        de: 'Bleibe auf dem Laufenden, was deine Freunde hören',
        es: 'Mantente al día de lo que escuchan tus amigos',
        pt: 'Fique por dentro do que seus amigos estão ouvindo',
        sv: 'Håll koll på vad dina vänner lyssnar på',
        ru: 'Следите за тем, что слушают ваши друзья'
    },
    add_friends: {
        en: 'Add friends',
        de: 'Freunde hinzufügen',
        es: 'Añadir amigos',
        pt: 'Adicionar amigos',
        sv: 'Lägg till vänner',
        ru: 'Добавить друзей'
    },
    starred_friend: {
        name: {
            en: 'Starred friend',
            de: 'Markierter Freund',
            es: 'Amigo favorito',
            pt: 'Amigo(a) favorito(a)',
            sv: 'Stjärnmärkt vän',
            ru: 'Избранный друг'
        },
        body: {
            en: 'View their scrobbles alongside yours at all times',
            de: 'Sehe deren Scrobbles jederzeit neben deinen an',
            es: 'Ve sus scrobblings junto a los tuyos en todo momento',
            pt: 'Veja os scrobbles dele(a) junto aos seus o tempo todo',
            sv: 'Se deras skrobblingar bredvid dina hela tiden',
            ru: 'Постоянно просматривать их прослушивания рядом с вашими'
        },
        notice: {
            en: 'Not seeing the options you’re after? Fill out your friends list in the settings.',
            de: 'Siehst du nicht die Optionen, die du suchst? Fülle deine Freundesliste in den Einstellungen aus.',
            es: '¿No encuentras la opción que necesitas? Llena tu lista de amigos en la configuración.',
            pt: 'Não está encontrando as opções que você quer? Preencha sua lista de amigos nas configurações.',
            sv: 'Ser du inte inställningar du letar efter? Fyll upp din vänlista i inställningarna.',
            ru: 'Не видите нужных опций? Заполните свой список друзей в настройках.'
        }
    },
    friend_difference: {
        en: '‘Friends’ is a bleh-exclusive feature that allows you to keep up to date on your friend’s listening history, it is local and does not influence your following list.',
        de: '„Freunde“ ist eine exklusive bleh-Funktion, mit der du auf dem Laufenden bleiben kannst, was deine Freunde hören. Freunde werden lokal verwaltet und beeinflussen nicht deine Follower-Liste.',
        es: '‘Amigos’ es una función exclusiva de bleh que te permite estar al día con el historial de reproducciones de tus amigos. Es local y no influye en tu lista de seguidos.',
        pt: '‘Amigos’ é um recurso exclusivo do bleh que permite você acompanhar o histórico de músicas dos seus amigos. É um recurso local que não influencia a sua lista de seguidores.',
        sv: '’Vänner’ är en exklusiv del av bleh som tillåter dig att hålla koll på dina vänners lyssnarhistoria, det hanteras lokalt och rör inte din följarlista.',
        ru: '«Друзья» — это эксклюзивная функция bleh, которая позволяет вам следить за историей прослушиваний ваших друзей. Список управляется локально и не влияет на ваш список подписок.'
    },
    add_as_friend: {
        en: 'Add as friend',
        de: 'Als Freund hinzufügen',
        es: 'Añadir como amigo',
        pt: 'Adicionar como amigo',
        sv: 'Lägg till som vän',
        ru: 'Добавить как друга'
    },
    remove_friend: {
        name: {
            en: 'Remove friend',
            de: 'Freund entfernen',
            es: 'Eliminar amigo',
            pt: 'Desfazer amizade',
            sv: 'Ta bort vän',
            ru: 'Удалить друга'
        },
        body: {
            en: 'Are you sure you want to remove {u} as a friend, you will stay following them - it‘s only local.',
            de: 'Bist du sicher, dass du {u} als Freund entfernen möchtest? Du folgst der Person weiterhin - die Freundesliste wird lokal verwaltet.',
            es: '¿Seguro de que quieres eliminar a {u} como amigo? Seguirás siguiéndolo — es solo local.',
            pt: 'Tem certeza de que quer remover {u} da sua lista de amigos? Você continuará o/a seguindo - é só algo local.',
            sv: 'Är du säker på att du vill ta bort {u} som vän? Du följer dem fortfarande - vänlistan hanteras lokalt.',
            ru: 'Вы уверены, что хотите удалить {u} из друзей? Вы останетесь подписаны на него/нее — это локальный список.'
        }
    },
    added_as_friend: {
        en: 'Added friend',
        de: 'Freund hinzugefügt',
        es: 'Amigo añadido',
        pt: 'Amigo(a) adicionado(a)',
        sv: 'Lagt till som vän',
        ru: 'Друг добавлен'
    },
    removed_friend: {
        en: 'Removed friend',
        de: 'Freund entfernt',
        es: 'Amigo eliminado',
        pt: 'Amigo(a) removido(a)',
        sv: 'Tagit bort vän',
        ru: 'Друг удален'
    },
    added_star: {
        en: 'Added star status',
        de: 'Markiert',
        es: 'Marcado como favorito',
        pt: 'Status de favorito adicionado',
        sv: 'Stjärnmärkte',
        ru: 'Добавлен в избранное'
    },
    add_as_starred_friend: {
        en: 'Star friend',
        de: 'Freund markieren',
        es: 'Marcar como favorito',
        pt: 'Favoritar amigo(a)',
        sv: 'Stjärnmärk vän',
        ru: 'Добавить друга в избранное'
    },
    removed_star: {
        en: 'Removed star status',
        de: 'Markierung entfernt',
        es: 'Eliminado de favoritos',
        pt: 'Status de favorito removido',
        sv: 'Tog bort stjärnmärke',
        ru: 'Удален из избранного'
    },
    remove_as_star_friend: {
        en: 'Remove star status',
        de: 'Markierung entfernen',
        es: 'Eliminar de favoritos',
        pt: 'Remover estado de favorito',
        sv: 'Ta bort stjärnmärke',
        ru: 'Удалить из избранного'
    },
    aka: {
        en: 'aka.',
        de: 'alias',
        es: 'alias',
        pt: 'vulgo',
        sv: 'också känd som',
        ru: 'он же'
    },
    account_pronouns: {
        en: 'pronouns',
        de: 'pronomen',
        es: 'pronombres',
        pt: 'pronomes',
        sv: 'pronomen',
        ru: 'местоимения'
    },
    account_created: {
        // dont translate to "scrobbling since", instead just "created"
        en: 'created',
        de: 'erstellt',
        es: 'creado',
        pt: 'criada',
        sv: 'skapades',
        ru: 'создан'
    },
    account_scrobbling_since_replace: {
        // copy this from last.fm 1:1 (including the space at the end if there)
        en: 'scrobbling since ',
        de: 'scrobbelt seit ',
        es: 'scrobbling desde ',
        pt: 'em scrobble desde ',
        ja: 'よりscrobble',
        sv: 'skrobblar sedan ',
        ru: 'скробблинг с '
    },
    edit: {
        en: 'Edit',
        de: 'Bearbeiten',
        es: 'Editar',
        pt: 'Editar',
        sv: 'Redigera',
        ru: 'Редактировать'
    },
    bulk_edit: {
        // as in the last.fm "Bulk Edit" open-source extension
        en: 'Bulk edit',
        de: 'Mehrere bearbeiten',
        es: 'Editar en masa',
        pt: 'Edição em massa',
        sv: 'Bulkredigera',
        ru: 'Массовое редактирование'
    },
    scrobble: {
        en: 'Scrobble',
        de: 'Scrobble',
        es: 'Hacer scrobbling',
        pt: 'Scrobble',
        sv: 'Skrobbla',
        ru: 'Скроббл'
    },
    scrobble_value: {
        en: 'Scrobble {v}',
        es: 'Hacer {v} scrobblings',
        ru: 'Скробблить {v}'
    },
    average: {
        // scrobble average
        en: 'Average',
        de: 'Durchschnitt',
        es: 'Promedio',
        pt: 'Média',
        sv: 'Genomsnitt',
        ru: 'Среднее'
    },
    scrobbles: {
        en: 'Scrobbles',
        de: 'Scrobbles',
        es: 'Scrobblings',
        pt: 'Scrobbles',
        ja: 'Scrobble',
        sv: 'Skrobblingar',
        ru: 'Прослушивания'
    },
    count_plays: {
        // e.g. 20 plays in a music grid
        // this uses plays in english but scrobbles
        // for ease of understanding elsewhere
        en: '{c} plays',
        de: '{c} Scrobbles',
        es: '{c} scrobblings',
        pt: '{c} scrobbles',
        sv: '{c} skrobblingar',
        ru: '{c} прослушиваний', // problem with rus. language using different versions of same word for different number -- craw
    },
    count_scrobbles: {
        en: '{c} scrobbles',
        de: '{c} Scrobbles',
        es: '{c} scrobblings',
        pt: '{c} scrobbles',
        sv: '{c} skrobblingar',
        ru: '{c} скробблов', // same here -- craw
    },
    listens: {
        // base on native last.fm ui
        en: 'listens',
        de: 'Scrobbles',
        es: 'scrobblings',
        pt: 'scrobbles',
        sv: 'skrobblingar',
        ru: 'прослушивания',
        count: {
            en: '{c} listens',
            de: '{c} Scrobbles',
            es: '{c] scrobblings',
            pt: '{c} scrobbles',
            sv: '{c} skrobblingar',
            ru: '{c} прослушиваний', // and here -- craw
        }
    },
    new_scrobble: {
        en: 'New scrobble',
        de: 'Neuer Scrobble',
        es: 'Nuevo scrobbling',
        pt: 'Novo scrobble',
        sv: 'Ny skrobbel',
        ru: 'Новый скроббл'
    },
    scrobble_failed: {
        en: 'Scrobble could not be sent',
        pt: 'Scrobble não pôde ser enviado',
        es: 'El scrobbling no pudo ser enviado',
        de: 'Scrobble konnte nicht gesendet werden',
        sv: 'Skrobblingen kunde inte skickas',
        ru: 'Не удалось отправить скроббл'
    },
    scrobble_error_codes: {
        // https://www.last.fm/api/show/track.scrobble
        1: {
            en: 'Artist name was ignored',
            de: 'Künstlername wurde ignoriert',
            es: 'El nombre del artista fue ignorado',
            pt: 'O nome do(a) artista foi ignorado',
            sv: 'Artistnamnet var ignorerad',
            ru: 'Имя исполнителя проигнорировано'
        },
        2: {
            en: 'Track name was ignored',
            de: 'Titelname wurde ignoriert',
            es: 'El nombre del tema fue ignorado',
            pt: 'O nome da faixa foi ignorado',
            sv: 'Låttiteln var ignorerad',
            ru: 'Название трека проигнорировано'
        },
        3: {
            en: 'Timestamp is too old',
            de: 'Zeitstempel ist zu alt',
            es: 'La marca de tiempo es muy antigua',
            pt: 'O timestamp é muito antigo',
            sv: 'Tidsstämpeln är för gammal',
            ru: 'Временная метка слишком старая'
        },
        4: {
            en: 'Timestamp is too new',
            de: 'Zeitstempel ist zu neu',
            es: 'La marca de tiempo es muy nueva',
            pt: 'O timestamp é muito novo',
            sv: 'Tidsstämpeln är för ny',
            ru: 'Временная метка слишком новая'
        },
        5: {
            en: 'Daily scrobble limit exceeded',
            es: 'Límite diario de scrobblings excedido',
            pt: 'Limite diário de scrobbles excedido',
            sv: 'Max dagliga skrobblingar har nåtts',
            ru: 'Превышен дневной лимит скробблов'
        }
    },
    artist: {
        en: 'Artist',
        de: 'Künstler',
        es: 'Artista',
        pt: 'Artista',
        sv: 'Artist',
        ru: 'Исполнитель'
    },
    artists: {
        en: 'Artists',
        de: 'Künstler',
        es: 'Artistas',
        pt: 'Artistas',
        ja: 'アーティスト',
        sv: 'Artister',
        ru: 'Исполнители'
    },
    artists_tooltip: {
        en: 'Multiple artists are grouped into this profile',
        de: 'Mehrere Künstler sind auf diesem Profil gruppiert',
        es: 'Múltiples artistas están agrupados en este perfil',
        pt: 'Múltiplos artistas estão agrupados neste perfil',
        sv: 'Flera artister delar denna profil',
        ru: 'В этом профиле сгруппированы несколько исполнителей'
    },
    album: {
        en: 'Album',
        de: 'Album',
        es: 'Álbum',
        pt: 'Álbum',
        sv: 'Album',
        ru: 'Альбом'
    },
    albums: {
        en: 'Albums',
        de: 'Alben',
        es: 'Álbumes',
        pt: 'Álbuns',
        ja: 'アルバム',
        sv: 'Album',
        ru: 'Альбомы'
    },
    albums_and_tracks: {
        en: 'Albums and tracks',
        es: 'Álbumes y temas',
        pt: 'Álbuns e faixas',
        sv: 'Album och låtar',
        ru: 'Альбомы и треки'
    },
    album_artist: {
        en: 'Album Artist',
        de: 'Albumkünstler',
        es: 'Artista del álbum',
        pt: 'Artista do álbum',
        sv: 'Albumartist',
        ru: 'Исполнитель альбома'
    },
    single: {
        // release type
        en: 'Single',
        es: 'Sencillo',
        pt: 'Single',
        sv: 'Singel',
        ru: 'Сингл'
    },
    track: {
        en: 'Track',
        de: 'Titel',
        es: 'Tema',
        pt: 'Faixa',
        sv: 'Låt',
        ru: 'Трек'
    },
    tracks: {
        en: 'Tracks',
        de: 'Titel',
        es: 'Temas',
        pt: 'Faixas',
        ja: 'トラック',
        sv: 'Låtar',
        ru: 'Треки'
    },
    appearance: {
        en: 'Appearance',
        de: 'Erscheinungsbild',
        es: 'Apariencia',
        pt: 'Aparência',
        sv: 'Utséende',
        ru: 'Внешний вид'
    },
    visual: {
        en: 'Visual',
        de: 'Design',
        es: 'Estilo',
        pt: 'Visual',
        sv: 'Visuellt',
        ru: 'Оформление'
    },
    theme: {
        en: 'Theme',
        de: 'Farbschema',
        es: 'Tema',
        pt: 'Tema',
        sv: 'Tema',
        ru: 'Тема'
    },
    theme_day: {
        name: {
            en: 'Day',
            de: 'Tag',
            es: 'Día',
            pt: 'Dia',
            sv: 'Dag',
            ru: 'Светлая'
        },
        body: {
            en: 'When your system reports light theme',
            de: 'Wenn dein System ein helles Farbschema hat',
            es: 'Cuando tu dispositivo indica el aspecto claro',
            pt: 'Quando o seu sistema indica tema claro',
            sv: 'När ditt system rapporterar ett ljust tema',
            ru: 'Когда в системе используется светлая тема'
        }
    },
    theme_night: {
        name: {
            en: 'Night',
            de: 'Nacht',
            es: 'Noche',
            pt: 'Noite',
            sv: 'Natt',
            ru: 'Ночная'
        },
        body: {
            en: 'When your system reports dark theme',
            de: 'Wenn dein System ein dunkles Farbschema hat',
            es: 'Cuando tu dispositivo indica el aspecto oscuro',
            pt: 'Quando o seu sistema indica tema escuro',
            sv: 'När ditt system rapporterar ett mörk tema',
            ru: 'Когда в системе используется темная тема'
        }
    },
    theme_schedule: {
        en: 'Choose which theme preference to apply based on your system theme.',
        de: 'Wähle dein bevorzugtes Farbschema basierend auf deinem Systemdesign.',
        es: 'Elige el aspecto a escoger basado en el aspecto de tu dispositivo.',
        pt: 'Escolha qual preferência de tema aplicar com base no tema do seu sistema.',
        sv: 'Välj föredraget tema att tillämpa utgående från ditt systemtema.',
        ru: 'Выберите тему, которая будет применяться в зависимости от системной темы.'
    },
    themes: {
        name: {
            en: 'Themes',
            de: 'Farbschema',
            es: 'Aspectos',
            pt: 'Temas',
            sv: 'Teman',
            ru: 'Темы'
        },
        light: {
            en: 'Light',
            de: 'Hell',
            es: 'Claro',
            pt: 'Claro',
            sv: 'Ljus',
            ru: 'Светлая'
        },
        ink: {
            en: 'Ink',
            de: 'Tinte',
            es: 'Tinta',
            pt: 'Tinta',
            sv: 'Bläck',
            ru: 'Чернила'
        },
        dark: {
            en: 'Ash',
            de: 'Asche',
            es: 'Ceniza',
            pt: 'Cinza',
            sv: 'Aska',
            ru: 'Пепел', // straight translate of word "ash" -- craw
        },
        darker: {
            en: 'Dark',
            de: 'Dunkel',
            es: 'Oscuro',
            pt: 'Escuro',
            sv: 'Mörk',
            ru: 'Темная'
        },
        oled: {
            en: 'Void',
            de: 'Nacht',
            es: 'Vacío',
            pt: 'Vazio',
            sv: 'Tomhet',
            ru: 'Пустота'
        }
    },
    colours: {
        en: 'Colours',
        de: 'Farben',
        es: 'Colores',
        pt: 'Cores',
        sv: 'Färger',
        ru: 'Цвета'
    },
    adaptive: {
        en: 'Adaptive',
        de: 'Adaptiv',
        es: 'Adaptativo',
        pt: 'Adaptativo',
        sv: 'Adaptiv',
        ru: 'Адаптивный'
    },
    adaptive_tip: {
        // the space on the end is intentional
        en: 'Your theme preference will be either {day} or {night}, based on your system. ',
        de: 'Dein bevorzugtes Farbschema wird entweder {day} oder {night} sein, basierend auf deinem System. ',
        es: 'El aspecto elegido será {day] o {night}, basándose en tu dispositivo. ',
        pt: 'Sua preferência de tema será {day} ou {night}, com base no seu sistema. ',
        sv: 'Ditt föredragna tema blir antigen {day} eller {night}, beroende på ditt system. ',
        ru: 'Предпочтительная тема будет {day} или {night} в зависимости от настроек вашей системы. '
    },
    change_schedule: {
        en: 'Change schedule',
        de: 'Zeitplan ändern',
        es: 'Cambiar horario',
        pt: 'Alterar cronograma',
        sv: 'Ändra schema',
        ru: 'Изменить расписание'
    },
    change_my_colour_when: {
        name: {
            en: 'Use a context-based accent colour when',
            de: 'Kontextbasierte Akzentfarbe verwenden, wenn',
            es: 'Usar un color de acento basado en contexto al',
            pt: 'Usar uma cor de destaque baseada no contexto quando',
            sv: 'Använd kontextbaserad accentfärg när',
            ru: 'Использовать контекстный акцентный цвет, когда'
        },
        body: {
            en: 'Temporarily override your selected accent to match album art',
            de: 'Überschreibe vorübergehend deine ausgewählte Akzentfarbe, damit sie zum Albumcover passt',
            es: 'Substituye temporalmente el color de acento seleccionado para combinar con la carátula del álbum',
            pt: 'Substituir temporariamente sua cor de destaque selecionada para combinar com a arte do álbum',
            sv: 'Ändra tillfälligt din valda accentfärg för att matcha albumkonsten',
            ru: 'Временно заменять выбранный акцентный цвет на цвет обложки альбома'
        }
    },
    hue_from_album: {
        // a sub-option for change_my_colour_when
        en: 'Browsing album pages',
        de: 'Albumseiten angesehen werden',
        es: 'Navegar la página de un álbum',
        pt: 'Navegando pelas páginas de álbuns',
        sv: 'Du är på albumsidor',
        ru: 'Просматриваются страницы альбомов'
    },
    colourful_active: {
        // a sub-option for change_my_colour_when
        en: 'Actively scrobbling a track',
        de: 'ein Titel aktiv gescrobbelt wird',
        es: 'Hacer scrobbling a un tema',
        pt: 'Scrobblando uma faixa ativamente',
        sv: 'Aktivt skrobblar en låt',
        ru: 'Происходит активный скробблинг трека'
    },
    colourful_all: {
        // a sub-option for change_my_colour_when
        en: 'Viewing any track',
        de: 'ein beliebiger Titel angesehen wird',
        es: 'Ver cualquier tema',
        pt: 'Visualizando qualquer faixa',
        sv: 'Visar en låt',
        ru: 'Просматривается любой трек'
    },
    configure: {
        en: 'Configure',
        de: 'Konfigurieren',
        es: 'Configurar',
        pt: 'Configurar',
        sv: 'Konfigurera',
        ru: 'Настроить'
    },
    links: {
        en: 'Links',
        de: 'Links',
        es: 'Vínculos',
        pt: 'Links',
        sv: 'Länkar',
        ru: 'Ссылки'
    },
    event: {
        en: 'Event',
        de: 'Event',
        es: 'Evento',
        pt: 'Evento',
        sv: 'Evenemang',
        ru: 'Событие'
    },
    events: {
        en: 'Events',
        de: 'Events',
        es: 'Eventos',
        pt: 'Eventos',
        ja: 'イベント',
        sv: 'Evenemang',
        ru: 'События'
    },
    lineup: {
        en: 'Line-up',
        de: 'Line-up',
        es: 'Cartel',
        pt: 'Programação',
        sv: 'Spelschema',
        ru: 'Участники'
    },
    attendance: {
        en: 'Attendance',
        de: 'Teilnahme',
        es: 'Asistencia',
        pt: 'Comparecimento',
        sv: 'Närvarande',
        ru: 'Посещаемость'
    },
    top_badge: {
        en: 'Top Badge',
        de: 'Top-Abzeichen',
        es: 'Emblema superior',
        pt: 'Emblema superior',
        sv: 'Toppemblem',
        ru: 'Топ значок'
    },
    general: {
        en: 'General',
        de: 'Allgemein',
        es: 'General',
        pt: 'Geral',
        sv: 'Generellt',
        ru: 'Общие'
    },
    interface: {
        en: 'Interface',
        de: 'Oberfläche',
        es: 'Interfaz',
        pt: 'Interface',
        sv: 'Interface',
        ru: 'Интерфейс'
    },
    music: {
        en: 'Music',
        de: 'Musik',
        es: 'Música',
        pt: 'Música',
        ja: '音楽',
        sv: 'Musik',
        ru: 'Музыка'
    },
    smart_music_titles: {
        en: 'Smart music titles',
        es: 'Títulos inteligentes de música',
        pt: 'Títulos de músicas inteligentes',
        sv: 'Smarta musiktitlar',
        ru: 'Умные названия треков'
    },
    playback: {
        en: 'Playback',
        de: 'Wiedergabe',
        es: 'Reproducción',
        pt: 'Reprodução',
        sv: 'Uppspelning',
        ru: 'Воспроизведение'
    },
    profile: {
        en: 'Profile',
        de: 'Profil',
        es: 'Perfil',
        pt: 'Perfil',
        pl: 'Profil',
        sv: 'Profil',
        ru: 'Профиль'
    },
    view_profile: {
        en: 'View profile',
        de: 'Profil anzeigen',
        es: 'Ver perfil',
        pt: 'Ver perfil',
        sv: 'Visa profil',
        ru: 'Посмотреть профиль'
    },
    edit_profile: {
        en: 'Edit profile',
        de: 'Profil bearbeiten',
        es: 'Editar perfil',
        pt: 'Editar perfil',
        sv: 'Redigera profil',
        ru: 'Редактировать профиль'
    },
    current_season: {
        en: 'Current season',
        de: 'Aktuelle Saison',
        es: 'Temporada actual',
        pt: 'Estação atual',
        sv: 'Nuvarande årstid',
        ru: 'Текущий сезон'
    },
    seasonal: {
        name: {
            // translate to 'Seasons' if it reads better
            en: 'Seasonal',
            de: 'Saisonal',
            es: 'Temporadas',
            pt: 'Estações',
            sv: 'Årstider',
            ru: 'Сезоны'
        },
        listing: {
            none: {
                en: 'None active',
                de: 'Keine aktiv',
                es: 'Ninguna activa',
                pt: 'Nenhuma ativa',
                sv: 'Ingen aktiv',
                ru: 'Нет активных'
            },
            easter: {
                en: 'Easter',
                de: 'Ostern',
                es: 'Pascua',
                pt: 'Páscoa',
                sv: 'Påsk',
                ru: 'Пасха'
            },
            pride: {
                en: 'Pride',
                de: 'Pride',
                es: 'Orgullo',
                pt: 'Orgulho',
                sv: 'Pride',
                ru: 'Прайда'
            },
            halloween: {
                en: 'Halloween',
                de: 'Halloween',
                es: 'Halloween',
                pt: 'Dia das Bruxas',
                sv: 'Halloween',
                ru: 'Хэллоуин'
            },
            pre_fall: {
                en: 'Autumn',
                de: 'Herbst',
                es: 'Otoño',
                pt: 'Outono',
                sv: 'Höst',
                ru: 'Осень'
            },
            fall: {
                en: 'Winter',
                es: 'Invierno',
                ru: 'Зима'
            },
            christmas: {
                en: 'Christmas',
                de: 'Weihnachten',
                es: 'Navidad',
                pt: 'Natal',
                sv: 'Jul',
                ru: 'Рождество'
            },
            new_years: {
                en: 'New Years',
                de: 'Neujahr',
                es: 'Año Nuevo',
                pt: 'Ano Novo',
                sv: 'Nyår',
                ru: 'Новый год'
            }
        },
        notice: {
            en: 'Open the live counter',
            es: 'Abre el contador en vivo',
            pt: 'Abrir o contador ao vivo',
            sv: 'Öppna live-nedräkningen',
            ru: 'Открыть живой счетчик'
        },
        live: {
            en: 'Counter is updating live',
            es: 'El contador está siendo actualizado en tiempo real',
            pt: 'O contador está sendo atualizado em tempo real',
            sv: 'Nedräkningen uppdateras live',
            ru: 'Открыть счетчик в реальном времени'
        },
        presets: {
            // these are seasonal exclusive colour presets
            nonsense: {
                // reference to https://open.spotify.com/track/7yogx3TwxGwSxO2QITsT2q
                en: 'A Nonsense Christmas',
                es: 'Una Navidad Sin Sentido',
                pt: 'Um Natal Sem Sentido',
                sv: 'A Nonsense Christmas',
                ru: 'Бессмысленное Рождество'
            },
            fruitcake: {
                // reference to https://open.spotify.com/album/7EisdwWcodpmHxgpGVE5Pg
                en: 'fruitcake',
                es: 'pastel de fruta',
                sv: 'fruitcake',
                pt: 'bolo de frutas',
                ru: 'фруктовый кекс'
            },
            mistletoe: {
                en: 'Mistletoe',
                es: 'Muérdago',
                sv: 'Mistel',
                pt: 'Visco',
                ru: 'Омела'
            },
            festival: {
                en: 'Christmas Eve',
                es: 'Víspera de Navidad',
                sv: 'Julafton',
                pt: 'Véspera de Natal',
                ru: 'Сочельник'
            }
        }
    },
    new_season: {
        en: 'New Season!',
        de: 'Neue Jahreszeit!',
        es: '¡Nueva Temporada!',
        pt: 'Nova Estação!',
        sv: 'Ny årstid!',
        ru: 'Новый сезон!'
    },
    value_for_time: {
        // e.g. (Halloween) ends (in 3 days)
        //
        // shouldn't the "in" and "days" be outside the parentheses? -soleil
        en: '{v} ends {time}',
        es: '{v} termina {time}',
        ru: '{v} закончится {time}'
    },
    seasonal_timeline: {
        en: 'Seasonal timeline',
        de: 'Saisonaler Zeitstrahl',
        es: 'Calendario de temporada',
        pt: 'Linha do tempo sazonal',
        sv: 'Tidslinje för årstider',
        ru: 'Сезонная шкала времени'
    },
    enable_seasons: {
        // translate to seasons if it reads better
        name: {
            en: 'Automatically adapt to seasonal events',
            de: 'Automatisch an saisonale Events anpassen',
            es: 'Adaptar automáticamente a las temporadas',
            pt: 'Adaptar automaticamente a eventos sazonais',
            sv: 'Adaptera automatiskt för årstider',
            ru: 'Автоматически адаптироваться к сезонным событиям'
        },
        body: {
            en: 'Adapts the default colour, iconset, and shows particles depending on the season',
            de: 'Passt die Standardfarbe und das Iconset an und zeigt Partikel entsprechend der Jahreszeit an',
            es: 'Adapta el color, los íconos, y muestra partículas dependiendo de la temporada',
            pt: 'Adapta a cor padrão, ícones e exibe partículas dependendo da sazonalidade',
            sv: 'Adaptera färg, ikoner, och visa partiklar beroende på årstiden',
            ru: 'Адаптирует цвет по умолчанию, набор значков и отображает частицы в зависимости от сезона'
        }
    },
    seasonal_particles_fps: {
        name: {
            en: 'Reduce quality of particles',
            de: 'Partikelqualität reduzieren',
            es: 'Reducir calidad de las partículas',
            pt: 'Reduzir qualidade das partículas',
            sv: 'Sänk partiklarnas kvalitet',
            ru: 'Снизить качество частиц'
        },
        body: {
            en: 'Snow particles use a drop-shadow glow for aesthetics with the added processing cost',
            de: 'Schneepartikel verwenden für die Ästhetik einen Glanzeffekt – erfordert zusätzliche Rechenleistung',
            es: 'Las partículas de nieve usan un brillo de sombra paralela para mayor estética, con costo adicional de procesamiento',
            pt: 'As partículas de neve usam um efeito de brilho com sombra projetada para estética, com o custo adicional de processamento',
            sv: 'Snöpartiklarna använder en glödeffekt för estetiska själ, med lite extra datorbelastning',
            ru: 'Снежные частицы используют эффект свечения для эстетики ценой дополнительных затрат ресурсов'
        }
    },
    seasonal_overlays: {
        name: {
            en: 'Display additional seasonal effects',
            es: 'Mostrar efectos de temporada adicionales',
            pt: 'Exibir efeitos sazonais adicionais',
            sv: 'Visa extra årstidseffekter',
            ru: 'Отображать дополнительные сезонные эффекты'
        },
        body: {
            en: 'During winter seasons this applies a coat of ice to panels, otherwise mainly gradients',
            es: 'Durante las temporadas invernales, aplica una capa de hielo a los paneles, de lo contrario, aplica principalmente gradientes',
            pt: 'Durante o inverno, isso aplica uma camada de gelo aos painéis; fora dessa época, aplica principalmente gradientes',
            sv: 'Under vintersäsongen läggs ett lager is på paneler, annars mest bildgradienter',
            ru: 'Отображать дополнительные сезонные эффекты'
        }
    },
    seasonal_offset: {
        en: 'Seasonal events are ran in your timezone, which we calculated as {offset}',
        de: 'Saisonale Events werden in deiner Zeitzone ausgeführt, die wir als {offset} berechnet haben',
        es: 'Las temporadas son aplicadas en tu zona horaria, que calculamos como {offset}',
        pt: 'Eventos sazonais são realizados em seu fuso horário, que calculamos como {offset}',
        sv: 'Årstidsevenemang hålls i din tidszon, som vi räknade ut vara {offset}',
        ru: 'Сезонные события проводятся по вашему часовому поясу, который мы определили как {offset}'
    },
    calculated_offset: {
        // timezone offset
        en: 'Calculated offset based on timezone',
        de: 'Berechnete Verschiebung basierend auf der Zeitzone',
        es: 'Diferencia calculada con base en tu zona horaria',
        pt: 'Offset calculado com base no fuso horário',
        sv: 'Förskjutning kalkylerats från tidszon',
        ru: 'Рассчитанное смещение на основе часового пояса'
    },
    started: {
        // season start date
        // start date: 1 day ago
        en: 'Start date',
        es: 'Fecha de inicio',
        pt: 'Data de início',
        sv: 'Startdatum',
        ru: 'Дата начала'
    },
    next_in: {
        // season next date
        // next season: in 3 days
        en: 'Next season',
        es: 'Próxima temporada',
        pt: 'Próxima estação',
        sv: 'Nästa årstid',
        ru: 'Следующий сезон'
    },
    ends_in: {
        // season end date
        // end date: in 2 days
        en: 'End date',
        es: 'Fecha de finalización',
        pt: 'Dia de término',
        sv: 'Slutdatum',
        ru: 'Дата окончания'
    },
    text: {
        en: 'Text',
        de: 'Text',
        es: 'Texto',
        pt: 'Texto',
        sv: 'Text',
        ru: 'Текст'
    },
    accessibility: {
        en: 'Accessibility',
        de: 'Barrierefreiheit',
        es: 'Accesibilidad',
        pt: 'Acessibilidade',
        sv: 'Tillgängligthet',
        ru: 'Доступность'
    },
    troubleshooting: {
        en: 'Advanced',
        de: 'Fortgeschritten',
        es: 'Avanzado',
        pt: 'Avançado',
        sv: 'Advancerat',
        ru: 'Дополнительно'
    },
    recommendations: {
        en: 'Suggested',
        de: 'Empfohlen',
        es: 'Recomendado',
        pt: 'Sugestões',
        sv: 'Förslag',
        ru: 'Рекомендованные'
    },
    releases: {
        en: 'Releases',
        de: 'Veröffentlichungen',
        es: 'Lanzamientos',
        pt: 'Lançamentos',
        sv: 'Skivsläpp',
        ru: 'Релизы'
    },
    no_releases_found: {
        en: 'No releases found here',
        es: 'No se encontraron nuevos lanzamientos',
        ru: 'Здесь не найдено ни одного релиза'
    },
    tracklist_source: {
        name: {
            en: 'Preferred tracklist source',
            es: 'Fuente preferida para la lista de temas',
            ru: 'Предпочитаемый источник треклиста'
        },
        body: {
            en: 'Choose which service to display for album tracklists',
            es: 'Elige cuál servicio mostrar para la lista de temas',
            ru: 'Выберите сервис, который будет отображаться для треклистов альбомов'
        }
    },
    bookmarks: {
        en: 'Bookmarks',
        de: 'Lesezeichen',
        es: 'Marcadores',
        pt: 'Marcadores',
        ja: 'ブックマーク',
        sv: 'Bokmärken',
        ru: 'Закладки'
    },
    charts: {
        en: 'Charts',
        de: 'Charts',
        es: 'Listas',
        pt: 'Paradas',
        ja: 'チャート',
        sv: 'Topplistor',
        ru: 'Чарты'
    },
    view_the_charts: {
        en: 'View the charts',
        es: 'Ver las listas',
        pt: 'Ver as paradas',
        ru: 'Посмотреть чарты'
    },
    welcome_back_user: {
        en: 'Welcome back {user}!',
        de: 'Willkommen züruck, {user}!',
        es: '¡Bienvenido, {user}!',
        pt: 'Bem-vindo(a) {user}!',
        sv: 'Välkommen tillbaka, {user}!',
        ru: 'С возвращением, {user}!'
    },
    // TODO(stel): is my capitalisation correct here at all lol ; yes cutie, well done <3
    good_morning_user: {
        en: 'Good morning',
        de: 'Guten Morgen',
        es: 'Buenos días',
        pt: 'Bom dia',
        sv: 'God morgon',
        ru: 'Доброе утро'
    },
    good_afternoon_user: {
        en: 'Good afternoon',
        de: 'Guten Nachmittag',
        es: 'Buenas tardes',
        pt: 'Boa tarde',
        sv: 'God eftermiddag',
        ru: 'Добрый день'
    },
    good_evening_user: {
        en: 'Good evening',
        de: 'Guten Abend',
        es: 'Buenas noches',
        pt: 'Boa noite',
        sv: 'God kväll',
        ru: 'Добрый вечер'
    },
    good_night_user: {
        en: 'Goodnight',
        de: 'Gute Nacht',
        es: 'Buenas noches',
        pt: 'Boa noite',
        sv: 'God natt',
        ru: 'Спокойной ночи'
    },
    bleh_settings: {
        en: 'bleh Settings',
        de: 'bleh-Einstellungen',
        es: 'Configuación de bleh',
        pt: 'Configurações do bleh',
        sv: 'bleh-inställningar',
        ru: 'Настройки bleh'
    },
    bleh_setup: {
        en: 'Setup',
        de: 'Einrichtung',
        es: 'Instalación',
        pt: 'Instalação',
        sv: 'Installation',
        ru: 'Настройка'
    },
    import: {
        en: 'Import',
        de: 'Importieren',
        es: 'Importar',
        pt: 'Importar',
        pl: 'Importuj',
        sv: 'Importera',
        ru: 'Импорт'
    },
    import_failed: {
        en: 'Import failed',
        es: 'Error al importar',
        pt: 'Falha na importação',
        sv: 'Importering misslyckades',
        ru: 'Сбой импорта',
        notice: {
            en: 'The settings you attempted to import failed to parse, no changes were made.',
            es: 'La configuración que intentaste importar falló al procesarse, no se realizaron cambios.',
            pt: 'As configurações que você tentou importar não puderam ser processadas; nenhuma alteração foi feita.',
            sv: 'Inställningarna du försökte importera kunde inte läsas, inga ändringar har gjorts.',
            ru: 'Настройки, которые вы пытались импортировать, не удалось обработать. Изменения не были внесены.'
        }
    },
    import_settings: {
        en: 'Import settings',
        de: 'Einstellungen importieren',
        es: 'Importar configuración',
        pt: 'Importar configurações',
        sv: 'Importera inställningar',
        ru: 'Импортировать настройки'
    },
    import_notice: {
        en: 'This is a permanent action, beware of where you are copying from',
        de: 'Dieser Vorgang ist unwiderruflich – sei vorsichtig, von wo du kopierst',
        es: 'Esta es una acción permanente, ten cuidado del lugar de donde copias',
        pt: 'Esta é uma ação permanente, cuidado com o lugar de onde você está copiando',
        sv: 'Det här är permanent, oberoende av vart du kopierar ifrån',
        ru: 'Это действие необратимо, будьте внимательны к источнику копирования'
    },
    export: {
        en: 'Export',
        de: 'Exportieren',
        es: 'Exportar',
        pt: 'Exportar',
        pl: 'Eksportuj',
        sv: 'Exportera',
        ru: 'Экспорт'
    },
    export_settings: {
        en: 'Export settings',
        de: 'Einstellungen exportieren',
        es: 'Exportar configuración',
        pt: 'Exportar configurações',
        sv: 'Exportera inställningar',
        ru: 'Экспортировать настройки'
    },
    reset: {
        en: 'Reset',
        de: 'Zurücksetzen',
        es: 'Restablecer',
        pt: 'Restaurar',
        pl: 'Resetuj',
        sv: 'Återställ',
        ru: 'Сбросить'
    },
    reset_settings: {
        en: 'Reset settings to default',
        de: 'Standardeinstellungen wiederherstellen',
        es: 'Restablecer configuración predeterminada',
        pt: 'Restaurar as configurações para o padrão',
        sv: 'Återställ alla inställningar till det vanliga',
        ru: 'Сбросить настройки до значений по умолчанию'
    },
    reset_notice: {
        en: 'Your settings will be permanently reset, are you sure?',
        de: 'Deine Einstellungen werden unwiderruflich zurückgesetzt, bist du sicher?',
        es: 'Tu configuración será restablecida de forma permanente, ¿estás seguro?',
        pt: 'Sua configuração vai ser permanentemente restaurada ao padrão, você tem certeza?',
        sv: 'Är du säker på att du vill återställa alla inställningar? Det är permanent.',
        ru: 'Ваши настройки будут безвозвратно сброшены, вы уверены?'
    },
    reset_item_to_default: {
        en: 'Reset item to default',
        de: 'Element auf Standard zurücksetzen',
        es: 'Restablecer ítem por defecto',
        pt: 'Restaurar itens para o padrão',
        sv: 'Återställ till standard',
        ru: 'Сбросить элемент до значения по умолчанию'
    },
    make_a_backup: {
        en: 'Make a backup',
        de: 'Backup erstellen',
        es: 'Hacer un respaldo',
        pt: 'Faça um backup',
        sv: 'Skapa en backup',
        ru: 'Создать резервную копию'
    },
    news: {
        en: 'News',
        de: 'Neuigkeiten',
        es: 'Noticias',
        pt: 'Notícias',
        sv: 'Nytt',
        ru: 'Новости',
        type: {
            major: {
                en: 'Major release',
                es: 'Lanzamiento principal',
                pt: 'Lançamento principal',
                sv: 'Större utgåva',
                ru: 'Крупный релиз'
            },
            minor: {
                en: 'Minor release',
                es: 'Lanzamiento secundario',
                sv: 'Mindre utgåva',
                pt: 'Lançamento secundario',
                ru: 'Мелкий релиз'
            }
        }
    },
    news_from_user: {
        en: 'News from {user}',
        de: 'Neuigkeiten von {user}',
        es: 'Noticias de {user}',
        pt: 'Notícias de {user}',
        sv: 'Nytt från {user}',
        ru: 'Новости от {user}'
    },
    default: {
        en: 'Default',
        de: 'Standard',
        es: 'Por defecto',
        pt: 'Padrão',
        sv: 'Standard',
        ru: 'По умолчанию'
    },
    avatar: {
        en: 'Avatar',
        de: 'Profilbild',
        es: 'Avatar',
        pt: 'Foto de perfil',
        sv: 'Profilbild',
        ru: 'Аватар'
    },
    customise: {
        en: 'Customise',
        de: 'Anpassen',
        es: 'Customizar',
        pt: 'Customizar',
        sv: 'Anpassa',
        ru: 'Настроить'
    },
    convert: {
        en: 'Convert',
        de: 'Umwandeln',
        es: 'Convertir',
        pt: 'Converter',
        sv: 'Konvertera',
        ru: 'Конвертировать'
    },
    convert_from_hex: {
        en: 'Convert colour',
        de: 'Farbe umwandeln',
        es: 'Convertir color',
        pt: 'Converter cor',
        sv: 'Konvertera färg',
        ru: 'Конвертировать цвет'
    },
    fonts: {
        en: 'Fonts',
        de: 'Schriftart',
        es: 'Fuentes',
        pt: 'Fontes',
        sv: 'Typsnitt',
        ru: 'Шрифты'
    },
    hue: {
        en: 'Accent colour',
        de: 'Akzentfarbe',
        es: 'Color de acento',
        pt: 'Cor de destaque',
        pl: 'Kolor akcentu (hue)',
        sv: 'Accentfärg',
        ru: 'Основной цвет'
    },
    sat: {
        en: 'Vibrancy',
        de: 'Sättigung',
        es: 'Intensidad',
        pt: 'Vivacidade',
        pl: 'Nasycenie (saturation)',
        sv: 'Färgmättnad',
        ru: 'Насыщенность'
    },
    lit: {
        en: 'Lightness',
        de: 'Helligkeit',
        es: 'Claridad',
        pt: 'Claridade',
        pl: 'Jasność (lightness)',
        sv: 'Ljushet',
        ru: 'Яркость'
    },
    solarium: {
        name: {
            en: 'Enable solarium glass effects',
            de: 'Solarium-Glaseffekte aktivieren',
            es: 'Activar efectos de vidrio de solárium',
            pt: 'Ativar efeitos de vidro Solarium',
            sv: 'Aktivera solariumsglaseffekter',
            ru: 'Включить эффект матового стекла Solarium'
        },
        body: {
            en: 'Apply a see-through glassy material to many surfaces, which may degrade performance on some devices',
            de: 'Fügt vielen Oberflächen ein durchsichtiges, glasartiges Material hinzu – kann die Leistung auf einigen Geräten beeinträchtigen',
            es: 'Aplica un material vidrioso y translúcido a varias superficies, que puede reducir el rendimiento en algunos dispositivos',
            pt: 'Aplicar um material translúcido e vidrado a várias superfícies, o que pode reduzir o desempenho em alguns dispositivos',
            sv: 'Läg till ett genomskinligt glasliknande material till många ytor, som kan degradera prestanda på vissa enheter',
            ru: 'Применяет полупрозрачный стеклянный материал ко многим поверхностям, что может снизить производительность на некоторых устройствах'
        }
    },
    seasonal_warning: {
        en: 'This season has a custom default accent colour!',
        de: 'Diese Saison hat eine benutzerdefinierte Akzentfarbe',
        es: '¡Esta temporada tiene un color de acento personalizado!',
        pt: 'Esta estação tem uma cor de destaque personalizada!',
        sv: 'Denna årstid har en anpassad färg!',
        ru: 'Этот сезон имеет собственный акцентный цвет по умолчанию!'
    },
    card_background_saturation: {
        name: {
            en: 'Card background vibrancy',
            de: 'Sättigung des Kartenhintergrunds',
            es: 'Intensidad del fondo de la tarjeta',
            pt: 'Vivacidade de fundo do cartão',
            sv: 'Bakgrundsfärg',
            ru: 'Насыщенность фона карточки'
        },
        body: {
            en: 'Bring some colour into your world (or reduce it)',
            de: 'Bringe etwas Farbe in deine Welt (oder reduziere sie)',
            es: 'Trae un poco de color a tu mundo (o redúcelo)',
            pt: 'Traz algumas cores ao mundo (ou diminui elas)',
            sv: 'Skaffa lite färg i din värld (eller minska den)',
            ru: 'Добавьте красок в свой мир (или уменьшите их)'
        }
    },
    noise: {
        name: {
            en: 'Noise overlay opacity',
            es: 'Opacidad de la capa de ruido',
            sv: 'Brusöverläggsopacitet',
            ru: 'Непрозрачность наложения шума'
        },
        body: {
            en: 'Apply a coat of subtle noise to add variation to solid backgrounds',
            es: 'Aplica una capa de ruido para añadir variedad a los fondos sólidos',
            sv: 'Tillämpa ett brusöverlägg för lite variation på enfärgade bakgrunder',
            ru: 'Наложить тонкий слой шума, чтобы добавить разнообразия однотонным фонам'
        }
    },
    save: {
        en: 'Save',
        de: 'Speichern',
        es: 'Guardar',
        pt: 'Salvar',
        pl: 'Zapisz',
        sv: 'Spara',
        ru: 'Сохранить'
    },
    cancel: {
        en: 'Cancel',
        de: 'Abbrechen',
        es: 'Cancelar',
        pt: 'Cancelar',
        pl: 'Anuluj',
        sv: 'Avbryt',
        ru: 'Отмена'
    },
    add: {
        en: 'Add',
        de: 'Hinzufügen',
        es: 'Añadir',
        pt: 'Adicionar',
        sv: 'Lägg till',
        ru: 'Добавить'
    },
    remove: {
        en: 'Remove',
        de: 'Entfernen',
        es: 'Remover',
        pt: 'Remover',
        sv: 'Radera',
        ru: 'Удалить'
    },
    clear: {
        en: 'Clear',
        de: 'Löschen',
        es: 'Limpiar',
        pt: 'Limpar',
        pl: 'Wyczyść',
        sv: 'Rensa',
        ru: 'Очистить'
    },
    close: {
        en: 'Close',
        de: 'Schließen',
        es: 'Cerrar',
        pt: 'Fechar',
        pl: 'Zamknij',
        sv: 'Stäng',
        ru: 'Закрыть'
    },
    go: {
        en: 'Go',
        de: 'Los',
        es: 'Ir',
        pt: 'Ir',
        sv: 'Gå',
        ru: 'Перейти'
    },
    skip: {
        en: 'Skip',
        de: 'Überspringen',
        es: 'Omitir',
        pt: 'Pular',
        sv: 'Hoppa över',
        ru: 'Пропустить'
    },
    send: {
        en: 'Send',
        de: 'Senden',
        es: 'Publicar',
        pt: 'Enviar',
        sv: 'Skicka',
        ru: 'Отправить'
    },
    done: {
        en: 'Done',
        de: 'Fertig',
        es: 'Hecho',
        pt: 'Feito',
        pl: 'Gotowe',
        sv: 'Färdig',
        ru: 'Готово'
    },
    finish: {
        en: 'Finish',
        de: 'Beenden',
        es: 'Terminar',
        pt: 'Terminar',
        sv: 'Klart',
        ru: 'Завершить'
    },
    continue: {
        en: 'Continue',
        de: 'Fortsetzen',
        es: 'Continuar',
        pt: 'Continuar',
        pl: 'Kontynuuj',
        sv: 'Fortsätt',
        ru: 'Продолжить'
    },
    click_for_more_options: {
        en: 'Click for more options',
        de: 'Klicke für weitere Optionen',
        es: 'Haz clic para más opciones',
        sv: 'Tryck för mer alternativ',
        ru: 'Нажмите, чтобы увидеть больше опций'
    },
    right_click_for_more_options: {
        en: 'Right-click for more options',
        de: 'Rechtsklick für weitere Optionen',
        es: 'Clic derecho para más opciones',
        pt: 'Clique esquerdo para mais opções',
        sv: 'Högerklicka för mer alternativ',
        ru: 'Нажмите правой кнопкой мыши для дополнительных опций'
    },
    refresh_pending: {
        name: {
            en: 'Refresh pending',
            de: 'Aktualisierung anstehend',
            es: 'Recarga pendiente',
            pt: 'Atualizar pendências',
            sv: 'Förväntar omladdning',
            ru: 'Требуется обновление'
        },
        body: {
            en: 'A setting you changed requires a page refresh',
            de: 'Eine von dir geänderte Einstellung erfordert eine Seitenaktualisierung, damit sie wirksam wird',
            es: 'Una opción que cambiaste requiere que recargues la página',
            pt: 'Uma configuração que você mudou exige uma atualização de página',
            sv: 'En inställning du ändrade på behöver at sidan laddas om',
            ru: 'Изменённая вами настройка требует обновления страницы'
        }
    },
    new: {
        en: 'New',
        de: 'Neu',
        es: 'Nuevo',
        pt: 'Nova',
        sv: 'Ny',
        ru: 'Новое'
    },
    beta: {
        en: 'Beta',
        de: 'Beta',
        es: 'Beta',
        sv: 'Beta',
        ru: 'Бета'
    },
    more: {
        en: 'More',
        de: 'Mehr',
        es: 'Más',
        pt: 'Mais',
        sv: 'Mer',
        ru: 'Еще'
    },
    inbox: {
        en: 'Inbox',
        de: 'Posteingang',
        es: 'Buzón',
        pt: 'Caixa de entrada',
        sv: 'Brevlåda',
        ru: 'Входящие'
    },
    notifications: {
        en: 'Notifications',
        de: 'Benachrichtigungen',
        es: 'Notificaciones',
        pt: 'Notificações',
        sv: 'Notiser',
        ru: 'Уведомления'
    },
    messages: {
        en: 'Messages',
        de: 'Nachrichten',
        es: 'Mensajes',
        pt: 'Mensagens',
        sv: 'Meddelanden',
        ru: 'Сообщения'
    },
    preview: {
        en: 'Preview',
        de: 'Vorschau',
        es: 'Vista previa',
        sv: 'Förhandsvisning',
        ru: 'Предпросмотр'
    },
    find_on: {
        // music services to find an artist/album/track on
        en: 'Find on',
        de: 'Hier zu finden',
        es: 'Encuentra en',
        pt: 'Encontre em',
        sv: 'Sök upp på',
        ru: 'Найти на'
    },
    following: {
        en: 'Following',
        de: 'Gefolgt',
        es: 'Siguiendo',
        pt: 'Seguindo',
        sv: 'Följer',
        ru: 'Подписки'
    },
    followers: {
        en: 'Followers',
        de: 'Follower:innen',
        es: 'Seguidores',
        pt: 'Seguidores',
        sv: 'Följare',
        ru: 'Подписчики'
    },
    neighbours: {
        en: 'Neighbours',
        de: 'Nachbarn',
        es: 'Vecinos',
        pt: 'Vizinhos',
        sv: 'Grannar',
        ru: 'Соседи'
    },
    website: {
        en: 'Website',
        de: 'Webseite',
        es: 'Sitio web',
        sv: 'Hemsida',
        ru: 'Вебсайт'
    },
    overview: {
        en: 'Overview',
        de: 'Übersicht',
        es: 'General',
        pt: 'Visão geral',
        ja: 'ダイジェスト',
        sv: 'Översikt',
        ru: 'Обзор'
    },
    photos: {
        en: 'Photos',
        de: 'Fotos',
        es: 'Fotos',
        pt: 'Fotos',
        ja: '写真',
        sv: 'Foton',
        ru: 'Фотографии'
    },
    artwork: {
        en: 'Artwork',
        de: 'Cover',
        es: 'Carátula',
        pt: 'Arte de capa',
        sv: 'Konst',
        ru: 'Обложка'
    },
    gallery_sum: {
        en: 'This is the sum of votes for ordering',
        es: 'Esta es la suma de votos para ordenar',
        sv: 'Det här är summan röster för bildordning',
        ru: 'Это сумма голосов для сортировки'
    },
    view_saved: {
        en: 'View all saved photos',
        es: 'Ver todas las fotos guardadas',
        sv: 'Visa alla sparade foton',
        ru: 'Посмотреть все сохраненные фотографии'
    },
    dropzone: {
        en: 'Drag-and-drop an image or click here',
        de: 'Bild hierher ziehen oder hier klicken',
        es: 'Arrastra una imagen o haz clic aquí',
        sv: 'Dra och släpp en bild eller klicka här',
        ru: 'Перетащите изображение или нажмите здесь'
    },
    similar_artists: {
        en: 'Similar Artists',
        de: 'Ähnliche Künstler:innen',
        es: 'Artistas similares',
        pt: 'Artistas similares',
        sv: 'Liknande artister',
        ru: 'Похожие исполнители'
    },
    artists_similar_to_name: {
        en: 'Artists similar to {n}',
        de: 'Ähnliche Künstler:innen wie {n}',
        es: 'Artistas similares a {n}',
        sv: 'Liknande artister till {n}',
        ru: 'Исполнители, похожие на {n}'
    },
    biography: {
        en: 'Biography',
        de: 'Biografie',
        es: 'Biografía',
        pt: 'Biografia',
        ja: 'バイオグラフィー',
        sv: 'Biografi',
        ru: 'Биография'
    },
    wiki: {
        en: 'Wiki',
        de: 'Wiki',
        es: 'Wiki',
        sv: 'Wiki',
        ru: 'Инфо'
    },
    listeners: {
        en: 'Listeners',
        de: 'Hörer:innen',
        es: 'Oyentes',
        pt: 'Ouvintes',
        sv: 'Lyssnare',
        ru: 'Слушатели'
    },
    listeners_you_know: {
        en: 'Listeners You Know',
        de: 'Hörer:innen, die du kennst',
        es: 'Oyentes que conoces',
        pt: 'Ouvintes que você conhece',
        sv: 'Lyssnare du känner',
        ru: 'Знакомые слушатели'
    },
    count_listeners: {
        en: '{c} listeners',
        de: '{c} Hörer:innen',
        es: '{c} oyentes',
        pt: '{c} ouvintes',
        sv: '{c} lyssnare',
        ru: '{c} слушателей'
    },
    tag: {
        en: 'Tag',
        de: 'Tag',
        es: 'Tag',
        sv: 'Tagg',
        ru: 'Тег'
    },
    tags: {
        en: 'Tags',
        de: 'Tags',
        es: 'Tags',
        ja: 'タグ',
        sv: 'Taggar',
        ru: 'Теги'
    },
    reports: {
        // last.fm listening reports
        en: 'Reports',
        de: 'Berichte',
        es: 'Informes',
        ja: 'レポート',
        pt: 'Relatório',
        sv: 'Lyssningsrapport',
        ru: 'Отчеты'
    },
    artist_lower: {
        // used inside a sentence not on its own,
        // make lowercase if thats how the language works
        en: 'artist',
        de: 'Künstlers',
        es: 'artista',
        pt: 'artista',
        sv: 'artistnamnet',
        ru: 'исполнитель'
    },
    album_lower: {
        // used inside a sentence not on its own,
        // make lowercase if thats how the language works
        en: 'album',
        de: 'Albums',
        es: 'álbum',
        pt: 'álbum',
        sv: 'albumtiteln',
        ru: 'альбом'
    },
    track_lower: {
        // used inside a sentence not on its own,
        // make lowercase if thats how the language works
        en: 'track',
        de: 'Titels',
        es: 'tema',
        pt: 'faixa',
        sv: 'låten',
        ru: 'трек'
    },
    lotus_cta: {
        // {t} is replaced by one of the 3 above
        // capitalisation here refers to the lotus system, which corrects
        // titles that are capitalised wrongly eg. 'eSpReSsO' -> 'Espresso'

        // DE: a gender-neutral mention of "this artist" would be "dieses Künstlers/dieser Künstlerin", which doesn't work with this formatting
        // we can either move the words article to the upper string or only use the masculine form ("dieses Künstlers") ~Myrai
        true: {
            en: 'This {t} is being re-capitalised, is it correct?',
            de: 'Die Groß-/Kleinschreibung dieses {t} wird korrigiert, ist das korrekt?',
            es: 'La capitalización de este {t} está siendo modificada, ¿es correcta?',
            pt: '{t} teve a capitalização ajustada, está correto?',
            sv: 'Nuvarande {t} har ändrad kapitalisering, stämmer det här?',
            ru: 'В этом {t} исправляется регистр, является ли он правильным?'
        },
        false: {
            en: 'Is this {t} capitalised correctly?',
            de: 'Ist die Groß-/Kleinschreibung dieses {t} richtig?',
            es: '¿Está este {t} capitalizado correctamente?',
            pt: 'Esse(a) {t} está capitalizado(a) corretamente?',
            sv: 'Stämmer kapitaliseringen på {t}?',
            ru: 'Правильно ли написан регистр этого {t}?'
        }
    },
    current: {
        en: 'Current',
        de: 'Aktuell',
        es: 'Actual',
        sv: 'Nuvarande',
        ru: 'Текущий'
    },
    current_tip: {
        en: 'This is the original capitalisation present on Last.fm',
        de: 'Dies ist die originale Groß-/Kleinschreibung auf Last.fm',
        es: 'Esta es la capitalización original presente en Last.fm',
        sv: 'Det här är den originella kapitaliseringen som finns på Last.fm',
        ru: 'Это исходный регистр, предоставленный на Last.fm'
    },
    correction: {
        en: 'Correction',
        de: 'Korrektur',
        es: 'Corrección',
        sv: 'Korrigering',
        ru: 'Исправление'
    },
    correction_tip: {
        en: 'This is the correct capitalisation, as decided by the artist',
        de: 'Dies ist die korrekte Groß-/Kleinschreibung, wie sie vom Künstler festgelegt wurde',
        es: 'Esta es la capitalización correcta, decidida por el artista',
        sv: 'Det här är rätt kapitalisering, som bestämd av artisten',
        ru: 'Это правильный регистр, определенный исполнителем'
    },
    sources: {
        en: 'Sources',
        de: 'Quellen',
        es: 'Fuentes',
        sv: 'Källor',
        ru: 'Источники'
    },
    sources_tip: {
        en: 'Provide reputable sources where this capitalisation is present, excluding sites like Wikipedia, RYM, AOTY, and MusicBrainz',
        de: 'Gebe seriöse Quellen an, auf denen diese Schreibweise zu finden ist, ausgenommen sind Seiten wie Wikipedia, RYM, AOTY und MusicBrainz',
        es: 'Proporciona fuentes fiables donde la capitalización esté presente, excluyendo sitios como Wikipedia, RYM, AOTY y MusicBrainz',
        sv: 'Visa pålitliga källor där man kan se att denna kapitalisering stämmer, förutom sidor som Wikipedia, RYM, AOTY och MusicBrainz',
        ru: 'Укажите авторитетные источники, где присутствует этот регистр, исключая такие сайты, как Wikipedia, RYM, AOTY и MusicBrainz'
    },
    suggest: {
        en: 'Suggest',
        de: 'Vorschlagen',
        es: 'Sugerir',
        sv: 'Föreslå',
        ru: 'Предложить'
    },
    please_match_the_format: {
        en: 'Only capitalisation changes are allowed',
        de: 'Nur Änderungen der Groß-/Kleinschreibung sind erlaubt',
        es: 'Solo se permiten cambios a la capitalización',
        sv: 'Endast ändringar på kapitalisering är tillåtet',
        ru: 'Допускаются только изменения регистра'
    },
    suggest_correction: {
        // suggest a correction for the above system
        en: 'Suggest a correction',
        de: 'Korrektur vorschlagen',
        es: 'Sugiere una corrección',
        pt: 'Sugira uma correção',
        sv: 'Föreslå en ändring',
        ru: 'Предложить исправление'
    },
    recent_tracks: {
        en: 'Recent Tracks',
        de: 'Kürzlich gehört',
        es: 'Temas recientes',
        pt: 'Faixas recentes',
        ja: '最近のトラック',
        sv: 'Nyligen spelat',
        ru: 'Недавние треки'
    },
    top_artists: {
        en: 'Top Artists',
        de: 'Top-Künstler:innen',
        es: 'Artistas más escuchados',
        pt: 'Top Artistas',
        ja: 'トップアーティスト',
        sv: 'Toppartister',
        ru: 'Лучшие исполнители'
    },
    top_albums: {
        en: 'Top Albums',
        de: 'Top-Alben',
        es: 'Álbumes más escuchados',
        pt: 'Top Álbuns',
        ja: '人気アルバム',
        sv: 'Toppalbum',
        ru: 'Лучшие альбомы'
    },
    top_tracks: {
        en: 'Top Tracks',
        de: 'Top-Songs',
        es: 'Temás más escuchados',
        pt: 'Top Faixas',
        ja: '人気トラック',
        sv: 'Topplåtar',
        ru: 'Лучшие треки'
    },
    top_track: {
        en: 'Top Track',
        de: 'Top-Song',
        es: 'Tema más escuchado',
        pt: 'Top Faixa',
        sv: 'Topplåt',
        ru: 'Лучший трек'
    },
    you_share_count_with: {
        // as in your musical taste % between you and someone else
        // you are {percentage%} compatible (in taste) {list of artists}
        en: 'You are {c} compatible',
        de: 'Ihr seid {c} kompatibel',
        es: 'Eres {c} compatible',
        pt: 'Voce é {c} compatível',
        sv: 'Du är {c} kompatibel',
        ru: 'Ваша совместимость {c}',
        two: {
            en: '{artist1}, {artist2}',
            de: '{artist1}, {artist2}',
            es: '{artist1}, {artist2}',
            pt: '{artist1}, {artist2}',
            sv: '{artist1}, {artist2}',
            ja: '{artist1}、{artist2}',
            ru: '{artist1}, {artist2}'
        },
        three: {
            en: '{artist1}, {artist2}, {artist3}',
            de: '{artist1}, {artist2}, {artist3}',
            es: '{artist1}, {artist2}, {artist3}',
            pt: '{artist1}, {artist2}, {artist3}',
            sv: '{artist1}, {artist2}, {artist3}',
            ja: '{artist1}、{artist2}、{artist3}',
            ru: '{artist1}, {artist2}, {artist3}'
        }
    },
    taste_similarity: {
        en: 'Taste similarity',
        de: 'Musikgeschmack-Ähnlichkeit',
        es: 'Similitud de gustos',
        pt: 'Similaridade de gostos',
        sv: 'Smaklikhet',
        ru: 'Схожесть вкусов'
    },
    message: {
        // as in a direct message
        en: 'Message',
        de: 'Nachricht schreiben',
        es: 'Mensaje',
        pt: 'Mensagem',
        sv: 'Meddela',
        ru: 'Сообщение'
    },
    join_discord: {
        en: 'Join Discord',
        de: 'Discord beitreten',
        es: 'Unirse al Discord',
        sv: 'Gå med i Discord',
        ru: 'Присоединиться к Discord'
    },
    sponsor_details: {
        en: 'Sponsor and badge details',
        de: 'Sponsoren- und Abzeichendetails',
        es: 'Detalles de patronicio y emblemas',
        sv: 'Sponsor och emblemdetaljer',
        ru: 'Сведения о спонсоре и значке'
    },
    sponsor_data: {
        en: 'Sponsor and badge data version {v}',
        de: 'Sponsoren- und Abzeichendaten-Version {v}',
        es: 'Versión de datos de patrocinio y emblemas',
        pt: 'Versão da data de apoiador e emblemas',
        sv: 'Sponsor-och-emblemdata, version {v}',
        ru: 'Данные о спонсорах и значках, версия {v}'
    },
    sponsor: {
        en: 'Become a sponsor',
        de: 'Werde Sponsor',
        es: 'Sé un patrocinador',
        pt: 'Torne-se um apoiador',
        sv: 'Bli en sponsor',
        ru: 'Стать спонсором'
    },
    message_sponsor: {
        // rewards meaning a badge for example
        en: 'Receive sponsor rewards',
        de: 'Sponsorenprämien erhalten',
        es: 'Recibe recompensas de patrocinador',
        pt: 'Receba recompensas de apoiador',
        sv: 'Få sponsorpriser',
        ru: 'Получить награды спонсора'
    },
    news_sponsor_cta: {
        en: 'Want to support future development of bleh?',
        de: 'Möchtest du die zukünftige Entwicklung von bleh unterstützen?',
        es: '¿Quieres apoyar el desarrollo futuro de bleh?',
        pt: 'Quer apoiar o desenvolvimento futuro do bleh?',
        sv: 'Vill du stödja blehs framtida utveckling?',
        ru: 'Хотите поддержать будущую разработку bleh?'
    },
    support_future_development: {
        // in the context of sponsoring
        en: 'Support future development',
        de: 'Unterstütze die zukünftige Entwicklung',
        es: 'Apoyar el desarrollo futuro',
        pt: 'Apoie o desenvolvimento futuro',
        sv: 'Stöd framtida utveckling',
        ru: 'Поддержать будущую разработку'
    },
    why_sponsor: {
        en: 'Receive a profile badge and a big thank you from katelyn <3',
        de: 'Erhalte ein Abzeichen auf deinem Profil und ein großes Dankeschön von katelyn für deine Unterstützung <3',
        es: 'Recibe un emblema en tu perfil y unas grandes gracias de parte de katelyn <3',
        pt: 'Receba um emblema no seu perfil e um obrigadão da katelyn por apoiar <3',
        sv: 'Få ett emblem på din profil och ett stort tack från katelyn <3',
        ru: 'Получите значок профиля и большую благодарность от katelyn <3'
    },
    you_are_a_sponsor: {
        en: 'You are a sponsor, thank you! :3',
        de: 'Du bist ein Sponsor, danke schön! :3',
        es: 'Eres un patrocinador, ¡gracias! :3',
        pt: 'Você é um apoiador, muito obrigado! :3',
        sv: 'Du är en sponsor, tack så mycket! :3',
        ru: 'Вы являетесь спонсором, спасибо! :3'
    },
    sponsor_get_badge: {
        en: 'A monthly sponsorship grants you a custom badge of your choosing',
        de: 'Mit einem monatlichen Sponsoring erhältst du ein individuelles Abzeichen deiner Wahl',
        es: 'Un patricinio mensual te otorga un emblema personalizado de tu elección',
        pt: 'Um apoio mensal lhe dá um emblema personalizado de sua escolha',
        sv: 'Med ett månatligt sponsorskap får du ett emblem du själv kan anpassa',
        ru: 'Ежемесячное спонсорство предоставляет вам на выбор персонализированный значок'
    },
    sponsor_no_badge: {
        en: 'A custom badge is only available with a monthly sponsorship.',
        de: 'Ein individuelles Abzeichen ist nur mit einem monatlichen Sponsoring erhältlich.',
        es: 'Un emblema personalizado solo está disponible con un patrocinio mensual.',
        pt: 'Um emblema personalizado só está disponível com um apoio mensal.',
        sv: 'Ett eget anpassat emblem finns bara tillgängligt med månatligt sponsorskap.',
        ru: 'Персонализированный значок доступен только при ежемесячном спонсорстве.'
    },
    manage_sponsor: {
        en: 'Manage sponsorship',
        de: 'Sponsoring verwalten',
        es: 'Gestionar patrocinio',
        pt: 'Gerenciar apoio',
        sv: 'Sponsorskapsinställningar',
        ru: 'Управление спонсорством'
    },
    view: {
        en: 'View',
        de: 'Ansehen',
        es: 'Ver',
        pt: 'Ver',
        sv: 'Visa',
        ru: 'Просмотреть'
    },
    profile_and_badges: {
        en: 'Profile, {c} badges',
        de: 'Profil, {c} Abzeichen',
        es: 'Perfil, {c} emblemas',
        pt: 'Perfil, {c} emblemas',
        sv: 'Profil, {c} emblem',
        ru: 'Профиль, {c} значков'
    },
    current_version: {
        en: 'Current version',
        de: 'Aktuelle Version',
        es: 'Versión actual',
        pt: 'Versão atual',
        sv: 'Nuvarande version',
        ru: 'Текущая версия'
    },
    manage_data: {
        en: 'Manage data',
        es: 'Gestionar datos',
        sv: 'Hantera data',
        ru: 'Управление данными'
    },
    labs: {
        // labs by last.fm
        en: 'Labs',
        de: 'Labs',
        es: 'Labs',
        sv: 'Labs',
        ru: 'Лаборатория'
    },
    sponsor_info: {
        en: 'This is a special bleh-managed profile to handle sponsors',
        de: 'Dies ist ein bleh-verwaltetes Profil zur Verwaltung von Sponsoren',
        es: 'Este es un perfil especial manejado por bleh para gestionar patrocinadores',
        pt: 'Este é um perfil especial gerenciado pelo bleh para lidar com apoiadores',
        sv: 'Detta är en speciell profil från bleh för att hantera sponsorskap',
        ru: 'Это специальный профиль, управляемый bleh для работы со спонсорами'
    },
    sponsors_only: {
        en: 'Sponsors only',
        de: 'Nur für Sponsoren',
        es: 'Solo patrocinadores',
        sv: 'Endast sponsorer',
        ru: 'Только для спонсоров'
    },
    downloaded_value: {
        // filename
        en: 'Downloaded {v}',
        de: '{v} wurde heruntergeladen',
        es: '{v} descargado',
        sv: 'Laddat ned {v}',
        ru: 'Загружено {v}'
    },
    loading: {
        en: 'Loading',
        de: 'Wird geladen',
        es: 'Cargando',
        pt: 'Carregando',
        sv: 'Laddar',
        ru: 'Загрузка'
    },
    loading_count_days: {
        en: 'Collecting the last {c} days',
        de: 'Sammeln der letzten {c} Tage',
        es: 'Recopilando los últimos {c} días',
        pt: 'Coletando os últimos {c} dias',
        sv: 'Samlar de senaste {c} dagarna',
        ru: 'Сбор данных за последние {c} дней'
    },
    gathering_plays: {
        en: 'Gathering plays',
        de: 'Plays werden gesammelt',
        es: 'Recopilando reproducciones',
        pt: 'Coletando reproduções',
        sv: 'Samlar spelningar',
        ru: 'Сбор прослушиваний'
    },
    following_mutuals: {
        // this is appended after the following button text if mutuals
        // eg. Following (mutually)
        en: '(mutually)',
        de: '(gegenseitig)',
        es: '(mutualmente)',
        pt: '(mutualmente)',
        sv: '(varandra)',
        ru: '(взаимно)'
    },
    language: {
        en: 'Language',
        de: 'Sprache',
        es: 'Idioma',
        pt: 'Idioma',
        sv: 'Språk',
        ru: 'Язык'
    },
    symbol_presets: {
        // as in a selection of characters (symbols, text) that can
        // be used when editing wikis
        en: 'Symbol presets',
        de: 'Symbolvoreinstellungen',
        es: 'Colección de símbolos',
        pt: 'Predefinições de símbolos',
        sv: 'Symboler',
        ru: 'Наборы символов'
    },
    fancy_syntax: {
        // hyperlink as in a link to a website or something,
        // common internet word not sure if it translates?
        en: 'Hyperlink guide',
        de: 'Hyperlink-Leitfaden',
        es: 'Guía de hipervínculo',
        pt: 'Guia de hiperlink',
        sv: 'Länkguide',
        ru: 'Руководство по гиперссылкам'
    },
    links_to: {
        // used in wiki editing, {this example} links to {link}
        en: 'Links to {link}',
        de: 'Verlinkt auf {link}',
        es: 'Vincula a {link}',
        pt: 'Links para {link}',
        sv: 'Länkas till {link}',
        ru: 'Ссылки на {link}'
    },
    explore_in_library: {
        en: 'Explore in library',
        de: 'In der Bibliothek anzeigen',
        es: 'Explorar en colección',
        pt: 'Explorar na biblioteca',
        sv: 'Utforska i bibliotek',
        ru: 'Исследовать в библиотеке'
    },
    add_note: {
        // as in a profile note
        en: 'Add note',
        de: 'Notiz hinzufügen',
        es: 'Añadir anotación',
        pt: 'Adicionar nota',
        sv: 'Lägg till anteckning',
        ru: 'Добавить заметку'
    },
    radio: {
        en: 'Radio',
        de: 'Radio',
        es: 'Radio',
        pt: 'Rádio',
        sv: 'Radio',
        ru: 'Радио'
    },
    mix: {
        // as in a playlist mix of music
        en: 'Mix',
        de: 'Mix',
        es: 'Mix',
        sv: 'Mix',
        ru: 'Микс'
    },
    recommended: {
        // recommended music
        en: 'Recommended',
        de: 'Empfohlen',
        es: 'Recomendado',
        pt: 'Recomendações',
        sv: 'Rekommenderad',
        ru: 'Рекомендованное'
    },
    listening: {
        // used as the card header for radios and listening reports
        en: 'Listening',
        de: 'Hörbericht',
        es: 'Escuchando',
        pt: 'Ouvindo',
        sv: 'Lyssning',
        ru: 'Прослушивание'
    },
    you: {
        en: 'You',
        de: 'Du',
        es: 'Tú',
        pt: 'Você',
        sv: 'Du',
        ru: 'Вы'
    },
    open: {
        en: 'Open',
        de: 'Öffnen',
        es: 'Abrir',
        pt: 'Abrir',
        sv: 'Öppen',
        ru: 'Открыть'
    },
    expand: {
        en: 'Expand',
        de: 'Erweitern',
        es: 'Expandir',
        pt: 'Expandir',
        sv: 'Expandera',
        ru: 'Развернуть'
    },
    expand_to_full_resolution: {
        en: 'Expand to full resolution',
        de: 'Auf volle Auflösung erweitern',
        es: 'Expandir a resolución completa',
        pt: 'Expandir para resolução total',
        sv: 'Expandera till full upplösning',
        ru: 'Развернуть до полного разрешения'
    },
    default_avatar_action: {
        name: {
            en: 'Default avatar action',
            es: 'Acción de avatar por defecto',
            sv: 'Standard bildbetéende',
            ru: 'Действие по умолчанию при нажатии на аватар'
        },
        body: {
            en: 'Which action should be performed when you click an avatar',
            es: 'Cuál acción debería realizarse cuando haces clic a un avatar',
            sv: 'Hur ska sidan beté sig när du trycker på en profilbild',
            ru: 'Какое действие должно быть выполнено при нажатии на аватар'
        }
    },
    share: {
        en: 'Share',
        de: 'Teilen',
        es: 'Compartir',
        pt: 'Compartilhar',
        sv: 'Dela',
        ru: 'Поделиться'
    },
    copy: {
        en: 'Copy',
        de: 'Kopieren',
        es: 'Copiar',
        pt: 'Copiar',
        sv: 'Kopiera',
        ru: 'Копировать'
    },
    copy_username: {
        en: 'Copy username',
        de: 'Benutzername kopieren',
        es: 'Copiar nombre de usuario',
        sv: 'Kopiera användarnamn',
        ru: 'Скопировать имя пользователя'
    },
    copy_link: {
        en: 'Copy link',
        de: 'Link kopieren',
        es: 'Copiar vínculo',
        sv: 'Kopiera länk',
        ru: 'Скопировать ссылку'
    },
    copied_to_clipboard: {
        en: 'Copied to clipboard',
        de: 'In die Zwischenablage kopiert',
        es: 'Copiado al portapapeles',
        pt: 'Copiado para a área de transferência',
        sv: 'Kopierats till urklipp',
        ru: 'Скопировано в буфер обмена'
    },
    click_to_copy: {
        en: 'Click to copy',
        de: 'Klicken zum kopieren',
        es: 'Clic para copiar',
        pt: 'Clique para copiar',
        sv: 'Klicka för att kopiera',
        ru: 'Нажмите, чтобы скопировать'
    },
    wiki_standard_tracks: {
        en: 'Track titles should be wrapped in quotation marks (“ ”)',
        de: 'Songtitel sollten von Anführungszeichen umgeben sein (“ ”)',
        es: 'Los títulos de temas deben estar colocados entre comillas (“ ”)',
        pt: 'Os títulos das faixas devem ser colocados entre aspas (“ ”)',
        sv: 'Låtnamn ska omges av citattecken (“ ”)',
        ru: 'Названия треков должны быть заключены в кавычки (“ ”)'
    },
    wiki_standard_artists: {
        en: 'Album and artist names are left without quotes',
        de: 'Namen von Alben und Künstler:innen werden ohne Anführungszeichen geschrieben',
        es: 'Los nombres de álbumes y artistas son dejados sin comillas',
        pt: 'Os nomes dos álbuns e artistas não devem ser colocados entre aspas',
        sv: 'Album och artistnamn ska skrivas utan citattecken',
        ru: 'Названия альбомов и исполнителей пишутся без кавычек'
    },
    wiki_standard_quotations: {
        en: 'Use ‘ ’ for quotations from the artist or elsewhere',
        de: 'Verwende ‘ ’ für Zitate des Künstlers oder aus anderen Quellen',
        es: 'Usa ‘ ’ para citas provenientes del artista u otro lugar',
        pt: 'Use ‘ ’ para citações do artista ou de outras fontes',
        sv: 'Använd ‘ ’ för citat från artisten eller från annanstans',
        ru: 'Используйте ‘ ’ для цитат исполнителя или из других источников'
    },
    activity: {
        en: 'Activity',
        de: 'Aktivität',
        es: 'Actividad',
        pt: 'Atividade',
        sv: 'Aktivitet',
        ru: 'Активность',
        listing: {
            shout: {
                en: 'Shout',
                de: 'Shout hinterlassen',
                es: 'Nota',
                pt: 'Enviou mensagem',
                sv: 'Hojt',
                ru: 'Сообщение'
            },
            image_upload: {
                en: 'Uploaded image',
                de: 'Bild hochgeladen',
                es: 'Imagen subida',
                pt: 'Enviou imagem',
                sv: 'Laddat upp bild',
                ru: 'Загружено изображение'
            },
            image_star: {
                en: 'Starred image',
                de: 'Bild als Favorit markiert',
                es: 'Imagen favorita',
                pt: 'Favoritou imagem',
                sv: 'Valt favoritbild',
                ru: 'Изображение отмечено'
            },
            obsess: {
                en: 'Obsessed',
                de: 'Obsession festgelegt',
                es: 'Obsesionado',
                pt: 'Obcecou',
                sv: 'Besatthet',
                ru: 'Зависимость'
            },
            unobsess: {
                en: 'Removed obsession',
                de: 'Obsession entfernt',
                es: 'Obsesión removida',
                pt: 'Desobcecou',
                sv: 'Tagit bort besatthet',
                ru: 'Зависимость удалена'
            },
            love: {
                en: 'Loved',
                de: 'Zu Favoriten hinzugefügt',
                es: 'Favorito',
                pt: 'Favoritou',
                sv: 'Älskade låt',
                ru: 'Понравилось'
            },
            unlove: {
                en: 'Removed love',
                de: 'Favorit entfernt',
                es: 'Favorito removido',
                pt: 'Desfavoritou',
                sv: 'Tog bort som älskad',
                ru: 'Удалено из понравившихся'
            },
            install_bwaa: {
                en: 'Installed bwaa',
                de: 'bwaa wurde installiert',
                es: 'bwaa instalado',
                pt: 'Instalou o bwaa',
                sv: 'Installerade bwaa',
                ru: 'Установлен bwaa'
            },
            update_bwaa: {
                en: 'Updated bwaa',
                de: 'bwaa wurde aktualisiert',
                es: 'bwaa actualizado',
                pt: 'Atualizou o bwaa',
                sv: 'Uppdaterade bwaa',
                ru: 'Обновлен bwaa'
            },
            install_bleh: {
                en: 'Installed bleh',
                de: 'bleh wurde installiert',
                es: 'bleh instalado',
                pt: 'Instalou o bleh',
                sv: 'Installerade bleh',
                ru: 'Установлен bleh'
            },
            update_bleh: {
                en: 'Updated bleh',
                de: 'bleh wurde aktualisiert',
                es: 'bleh actualizado',
                pt: 'Atualizou o bleh',
                sv: 'Uppdaterade bleh',
                ru: 'Обновлен bleh'
            },
            bookmark: {
                en: 'Bookmarked',
                de: 'Lesezeichen hinzugefügt',
                es: 'Marcado',
                pt: 'Adicionou marcação',
                sv: 'Bokmärkte',
                ru: 'Добавлено в закладки'
            },
            unbookmark: {
                en: 'Removed bookmark',
                de: 'Lesezeichen entfernt',
                es: 'Marcador removido',
                pt: 'Removeu marcação',
                sv: 'Tog bort bokmärke',
                ru: 'Закладка удалена'
            },
            wiki: {
                en: 'Edited',
                de: 'Bearbeitet',
                es: 'Editado',
                pt: 'Editou',
                sv: 'Redigerade',
                ru: 'Отредактировано'
            }
        },
        types: {
            shout: {
                en: 'Comments and replies from you across the site',
                de: 'Kommentare und Antworten von dir auf der gesamten Site',
                es: 'Comentarios y respuestas de ti a través del sitio',
                pt: 'Seus comentários e respostas ao redor do site',
                sv: 'Kommentarer och svar från dig över hela sidan',
                ru: 'Ваши комментарии и ответы на сайте'
            },
            image: {
                en: 'Uploading images and starring for your layout',
                de: 'Bilder hochladen und Sterne für dein Layout vergeben',
                es: 'Imágenes subidas y favoritos para tu layout',
                pt: 'Imagens enviadas e favoritos do seu layout',
                sv: 'Uppladdning av bilder och väljer favoritbilder',
                ru: 'Загрузка изображений и добавление их в избранное для вашего макета'
            },
            obsess: {
                en: 'Tracks you have on loop',
                de: 'Titel, die du auf Dauerschleife hast',
                es: 'Temas que tienes en bucle',
                pt: 'Faixas que você tem em loop',
                sv: 'Låtar du är besatt av',
                ru: 'Треки, которые вы слушаете на повторе'
            },
            love: {
                en: 'Tracks you love',
                de: 'Deine Lieblingssongs',
                es: 'Temas que amas',
                pt: 'Faixas que você ama',
                sv: 'Låtar du älskar',
                ru: 'Треки, которые вам нравятся'
            },
            bookmark: {
                en: 'Music you want to check out',
                de: 'Musik, die du auschecken solltest',
                es: 'Música que quieres chequear',
                pt: 'Música que você quer conferir',
                sv: 'Musik du vill komma ihåg till senare',
                ru: 'Музыка, которую вы хотите послушать'
            },
            wiki: {
                en: 'Editing of any wiki',
                de: 'Bearbeiten jeglicher Wikis',
                es: 'Edición a cualquier wiki',
                pt: 'Editando de qualquer wiki',
                sv: 'Wikiredigering',
                ru: 'Редактирование любой вики'
            },
            install: {
                en: 'First installations and updating',
                de: 'Erstinstallationen und Aktualisierungen',
                es: 'Primeras instalaciones y actualizaciones',
                pt: 'Primeiras instalações e atualizações',
                sv: 'Första installationen och uppdateringar',
                ru: 'Первые установки и обновления'
            }
        }
    },
    what_are_activities: {
        en: 'Keep track of your most recent activity locally on your profile',
        de: 'Verfolge deine letzten Aktivitäten lokal auf deinem Profil',
        es: 'Mantén registro de tus actividades más recientes localmente en tu perfil',
        pt: 'Acompanhe suas atividades mais recentes localmente em seu perfil',
        sv: 'Håll koll på dina senaste aktiviteter lokalt på din profil',
        ru: 'Отслеживайте свою недавнюю активность локально в своем профиле'
    },
    activity_tracking: {
        name: {
            en: 'Track my activities',
            de: 'Meine Aktivitäten tracken',
            es: 'Registra mis actividades',
            pt: 'Acompanhar minhas atividades',
            sv: 'Spåra mina aktiviteter',
            ru: 'Отслеживать мою активность'
        },
        body: {
            en: 'Activities will only be registered while enabled',
            de: 'Aktivitäten werden nur getrackt, wenn du es aktivierst',
            es: 'Las actividades solo serán registradas cuando esté habilitado',
            pt: 'As atividades só serão registradas enquanto estiverem habilitadas',
            sv: 'Aktiviteter läggs bara till när inställningen är aktiverad',
            ru: 'Активность будет регистрироваться только при включении'
        }
    },
    clear_history: {
        en: 'Clear history',
        de: 'Verlauf löschen',
        es: 'Limpiar historial',
        pt: 'Limpar histórico',
        sv: 'Töm historia',
        ru: 'Очистить историю'
    },
    cleared_activity_history: {
        en: 'Cleared your activity history',
        de: 'Dein Aktivitätsverlauf wurde gelöscht',
        es: 'Historial de actividades limpiado',
        pt: 'Histórico de atividades limpo',
        sv: 'Tömde din aktivitetshistoria',
        ru: 'Ваша история активности очищена'
    },
    activity_settings: {
        en: 'Activity settings',
        de: 'Aktivitätseinstellungen',
        es: 'Configuración de actividad',
        pt: 'Configurações de atividade',
        sv: 'Redigera dina aktiviteter',
        ru: 'Настройки активности'
    },
    installation: {
        en: 'Installation',
        de: 'Installation',
        es: 'Instalación',
        pt: 'Instalação',
        sv: 'Installation',
        ru: 'Установка'
    },
    grid: {
        // as in the view mode
        en: 'Grid',
        de: 'Raster',
        es: 'Cuadrícula',
        pt: 'Grade',
        sv: 'Bildruta',
        ru: 'Сетка'
    },
    list: {
        // as in the view mode
        en: 'List',
        de: 'Liste',
        es: 'Lista',
        pt: 'Linha',
        sv: 'Lista',
        ru: 'Список'
    },
    line: {
        // as in the type of chart (a line graph)
        en: 'Line',
        de: 'Linien',
        es: 'Línea',
        pt: 'Lista',
        sv: 'Linjediagram',
        ru: 'Линейный'
    },
    pie: {
        // as in the type of chart (a pie chart)
        en: 'Pie',
        de: 'Kreis',
        es: 'Pastel',
        pt: 'Pizza',
        sv: 'Cirkeldiagram',
        ru: 'Круговая'
    },
    bar: {
        // as in the type of chart (a bar chart)
        en: 'Bar',
        de: 'Balken',
        es: 'Barra',
        pt: 'Coluna',
        sv: 'Stapeldiagram',
        ru: 'Столбчатая'
    },
    horizontal: {
        en: 'Horizontal',
        de: 'Horizontal',
        es: 'Horizontal',
        sv: 'Vågrätt',
        ru: 'Горизонтальный'
    },
    vertical: {
        en: 'Vertical',
        de: 'Vertikal',
        es: 'Vertical',
        sv: 'Lodrätt',
        ru: 'Вертикальный'
    },
    this_year: {
        en: 'This year',
        de: 'Dieses Jahr',
        es: 'Este año',
        pt: 'Este ano',
        sv: 'Detta år',
        ru: 'Этот год'
    },
    last_year: {
        en: 'Last year',
        de: 'Letztes Jahr',
        es: 'Año pasado',
        pt: 'Ano passado',
        sv: 'Förra året',
        ru: 'Прошлый год'
    },
    love: {
        // as in loving tracks as a concept
        en: 'Love',
        de: 'Als Lieblingssong markieren',
        es: 'Favorito',
        pt: 'Favoritas',
        sv: 'Älska',
        ru: 'Понравилось'
    },
    love_track: {
        en: 'Love track',
        es: 'Marcar como favorito',
        ru: 'Отметить трек как любимый'
    },
    loved: {
        // as in loved tracks, this can be seen
        // in the native last.fm ui
        en: 'Loved',
        de: 'Lieblingssongs',
        es: 'Favorito',
        pt: 'Favoritadas',
        sv: 'Älskade låtar',
        ru: 'Понравившиеся'
    },
    velocity: {
        // as in the last.fm labs 'Velocity' tool
        en: 'Velocity',
        de: 'Dynamik',
        es: 'Velocity',
        pt: 'Rapidez', // velocity is often mistakenly translated to 'velocidade' in portuguese
        sv: 'Velocitet',
        ru: 'Скорость'
    },
    logout: {
        en: 'Logout',
        de: 'Abmelden',
        es: 'Salir',
        pt: 'Sair',
        ja: 'ログアウト',
        sv: 'Logga ut',
        ru: 'Выйти'
    },
    tracklist: {
        // please copy from native last.fm ui
        en: 'Tracklist',
        de: 'Titelliste',
        es: 'Lista de temas',
        pt: 'Lista de faixas',
        sv: 'Spellista',
        ru: 'Список треков'
    },
    tracklist_from_plays_info: {
        en: 'Retrieved own plays as official tracklist is unavailable',
        de: 'Eigene Plays abgerufen, da die offizielle Titelliste nicht verfügbar ist',
        es: 'Reproducciones personales usadas, debido a que la lista de temas oficial no está disponible',
        pt: 'Reproduções próprias recuperadas, pois a lista de faixas oficial não está disponível',
        sv: 'Hämtade dina spelningar för en officiell spellista finns inte tillgänglig',
        ru: 'Получены ваши прослушивания, так как официальный список треков недоступен'
    },
    from_the_album: {
        en: 'From {album}',
        de: 'Auf {album}',
        es: 'De {album}',
        pt: 'Do {album}',
        sv: 'Från {album}',
        ru: 'С {album}'
    },
    others_count: {
        // the amount of other users
        en: '{c} others',
        de: '{c} weitere',
        es: '{c} otros',
        pt: '{c} outros',
        sv: '{c} andra',
        ru: '{c} других'
    },
    loading_album_plays: {
        en: 'Collecting your album plays',
        de: 'Sammeln deiner Albumwiedergaben',
        es: 'Recopilando tus reproducciones de álbumes',
        pt: 'Coletando suas reproduções de álbuns',
        sv: 'Samlar ihop dina albumspelningar',
        ru: 'Сбор прослушиваний ваших альбомов'
    },
    fail_album_plays: {
        en: 'No plays could be found',
        de: 'Es konnten keine Plays gefunden werden',
        es: 'No se pudieron encontrar reproducciones',
        pt: 'Nenhuma reprodução pôde ser encontrada',
        sv: 'Kunde inte hitta på albumspelningar',
        ru: 'Прослушивания не найдены'
    },
    open_album_as_track: {
        en: 'Open album title as track',
        de: 'Albumtitel als Song öffnen',
        es: 'Abrir título del álbum como tema',
        pt: 'Abrir título do álbum como faixa',
        sv: 'Öppna albumtitel som egen låt',
        ru: 'Открыть название альбома как трек'
    },
    ignored: {
        en: 'Ignored',
        de: 'Ignoriert',
        es: 'Ignorado',
        pt: 'Ignorados',
        sv: 'Ignorerad',
        ru: 'Игнорируемые'
    },
    count_total: {
        en: '{c} total',
        de: '{c} insgesamt',
        es: '{c} en total',
        sv: '{c} totalt',
        ru: '{c} всего'
    },
    video_removed: {
        en: 'Video removed by Last.fm',
        de: 'Video von Last.fm entfernt',
        es: 'Video eliminado por Last.fm',
        pt: 'Vídeo removido pela Last.fm',
        sv: 'Video borttagen av Last.fm',
        ru: 'Видео удалено Last.fm'
    },
    blocked_page: {
        en: 'This page has been limited by Last.fm',
        de: 'Diese Seite wurde von Last.fm eingeschränkt',
        es: 'Esta página ha sido limitada por Last.fm',
        pt: 'Esta página foi limitada pela Last.fm',
        sv: 'Denna sida har begränsats av Last.fm',
        ru: 'Эта страница ограничена Last.fm'
    },
    results_for: {
        // used as a header above the actual search e.g.
        // Results for
        // "random search text"
        en: 'Results for',
        de: 'Ergebnisse für',
        es: 'Resultados para',
        pt: 'Resultados para',
        sv: 'Sökresultat för',
        ru: 'Результаты для'
    },
    create_new_event: {
        en: 'Create new event',
        de: 'Neues Event hinzufügen',
        es: 'Crear nuevo evento',
        pt: 'Criar novo evento',
        sv: 'Skapa ett nytt evenemang',
        ru: 'Создать новое событие'
    },
    related_to: {
        // used for similar tags
        en: 'Related to',
        de: 'Verwandte Tags',
        es: 'Relacionado a',
        pt: 'Relacionado a',
        sv: 'Förknippad med',
        ru: 'Связанные с'
    },
    personal_tag: {
        en: 'Personal tag',
        de: 'Persönliches Tag',
        es: 'Tag personal',
        pt: 'Marcador pessoal',
        sv: 'Din tagg',
        ru: 'Личный тег'
    },
    your_avatar: {
        en: 'Your avatar',
        de: 'Dein Profilbild',
        es: 'Tu avatar',
        pt: 'Sua foto de perfil',
        sv: 'Din profilbild',
        ru: 'Ваш аватар'
    },
    avatar_for_user: {
        // this is used to replace the text and extract the
        // username, so make this text everything BUT where
        // the username goes (including spaces)
        // you can find this text in the last.fm ui as every
        // avatar's (except your own) alt text
        en: 'Avatar for ',
        de: 'Profilbild von ',
        es: 'Avatar para ',
        pt: 'Foto de perfil de',
        sv: 'Avatar för ',
        ru: 'Аватар для '
    },
    by: {
        en: 'by',
        de: 'von',
        es: 'por',
        pt: 'por',
        sv: 'av',
        ru: 'от'
    },
    by_user: {
        en: 'by {u}',
        de: 'von {u}',
        es: 'por {u}',
        pt: 'por {u}',
        sv: 'av {u}',
        ru: 'от {u}'
    },
    by_artist: {
        // {name} by {artist} - hence the space in english
        en: ' by {a}',
        de: ' von {a}',
        es: ' por {a}',
        pt: ' por {a}',
        sv: ' av {a}',
        ru: ' от {a}'
    },
    value_by_user: {
        en: '{v} by {u}',
        de: '{v} von {u}',
        es: '{v} por {v}',
        pt: '{v} por {u}',
        ru: '{v} от {u}'
    },
    from_user: {
        en: 'from {u}',
        de: 'Von {u}',
        es: 'de {u}',
        pt: 'de {u}',
        sv: 'från {u}',
        ru: 'от {u}'
    },
    open_new_tab: {
        en: 'Open in a new tab',
        de: 'In neuem Tab öffnen',
        es: 'Abrir en nueva pestaña',
        pt: 'Abrir em nova aba',
        sv: 'Öppna i ny flik',
        ru: 'Открыть в новой вкладке'
    },
    view_image: {
        en: 'View image',
        pt: "Visualizar imagem",
        es: 'Ver imagen',
        sv: 'Visa bild',
        ru: 'Просмотреть изображение'
    },
    view_image_unsafe: {
        en: 'View unsafe image',
        es: 'Ver imagen no segura'
    },
    open_link: {
        en: 'Open link',
        es: 'Abrir vínculo'
    },
    copy_text: {
        en: 'Copy text',
        es: 'Copiar texto'
    },
    event_cancelled: {
        // obviously remove the emoji or replace it as
        // you see fit if desired
        //
        // why would you remove him, he's just a little guy -soleil
        en: 'This event has been cancelled (╥﹏╥)',
        de: 'Dieses Event wurde abgesagt (╥﹏╥)',
        es: 'Este evento ha sido cancelado (╥﹏╥)',
        pt: 'Este evento foi cancelado (╥﹏╥)',
        sv: 'Detta evenemang har avbrutits (╥﹏╥)',
        ru: 'Это событие было отменено (╥﹏╥)'
    },
    format_guest_features: {
        name: {
            en: 'Smart credited artists and song tags',
            de: 'Intelligente Künstler- und Song-Tags',
            es: 'Tags inteligentes de artistas y temas',
            pt: 'Tags inteligentes de artistas e músicas',
            sv: 'Smartformat för gästartister och låttaggar',
            ru: 'Умное форматирование приглашенных артистов и тегов песен'
        },
        body: {
            en: 'Analyses album and track titles into their guests, versions, remixes, etc.',
            de: 'Analysiert Album- und Songtitel hinsichtlich ihrer Versionen, Remixe usw.',
            es: 'Analiza títulos de álbumes y temas y separa sus colaboradores, versiones, remixes, etc.',
            pt: 'Analisa títulos de álbuns e faixas e os separa em seus convidados, versões, remixes etc.',
            sv: 'Analyserar album och låttitlar till gästartister, olika versioner, remixar osv.',
            ru: 'Анализирует названия альбомов и треков на предмет приглашенных артистов, версий, ремиксов и т.д.'
        }
    },
    show_guest_features: {
        name: {
            en: 'Duplicate credited artists in title',
            de: 'Doppelte Nennung der Künstler:innen im Titel',
            es: 'Duplicar artistas con créditos en el título',
            pt: 'Artistas creditados duplicados no título',
            sv: 'Duplicera artistnamn i låttitel',
            ru: 'Дублировать приглашенных артистов в названии'
        },
        body: {
            en: 'Otherwise guests are neatly placed next to the primary artist',
            de: 'Ansonsten werden gefeaturete Künstler:innen neben dem/der Hauptkünstler:in platziert',
            es: 'De lo contrario, los colaboradores son organizados limpiamente al lado del artista principal',
            pt: 'Caso contrário os convidados são organizados de forma elegante ao lado do artista principal',
            sv: 'Annars placeras gästartister fint bredvid huvudartisten',
            ru: 'В противном случае приглашенные артисты аккуратно размещаются рядом с основным исполнителем'
        }
    },
    track_layout: {
        name: {
            en: 'Track layout',
            es: 'Diseño de tema',
            sv: 'Låtlayout',
            ru: 'Расположение трека'
        },
        body: {
            en: 'Choose which axis to display track information on',
            es: 'Elige en qué eje mostrar la información del tema',
            sv: 'Välj vilken axis att visa låtinformation på',
            ru: 'Выберите ось, на которой отображать информацию о треке'
        },
        column: {
            en: 'Place title and artist vertically',
            es: 'Colocar título y artista verticalmente',
            sv: 'Placera titel och artist lodrätt',
            ru: 'Разместить название и исполнителя вертикально'
        },
        row: {
            en: 'Place title and artist horizontally',
            es: 'Colocar título y artista horizontalmente',
            sv: 'Placera titel och artist vågrätt',
            ru: 'Разместить название и исполнителя горизонтально'
        }
    },
    track_album_name_location: {
        name: {
            en: 'Album name location',
            es: 'Ubicación del nombre del álbum',
            sv: 'Albumtitelsplats',
            ru: 'Расположение названия альбома'
        },
        body: {
            en: 'Choose which axis to display said album name on',
            es: 'Elige en qué eje mostrar el nombre del álbum',
            sv: 'Välj vilken axis att visa albumtitel på',
            ru: 'Выберите ось, на которой отображать название альбома'
        },
        column: {
            en: 'Place below title and artist',
            es: 'Colocar debajo del título y artista',
            sv: 'Placera under låttitel och artist',
            ru: 'Разместить под названием и исполнителем'
        },
        row: {
            en: 'Place to the side of title and artist',
            es: 'Colocar al lado del título y artista',
            sv: 'Placera bredvid låttitel och artist',
            ru: 'Разместить рядом с названием и исполнителем'
        }
    },
    expand_tracks: {
        name: {
            en: 'Show associated album for tracks',
            es: 'Mostrar álbum asociado al tema',
            sv: 'Visa associerade album för låtar',
            ru: 'Показывать связанный альбом для треков'
        },
        body: {
            en: 'Places the track’s associated album name if there’s room',
            es: 'Coloca el nombre del álbum asociado al tema si hay espacio',
            sv: 'Placerar låtens associerade album om det finns plats',
            ru: 'Отображает название связанного альбома трека, если есть место'
        }
    },
    expand_tracks_when_active: {
        en: 'Only when actively scrobbling',
        es: 'Solo activo cuando se hace scrobbling',
        de: 'Nur während des aktiven Scrobbelns',
        sv: 'Endast när du skrobblar',
        ru: 'Только при активном скробблинге'
    },
    expand_tracks_always: {
        en: 'Always when possible',
        es: 'Siempre cuando sea posible',
        de: 'Immer, wenn möglich',
        sv: 'Alltid, när det är möjligt',
        ru: 'Всегда, когда возможно'
    },
    show_remaster_tags: {
        en: 'Show remaster tags',
        de: 'Remaster-Tags anzeigen',
        es: 'Mostrar tags de remasters',
        pt: 'Mostrar as tags de remaster',
        sv: 'Visa remaster-taggar',
        ru: 'Показывать теги ремастеринга'
    },
    recent_realtime: {
        name: {
            en: 'Refresh tracks automatically',
            de: 'Titel automatisch aktualisieren',
            es: 'Recargar temas automáticamente',
            pt: 'Atualizar faixas automaticamente',
            sv: 'Automatiskt uppdatera låtar',
            ru: 'Автоматически обновлять треки'
        },
        body: {
            en: 'View your listening history in realtime',
            de: 'Sehe deinen Hörverlauf in Echtzeit an',
            es: 'Ve tu historial de reproducciones en tiempo real',
            pt: 'Veja seu histórico de scrobbles em tempo real',
            sv: 'Visa din lyssningshistorik i realtid',
            ru: 'Просмотр истории прослушивания в реальном времени'
        }
    },
    amount_to_display: {
        // amount of tracks to display in recent/top tracks
        en: 'Amount of tracks to display',
        de: 'Anzahl der anzuzeigenden Titel',
        es: 'Cantidad de temas para mostrar',
        pt: 'Quantidade a ser exibida',
        sv: 'Mängd att visa',
        ru: 'Количество отображаемых треков'
    },
    recent_artwork: {
        en: 'Accompany tracks with artwork',
        de: 'Titel mit Albumcover anzeigen',
        es: 'Acompañar temas con la cáratula',
        pt: 'Mostrar as faixas juntamente a capa',
        sv: 'Visa skivomslag vid låt',
        ru: 'Сопровождать треки обложкой'
    },
    default_timeframe: {
        en: 'Default timeframe',
        de: 'Standardzeitraum',
        es: 'Duración predeterminada',
        pt: 'Período padrão',
        ja: 'デフォルト期間',
        sv: 'Standardtidsram',
        ru: 'Период по умолчанию'
    },
    timeframe: {
        en: 'Timeframe',
        de: 'Zeitraum',
        es: 'Duración',
        pt: "Período",
        sv: 'Tidsram',
        ru: 'Период'
    },
    item_type: {
        en: 'Item type',
        de: 'Objekttyp',
        es: 'Tipo de ítem',
        pt: "Tipo de item",
        sv: 'Objekttyp',
        ru: 'Тип элемента'
    },
    page_count: {
        en: 'Page count',
        de: 'Seitenanzahl',
        es: 'Total de páginas',
        pt: "Total de páginas",
        sv: 'Mängd sidor',
        ru: 'Количество страниц'
    },
    chart_style: {
        en: 'Chart style',
        de: 'Diagrammstil',
        es: 'Estilo de lista',
        pt: 'Estilo da tabela',
        ja: 'チャートスタイル',
        sv: 'Liststil',
        ru: 'Стиль графика'
    },
    chart_size: {
        en: 'Chart size',
        de: 'Diagrammgröße',
        es: 'Tamaño de lista',
        pt: 'Tamanho da tabela',
        sv: 'Liststorlek',
        ru: 'Размер графика'
    },
    country: {
        en: 'Country',
        de: 'Land',
        es: 'País',
        pt: 'País',
        sv: 'Land',
        ru: 'Страна'
    },
    display_name: {
        name: {
            en: 'Display name',
            es: 'Nombre para mostrar',
            sv: 'Visningsnamn',
            ru: 'Отображаемое имя'
        },
        body: {
            en: 'Changes your name on your profile, with your real @username shown below',
            es: 'Cambia tu nombre en tu perfil, con tu nombre de usuario mostrado debajo',
            sv: 'Ändrar namnet på din profil och lägger ditt riktiga @användarnamn underåt',
            ru: 'Изменяет ваше имя в профиле, при этом ваш реальный @никнейм отображается ниже'
        }
    },
    subtitle: {
        en: 'Subtitle',
        de: 'Untertitel',
        es: 'Subtítulo',
        pt: 'Legenda',
        sv: 'Undertext',
        ru: 'Подзаголовок'
    },
    pronoun_tip: {
        en: 'Pronouns are specially supported if placed first',
        de: 'Pronomen werden unterstützt, wenn sie an erster Stelle stehen',
        es: 'Los pronombres son especialmente compatibles si son colocados primero',
        pt: 'Os pronomes são especialmente apoiados se colocados primeiro',
        sv: 'Pronomen har speciellt stöd om det placeras först',
        ru: 'Местоимения поддерживаются, если они расположены первыми'
    },
    block_list: {
        en: 'Block list',
        de: 'Blockierliste',
        es: 'Lista de bloqueados',
        pt: 'Lista de bloqueados',
        sv: 'Blocklista',
        ru: 'Список блокировки'
    },
    when_blocked: {
        en: 'What happens with blocked users?',
        de: 'Was passiert mit blockierten Benutzern?',
        es: '¿Qué pasa con los usuarios bloqueados?',
        pt: 'O que acontece com os usuários bloqueados?',
        sv: 'Vad händer med blockerade användare?',
        ru: 'Что происходит с заблокированными пользователями?'
    },
    blocked_count: {
        en: 'You have blocked {c} profiles',
        de: 'Du hast {c} Benutzer blockiert',
        es: 'Has bloqueado {c} perfiles',
        pt: 'Você bloqueou {c} perfis',
        sv: 'Du har blockerat {c} profiler',
        ru: 'Вы заблокировали {c} профилей'
    },
    enter_username: {
        en: 'Enter username',
        de: 'Benutzername eingeben',
        es: 'Ingresa el nombre de usuario',
        pt: 'Insira o nome de usuário',
        sv: 'Skriv användarnamn',
        ru: 'Введите имя пользователя'
    },
    block: {
        en: 'Block',
        de: 'Blockieren',
        es: 'Bloquear',
        pt: 'Bloquear',
        sv: 'Blockera',
        ru: 'Заблокировать'
    },
    blocked: {
        en: 'Blocked',
        de: 'Blockiert',
        es: 'Bloqueado',
        pt: 'Bloqueado',
        sv: 'Blockerad',
        ru: 'Заблокировано'
    },
    blocked_user_public: {
        en: 'Can leave shouts but not viewable to you',
        de: 'Kann Shouts hinterlassen, diese sind aber nicht für dich sichtbar',
        es: 'Pueden dejar notas pero no son visibles para ti',
        pt: 'Podem deixar mensagens, mas elas não são visíveis para você',
        sv: 'Hojtningar på allmäna profiler syns inte för dig',
        ru: 'Могут оставлять сообщения, но вы их не увидите'
    },
    blocked_user_message: {
        en: 'Cannot direct message you',
        de: 'Kann dir keine Direktnachrichten senden',
        es: 'No pueden mandarte mensajes directos',
        pt: 'Não podem lhe enviar mensagens diretas',
        sv: 'Kan inte skicka privat meddelande till dig',
        ru: 'Не могут отправлять вам личные сообщения'
    },
    blocked_user_new_shouts: {
        en: 'Cannot leave shouts or reply to you',
        de: 'Kann keine Shouts hinterlassen oder dir antworten',
        es: 'No pueden dejarte notas o responderte',
        pt: 'Não podem deixar mensagens na sua caixa de mensagens ou lhe responder',
        sv: 'Kan inte lämna hojtningar på din profil eller svara på dina hojtningar',
        ru: 'Не могут оставлять сообщения или отвечать вам'
    },
    blocked_user_old_shouts: {
        en: 'You cannot delete pre-existing shouts on your profile',
        de: 'Bereits vorhandene Shouts auf deinem Profil werden nicht gelöscht',
        es: 'No puedes eliminar notas ya existentes en tu perfil',
        pt: 'Você não pode deletar mensagens já existentes em seu perfil',
        sv: 'Du kan inte ta bort deras tidigare hojtningar från din profil',
        ru: 'Вы не можете удалить ранее существовавшие сообщения в вашем профиле'
    },
    blocked_user_view_profile: {
        en: 'They can still view your profile',
        de: 'Die Person kann weiterhin dein Profil ansehen',
        es: 'Todavía pueden ver tu perfil',
        pt: 'Eles ainda podem ver seu perfil',
        sv: 'Dem kan fortfarande se din profil',
        ru: 'Они по-прежнему могут просматривать ваш профиль'
    },
    shared_with_others: {
        en: 'Shared with others',
        de: 'Mit anderen geteilt',
        es: 'Compartido con otros',
        pt: 'Compartilhado com outros',
        sv: 'Delades med andra',
        ru: 'Поделились с другими'
    },
    others_from_profile: {
        en: 'More from {user}',
        de: 'Mehr von {user}',
        es: 'Más de {user}',
        pt: 'Mais de {user}',
        sv: 'Mer från {user}',
        ru: 'Больше от {user}'
    },
    obsess: {
        en: 'Obsess',
        de: 'Als Obsession festlegen',
        es: 'Establecer como obsesión',
        pt: 'Definir como obsessão',
        sv: 'Ställ in som besatthet',
        ru: 'Сделать зависимой'
    },
    obsession: {
        en: 'Obsession',
        de: 'Obsession',
        es: 'Obsesión',
        pt: 'Obsessão',
        sv: 'Aktuell besatthet',
        ru: 'Зависимая идея'
    },
    obsessions: {
        en: 'Obsessions',
        de: 'Obsessionen',
        es: 'Obsesiones',
        pt: 'Obsessões',
        sv: 'Besattheter',
        ru: 'Зависимые идеи'
    },
    finding_your_tracks: {
        en: 'Finding your tracks',
        de: 'Deine Titel werden gesucht',
        es: 'Encontrando tus temas',
        pt: 'Encontrando suas faixas',
        sv: 'Hittar på dinna låtar',
        ru: 'Поиск ваших треков'
    },
    update_check: {
        en: 'Check for updates',
        de: 'Nach Updates suchen',
        es: 'Comprobar si hay actualizaciones',
        pt: 'Procurar atualizações',
        sv: 'Kolla efter uppdateringar',
        ru: 'Проверить обновления'
    },
    redirected_from: {
        en: 'Redirected from',
        es: 'Redireccionado de',
        sv: 'Omdirigerades från',
        ru: 'Перенаправлено с'
    },
    music_corrections: {
        en: 'Music corrections',
        de: 'Musik-Korrekturen',
        es: 'Correcciones de música',
        pt: 'Correções de música',
        sv: 'Musikredigeringar',
        ru: 'Музыкальные исправления'
    },
    corrections_loaded: {
        en: 'Corrections loaded',
        de: 'Korrekturen wurden geladen',
        es: 'Correcciones cargadas',
        sv: 'Dina redigeringar har laddat',
        ru: 'Исправления загружены'
    },
    corrections_loaded_value: {
        en: '{c1} artists, {c2} albums and tracks',
        de: '{c1} Künstler:innen, {c2} Alben und Titel',
        es: '{c1} artistas, {c2} álbumes y temas',
        sv: '{c1} artister, {c2} album och låtar',
        ru: '{c1} исполнителей, {c2} альбомов и треков'
    },
    brand_version: {
        // used for the lotus header where:
        // brand = "lotus"
        // making: 'lotus version'
        en: '{brand} version',
        de: '{brand}-Version',
        es: '{brand} versión',
        pt: '{brand} versão',
        sv: '{brand} version',
        ru: '{brand} версии'
    },
    brand_version_number: {
        // used for the lotus header where:
        // brand = "lotus"
        // number = "2025.0507"
        // making: 'lotus version 2025.0507'
        en: '{brand} version {number}',
        de: '{brand}-Version {number}',
        es: '{brand} versión {number}',
        pt: '{brand} versão {number}',
        sv: '{brand} version {number}',
        ru: '{brand} версии {number}'
    },
    lotus: {
        artist: {
            en: 'Artist corrections',
            de: 'Künstler:innen-Korrekturen',
            es: 'Correcciones de artista',
            sv: 'Artistredigeringar',
            ru: 'Исправления артистов'
        },
        album_track: {
            en: 'Album and track corrections',
            de: 'Album- und Titel-Korrekturen',
            es: 'Correcciones de álbum y tema',
            sv: 'Album och spårredigeringar',
            ru: 'Исправления альбомов и треков'
        },
        combined_artists: {
            en: 'Combined artist profiles',
            de: 'Kombinierte Künstler:innen-Profile',
            es: 'Perfiles de artista combinados',
            sv: 'Kombinerade artistprofiler',
            ru: 'Объединенные профили артистов'
        }
    },
    correct_titles_with_lotus: {
        name: {
            en: 'Correct titles with lotus',
            de: 'Titel korrigieren mit lotus',
            es: 'Corregir títulos con lotus',
            pt: 'Corrigir títulos com lotus',
            sv: 'Redigera titlar med lotus',
            ru: 'Исправить названия с помощью lotus'
        },
        body: {
            en: 'Re-capitalise artists, albums, and tracks based on community contributions',
            de: 'Korrigiert die Schreibweise von Künstler:innen, Alben und Titeln basierend auf Community-Beiträgen',
            es: 'Recapitaliza artista, álbumes y temas con base en contribuciones de la comunidad',
            pt: 'Recapitalize artistas, álbuns e faixas com base nas contribuições da comunidade',
            sv: 'Ändra kapitalisering på artister, album, och låtar från gemenskapsbidrag',
            ru: 'Изменить написание артистов, альбомов и треков на основе вклада сообщества'
        }
    },
    prefer_no_redirect: {
        name: {
            en: 'Avoid artist redirects when navigating',
            de: 'Vermeide Künstler-Weiterleitungen beim Navigieren',
            es: 'Evitar redirecciones de artistas al navegar',
            pt: 'Evitar redirecionamentos de artistas ao navegar',
            sv: 'Undvik artistomdirigeringar när du surfar',
            ru: 'Избегать перенаправлений артистов при навигации'
        },
        body: {
            en: 'Automatically adds +noredirect to artist links to avoid being sent to pages like Travi$ Scott',
            de: 'Fügt automatisch +noredirect zu Künstler-Links hinzu, um zu vermeiden, dass du zu Seiten wie „Travi$ Scott“ weitergeleitet wirst',
            es: 'Añade automáticamente +noredirect a vínculos de artistas para evitar ser redireccionado a páginas como Travi$ Scott',
            pt: 'Adiciona automaticamente +noredirect em links de artistas para evitar ser redirecionado para páginas como Travi$ Scott',
            sv: 'Lägger automatiskt +noredirect på artistlänkar för att undvika att bli skickad till sidor som t.ex. Travi$ Scott',
            ru: 'Автоматически добавляет +noredirect к ссылкам артистов, чтобы избежать перенаправления на страницы типа Travi$ Scott'
        }
    },
    view_all: {
        en: 'View all',
        de: 'Alle ansehen',
        es: 'Ver todo',
        pt: 'Ver tudo',
        sv: 'Visa alla',
        ru: 'Посмотреть все'
    },
    help_contribute: {
        en: 'Help contribute',
        de: 'Helfe mit',
        es: 'Ayuda a contribuir',
        pt: 'Ajude a contribuir',
        sv: 'Bidra',
        ru: 'Помочь внести вклад'
    },
    delete: {
        en: 'Delete',
        de: 'Löschen',
        es: 'Eliminar',
        pt: 'Deletar',
        sv: 'Ta bort',
        ru: 'Удалить'
    },
    deleted: {
        en: 'Deleted',
        de: 'Gelöscht',
        es: 'Eliminado',
        pt: 'Deletado',
        sv: 'Borttagen',
        ru: 'Удалено'
    },
    search: {
        en: 'Search',
        de: 'Suchen',
        es: 'Buscar',
        pt: 'Pesquisar',
        sv: 'Sök',
        ru: 'Поиск'
    },
    search_guest: {
        en: 'Search guest appearances',
        de: 'Suche nach Features',
        es: 'Buscar apariciones especiales',
        pt: 'Pesquisar participações especiais',
        sv: 'Sök gästartister',
        ru: 'Поиск гостевых участий'
    },
    anything_you_can_imagine: {
        // placeholder for your about me
        en: 'Anything you can imagine...',
        de: 'Alles, was du dir vorstellen kannst ...',
        es: 'Cualquier cosa que puedas imaginar...',
        pt: 'Tudo que você pode imaginar...',
        sv: 'Vad som helst du kan föreställa dig...',
        ru: 'Все, что вы можете себе представить...'
    },
    supports_markdown: {
        // markdown: https://www.markdownguide.org/cheat-sheet/
        en: 'Supports Markdown',
        de: 'Unterstützt Markdown',
        es: 'Compatible con Markdown',
        pt: 'Suporta o Markdown',
        sv: 'Stöder Markdown',
        ru: 'Поддерживает Markdown',
        header: {
            name: {
                en: 'Header',
                de: 'Überschrift',
                es: 'Encabezado',
                sv: 'Rubrik',
                ru: 'Заголовок'
            },
            string: {
                en: '# hi!!',
                de: '# hallo!!',
                es: '# ¡¡hola!!',
                sv: '# hej!!',
                ru: '# привет!!'
            }
        },
        bold: {
            name: {
                en: 'Bold',
                de: 'Fett',
                es: 'Negrita',
                pt: 'Negrito',
                sv: 'Fet text',
                ru: 'Полужирный'
            },
            string: {
                en: '**bold**',
                de: '**Fett**',
                es: '**negrita**',
                pt: '**negrito**',
                sv: '**fet stil**',
                ru: '**полужирный**'
            }
        },
        italics: {
            name: {
                en: 'Italics',
                de: 'Kursiv',
                es: 'Cursiva',
                pt: 'Itálico',
                sv: 'Kursiv',
                ru: 'Курсив'
            },
            string: {
                en: '*slanted*',
                de: '*Kursiv*',
                es: '*inclinado*',
                pt: '*inclinado*',
                sv: '*kursiv*',
                ru: '*наклонный*'
            }
        },
        bold_italics: {
            name: {
                en: 'Bold italics',
                de: 'Fett kursiv',
                es: 'Negrita cursiva',
                pt: 'Negrito itálico',
                sv: 'Fet kursiv stil',
                ru: 'Полужирный курсив'
            },
            string: {
                en: '***slanted but bold***',
                de: '***Fett UND kursiv gleichzeitig!***',
                es: '**inclinado pero en negrita***',
                pt: '***inclinado, mas em negrito***',
                sv: '***fet och kursiv samtidigt***',
                ru: '***наклонный, но полужирный***'
            }
        },
        underlined: {
            name: {
                en: 'Underlined',
                de: 'Unterstrichen',
                es: 'Subrayado',
                pt: 'Sublinhado',
                sv: 'Understrykt',
                ru: 'Подчеркнутый'
            },
            string: {
                en: '__underlined__',
                de: '__Unterstrichen__',
                es: '__subrayado__',
                pt: '__sublinhado__',
                sv: '__understrykt__',
                ru: '__подчеркнутый__'
            }
        }
    },
    value_characters_max: {
        // number/max (24/100) of characters allowed in e.g. your bio
        en: '{v} characters max',
        de: 'Maximal {v} Zeichen',
        es: 'máximo {v} caracteres',
        pt: 'máximo de {v} caracteres',
        sv: 'max {v} tecken',
        ru: 'Максимум {v} символов'
    },
    profile_shortcut: {
        name: {
            en: 'Profile shortcut',
            de: 'Profilverknüpfung',
            es: 'Atajo de perfil',
            pt: 'Atalho de perfil',
            sv: 'Profilgenväg',
            ru: 'Ярлык профиля'
        },
        body: {
            en: 'View their scrobbles alongside yours at all times',
            de: 'Sehe deren Scrobbles jederzeit neben deinen an',
            es: 'Ve sus scrobblings junto a los tuyos en todo momento',
            pt: 'Veja os scrobbles dele(a) junto aos seus o tempo todo',
            sv: 'Visa deras skrobblingar bredvid dina hela tiden',
            ru: 'Просмотр их скробблов рядом с вашими всегда'
        },
        linked: {
            en: 'Linked with {u}',
            de: 'Verlinkt mit {u}',
            es: 'Vinculado con {u}',
            pt: 'Ligado com {u}',
            sv: 'Länkad ihop med {u}',
            ru: 'Связано с {u}'
        },
        notice: {
            en: 'You already have {u} as your shortcut, are you sure?',
            de: 'Du hast bereits {u} als deinen Shortcut festgelegt, bist du sicher?',
            es: 'Ya tienes {u} como tu atajo, ¿estás seguro?',
            pt: 'Você já tem {u} como seu atalho, você tem certeza?',
            sv: 'Du har redan {u} som din genväg, är du säker?',
            ru: 'У вас уже есть {u} в качестве ярлыка, вы уверены?'
        }
    },
    failed_to_find_profile: {
        en: 'Failed to find profile',
        de: 'Profil konnte nicht gefunden werden',
        es: 'Error al buscar el perfil',
        pt: 'Falha ao achar perfil',
        sv: 'Kunde ej hitta profilen',
        ru: 'Не удалось найти профиль'
    },
    replace: {
        en: 'Replace',
        de: 'Ersetzen',
        es: 'Substituir',
        pt: 'Substituir',
        sv: 'Ersätt',
        ru: 'Заменить'
    },
    view_others_library: {
        en: 'View others library',
        de: 'Bibliothek des anderen ansehen',
        es: 'Ver la colección de otros',
        pt: 'Ver a biblioteca dos outros',
        sv: 'Visa andra personers bibliotek',
        ru: 'Просмотр библиотеки других'
    },
    avatar_radius: {
        name: {
            en: 'Profile avatar shape',
            de: 'Form des Profilbildes',
            es: 'Forma del avatar del perfil',
            pt: 'Formato da imagem de perfil',
            sv: 'Profilbildsform',
            ru: 'Форма аватара профиля'
        },
        body: {
            en: 'Applies to all profiles, only visible to you',
            de: 'Gilt für alle Profile, nur für dich sichtbar',
            es: 'Aplica a todos los perfiles, solo visible para ti',
            sv: 'Tillämpas på alla profiler, syns bara för dig',
            ru: 'Применяется ко всем профилям, видно только вам'
        }
    },
    notes: {
        // profile notes
        en: 'Notes',
        de: 'Notizen',
        es: 'Anotaciones',
        pt: 'Notas',
        sv: 'Anteckningar',
        ru: 'Заметки'
    },
    no_notes: {
        // no profiles in your notes list
        en: 'No profiles here... (｡•́︿•̀｡)',
        de: 'Keine Profile hier... (｡•́︿•̀｡)',
        es: 'No hay perfiles aquí... (｡•́︿•̀｡)',
        pt: 'Sem perfis aqui... (｡•́︿•̀｡)',
        sv: 'Inga profiler här... (｡•́︿•̀｡)',
        ru: 'Здесь нет профилей... (｡•́︿•̀｡)'
    },
    font: {
        name: {
            en: 'Font choice',
            de: 'Schriftartauswahl',
            es: 'Selección de fuente',
            pt: 'Escolha de fonte',
            sv: 'Typsnitt',
            ru: 'Выбор шрифта'
        },
        body: {
            en: 'Choose a custom selection of fonts that suit you',
            de: 'Lege eine benutzerdefinierte Auswahl von Schriftarten fest, die zu dir passen',
            es: 'Elige una selección personalizada de fuentes que te agrade',
            pt: 'Selecione uma fonte customizada que te agrada',
            sv: 'Välj ett typsnitt som bäst passar dig',
            ru: 'Выберите пользовательский набор шрифтов, который вам подходит'
        }
    },
    font_style: {
        en: 'Font style',
        es: 'Estilo de fuente',
        sv: 'Typsnittsstil',
        ru: 'Стиль шрифта',
        solid: {
            en: 'Solid',
            es: 'Sólido',
            sv: 'Fast',
            ru: 'Сплошной'
        },
        pop: {
            en: 'Pop',
            es: 'Pop',
            sv: 'Poppande',
            ru: 'Яркий'
        },
        glow: {
            en: 'Glow',
            es: 'Brillo',
            sv: 'Glödande',
            ru: 'Свечение'
        }
    },
    font_weight: {
        name: {
            en: 'Font weight',
            de: 'Schriftstärke',
            es: 'Grueso de fuente',
            pt: 'Espessura da fonte',
            sv: 'Typsnittsvikt',
            ru: 'Толщина шрифта'
        },
        body: {
            en: 'Used for regular text paragraphs',
            de: 'Wird für normale Textabsätze verwendet',
            es: 'Usado en párrafos regulares de texto',
            pt: 'Usado para parágrafos regulares de texto',
            sv: 'Används för vanliga textstycke',
            ru: 'Используется для обычных текстовых абзацев'
        }
    },
    font_weight_medium: {
        name: {
            en: 'Medium font weight',
            de: 'Mittlere Schriftstärke',
            es: 'Grueso de fuente mediano',
            pt: 'Espessura média de fonte',
            sv: 'Mindre typsnittsvikt',
            ru: 'Средняя толщина шрифта'
        },
        body: {
            en: 'Used for button text and small headers',
            de: 'Wird für Schaltflächentext und kleine Überschriften verwendet',
            es: 'Usado en texto de botones y encabezados pequeños',
            pt: 'Usada para texto de botões e pequenos cabeçalhos',
            sv: 'Används för knappar och småa rubriker',
            ru: 'Используется для текста кнопок и небольших заголовков'
        }
    },
    font_weight_bold: {
        name: {
            en: 'Bold font weight',
            de: 'Große Schriftstärke',
            es: 'Grueso de fuente en negrita',
            pt: 'Espessura da fonte em negrito',
            sv: 'Fet typsnittsvikt',
            ru: 'Жирная толщина шрифта'
        },
        body: {
            en: 'Used for large headers',
            de: 'Wird für große Überschriften verwendet',
            es: 'Usado en encabezados grandes',
            pt: 'Usado para cabeçalhos grandes',
            sv: 'Används för stora rubriker',
            ru: 'Используется для больших заголовков'
        }
    },
    font_emoji: {
        name: {
            en: 'Emoji compatibility',
            de: 'Emoji-Kompatibilität',
            es: 'Compatibilidad de emojis',
            pt: 'Compatibilidade de emojis',
            sv: 'Emoji-kompatibilitet',
            ru: 'Совместимость с эмодзи'
        },
        body: {
            en: 'Required to render emoji properly before Windows 11',
            de: 'Erforderlich, um Emojis vor Windows 11 richtig darzustellen',
            es: 'Requerido para renderizar emojis correctamente antes de Windows 11',
            pt: 'Necessário para renderizar emojis corretamente antes do Windows 11',
            sv: 'Krävs för att visa emojis korrekt innan Windows 11',
            ru: 'Требуется для правильного отображения эмодзи до Windows 11'
        }
    },
    font_example: {
        // the trans flag is used to demonstrate the improper
        // emoji font found in windows 10, whether people like it or not
        //
        // this text is common sample text used in english,
        // if there's something more fitting for your language,
        // then feel free to adjust it
        //
        // not sure by what was meant by "fitting for your language"
        // but i used a sentence that has all letters on rus language, like an english example
        en: 'The quick brown fox jumps over the lazy dog 🏳️‍⚧️',
        es: 'El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón detrás del palenque de paja. 🏳️‍⚧️',
        sv: 'Flygande bäckasiner söka hwila på mjuka tuvor qxz 🏳️‍⚧️',
        ru: 'Съешь ещё этих мягких французских булок, да выпей чаю 🏳️‍⚧️'
    },
    enter_font_names: {
        en: 'Enter installed font name(s), separated by commas',
        de: 'Gebe die installierte Schriftart durch Kommas getrennt ein',
        es: 'Ingresa los nombres de fuentes instaladas, separados por comas',
        pt: 'Nomes das fontes instaladas, separados por vírgulas',
        sv: 'Skriv installerade typsnittsnamn, separerade av kommatecken',
        ru: 'Введите название(я) установленного(ых) шрифта(ов), разделяя запятыми'
    },
    change_now: {
        en: 'Change now',
        de: 'Jetzt ändern',
        es: 'Cambiar ahora',
        pt: 'Mudar agora',
        sv: 'Ändra nu',
        ru: 'Изменить сейчас'
    },
    profiles: {
        en: 'Profiles',
        de: 'Profile',
        es: 'Perfiles',
        pt: 'Perfis',
        sv: 'Profiler',
        ru: 'Профили'
    },
    redirections: {
        en: 'Redirections',
        de: 'Umleitungen',
        es: 'Redirecciones',
        pt: 'Redirecionamentos',
        sv: 'Omdirigeringar',
        ru: 'Перенаправления'
    },
    legacy_redirects: {
        name: {
            en: 'Legacy scrobble redirection',
            de: 'Legacy-Scrobble-Umleitung',
            es: 'Redirección de scrobblings clásica',
            pt: 'Redirecionamento de scrobble legado',
            sv: 'Legacy skrobbelomdirigeringar',
            ru: 'Устаревшее перенаправление скробблов'
        },
        body: {
            en: 'By default, scrobbles will be corrected to faulty replacements that are a decade out of date. Disabling does not fully fix the system but keeps artist names in your library intact.',
            de: 'Standardmäßig „korrigiert“ Last.fm einige deiner Scrobbles automatisch und führt (meist) fehlerhafte Weiterleitungen aus. Durch die Deaktivierung dieser Funktion wird das System zwar nicht vollständig repariert, die Künstlernamen in deiner Bibliothek bleiben jedoch erhalten.',
            es: 'Por defecto, los scrobblings serán sustituidos por correcciones erróneas que están desactualizadas desde hace una década. Desactivar esta opción no soluciona completamente el sistema pero mantiene los nombres de artistas en tu colección intactos.',
            pt: 'Por padrão, a Last.fm irá "corrigir automaticamente" alguns dos seus scrobbles para redirecionamentos (na maioria) defeituosos. Desativar essa opção não corrige completamente o sistema, mas mantém os nomes dos artistas na sua biblioteca intactos.',
            sv: 'Vanligtvis omdirigeras skrobblar till felersättningar som är över tio år gamla. Att avaktivera det fixar inte problemet totalt men artistnamn i ditt egna bibliotek visar rätt profil.',
            ru: 'По умолчанию скробблы будут исправлены на неисправные замены, которым уже десять лет. Отключение не полностью исправляет систему, но сохраняет имена артистов в вашей библиотеке нетронутыми.'
        }
    },
    redirect_messages: {
        name: {
            en: 'Remove page redirection notifications',
            de: 'Benachrichtigungen zur Seitenumleitung deaktivieren',
            es: 'Remover notificaciones de redirección de página',
            pt: 'Remover notificações de redirecionamento de página',
            sv: 'Ta bort omdirigeringsnotifikationer',
            ru: 'Удалить уведомления о перенаправлении страницы'
        },
        body: {
            en: 'These notifications can let you undo redirections Last.fm forced upon you, but can also be annoying',
            de: 'Mit diesen Benachrichtigungen kannst du die von Last.fm erzwungenen Weiterleitungen rückgängig machen, sie können aber auch lästig sein',
            es: 'Estas notificaciones te permiten deshacer redirecciones que Last.fm fuerza ante ti, pero pueden llegar a ser molestas',
            pt: 'Essas notificações podem permitir que você desfaça redirecionamentos que a Last.fm impôs a você, mas também podem ser irritantes',
            sv: 'Dessa notiser låter dig ångra omdirigeringar Last.fm tvingade på dig, men dem kan också vara störande',
            ru: 'Эти уведомления могут позволить вам отменить перенаправления, навязанные Last.fm, но также могут быть раздражающими'
        }
    },
    colourful_counts: {
        name: {
            en: 'Rank-based colours for artist charts',
            de: 'Rangbasierte Farben für Künstlerdiagramme',
            es: 'Colores basados en rankings para la lista de artistas',
            pt: 'Cores baseadas em classificação para paradas de artistas',
            sv: 'Rangbaserade färger för artistlistor',
            ru: 'Цвета на основе ранга для чартов артистов'
        },
        body: {
            en: 'Assigns a colour based on an artist’s all-time ranking in your library',
            de: 'Weist eine Farbe basierend auf dem Allzeit-Ranking eines Künstlers in deiner Bibliothek zu',
            es: 'Asigna colores basados en el ranking de artistas más escuchados en tu colección',
            pt: 'Define uma cor pela colocação do artista no ranking geral da sua biblioteca',
            sv: 'Tillämpar en färg baserad på en artists alltidsranking i ditt bibliotek',
            ru: 'Назначает цвет в зависимости от общего рейтинга артиста в вашей библиотеке'
        }
    },
    glacier_graphs: {
        name: {
            en: 'Visualise scrobble graphs better',
            de: 'Scrobble-Diagramme besser visualisieren',
            es: 'Mejor visualización para los gráficos de scrobblings',
            pt: 'Visualize melhor os gráficos de scrobble',
            sv: 'Bättre visualisera skrobbeldiagram',
            ru: 'Лучше визуализировать графики скробблов'
        },
        body: {
            en: 'Choose between a tiny delay for a wide range of graph options or legacy Last.fm graphs',
            de: 'Wähle zwischen einer kleinen Verzögerung für eine breitere Palette von Diagrammoptionen oder den älteren Last.fm-Diagrammen',
            es: 'Elige entre un pequeño retraso para un mayor rango de opciones de gráficos o los gráficos clásicos de Last.fm',
            pt: 'Escolha entre um pequeno atraso para ter mais opções de gráficos ou usar os gráficos clássicos da Last.fm',
            sv: 'Välj mellan en liten fördröjning för en stor mängd olika diagramalternativ eller använd äldre Last.fm-diagram',
            ru: 'Выберите между небольшой задержкой для широкого спектра опций графика или устаревшими графиками Last.fm'
        }
    },
    gendered_tags: {
        name: {
            en: 'Hide gender-based tags',
            de: 'Geschlechtsspezifische Tags ausblenden',
            es: 'Ocultar tags basados en género',
            pt: 'Esconder tags baseadas em gênero',
            sv: 'Göm könsbaserade taggar',
            ru: 'Скрыть теги, основанные на гендере'
        },
        body: {
            en: 'These tags are often redundant and can never apply to the full range they’re intending',
            de: 'Diese Tags sind oft überflüssig und können nie auf die gesamte Bandbreite angewendet werden, die sie beabsichtigen',
            es: 'Estos tags son normalmente redundantes y nunca consiguen representar al completo el rango que intentan',
            pt: 'Essas tags costumam ser redundantes e nunca conseguem representar totalmente tudo o que se propõem',
            sv: 'Dessa taggar är ofta överflödiga och gäller inte alltid för allt dem är tänkta att täcka',
            ru: 'Эти теги часто избыточны и не могут быть применены ко всему диапазону, который они подразумевают'
        }
    },
    artwork_and_grids: {
        en: 'Artwork and grids',
        de: 'Albencover und Raster',
        es: 'Cáratulas y cuadrículas',
        pt: 'Capas e grades',
        sv: 'Albumkonst och rutnät',
        ru: 'Обложки и сетки'
    },
    gloss: {
        name: {
            en: 'Apply gloss to album covers',
            de: 'Glanz auf Albumcover anwenden',
            es: 'Aplicar brillo a las cáratulas',
            pt: 'Aplique relevo nas capas dos álbuns',
            sv: 'Lägg till ett sken på albumkonst',
            ru: 'Применить глянец к обложкам альбомов'
        },
        body: {
            en: 'Add a layer of shine to album covers globally',
            de: 'Fügt allen Albumcovern einen Glanzeffekt hinzu',
            es: 'Añade una capa de brillo a todas las cáratulas',
            pt: 'Adicione um toque de brilho em todas as capas de álbuns',
            sv: 'Lägger till ett glansigt lager på all albumkonst',
            ru: 'Добавить слой блеска на обложки альбомов по всему сайту'
        }
    },
    grid_glow: {
        name: {
            en: 'Reflect colour below grid items',
            de: 'Farbe unter Rasterobjekten reflektieren',
            es: 'Reflejar color debajo de los ítems en la cuadrícula',
            pt: 'Refletir a cor abaixo dos itens da grade',
            sv: 'Reflektera färg under rutnätsobjekt',
            ru: 'Отражать цвет под элементами сетки'
        },
        body: {
            en: 'Applies a glow below grid items based on the primary colour',
            de: 'Fügt einen Glanzeffekt unter Rasterobjekten hinzu, der auf der Primärfarbe basiert',
            es: 'Aplica un brillo debajo de los ítems en la cuadrícula con base en el color primario',
            pt: 'Aplica um brilho abaixo dos itens da grade com base na cor primária',
            sv: 'Lägger till färg under rutnätsobjekt som är baserad på den primära färgen',
            ru: 'Применяет свечение под элементами сетки на основе основного цвета'
        }
    },
    skip_to: {
        // skipping to sections in settings
        en: 'Skip to',
        de: 'Springe zu',
        es: 'Saltar a',
        pt: 'Ir até',
        sv: 'Hoppa till',
        ru: 'Перейти к'
    },
    information: {
        en: 'Information',
        de: 'Information',
        es: 'Información',
        pt: 'Informação',
        sv: 'Information',
        ru: 'Информация'
    },
    username: {
        name: {
            en: 'Username',
            de: 'Benutzername',
            es: 'Nombre de usuario',
            pt: 'Nome de usuário',
            sv: 'Användarnamn',
            ru: 'Имя пользователя'
        },
        body: {
            en: 'To change your username hit the button to send an email. Having problems? {a}contact support{/a}.',
            de: 'Um deinen Benutzernamen zu ändern, klicke auf die Schaltfläche „E-Mail senden“. Gibt es Probleme? {a}Kontaktiere den Support{/a}.',
            es: 'Para cambiar tu nombre de usuario, haz clic al botón para enviar un correo electrónico. ¿Algún problema? {a}contacta a soporte{/a}.',
            pt: 'Para alterar seu nome de usuário, clique no botão para enviar um e-mail. Está com problemas? {a}contact support{/a}.',
            sv: 'För att ändra ditt användarnamn, tryck på knappen för att skicka mejl. Har du ett problem? {a}Kontakta support{/a}.',
            ru: 'Чтобы изменить имя пользователя, нажмите кнопку для отправки электронного письма. Возникли проблемы? {a}Свяжитесь со службой поддержки{/a}.'
        }
    },
    email: {
        en: 'Email',
        de: 'E-Mail',
        es: 'Correo electrónico',
        pt: 'E-mail',
        sv: 'Mejladress',
        ru: 'Электронная почта'
    },
    password: {
        en: 'Password',
        de: 'Passwort',
        es: 'Contraseña',
        pt: 'Senha',
        sv: 'Lösenord',
        ru: 'Пароль'
    },
    new_password: {
        en: 'New password',
        de: 'Neues Passwort',
        es: 'Nueva contraseña',
        pt: 'Nova senha',
        sv: 'Nytt lösenord',
        ru: 'Новый пароль'
    },
    confirm_password: {
        en: 'Confirm password',
        de: 'Passwort bestätigen',
        es: 'Confirmar contraseña',
        pt: 'Confirmar senha',
        sv: 'Verifiera lösenord',
        ru: 'Подтвердите пароль'
    },
    change: {
        en: 'Change',
        de: 'Ändern',
        es: 'Cambiar',
        pt: 'Mudar',
        sv: 'Ändra',
        ru: 'Изменить'
    },
    marketing_emails: {
        name: {
            en: 'Marketing emails',
            de: 'Marketing-E-Mails',
            es: 'Correos electrónicos de marketing',
            pt: 'E-mails promocionais',
            sv: 'Marknadsföringsmejl',
            ru: 'Маркетинговые рассылки'
        },
        body: {
            en: 'Last.fm can optionally send promotional emails from time to time',
            de: 'Last.fm kann optional gelegentlich Werbe-E-Mails senden',
            es: 'Last.fm puede opcionalmente mandarte correos electrónicos promocionales de vez en cuando',
            pt: 'A Last.fm pode, opcionalmente, enviar e-mails promocionais de tempos em tempos',
            sv: 'Last.fm kan valfritt skicka reklammejl då och då',
            ru: 'Last.fm может по желанию время от времени отправлять рекламные электронные письма'
        }
    },
    email_language: {
        en: 'Email language',
        de: 'E-Mail-Sprache',
        es: 'Idioma de correos electrónicos',
        pt: 'Idioma dos e-mails',
        sv: 'Mejlspråk',
        ru: 'Язык электронных писем'
    },
    communication: {
        en: 'Communication',
        de: 'Kommunikation',
        es: 'Comunicación',
        pt: 'Comunicação',
        sv: 'Kommunikation',
        ru: 'Коммуникация'
    },
    security: {
        en: 'Security',
        de: 'Sicherheit',
        es: 'Seguridad',
        pt: 'Segurança',
        sv: 'Sekretess',
        ru: 'Безопасность'
    },
    logout_everywhere: {
        en: 'Logout on all devices',
        de: 'Auf allen Geräten abmelden',
        es: 'Cerrar sesión en todos los dispostivos',
        pt: 'Encerrar sessão em todos os dispositivos',
        sv: 'Logga ut från alla enheter',
        ru: 'Выйти из всех устройств'
    },
    delete_account: {
        name: {
            en: 'Delete account',
            de: 'Konto löschen',
            es: 'Eliminar cuenta',
            pt: 'Deletar conta',
            sv: 'Ta bort konto',
            ru: 'Удалить аккаунт'
        },
        body: {
            en: 'Deletion will take 14 days to complete, after this time your account will either be deleted, anonymised, or put beyond use and cannot be recovered. Once deleted, your username will no longer be available.',
            de: 'Die Löschung dauert 14 Tage. Nach Ablauf dieser Frist wird dein Konto entweder gelöscht, anonymisiert, oder unbrauchbar gemacht und kann nicht wiederhergestellt werden. Nach der Löschung ist dein Benutzername nicht mehr verfügbar.',
            es: 'La eliminación tardará 14 días en completarse. Después de ese periodo, tu cuenta será eliminada, anonimizada, o se pondrá fuera de uso y no podrá recuperarse. Una vez eliminada, tu nombre de usuario ya no estará disponible.',
            pt: 'A exclusão levará 14 dias para ser concluída. Após esse período, sua conta será excluída, anonimizada ou desativada, e não poderá ser recuperada. Depois de excluído, seu nome de usuário não estará mais disponível.',
            sv: 'Det tar 14 dagar att ta bort ditt konto. Efter denna tid blir dit konto antingen borttaget, anonymiserad, eller görs oanvändbar och kan inte fås tillbaka. När det är borttaget kan ditt användarnamn inte bli använt igen.',
            ru: 'Удаление займет 14 дней. По истечении этого времени ваша учетная запись будет либо удалена, либо анонимизирована, либо выведена из эксплуатации и не может быть восстановлена. После удаления ваше имя пользователя больше не будет доступно.'
        }
    },
    delete_account_permanently: {
        en: 'Delete {u} permanently',
        de: '{u} dauerhaft löschen',
        es: 'Eliminar {u} permanentemente',
        pt: 'Deletar {u} permanentemente',
        sv: 'Ta bort {u} permanent',
        ru: 'Удалить {u} навсегда'
    },
    other: {
        // "other" section in settings
        en: 'Other',
        de: 'Sonstiges',
        es: 'Otro',
        pt: 'Outro',
        sv: 'Annat',
        ru: 'Другое'
    },
    applications: {
        en: 'Applications',
        es: 'Aplicaciones',
        sv: 'Applikationer',
        ru: 'Приложения'
    },
    applications_intro: {
        en: 'Connect your account to third-party services for a better scrobbling experience. Make sure you trust the services below.',
        es: 'Conecta tu cuenta a servicios externos para una mejor experiencia al hacer scrobbling. Asegúrate de que confías en los servicios que hay debajo.',
        sv: 'Anslut ditt konto till tredjepartstjänster för bättre skrobblingsupplevelse. Var säker på att du litar på nedre tjänster',
        ru: 'Подключите свой аккаунт к сторонним сервисам для лучшего скробблинга. Убедитесь, что вы доверяете указанным ниже сервисам.'
    },
    connect_app: {
        en: 'Connect {name}',
        de: 'Verbinde {name}',
        es: 'Conectar {name}',
        pt: 'Conectar {name}',
        sv: 'Anslut {name}',
        ru: 'Подключить {name}'
    },
    connect: {
        en: 'Connect',
        de: 'Verbinden',
        es: 'Conectar',
        pt: 'Conectar',
        sv: 'Anslut',
        ru: 'Подключить'
    },
    suggested: {
        en: 'Suggested',
        es: 'Sugerido',
        sv: 'Föreslaget',
        ru: 'Предложенные'
    },
    connected: {
        en: 'Connected',
        de: 'Verbunden',
        es: 'Conectado',
        pt: 'Conectado',
        sv: 'Anslutit',
        ru: 'Подключено'
    },
    not_connected: {
        en: 'Not connected',
        de: 'Nicht verbunden',
        es: 'No conectado',
        pt: 'Não conectado',
        sv: 'Inte ansluten',
        ru: 'Не подключено'
    },
    api: {
        name: {
            en: 'Unlock additional API features',
            de: 'Schalte zusätzliche API-Funktionen frei',
            es: 'Desbloquea funciones adicionales de API',
            pt: 'Desbloqueie recursos adicionais da API',
            sv: 'Lås upp flera API-funktioner',
            ru: 'Разблокировать дополнительные функции API'
        },
        body: {
            en: 'Link your account to allow API access such as scrobbling',
            de: 'Verknüpfe dein Konto, um API-Zugriffe wie Scrobbling zu ermöglichen',
            es: 'Conecta tu cuenta para permitir el acceso a la API, como el scrobbling',
            pt: 'Conecte sua conta para permitir o acesso à API, como o scrobbling',
            sv: 'Koppla ditt konto för att tillåta API-åtkomster, som att skrobbla',
            ru: 'Привяжите свой аккаунт, чтобы разрешить доступ к API, например, для скробблинга'
        }
    },
    api_status: {
        en: 'API status',
        de: 'API-Status',
        es: 'Estatus de API',
        pt: 'Status da API',
        sv: 'API-status',
        ru: 'Статус API'
    },
    app_would_like_to_connect: {
        // app name is above
        en: 'would like to use your account',
        de: 'möchte sich mit deinem Konto verbinden',
        es: 'quiere usar tu cuenta',
        pt: 'gostaria de usar sua conta',
        sv: 'vill använda ditt konto',
        ru: 'хочет использовать ваш аккаунт'
    },
    logged_in_as: {
        en: 'Logged in as {user}',
        de: 'Angemeldet als {user}',
        es: 'Conectado como {user}',
        pt: 'Conectado como {user}',
        sv: 'Loggat in som {user}',
        ru: 'Вы вошли как {user}'
    },
    not_logged_in: {
        en: 'Not logged in',
        de: 'Nicht angemeldet',
        es: 'No conectado',
        pt: 'Não conectado',
        sv: 'Inte inloggad',
        ru: 'Не в системе'
    },
    ensure_you_trust: {
        // API applications
        // last.fm/settings/applications
        en: 'Make sure you trust this application',
        de: 'Stelle sicher, dass du dieser Anwendung vertraust',
        es: 'Asegúrate de que confías en esta aplicación',
        pt: 'Certifique-se de que você confia neste aplicativo',
        sv: 'Var säker på att du litar denna applikation',
        ru: 'Убедитесь, что вы доверяете этому приложению'
    },
    has_been_connected: {
        // app name is above
        en: 'has been connected',
        de: 'wurde verbunden',
        es: 'ha sido conectado',
        pt: 'foi conectado',
        sv: 'har anslutits',
        ru: 'было подключено'
    },
    you_can_now_close_this_tab: {
        en: 'You can now close this tab',
        de: 'Du kannst diesen Tab jetzt schließen',
        es: 'Puedes cerrar esta ventana',
        pt: 'Você pode fechar esta aba agora',
        sv: 'Du kan nu stänga den här fliken',
        ru: 'Теперь вы можете закрыть эту вкладку'
    },
    manage_applications: {
        // API applications
        // last.fm/settings/applications
        en: 'Manage applications',
        de: 'Anwendungen verwalten',
        es: 'Gestionar aplicaciones',
        pt: 'Gerenciar aplicações',
        sv: 'Hantera applikationer',
        ru: 'Управление приложениями'
    },
    markdown_profiles: {
        name: {
            en: 'Use fancy formatting on profiles',
            de: 'Verwende schönere Formatierungen für Profile',
            es: 'Usar formato elegante en los perfiles',
            pt: 'Usar formatação estilosa nos perfis',
            sv: 'Använd snygg formatering på profiler',
            ru: 'Использовать расширенное форматирование в профилях'
        },
        body: {
            en: 'Allows the use of line breaks, bold text, italics, and images in all “About Me” panels',
            de: 'Ermöglicht die Verwendung von Zeilenumbrüchen, fettem Text, Kursivschrift und Bildern in allen „Über mich“-Bereichen',
            es: 'Permite el uso de saltos de línea, negrita, cursiva, e imágenes en todos los paneles "Sobre mí"',
            pt: 'Permite o uso de quebras de linha, texto em negrito, itálico e imagens em todos os painéis “Sobre mim”',
            sv: 'Tillåter radbrytning, fet stil, kursiv stil, och bilder inom alla “Om mig”-paneler',
            ru: 'Разрешает использование переносов строк, жирного текста, курсива и изображений во всех панелях «Обо мне»'
        }
    },
    markdown_shouts: {
        name: {
            en: 'Use fancy formatting on shouts',
            de: 'Verwende schönere Formatierungen für Shouts',
            es: 'Usar formato elegante en las notas',
            pt: 'Usar formatação estilosa nas caixas de mensagens',
            sv: 'Använd snygg formatering på hojtningar',
            ru: 'Использовать расширенное форматирование в шаутах'
        },
        body: {
            en: 'Allows the use of line breaks, bold text, italics, and images in all shouts',
            de: 'Ermöglicht die Verwendung von Zeilenumbrüchen, fettem Text, Kursivschrift und Bildern in allen Shouts',
            es: 'Permite el uso de saltos de línea, negrita, cursiva, e imágenes en todas las notas',
            pt: 'Permite o uso de quebras de linha, texto em negrito, itálico e imagens em todas as caixas de mensagens',
            sv: 'Tillåter radbrytning, fet stil, kursiv stil, och bilder inom alla hojtningar',
            ru: 'Разрешает использование переносов строк, жирного текста, курсива и изображений во всех шаутах'
        },
        preview: {
            en: 'hello! **hello!** *hello!*\n[here’s a link](https://katelyn.moe) HAII @evangelicgirl',
            de: 'hallo! **hallo!** *hallo!*\n[hier ist ein link](https://katelyn.moe) HALLÖCHEN @evangelicgirl',
            es: '¡hola! **¡hola!** *¡hola!*\n[aquí hay un vínculo](https://katelyn.moe) HOLII @evangelicgirl',
            pt: 'oi! **olá!** *opa!*\n[aqui está um link](https://katelyn.moe) OIEE @evangelicgirl',
            sv: 'hej! **hej!** *hej!*\n[här är en länk](https://katelyn.moe) HEJJ @evangelicgirl',
            ru: 'привет! **привет!** *привет!*\n[вот ссылка](https://katelyn.moe) ПРИВЕТ @evangelicgirl'
        }
    },
    gathering_your_plays: {
        en: 'Gathering your album plays',
        de: 'Sammeln deiner Albumwiedergaben',
        es: 'Recopilando tus reproducciones de álbumes',
        pt: 'Coletando suas reproduções de álbuns',
        sv: 'Samlar dina albumspelningar',
        ru: 'Собираем ваши прослушивания альбомов'
    },
    failed_to_find_tracks: {
        en: 'You do not have any plays',
        de: 'Du hast keine Plays',
        es: 'No tienes ninguna reproducción',
        pt: 'Você não tem nenhuma reprodução',
        sv: 'Du har inga spelningar',
        ru: 'У вас нет прослушиваний'
    },
    own_plays: {
        // tracklist source menu option that enables the thing below
        en: 'Own plays',
        es: 'Reproducciones personales',
        sv: 'Egna spelningar',
        ru: 'Собственные прослушивания'
    },
    sourced_from_own_plays: {
        // tracklist from your own album plays
        en: 'Sourced from your own plays as an official tracklist is unavailable',
        de: 'Diese Liste basiert auf deinen eigenen Plays, da keine offizielle Titelliste verfügbar ist',
        es: 'Extraído de tus reproducciones personales, debido a que la lista de temas oficial no está disponible',
        pt: 'Baseado nas suas próprias reproduções, pois a tracklist oficial não está disponível',
        sv: 'Hämtas från dina egna spelningar för en officiell spellista finns inte',
        ru: 'Получено из ваших собственных прослушиваний, так как официальный треклист недоступен'
    },
    submit_language: {
        name: {
            en: 'Are you fluent in a supported language?',
            de: 'Sprichst du eine der unterstützten Sprachen fließend?',
            es: '¿Eres fluido en un idioma compatible?',
            pt: 'Você é fluente em algum dos idiomas suportados?',
            sv: 'Talar du ett språk som stöds flytande?',
            ru: 'Свободно ли вы говорите на одном из поддерживаемых языков?'
        },
        body: {
            en: 'Translations are powered by community contributions from wonderful people like you',
            de: 'Übersetzungen werden durch Beiträge der Community von wunderbaren Menschen wie dir ermöglicht',
            es: 'Las traducciones son posibles gracias a contribuiciones de la comunidad por gente maravillosa como tú',
            pt: 'As traduções são feitas graças às contribuições da comunidade de pessoas incríveis como você',
            sv: 'Översättningar drivs av bidrag från underbara folk som du',
            ru: 'Переводы обеспечиваются вкладом сообщества от замечательных людей, таких как вы'
        }
    },
    welcome_to_bleh: {
        // <br> is a line break
        en: 'Welcome to bleh, thank you for installing!<br>You can continue through this quick setup to get you started or skip right to your profile and figure it all out yourself <3',
        de: 'Willkommen bei bleh, danke für die Installation!<br>Du kannst diesen schnellen Einrichtungsassistenten durchlaufen, um loszulegen, oder direkt zu deinem Profil springen und alles selbst herausfinden <3',
        es: '¡Bienvenido a bleh, gracias por instalar!<br>Puedes continuar con la instalación para ayudarte a empezar o puedes saltar directamente a tu perfil y averiguar por ti mismo <3',
        pt: 'Bem-vindo ao bleh, obrigado por instalar!<br>Você pode seguir este rápido guia de configuração para começar, ou pular direto para seu perfil e descobrir tudo por conta própria <3',
        sv: 'Välkommen till bleh, tack för att du har installerat!<br>Du kan fortsätta genom den här snabba setupen för att starta eller hoppa rakt till din profil och klura ut det helt själv <3',
        ru: 'Добро пожаловать в bleh, спасибо за установку!<br>Вы можете пройти эту быструю настройку, чтобы начать, или сразу перейти к своему профилю и разобраться во всем самостоятельно <3'
    },
    next: {
        en: 'Next',
        de: 'Weiter',
        es: 'Siguiente',
        pt: 'Próximo',
        sv: 'Nästa',
        ru: 'Далее'
    },
    choose_a_theme: {
        en: 'Choose a theme that suits you best!',
        de: 'Wähle ein Farbschema, das am besten zu dir passt!',
        es: '¡Elige el aspecto que más te guste!',
        pt: 'Escolha o tema que mais combina com você',
        sv: 'Välj ett tema som passar dig bäst!',
        ru: 'Выберите тему, которая подходит вам больше всего!'
    },
    accessibility_explain: {
        en: 'Before we continue, let’s assess your accessibility settings.',
        de: 'Lass uns kurz deine Barrierefreiheitseinstellungen überprüfen, bevor wir weitermachen.',
        es: 'Antes de continuar, comprobemos tu configuración de accesibilidad.',
        pt: 'Antes de continuarmos, vamos acessar suas configurações de acessibilidade.',
        sv: 'Innan vi fortsätter ska vi kontrollera dina tillgänglighetsinställningar.',
        ru: 'Прежде чем продолжить, давайте оценим ваши настройки доступности.'
    },
    colours_explain: {
        en: 'Choose a colour you like or make your own favourite.',
        de: 'Wähle eine Farbe, die dir gefällt, oder lege deine eigene Lieblingsfarbe fest.',
        es: 'Elige un color que te guste o haz tu propio favorito.',
        pt: 'Escolha uma cor que você goste ou crie a sua favorita.',
        sv: 'Välj en färg du tycker om eller gör din egna favorit.',
        ru: 'Выберите цвет, который вам нравится, или создайте свой любимый.'
    },
    music_explain: {
        en: 'We offer a variety of options to help you manage your music library.',
        de: 'Wir bieten eine Vielzahl von Optionen, um dir bei der Verwaltung deiner Musikbibliothek zu helfen.',
        es: 'Ofrecemos una variedad de opciones para ayudarte a manejar tu colección de música.',
        pt: 'Nós oferecemos uma variedade de opções para ajudar você a gerenciar sua biblioteca musical.',
        sv: 'Vi har massa olika inställningar för att hjälpa till att ordna ditt musikbibliotek.',
        ru: 'Мы предлагаем множество опций, чтобы помочь вам управлять вашей музыкальной библиотекой.'
    },
    setup_end: {
        en: 'That’s all for now, to configure your bleh installation in the future head to {a}the settings{/a} in your menu!',
        de: 'Das war’s fürs Erste. Um deine bleh-Installation in Zukunft zu konfigurieren, gehe zu {a}den Einstellungen{/a} in deinem Menü!',
        es: '¡Eso es todo por ahora, para modificar tu instalación de bleh en el futuro, ve a {a}la configuración{/a} en tu menú!',
        pt: 'Por enquanto isso é tudo, para configurar sua instalação do bleh futuramente, vá até {a}nas configurações{/a} no seu menu!',
        sv: 'Det var allt just nu, för att konfigurera din bleh-installation i framtiden gå in på {a}inställningarna{/a} i menyn!',
        ru: 'На этом пока все, чтобы настроить вашу установку bleh в будущем, перейдите в {a}настройки{/a} в вашем меню!'
    },
    seasonal_particles: {
        name: {
            en: 'Show particles during select seasons',
            de: 'Partikel während ausgewählter Jahreszeiten anzeigen',
            es: 'Mostrar partículas durante temporadas específicas',
            pt: 'Mostrar particulas durante estações selecionadas',
            sv: 'Visa partiklar under vissa årstider',
            ru: 'Показывать частицы в определенные сезоны'
        },
        body: {
            en: 'During colder seasons, watch pretty snowflakes fall ⋆⁺₊❅。',
            de: 'Während der kälteren Jahreszeiten kannst du hübsche Schneeflocken fallen sehen ⋆⁺₊❅。',
            es: 'Durante temporadas más frías, mira cómo caen lindos copos de nieve ⋆⁺₊❅。',
            pt: 'Durante as sessões de inverno, veja flocos de neve bonitinhos caindo ⋆⁺₊❅。',
            sv: 'Under kyligare årstider, se vackra snöflingorna glida sakta ner ⋆⁺₊❅。',
            ru: 'В холодное время года наблюдайте за падающими красивыми снежинками ⋆⁺₊❅。'
        }
    },
    all_particles: {
        en: 'Show full particles',
        de: 'Alle Partikel anzeigen',
        es: 'Mostrar todas las partículas',
        pt: 'Mostrar todas as partículas',
        sv: 'Visa fulla partiklar',
        ru: 'Показывать все частицы'
    },
    less_particles: {
        en: 'Show less particles',
        de: 'Weniger Partikel anzeigen',
        es: 'Mostrar menos partículas',
        pt: 'Mostrar menos partículas',
        sv: 'Visa mindre partiklar',
        ru: 'Показывать меньше частиц'
    },
    no_particles: {
        en: 'Disable particles',
        de: 'Partikel deaktivieren',
        es: 'Desactivar partículas',
        pt: 'Desativar partículas',
        sv: 'Stäng av partiklar',
        ru: 'Отключить частицы'
    },
    beware_notice: {
        en: 'Beware! Only change these settings if you know what you’re doing',
        de: 'Vorsicht! Ändere diese Einstellungen nur, wenn du weißt, was du tust',
        es: '¡Cuidado! Cambia estas opciones solo si sabes lo que haces',
        pt: 'Cuidado! Apenas mude estas configurações se você sabe o que você está fazendo',
        sv: 'Var försiktig! Ändra bara dessa inställningar om du vet vad du gör',
        ru: 'Осторожно! Меняйте эти настройки только если вы знаете, что делаете'
    },
    force_refresh_style: {
        name: {
            en: 'Force re-download styles',
            de: 'Erneutes Herunterladen von Stylesheets erzwingen',
            es: 'Forzar redescarga de los estilos',
            pt: 'Forçar o re-download dos estilos',
            sv: 'Tvinga omladdning av stiler',
            ru: 'Принудительно перезагрузить стили'
        },
        body: {
            en: 'Deletes your current cache of the bleh stylesheet and retrieves the latest',
            de: 'Löscht deinen aktuellen Cache des bleh-Stylesheets und lädt die neueste Version herunter',
            es: 'Elimina tu cache actual de la hoja de estilo de bleh y extrae la versión más reciente',
            pt: 'Exclui o cache atual da folha de estilo do bleh e recupera a versão mais recente',
            sv: 'Tar bort din nuvarande cache av bleh-stil och hämtar hem den senaste',
            ru: 'Удаляет ваш текущий кэш таблицы стилей bleh и загружает последнюю версию'
        }
    },
    intended_for_development: {
        name: {
            en: 'This page is intended for development',
            de: 'Diese Seite ist für die Entwicklung gedacht',
            es: 'Esta página es usada para el desarrollo',
            sv: 'Denna sida är avsedd för utveckling',
            ru: 'Эта страница предназначена для разработки'
        },
        body: {
            en: 'Be careful with options here (especially feature flags) as they can break your install.',
            de: 'Sei vorsichtig mit diesen Einstellungen (besonders mit den Feature Flags), da sie deine Installation beschädigen können.',
            es: 'Ten cuidado con las opciones aquí (especialmente las feature flags) ya que pueden romper tu instalación.',
            pt: 'Tenha cuidado com as opções aqui (especialmente com os flags de recursos), pois elas podem causar problemas na sua instalação.',
            sv: 'Var försiktig med inställningarna här (speciellt funktionsflaggor) eftersom dom kan förstöra din installation.',
            ru: 'Будьте осторожны с опциями здесь (особенно с флагами функций), так как они могут нарушить работу вашей установки.'
        }
    },
    flags: {
        // shorthand for below
        en: 'Flags',
        de: 'Flags',
        es: 'Flags',
        sv: 'Flaggor',
        ru: 'Флаги'
    },
    manage_feature_flags: {
        // feature flags control features (like an option)
        en: 'Manage feature flags',
        de: 'Feature Flags verwalten',
        es: 'Gestionar feature flags',
        pt: 'Gerenciar flags de recursos',
        sv: 'Hantera funktionsflaggor',
        ru: 'Управление флагами функций'
    },
    development: {
        en: 'Development',
        de: 'Entwicklung',
        es: 'Desarrollo',
        pt: 'Desenvolvimento',
        sv: 'Utveckling',
        ru: 'Разработка'
    },
    this_section_requires_password: {
        en: 'This section requires a password to view',
        de: 'Dieser Bereich benötigt ein Passwort zum Ansehen',
        es: 'Esta sección requiere una contraseña para ver',
        pt: 'Esta seção requer uma senha para ser visualizada',
        sv: 'Denna avdelning behöver ett lösenord för att se',
        ru: 'Для просмотра этого раздела требуется пароль'
    },
    enter_password: {
        en: 'Enter password',
        de: 'Passwort eingeben',
        es: 'Ingresar contraseña',
        pt: 'Digite a senha',
        sv: 'Skriv in lösenord',
        ru: 'Введите пароль'
    },
    unlocked: {
        en: 'Unlocked',
        de: 'Freigeschaltet',
        es: 'Desbloqueado',
        pt: 'Desbloqueado',
        sv: 'Upplåst',
        ru: 'Разблокировано'
    },
    privacy: {
        en: 'Privacy',
        de: 'Datenschutz',
        es: 'Privacidad',
        pl: 'Prywatność',
        pt: 'Privacidade',
        sv: 'Sekretess',
        ru: 'Конфиденциальность'
    },
    recent_listening: {
        name: {
            en: 'Hide your recent listening history',
            de: 'Deine zuletzt gehörten Titel ausblenden',
            es: 'Ocultar tu historial de reproducciones reciente',
            pt: 'Ocultar seu histórico de scrobbles recente',
            sv: 'Göm senaste lyssnarinformationen',
            ru: 'Скрыть вашу недавнюю историю прослушиваний'
        },
        body: {
            en: 'Keeps your activity more private',
            de: 'Gibt deiner Aktivität mehr Privatsphäre',
            es: 'Mantiene tu actividad más privada',
            pt: 'Mantém sua atividade mais privada',
            sv: 'Håller din aktivitet mer privat',
            ru: 'Делает вашу активность более приватной'
        }
    },
    allow_messages_from: {
        en: 'Allow messages from',
        de: 'Erlaube Nachrichten von',
        es: 'Permitir mensajes de',
        pt: 'Permitir mensagens de',
        sv: 'Tillåt meddelanden ifrån',
        ru: 'Разрешить сообщения от'
    },
    everyone: {
        en: 'Everyone',
        de: 'Jedem',
        es: 'Cualquiera',
        pt: 'Todo mundo',
        sv: 'Alla',
        ru: 'Все'
    },
    following_and_neighbours: {
        en: 'Following and neighbours',
        de: 'Nachbarn und Leuten, denen du folgst',
        es: 'Siguiendo y vecinos',
        pt: 'Seguindo e vizinhos',
        sv: 'Följare och grannar',
        ru: 'Подписки и соседи'
    },
    close_shouts: {
        name: {
            en: 'Close my shoutbox',
            de: 'Meine Shoutbox schließen',
            es: 'Cerrar mis notas',
            pt: 'Fechar minha caixa de mensagens',
            sv: 'Stäng min hojtlåda',
            ru: 'Закрыть мою shoutbox'
        },
        body: {
            en: 'Removes visibility from everyone (including you)',
            de: 'Blendet deine Shoutbox für alle Beutzer aus (einschließlich dir)',
            es: 'Remueve la visiblidad para todos (incluyéndote a ti)',
            pt: 'Remove a visibilidade de todos (incluindo você)',
            sv: 'Ta bort synlighet från alla (inkl. dig)',
            ru: 'Удаляет видимость для всех (включая вас)'
        }
    },
    error: {
        en: 'Error',
        de: 'Fehler',
        es: 'Error',
        pt: 'Erro',
        sv: 'Error',
        ru: 'Ошибка'
    },
    erm: {
        // used when a page is taken down
        en: 'erm...',
        de: 'ähm...',
        es: 'emm...',
        pt: 'puts...',
        sv: 'ehm...',
        ru: 'эм...'
    },
    shortcut: {
        en: 'Shortcut',
        de: 'Verknüpfung',
        es: 'Atajo',
        pt: 'Atalho',
        sv: 'Genomväg',
        ru: 'Ярлык'
    },
    last_count_days: {
        en: 'Last {c} days',
        de: 'Letzte {c} Tage',
        es: 'Últimos {c] días',
        pt: 'Últimos {c} dias',
        ja: '過去 {c} 日間',
        sv: 'Senaste {c} dagarna',
        ru: 'Последние {c} дней'
    },
    all_time: {
        en: 'All time',
        de: 'Insgesamt',
        es: 'Siempre',
        pt: 'Todo o período',
        ja: 'すべての期間',
        sv: 'All tid',
        ru: 'Все время'
    },
    choose_a_timeframe_above: {
        en: 'Choose a timeframe above',
        de: 'Wähle oben einen Zeitraum',
        es: 'Elige una duración arriba',
        pt: 'Escolha um prazo acima',
        sv: 'Välj en tidsram ovan',
        ru: 'Выберите временной интервал выше'
    },
    failed: {
        en: 'Failed',
        de: 'Fehlgeschlagen',
        es: 'Fallido',
        pt: 'Falhou',
        sv: 'Misslyckades',
        ru: 'Не удалось'
    },
    there_was_a_network_error: {
        en: 'There was a network error',
        de: 'Netzwerkfehler',
        es: 'Hubo un error de red',
        pt: 'Ocorreu um erro de rede',
        sv: 'Ett nätverksfel har inträffat',
        ru: 'Произошла ошибка сети'
    },
    support: {
        en: 'Support',
        de: 'Support',
        es: 'Soporte',
        pt: 'Suporte',
        sv: 'Support',
        ru: 'Поддержка'
    },
    no_plays_in_range: {
        // no plays in date range
        en: 'No plays in this range',
        de: 'Keine Plays in diesem Zeitraum',
        es: 'No hay reproducciones en este rango',
        sv: 'Inga lyssningar under valda datumintervallet',
        ru: 'Нет прослушиваний в этом диапазоне'
    },
    accessible_name_colours: {
        name: {
            en: 'Prefer accessible name colours',
            de: 'Bevorzuge gut lesbare Namensfarben',
            es: 'Preferir colores de nombre accesibles',
            pt: 'Preferir nomes de cores acessíveis',
            sv: 'Föredra lättlästa namnfärger',
            ru: 'Предпочитать доступные цвета имен'
        },
        body: {
            en: 'Replaces badge and link-coloured names with your theme’s header colour',
            de: 'Ersetzt Abzeichen- und Linkfarben mit der Kopfzeilenfarbe deines Farbschemas',
            es: 'Reemplaza el color de los emblemas y vínculos con el color del encabezado de tu aspecto',
            pt: 'Substitui os nomes coloridos dos emblemas e links pela cor do cabeçalho do seu tema',
            sv: 'Ersätter emblem och länkfärgade namn med ditt temas rubrikfärg',
            ru: 'Заменяет цвета имен значков и ссылок цветом заголовка вашей темы'
        }
    },
    display_name_styles: {
        name: {
            en: 'Show display name styles',
            es: 'Mostrar estilos de nombre a mostrar',
            sv: 'Se visningsnamnsstiler',
            ru: 'Показывать стили отображаемого имени'
        },
        body: {
            en: 'Sponsors can choose a custom font and shadow style for their profile name',
            es: 'Los patrocinadores pueden elegir una fuente y estilo de sombra personalizados para su nombre de perfil',
            sv: 'Sponsorer kan välja valfri typsnitt och skugga för deras profilnamn',
            ru: 'Спонсоры могут выбирать собственный шрифт и стиль тени для имени в своем профиле'
        }
    },
    underline_links: {
        name: {
            en: 'Always underline links',
            de: 'Links immer unterstreichen',
            es: 'Siempre subrayar vínculos',
            pt: 'Sempre sublinhe os links',
            sv: 'Ha alltid understrykta länkar',
            ru: 'Всегда подчеркивать ссылки'
        },
        body: {
            en: 'Forces buttons, links, and other interactables to have an underline',
            de: 'Erzwingt, dass Schaltflächen, Links und andere interaktive Elemente unterstrichen sind',
            es: 'Fuerza a que los botones, vínculos, y otros elementos interactivos tengan subrayado',
            pt: 'Força botões, links e outros interativos a terem um sublinhado',
            sv: 'Tvingar knappar, länkar och andra interaktiva objekt att ha understrykt text',
            ru: 'Принуждает кнопки, ссылки и другие интерактивные элементы иметь подчеркивание'
        }
    },
    theme_loading: {
        name: {
            en: 'Disable loading of styles',
            de: 'Deaktiviere das Laden von Stylesheets',
            es: 'Desactivar cargado de estilos',
            pt: 'Desative o carregamento de estilos',
            sv: 'Avaktivera att ladda stilar',
            ru: 'Отключить загрузку стилей'
        },
        body: {
            en: 'Allows you to load the stylesheet yourself during development',
            de: 'Ermöglicht es dir, das Stylesheet während der Entwicklung selbst zu laden',
            es: 'Permite cargar una hoja de estilo propia durante el desarrollo',
            pt: 'Permite que você mesmo carregue a folha de estilo enquanto desenvolve',
            sv: 'Låter dig ladda stilschemat själv under utveckling',
            ru: 'Позволяет вам самостоятельно загружать таблицу стилей во время разработки'
        }
    },
    upload: {
        en: 'Upload',
        de: 'Hochladen',
        es: 'Subir',
        pt: 'Enviar',
        sv: 'Ladda upp',
        ru: 'Загрузить'
    },
    upload_image: {
        en: 'Upload image',
        de: 'Bild hochladen',
        es: 'Subir imagen',
        sv: 'Ladda upp bild',
        ru: 'Загрузить изображение'
    },
    image_details: {
        en: 'Image details',
        de: 'Bildinformationen',
        es: 'Detalles de imagen',
        sv: 'Bildinformation',
        ru: 'Информация об изображении'
    },
    title: {
        en: 'Title',
        de: 'Titel',
        es: 'Título',
        sv: 'Titel',
        ru: 'Название'
    },
    no_title: {
        en: 'No title',
        es: 'Sin título',
        sv: 'Ingen titel',
        ru: 'Без названия'
    },
    description: {
        en: 'Description',
        de: 'Beschreibung',
        es: 'Descripción',
        sv: 'Beskrivning',
        ru: 'Описание'
    },
    no_description: {
        en: 'No description',
        es: 'Sin descripción',
        sv: 'Ingen beskrivning',
        ru: 'Без описания'
    },
    change_avatar: {
        en: 'Change avatar',
        de: 'Profilbild ändern',
        es: 'Cambiar avatar',
        pt: 'Mudar foto de perfil',
        sv: 'Ändra profilbild',
        ru: 'Сменить аватар'
    },
    crop_avatar: {
        en: 'Crop avatar',
        de: 'Profilbild zuschneiden',
        es: 'Recortar avatar',
        pt: 'Recortar avatar',
        sv: 'Beskär profilbild',
        ru: 'Обрезать аватар'
    },
    crop_notice: {
        en: 'Use your scroll wheel to zoom in and out, click and drag to move the image.',
        de: 'Verwende dein Mausrad, um rein- und rauszuzoomen. Klicke und ziehe, um das Bild zu verschieben.',
        es: 'Usa la rueda del ratón para acercar o alejar, haz clic y arrastra para mover la imagen.',
        pt: 'Use a scroll do seu mouse para dar zoom in e zoom out, clicar e arrastar para mover a imagem.',
        sv: 'Använd ditt scrollhjul för att zooma in och ut, klicka och dra för att flytta på bilden.',
        ru: 'Используйте колесо прокрутки для приближения и отдаления, нажмите и перетащите, чтобы переместить изображение.'
    },
    edit_profile_note: {
        en: 'Edit profile note',
        de: 'Profilnotiz bearbeiten',
        es: 'Editar anotación de perfil',
        pt: 'Editar recado de perfil',
        sv: 'Ändra profilanteckning',
        ru: 'Редактировать заметку профиля'
    },
    update_to_version: {
        en: 'Update to {v}',
        de: 'Auf {v} aktualisieren',
        es: 'Actualizar a {v}',
        pt: 'Atualizar para {v}',
        sv: 'Uppdatera till {v}',
        ru: 'Обновить до {v}'
    },
    all: {
        // all photos
        en: 'All',
        de: 'Alle',
        es: 'Todos',
        pt: 'Todos',
        sv: 'Visa alla',
        ru: 'Все'
    },
    saved: {
        // saved/bookmarked photos
        en: 'Saved',
        de: 'Gespeichert',
        es: 'Guardado',
        pt: 'Salvo',
        sv: 'Sparade',
        ru: 'Сохраненные'
    },
    remove_save: {
        en: 'Remove save',
        es: 'Remover guardado',
        sv: 'Ta bort bokmärkning',
        ru: 'Удалить из сохраненного'
    },
    no_images_saved: {
        en: 'No photos saved',
        de: 'Keine Bilder gespeichert',
        es: 'No hay fotos guardadas',
        pt: 'Nenhuma foto salva',
        sv: 'Inga foton sparade',
        ru: 'Нет сохраненных фотографий'
    },
    going: {
        // going as in attending an event
        //
        // last.fm official spanish translation uses plural version of word when there's more than one person going -soleil
        en: 'Going',
        de: 'Zugesagt',
        es: 'Irán',
        pt: 'Indo',
        sv: 'Ska gå på',
        ru: 'Иду'
    },
    interested: {
        // interested in attending an event
        //
        // same here -soleil
        en: 'Interested',
        de: 'Interessiert',
        es: 'Interesados',
        pt: 'Interessado',
        sv: 'Intresserad',
        ru: 'Интересуюсь'
    },
    total: {
        // total of events attended or anything else
        en: 'Total',
        de: 'Gesamt',
        es: 'Total',
        sv: 'Totalt',
        ru: 'Всего'
    },
    value_failed_to_load: {
        en: '{v} failed to load',
        de: '{v} konnte nicht geladen werden',
        es: '{v} falló al cargar',
        pt: '{v} falhou ao carregar',
        sv: '{v} kunde inte laddas',
        ru: '{v} не удалось загрузить'
    },
    profile_does_not_have_enough_scrobbles: {
        en: 'Profile does not have enough scrobbles',
        de: 'Profil hat nicht genügend Scrobbles',
        es: 'El perfil no tiene suficientes scrobblings',
        pt: 'O perfil não tem scrobbles o suficiente',
        sv: 'Profilen har inte tillräckligt med skrobblingar',
        ru: 'У профиля недостаточно скробблов'
    },
    requires_extension_value: {
        en: 'Requires extension ‘{v}’',
        de: 'Benötigt die Erweiterung „{v}“',
        es: 'Requiere la extensión ‘{v}’',
        pt: 'Requer extensão ‘{v}’',
        sv: 'Behöver tillägget ‘{v}’',
        ru: 'Требуется расширение «{v}»'
    },
    incompatible_with_value: {
        en: 'Incompatible with {v}',
        de: 'Inkompatibel mit {v}',
        es: 'Incompatible con {v}',
        pt: 'Incompatível com {v}',
        sv: 'Inkompatibelt med {v}',
        ru: 'Несовместимо с {v}'
    },
    incompatible_alert: {
        en: 'Incompatible with current settings',
        de: 'Nicht mit den aktuellen Einstellungen kompatibel',
        es: 'Incompatible con la configuración actual',
        sv: 'Inkompatibelt med nuvarande inställningar',
        ru: 'Несовместимо с текущими настройками'
    },
    bulk_edit_extension: {
        en: 'Last.fm Bulk Edit',
        de: 'Last.fm-Massenbearbeitung',
        es: 'Edición en masa de Last.fm',
        pt: 'Edição em massa do Last.fm',
        sv: 'Last.fm bulkredigering',
        ru: 'Массовое редактирование Last.fm'
    },
    collage: {
        en: 'Collage',
        de: 'Collage',
        es: 'Collage',
        pt: 'Colagem',
        sv: 'Collage',
        ru: 'Коллаж'
    },
    collage_redirect: {
        en: 'Redirected to bleh’s built-in Collage feature',
        de: 'Weiterleitung zur integrierten Collagenfunktion von bleh',
        es: 'Redireccionado a la función integrada de Collages de bleh',
        pt: 'Redirecionando ao recurso integrado de Colagem do bleh',
        sv: 'Omdirigerad till blehs egna collagefunktion',
        ru: 'Перенаправлено на встроенную функцию Коллажа bleh'
    },
    your_collage_is_ready: {
        en: 'Your collage is ready!',
        de: 'Deine Collage ist fertig!',
        es: '¡Tu collage está listo!',
        pt: 'Sua colagem está pronta!',
        sv: 'Ditt collage är redo',
        ru: 'Ваш коллаж готов!'
    },
    name_failed: {
        en: '{name} failed',
        de: '{name} fehlgeschlagen',
        es: '{name} falló',
        pt: '{name} falhou',
        sv: '{name} misslyckades',
        ru: '{name} не удалось'
    },
    select_component: {
        // the 'Select' component (like a dropdown menu)
        // not an option to chooose your component
        en: 'Select component',
        de: 'Auswahlkomponente',
        es: 'Seleccionar componente',
        pt: 'Selecionar componente',
        sv: 'Välj komponent',
        ru: 'Выбрать компонент'
    },
    only_numbers_are_allowed: {
        en: 'Only numbers are allowed here',
        de: 'Nur Zahlen sind erlaubt',
        es: 'Solo se permiten números aquí',
        pt: 'Apenas números são permitidos aqui',
        sv: 'Endast nummer är tillåtna här',
        ru: 'Здесь разрешены только цифры'
    },
    keep_within_the_range: {
        // if the user wrote more text than the text box allows
        en: 'Keep within the range',
        de: 'Bleibe innerhalb des Zeichenlimits',
        es: 'Mantente dentro del rango',
        pt: 'Manter dentro do intervalo',
        sv: 'Håll dig inom gränsen',
        ru: 'Оставайтесь в пределах диапазона'
    },
    this_field_is_required: {
        // field as in a text box
        en: 'This field is required',
        de: 'Dieses Feld ist erforderlich',
        es: 'Este campo es obligatorio',
        pt: 'Este campo é obrigatório',
        sv: 'Fältet krävs',
        ru: 'Это поле обязательно'
    },
    please_dont_clone_yourself: {
        en: 'Please don’t clone yourself',
        de: 'Bitte klone dich nicht selbst',
        es: 'Por favor no te clones a ti mismo',
        pt: 'Por favor, não se clone',
        sv: 'Snälla, klona inte dig själv',
        ru: 'Пожалуйста, не клонируйте себя'
    },
    generate: {
        en: 'Generate',
        de: 'Generieren',
        es: 'Generar',
        pt: 'Gerar',
        sv: 'Generera',
        ru: 'Создать'
    },
    your_settings_are_invalid: {
        en: 'Your settings are invalid',
        de: 'Deine Einstellungen sind ungültig',
        es: 'Tus opciones son inválidas',
        pt: 'Suas configurações são inválidas',
        sv: 'Dina inställningar är ogiltiga',
        ru: 'Ваши настройки недействительны'
    },
    top_type: {
        en: 'Top {type}',
        de: 'Top-{type}',
        es: 'Top {type}',
        sv: 'Topp{type}',
        ru: 'Топ-{type}'
    },
    download: {
        en: 'Download',
        de: 'Herunterladen',
        es: 'Descargar',
        pt: 'Baixar',
        sv: 'Ladda ned',
        ru: 'Скачать'
    },
    downloaded: {
        en: 'Downloaded',
        de: 'Heruntergeladen',
        es: 'Descargado',
        pt: 'Baixado',
        sv: 'Nedladdat',
        ru: 'Скачано'
    },
    are_you_sure: {
        en: 'Are you sure?',
        de: 'Bist du sicher?',
        es: '¿Estás seguro?',
        pt: 'Você tem certeza?',
        sv: 'Är du säker',
        ru: 'Вы уверены?'
    },
    this_will_require_loading_count_pages: {
        en: 'This will require loading {c} pages',
        de: 'Dies erfordert das Laden von {c} Seiten',
        es: 'Esto requiere cargar {c} páginas',
        pt: 'Isso requer carregar {c} páginas',
        sv: 'Det här kräver att {c} sidor laddas',
        ru: 'Для этого потребуется загрузить {c} страниц'
    },
    chart_template_filename: {
        en: '{user} Collage ({timeframe}, Top {type}, {size}) - {brand} {date}',
        de: '{user} Collage ({timeframe}, Top-{type}, {size}) - {brand} {date}',
        es: '{user} Collage ({timeframe}, Top {type}, {size}) - {brand} {date}',
        pt: '{user} Colagem ({timeframe}, Top {type}, {size}) - {brand} {date}',
        sv: '{user} Collage ({timeframe}, Topp{type}, {size}) - {brand} {date}',
        ru: '{user} Коллаж ({timeframe}, Топ {type}, {size}) - {brand} {date}'
    },
    waiting_for_images: {
        en: 'Waiting for images',
        es: 'Esperando imágenes',
        pt: 'Aguardando imagens',
        sv: 'Väntar på bilder',
        ru: 'Ожидание изображений'
    },
    collage_title: {
        name: {
            en: 'Collage title',
            de: 'Collagentitel',
            es: 'Título del collage',
            pt: 'Título da colagem',
            sv: 'Collagetitel',
            ru: 'Заголовок коллажа'
        },
        body: {
            en: 'Include a subtle header showing your username and settings you used',
            de: 'Fügt eine dezente Kopfzeile hinzu, die deinen Benutzernamen und die von dir gewählten Einstellungen anzeigt',
            es: 'Incluye un encabezado sutil mostrando tu nombre de usuario y las opciones que usaste',
            pt: 'Inclua um cabeçalho discreto mostrando seu nome de usuário e as configurações que você usou',
            sv: 'Lägger till en liten rubrik som visar ditt användarnamn och dina inställningar',
            ru: 'Включите небольшой заголовок с вашим именем пользователя и использованными настройками'
        }
    },
    collage_grid_text: {
        en: 'Show names on grid items',
        de: 'Namen auf Rasterobjekten anzeigen',
        es: 'Mostrar nombres en los ítems en la cuadrícula',
        pt: 'Mostrar nomes nos itens da grade',
        sv: 'Visa namn på collageobjekt',
        ru: 'Показывать названия на элементах сетки'
    },
    collage_grid_plays: {
        en: 'Show plays on grid items',
        de: 'Plays auf Rasterobjekten anzeigen',
        es: 'Mostrar reproducciones en los ítems en la cuadrícula',
        pt: 'Mostrar reproduções nos itens da grade',
        sv: 'Visa spelningar på collageobjekt',
        ru: 'Показывать прослушивания на элементах сетки'
    },
    collage_grid_gap: {
        name: {
            en: 'Leave a gap between grid items',
            de: 'Abstand zwischen Rasterobjekten',
            es: 'Dejar un espacio entre los ítems en la cuadrícula',
            pt: 'Deixe um espaço entre os itens da grade',
            sv: 'Lämna rum mellan collageobjekt',
            ru: 'Оставить промежуток между элементами сетки'
        },
        body: {
            en: 'Includes outer and inner padding with round grid items',
            de: 'Fügt äußere und innere Abstände sowie abgerundete Rasterobjekte hinzu',
            es: 'Incluye relleno exterior e interior en ítems de cuadrícula redonda',
            sv: 'Lägger till inre och yttre mellanrum med avrundade collageobjekt',
            ru: 'Включает внешние и внутренние отступы с круглыми элементами сетки'
        }
    },
    collage_centered: {
        name: {
            en: 'Center info on grid items',
            de: 'Informationen auf Rasterobjekten zentrieren',
            es: 'Centrar información en los ítems en la cuadrícula',
            sv: 'Centrera informationen på collageobjekt',
            ru: 'Центрировать информацию на элементах сетки'
        },
        body: {
            en: 'Similar to the look of other collage solutions',
            de: 'Ähnlicher Stil wie andere Collagenlösungen',
            es: 'Similar al estilo visual de otros editores de collage',
            sv: 'Mer lik till hur andra collagegenererare gör det',
            ru: 'Похоже на внешний вид других решений для коллажей'
        }
    },
    organising_plays: {
        en: 'Organising plays',
        de: 'Plays werden organisiert',
        es: 'Organizando reproducciones',
        pt: 'Organizando reproduções',
        sv: 'Organisera spelningar',
        ru: 'Организация прослушиваний'
    },
    update_now: {
        en: 'Update now',
        de: 'Jetzt aktualisieren',
        es: 'Actualizar ahora',
        pt: 'Atualizar agora',
        sv: 'Uppdatera nu',
        ru: 'Обновить сейчас'
    },
    ignore_for_now: {
        en: 'Ignore for now',
        de: 'Vorerst ignorieren',
        es: 'Ignorar por ahora',
        pt: 'Ignore por agora',
        sv: 'Ignorera just nu',
        ru: 'Игнорировать пока'
    },
    update_styles: {
        en: 'Update styles',
        de: 'Stylesheets aktualisieren',
        es: 'Actualizar estilos',
        pt: 'Atualizar estilos',
        sv: 'Uppdatera stiler',
        ru: 'Обновить стили'
    },
    downloading_styles: {
        en: 'Downloading styles',
        de: 'Lade Stylesheets herunter',
        es: 'Descargando estilos',
        pt: 'Baixando estilos',
        sv: 'Laddar ner stiler',
        ru: 'Загрузка стилей'
    },
    style_warning: {
        en: 'You have style loading off! If you did this by accident, you can undo this',
        de: 'Du hast das Laden von Stylesheets deaktiviert! Wenn du das aus Versehen gemacht hast, kannst du es rückgängig machen',
        es: '¡Tienes el cargado de estilos desactivado! Si hiciste esto por accidente, puedes deshacerlo',
        pt: 'Você desativou o carregamento de estilos! Se você fez isso acidentalmente, pode desfazer essa ação',
        sv: 'Du har stängt av att stiler laddas! Om du gjorde det av misstag så kan du återställa det',
        ru: 'У вас отключена загрузка стилей! Если вы сделали это случайно, вы можете отменить это'
    },
    re_enable_style_loading: {
        en: 'Re-enable style loading',
        de: 'Stylesheets neu laden und aktivieren',
        es: 'Reactivar cargado de estilos',
        pt: 'Reativar carregamento de estilos',
        sv: 'Återaktivera att stiler laddas',
        ru: 'Включить загрузку стилей'
    },
    made_with_love: {
        // lowercase in design
        en: 'made with {h} by {u} and {c}contributors{/c}',
        de: 'mit {h} gemacht von {u} und {c}mitwirkenden{/c}',
        es: 'hecho con {h} por {u} y {c}contribuidores{/c}',
        pt: 'feito com {h} por {u} e {c}contribuidores{/c}',
        sv: 'skapad med {h} av {u} och {c}bidragsgivare{/c}',
        ru: 'сделано с {h} от {u} и {c}участников{/c}'
    },
    love_lower: {
        // replaces the {h} in the above sentence
        en: 'love',
        de: 'liebe',
        es: 'amor',
        pt: 'amor',
        sv: 'kärlek',
        ru: 'любовью'
    },
    translations: {
        // lowercase in design
        en: '{l} translation by {u}',
        de: 'Deutsche Übersetzung von {u}',
        es: '{l} traducción por {u}',
        sv: 'Svensk översättning av {u}',
        ru: 'Перевод {l} от {u}'
    },
    view_source: {
        en: 'View source',
        de: 'Quellcode ansehen',
        es: 'Ver código fuente',
        pt: 'Ver código',
        sv: 'Visa källa',
        ru: 'Посмотреть исходный код'
    },
    report_issue: {
        en: 'Report issue',
        de: 'Problem melden',
        es: 'Reportar problema',
        pt: 'Relatar problema',
        sv: 'Rapportera problem',
        ru: 'Сообщить о проблеме'
    },
    opens_your_value_settings: {
        // DE: is this used both for profile settings and bleh settings in the quick switcher? ~Myrai
        // Profile Settings would be {v}einstellungen, bleh Settings would be {v}-Einstellungen
        en: 'Open your {v} settings',
        de: 'Öffne deine {v}-Einstellungen',
        es: 'Abrir tu configuración de {v}',
        pt: 'Abra suas opções de {v}',
        sv: 'Öppna dina {v}-inställningar',
        ru: 'Открыть ваши настройки {v}'
    },
    opens_your_value: {
        // DE: depending on the word in {v}, this might be "dein", "deine" or the inclusive "dein:e" ~Myrai
        // DEIN Profil, DEIN:E markierte Freund:in, DEINE Benachrichtigungen, DEINE Nachrichten, DEINE Minis, DEINE Profileinstellungen
        en: 'Open your {v}',
        de: 'Öffne dein {v}',
        es: 'Abrir tu {v}',
        pt: 'Abra seu {v}',
        sv: 'Öpnna dina {v}',
        ru: 'Открыть ваши {v}'
    },
    opens_the_value: {
        // DE: same here, depends on context ~Myrai
        // currently, it's all "die" – DIE Farbschemenauswahl, DIE Minis, DIE Neuigkeiten, DIE bleh-Einstellungen
        en: 'Open the {v}',
        de: 'Öffne die {v}',
        es: 'Abrir el {v}',
        pt: 'Abra o {v}',
        sv: 'Öppna {v}',
        ru: 'Открыть {v}'
    },
    theme_picker: {
        en: 'Theme picker',
        de: 'Farbschemenauswahl',
        es: 'Selector de aspectos',
        pt: 'Seletor de temas',
        sv: 'Temaväljare',
        ru: 'Выбор темы'
    },
    changes_your_theme: {
        en: 'Changes your theme',
        de: 'Ändert dein Farbschema',
        es: 'Cambia tu aspecto',
        pt: 'Mude seu tema',
        sv: 'Ändrar ditt tema',
        ru: 'Изменяет вашу тему'
    },
    on_this_page: {
        en: 'On this page',
        de: 'Auf dieser Seite',
        es: 'En esta página',
        pt: 'Nessa página',
        sv: 'På denna sida',
        ru: 'На этой странице'
    },
    use_current_page_as_context: {
        en: 'Use current page as context',
        de: 'Aktuelle Seite als Kontext verwenden',
        es: 'Usar la página actual como contexto',
        pt: 'Usar a página atual como contexto',
        sv: 'Använd aktuella sidan som referens',
        ru: 'Использовать текущую страницу как контекст'
    },
    opens_the_value_for_type: {
        en: 'Open the {v} for {t}',
        de: 'Öffne das {v} für {t}',
        es: 'Abrir el {v} para {t}',
        pt: 'Abra a {v} para {t}',
        sv: 'Öpnnar {v] för {t}',
        ru: 'Открыть {v} для {t}'
    },
    quick_switcher: {
        en: 'Rabbit hole',
        de: 'Quick Switcher',
        es: 'Cambio rápido',
        sv: 'Genvägar',
        ru: 'Быстрый переключатель'
    },
    use_quick_switcher: {
        name: {
            en: 'Enable the quick switcher',
            de: 'Quick Switcher aktivieren',
            es: 'Activar el cambio rápido',
            sv: 'Aktivera snabbväxlare',
            ru: 'Включить быстрый переключатель'
        },
        body: {
            en: 'Make full use of your keyboard to navigate exactly where you want to be',
            de: 'Nutze deine Tastatur, um genau dorthin zu navigieren, wo du hinmöchtest',
            es: 'Aprovecha al completo tu teclado para navegar exactamente a donde quieres estar',
            sv: 'Gör full användning av ditt tangentbord för att navigera till precis vart du vill vara',
            ru: 'Используйте клавиатуру в полной мере, чтобы перейти именно туда, куда вам нужно'
        }
    },
    quick_switcher_keybinds: {
        en: 'Change keybinds',
        de: 'Tastenkombinationen ändern',
        es: 'Cambiar atajos',
        sv: 'Ändra tangentbordsgenvägar',
        ru: 'Изменить сочетания клавиш'
    },
    switch_placeholder: {
        en: 'Quick switch to a page or action',
        de: 'Schnell zu einer Seite oder Aktion wechseln',
        es: 'Cambia rápido a una página o acción',
        pt: 'Alternar rapidamente para uma página ou ação',
        sv: 'Hoppa snabbt till en sida eller annan åtgärd',
        ru: 'Быстрый переход к странице или действию'
    },
    rabbit_search: {
        en: 'Enter {v} name',
        de: 'Gebe den Namen des {v}s ein',
        es: 'Ingresa el nombre del {v}',
        sv: 'Skriv {v}namn',
        ru: 'Введите название {v}'
    },
    compares_your_taste: {
        en: 'Compare your taste with {v}',
        de: 'Vergleiche deinen Musikgeschmack mit {v}',
        es: 'Compara tus gustos con {v}',
        pt: 'Compare o seu gosto com {v}',
        sv: 'Jämför musiksmak med {v}',
        ru: 'Сравнить ваш вкус с {v}'
    },
    select_an_option: {
        en: 'Select an option',
        de: 'Wähle eine Option',
        es: 'Selecciona una opción',
        pt: 'Selecione uma opção',
        sv: 'Välj ett alternativ',
        ru: 'Выберите вариант'
    },
    nothing_matches_your_search: {
        en: 'Nothing matches your search',
        de: 'Es wurde nichts zu deiner Suche gefunden',
        es: 'No hay resultados que coincidan con tu búsqueda',
        pt: 'Nada corresponde à sua pesquisa',
        sv: 'Inga resultat matchar din sökning',
        ru: 'Ничего не найдено по вашему запросу'
    },
    create_a_collage: {
        en: 'Create a collage of your choosing',
        de: 'Erstelle eine Collage deiner Wahl',
        es: 'Crea un collage de tu elección',
        pt: 'Crie uma colagem de sua escolha',
        sv: 'Skapa ett collage som du vill',
        ru: 'Создать коллаж на ваш выбор'
    },
    search_for_music_or_user: {
        en: 'Search for music or a user',
        de: 'Suche nach Musik oder einem Benutzer',
        es: 'Busca música o un usuario',
        pt: 'Pesquise por música ou usuário',
        sv: 'Sök musik eller en användare',
        ru: 'Искать музыку или пользователя'
    },
    search_for_value: {
        en: 'Search for {v}',
        de: 'Nach {v} suchen',
        es: 'Buscar por {v}',
        pt: 'Pesquise por {v}',
        sv: 'Sök upp {v}',
        ru: 'Искать {v}'
    },
    choose_a_search_type: {
        en: 'Choose a search type',
        de: 'Wähle einen Suchtyp',
        es: 'Elige un tipo de búsqueda',
        pt: 'Escolha um tipo de pesquisa',
        sv: 'Välj söktyp',
        ru: 'Выберите тип поиска'
    },
    finish_search: {
        en: 'Finish your search',
        de: 'Beende deine Suche',
        es: 'Termina tu búsqueda',
        pt: 'Finalize sua pesquisa',
        sv: 'Finalisera sökning',
        ru: 'Завершите поиск'
    },
    view_count_more: {
        en: 'View {c} more',
        de: '{c} weitere anzeigen',
        es: 'Ver {c} más',
        sv: 'Visa {v} fler',
        ru: 'Посмотреть еще {c}'
    },
    saved_to_bookmarks: {
        en: 'Saved to bookmarks',
        de: 'Lesezeichen hinzugefügt',
        es: 'Guardado en marcadores',
        pt: 'Salvo nos marcadores',
        sv: 'Sparad till dina bokmärken',
        ru: 'Сохранено в закладки'
    },
    bookmark_save_msg: {
        en: 'Find your bookmarks in your Home or {link}',
        de: 'Finde deine Lesezeichen auf deiner Startseite oder {link}',
        es: 'Encuentra tus marcadores en tu Inicio o {vínculo}',
        pt: 'Encontre seus marcadores na sua página inicial ou em {link}',
        sv: 'Hitta dina bokmärken på startsidan eller {link}',
        ru: 'Найдите ваши закладки на Домашней странице или {link}'
    },
    go_there_now_lower: {
        // in sentence above
        en: 'go there now',
        de: 'schaue sie dir direkt an',
        es: 've ahí ahora',
        pt: 'vai lá agora',
        sv: 'gå dit nu',
        ru: 'перейти сейчас'
    },
    always_remind_me: {
        en: 'Always remind me',
        de: 'Erinnere mich immer',
        es: 'Recordarme siempre',
        sv: 'Påminn mig alltid',
        ru: 'Напоминать всегда'
    },
    never: {
        en: 'Never',
        de: 'Nie',
        es: 'Nunca',
        sv: 'Aldrig',
        ru: 'Никогда'
    },
    edit_scrobble: {
        en: 'Edit scrobble',
        de: 'Scrobble bearbeiten',
        es: 'Editar scrobbling',
        pt: 'Editar scrobble',
        sv: 'Redigera skrobbel',
        ru: 'Редактировать скроббл'
    },
    edit_scrobbles_in_bulk: {
        en: 'Edit scrobbles in bulk',
        de: 'Mehrere Scrobbles bearbeiten',
        es: 'Editar scrobblings en masa',
        pt: 'Editar scrobbles em massa',
        sv: 'Massredigera skrobblingar',
        ru: 'Массовое редактирование скробблов'
    },
    timeline: {
        en: 'Timeline',
        de: 'Zeitstrahl',
        es: 'Cronología',
        sv: 'Tidslinje',
        ru: 'Хронология'
    },
    view_latest: {
        en: 'View latest',
        de: 'Neueste anzeigen',
        es: 'Ver más recientes',
        sv: 'Visa senaste',
        ru: 'Посмотреть последние'
    },
    custom: {
        en: 'Custom',
        de: 'Benutzerdefiniert',
        es: 'Personalizado',
        sv: 'Anpassad',
        ru: 'Пользовательский'
    },
    star: {
        en: 'Star',
        de: 'Markieren',
        es: 'Marcar como favorito',
        sv: 'Stjärna',
        ru: 'Отметить звездой'
    },
    starred: {
        en: 'Starred',
        de: 'Markiert',
        es: 'Marcado como favorito',
        sv: 'Stjärnmärkt',
        ru: 'Отмечено звездой'
    },
    report: {
        en: 'Report',
        de: 'Melden',
        es: 'Reportar',
        pt: 'Reportar',
        sv: 'Anmäl',
        ru: 'Пожаловаться'
    },
    auto: {
        // automatic theme
        en: 'Auto',
        de: 'Automatisch',
        es: 'Automático',
        sv: 'Automatiskt',
        ru: 'Авто'
    },
    glass: {
        en: 'Glass',
        de: 'Glas',
        es: 'Vidrio',
        sv: 'Glas',
        ru: 'Стекло'
    },
    high_contrast: {
        en: 'Prefer high contrast',
        de: 'Hohen Kontrast bevorzugen',
        es: 'Preferir alto contraste',
        sv: 'Föredra högkontrast',
        ru: 'Предпочитать высокую контрастность'
    },
    external: {
        en: 'External',
        de: 'Extern',
        es: 'Externo',
        sv: 'Extern',
        ru: 'Внешний'
    },
    watch: {
        en: 'Watch',
        de: 'Ansehen',
        es: 'Ver',
        sv: 'Se',
        ru: 'Смотреть'
    },
    watch_video: {
        en: 'Watch video',
        de: 'Video ansehen',
        es: 'Ver video',
        sv: 'Se video',
        ru: 'Смотреть видео'
    },
    latest_album: {
        en: 'Latest album',
        de: 'Neuestes Album',
        es: 'Álbum más reciente',
        sv: 'Senaste album',
        ru: 'Последний альбом'
    },
    popular_now: {
        en: 'Popular now',
        de: 'Zurzeit beliebt',
        es: 'Popular ahora',
        sv: 'Populär just nu',
        ru: 'Популярно сейчас'
    },
    missing_album_info: {
        en: 'This album is missing key details, maybe you can help out?',
        de: 'Diesem Album fehlen wichtige Details, vielleicht kannst du helfen?',
        es: 'A este álbum le faltan detalles clave, ¿quizás puedes ayudar?',
        ru: 'В этом альбоме отсутствуют ключевые детали, может, вы можете помочь?'
    },
    updates: {
        // links to the bleh updater
        en: 'Updates',
        de: 'Updates',
        es: 'Actualizaciones',
        pt: 'Atualizações',
        sv: 'Uppdateringar',
        ru: 'Обновления'
    },
    updated: {
        en: 'Updated',
        de: 'Aktualisiert',
        es: 'Actualizado',
        pt: 'Atualizado',
        sv: 'Uppdaterats',
        ru: 'Обновлено',
        notification: {
            en: 'Updated to version {v}',
            es: 'Actualizado a la versión {v}',
            ru: 'Обновлено до версии {v}'
        }
    },
    you_are_up_to_date: {
        en: 'You’re up to date',
        de: 'Du bist auf dem neuesten Stand',
        es: 'Estás actualizado',
        pt: 'Você está atualizado',
        sv: 'Du är på den senaste versionen',
        ru: 'У вас последняя версия'
    },
    update_available_to_install: {
        en: 'Update available to install',
        de: 'Ein Update ist bereit zur Installation',
        es: 'Actualización disponible para instalar',
        pt: 'Atualização disponível para instalar',
        sv: 'Ny uppdatering finns tillgänglig',
        ru: 'Доступно обновление для установки'
    },
    install_now: {
        // install update
        en: 'Install now',
        de: 'Jetzt installieren',
        es: 'Instalar ahora',
        pt: 'Instale agora',
        sv: 'Installera nu',
        ru: 'Установить сейчас'
    },
    check_for_updates: {
        en: 'Check for updates',
        de: 'Nach Updates suchen',
        es: 'Comprobar si hay actualizaciones',
        pt: 'Verificar atualizações',
        sv: 'Checka efter nya uppdateringar',
        ru: 'Проверить обновления'
    },
    check: {
        en: 'Check',
        de: 'Prüfen',
        es: 'Comprobar',
        pt: 'Verificar',
        sv: 'Checka',
        ru: 'Проверить'
    },
    last_checked_date: {
        en: 'Last checked {d}',
        de: 'Zuletzt geprüft {d}',
        es: 'Última comprobación {d}',
        pt: 'Última verificação {d}',
        sv: 'Sist kollat {d}',
        ru: 'Последняя проверка {d}'
    },
    never_checked: {
        en: 'Never checked',
        de: 'Noch nicht geprüft',
        es: 'Nunca comprobado',
        pt: 'Nunca verificado',
        sv: 'Aldrig checkat',
        ru: 'Никогда не проверялось'
    },
    get_updates_fast: {
        name: {
            en: 'Get the latest updates as soon as they’re available',
            de: 'Erhalte die neuesten Updates, sobald sie verfügbar sind',
            es: 'Recibe las actualizaciones más recientes apenas estén disponibles',
            pt: 'Receba as últimas atualizações assim que estiverem disponíveis',
            sv: 'Skaffa senaste uppdateringarna direkt när det finns tillgängligt',
            ru: 'Получайте последние обновления, как только они станут доступны'
        },
        body: {
            en: 'Be among the first to get the latest fixes and improvements as they roll out',
            de: 'Sei unter den Ersten, die die neuesten Fehlerbehebungen und Verbesserungen erhalten, sobald sie verfügbar sind',
            es: 'Sé entre los primeros que reciben los más recientes arreglos y mejoras mientras van llegando',
            pt: 'Seja um dos primeiros a receber as últimas correções e melhorias assim que forem lançadas',
            sv: 'Bli bland dem första som får de senaste fixarna och optimeringarna så snart som dom kommit',
            ru: 'Будьте в числе первых, кто получит последние исправления и улучшения по мере их выпуска'
        }
    },
    pause_updates: {
        en: 'Pause updates',
        de: 'Updates pausieren',
        es: 'Pausar actualizaciones',
        pt: 'Pausar atualizações',
        sv: 'Pausa uppdateringar',
        ru: 'Приостановить обновления'
    },
    pause_updates_for: {
        en: 'Pause for 1 day',
        de: 'Für einen Tag pausieren',
        es: 'Pausar por 1 día',
        pt: 'Pausar por 1 dia',
        sv: 'Pausa i 1 dag',
        ru: 'Приостановить на 1 день'
    },
    resume_updates: {
        en: 'Resume updates',
        de: 'Updates fortsetzen',
        es: 'Resumir actualizaciones',
        pt: 'Resumir atualizações',
        sv: 'Återuppta uppdateringar',
        ru: 'Возобновить обновления'
    },
    updates_paused: {
        en: 'Updates paused',
        de: 'Updates pausiert',
        es: 'Actualizaciones pausadas',
        pt: 'Atualizações pausadas',
        sv: 'Uppdateringar har pausats',
        ru: 'Обновления приостановлены'
    },
    paused_until_date: {
        en: 'Updates continue {d}',
        de: 'Updates werden {d} fortgesetzt',
        es: 'Las actualizaciones continuarán el {d}',
        pt: 'Atualizações continuam {d}',
        sv: 'Uppdateringar fortsätter {d}',
        ru: 'Обновления возобновятся {d}'
    },
    missing_updates: {
        en: 'Missing updates',
        de: 'Fehlende Updates',
        es: 'Actualizaciones faltantes',
        pt: 'Atualizações em falta',
        sv: 'Saknar uppdateringar',
        ru: 'Пропущенные обновления'
    },
    you_are_running_version: {
        en: 'You are running version {v}',
        de: 'Du verwendest Version {v}',
        es: 'Estás usando la versión {v}',
        pt: 'Você está usando a versão {v}',
        sv: 'Du är på version {v}',
        ru: 'Вы используете версию {v}'
    },
    you_are_installing_version: {
        en: 'You are installing version {v}',
        de: 'Du installierst Version {v}',
        es: 'Estás instalando la versión {v}',
        pt: 'Você está instalando a versão {v}',
        sv: 'Du har installerat version {v}',
        ru: 'Вы устанавливаете версию {v}'
    },
    checked_for_updates: {
        en: 'Checked for updates',
        de: 'Updates wurden gesucht',
        es: 'Se ha comprobado si hay actualizaciones',
        pt: 'Verificou por atualizações',
        sv: 'Kolla efter uppdateringar',
        ru: 'Проверено на наличие обновлений'
    },
    select_all: {
        en: 'Select all',
        de: 'Alle auswählen',
        es: 'Seleccionar todos',
        sv: 'Markera alla',
        ru: 'Выбрать все'
    },
    deselect_all: {
        en: 'De-select all',
        de: 'Alle abwählen',
        es: 'Deseleccionar todos',
        sv: 'Avmarkera alla',
        ru: 'Снять выбор со всех'
    },
    use_current_time: {
        en: 'Use current time',
        de: 'Aktuelle Zeit verwenden',
        es: 'Usar hora actual',
        sv: 'Använd nuvarande tid',
        ru: 'Использовать текущее время'
    },
    time: {
        en: 'Time',
        de: 'Zeit',
        es: 'Hora',
        sv: 'Tid',
        ru: 'Время'
    },
    missing_fields: {
        en: 'Missing required fields',
        de: 'Fehlende erforderliche Felder',
        es: 'Faltan campos obligatorios',
        sv: 'Saknar nödvändiga fält',
        ru: 'Отсутствуют обязательные поля'
    },
    requires_api_in_settings: {
        en: 'Requires API access in Settings',
        de: 'Erfordert API-Zugang in den Einstellungen',
        es: 'Requiere acceso a la API en Configuración',
        sv: 'Behöver API-åtkomst i inställningar',
        ru: 'Требуется доступ к API в настройках'
    },
    no_token_provided: {
        en: 'No token provided',
        de: 'Kein Token angegeben',
        es: 'No se ha proporcionado ningún token',
        sv: 'Ingen token har angivits',
        ru: 'Токен не предоставлен'
    },
    example: {
        en: 'e.g. {v}',
        de: 'z.B. {v}',
        es: 'e.g. {v}',
        pt: 'ex.: {v}',
        sv: 't.ex. {v}',
        ru: 'напр. {v}'
    },
    item_is_unavailable_on_platform: {
        en: '{i} is unavailable on {p}',
        de: '{i} ist auf {p} nicht verfügbar',
        es: '{i} no está disponible en {p}',
        pt: '{i} está indísponivel no {p}',
        sv: '{i} är inte tillgänglig på {p}',
        ru: '{i} недоступен на {p}'
    },
    platforms: {
        other: {
            en: 'Unknown',
            de: 'Unbekannt',
            es: 'Desconocido',
            pt: 'Desconhecido',
            sv: 'Okänd',
            ru: 'Неизвестно'
        }
    },
    reduced_motion: {
        name: {
            en: 'Reduce motion in animations',
            de: 'Bewegung von Animationen reduzieren',
            es: 'Reducir movimiento en animaciones',
            sv: 'Minska animationrörelse',
            ru: 'Уменьшить движение в анимациях'
        },
        body: {
            en: 'Decreases the intensity of animations, hover effects, and other moving parts',
            de: 'Verringert die Intensität von Animationen, Hover-Effekten und anderen beweglichen Komponenten',
            es: 'Reduce la intensidad de las animaciones, efectos al pasar el cursor, y otras partes móviles',
            sv: 'Minskar intensiteten av animationer, effekter vid hovring, och andra rörande delar',
            ru: 'Уменьшает интенсивность анимаций, эффектов при наведении и других движущихся элементов'
        }
    },
    banners: {
        en: 'Banners',
        de: 'Banner',
        es: 'Banner',
        sv: 'Banner',
        ru: 'Баннеры'
    },
    view_backgrounds_on: {
        en: 'View banners on',
        de: 'Banner anzeigen auf',
        es: 'Ver banners en',
        sv: 'Visa banners på',
        ru: 'Показывать баннеры на'
    },
    own_profile: {
        en: 'Own profile',
        de: 'Meinem Profil',
        es: 'Perfil personal',
        sv: 'Din egen profil',
        ru: 'Собственном профиле'
    },
    other_profiles: {
        en: 'Other profiles',
        de: 'Anderen Profilen',
        es: 'Otros perfiles',
        sv: 'Andra profiler',
        ru: 'Других профилях'
    },
    profile_avi_background: {
        name: {
            en: 'Prefer avatar image for profiles without a banner',
            de: 'Bevorzuge Profilbild für Profile ohne Banner',
            es: 'Preferir imagen del avatar para perfiles sin un banner',
            sv: 'Föredra profilbild för profiler utan en banner',
            ru: 'Предпочитать изображение аватара для профилей без баннера'
        },
        body: {
            en: 'All artist-based banner images will be replaced by the user’s avatar',
            de: 'Alle künstlerbasierten Bannerbilder werden durch das Profilbild des Benutzers ersetzt',
            es: 'Todos los banners con imágenes de artistas serán reemplazados por el avatar del usuario',
            sv: 'Alla artistbaserade bannerbilder blir ersätt av användarens profilbild',
            ru: 'Все баннеры на основе артистов будут заменены аватаром пользователя'
        }
    },
    profile_banner: {
        name: {
            en: 'Profile banner',
            de: 'Profilbanner',
            es: 'Banner de perfil',
            sv: 'Profilbanner',
            ru: 'Баннер профиля'
        },
        body: {
            en: 'Add your own custom banner image to your profile with [banner=url] in your bio',
            de: 'Füge deinem Profil ein eigenes Bannerbild hinzu, indem du deiner Biografie [banner=url] hinzufügst',
            es: 'Añade una imagen de banner personalizada a tu perfil con [banner=url] en tu biografía',
            sv: 'Läg till en egen banner till din profil genom att sätta [banner=url] i din biografi',
            ru: 'Добавьте собственное изображение баннера в свой профиль с помощью [banner=url] в вашей биографии'
        }
    },
    profile_accent: {
        name: {
            en: 'Profile accent',
            de: 'Profilakzent',
            es: 'Acento de perfil',
            sv: 'Profilaccent',
            ru: 'Акцент профиля'
        },
        body: {
            en: 'Add flair to your profile visible to all users regardless of personal accent',
            de: 'Füge deinem Profil einen Akzent hinzu, der für alle Benutzer sichtbar ist, unabhängig von deren persönlichem Akzent',
            es: 'Añade estilo a tu perfil visible para todos los usuarios, independientemente del acento personal',
            sv: 'Lägg till flair på din profil som syns för alla användare oberoende på egen accentfärg',
            ru: 'Добавьте изюминку в свой профиль, видимую всем пользователям независимо от их личного акцента'
        },
        reminder: {
            en: 'Changed your accent, don’t forget to save!',
            de: 'Du hast deinen Akzent geändert, vergiss’ nicht zu speichern!',
            es: 'Acento cambiado, ¡no te olvides de guardar!',
            sv: 'Ändrade din accentfärg, glöm inte att spara!',
            ru: 'Вы изменили акцент, не забудьте сохранить!'
        }
    },
    profile_font: {
        name: {
            en: 'Profile name font',
            es: 'Fuente del nombre de perfil',
            ru: 'Шрифт имени профиля'
        },
        body: {
            en: 'Customise the font family used for your username, only visible on your profile',
            es: 'Customiza la familia tipográfica usada en tu nombre de usuario, solo visible en tu perfil',
            ru: 'Настройте семейство шрифтов, используемое для вашего имени пользователя; оно будет видно только в вашем профиле'
        },
        reminder: {
            en: 'Changed your name font, don’t forget to save!',
            es: 'Fuente del nombre cambiada, ¡no te olvides de guardar!',
            ru: 'Шрифт имени изменен, не забудьте сохранить!'
        }
    },
    none: {
        en: 'None',
        de: 'Keins',
        es: 'Ninguno',
        sv: 'Ingen',
        ru: 'Нет',
        banner: {
            // no profile banner present
            en: 'None',
            de: 'Keins',
            es: 'Ninguno',
            sv: 'Ingen',
            ru: 'Нет'
        },
        starred_friend: {
            // no starred friend selected
            en: 'None',
            de: 'Kein:e',
            es: 'Ninguno',
            sv: 'Ingen',
            ru: 'Нет'
        }
    },
    current_banner_value: {
        // uses none.banner from above
        en: 'Current banner: {v}',
        de: 'Aktuelles Banner: {v}',
        es: 'Banner actual: {v}',
        sv: 'Nuvarande banner: {v}',
        ru: 'Текущий баннер: {v}'
    },
    show_your_progress: {
        name: {
            en: 'Show your plays compared to last week',
            de: 'Zeige deine Plays im Vergleich zur letzten Woche',
            es: 'Mostrar tus reproducciones en comparación a la semana pasada',
            sv: 'Visa dina spelningar jämfört med förra veckan',
            ru: 'Показать ваши прослушивания по сравнению с прошлой неделей'
        },
        body: {
            en: 'Compares your current progress to last week’s average, requires Last.fm Pro',
            de: 'Vergleicht deinen aktuellen Fortschritt mit dem Durchschnitt der letzten Woche, erfordert Last.fm Pro',
            es: 'Compara tu progreso actual al promedio de la semana pasada, requiere Last.fm Pro',
            sv: 'Jämför denna veckans spelningar med förra veckan, kräver Last.fm Pro',
            ru: 'Сравнивает ваш текущий прогресс со средним показателем прошлой недели, требуется Last.fm Pro'
        }
    },
    manual: {
        en: 'Manual',
        de: 'Manuell',
        es: 'Manual',
        sv: 'Manuellt',
        ru: 'Вручную'
    },
    enter_a_manual_date: {
        en: 'Enter a date in the format YYYY-MM-DD',
        de: 'Gebe ein Datum im Format JJJJ-MM-TT ein',
        es: 'Ingresa una fecha en formato AAAA-MM-DD',
        sv: 'Skriv in ett datum med formatet YYYY-MM-DD',
        ru: 'Введите дату в формате ГГГГ-ММ-ДД'
    },
    minimum_value: {
        en: 'Minimum: {v}',
        de: 'Minimum: {v}',
        es: 'Mínimo: {v}',
        sv: 'Minst: {v}',
        ru: 'Минимум: {v}'
    },
    maximum_value: {
        en: 'Maximum: {v}',
        de: 'Maximum: {v}',
        es: 'Máximo: {v}',
        sv: 'Max: {v}',
        ru: 'Максимум: {v}'
    },
    manual_date: {
        en: 'Type a date manually',
        de: 'Datum manuell eingeben',
        es: 'Ingresa una fecha manualmente',
        sv: 'Skriv in ett datum manuellt',
        ru: 'Ввести дату вручную'
    },
    red: {
        en: 'Red',
        de: 'Rot',
        es: 'Rojo',
        pt: 'Vermelho',
        sv: 'Röd',
        ru: 'Красный'
    },
    orange: {
        en: 'Orange',
        de: 'Orange',
        es: 'Naranja',
        pt: 'Laranja',
        ru: 'Оранжевый'
    },
    yellow: {
        en: 'Yellow',
        de: 'Gelb',
        es: 'Amarillo',
        pt: 'Amarelo',
        sv: 'Gul',
        ru: 'Желтый'
    },
    lime: {
        en: 'Lime',
        de: 'Limette',
        es: 'Lima',
        pt: 'Lima',
        ru: 'Салатовый'
    },
    green: {
        en: 'Green',
        de: 'Grün',
        es: 'Verde',
        pt: 'Verde',
        sv: 'Grön',
        ru: 'Зеленый'
    },
    aqua: {
        en: 'Aqua',
        de: 'Türkis',
        es: 'Aqua',
        pt: 'Água',
        sv: 'Turkos',
        ru: 'Бирюзовый'
    },
    blue: {
        en: 'Blue',
        de: 'Blau',
        es: 'Azul',
        pt: 'Azul',
        sv: 'Blå',
        ru: 'Синий'
    },
    purple: {
        en: 'Purple',
        de: 'Lila',
        es: 'Morado',
        pt: 'Roxo',
        sv: 'Lila',
        ru: 'Фиолетовый'
    },
    pink: {
        en: 'Pink',
        de: 'Rosa',
        es: 'Rosa',
        pt: 'Rosa',
        sv: 'Rosa',
        ru: 'Розовый'
    },
    grey: {
        en: 'Grey',
        de: 'Grau',
        es: 'Gris',
        pt: 'Cinza',
        sv: 'Grå',
        ru: 'Серый'
    },
    minis: {
        // 'Minis' is the word i eventually settled on for
        // the games and tools integrated into bleh
        en: 'Minis',
        de: 'Minis',
        es: 'Minis',
        sv: 'Mini',
        ru: 'Мини'
    },
    minis_description: {
        en: 'Play mini-games, puzzles, and interact with tools all powered by your listening history',
        de: 'Spiele Minispiele, Rätsel und interagiere mit Tools, die auf deinem Hörverlauf basieren',
        es: 'Juega minijuegos, puzzles, e interactúa con herramientas que usan tu historial de reproducciones',
        sv: 'Spela minispel, pussel, och interagera med verktyg som är helt baserad på din lyssningshistorik',
        ru: 'Играйте в мини-игры, решайте головоломки и взаимодействуйте с инструментами, основанными на вашей истории прослушиваний'
    },
    no_mini_found: {
        en: 'No mini found for ‘{v}’',
        de: 'Kein Mini für „{v}“ gefunden',
        es: 'No se ha encontrado mini para {v}',
        sv: 'Ingen mini hittad för ‘{v}’',
        ru: 'Мини-игра для «{v}» не найдена'
    },
    pixel: {
        name: {
            en: 'Pixel',
            es: 'Píxel',
            sv: 'Pixel',
            ru: 'Пиксель'
        },
        body: {
            en: 'Guess the album from its pixelated artwork and clues',
            de: 'Errate das Album anhand des verpixelten Albumcovers und Hinweisen',
            es: 'Averigua el álbum usando su cáratula pixelada y pistas',
            sv: 'Gissa albumet från sin pixellerad konst och ledtrådar',
            ru: 'Угадайте альбом по его пиксельному изображению и подсказкам'
        }
    },
    rainbow: {
        name: {
            en: 'Rainbow',
            de: 'Regenbogen',
            es: 'Arcoíris',
            sv: 'Rainbow',
            ru: 'Радуга'
        },
        body: {
            en: 'Arrange your listening history into a swirl of colours',
            de: 'Stelle deinen Hörverlauf als Farbwirbel dar',
            es: 'Organiza tu historial de reproducciones en un remolino de colores',
            sv: 'Ordna ihop din lyssningshistorik till en virvel av färg',
            ru: 'Разложите вашу историю прослушиваний в вихре цветов'
        }
    },
    receipt: {
        name: {
            en: 'Receipt',
            de: 'Quittung',
            es: 'Recibo',
            sv: 'Kvitto',
            ru: 'Чек'
        },
        body: {
            en: 'Print out your top tracks as a receipt',
            de: 'Drucke deine Top-Songs als Quittung aus',
            es: 'Imprime tus temas más escuchados como un recibo',
            sv: 'Skriv ut dina topplåtar som ett kvitto',
            ru: 'Распечатайте ваши лучшие треки в виде чека'
        }
    },
    collage_description: {
        en: 'Generate a personalised image based on your listening history and options',
        de: 'Erstelle ein personalisiertes Bild basierend auf deinem Hörverlauf und deinen Einstellungen',
        es: 'Genera una imagen personalizada basada en tu historial de reproducciones y opciones',
        sv: 'Skapa en personlig bild baserad på din lyssningshistoria och inställningar',
        ru: 'Создать персонализированное изображение на основе вашей истории прослушиваний и настроек'
    },
    labs_cta: {
        // a period on the end looks weird cus of the link
        en: 'If you’re looking for more, try out Last.fm’s own {a}Labs feature{/a}',
        de: 'Wenn du nach mehr suchst, probiere die {a}Labs-Funktion{/a} von Last.fm aus',
        es: 'Si estás buscando más, prueba algo similar en {a}Last.fm Labs{/a}',
        sv: 'Om du letar efter lite mer, testa Last.fm’s {a}egna Labs{/a}',
        ru: 'Если вы ищете что-то еще, попробуйте {a}функцию Labs{/a} от Last.fm'
    },
    compare_description: {
        en: 'Find your shared artists, albums, and tracks with another',
        de: 'Finde heraus, welche gemeinsamen Künstler:innen, Alben und Tracks du mit jemand anderem teilst',
        es: 'Encuentra artistas, álbumes, y temas compartidos con alguien más',
        sv: 'Hitta dina delade artister, album, och låtar med nån annan',
        ru: 'Найдите общих исполнителей, альбомы и треки с другим пользователем'
    },
    enter_a_profile: {
        en: 'Enter a profile',
        de: 'Profil eingeben',
        es: 'Ingresa un perfil',
        sv: 'Skriv in ett användarnamn',
        ru: 'Введите профиль'
    },
    compare_with: {
        en: 'Compare with',
        de: 'Vergleichen mit',
        es: 'Comparar con',
        sv: 'Jämför',
        ru: 'Сравнить с'
    },
    value_settings: {
        en: '{v} Settings',
        de: '{v}-Einstellungen',
        es: '{v} Opciones',
        sv: '{v} Inställningar',
        ru: 'Настройки {v}'
    },
    suggest_title: {
        name: {
            en: 'This page doesn’t seem official',
            de: 'Diese Seite scheint nicht offiziell zu sein',
            es: 'Esta página no parece ser oficial',
            sv: 'Denna sida ser inte ut att vara officiell',
            ru: 'Эта страница не кажется официальной'
        },
        body: {
            en: 'Navigate to {v} instead',
            de: 'Stattdessen zu {v} wechseln',
            es: 'Navega a {v} en su lugar',
            sv: 'Hoppa till {v} istället',
            ru: 'Перейти к {v} вместо этого'
        }
    },
    lyrics: {
        // lyrics
        en: 'Lyrics',
        es: 'Letra',
        pt: 'Letra',
        sv: 'Lyrics',
        ru: 'Тексты песен',
        name: {
            // the game
            en: 'Lyrics',
            es: 'Letra',
            pt: 'Letra',
            sv: 'Lyrics',
            ru: 'Тексты песен'
        },
        body: {
            en: 'Guess the song from a random lyric',
            de: 'Errate den Song anhand eines zufälligen Songtextes',
            es: 'Averigua el tema usando una letra aleatoria',
            pt: 'Adivinhe a música a partir de uma letra aleatória',
            sv: 'Gissa låten från en slumpad låttext',
            ru: 'Угадайте песню по случайной строчке текста'
        }
    },
    jumbled_title: {
        en: 'Jumbled title',
        de: 'Song-Durcheinander',
        es: 'Título desordenado',
        pt: 'Título embaralhado',
        sv: 'Omrörd titel',
        ru: 'Перепутанное название'
    },
    re_jumble: {
        en: 'Re-jumble',
        de: 'Neu mischen',
        es: 'Volver a desordenar',
        pt: 'Reembaralhar',
        sv: 'Rör om igen',
        ru: 'Перемешать заново'
    },
    begin: {
        en: 'Begin',
        de: 'Start',
        es: 'Empezar',
        pt: 'Começar',
        sv: 'Börja',
        ru: 'Начать'
    },
    jumbled_guess: {
        en: 'Guess the album name with the pixelated cover, jumbled title, and hints!',
        de: 'Errate den Albumtitel mit verpixeltem Cover, durcheinandergewürfeltem Titel und Hinweisen!',
        es: '¡Averigua el nombre del álbum usando la cáratula pixelada, título desordenado, y pistas!',
        pt: 'Adivinhe o nome do álbum com a capa pixelada, título embaralhado e dicas!',
        sv: 'Gissa albumtiteln med pixellerad konst, omrörd titel, och ledtrådar!',
        ru: 'Угадайте название альбома по пиксельному изображению, перепутанному названию и подсказкам!'
    },
    add_hint: {
        en: 'Add hint',
        de: 'Gib’ mir einen Tipp!',
        es: 'Dar pista',
        pt: 'Adicionar dica',
        sv: 'Lägg till ledtråd',
        ru: 'Добавить подсказку'
    },
    give_up: {
        en: 'Give up',
        de: 'Aufgeben',
        es: 'Rendirse',
        pt: 'Desistir',
        sv: 'Ge upp',
        ru: 'Сдаться'
    },
    you_guessed_correctly: {
        en: 'You guessed correctly!',
        de: 'Du hast richtig geraten!',
        es: '¡Lo has averiguado!',
        pt: 'Você adivinhou corretamente!',
        sv: 'Du gissade rätt!',
        ru: 'Вы угадали правильно!'
    },
    guess: {
        en: 'Guess',
        de: 'Raten',
        es: 'Averiguar',
        pt: 'Adivinhar',
        sv: 'Gissa',
        ru: 'Угадать'
    },
    enter_a_guess: {
        en: 'Enter a guess',
        de: 'Gebe eine Vermutung ein',
        es: 'Ingresa tu respuesta',
        pt: 'Digite um palpite',
        sv: 'Skriv in en gissning',
        ru: 'Введите догадку'
    },
    hints: {
        en: 'Hints',
        de: 'Tipps',
        es: 'Pistas',
        pt: 'Dicas',
        sv: 'Ledtrådar',
        ru: 'Подсказки',
        plays: {
            en: 'You have {v} plays on this album',
            de: 'Du hast {v} mal einen Song von diesem Album gehört',
            es: 'Tienes {v} reproducciones a este álbum',
            pt: 'Você tem {v} reproduções neste álbum',
            sv: 'Du har {v} lyssningar på det här albumet',
            ru: 'У вас {v} прослушиваний этого альбома'
        },
        release: {
            en: 'Album was released on {v}',
            de: 'Das Album wurde am {v} veröffentlicht',
            es: 'El {álbum} fue lanzado en {v}',
            pt: 'O álbum foi lançado em {v}',
            sv: 'Albumet släpptes {v}',
            ru: 'Альбом был выпущен {v}'
        },
        tag: {
            en: 'The artist is tagged with {v}',
            de: 'Der/die Künstler:in ist mit {v} getaggt',
            es: 'El artista tiene {v} como tags',
            pt: 'O artista foi marcado com {v}',
            sv: 'Artisten har taggats som {v}',
            ru: 'Исполнитель отмечен тегом {v}'
        },
        born: {
            en: 'The artist was born {v}',
            de: 'Der/die Künstler:in wurde {v} geboren',
            es: 'El artista nació en {v}',
            pt: 'O artista nasceu em {v}',
            sv: 'Artisten var född {v}',
            ru: 'Исполнитель родился {v}'
        }
    },
    reveal: {
        en: 'The album was {name} by {artist}',
        de: 'Das Album war {name} von {artist}',
        es: 'El álbum era {name} por {artist}',
        pt: 'O álbum era {name} de {artist}',
        sv: 'Albumet var {name} av {artist}',
        ru: 'Альбомом был {name} от {artist}'
    },
    time_up: {
        en: 'Time is up!',
        de: 'Die Zeit ist um!',
        es: '¡Se acabó el tiempo!',
        pt: 'O tempo acabou!',
        sv: 'Slut på tid!',
        ru: 'Время вышло!'
    },
    global: {
        en: 'Global',
        de: 'Weltweit',
        es: 'Global',
        pt: 'Global',
        sv: 'Globalt',
        ru: 'Глобальный'
    },
    mutuals: {
        en: 'Mutuals',
        de: 'Mutuals',
        es: 'Mutuales',
        pt: 'Mutuais',
        sv: 'Ömsesidiga följare',
        ru: 'Взаимные подписки'
    },
    missing_component: {
        // cases when last.fm simply doesn't provide a tasteometer or other things
        en: 'Last.fm failed to load this component',
        de: 'Last.fm konnte diese Komponente nicht laden',
        es: 'Last.fm falló al cargar este componente',
        pt: 'Last.fm falhou ao carregar este componente',
        sv: 'Last.fm kunde inte ladda denna komponent',
        ru: 'Last.fm не смог загрузить этот компонент'
    },
    last_scrobbled_replace: {
        en: '{u} last scrobbled…',
        de: '{u} scrobbelte zuletzt…',
        fr: '{u} a scrobblé pour la dernière fois...',
        ja: '{u} が Scrobble した最新アイテム…',
        es: 'Último scrobbling de {u}…',
        it: 'Gli ultimi scrobbling di {u}…',
        pl: '{u} ostatnio scrobblował…',
        pt: 'Última faixa de {u} incluída no scrobble…',
        ru: '{u} скробблил(а) в последний раз…',
        sv: '{u} skrobblade senast…',
        tr: '{u} adlı kullanıcının son skropladıkları …',
        zh: '{u} 上次记录了...'
    },
    notification_replied_ctx: {
        // notifications can include text with valuable info such as:
        // and 7 others replied to your shout on
        // this is searching for the word "replied"
        // dont re-translate this, as its copied from last.fm
        en: 'replied',
        de: 'hat geantwortet',
        fr: 'a répondu',
        ja: '返信しました',
        es: 'respondió',
        it: 'risposto',
        pl: 'odpowiedział',
        pt: 'respondeu',
        ru: 'ответил(а)',
        sv: 'svarade',
        tr: 'cevap verdi',
        zh: '回复了'
    },
    user_commented: {
        en: '{u} commented',
        de: '{u} hat kommentiert',
        es: '{u} comentó',
        pt: '{u} comentou',
        sv: '{u} kommenterade',
        ru: '{u} прокомментировал(а)'
    },
    users_commented: {
        en: '{u} and {c} others commented',
        de: '{u} und {c} andere haben kommentiert',
        es: '{u} y {c} otros comentaron',
        pt: '{u} e {c} outros comentaram',
        sv: '{u} och {c} andra kommenterade',
        ru: '{u} и еще {c} прокомментировали'
    },
    user_replied: {
        en: '{u} replied',
        de: '{u} hat geantwortet',
        es: '{u} respondió',
        pt: '{u} respondeu',
        sv: '{u} svarade',
        ru: '{u} ответил(а)'
    },
    users_replied: {
        en: '{u} and {c} others replied',
        de: '{u} und {c} andere haben geantwortet',
        es: '{u} y {c} otros respondieron',
        pt: '{u} e {c} outros responderam',
        sv: '{u} och {c} andra svarade',
        ru: '{u} и еще {c} ответили'
    },
    obsession_expired: {
        en: 'Your obsession has expired',
        de: 'Deine Obsession ist ausgelaufen',
        es: 'Tu obsesión ha expirado',
        pt: 'Sua obsessão expirou',
        sv: 'Din besatthet har tagit slut',
        ru: 'Ваша одержимость истекла'
    },
    listening_report_available: {
        en: 'View your {m} listening report',
        de: 'Schaue deinen Hörbericht an',
        es: 'Ver tu informe de reproducción de {m}',
        pt: 'Ver seu relatório de reprodução de {m}',
        sv: 'Visa din lyssningsrapport för {m}',
        ru: 'Посмотреть ваш отчет о прослушиваниях за {m}'
    },
    count_mutual_listeners: {
        en: 'You have {c} mutual listeners',
        de: 'Du hast {c} gemeinsame Hörer',
        es: 'Tienes {c} oyentes mutuales',
        pt: 'Você tem {c} ouvintes mútuos',
        sv: 'Du har {c} ömsesidiga lyssnare',
        ru: 'У вас {c} взаимных слушателей'
    },
    no_mutual_listeners: {
        en: 'You have no mutual listeners',
        de: 'Du hast keine gemeinsamen Hörer',
        es: 'No tienes oyentes mutuales',
        pt: 'Você não tem ouvintes mútuos',
        sv: 'Du har inga ömsesidiga lyssnare',
        ru: 'У вас нет взаимных слушателей'
    },
    no_mutual_listeners_explain: {
        en: 'This can be due to either simply lacking mutuals who listen or the page being subject to a broken redirect.',
        de: 'Dies kann entweder an fehlenden Mutuals oder einer fehlerhaften Seitenweiterleitung liegen.',
        es: 'Esto puede deberse a que simplemente no hay mutuales que escuchen o a que la página tiene una redirección defectuosa.',
        pt: 'Isso pode ser devido a falta de mutuais que ouçam ou a página estar sujeita a um redirecionamento quebrado.',
        sv: 'Det kan innebära att du antingen inte har ömsesidiga följare som lyssnar eller att sidan har en gammal omdirigering.',
        ru: 'Это может быть связано либо с отсутствием взаимных слушателей, либо с неисправным перенаправлением страницы.'
    },
    navigation_items: {
        name: {
            en: 'Quick access',
            de: 'Schnellzugriff',
            es: 'Acceso rápido',
            pt: 'Acesso rápido',
            sv: 'Snabbåtkomst',
            ru: 'Быстрый доступ'
        },
        body: {
            en: 'Arrange your navigation menu to suit your usage best',
            de: 'Ordne dein Navigationsmenü so an, dass es am besten zu deiner Nutzung passt',
            es: 'Ordena tu menú de navegación como más te agrade',
            pt: 'Organize seu menu de navegação para melhor se adequar ao seu uso',
            sv: 'Ordna din navigationsmeny för att bäst passa dig',
            ru: 'Настройте ваше навигационное меню, чтобы оно наилучшим образом соответствовало вашему использованию'
        }
    },
    edit_quick_access: {
        en: 'Edit quick access',
        de: 'Schnellzugriff bearbeiten',
        es: 'Editar acceso rápido',
        pt: 'Editar acesso rápido',
        sv: 'Redigera snabbåtkomst',
        ru: 'Редактировать быстрый доступ'
    },
    navigation_language: {
        en: 'Show option to change language',
        de: 'Option zum Ändern der Sprache anzeigen',
        es: 'Mostrar opción para cambiar idioma',
        pt: 'Mostrar opção para mudar idioma',
        sv: 'Visa alternativet att ändra språk',
        ru: 'Показать опцию смены языка'
    },
    branding: {
        en: 'Branding',
        es: 'Logo',
        de: 'Branding',
        sv: 'Branding',
        ru: 'Брендинг'
    },
    branding_type: {
        name: {
            en: 'Branding type',
            de: 'Branding-Art',
            es: 'Tipo de logo',
            pt: 'Tipo de branding',
            sv: 'Brandingalternativ',
            ru: 'Тип брендинга'
        },
        body: {
            en: 'Decide which branding source to use for the header',
            de: 'Wähle aus, welches Branding für die Kopfzeile verwendet werden soll',
            es: 'Elige cuál logo usar para el encabezado',
            pt: 'Escolha qual logo usar para o cabeçalho',
            sv: 'Välj vilken sorts branding för att använda på sidhuvudet',
            ru: 'Выберите, какой источник брендинга использовать для заголовка'
        }
    },
    rain: {
        name: {
            en: 'Enable rainfall',
            de: 'Regen aktivieren',
            es: 'Activar lluvia',
            pt: 'Ativar chuva',
            sv: 'Aktivera regn',
            ru: 'Включить эффект дождя'
        },
        body: {
            en: 'Immerse yourself in soothing visual rain',
            de: 'Tauche in den beruhigenden visuellen Regen ein',
            es: 'Deja que la relajante lluvia caiga ante ti',
            pt: 'Mergulhe em uma chuva visual relaxante',
            sv: 'Omsluta dig själv i en lugnande regneffekt',
            ru: 'Погрузитесь в успокаивающий визуальный дождь'
        }
    },
    images: {
        en: 'Images',
        de: 'Bilder',
        es: 'Imágenes',
        pt: 'Imagens',
        sv: 'Bilder',
        ru: 'Изображения'
    },
    static_gifs: {
        en: 'Control animation of GIFs',
        de: 'Steuere die Animation von GIFs',
        es: 'Controlar animación de GIFs',
        pt: 'Controlar animação de GIFs',
        sv: 'Kontrollera GIF-animation',
        ru: 'Управление анимацией GIF'
    },
    always_animate: {
        en: 'Always animate',
        de: 'Immer animieren',
        es: 'Siempre animar',
        pt: 'Sempre animar',
        sv: 'Animera alltid',
        ru: 'Всегда анимировать'
    },
    only_on_hover: {
        en: 'Only on hover',
        de: 'Nur beim Hovern',
        es: 'Solo al pasar el cursor',
        pt: 'Apenas ao passar o mouse',
        sv: 'Endast under hovring',
        ru: 'Только при наведении'
    },
    static_banners: {
        en: 'Prevent animations in profile banners',
        de: 'Deaktiviere Animationen in Profilbannern',
        es: 'Prevenir animaciones en banners de perfil',
        pt: 'Impedir animações em banners de perfil',
        sv: 'Stäng av animationer i profilbanners',
        ru: 'Предотвратить анимацию в баннерах профиля'
    },
    change_zoom: {
        en: 'Change zoom level',
        de: 'Zoomlevel ändern',
        es: 'Cambiar nivel de zoom',
        pt: 'Alterar nível de zoom',
        sv: 'Ändra zoomnivå',
        ru: 'Изменить уровень масштабирования'
    },
    static_avatars: {
        en: 'User avatars',
        de: 'Benutzer-Profilbilder',
        es: 'Avatars de usuario',
        pt: 'Avatares de usuário',
        sv: 'Användarprofilbilder',
        ru: 'Аватары пользователей'
    },
    static_music: {
        en: 'Artists and albums',
        de: 'Künstler:innen und Alben',
        es: 'Artistas y álbumes',
        pt: 'Artistas e álbuns',
        sv: 'Artister och album',
        ru: 'Исполнители и альбомы'
    },
    apply_to: {
        en: 'Apply to',
        de: 'Anwenden auf',
        es: 'Aplicar a',
        pt: 'Aplicar a',
        sv: 'Tillämpa till',
        ru: 'Применить к'
    },
    change_images_for: {
        en: 'Change images for',
        de: 'Bilder ändern für',
        es: 'Cambiar imágenes para',
        pt: 'Alterar imagens para',
        sv: 'Ändra bild för',
        ru: 'Изменить изображения для'
    },
    leaving_site: {
        name: {
            en: 'Don’t get lost',
            de: 'Verirre dich nicht',
            es: 'No te pierdas',
            pt: 'Não se perca',
            sv: 'Gå inte vilse',
            ru: 'Не потеряйтесь'
        },
        body: {
            en: 'This link is taking you to the following location',
            de: 'Dieser Link führt dich zu folgendem Ort',
            es: 'Este link te está llevando a la siguiente ubicación',
            pt: 'Este link está te levando para o seguinte local',
            sv: 'Länken tar dig till den här platsen',
            ru: 'Эта ссылка ведет вас в следующее местоположение'
        }
    },
    leaving_site_dangerous: {
        name: {
            en: 'Be careful',
            de: 'Vorsicht',
            es: 'Ten cuidado',
            pt: 'Tenha cuidado',
            sv: 'Var försiktig',
            ru: 'Будьте осторожны'
        },
        body: {
            en: 'This link can open an application on your device',
            de: 'Dieser Link kann eine Anwendung auf deinem Gerät öffnen',
            es: 'Este link puede abrir una aplicación en tu dispositivo',
            pt: 'Este link pode abrir um aplicativo no seu dispositivo',
            sv: 'Länken kan öppna en applikation på din enhet',
            ru: 'Эта ссылка может открыть приложение на вашем устройстве'
        }
    },
    leaving_site_checkbox: {
        en: 'Trust {v} links in the future',
        de: '{v}-Links zukünftig vertrauen',
        es: 'Confiar en los vínculos de {v} en el futuro',
        pt: 'Confiar em links de {v} no futuro',
        sv: 'Lita på länkar från {v} i framtiden',
        ru: 'Доверять ссылкам {v} в будущем'
    },
    visit: {
        // visit site
        en: 'Visit',
        de: 'Besuchen',
        es: 'Visitar',
        pt: 'Visitar',
        sv: 'Besök',
        ru: 'Посетить'
    },
    auto_correct_scrobbles: {
        name: {
            en: 'Auto correct and redirect scrobbles',
            de: 'Automatisches Korrigieren und Umleiten von Scrobbles',
            es: 'Corregir y redireccionar automáticamente los scrobblings',
            pt: 'Corrigir e redirecionar scrobbles automaticamente',
            sv: 'Autokorrigering och omdirigering av skrobblingar',
            ru: 'Автоматически исправлять и перенаправлять скробблы'
        },
        body: {
            en: 'Changes artist names based on the legacy Last.fm redirect system pre-2015, causes many issues',
            de: 'Ändert Künstlernamen basierend auf dem Legacy-Last.fm-Umleitungssystem vor 2015, verursacht viele Probleme',
            es: 'Cambia el nombre del artista basado en el sistema clásico de redirecciones de Last.fm pre-2015, causa varios problemas',
            sv: 'Ändrar artistnamn baserad på Last.fms omdirigeringssystem från innan 2015, skapar många problem',
            ru: 'Изменяет имена исполнителей на основе устаревшей системы перенаправления Last.fm до 2015 года, что вызывает много проблем'
        },
        warning: {
            en: 'This setting should be turned off to ensure scrobbles are correctly stored for each artist.',
            de: 'Diese Einstellung sollte deaktiviert werden, um sicherzustellen, dass Scrobbles für jeden Künstler korrekt gespeichert werden.',
            pt: 'Esta configuração deve ser desativada para garantir que os scrobbles sejam armazenados corretamente para cada artista.',
            es: 'Esta opción debería estar desactivada para garantizar que los scrobblings se almacenen correctamente para cada artista.',
            sv: 'Denna inställning ska stängas av för att vara säker på att dina skrobblingar är rätt för alla artister.',
            ru: 'Эту настройку следует отключить, чтобы гарантировать правильное сохранение скробблов для каждого исполнителя.'
        },
        false: {
            en: 'Do not apply corrections (recommended)',
            es: 'No aplicar correcciones (recomendado)',
            pt: 'Não aplicar correções (recomendado)',
            sv: 'Tillämpa inte korrigeringar (rekommenderat)',
            ru: 'Не применять исправления (рекомендуется)'
        },
        true: {
            en: 'Auto correct my scrobbles (legacy)',
            es: 'Corregir automáticamente mis scrobblings (clásico)',
            sv: 'Autokorrigera mina skrobblingar (gammal)',
            ru: 'Автоматически исправлять мои скробблы (устаревшее)',
            pt: 'Corrigir automaticamente meus scrobbles (legado)'
        }
    },
    preferred_affiliate: {
        name: {
            en: 'Preferred playback source',
            es: 'Fuente de reproducción preferida',
            pt: 'Fonte de reprodução preferida',
            sv: 'Föredragen uppspelningskälla',
            ru: 'Предпочитаемый источник воспроизведения'
        },
        body: {
            en: 'Choose which service to use when interacting with playables across the site',
            es: 'Elige cuál servicio usar al interactuar con elementos reproducibles a través del sitio',
            sv: 'Välj vilken service att använda när du spelar upp låtar',
            ru: 'Выберите, какой сервис использовать при взаимодействии с воспроизводимым контентом на сайте',
            pt: 'Escolha qual serviço usar ao interagir com elementos reproduzíveis em todo o site'
        }
    },
    timezone: {
        en: 'Timezone',
        de: 'Zeitzone',
        es: 'Zona horaria',
        sv: 'Tidszon',
        ru: 'Часовой пояс',
        pt: 'Fuso horário'
    },
    location: {
        name: {
            en: 'Location',
            de: 'Standort',
            es: 'Ubicación',
            sv: 'Plats',
            ru: 'Местоположение',
            pt: 'Localização'
        },
        body: {
            en: 'Last.fm uses your location for event recommendations and local music data',
            de: 'Last.fm verwendet deinen Standort für Veranstaltungsempfehlungen und lokale Musikdaten',
            es: 'Last.fm usa tu ubicación para recomendaciones de eventos y datos locales de música',
            sv: 'Last.fm använder din plats för evenemangrekommendationer och lokal musikdata',
            ru: 'Last.fm использует ваше местоположение для рекомендаций мероприятий и данных о местной музыке',
            pt: 'Last.fm usa sua localização para recomendações de eventos e dados locais de música'
        }
    },
    event_radius: {
        en: 'Event search radius',
        de: 'Suchradius für Veranstaltungen',
        es: 'Radio de búsqueda de eventos',
        pt: 'Raio de busca de eventos',
        sv: 'Sökradie för evenemang',
        ru: 'Радиус поиска мероприятий'
    },
    you_need_to_be_logged_in: {
        en: 'You need to be logged in',
        de: 'Du musst eingeloggt sein',
        es: 'Necesitas iniciar sesión',
        pt: 'Você precisa estar logado',
        sv: 'Du lär vara inloggad',
        ru: 'Вам необходимо войти в систему'
    },
    oracle_notice: {
        en: 'You are currently testing ‘oracle’, a redesigned album and track view',
        de: 'Du testest gerade „oracle“, eine neu gestaltete Album- und Titelseite',
        es: 'Estás actualmente probando ‘oracle’, un estilo rediseñado de álbumes y temas',
        pt: 'Você está atualmente testando ‘oracle’, um estilo redesenhado de álbuns e faixas',
        sv: 'Du testar just no ‘oracle’, ett omdesignat sätt att visa album och låtsidor',
        ru: 'В настоящее время вы тестируете «oracle», обновленный вид альбомов и треков'
    },
    debug: {
        en: 'Debug',
        es: 'Debug',
        pt: 'Debug',
        sv: 'Debug',
        ru: 'Отладка'
    },
    send_feedback: {
        en: 'Send feedback',
        de: 'Feedback senden',
        es: 'Enviar feedback',
        pt: 'Enviar feedback',
        sv: 'Skicka feedback',
        ru: 'Отправить отзыв'
    },
    oracle_heading: {
        en: 'Experimental',
        de: 'Experimentell',
        es: 'Experimental',
        pt: 'Experimental',
        sv: 'Experimentalt',
        ru: 'Экспериментально'
    },
    oracle_beta: {
        name: {
            en: 'Enable the experimental ‘oracle’ system',
            de: 'Experimentelles „oracle“-System aktivieren',
            es: 'Activar el sistema experimental ‘oracle’',
            pt: 'Ativar o sistema experimental ‘oracle’',
            sv: 'Aktivera det experimentella ‘oracle’-systemet',
            ru: 'Включить экспериментальную систему «oracle»'
        },
        body: {
            en: 'A redesigned album and track view sourcing data from MusicBrainz. May be released in the future or scrapped. Please send feedback from usage.',
            de: 'Eine neu gestaltete Album- und Titelseite, die Daten von MusicBrainz bezieht. Kann in Zukunft veröffentlicht oder verworfen werden. Bitte sende Feedback basierend auf deiner Nutzung.',
            es: 'Un estilo rediseñado de álbumes y temas usando datos provenientes de MusicBrainz. Puede ser lanzado en un futuro o ser descartado. Por favor envía feedback de uso.',
            pt: 'Um estilo redesenhado de álbuns e faixas que utiliza dados do MusicBrainz. Pode ser lançado no futuro ou descartado. Por favor, envie feedback sobre o uso.',
            sv: 'Omdesignade album och låtsidor med data från MusicBrainz. Kan släppas eller skräpas i framtiden. Skicka gärna feedback från användning.',
            ru: 'Обновленный вид альбомов и треков, получающий данные из MusicBrainz. Может быть выпущен в будущем или отменен. Пожалуйста, отправляйте отзывы об использовании.'
        }
    },
    label: {
        en: 'Label',
        de: 'Label',
        es: 'Sello',
        pt: 'Gravadora',
        sv: 'Skivbolag',
        ru: 'Лейбл'
    },
    explicit: {
        en: 'Explicit',
        de: 'Anstößig',
        es: 'Explícito',
        pt: 'Explícito',
        sv: 'Explicit',
        ru: 'Нецензурный'
    },
    control_center: {
        en: 'Control center',
        de: 'Kontrollzentrum',
        es: 'Centro de control',
        pt: 'Centro de controle',
        sv: 'Kontrollcenter',
        ru: 'Центр управления'
    },
    romanise_titles: {
        en: 'Romanise music titles and artist names for',
        de: 'Musiktitel und Künstlernamen romanisieren für',
        es: 'Romanizar títulos de música y nombres de artistas para',
        pt: 'Romanizar títulos de músicas e nomes de artistas para',
        sv: 'Romanisera låttitlar och artistnamn för',
        ru: 'Романизировать названия треков и имена исполнителей для'
    },
    romanise_jp: {
        en: '日本語 (Japanese)',
        de: '日本語 (Japanisch)',
        es: '日本語 (Japonés)',
        pt: '日本語 (Japonês)',
        sv: '日本語 (Japanska)',
        ru: '日本語 (Японский)'
    },
    romanise_ko: {
        en: '한국어 (Korean)',
        de: '한국어 (Koreanisch)',
        es: '한국어 (Coreano)',
        pt: '한국어 (Coreano)',
        sv: '한국어 (Koreanska)',
        ru: '한국어 (Корейский)'
    },
    romanise_require: {
        en: 'Romanisation requires either lotus corrections or smart song tags be enabled',
        es: 'La romanización requiere que las correcciones de lotus o los tags inteligentes de temas estén activos',
        pt: 'A romanização requer que as correções lotus ou as tags inteligentes de músicas estejam ativas',
        sv: 'Romanisation kräver antingen att lotus eller smarta låttaggar aktiveras',
        ru: 'Для романизации требуется включение либо lotus corrections, либо умных тегов песен'
    },
    disc_number: {
        en: 'Disc {n}',
        de: 'Disc {n}',
        es: 'Disco {n}',
        pt: 'Disco {n}',
        sv: 'Skiva {n}',
        ru: 'Диск {n}'
    },
    create_playlist: {
        en: 'Create playlist',
        de: 'Playlist erstellen',
        es: 'Crear playlist',
        pt: 'Criar playlist',
        sv: 'Skapa spellista',
        ru: 'Создать плейлист'
    },
    music_links: {
        name: {
            en: 'Music linking',
            de: 'Musikverlinkung',
            es: 'Vínculos de música',
            pt: 'Links de música',
            sv: 'Musiklänkar',
            ru: 'Музыкальные ссылки'
        },
        body: {
            en: 'Choose which services to display for artists, albums, and tracks',
            de: 'Wähle aus, welche Dienste für Künstler:innen, Alben und Songs angezeigt werden sollen',
            es: 'Elige cuáles servicios mostrar para los artistas, álbumes y temas',
            pt: 'Escolha quais serviços exibir para artistas, álbuns e faixas',
            sv: 'Välj vilka tjänster att visa för artister, album, och låtar',
            ru: 'Выберите, какие сервисы отображать для исполнителей, альбомов и треков'
        }
    },
    amount_translated: {
        // number of strings translated
        en: '{c} translated',
        es: '{c} traducidos',
        pt: '{c} traduzidos',
        sv: '{c} översatt',
        ru: 'Переведено {c}'
    },
    missing_translated: {
        // number of strings missing
        en: '{c} missing',
        es: '{c} faltantes',
        pt: '{c} ausentes',
        sv: '{c} saknas',
        ru: 'Отсутствует {c}'
    },
    simulate_scroll: {
        name: {
            en: 'Simulate horizontal scrolling',
            es: 'Simular scrolling horizontal',
            pt: 'Simular rolagem horizontal',
            sv: 'Simulera vågrät skrollning',
            ru: 'Имитировать горизонтальную прокрутку'
        },
        body: {
            en: 'Only recommended for desktop devices',
            es: 'Recomendado solo en dispositivos de escritorio',
            pt: 'Recomendado apenas para computadores de mesa',
            sv: 'Rekommenderas endast för desktop-enheter',
            ru: 'Рекомендуется только для настольных устройств'
        }
    },
    credits: {
        en: 'Credits',
        es: 'Créditos',
        pt: 'Créditos',
        sv: 'Erkännanden',
        ru: 'Кредиты'
    },
    view_credits: {
        en: 'View credits',
        es: 'Ver créditos',
        pt: 'Ver créditos',
        sv: 'Visa erkännanden',
        ru: 'Посмотреть кредиты'
    },
    credits_for_value: {
        en: 'Credits for {v}',
        es: 'Créditos para {v}',
        pt: 'Créditos para {v}',
        sv: 'Erkännanden för {v}',
        ru: 'Кредиты для {v}'
    },
    branch: {
        name: {
            en: 'Choose branch',
            es: 'Elige la rama',
            pt: 'Escolha o ramo', //saying "ramo" in portuguese is weird tbh, it looks like the most correct translation tho
            sv: 'Välj bransh',
            ru: 'Выбрать ветку'
        },
        body: {
            en: 'Default release branch is ‘uwu’, do not change unless you know what you’re doing',
            es: 'La rama de lanzamiento actual es ‘uwu’, no la cambies a menos de que sepas lo que haces',
            sv: 'Standardbranshen är ‘uwu’, ändra inte om du inte vet vad du gör',
            ru: 'Ветка выпуска по умолчанию - "uwu", не меняйте её, если точно не знаете, что делаете'
        }
    },
    log_in: {
        en: 'Log in',
        es: 'Iniciar sesión',
        pt: 'Iniciar Sessão',
        sv: 'Logga in',
        ru: 'Войти'
    },
    sign_up: {
        en: 'Sign up',
        es: 'Registrarse',
        pt: 'Registrar-se',
        sv: 'Registrera',
        ru: 'Зарегистрироваться'
    },
    plot: {
        name: {
            en: 'Plot',
            es: 'Plot',
            sv: 'Rita',
            ru: 'График'
        },
        body: {
            en: 'Create graphs from user libraries',
            es: 'Crea gráficos con base en las colecciones de usuario',
            pt: 'Crie gráficos a partir de bibliotecas de usuários',
            sv: 'Skapa diagram från användarbibliotek',
            ru: 'Создать графики из пользовательских библиотек'
        }
    },
    your_recent_30_days: {
        en: 'Your recent 30 days',
        es: 'Tus últimos 30 días',
        pt: 'Seus últimos 30 dias'
    },
    value_this_month: {
        // number of scrobbles
        en: '{v} this month',
        es: '{v} este mes',
        pt: '{v} este mês'
    },
    menu_replacement: {
        name: {
            en: 'Replace native browser right-click menus',
            es: 'Reemplazar menús de clic derecho nativos del navegador'
        },
        body: {
            en: 'Provide bleh context-specific actions when right-clicking',
            es: 'Proporciona acciones específicas de bleh al hacer clic derecho'
        }
    },
    you_have_new_badges: {
        en: 'You have new badges!',
        es: '¡Tienes nuevos emblemas!',
        pt: 'Você tem novas insígnias!'
    }
};

export function tl(key, replacements = {}) {
    if (!key) {
        log('your key is undefined', 'trans');
        return 'NO_TRANSLATION_FOUND';
    }

    let translation = key[lang] || key.en;

    for (const [placeholder, value] of Object.entries(replacements)) {
        const regex = new RegExp(`{${placeholder}}`, 'g');
        translation = translation.replace(regex, value);
    }

    return translation;
}

function collect_keys(object, prefix, out = []) {
    for (const k in object) {
        const val = object[k];
        const key = prefix ? `${prefix}.${k}` : k;

        if (
            typeof val == 'object' &&
            !Object.keys(lang_info).some((lang) => lang in val)
        ) {
            collect_keys(val, key, out);
        } else {
            out.push(key);
        }
    }

    return out;
}

function get_value_by_path(object, path) {
    return path.split('.').reduce((acc, part) => acc?.[part], object);
}

export function translation_stats() {
    const keys = collect_keys(trans);

    for (const lang of Object.keys(lang_info)) {
        let translated = 0;
        const missing = [];

        for (const key of keys) {
            const value = get_value_by_path(trans, key);
            if (value && value[lang]) {
                translated++;
            } else {
                missing.push(key);
            }
        }

        lang_info[lang].total = keys.length;
        lang_info[lang].translated = translated;
        lang_info[lang].missing = missing.length;
        lang_info[lang].missing_keys = missing;
        lang_info[lang].percent = Math.round((translated / keys.length) * 100);
    }

    log('translation stats', 'trans', 'info', { lang_info });
}

function get_lang() {
    const path = window.location.pathname;
    const segments = path.split('/');
    const lang = segments[1];

    if (/^[a-z]{2}$/.test(lang)) {
        return `/${lang}/`;
    }

    return '/';
}

export function lookup_lang() {
    const logo = document.querySelector('.masthead-logo a');

    if (!logo) {
        handle_error_500();
        return;
    }

    setRoot(get_lang());

    let previous_avi = auth.avatar;
    if (auth_link.state) {
        auth.avatar = auth_link.state.querySelector('img').getAttribute('src');

        if (auth.avatar != previous_avi) {
            let avatar = auth_link.state.querySelector('img');
            avatar.setAttribute('crossorigin', 'anonymous');

            try {
                avatar.addEventListener('load', () => {
                    let thief = new ColorThief();
                    let colour = thief.getColor(avatar);

                    let hsl = rgb_to_hsl(colour[0], colour[1], colour[2]);

                    auth.sets.hue = hsl.h;
                    auth.sets.sat = clamp_sat((hsl.s / 100) * 3);
                    auth.sets.lit = clamp_lit(auth.sets.sat, hsl.l / 100 + 0.35);
                });
            } catch (e) {}
        }
    }
    lang = document.documentElement.getAttribute('lang');
    lang_browser = navigator.language || navigator.userLanguage;

    Settings.defaultLocale = lang;
}
