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
    seasonal_particles: true,
    seasonal_particles_reduced: false,
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
    quick_artist_button: 'gallery',

    glacier_library_graphs: true,

    activities: true,
    activity_shout: true,
    activity_image: true,
    activity_obsess: true,
    activity_love: true,
    activity_install: true,
    activity_wiki: true,

    simulate_scroll: true,

    toggle_icon: false,

    log_show_all: false,

    avatar_radius: 50,

    removal_method: 'censor',
    enable_moderation: false,
    moderate_shouts: true,
    moderate_bios: true,
    moderate_artists: false,
    moderate_albums: false,
    moderate_tracks: false
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
    colourful_tracks: {
        css: 'colourful_tracks',
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
        type: 'toggle'
    },
    bio_markdown: {
        css: 'bio_markdown',
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
    seasonal_particles_reduced: {
        css: 'seasonal_particles_reduced',
        unit: '',
        value: false,
        values: [true, false],
        type: 'toggle',
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
        value:  true,
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
    quick_artist_button: {
        css: 'quick_artist_button',
        unit: '',
        value: 'gallery',
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
        require_reload: true
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
    },
    enable_moderation: {
        css: 'enable_moderation',
        unit: '',
        value: false,
        values: [true, false],
        type: 'toggle'
    },
    removal_method: {
        css: 'removal_method',
        unit: '',
        value: 'censor',
        type: 'options'
    },
    moderate_shouts: {
        css: 'moderate_shouts',
        unit: '',
        value: false,
        values: [true, false],
        type: 'toggle'
    },
    moderate_bios: {
        css: 'moderate_bios',
        unit: '',
        value: false,
        values: [true, false],
        type: 'toggle'
    },
    moderate_artists: {
        css: 'moderate_artists',
        unit: '',
        value: false,
        values: [true, false],
        type: 'toggle'
    },
    moderate_albums: {
        css: 'moderate_albums',
        unit: '',
        value: false,
        values: [true, false],
        type: 'toggle'
    },
    moderate_tracks: {
        css: 'moderate_tracks',
        unit: '',
        value: false,
        values: [true, false],
        type: 'toggle'
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
    }
}

export let settings_store = {
    theme: {
        default: 'dark',
        type: 'radio'
    },
    high_contrast: {
        default: false
    },
    accent_type: {
        default: 'colour',
        type: 'radio'
    },
    hue: {
        default: 255,
        type: 'range'
    },
    sat: {
        default: 1,
        type: 'range'
    },
    sat_bg: {
        default: 1,
        type: 'range'
    },
    lit: {
        default: 1,
        type: 'range'
    },
    gloss: {
        default: 0,
        type: 'range'
    },
    gendered_tags: {
        default: true
    },
    dev: {
        default: false
    },
    api_key: {
        default: '',
        type: 'string'
    },
    profile_header_expand: {
        default: true
    },
    accessible_name_colours: {
        default: false
    },
    reduced_motion: {
        default: false
    },
    underline_links: {
        default: false
    },
    format_guest_features: {
        default: true
    },
    show_guest_features: {
        default: false
    },
    stacked_chartlist_info: {
        default: true
    },
    show_remaster_tags: {
        default: true
    },
    corrections: {
        default: true
    },
    colourful_counts: {
        default: true
    },
    colourful_tracks: {
        default: true
    },
    feature_flags: {
        default: {},
        type: 'other'
    },
    show_your_progress: {
        default: true
    },
    travis: {
        default: false
    },
    list_view: {
        default: 1,
        type: 'radio'
    },
    chart_view: {
        default: 'line',
        type: 'radio'
    },
    chart_bar_axis: {
        default: 'horizontal',
        type: 'radio'
    },
    chart_insights_view: {
        default: 'pie',
        type: 'radio'
    },
    shout_markdown: {
        default: true
    },
    bio_markdown: {
        default: true
    },
    hue_from_album: {
        default: true
    },
    seasonal: {
        default: true
    },
    seasonal_particles: {
        default: true
    },
    seasonal_particles_reduced: {
        default: false
    },
    seasonal_particles_fps: {
        default: false
    },
    seasonal_overlays: {
        default: true
    },
    profile_header_own: {
        default: true
    },
    profile_header_others: {
        default: true
    },
    profile_avi_background: {
        default: false
    },
    profile_shortcut: {
        default: '',
        type: 'string'
    },
    font: {
        css: 'custom_font',
        default: '',
        type: 'string'
    },
    font_weight: {
        css: 'custom_font_weight',
        default: 480,
        min: 0,
        max: 0,
        step: 0,
        type: 'range'
    },
    font_weight_medium: {
        css: 'custom_font_weight_medium',
        default: 650,
        min: 0,
        max: 0,
        step: 0,
        type: 'range'
    },
    font_weight_bold: {
        css: 'custom_font_weight_bold',
        default: 730,
        min: 0,
        max: 0,
        step: 0,
        type: 'range'
    },
    font_emoji: {
        default: true
    },
    show_bulk_edit_album: {
        default: false
    },
    grid_glow: {
        default: true
    },
    auth_menu_obsessions: {
        deault: false
    },
    default_avatar_action: {
        default: 'expand',
        type: 'radio'
    },
    quick_artist_button: {
        default: 'gallery',
        type: 'radio'
    }
}