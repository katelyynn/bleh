//
// bleh, an extension for the music site Last.fm
// Copyright (c 2025 katelyn and contributors
// Licensed under GPLv3
//

import { trans } from './trans.js';

export let settings = {};
export let settings_template = {
    theme: 'dark',
    high_contrast: false,
    gloss: 0,
    gendered_tags: true,
    show_extra_nav: true,

    accent_type: 'avatar',
    hue: 255,
    sat: 1,
    sat_bg: 1,
    lit: 1,

    dev: false,
    branch: 'uwu',

    api_key: '',

    profile_header_expand: true,

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
    colourful_tracks: true,
    rain: false,
    feature_flags: {},
    show_your_progress: true,
    travis: false,
    list_view: 1,
    chart_view: 'line',
    chart_bar_axis: 'horizontal',
    chart_insights_view: 'pie',
    shout_markdown: true,
    bio_markdown: true,
    hue_from_album: true,
    seasonal: true,
    seasonal_particles: 'all',
    seasonal_particles_fps: false,
    seasonal_overlays: true,

    profile_header_own: true,
    profile_header_others: true,
    profile_avi_background: false,

    profile_shortcut: '',
    font: '',
    font_weight: 480,
    font_weight_medium: 650,
    font_weight_bold: 730,
    font_emoji: true,

    show_bulk_edit_album: false,
    grid_glow: true,

    auth_menu_obsessions: false,

    default_avatar_action: 'expand',

    glacier_library_graphs: true,

    activities: true,
    activity_shout: true,
    activity_image: true,
    activity_obsess: true,
    activity_love: true,
    activity_bookmark: true,
    activity_install: true,
    activity_wiki: true,

    simulate_scroll: true,

    toggle_icon: false,

    log_show_all: false,

    avatar_radius: 50
};
export let settings_base = {
    theme: {
        css: 'theme',
        unit: '',
        value: 'dark',
        type: 'options'
    },
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
    sat_bg: {
        css: 'sat-bg',
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
    accent_type: {
        css: 'accent_type',
        unit: '',
        value: 'colour',
        type: 'options'
    },
    gloss: {
        css: 'gloss',
        unit: '',
        value: 0,
        type: 'slider'
    },
    profile_header_expand: {
        css: 'profile_header_expand',
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
    format_guest_features: {
        css: 'format_guest_features',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle',
        require_reload: 'partial'
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
        type: 'toggle',
        require_reload: 'partial'
    },
    colourful_tracks: {
        css: 'colourful_tracks',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle',
        require_reload: 'partial'
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
        type: 'toggle',
        require_reload: 'partial'
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
    chart_view: {
        css: 'chart_view',
        unit: '',
        value: 'line',
        type: 'options'
    },
    chart_bar_axis: {
        css: 'chart_bar_axis',
        unit: '',
        value: 'horizontal',
        type: 'options'
    },
    shout_markdown: {
        css: 'shout_markdown',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle',
        require_reload: 'partial'
    },
    bio_markdown: {
        css: 'bio_markdown',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle',
        require_reload: 'partial'
    },
    hue_from_album: {
        css: 'hue_from_album',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle',
        require_reload: 'partial'
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
        value: 'all',
        type: 'options',
        require_reload: true
    },
    seasonal_particles_fps: {
        css: 'seasonal_particles_fps',
        unit: '',
        value: false,
        values: [true, false],
        type: 'toggle'
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
    },
    profile_avi_background: {
        css: 'profile_avi_background',
        unit: '',
        value: false,
        values: [true, false],
        type: 'toggle'
    },
    branch: {
        css: 'branch',
        unit: '',
        value: '',
        type: 'text'
    },
    font: {
        css: 'custom_font',
        unit: '',
        value: '',
        type: 'text'
    },
    font_weight: {
        css: 'custom_font_weight',
        unit: '',
        value: 480,
        type: 'slider'
    },
    font_weight_medium: {
        css: 'custom_font_weight_medium',
        unit: '',
        value: 650,
        type: 'slider'
    },
    font_weight_bold: {
        css: 'custom_font_weight_bold',
        unit: '',
        value: 730,
        type: 'slider'
    },
    font_emoji: {
        css: 'font_emoji',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    show_bulk_edit_album: {
        css: 'show_bulk_edit_album',
        unit: '',
        value: false,
        values: [true, false],
        type: 'toggle'
    },
    grid_glow: {
        css: 'show_grid_glow',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    activities: {
        css: 'activities',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    auth_menu_obsessions: {
        css: 'auth_menu_obsessions',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    default_avatar_action: {
        css: 'default_avatar_action',
        unit: '',
        value: 'expand',
        type: 'options'
    },
    glacier_library_graphs: {
        css: 'glacier_library_graphs',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    activity_shout: {
        css: 'activity_shout',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    activity_image: {
        css: 'activity_image',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    activity_obsess: {
        css: 'activity_obsess',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    activity_love: {
        css: 'activity_love',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    activity_bookmark: {
        css: 'activity_bookmark',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    activity_install: {
        css: 'activity_install',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    activity_wiki: {
        css: 'activity_wiki',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    simulate_scroll: {
        css: 'simulate_scroll',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle',
        require_reload: 'partial'
    },
    toggle_icon: {
        css: 'toggle_icon',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    log_show_all: {
        css: 'log_show_all',
        unit: '',
        value: false,
        values: [true, false],
        type: 'toggle'
    },
    avatar_radius: {
        css: 'avatar-radius',
        unit: '%',
        value: 50,
        type: 'slider'
    },
    profile_shortcut: {
        css: 'profile_shortcut',
        unit: '',
        value: '',
        type: 'text'
    },
    api_key: {
        css: 'api_key',
        unit: '',
        value: '',
        type: 'text'
    }
};
export let inbuilt_settings = {
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
    edit_all: {
        css: 'edit_all',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    create_automatic_edit_rule: {
        css: 'create_automatic_edit_rule',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    },
    marketing_emails: {
        css: 'marketing_emails',
        unit: '',
        value: true,
        values: [true, false],
        type: 'toggle'
    }
};

export let settings_store = {
    theme: {
        default: 'darker',
        type: 'radio',
        title: trans.theme
    },
    theme_schedule: {
        default: false
    },
    theme_day: {
        default: 'light',
        type: 'select',
        title: trans.theme_day.name,
        body: trans.theme_day.body,
        incompatible: { theme_schedule: false },
        hide_if_incompatible: true
    },
    theme_night: {
        default: 'darker',
        type: 'select',
        title: trans.theme_night.name,
        body: trans.theme_night.body,
        incompatible: { theme_schedule: false },
        hide_if_incompatible: true
    },
    high_contrast: {
        default: false,
        type: 'checkbox',
        title: trans.high_contrast
    },
    accent_type: {
        default: 'colour',
        type: 'radio'
    },
    hue: {
        css: 'hue-user',
        default: 255,
        type: 'range',
        min: 0,
        max: 360,
        step: 1,
        title: trans.hue,
        vertical: true
    },
    sat: {
        css: 'sat-user',
        default: 1,
        type: 'range',
        min: 0,
        max: 2,
        step: 0.01,
        title: trans.sat,
        vertical: true
    },
    sat_bg: {
        css: 'sat-bg',
        default: 1,
        type: 'range',
        min: 0,
        max: 5,
        step: 0.2,
        title: trans.card_background_saturation.name,
        body: trans.card_background_saturation.body,
        incompatible: { theme: 'light' }
    },
    lit: {
        css: 'lit-user',
        default: 1,
        type: 'range',
        min: 0,
        max: 1.5,
        step: 0.01,
        title: trans.lit,
        vertical: true
    },
    solarium: {
        default: true,
        title: trans.solarium.name,
        body: trans.solarium.body
    },
    noise: {
        css: 'noise-opacity',
        default: 0.35,
        type: 'range',
        min: 0,
        max: 1,
        step: 0.05,
        title: trans.noise.name,
        body: trans.noise.body
    },
    gloss: {
        css: 'gloss',
        default: 0,
        type: 'range',
        min: 0,
        max: 1,
        step: 0.05,
        title: trans.gloss.name,
        body: trans.gloss.body
    },
    gendered_tags: {
        default: true,
        title: trans.gendered_tags.name,
        body: trans.gendered_tags.body
    },
    dev: {
        default: false,
        title: trans.theme_loading.name,
        body: trans.theme_loading.body
    },
    accessible_name_colours: {
        default: false,
        title: trans.accessible_name_colours.name,
        body: trans.accessible_name_colours.body
    },
    display_name_styles: {
        default: true,
        title: trans.display_name_styles.name,
        body: trans.display_name_styles.body,
        require_reload: true
    },
    reduced_motion: {
        default: false,
        title: trans.reduced_motion.name,
        body: trans.reduced_motion.body
    },
    underline_links: {
        default: false,
        title: trans.underline_links.name,
        body: trans.underline_links.body
    },
    format_guest_features: {
        default: true,
        title: trans.format_guest_features.name,
        body: trans.format_guest_features.body,
        require_reload: 'partial'
    },
    show_guest_features: {
        default: false,
        title: trans.show_guest_features.name,
        body: trans.show_guest_features.body
    },
    track_layout: {
        default: 'column',
        type: 'radio',
        title: trans.track_layout.name,
        body: trans.track_layout.body,
        values: {
            column: {
                name: trans.track_layout.column
            },
            row: {
                name: trans.track_layout.row
            }
        }
    },
    expand_tracks: {
        default: 'active',
        type: 'radio',
        title: trans.expand_tracks.name,
        body: trans.expand_tracks.body,
        values: {
            always: {
                name: trans.expand_tracks_always
            },
            active: {
                name: trans.expand_tracks_when_active
            },
            never: {
                name: trans.never
            }
        },
        incompatible: { track_layout: 'row' }
    },
    track_album_name_location: {
        default: 'column',
        type: 'radio',
        title: trans.track_album_name_location.name,
        body: trans.track_album_name_location.body,
        values: {
            column: {
                name: trans.track_album_name_location.column
            },
            row: {
                name: trans.track_album_name_location.row
            }
        },
        incompatible: { track_layout: 'row' }
    },
    glacier_library_graphs: {
        default: true,
        title: trans.glacier_graphs.name,
        body: trans.glacier_graphs.body
    },
    show_remaster_tags: {
        default: true,
        title: trans.show_remaster_tags,
        beta: true
    },
    corrections: {
        default: true,
        title: trans.correct_titles_with_lotus.name,
        body: trans.correct_titles_with_lotus.body,
        require_reload: true
    },
    colourful_counts: {
        default: true,
        title: trans.colourful_counts.name,
        body: trans.colourful_counts.body
    },
    colourful_tracks: {
        default: true,
        type: 'checkbox',
        title: trans.colourful_active,
        incompatible: { colourful_tracks_all: true }
    },
    colourful_tracks_all: {
        default: false,
        type: 'checkbox',
        title: trans.colourful_all
    },
    feature_flags: {
        default: {},
        type: 'other'
    },
    show_your_progress: {
        default: true,
        title: trans.show_your_progress.name,
        body: trans.show_your_progress.body
    },
    travis: {
        default: true,
        title: trans.redirect_messages.name,
        body: trans.redirect_messages.body
    },
    list_view: {
        default: 'cards',
        type: 'tabs',
        values: {
            cards: {
                name: trans.cards
            },
            grid: {
                name: trans.grid
            },
            list: {
                name: trans.list
            }
        }
    },
    chart_view: {
        default: 'line',
        type: 'tabs',
        values: {
            line: {
                name: trans.line
            },
            pie: {
                name: trans.pie
            },
            bar: {
                name: trans.bar
            }
        }
    },
    chart_bar_axis: {
        default: 'horizontal',
        type: 'tabs',
        values: {
            horizontal: {
                name: trans.horizontal
            },
            vertical: {
                name: trans.vertical
            }
        }
    },
    chart_insights_view: {
        default: 'pie',
        type: 'radio'
    },
    shout_markdown: {
        default: true,
        require_reload: 'partial',
        title: trans.markdown_shouts.name,
        body: trans.markdown_shouts.body
    },
    bio_markdown: {
        default: true,
        require_reload: 'partial',
        title: trans.markdown_profiles.name,
        body: trans.markdown_profiles.body
    },
    avatar_radius: {
        default: 50,
        min: 0,
        max: 50,
        step: 25,
        type: 'range',
        css: 'avatar-radius',
        suffix: '%',
        title: trans.avatar_radius.name,
        body: trans.avatar_radius.body
    },
    hue_from_album: {
        default: true,
        type: 'checkbox',
        title: trans.hue_from_album
    },
    seasonal: {
        default: true,
        title: trans.enable_seasons.name,
        body: trans.enable_seasons.body,
        require_reload: true
    },
    seasonal_particles: {
        default: 'all',
        type: 'radio',
        title: trans.seasonal_particles.name,
        body: trans.seasonal_particles.body,
        values: {
            all: {
                name: trans.all_particles
            },
            less: {
                name: trans.less_particles
            },
            none: {
                name: trans.no_particles
            }
        },
        require_reload: true
    },
    seasonal_particles_fps: {
        default: false,
        type: 'checkbox',
        title: trans.seasonal_particles_fps.name,
        body: trans.seasonal_particles_fps.body
    },
    seasonal_overlays: {
        default: true,
        type: 'checkbox',
        title: trans.seasonal_overlays.name,
        body: trans.seasonal_overlays.body
    },
    profile_header_own: {
        default: true,
        type: 'checkbox',
        title: trans.own_profile
    },
    profile_header_others: {
        default: true,
        type: 'checkbox',
        title: trans.other_profiles
    },
    profile_avi_background: {
        default: false,
        title: trans.profile_avi_background.name,
        body: trans.profile_avi_background.body
    },
    profile_shortcut: {
        default: '',
        type: 'text',
        avatar: true,
        wait: true,
        max: 40,
        title: trans.profile_shortcut.name,
        body: trans.profile_shortcut.body,
        placeholder: trans.enter_username,
        warn_if_matches_auth: true
    },
    font: {
        css: 'custom_font',
        default: '',
        type: 'text',
        max: 120,
        title: trans.font.name,
        body: trans.font.body,
        placeholder: trans.enter_font_names
    },
    font_weight: {
        css: 'custom_font_weight',
        default: 400,
        min: 100,
        max: 600,
        step: 10,
        type: 'range',
        title: trans.font_weight.name,
        body: trans.font_weight.body
    },
    font_weight_medium: {
        css: 'custom_font_weight_medium',
        default: 500,
        min: 400,
        max: 750,
        step: 10,
        type: 'range',
        title: trans.font_weight_medium.name,
        body: trans.font_weight_medium.body
    },
    font_weight_bold: {
        css: 'custom_font_weight_bold',
        default: 600,
        min: 500,
        max: 900,
        step: 10,
        type: 'range',
        title: trans.font_weight_bold.name,
        body: trans.font_weight_bold.body
    },
    font_emoji: {
        default: true,
        title: trans.font_emoji.name,
        body: trans.font_emoji.body,
        platforms: ['win32', 'linux', 'android', 'other']
    },
    grid_glow: {
        default: true,
        title: trans.grid_glow.name,
        body: trans.grid_glow.body
    },
    default_avatar_action: {
        default: 'expand',
        type: 'radio',
        title: trans.default_avatar_action.name,
        body: trans.default_avatar_action.body,
        values: {
            expand: {
                name: trans.expand
            },
            gallery: {
                name: trans.photos
            }
        }
    },
    collage_title: {
        default: true,
        title: trans.collage_title.name,
        body: trans.collage_title.body
    },
    collage_grid_text: {
        default: true,
        title: trans.collage_grid_text
    },
    collage_grid_plays: {
        default: true,
        title: trans.collage_grid_plays
    },
    collage_grid_gap: {
        default: true,
        title: trans.collage_grid_gap.name,
        body: trans.collage_grid_gap.body
    },
    hu_tao: {
        default: '',
        type: 'text',
        max: 40,
        placeholder: trans.enter_password
    },
    activities: {
        default: true,
        title: trans.activity_tracking.name,
        body: trans.activity_tracking.body
    },
    activity_shout: {
        default: true,
        title: trans.shouts,
        body: trans.activity.types.shout,
        type: 'checkbox',
        icon: 'icon-16-shoutbox',
        horizontal: true
    },
    activity_image: {
        default: true,
        title: trans.photos,
        body: trans.activity.types.image,
        type: 'checkbox',
        icon: 'icon-16-gallery-vertical',
        horizontal: true
    },
    activity_obsess: {
        default: true,
        title: trans.obsessions,
        body: trans.activity.types.obsess,
        type: 'checkbox',
        icon: 'icon-16-obsession',
        horizontal: true
    },
    activity_love: {
        default: true,
        title: trans.loved,
        body: trans.activity.types.love,
        type: 'checkbox',
        icon: 'icon-16-heart',
        horizontal: true
    },
    activity_bookmark: {
        default: true,
        title: trans.bookmarks,
        body: trans.activity.types.bookmark,
        type: 'checkbox',
        icon: 'icon-16-bookmark',
        horizontal: true
    },
    activity_wiki: {
        default: true,
        title: trans.wiki,
        body: trans.activity.types.wiki,
        type: 'checkbox',
        icon: 'icon-16-bio',
        horizontal: true
    },
    activity_install: {
        default: true,
        title: trans.installation,
        body: trans.activity.types.install,
        type: 'checkbox',
        icon: 'icon-16-download',
        horizontal: true
    },
    simulate_scroll: {
        default: true,
        title: trans.simulate_scroll.name,
        body: trans.simulate_scroll.body,
        require_reload: 'partial'
    },
    rabbit: {
        default: true,
        title: trans.use_quick_switcher.name,
        body: trans.use_quick_switcher.body
    },
    rabbit_search: {
        default: 'd',
        title: trans.search,
        type: 'text',
        min: 1,
        max: 1,
        icon: 'icon-16-search',
        placeholder: 'none',
        keybind: ['⌘', 'D'],
        warn_if_empty: true
    },
    rabbit_primary: {
        default: 'k',
        title: trans.open,
        type: 'text',
        min: 1,
        max: 1,
        icon: 'icon-16-rabbit',
        placeholder: 'none',
        keybind: ['⌘', 'K'],
        warn_if_empty: true
    },
    rabbit_profile: {
        default: 'p',
        title: trans.profile,
        type: 'text',
        min: 1,
        max: 1,
        icon: 'icon-16-user',
        placeholder: 'none',
        keybind: ['⌘', 'P'],
        warn_if_empty: true
    },
    rabbit_shortcut: {
        default: 's',
        title: trans.starred_friend.name,
        type: 'text',
        min: 1,
        max: 1,
        icon: 'icon-16-starred-friend',
        placeholder: 'none',
        keybind: ['⌘', 'S'],
        warn_if_empty: true
    },
    rabbit_bleh_settings: {
        default: 'b',
        title: trans.settings,
        type: 'text',
        min: 1,
        max: 1,
        icon: 'icon-16-bleh',
        placeholder: 'none',
        keybind: ['⌘', 'B'],
        warn_if_empty: true
    },
    prefer_no_redirect: {
        default: true,
        title: trans.prefer_no_redirect.name,
        body: trans.prefer_no_redirect.body
    },
    inbox_view: {
        default: 'notifications',
        type: 'tabs',
        values: {
            notifications: {
                name: trans.notifications
            },
            messages: {
                name: trans.messages
            }
        }
    },
    navigation_items: {
        default: ['home', 'library', 'shouts'],
        type: 'list',
        title: trans.navigation_items.name,
        body: trans.navigation_items.body,
        predefined: true
    },
    navigation_language: {
        default: true,
        type: 'checkbox',
        title: trans.navigation_language
    },
    branding_type: {
        default: 'bleh',
        type: 'radio',
        title: trans.branding_type.name,
        body: trans.branding_type.body,
        values: {
            bleh: {
                name: 'bleh'
            },
            lastfm: {
                name: 'Last.fm'
            }
        }
    },
    rain: {
        default: false,
        title: trans.rain.name,
        body: trans.rain.body,
        require_reload: true
    },
    collage_centered: {
        default: true,
        title: trans.collage_centered.name,
        body: trans.collage_centered.body
    },
    static_gifs: {
        default: 'always',
        type: 'radio',
        title: trans.static_gifs,
        values: {
            always: {
                name: trans.always_animate
            },
            hover: {
                name: trans.only_on_hover
            },
            never: {
                name: trans.never
            }
        },
        new_release: true,
        beta: true
    },
    static_avatars: {
        default: false,
        type: 'checkbox',
        title: trans.static_avatars
    },
    static_music: {
        default: true,
        type: 'checkbox',
        title: trans.static_music
    },
    static_banners: {
        default: true,
        type: 'checkbox',
        title: trans.static_banners,
        new_release: true
    },
    trusted_sites: {
        default: [],
        type: 'list'
    },
    profile_hue: {
        default: 255,
        type: 'range',
        min: 0,
        max: 360,
        step: 1,
        title: trans.hue,
        vertical: true
    },
    profile_sat: {
        default: 1,
        type: 'range',
        min: 0,
        max: 2,
        step: 0.01,
        title: trans.sat,
        vertical: true
    },
    profile_lit: {
        default: 1,
        type: 'range',
        min: 0,
        max: 1.5,
        step: 0.01,
        title: trans.lit,
        vertical: true
    },
    friends: {
        default: [],
        type: 'list',
        title: trans.close_friends,
        body: trans.friends_setting,
        warn_if_matches_auth: true,
        beta: true
    },
    starred_friend: {
        default: '',
        type: 'select',
        title: trans.starred_friend.name,
        body: trans.starred_friend.body
    },
    dismissed: {
        default: [],
        type: 'list'
    },
    oracle_beta: {
        default: false,
        title: trans.oracle_beta.name,
        body: trans.oracle_beta.body,
        beta: true
    },
    romanise_jp: {
        default: false,
        type: 'checkbox',
        title: trans.romanise_jp,
        incompatible: { format_guest_features: false, corrections: false }
    },
    romanise_ko: {
        default: false,
        type: 'checkbox',
        title: trans.romanise_ko,
        incompatible: { format_guest_features: false, corrections: false }
    },
    music_links: {
        default: [
            'spotify',
            'itunes',
            'youtube',
            'tidal',
            'rym',
            'genius',
            'website',
            'twitter',
            'soundcloud',
            'instagram'
        ],
        type: 'list',
        title: trans.music_links.name,
        body: trans.music_links.body,
        predefined: true
    },
    inverse_compare: {
        default: false,
        title: trans.inverse_compare.name,
        body: trans.inverse_compare.body,
        new_release: true
    },
    branch: {
        default: 'uwu',
        type: 'text',
        max: 20,
        title: trans.branch.name,
        body: trans.branch.body,
        warn_if_empty: true
    },
    tracklist_source: {
        default: 'oracle',
        type: 'select',
        title: trans.tracklist_source.name,
        body: trans.tracklist_source.body,
        incompatible: { oracle_beta: false }
    },
    menu_replacement: {
        default: true,
        title: trans.menu_replacement.name,
        body: trans.menu_replacement.body,
        new_release: true,
        require_reload: true
    },
    translator: {
        default: false,
        title: trans.translator.name,
        body: trans.translator.body,
        require_reload: true
    },
    translator_view: {
        default: 'en',
        type: 'select'
    },
    popups_seen: {
        default: [],
        type: 'list'
    }
};
