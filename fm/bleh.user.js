// ==UserScript==
// @name         bleh
// @namespace    http://last.fm/
// @version      2025.0402
// @description  bleh!!! ^-^
// @author       kate
// @match        https://www.last.fm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=last.fm
// @updateURL    https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.js
// @downloadURL  https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.js
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js
// @require      https://unpkg.com/@popperjs/core@2.11.8/dist/umd/popper.min.js
// @require      https://unpkg.com/tippy.js@6.3.7/dist/tippy.umd.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-adapter-moment@^1
// ==/UserScript==
(() => {
  // src/build/config.js
  var settings = {};
  var settings_template = {
    theme: "dark",
    high_contrast: false,
    gloss: 0,
    gendered_tags: true,
    show_extra_nav: true,
    removal_method: "censor",
    enable_moderation: false,
    moderate_shouts: true,
    censor_bios: true,
    censor_artist_names: false,
    censor_track_titles: false,
    censor_album_titles: false,
    accent_type: "avatar",
    hue: 255,
    sat: 1,
    sat_bg: 1,
    lit: 1,
    dev: false,
    api_key: "",
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
    chart_view: "line",
    chart_bar_axis: "horizontal",
    chart_insights_view: "pie",
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
    profile_shortcut: "",
    font: "",
    font_weight: 480,
    font_weight_medium: 650,
    font_weight_bold: 730,
    font_emoji: true,
    show_bulk_edit_album: false,
    grid_glow: true,
    auth_menu_obsessions: false,
    default_avatar_action: "expand",
    quick_artist_button: "gallery",
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
    avatar_radius: 50
  };
  var settings_base = {
    theme: {
      css: "theme",
      unit: "",
      value: "dark",
      type: "options"
    },
    high_contrast: {
      css: "high_contrast",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle"
    },
    hue: {
      css: "hue-user",
      unit: "",
      value: 255,
      type: "slider"
    },
    sat: {
      css: "sat-user",
      unit: "",
      value: 1,
      type: "slider"
    },
    sat_bg: {
      css: "sat-bg",
      unit: "",
      value: 1,
      type: "slider"
    },
    lit: {
      css: "lit-user",
      unit: "",
      value: 1,
      type: "slider"
    },
    accent_type: {
      css: "accent_type",
      unit: "",
      value: "colour",
      type: "options"
    },
    gloss: {
      css: "gloss",
      unit: "",
      value: 0,
      type: "slider"
    },
    profile_header_expand: {
      css: "profile_header_expand",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    main_width: {
      css: "main_width",
      unit: "px",
      value: 902,
      type: "slider"
    },
    nav: {
      css: "show_extra_nav",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    gendered_tags: {
      css: "gendered_tags",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    hide_hateful: {
      css: "hide_hateful",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    accessible_name_colours: {
      css: "accessible_name_colours",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle"
    },
    reduced_motion: {
      css: "reduced_motion",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle"
    },
    underline_links: {
      css: "underline_links",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle"
    },
    dev: {
      css: "dev",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle"
    },
    big_numbers: {
      css: "big_numbers",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle"
    },
    format_guest_features: {
      css: "format_guest_features",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    show_guest_features: {
      css: "show_guest_features",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle"
    },
    stacked_chartlist_info: {
      css: "stacked_chartlist_info",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    show_remaster_tags: {
      css: "show_remaster_tags",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    corrections: {
      css: "corrections",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    colourful_counts: {
      css: "colourful_counts",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    colourful_tracks: {
      css: "colourful_tracks",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    rain: {
      css: "rain",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle",
      require_reload: true
    },
    show_your_progress: {
      css: "show_your_progress",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    travis: {
      css: "travis",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle"
    },
    list_view: {
      css: "list_view",
      unit: "",
      value: 0,
      type: "options"
    },
    chart_view: {
      css: "chart_view",
      unit: "",
      value: "line",
      type: "options"
    },
    chart_bar_axis: {
      css: "chart_bar_axis",
      unit: "",
      value: "horizontal",
      type: "options"
    },
    shout_markdown: {
      css: "shout_markdown",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    bio_markdown: {
      css: "bio_markdown",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    hue_from_album: {
      css: "hue_from_album",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    seasonal: {
      css: "seasonal",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle",
      require_reload: true
    },
    seasonal_particles: {
      css: "seasonal_particles",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle",
      require_reload: true
    },
    seasonal_particles_reduced: {
      css: "seasonal_particles_reduced",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle",
      require_reload: true
    },
    seasonal_particles_fps: {
      css: "seasonal_particles_fps",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle"
    },
    seasonal_overlays: {
      css: "seasonal_overlays",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    profile_header_own: {
      css: "profile_header_own",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    profile_header_others: {
      css: "profile_header_others",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    profile_avi_background: {
      css: "profile_avi_background",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle"
    },
    font: {
      css: "custom_font",
      unit: "",
      value: "",
      type: "text"
    },
    font_weight: {
      css: "custom_font_weight",
      unit: "",
      value: 480,
      type: "slider"
    },
    font_weight_medium: {
      css: "custom_font_weight_medium",
      unit: "",
      value: 650,
      type: "slider"
    },
    font_weight_bold: {
      css: "custom_font_weight_bold",
      unit: "",
      value: 730,
      type: "slider"
    },
    font_emoji: {
      css: "font_emoji",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    show_bulk_edit_album: {
      css: "show_bulk_edit_album",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle"
    },
    grid_glow: {
      css: "show_grid_glow",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    activities: {
      css: "activities",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    auth_menu_obsessions: {
      css: "auth_menu_obsessions",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    default_avatar_action: {
      css: "default_avatar_action",
      unit: "",
      value: "expand",
      type: "options"
    },
    quick_artist_button: {
      css: "quick_artist_button",
      unit: "",
      value: "gallery",
      type: "options"
    },
    glacier_library_graphs: {
      css: "glacier_library_graphs",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    activity_shout: {
      css: "activity_shout",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    activity_image: {
      css: "activity_image",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    activity_obsess: {
      css: "activity_obsess",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    activity_love: {
      css: "activity_love",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    activity_install: {
      css: "activity_install",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    activity_wiki: {
      css: "activity_wiki",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    simulate_scroll: {
      css: "simulate_scroll",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle",
      require_reload: true
    },
    toggle_icon: {
      css: "toggle_icon",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    log_show_all: {
      css: "log_show_all",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle"
    },
    avatar_radius: {
      css: "avatar-radius",
      unit: "%",
      value: 50,
      type: "slider"
    },
    profile_shortcut: {
      css: "profile_shortcut",
      unit: "",
      value: "",
      type: "text"
    },
    api_key: {
      css: "api_key",
      unit: "",
      value: "",
      type: "text"
    },
    enable_moderation: {
      css: "enable_moderation",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle"
    },
    removal_method: {
      css: "removal_method",
      unit: "",
      value: "censor",
      type: "options"
    },
    moderate_shouts: {
      css: "moderate_shouts",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle"
    },
    censor_bios: {
      css: "censor_bios",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle"
    },
    censor_artist_names: {
      css: "censor_artist_names",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle"
    },
    censor_track_titles: {
      css: "censor_track_titles",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle"
    },
    censor_album_titles: {
      css: "censor_album_titles",
      unit: "",
      value: false,
      values: [true, false],
      type: "toggle"
    }
  };
  var inbuilt_settings = {
    recent_artwork: {
      css: "recent_artwork",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    recent_realtime: {
      css: "recent_realtime",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    recent_listening: {
      css: "recent_listening",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    disable_shoutbox: {
      css: "disable_shoutbox",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    edit_all: {
      css: "edit_all",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    },
    create_automatic_edit_rule: {
      css: "create_automatic_edit_rule",
      unit: "",
      value: true,
      values: [true, false],
      type: "toggle"
    }
  };

  // src/build/page.js
  var reload_pending = {
    state: false
  };
  var dialogs = {};
  tippy.setDefaultProps({
    arrow: false,
    duration: [120, 220]
  });
  var auth = {
    name: null,
    pro: false,
    avatar: null,
    sets: {
      hue: 255,
      sat: 1,
      lit: 1
    }
  };
  var auth_link = {
    state: ""
  };
  var root = "";
  function setRoot(data) {
    root = data;
  }
  var recent_activity_list = [];
  var last_page_type = {
    state: void 0
  };
  var last_page_subpage = {
    state: void 0
  };
  var page = {
    initial: "",
    type: "",
    name: "",
    sister: "",
    sister_others: [],
    subpage: "",
    avatar: "",
    multi: false,
    corrected: false,
    token: "",
    structure: {
      wrapper: null,
      container: null,
      row: null,
      main: null,
      side: null,
      nav: null,
      content_top: null,
      glacier: {
        refresh: true
      },
      indicator: null,
      logs: null
    },
    requested: {
      tab: null
    },
    header: {},
    state: {
      settings_reload: false,
      glacier: {
        insights: {
          artist: {
            display: false,
            values: [],
            labels: [],
            highest: {
              value: 0,
              label: "",
              link: "",
              img: ""
            }
          },
          album: {
            display: false,
            values: [],
            labels: [],
            highest: {
              value: 0,
              label: "",
              link: "",
              img: ""
            }
          },
          track: {
            display: false,
            values: [],
            labels: [],
            highest: {
              value: 0,
              label: "",
              link: "",
              img: ""
            }
          }
        }
      }
    }
  };
  var shout_parse_queue = [];
  var bleh_url = "https://www.last.fm{root}bleh";
  var setup_url = "https://www.last.fm{root}bleh/setup";
  var sponsor_url = "https://www.last.fm{root}bleh/sponsor";
  var has_prompted_for_update = {
    state: false
  };
  var theme_preview = `
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
`;

  // src/build/log.js
  function log(text, system, type = "info", append = {}) {
    if (!page.structure.logs) {
      let logs = document.createElement("div");
      logs.classList.add("logs");
      logs.innerHTML = `
            <div class="toggle-container" id="container-log_show_all" onclick="_update_item('log_show_all')">
                <div class="toggle-wrap">
                    <button id="toggle-log_show_all">
                        show all
                    </button>
                </div>
            </div>
        `;
      document.documentElement.appendChild(logs);
      page.structure.logs = logs;
    }
    let system_colour;
    switch (system) {
      case "load":
        system_colour = "#8CB9D9";
        break;
      case "lotus":
        system_colour = "#8CD9A6";
        break;
      case "season":
        system_colour = "#65B6D8";
        break;
      case "page":
        system_colour = "#E4B381";
        break;
      case "page structure":
        system_colour = "#D88A69";
        break;
      case "style":
        system_colour = "#C9C678";
        break;
      case "profile":
        system_colour = "#D56854";
        break;
      case "settings":
        system_colour = "#6D6977";
        break;
      case "sponsor":
        system_colour = "#CE4E88";
        break;
      default:
        system_colour = "#C8DD88";
        break;
    }
    if (Object.keys(append).length > 0)
      console[type](`%cbleh~%c${system}%c: ${text}`, "color: #9F8CD9", `color: ${system_colour}; font-weight: bold`, "color: unset", append);
    else
      console[type](`%cbleh~%c${system}%c: ${text}`, "color: #9F8CD9", `color: ${system_colour}; font-weight: bold`, "color: unset");
    if (settings && settings.feature_flags) {
      if (settings.feature_flags.developer == true) {
        let log_e = document.createElement("div");
        log_e.classList.add("log");
        log_e.setAttribute("data-type", type);
        log_e.innerHTML = `
                <span class="system" style="color: ${system_colour}">${system}</span>
                <span class="text">${text}</span>
            `;
        page.structure.logs.appendChild(log_e);
      }
    }
  }

  // src/build/tools.js
  function hex_to_hsl(hex) {
    let result = new RegExp(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex);
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max == min) {
      h = s = 0;
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
    console.log("converted", hex, "to", h, s, l);
    return {
      h,
      s,
      l
    };
  }
  function rgb_to_hsl(r, g, b) {
    let hex = rgb_to_hex(r, g, b);
    return hex_to_hsl(hex);
  }
  function comp_to_hex(comp) {
    let hex = comp.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  function rgb_to_hex(r, g, b) {
    return "#" + comp_to_hex(r) + comp_to_hex(g) + comp_to_hex(b);
  }
  function clamp_sat(sat) {
    if (sat > 1.7)
      return 1.7;
    return sat;
  }
  function clean_number(string) {
    return parseInt(
      string.replaceAll(",", "").replaceAll(".", "")
    );
  }
  function sanitise(text) {
    return encodeURI(text.replaceAll(" ", "+").replaceAll("/", "%2F"));
  }
  function sanitise_text(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function desanitise(text) {
    return decodeURI(text.replaceAll("+", " ").replaceAll("%2F", "/"));
  }
  function return_artist_from_track(url, is_album) {
    let split = url.split("/");
    let length = split.length - 1;
    if (is_album)
      return desanitise(split[length - 1]);
    else
      return desanitise(split[length - 2]);
  }
  function return_artist_from_generic(url) {
    let split = url.split("/");
    let length = split.length - 1;
    if (split[length - 1] != "_")
      return decodeURI(desanitise(split[length - 1]));
    else
      return decodeURI(desanitise(split[length - 2]));
  }

  // src/build/music.js
  var artist_corrections = {};
  var album_track_corrections = {};
  var ranks = {
    15: {
      start: 62e3,
      hue: -135,
      sat: 1.5,
      lit: 0.35
    },
    14: {
      start: 5e4,
      hue: -105,
      sat: 1,
      lit: 0.85
    },
    13: {
      start: 38e3,
      hue: -85,
      sat: 1.2,
      lit: 0.95
    },
    12: {
      start: 24e3,
      hue: -55,
      sat: 0.875,
      lit: 0.85
    },
    11: {
      start: 16e3,
      hue: -25,
      sat: 1.5,
      lit: 0.875
    },
    10: {
      start: 12500,
      hue: -7,
      sat: 1.5,
      lit: 0.875
    },
    9: {
      start: 6e3,
      hue: 4,
      sat: 1.425,
      lit: 0.9
    },
    8: {
      start: 4300,
      hue: 25,
      sat: 1.425,
      lit: 0.925
    },
    7: {
      start: 3200,
      hue: 60,
      sat: 1.375,
      lit: 0.95
    },
    6: {
      start: 2250,
      hue: 80,
      sat: 1.35,
      lit: 0.925
    },
    5: {
      start: 1500,
      hue: 103,
      sat: 1.35,
      lit: 0.925
    },
    4: {
      start: 1e3,
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
  };
  var includes = {
    guests: [
      "feat.",
      "featuring",
      "- with",
      "(with",
      "[with",
      "w/ ",
      "ft.",
      "ref."
    ],
    versions: [
      "(taylor",
      "- spotify singles",
      "(spotify",
      "(+"
    ],
    remasters: [
      "- remaster",
      "(remaster",
      "- 19",
      "- 20",
      "(19",
      "(20"
    ],
    mixes: [
      "- devonshire mix",
      "(devonshire mix",
      "mike dean master",
      "- remix",
      "(remix",
      "[remix",
      "- live",
      "(live",
      "- demo",
      "(demo",
      "- rehearsal",
      "(rehearsal",
      "- sample clearance",
      "(sample clearance",
      "[sample clearance",
      "- home demo",
      "(home demo",
      "- solo acoustic",
      "(solo acoustic",
      "- acoustic",
      "(acoustic",
      "- alternative",
      "(alternative",
      "(mix 1",
      "(mix 2",
      "(mix 3",
      "(mix 4",
      "(mix 5",
      "(mix 6",
      "(mix 7",
      "(mix 8",
      "(mix 9",
      "- chopped",
      "(chopped",
      "[chopped",
      "(kate",
      "(asmr",
      "(agressive",
      "(aggressive",
      "brazilian phonk",
      // lol
      "- sped up",
      "(sped up",
      "- slow",
      "(slow",
      "a. g. cook remix",
      "- offline",
      "- og mix"
    ],
    mixes_numbers: [
      "(v1",
      "(v2",
      "(v3",
      "(v4",
      "(v5",
      "(v6",
      "(v7",
      "(v8",
      "(v9",
      "[v1",
      "[v2",
      "[v3",
      "[v4",
      "[v5",
      "[v6",
      "[v7",
      "[v8",
      "[v9"
    ],
    stems: [
      "- acapella",
      "(acapella",
      "[acapella",
      "- a cappella",
      "(a cappella",
      "[a cappella",
      "- instrumental",
      "(instrumental",
      "[instrumental",
      "- session",
      "(session",
      "[session",
      "- studio session",
      "(studio session",
      "[studio session",
      "- smart session",
      "(smart session",
      "[smart session",
      "- boombox",
      "(boombox",
      "- mtv unplugged",
      "(mtv unplugged",
      "- unplugged",
      "(unplugged",
      "- the long pond studio",
      "(the long pond studio"
    ],
    bonus: [
      "- intro",
      "(intro",
      "[intro",
      "- outro",
      "(outro",
      "[outro",
      "dean outro",
      "- interlude",
      "(interlude",
      "[interlude",
      "- bonus",
      "(bonus",
      "[bonus",
      "- edit",
      "(edit",
      "[edit",
      "- from",
      "(from",
      "[from",
      "- skit",
      "(skit",
      "- original",
      "(original",
      "[original",
      "[clean",
      "[explicit",
      "- deluxe",
      "(deluxe",
      "[deluxe",
      "- digital deluxe",
      "(digital deluxe",
      "[digital deluxe",
      "- complete edition",
      "(complete edition",
      "[complete edition",
      "- extended",
      "(extended",
      "[extended",
      "- the extended edition",
      // denzel
      "- expanded",
      "(expanded",
      "[expanded",
      "- anniversary",
      "(anniversary",
      "[anniversary",
      "- b-side",
      "- c-side",
      "(b-side",
      "(c-side",
      "- lp",
      "- ep",
      "(lp",
      "(ep",
      "- single",
      "(single",
      "- box set",
      "(box set",
      //,
      "- 19",
      "- 20",
      "(19",
      "(20",
      "- 10th",
      "- 19th",
      "- 20th",
      "- 25th",
      "- 30th",
      "- 35th",
      "- 40th",
      "- 50th",
      "- 60th",
      "(10th",
      "(19th",
      "(20th",
      "(25th",
      "(30th",
      "(35th",
      "(40th",
      "(50th",
      "(60th"
    ]
  };

  // src/build/trans.js
  var lang;
  var non_override_lang;
  var valid_langs = ["en", "de", "pl"];
  var lang_info = {
    en: {
      name: "English",
      by: ["cutensilly"],
      last_updated: "latest"
    },
    de: {
      name: "Deutsch",
      by: ["stellasaur", "cutensilly"],
      last_updated: "2025-03-09"
    },
    pl: {
      name: "Polski",
      by: ["iwas15with100k"],
      last_updated: "2024-06-17"
    }
  };
  var trans = {
    badges: {
      missing: {
        name: {
          en: "No badges"
        }
      },
      "user-status-subscriber": {
        name: {
          en: "Last.fm Pro"
        },
        reason: {
          en: "Active Pro subscription"
        }
      },
      "user-status-staff": {
        name: {
          en: "Staff"
        },
        reason: {
          en: "Official member of Last.fm"
        }
      },
      "user-status-mod": {
        name: {
          en: "Mod"
        },
        reason: {
          en: "Official member of Last.fm"
        }
      },
      "user-status-alum": {
        name: {
          en: "Alum"
        },
        reason: {
          en: "Since the beginning"
        }
      },
      "label--fade": {
        reason: {
          en: "They follow you!"
        }
      },
      contributor: {
        name: {
          en: "Contributor"
        },
        reason: {
          en: "Has worked on bleh or bwaa"
        }
      },
      translation: {
        reason: {
          en: "Translations"
        }
      },
      cat: {
        name: {
          en: "its a kitty!!"
        }
      },
      sponsor: {
        name: {
          en: "Sponsor"
        },
        reason: {
          en: "thank you from kate <3"
        }
      },
      cute: {
        reason: {
          en: "Reserved"
        }
      },
      reserved: {
        reason: {
          en: "Reserved"
        }
      }
    },
    home: {
      en: "Home"
    },
    library: {
      en: "Library"
    },
    view_profile: {
      en: "View profile"
    },
    shouts: {
      en: "Shouts"
    },
    about: {
      en: "About"
    },
    edit_wiki: {
      en: "Edit wiki"
    },
    read_more: {
      en: "Read more"
    },
    refresh: {
      en: "Refresh"
    },
    refresh_tracks: {
      en: "Refresh tracks"
    },
    from_the_album: {
      en: "From the album: {album}"
    },
    set_obsession: {
      en: "Obsess"
    },
    obsession_first: {
      en: "First to claim this obsession!"
    },
    compare: {
      en: "Compare"
    },
    compare_plays: {
      en: "Compare plays"
    },
    others_featured: {
      en: "Others featured"
    },
    your_scrobbles: {
      en: "Your scrobbles"
    },
    plays: {
      en: "Plays"
    },
    try_again: {
      en: "Try again"
    },
    continue: {
      en: "Continue"
    },
    back: {
      en: "Back"
    },
    settings: {
      en: "Settings"
    },
    done: {
      en: "Done"
    },
    on_ignore_list: {
      en: "Ignored"
    },
    friends: {
      en: "Friends"
    },
    aka: {
      en: "aka."
    },
    pronouns: {
      en: "pronouns"
    },
    account_created: {
      en: "created"
    },
    account_scrobbling_since_replace: {
      // copy this from last.fm 1:1 (including the space at the end if there)
      en: "\u2022 scrobbling since "
    },
    edit: {
      en: "Edit"
    },
    edit_profile: {
      en: "Edit profile"
    },
    scrobbles: {
      en: "Scrobbles"
    },
    artists: {
      en: "Artists"
    },
    albums: {
      en: "Albums"
    },
    tracks: {
      en: "Tracks"
    },
    appearance: {
      en: "Appearance"
    },
    themes: {
      name: {
        en: "Themes"
      },
      light: {
        en: "Light"
      },
      dark: {
        en: "Ash"
      },
      darker: {
        en: "Dark"
      },
      oled: {
        en: "Void"
      }
    },
    colours: {
      en: "Colours"
    },
    hue_from_album: {
      name: {
        en: "Colour album pages based on album art"
      },
      body: {
        en: "Highlights the primary colour from the album art to replace your colour temporarily"
      }
    },
    colourful_tracks: {
      name: {
        en: "Colour active track based on album art"
      },
      body: {
        en: "Highlights the primary colour from the album art for the individual track"
      }
    },
    configure: {
      en: "Configure"
    },
    events: {
      en: "Events"
    },
    top_badge: {
      en: "Top Badge"
    },
    layout: {
      en: "Layout"
    },
    music: {
      en: "Music",
      de: "Musik"
    },
    profile: {
      en: "Profile",
      de: "Profil"
    },
    seasonal: {
      name: {
        en: "Seasonal",
        de: "Saisonal"
      }
    },
    text: {
      en: "Text"
    },
    accessibility: {
      en: "Accessibility"
    },
    moderation: {
      en: "Moderation"
    },
    troubleshooting: {
      en: "Advanced"
    },
    recommendations: {
      en: "Recommendations"
    },
    releases: {
      en: "Releases"
    },
    bookmarks: {
      en: "Bookmarks"
    },
    charts: {
      en: "Charts"
    },
    welcome_back_user: {
      en: "Welcome back {user}"
    },
    thank_you_for_sponsoring: {
      en: "Thank you for sponsoring!"
    },
    configure_bleh: {
      en: "bleh Settings"
    },
    import: {
      en: "Import"
    },
    export: {
      en: "Export"
    },
    reset: {
      en: "Reset"
    },
    changelog: {
      en: "What's New?"
    },
    default: {
      en: "Default"
    },
    avatar: {
      en: "Avatar"
    },
    customise: {
      en: "Customise"
    },
    hue: {
      en: "Accent colour",
      de: "Akzentfarbe"
    },
    sat: {
      en: "Vibrancy"
    },
    lit: {
      en: "Lightness",
      de: "Helligkeit"
    },
    card_background_saturation: {
      name: {
        en: "Card background vibrancy"
      },
      body: {
        en: "Bring some colour into your world (or reduce it)"
      }
    },
    save: {
      en: "Save"
    },
    add: {
      en: "Add"
    },
    remove: {
      en: "Remove"
    },
    go: {
      en: "Go"
    },
    skip: {
      en: "Skip"
    },
    send: {
      en: "Send"
    },
    send_quickly_with: {
      en: "Send quickly with {kbd}"
    },
    right_click_for_more_options: {
      en: "Right click for more options"
    },
    refresh_pending: {
      name: {
        en: "Refresh pending"
      },
      body: {
        en: "A setting you changed requires a page refresh to take effect."
      }
    },
    new: {
      en: "New"
    },
    beta: {
      en: "Beta"
    },
    more: {
      en: "More"
    },
    notifications: {
      count: {
        en: "{count} notifications"
      },
      none: {
        en: "No new notifications"
      }
    },
    inbox: {
      count: {
        en: "{count} messages"
      },
      none: {
        en: "No new messages"
      }
    },
    about_me_preview: {
      en: "About Me (preview)"
    },
    markdown_tip: {
      en: "This textbox supports markdown such as line breaks, bold text, italics, underlines, and more. You can embed images using ![alt text](link). Beware that to non-bleh users it will not appear fancy."
    }
  };
  var trans_legacy = {
    en: {
      pages: {
        bleh_settings: {
          "": "bleh settings"
        },
        bleh_setup: {
          "": "bleh setup"
        },
        bleh_sponsor: {
          "": "sponsor"
        },
        home: {
          overview: "home",
          artists: "artists",
          albums: "albums",
          tracks: "tracks",
          events: "events"
        },
        overview: {
          music: "home"
        },
        recommended: {
          artists: "recommended artists",
          albums: "recommended albums",
          tracks: "recommended tracks",
          rediscover: "blasts from the past",
          tags: "recommended tags"
        },
        bookmarks: {
          overview: "bookmarks",
          artists: "bookmarks",
          albums: "bookmarks",
          tracks: "bookmarks",
          tags: "bookmarks"
        },
        search: {
          overview: "{name} \xB7 search",
          artists: "{name} \xB7 artist search",
          albums: "{name} \xB7 album search",
          tracks: "{name} \xB7 track search"
        },
        labs: {
          overview: "labs"
        },
        settings: {
          overview: "settings",
          privacy: "privacy \xB7 settings",
          account_overview: "account \xB7 settings",
          website: "website \xB7 settings",
          subscription_overview: "last.fm pro \xB7 settings",
          "subscription_automatic-edits_albums": "album auto edits \xB7 settings",
          "subscription_automatic-edits_tracks": "track auto edits \xB7 settings",
          applications_overview: "applications \xB7 settings"
        },
        inbox: {
          overview: "incoming inbox",
          sent_overview: "outgoing inbox",
          compose: "compose message",
          message_overview: "message",
          sent_message: "message",
          notifications: "notifications"
        },
        releases: {
          "out-now_recommended": "out now",
          "out-now_popular": "out now",
          "coming-soon_recommended": "coming soon",
          "coming-soon_popular": "coming soon"
        },
        charts: {
          overview: "live charts",
          weekly: "weekly charts"
        },
        user: {
          overview: "{name} \xB7 profile",
          "listening-report_week": "{name} \xB7 profile reports",
          "listening-report_month": "{name} \xB7 profile reports",
          "listening-report_year": "{name} \xB7 profile reports",
          library_overview: "{name} \xB7 profile library",
          library_artists: "{name} \xB7 profile library",
          library_albums: "{name} \xB7 profile library",
          library_tracks: "{name} \xB7 profile library",
          library_artist_overview: "{name} \xB7 profile library",
          library_album_overview: "{name} \xB7 profile library",
          library_track_overview: "{name} \xB7 profile library",
          library_artist_albums: "{name} \xB7 profile library",
          library_artist_tracks: "{name} \xB7 profile library",
          following: "{name} \xB7 profile following",
          followers: "{name} \xB7 profile followers",
          neighbours: "{name} \xB7 profile neighbours",
          shoutbox_overview: "{name} \xB7 profile shouts",
          loved: "{name} \xB7 profile loved",
          obsessions: "{name} \xB7 profile obsessions",
          events: "{name} \xB7 profile events",
          playlists_playlists: "{name} \xB7 profile playlists",
          tags_overview: "{name} \xB7 profile tags"
        },
        artist: {
          overview: "{name} \xB7 artist",
          tracks: "{name} \xB7 artist tracks",
          albums: "{name} \xB7 artist albums",
          images_overview: "{name} \xB7 artist photos",
          "images_image-upload": "{name} \xB7 artist photos",
          image: "{name} \xB7 artist photo",
          similar: "{name} \xB7 artist similar",
          wiki_overview: "{name} \xB7 artist wiki",
          wiki_edit: "{name} \xB7 artist wiki",
          wiki_history: "{name} \xB7 artist wiki",
          listeners_overview: "{name} \xB7 artist top listeners",
          "listeners_you-know": "{name} \xB7 artist listeners you know",
          shoutbox_overview: "{name} \xB7 artist shouts",
          events: "{name} \xB7 artist events",
          tags_overview: "{name} \xB7 artist tags"
        },
        album: {
          overview: "{name} - {sister} \xB7 album",
          wiki_overview: "{name} - {sister} \xB7 album wiki",
          wiki_edit: "{name} - {sister} \xB7 album wiki",
          wiki_history: "{name} - {sister} \xB7 album wiki",
          images_overview: "{name} - {sister} \xB7 album photos",
          "images_image-upload": "{name} - {sister} \xB7 album photos",
          image: "{name} - {sister} \xB7 album photo",
          shoutbox_overview: "{name} - {sister} \xB7 album shouts",
          tags_overview: "{name} - {sister} \xB7 album tags"
        },
        track: {
          overview: "{name} - {sister} \xB7 track",
          albums: "{name} - {sister} \xB7 track albums",
          wiki_overview: "{name} - {sister} \xB7 track wiki",
          wiki_edit: "{name} - {sister} \xB7 track wiki",
          wiki_history: "{name} - {sister} \xB7 track wiki",
          shoutbox_overview: "{name} - {sister} \xB7 track shouts",
          tags_overview: "{name} - {sister} \xB7 track tags"
        }
      },
      badges: {
        missing: {
          name: "No badges"
        },
        "user-status-subscriber": {
          name: "Last.fm Pro",
          reason: "Active Pro subscription"
        },
        "user-status-staff": {
          name: "Staff",
          reason: "Staff member of Last.fm"
        },
        "label--fade": {
          reason: "They follow you"
        },
        contributor: {
          name: "bleh contributor",
          reason: "Contributed to bleh via code or translations"
        },
        translation: {
          reason: "Translated for a supported language"
        },
        cat: {
          name: "it's a kitty!!"
        },
        sponsor: {
          name: "Sponsoring",
          reason: "Sponsored bleh and bwaa :3"
        },
        cute: {
          reason: "Reserved for special users"
        },
        reserved: {
          reason: "Reserved for certain users"
        }
      },
      avatar_for_me: "Your avatar",
      avatar_for_user: "Avatar for ",
      actions: {
        view_profile: "View profile",
        view_library: "Library",
        leave_a_shout: "Shouts"
      },
      lotus: {
        artist: "Artist corrections have been downloaded!",
        album_track: "Album and track corrections have been downloaded!",
        version: "You are running lotus version {v}.",
        tooltip: "lotus is the community correction system used in bleh and bwaa",
        check: "Check for updates",
        correct: {
          name: "Correct capitalisation",
          tooltip: "Submit name correction",
          tooltip_active: "Active name correction"
        }
      },
      glacier: {
        name: "Library refresh",
        by_artist: " by {a}",
        meta: {
          artists: "Artists",
          albums: "Albums",
          tracks: "Tracks",
          average: "Average"
        },
        view: {
          grid: "Grid",
          list: "List",
          line: "Line",
          pie: "Pie",
          bar: "Bar"
        },
        axis: {
          horizontal: "Horizontal",
          vertical: "Vertical"
        },
        dates: {
          last_year: "Last year",
          this_year: "This year"
        },
        edit: "Edit",
        delete: "Delete",
        love: "Love",
        bulk_edit: "Bulk edit",
        option: {
          name: "Use new graphs in library",
          bio: "This can add a little amount of slow-down in some cases but with the benefit of awesome graphs."
        }
      },
      changelog: {
        name: "What\u2019s New?",
        subtitle: "from {u}",
        type: {
          major: "Major release",
          minor: "Minor release",
          general: "General improvements",
          fix: "Bug fix"
        },
        latest: "Latest",
        view_major: "View latest major release"
      },
      auth_menu: {
        dev: "Toggle dev mode",
        configure_bleh: "Configure bleh",
        library: "Library",
        shouts: "Shouts",
        obsessions: "Obsessions",
        labs: "Labs",
        bookmarks: "Bookmarks",
        settings: "Settings",
        logout: "Logout",
        seasonal_notice: "To watch the counter update live, click and stay on the tab that opens.",
        seasonal_live: "Counter is updating live!"
      },
      music: {
        submit_lastfm_correction: "Submit correction to Last.fm",
        search_variations: {
          name: "Search",
          tooltip: "Search for variations of this title"
        },
        search_genius: "Search lyrics",
        fetch_plays: {
          name: "Tracklist",
          info: "Sourced from your own plays as an official tracklist is unavailable",
          loading: "Fetching your plays on this album",
          fail: "You do not have any plays on this album",
          open_as_track: "Open album title as a track"
        },
        from_the_album: "From the album: {album}",
        listens: {
          count_listens: "{c} listens",
          loading_listens: "listens",
          other_listeners: "{c} others",
          custom: {
            tooltip: "Pick a user",
            name: "View listens from another user"
          }
        },
        wiki: "About",
        wiki_edit: "edit wiki",
        wiki_read: "read more",
        refresh: "Refresh",
        refresh_tracks: "Refresh tracks",
        menu: "Extra options",
        obsession: "Obsess",
        obsession_first: "First to claim this obsession!",
        compare: {
          name: "Compare",
          header: "Compare plays"
        },
        about: "About",
        about_guests: "Others featured",
        view_profile: "View profile"
      },
      error: {
        name: "This page is missing...",
        go_back: "Go back",
        visit_profile: "Visit profile",
        try_again: "Try again"
      },
      statistics: {
        scrobbles: {
          name: "Your scrobbles"
        },
        plays: {
          name: "plays"
        }
      },
      profile: {
        name: "Profile",
        on_ignore_list: "Ignored",
        friends: {
          name: "Friends"
        },
        display_name: {
          aka: "aka.",
          pronouns: "pronouns"
        },
        created: {
          name: "created",
          replace: "\u2022 scrobbling since "
        },
        edit: "Edit profile",
        obsess: "Obsess",
        message: "Message",
        sponsor: "Sponsor",
        message_sponsor: "Receive sponsor rewards",
        shortcut: {
          add: "Shortcut",
          remove: "Shortcut"
        },
        scrobbles: "Scrobbles",
        artists: "Artists",
        loved: "Loved",
        taste: "Taste similarity",
        taste_meter: {
          level: {
            super: "Super",
            very_high: "Very High",
            high: "High",
            medium: "Medium",
            low: "Low",
            very_low: "Very Low",
            unknown: "Unknown"
          },
          you_share_1: "You share {artist}",
          you_share_2: "You share {artist1} and {artist2}",
          you_share_3: "You share {artist1}, {artist2}, and {artist3}"
        },
        open_avatar: "Open in a new tab",
        settings: "Configure",
        events: "Events",
        top_badge: "Top Badge",
        progress: {
          to_go: "{s} scrobbles to go",
          tier: "Tier {t}",
          explain: "For each tier, you unlock a new badge"
        },
        banner: {
          name: "Banner",
          origin: {
            bio: [
              "Sourced from this user's about me",
              "Embed an image with {b} to achieve the same"
            ],
            avatar: "Sourced from this user's avatar",
            artist: "Sourced from this user's top track",
            hidden: "Hidden based on your preferences",
            none: "Sourced from nowhere..."
          }
        }
      },
      event: {
        name: "Event",
        going: "{c} going",
        maybe: "{c} interested",
        you_know: "Who you know",
        all_time: "All time",
        total: "{c} total"
      },
      messaging: {
        update: "bleh has updated to version {v}!"
      },
      wiki: {
        latest: "View latest version",
        syntax: {
          name: "Use fancy syntax when editing",
          links_to: "Links to {link}"
        },
        presets: {
          name: "Symbol presets"
        }
      },
      settings: {
        name: "Settings",
        save: "Save",
        cancel: "Cancel",
        close: "Close",
        clear: "Clear",
        create: "Create",
        add: "Add",
        remove: "Remove",
        done: "Done",
        finish: "Finish",
        continue: "Continue",
        reset: "Reset to default",
        go: "Go",
        skip: "Skip",
        back: "Back",
        send: "Send",
        send_quickly: "Send quickly with {kbd}",
        right_click: "Right-click for more options",
        reload: {
          name: "Refresh pending",
          body: "A setting you changed requires a page refresh to take effect."
        },
        new: "New",
        beta: "Beta",
        configure: "Configure",
        pages: {
          overview: "Profile",
          privacy: "Privacy",
          account_overview: "Account",
          website: "Website",
          subscription_overview: "Pro",
          applications_overview: "Applications"
        },
        examples: {
          button: "Example button"
        },
        skip_to: {
          name: "Skip to"
        },
        home: {
          name: "Home",
          brand: "bleh",
          version: "Version {v}",
          recommended: "Recommended settings",
          issues: {
            name: "Issues",
            bio: "Report bugs"
          },
          update: {
            name: "Updates",
            css: "Update style",
            bio: "Check now",
            notice: "There are updates available!",
            ignore: "Ignore temporarily",
            update_now: "Update now",
            update_to_v: "Update to {v}"
          },
          setup: {
            name: "Setup",
            bio: "Re-enter setup"
          },
          colours: {
            name: "Colours",
            bio: "Pick your favourite!"
          },
          thanks: "Welcome {m}, you are running bleh version {v}.",
          sponsor: {
            name: "Sponsor",
            header: "Sponsor the development of bleh and bwaa",
            bio: "If you feel my work on these projects is worthy of donations you are welcome to sponsor me on GitHub. This is of course optional and bleh will forever be open-source and free.",
            thanks: "Thank you for sponsoring {m}, you are running bleh version {v}.",
            status: {
              yes: "You are a sponsor, thank you!",
              no: "Become a sponsor to get a custom badge",
              badge: "To configure your custom badge, get in touch with me.",
              one_time: "A custom badge is available only when selecting monthly."
            },
            manage: "Manage sponsorship",
            check: "Refresh badges",
            download: "Sponsorship and badge data downloaded!",
            version: "You have version {v} of the sponsorship/badge data downloaded."
          }
        },
        appearance: {
          name: "Appearance"
        },
        themes: {
          name: "Themes",
          bio: "Choose from light to midnight.",
          dark: {
            name: "Dark",
            bio: "The default flavour of bleh"
          },
          darker: {
            name: "Darker",
            bio: "The in-between"
          },
          oled: {
            name: "Midnight",
            bio: "Ultra blackout"
          },
          light: {
            name: "Light",
            bio: "Low saturation and bright"
          },
          classic: {
            name: "Classic",
            bio: "Re-live early computing"
          }
        },
        music: {
          name: "Music",
          header: "Music configuration",
          bio: "Configure your music-related settings for profiles, artists, albums, and tracks.",
          profile_shortcut: {
            name: "Profile shortcut",
            bio: "Quickly access a user's plays on an artist, album, or track page.",
            placeholder: "Profile",
            header: "Enter username",
            saved: "Profile shortcut is valid",
            failed: "Profile does not exist or failed to load"
          },
          show_bulk_edit_album: {
            name: "Show album in chartlists",
            bio: "This is disabled by default as hovering over tracks reveals the album title in all areas",
            require: "Only applicable with the \u2018Last.fm Bulk Edit\u2019 extension"
          },
          grid_glow: {
            name: "Show a glow around grid items"
          }
        },
        accessibility: {
          name: "Accessibility",
          shout_preview: `some completely random text that doesn't mean <a href="https://cutensilly.org">anything at all</a>`,
          accessible_name_colours: {
            name: "Prefer accessible name colours",
            bio: "Use the default header text colour over a accented text colour."
          },
          underline_links: {
            name: "Always underline links",
            bio: "Make links to interactables stand out."
          },
          reduced_motion: {
            name: "Reduce animations around interfaces",
            bio: "Will in most cases either slowly fade or hard-cut, no scaling."
          },
          toggle_icon: {
            name: "Add indicator icon to toggles",
            bio: "Display a checkmark or a cross depending on toggle state."
          }
        },
        layout: {
          name: "Layout",
          header: "Manage header layout",
          avatar_action: {
            name: "Default avatar action",
            bio: "What do you want to happen when you click avatars?",
            gallery: "View photos (or featured album for tracks)",
            album: "View featured album"
          },
          quick_artist_button: {
            name: "Quick artist button",
            bio: "Control the right-side button on artist profiles.",
            shouts: "View shouts",
            wiki: "View biography",
            listens: "View listeners"
          }
        },
        customise: {
          name: "Customise",
          colours: {
            name: "Colours",
            modals: {
              custom_colour: {
                hue: "Accent colour",
                sat: "Saturation",
                lit: "Lightness",
                seasonal_alert: "The current season is overriding your accent colour, adjust sliders to disable."
              }
            },
            swatches: {
              default: "Default",
              avatar: "Avatar",
              seasonal: "Seasonal",
              custom: "Customise"
            }
          },
          high_contrast: {
            name: "Enable high contrast mode"
          },
          seasonal: {
            name: "Seasonal",
            timeline: "Seasonal timeline",
            bio: "During seasonal events, bleh can automatically change the default accent colour, add particles, and add overlays to various interface elements.",
            info: "Seasonal events try to match your timezone, for reference we calculated {offset}",
            started: "Started",
            ends_in: "Ends in",
            listing: {
              none: "No active season",
              easter: "Easter",
              pride: "Pride",
              halloween: "Halloween",
              pre_fall: "Pre-Fall",
              fall: "Fall",
              christmas: "Christmas",
              new_years: "New Years"
            },
            option: {
              name: "Enable seasonal event system"
            },
            marker: {
              current: "The current season is {season} for {time}.",
              started: "started {time}",
              none: "There is no active season currently.",
              disabled: "You have seasons disabled, enable to view current event."
            },
            particles: {
              name: "Display particles during select seasons",
              bio: "During winter seasons you get snowflakes!"
            },
            show_less_particles: {
              name: "Display a reduced number of particles"
            },
            fps_particles: {
              name: "Display particles without fancy effects",
              bio: "This might be more demanding on some systems"
            },
            overlays: {
              name: "Display additional seasonal effects",
              bio: "During winter seasons this is used for ice effects, otherwise mainly just gradients."
            },
            announce: "It is now {s}!",
            nonsense: "A Nonsense Christmas",
            fruitcake: "fruitcake",
            mistletoe: "Mistletoe",
            festival: "Christmas Eve",
            view: "Open seasonal tab",
            none: "No colours available"
          },
          artwork: {
            name: "Artwork"
          },
          hue_from_album: {
            name: "Colour album pages based on album art",
            bio: "Picks the primary colour from an album cover to paint the page."
          },
          gloss: {
            name: "Gloss overlay",
            bio: "Apply flair to all cover arts."
          },
          display: {
            name: "Display"
          },
          colourful_counts: {
            name: "Use a colour gradient for all-time charts",
            bio: "Assigns a colour from a gradient based on your position in all-time artist scrobbles."
          },
          colourful_tracks: {
            name: "Colour actively scrobbling tracks based on album art",
            bio: "Picks the primary colour from the associated cover to paint the track."
          },
          gendered_tags: {
            name: "Hide gendered tags",
            bio: "Gender-specific tags are deemed redundant by default."
          },
          rain: {
            name: "Let it rain!",
            bio: "rain :3c (may have performance impacts !! also may look bad !!)"
          },
          show_your_progress: {
            name: "Show your weekly progress",
            bio: "too many numbers ~w~"
          },
          profile_header: {
            name: "Display profile backgrounds",
            see_type: "Source from avatar instead of top artist",
            view_on: "View backgrounds on",
            for_own: "My own profile",
            for_others: "Other profiles"
          },
          sat_bg: {
            name: "Card background saturation",
            bio: "Control the colour of backgrounds in addition to main accent"
          }
        },
        activities: {
          name: "Activities",
          bio: "Display your most recent activities locally on your profile, only for you to see.",
          toggle: {
            name: "Enable activity tracking",
            bio: "Events will only be registered and displayed while enabled."
          },
          types: {
            shout: "Shouts",
            image: "Image uploads and interactions",
            obsess: "Track obsessions",
            love: "Track love",
            install: "Installing and updating",
            wiki: "Wiki editing"
          }
        },
        moderation: {
          name: "Moderation"
        },
        performance: {
          name: "Troubleshooting",
          bio: "Running into noticeable issues in theme loading? Try out these settings.",
          dev: {
            name: "Disable in-built theme loading",
            bio: "This allows you to load the in-built theme via Stylus instead, which may be more performant.",
            modals: {
              prompt: {
                alert: "Once you refresh the page, the in-built bleh theme will be disabled (unless you disable this option again).",
                stylus: "If you do not already have the <strong>Stylus</strong> extension, choose your browser below:",
                browsers: {
                  chrome: {
                    name: "Chrome",
                    bio: "for Chrome, Edge, Brave, Opera"
                  },
                  firefox: {
                    name: "Firefox",
                    bio: "for Firefox only"
                  }
                }
              },
              continue: {
                next_step: 'Once you have the extension installed, hit "Install style" on the new tab that will open.'
              },
              finish: {
                alert: "All done! From now on, styling will be handled via Stylus."
              }
            }
          },
          bug: {
            name: "Something wrong?",
            bio: "Report a bug in the bleh repo to get it fixed."
          }
        },
        profiles: {
          name: "Profile",
          bio: "Manage your personal data and data stored on other profiles.",
          notes: {
            name: "Notes",
            header: "Note",
            placeholder: "Enter a local note for this user",
            edit: "Edit note",
            delete: "Remove note",
            edit_user: "Edit {u}'s note",
            delete_user: "Remove {u}'s note",
            view: "View your profile notes"
          },
          you: "You",
          avatar_radius: {
            name: "User avatar shape"
          },
          api: {
            name: "API access",
            bio: "Enter a Last.fm API key to use new features, such as:",
            features: [
              {}
            ],
            placeholder: "Enter API key",
            saved: "Saved your API key, testing..",
            confirmed: "Verified your API key, enjoy!",
            inaccessible: "Last.fm API is inaccessible",
            invalid: "That key seems invalid, are you sure?",
            rate_limit: "Your key is rate-limited for a short time"
          }
        },
        redirects: {
          name: "Redirects",
          bio: "Manage last.fm's (not) handy redirection system as best as possible.",
          travis: {
            name: "Hide redirect messages on music pages",
            bio: "No, I didn't mean Travi$ Scott"
          },
          autocorrect: {
            name: "Scrobble auto-correction",
            bio: "By default, last.fm will 'auto-correct' some of your scrobbles using this system. This will make your scrobbles appear as <i>Travis Scott</i> rather than <i>Travi$ Scott</i>, however the redirection system is not fully disabled.",
            action: "Open Settings"
          }
        },
        corrections: {
          name: "Corrections",
          bio: "Manage capitalisation of artist, album, and track names with community contributions.",
          toggle: {
            name: "Enable the correction system"
          },
          view: {
            name: "View current corrections",
            bio: "Lists all active in your install"
          },
          formatting: "Smart music titles",
          format_guest_features: {
            name: "Format guest features and song tags",
            bio: "Splits track and album titles into their individual tags such as guest features, versions, remixes."
          },
          show_guest_features: {
            name: "Show featured artists in track title",
            bio: "Featured artists are always shown below the title regardless."
          },
          stacked_chartlist_info: {
            name: "Stack track name and title",
            bio: "Both matches streaming services and increases max length of each."
          },
          show_remaster_tags: {
            name: "Show remaster tags",
            bio: "Nobody likes remasters (or the tags), if you'd prefer to still listen but remove the annoyance hide them!"
          },
          submit: {
            name: "Submit new correction",
            bio: "Have a name that you feel is capitalised wrong?",
            action: "Submit"
          },
          listing: {
            artists: "Artists",
            albums_tracks: "Albums and tracks"
          }
        },
        language: {
          name: "Language",
          supported: "Supported by bleh",
          by: "by {users}",
          submit: {
            name: "Are you fluent in another language?",
            bio: "Translations are purely community-contributed.",
            action: "Submit translation"
          }
        },
        text: {
          name: "Text",
          shout_preview_md: `some <strong>completely</strong> random!<br>text that doesn't mean <a href="https://cutensilly.org">anything at all</a>`,
          shout_preview: "some completely random! text that doesn't mean anything at all",
          markdown: {
            name: "Use markdown formatting",
            bio: "Enables line-breaks, bold, italics, and links.",
            shouts: "In shouts",
            profile: "In profile bios"
          },
          font: {
            name: "Font settings",
            placeholder: "Font name(s), separated by commas"
          },
          font_weight: {
            name: "Font weight",
            bio: "Used for most regular text"
          },
          font_weight_medium: {
            name: "Medium font weight",
            bio: "Used for bold text"
          },
          font_weight_bold: {
            name: "Bold font weight",
            bio: "Used for larger text such as headers"
          },
          font_emoji: {
            name: "Use compatibility emoji font",
            bio: "On Windows systems prior to 11, the emoji font is majorly outdated unless this option is used. (such as \u{1F3F3}\uFE0F\u200D\u26A7\uFE0F)"
          }
        },
        inbuilt: {
          profile: {
            name: "Profile",
            subtitle: {
              name: "Subtitle",
              aka: "aka.",
              pronouns: "pronouns"
            },
            pronoun_tip: 'When pronouns are placed first, "aka." will change to "pronouns".',
            country: "Country",
            website: "Website",
            about: "About",
            toggle_preview: {
              name: "Toggle preview",
              bio: "Preview how your bio looks to others",
              note: "For non-bleh users, multiple lines display as spaces and links, bold, italics will be plain text. Any images embedded will appear as manic text, so be aware."
            },
            banner_tip: "Images can be embedded using ![](link). You can also set a custom profile banner with ![banner](link).",
            avatar: {
              name: "Edit avatar",
              upload: "Upload file",
              delete: "Delete avatar"
            }
          },
          charts: {
            name: "Charts",
            recent: {
              count: {
                name: "Tracks to display"
              },
              artwork: {
                name: "Display album artwork"
              },
              realtime: {
                name: "Update tracks in realtime",
                bio: "Your recent tracks will refresh while you are on your profile."
              }
            },
            artists: {
              timeframe: {
                name: "Default timeframe"
              },
              style: {
                name: "Chart style"
              },
              length: {
                name: "Chart size"
              }
            },
            albums: {
              timeframe: {
                name: "Default timeframe"
              },
              style: {
                name: "Chart style"
              },
              length: {
                name: "Chart size"
              }
            },
            tracks: {
              count: {
                name: "Tracks to display"
              },
              timeframe: {
                name: "Default timeframe"
              }
            }
          },
          ignore: {
            name: "Communication",
            consider: {
              name: "To consider",
              good: [
                "You will not see previous or new shouts globally",
                "They cannot direct message you",
                "They cannot leave a shout on your profile or under your shouts anywhere"
              ],
              bad: [
                "You cannot delete pre-existing shouts from your profile",
                "They can still view your profile"
              ]
            },
            view: "View {c} more",
            count: "You have {c} users hidden"
          },
          privacy: {
            name: "Privacy",
            recent_listening: {
              name: "Hide your recent listening history",
              bio: "Keep your recent listens a secret o.O"
            },
            receiving_msgs: {
              name: "Control who can interact with you",
              bio: "This setting controls who can post shouts and message you privately.",
              settings: {
                everyone: {
                  name: "Everyone not hidden",
                  bio: "Everyone except who you have ignored"
                },
                neighbours: {
                  name: "Who you follow and neighbours",
                  bio: "Everyone who you have chosen to follow, along with your Last.fm neighbours"
                },
                follow: {
                  name: "Who you follow only",
                  bio: "Only users who you have chosen to follow"
                }
              }
            },
            disable_shoutbox: {
              name: "Hide your shoutbox",
              bio: "Your shoutbox will be hidden for you and anyone else."
            }
          }
        },
        actions: {
          import: {
            name: "Import",
            modals: {
              initial: {
                name: "Import settings from a previous install",
                alert: "Anything you import will override your current settings, if you are importing settings from online ensure you trust the source."
              },
              failed: {
                name: "Import failed",
                alert: "The settings you attempted to import failed to parse, no changes were made."
              }
            }
          },
          export: {
            name: "Export",
            modals: {
              initial: {
                name: "Export your current settings",
                alert: "Your current settings are in the textbox below ready for you to copy."
              }
            }
          },
          reset: {
            name: "Reset",
            modals: {
              initial: {
                name: "Reset your settings to default",
                alert: "Your settings will be <strong>reset to all defaults</strong> with no way to go back. Are you sure?",
                confirm: "Yes, reset my settings",
                export: "Export first"
              }
            }
          }
        }
      },
      shout: {
        name: "Shout",
        sent: "Sent!"
      },
      setup: {
        start: {
          name: "hello {m}!!",
          thanks: "Thank you for installing",
          info: [
            "This is the first-time setup to help you get started with common tasks for new users, which include:",
            "Manage accessibility, such as reduced motion",
            "Configuring your accent colour",
            "Changing your interface theme",
            "Adjusting song corrections and tagging",
            "If you're already set, you can skip."
          ],
          pick_theme: "Which theme would you prefer?",
          change_later: "You can modify all your settings at any time."
        },
        appearance: {
          name: "Your colour",
          bio: "Configure the colour of bleh from one of the available presets, or make your own colour combination!",
          subtext: "During seasonal events, the default colour changes automatically."
        },
        music: {
          change_later: "More detailed options available in settings."
        }
      },
      gallery: {
        tabs: {
          overview: "All",
          bookmarks: "Saved"
        },
        bookmarks: {
          name: "Saved",
          bio: "Gallery photos can be saved for future reference.",
          no_data: "no images saved (\u30FB\u30FB )",
          link: "View all saved photos",
          button: {
            image_is_bookmarked: {
              name: "You have saved this image"
            },
            bookmark_this_image: {
              name: "Save",
              bio: "Save this image for later"
            },
            unbookmark_this_image: {
              name: "Unsave",
              bio: "Unsave this image"
            }
          }
        },
        empty: {
          title: "No title",
          description: "No description"
        },
        prefer: {
          name: "Star"
        },
        report: {
          name: "Report"
        },
        open: {
          name: "Expand",
          tooltip: "Expand image to full resolution"
        },
        up: "Up votes:",
        down: "Down votes:",
        vote: "This is the sum of votes used for ordering.",
        view: "View photos"
      },
      activities: {
        name: "Recent Activity",
        test: "TEST {involved}",
        shout: "Shout",
        image_upload: "Uploaded image",
        image_star: "Starred image",
        obsess: "Obsessed",
        unobsess: "Removed obsession",
        love: "Loved",
        unlove: "Removed love",
        install_bwaa: "Installed bwaa",
        update_bwaa: "Updated bwaa",
        install_bleh: "Installed bleh",
        update_bleh: "Updated bleh",
        bookmark: "Bookmarked",
        unbookmark: "Removed bookmark",
        wiki: "Edited wiki"
      },
      artist: {
        name: "Artist",
        plural: "Artists",
        tooltip: "Multiple artists are combined into this profile."
      },
      album: {
        name: "Album",
        plural: "Albums"
      },
      track: {
        name: "Track",
        plural: "Tracks"
      },
      tag: {
        name: "Tag"
      },
      search: {
        name: "Search",
        results_for: "Results for {v}"
      },
      inbox: {
        name: "Inbox",
        overview: "Messages",
        sent_overview: "Messages",
        compose: "Messages",
        message_overview: "Messages",
        sent_message: "Messages",
        notifications: "Notifications"
      },
      charts: {
        name: "Charts",
        overview: "Real time",
        weekly: "Weekly",
        charts_for: "Charts for {date}",
        view: "View the charts",
        scroll: {
          name: "Simulate horizontal scrolling",
          bio: "Disable if you can scroll easily on a laptop for example."
        }
      },
      bookmarks: {
        name: "Bookmarks"
      },
      home: {
        name: "Home",
        welcome: "Welcome back {m}"
      },
      nag_bar: {
        corrections: {
          title: "Redirected from"
        }
      }
    },
    de: {
      badges: {
        missing: {
          name: "Kein Abzeichen"
        },
        "user-status-subscriber": {
          name: "Last.fm Pro",
          reason: "Aktives Pro Abonnement"
        },
        "user-status-staff": {
          name: "Angestellter",
          reason: "Angestellter von Last.fm"
        },
        "label--fade": {
          reason: "-"
        },
        contributor: {
          name: "bleh Mitwirkender",
          reason: "Hat bei bleh mitgewirkt \xFCber code oder \xFCbersetzungen"
        },
        translation: {
          reason: "Hat f\xFCr eine unterst\xFCtzte Sprache \xFCbersetzt"
        },
        cat: {
          name: "ein K\xE4tzchen!!!"
        },
        sponsor: {
          name: "Sponsor",
          reason: "Hat bleh und bwaa gesponsert :3"
        },
        cute: {
          reason: "F\xFCr besondere Nutzer reserviert"
        },
        reserved: {
          reason: "F\xFCr bestimmte Nutzer reserviert"
        }
      },
      avatar_for_me: "Dein Avatar",
      avatar_for_user: "Avatar f\xFCr ",
      actions: {
        view_profile: "View profile",
        view_library: "Library",
        leave_a_shout: "Shouts"
      },
      lotus: {
        artist: "Artist corrections have been downloaded!",
        album_track: "Album and track corrections have been downloaded!",
        version: "You are running lotus version {v}.",
        tooltip: "lotus is the community correction system used in bleh and bwaa",
        check: "Check for updates",
        correct: {
          name: "Correct capitalisation",
          tooltip: "Submit name correction",
          tooltip_active: "Active name correction"
        }
      },
      glacier: {
        name: "Library refresh",
        by_artist: " von {a}",
        meta: {
          artists: "K\xFCnstler",
          albums: "Alben",
          tracks: "Titel",
          average: "Average"
        },
        view: {
          grid: "Gitter",
          list: "Liste",
          line: "Liniendiagramm",
          pie: "Kreis",
          bar: "Balken"
        },
        axis: {
          horizontal: "Horizontal",
          vertical: "Vertikal"
        },
        dates: {
          last_year: "Letztes Jahr",
          this_year: "Dieses Jahr"
        },
        edit: "Editieren",
        delete: "Loeschen",
        love: "Love",
        bulk_edit: "Massenbearbeitung",
        option: {
          name: "Use new graphs in library",
          bio: "This can add a little amount of slow-down in some cases but with the benefit of awesome graphs."
        }
      },
      changelog: {
        name: "What\u2019s New?",
        subtitle: "from {u}",
        type: {
          major: "Major release",
          minor: "Minor release",
          general: "General improvements",
          fix: "Bug fix"
        },
        latest: "Latest",
        view_major: "View latest major release"
      },
      auth_menu: {
        dev: "Toggle dev mode",
        configure_bleh: "bleh konfigurieren",
        library: "Bibliothek",
        shouts: "Shouts",
        obsessions: "Obsessionen",
        labs: "Labor",
        bookmarks: "Lesezeichen",
        settings: "Einstellungen",
        logout: "Ausloggen"
      },
      music: {
        submit_lastfm_correction: "Submit correction to Last.fm",
        search_variations: {
          name: "Search",
          tooltip: "Search for variations of this title"
        },
        search_genius: "Search lyrics",
        fetch_plays: {
          name: "Titelliste",
          info: "Sourced from your own plays as an official tracklist is unavailable",
          loading: "Deine Wiedergaben auf diesem Album werden abgerufen",
          fail: "Du hast keine Scrobbel auf diesem Album",
          open_as_track: "Albumtitel als Titel \xF6ffnen"
        },
        from_the_album: "Aus dem Album: {album}",
        listens: {
          count_listens: "{c} scrobbels",
          loading_listens: "scrobbels",
          other_listeners: "{c} h\xF6rer",
          custom: {
            tooltip: "Pick a user",
            name: "View listens from another user"
          }
        },
        wiki: "\xDCber",
        wiki_edit: "wiki editieren",
        wiki_read: "mehr erfahren",
        refresh: "Neu laden",
        refresh_tracks: "Titel aktualisieren",
        menu: "Extra options",
        obsession: "Obsess",
        obsession_first: "First to claim this obsession!",
        compare: {
          name: "Compare",
          header: "Compare plays"
        },
        about: "About",
        about_guests: "Others featured",
        view_profile: "View profile"
      },
      error: {
        name: "This page is missing...",
        go_back: "Go back",
        visit_profile: "Visit profile",
        try_again: "Try again"
      },
      statistics: {
        scrobbles: {
          name: "Deine Scrobbels"
        },
        plays: {
          name: "scrobbels"
        }
      },
      profile: {
        name: "Profil",
        on_ignore_list: "Du stehst auf der Ignorierliste dieses Benutzers.",
        friends: {
          name: "Freunde"
        },
        display_name: {
          aka: "aka.",
          pronouns: "pronomen"
        },
        created: {
          name: "erstellt",
          replace: "\u2022 scrobbelt seit "
        },
        edit: "Profil bearbeiten",
        obsess: "Obsess",
        message: "Anschreiben",
        shortcut: {
          add: "Verkn\xFCpfung",
          remove: "Verkn\xFCpfung"
        },
        scrobbles: "Scrobbels",
        artists: "K\xFCnstler",
        loved: "Lieblingslieder",
        taste: "Taste similarity",
        taste_meter: {
          level: {
            super: "Super",
            very_high: "Very High",
            high: "High",
            medium: "Medium",
            low: "Low",
            very_low: "Very Low",
            unknown: "Unknown"
          },
          you_share_1: "Ihr h\xF6rt beide {artist}",
          you_share_2: "Ihr h\xF6rt beide {artist1} und {artist2}",
          you_share_3: "Ihr h\xF6rt beide {artist1}, {artist2}, und {artist3}"
        },
        open_avatar: "Im neuen Fenster \xF6ffnen",
        settings: "Konfigurieren",
        events: "Events",
        top_badge: "Top-Abzeichen",
        progress: {
          to_go: "Noch {s} scrobbels",
          tier: "Stufe {t}",
          explain: "F\xFCr jede Stufe schaltest du ein neues Abzeichen frei"
        }
      },
      event: {
        name: "Event",
        going: "{c} going",
        maybe: "{c} interested",
        you_know: "Who you know",
        all_time: "All time",
        total: "{c} total"
      },
      messaging: {
        update: "bleh wurde auf Version {v} aktualisiert!"
      },
      wiki: {
        latest: "View latest version",
        syntax: {
          name: "Use fancy syntax when editing",
          links_to: "Links to {link}"
        },
        presets: {
          name: "Symbol presets"
        }
      },
      settings: {
        name: "Einstellungen",
        save: "Speichern",
        cancel: "Abbrechen",
        close: "Schlie\xDFen",
        clear: "Leeren",
        create: "Create",
        add: "Add",
        remove: "Remove",
        done: "Fertig",
        finish: "Beenden",
        continue: "Fortsetzen",
        reset: "Auf Werkseinstellung Zur\xFCcksetzen",
        go: "Fortfahren",
        skip: "\xDCberspringen",
        back: "Zur\xFCck",
        right_click: "Right-click for more options",
        reload: {
          name: "Refresh pending",
          body: "Klicke zum Neuladen, um deine Einstellungen zu \xFCbernehmen."
        },
        new: "Neu",
        beta: "Beta",
        configure: "Konfigurieren",
        pages: {
          overview: "Profil",
          privacy: "Datenschutz",
          account_overview: "Konto",
          website: "Website",
          subscription_overview: "Pro",
          applications_overview: "Apps"
        },
        examples: {
          button: "Beispiel-Taste"
        },
        skip_to: {
          name: "Skip to"
        },
        home: {
          name: "Startseite",
          brand: "bleh",
          version: "Version {v}",
          recommended: "Empfohlene Einstellungen",
          issues: {
            name: "Probleme",
            bio: "Bugs reporten"
          },
          update: {
            name: "Aktualisierungen",
            css: "Stil aktualisieren",
            bio: "Jetzt pr\xFCfen",
            notice: "There are updates available!",
            ignore: "Ignore temporarily",
            update_now: "Update now",
            update_to_v: "Update to {v}"
          },
          setup: {
            name: "Setup",
            bio: "Re-enter setup"
          },
          colours: {
            name: "Farbe",
            bio: "Pick your favourite!"
          },
          thanks: "Willkommen {m}, du verwendest bleh Version {v}.",
          sponsor: {
            name: "Sponsor",
            header: "Sponsor the development of bleh and bwaa",
            bio: "If you feel my work on these projects is worthy of donations you are welcome to sponsor me on GitHub. This is of course optional and bleh will forever be open-source and free.",
            thanks: "Thank you for sponsoring {m}, you are running bleh version {v}.",
            status: {
              yes: "You are a sponsor, thank you!",
              no: "Become a sponsor to get a custom badge",
              badge: "To configure your custom badge, get in touch with me.",
              one_time: "A custom badge is available only when selecting monthly."
            },
            manage: "Manage sponsorship",
            check: "Refresh badges",
            download: "Sponsorship and badge data downloaded!",
            version: "You have version {v} of the sponsorship/badge data downloaded."
          }
        },
        appearance: {
          name: "Aussehen"
        },
        themes: {
          name: "Farbschema",
          bio: "Choose from light to midnight.",
          dark: {
            name: "Dunkel",
            bio: "The default flavour of bleh"
          },
          darker: {
            name: "Dunkler",
            bio: "The in-between"
          },
          oled: {
            name: "Mitternacht",
            bio: "Ultra blackout"
          },
          light: {
            name: "Hell",
            bio: "Low saturation and bright"
          },
          classic: {
            name: "Classic",
            bio: "Re-live early computing"
          }
        },
        music: {
          name: "Musik",
          header: "Musikkonfiguration",
          bio: "Konfiguriere deine musikbezogene Einstellungen f\xFCr Profile, K\xFCnstler, Alben und Titel.",
          profile_shortcut: {
            name: "Profilverkn\xFCpfung",
            bio: "Schnell auf die Wiedergaben eines Benutzers auf einer K\xFCnstler-, Album- oder Titelseite zugreifen.",
            placeholder: "Profil",
            header: "Benutzernamen eingeben",
            saved: "Die Profilverkn\xFCpfung ist g\xFCltig",
            failed: "Das Profil existiert nicht oder konnte nicht geladen werden."
          },
          show_bulk_edit_album: {
            name: "Show album in chartlists",
            bio: "This is disabled by default as hovering over tracks reveals the album title in all areas",
            require: "Only applicable with the \u2018Last.fm Bulk Edit\u2019 extension"
          },
          grid_glow: {
            name: "Show a glow around grid items"
          }
        },
        accessibility: {
          name: "Zug\xE4nglichkeit",
          shout_preview: `some completely random text that doesn't mean <a href="https://cutensilly.org">anything at all</a>`,
          accessible_name_colours: {
            name: "Zug\xE4ngliche Namensfarben bevorzugen",
            bio: "Use the default header text colour over a accented text colour."
          },
          underline_links: {
            name: "Links immer unterstreichen",
            bio: "Make links to interactables stand out."
          },
          reduced_motion: {
            name: "Animationen reduzieren",
            bio: "Will in most cases either slowly fade or hard-cut, no scaling."
          },
          toggle_icon: {
            name: "Add indicator icon to toggles",
            bio: "Display a checkmark or a cross depending on toggle state."
          }
        },
        layout: {
          name: "Layout",
          header: "Manage header layout",
          avatar_action: {
            name: "Default avatar action",
            bio: "What do you want to happen when you click avatars?",
            gallery: "View photos (or featured album for tracks)",
            album: "View featured album"
          },
          quick_artist_button: {
            name: "Quick artist button",
            bio: "Control the right-side button on artist profiles.",
            shouts: "View shouts",
            wiki: "View biography",
            listens: "View listeners"
          }
        },
        customise: {
          name: "Anpassen",
          colours: {
            name: "Farbe",
            presets: "Voreinstellungen",
            manual: "Anleitung",
            custom: "Erstelle eine eigene Farbe",
            default_with_season: "Standardfarbe f\xFCr {season}",
            default: "Standardfarbe",
            modals: {
              custom_colour: {
                preface: "Farben werden durch drei Werte gesteuert: Farbton, S\xE4ttigung und Helligkeit. Probiere den Schieberegler aus, um ein Gef\xFChl daf\xFCr zu bekommen.",
                hue: "Akzentfarbe",
                sat: "S\xE4ttigung",
                lit: "Helligkeit",
                seasonal_alert: "Die aktuelle Saison \xFCberschreibt deine Akzentfarbe. Passe den Schieberegler an, um sie zu deaktivieren."
              }
            }
          },
          high_contrast: {
            name: "Enable high contrast mode"
          },
          seasonal: {
            name: "Saisonal",
            timeline: "Seasonal timeline",
            bio: "W\xE4hrend saisonaler Ereignisse kann bleh automatisch die Standardakzentfarbe \xE4ndern, Partikel hinzuf\xFCgen und verschiedenen Schnittstellenelementen Overlays hinzuf\xFCgen.",
            info: "Seasonal events try to match your timezone, for reference we calculated {offset}",
            started: "Gestartet",
            ends_in: "Endet in",
            listing: {
              none: "No active season",
              easter: "Ostern",
              pride: "Pride",
              halloween: "Halloween",
              pre_fall: "Vorherbst",
              fall: "Herbst",
              christmas: "Weihnachten",
              new_years: "Silvester"
            },
            option: {
              name: "Saisonales Eventsystem aktivieren"
            },
            marker: {
              current: "Die aktuelle Saison ist {season} f\xFCr {time}",
              started: "{time} angefangen",
              none: "Derzeit gibt es keine aktive Saison.",
              disabled: "Saisons sind deaktiviert. Aktiviere diese, um die aktuelle Saison anzuzeigen."
            },
            particles: {
              name: "Partikel w\xE4hrend bestimmter Jahreszeiten anzeigen",
              bio: "W\xE4hrend der Wintersaison gibt es Schneeflocken!"
            },
            show_less_particles: {
              name: "Display a reduced number of particles"
            },
            fps_particles: {
              name: "Display particles without fancy effects",
              bio: "This might be more demanding on some systems"
            },
            overlays: {
              name: "Zus\xE4tzliche saisonale Effekte anzeigen",
              bio: "During winter seasons this is used for ice effects, otherwise mainly just gradients."
            },
            announce: "It is now {s}!",
            nonsense: "A Nonsense Christmas",
            fruitcake: "fruitcake",
            mistletoe: "Mistletoe",
            festival: "Christmas Eve",
            exclusive_for_season: 'Exclusive for <span class="season-name">{season}</span>',
            exclusive_for_season_and_more: 'Exclusive for <span class="season-name">{season}</span> and 1 more',
            view: "Open seasonal tab"
          },
          artwork: {
            name: "Cover"
          },
          hue_from_album: {
            name: "Albumseiten automatisch f\xE4rben",
            bio: "W\xE4hlt die Prim\xE4rfarbe eines Albumcovers aus, um die Seite zu bemalen."
          },
          gloss: {
            name: "Gloss overlay",
            bio: "Apply flair to all cover arts."
          },
          display: {
            name: "Anzeigeeinstellungen"
          },
          colourful_counts: {
            name: "Verwende einen Farbverlauf f\xFCr die Allzeitdiagramme",
            bio: "Weist eine Farbe aus dem Farbverlauf zu, basierend auf der insgesamten Anzahl der Scrobbels f\xFCr einen K\xFCnstler."
          },
          colourful_tracks: {
            name: "Colour actively scrobbling tracks based on album art",
            bio: "Picks the primary colour from the associated cover to paint the track."
          },
          gendered_tags: {
            name: "Geschlechtsspezifische Tags ausblenden",
            bio: "Geschlechtsspezifische Tags sind normalerweise \xFCberfl\xFCssig."
          },
          rain: {
            name: "Let it rain!",
            bio: "rain :3c (may have performance impacts !! also may look bad !!)"
          },
          show_your_progress: {
            name: "Show your weekly progress",
            bio: "too many numbers ~w~"
          },
          profile_header: {
            name: "Profilhintergr\xFCnde anzeigen",
            see_type: "Source from avatar instead of top artist",
            view_on: "View backgrounds on",
            for_own: "Auf meinem Profil",
            for_others: "Auf anderen Profilen"
          },
          sat_bg: {
            name: "Card background saturation",
            bio: "Control the colour of backgrounds in addition to main accent"
          }
        },
        activities: {
          name: "Activities",
          bio: "Track your most recent activities locally on your profile.",
          toggle: {
            name: "Enable activity tracking",
            bio: "Events will only be registered and displayed while enabled."
          },
          types: {
            shout: "Shouts",
            image: "Image uploads and interactions",
            obsess: "Track obsessions",
            love: "Track love",
            install: "Installing and updating",
            wiki: "Wiki editing"
          }
        },
        performance: {
          name: "Fehlerbehebung",
          bio: "Running into noticeable issues in theme loading? Try out these settings.",
          dev: {
            name: "Disable in-built theme loading",
            bio: "This allows you to load the in-built theme via Stylus instead, which may be more performant.",
            modals: {
              prompt: {
                alert: "Once you refresh the page, the in-built bleh theme will be disabled (unless you disable this option again).",
                stylus: "If you do not already have the <strong>Stylus</strong> extension, choose your browser below:",
                browsers: {
                  chrome: {
                    name: "Chrome",
                    bio: "for Chrome, Edge, Brave, Opera"
                  },
                  firefox: {
                    name: "Firefox",
                    bio: "for Firefox only"
                  }
                }
              },
              continue: {
                next_step: 'Once you have the extension installed, hit "Install style" on the new tab that will open.'
              },
              finish: {
                alert: "All done! From now on, styling will be handled via Stylus."
              }
            }
          },
          bug: {
            name: "Something wrong?",
            bio: "Report a bug in the bleh repo to get it fixed."
          }
        },
        profiles: {
          name: "Profil",
          bio: "Manage your personal data and data stored on other profiles.",
          notes: {
            name: "Notes",
            header: "Note",
            placeholder: "Enter a local note for this user",
            edit: "Edit note",
            delete: "Remove note",
            edit_user: "Edit {u}'s note",
            delete_user: "Remove {u}'s note",
            view: "View your profile notes"
          },
          you: "You"
        },
        redirects: {
          name: "Weiterleitungen",
          bio: "Manage last.fm's (not) handy redirection system as best as possible.",
          travis: {
            name: "Hide redirect messages on music pages",
            bio: "No, I didn't mean Travi$ Scott"
          },
          autocorrect: {
            name: "Scrobble auto-correction",
            bio: "By default, last.fm will 'auto-correct' some of your scrobbles using this system. This will make your scrobbles appear as <i>Travis Scott</i> rather than <i>Travi$ Scott</i>, however the redirection system is not fully disabled.",
            action: "Open Settings"
          }
        },
        corrections: {
          name: "Korrekturen",
          bio: "Verwalte das Korrektursystem von bleh f\xFCr K\xFCnstler-, Album- und Titel.",
          toggle: {
            name: "Aktiviere das Korrektursystem"
          },
          view: {
            name: "Aktuelle Korrekturen anzeigen",
            bio: "Lists all active in your install"
          },
          formatting: "Smarte Musiktitel",
          format_guest_features: {
            name: "Formatiere Features und Song-Tags",
            bio: "Teilt Titel und Albentitel in einzelne Tags auf, beispielsweise Features, Versionen, Remixe."
          },
          show_guest_features: {
            name: "Features im Titel und K\xFCnstler anzeigen",
            bio: "Durch deaktivieren werden sie von Titeln entfernt und das K\xFCnstlerfeld wird bevorzugt."
          },
          stacked_chartlist_info: {
            name: "Name und Titel stapeln",
            bio: "Beide passen sich an den Streaming-Diensten an und erh\xF6ht die L\xE4nge dieser."
          },
          show_remaster_tags: {
            name: "Remaster-Tags anzeigen",
            bio: "Nobody likes remasters (or the tags), if you'd prefer to still listen but remove the annoyance hide them!"
          },
          submit: {
            name: "Neue Korrektur einreichen",
            bio: "Have a name that you feel is capitalised wrong?",
            action: "Submit"
          },
          listing: {
            artists: "K\xFCnstler",
            albums_tracks: "Alben und Titel"
          }
        },
        language: {
          name: "Sprache",
          supported: "Unterst\xFCtzt von bleh",
          by: "von {users}",
          submit: {
            name: "Sprichst du flie\xDFend eine andere Sprache?",
            bio: "\xDCbersetzungen werden ausschlie\xDFlich von der Community beigesteuert.",
            action: "\xDCbersetzung einreichen"
          }
        },
        text: {
          name: "Text",
          shout_preview_md: `some <strong>completely</strong> random!<br>text that doesn't mean <a href="https://cutensilly.org">anything at all</a>`,
          shout_preview: "some completely random! text that doesn't mean anything at all",
          markdown: {
            name: "Markdown-Formatierung verwenden",
            bio: "Aktiviert Zeilenumbr\xFCche, Fettdruck, Kursivschrift und Links.",
            shouts: "In Shouts",
            profile: "In Profilbiografien"
          },
          font: {
            name: "Font settings",
            placeholder: "Font name(s), separated by commas"
          },
          font_weight: {
            name: "Font weight",
            bio: "Used for most regular text"
          },
          font_weight_medium: {
            name: "Medium font weight",
            bio: "Used for bold text"
          },
          font_weight_bold: {
            name: "Bold font weight",
            bio: "Used for larger text such as headers"
          },
          font_emoji: {
            name: "Use compatibility emoji font",
            bio: "On Windows systems prior to 11, the emoji font is majorly outdated unless this option is used. (such as \u{1F3F3}\uFE0F\u200D\u26A7\uFE0F)"
          }
        },
        inbuilt: {
          profile: {
            name: "Profil",
            subtitle: {
              name: "Untertitel"
            },
            pronoun_tip: "Wenn Pronomen an den Anfang gestellt werden, \xE4ndert sich \u201Eaka.\u201C in \u201EPronomen\u201C.",
            country: "Land",
            website: "Website",
            about: "\xDCber mich",
            toggle_preview: {
              name: "Vorschau umschalten",
              bio: "Vorschau deiner biographie f\xFCr andere",
              note: "F\xFCr nicht bleh Benutzer, mehrere Zeilen werden als Leerzeichen und Links angezeigt, Fett- und Kursivschrift wird als einfacher Text angezeigt. Jegliche eingelegte Bilder werden als Text angezeigt."
            },
            banner_tip: "Bilder k\xF6nnen mithilfe von ![](link) eingelegt werden. Du kannst auch ein benutzerdefiniertes Banner mithilfe von ![banner](link) festlegen.",
            avatar: {
              name: "Profilbild bearbeiten",
              upload: "Datei hochladen",
              delete: "Profilbild l\xF6schen"
            }
          },
          charts: {
            name: "Charts",
            recent: {
              count: {
                name: "Tracks to display"
              },
              artwork: {
                name: "Display album artwork"
              },
              realtime: {
                name: "Update tracks in realtime",
                bio: "Your recent tracks will refresh while you are on your profile."
              }
            },
            artists: {
              timeframe: {
                name: "Default timeframe"
              },
              style: {
                name: "Chart style"
              },
              length: {
                name: "Chart size"
              }
            },
            albums: {
              timeframe: {
                name: "Default timeframe"
              },
              style: {
                name: "Chart style"
              },
              length: {
                name: "Chart size"
              }
            },
            tracks: {
              count: {
                name: "Tracks to display"
              },
              timeframe: {
                name: "Default timeframe"
              }
            }
          },
          ignore: {
            name: "Communication",
            consider: {
              name: "To consider",
              good: [
                "You will not see previous or new shouts globally",
                "They cannot direct message you",
                "They cannot leave a shout on your profile or under your shouts anywhere"
              ],
              bad: [
                "You cannot delete pre-existing shouts from your profile",
                "They can still view your profile"
              ]
            },
            view: "View {c} more",
            count: "You have {c} users hidden"
          },
          privacy: {
            name: "Datenschutz",
            recent_listening: {
              name: "Hide your recent listening history",
              bio: "Keep your recent listens a secret o.O"
            },
            receiving_msgs: {
              name: "Control who can interact with you",
              bio: "This setting controls who can post shouts and message you privately.",
              settings: {
                everyone: {
                  name: "Everyone",
                  bio: "Everyone except who you have ignored"
                },
                neighbours: {
                  name: "Who you follow and neighbours",
                  bio: "Everyone who you have chosen to follow, along with your Last.fm neighbours"
                },
                follow: {
                  name: "Who you follow only",
                  bio: "Only users who you have chosen to follow"
                }
              }
            },
            disable_shoutbox: {
              name: "Hide your shoutbox",
              bio: "Your shoutbox will be hidden for you and anyone else."
            }
          }
        },
        actions: {
          import: {
            name: "Import",
            modals: {
              initial: {
                name: "Import settings from a previous install",
                alert: "Anything you import will override your current settings, if you are importing settings from online ensure you trust the source."
              },
              failed: {
                name: "Import failed",
                alert: "The settings you attempted to import failed to parse, no changes were made."
              }
            }
          },
          export: {
            name: "Export",
            modals: {
              initial: {
                name: "Export your current settings",
                alert: "Your current settings are in the textbox below ready for you to copy."
              }
            }
          },
          reset: {
            name: "Zur\xFCcksetzen",
            modals: {
              initial: {
                name: "Reset your settings to default",
                alert: "Your settings will be <strong>reset to all defaults</strong> with no way to go back. Are you sure?",
                confirm: "Yes, reset my settings",
                export: "Export first"
              }
            }
          }
        }
      },
      setup: {
        start: {
          name: "haiii :3 welcome to bleh!!",
          thanks: "Thank you for installing, {m}",
          info: [
            "This is the first-time setup to help you get started with common tasks for new users, which include:",
            "Manage accessibility, such as reduced motion",
            "Configuring your accent colour",
            "Changing your interface theme",
            "Adjusting song corrections and tagging",
            "If you're already set, you can skip."
          ]
        },
        appearance: {
          bio: "Configure the colour of bleh from one of the available presets, or make your own colour combination!",
          subtext: "During seasonal events, the default colour changes automatically."
        }
      },
      gallery: {
        tabs: {
          overview: "Fotos",
          bookmarks: "Saved"
        },
        bookmarks: {
          name: "Saved",
          bio: "Gallery photos can be saved for future reference.",
          no_data: "no images saved (\u30FB\u30FB )",
          link: "Alle favorisierten Bilder ansehen",
          button: {
            image_is_bookmarked: {
              name: "You have saved this image"
            },
            bookmark_this_image: {
              name: "Speichern",
              bio: "Dieses Bild speichern"
            },
            unbookmark_this_image: {
              name: "Unsave",
              bio: "Dieses Bild nicht mehr speichern"
            }
          }
        },
        empty: {
          title: "No title",
          description: "No description"
        },
        prefer: {
          name: "Star"
        },
        report: {
          name: "Melden"
        },
        open: {
          name: "Vergr\xF6\xDFern",
          tooltip: "Dieses Bild auf gesamter Aufl\xF6sung vergr\xF6\xDFern"
        },
        up: "Plusstimmen:",
        down: "Minusstimmen:",
        vote: "This is the sum of votes used for ordering.",
        view: "Fotos anzeigen"
      },
      activities: {
        name: "K\xFCrzliche Aktivit\xE4ten",
        test: "TEST {involved}",
        shout: "Shout hinterlassen",
        image_upload: "Bild hochgeladen",
        image_star: "Bild favorisiert",
        obsess: "Obsessed",
        unobsess: "Nicht mehr obsessed",
        love: "Liebst",
        unlove: "Liebst nicht mehr",
        install_bwaa: "bwaa installiert",
        update_bwaa: "bwaa aktualisiert",
        install_bleh: "bleh installiert",
        update_bleh: "bleh aktualisiert",
        bookmark: "Lesezeichen hinzugef\xFCgt",
        unbookmark: "Lesezeichen entfernt",
        wiki: "Wiki editiert"
      },
      artist: {
        name: "K\xFCnstler",
        plural: "K\xFCnstler",
        tooltip: "Multiple artists are combined into this profile."
      },
      album: {
        name: "Album",
        plural: "Alben"
      },
      track: {
        name: "Titel",
        plural: "Titel"
      },
      tag: {
        name: "Tag"
      },
      search: {
        name: "Suche",
        results_for: "Results for {v}"
      },
      inbox: {
        name: "Inbox",
        overview: "Messages",
        sent_overview: "Messages",
        compose: "Messages",
        message_overview: "Messages",
        sent_message: "Messages",
        notifications: "Notifications"
      },
      charts: {
        name: "Charts",
        overview: "Real time",
        weekly: "Weekly",
        charts_for: "Charts for {date}",
        view: "View the charts",
        scroll: {
          name: "Simulate horizontal scrolling",
          bio: "Disable if you can scroll easily on a laptop for example."
        }
      },
      bookmarks: {
        name: "Bookmarks"
      },
      home: {
        name: "Home",
        welcome: "Welcome back {m}"
      }
    },
    pl: {
      badges: {
        missing: {
          name: "No badges"
        },
        "user-status-subscriber": {
          name: "Last.fm Pro",
          reason: "Active Pro subscription"
        },
        "user-status-staff": {
          name: "Staff",
          reason: "Staff member of Last.fm"
        },
        "label--fade": {
          reason: "They follow you"
        },
        contributor: {
          name: "bleh contributor",
          reason: "Contributed to bleh via code or translations"
        },
        translation: {
          reason: "Translated for a supported language"
        },
        cat: {
          name: "it's a kitty!!"
        },
        sponsor: {
          name: "Sponsoring",
          reason: "Sponsored bleh and bwaa :3"
        },
        cute: {
          reason: "Reserved for special users"
        },
        reserved: {
          reason: "Reserved for certain users"
        }
      },
      avatar_for_me: "Your avatar",
      avatar_for_user: "Avatar for ",
      actions: {
        view_profile: "View profile",
        view_library: "Library",
        leave_a_shout: "Shouts"
      },
      lotus: {
        artist: "Artist corrections have been downloaded!",
        album_track: "Album and track corrections have been downloaded!",
        version: "You are running lotus version {v}.",
        tooltip: "lotus is the community correction system used in bleh and bwaa",
        check: "Check for updates",
        correct: {
          name: "Correct capitalisation",
          tooltip: "Submit name correction",
          tooltip_active: "Active name correction"
        }
      },
      glacier: {
        name: "Library refresh",
        by_artist: " by {a}",
        meta: {
          artists: "Artists",
          albums: "Albums",
          tracks: "Tracks",
          average: "Average"
        },
        view: {
          grid: "Grid",
          list: "List",
          line: "Line",
          pie: "Pie",
          bar: "Bar"
        },
        axis: {
          horizontal: "Horizontal",
          vertical: "Vertical"
        },
        dates: {
          last_year: "Last year",
          this_year: "This year"
        },
        edit: "Edit",
        delete: "Delete",
        love: "Love",
        bulk_edit: "Bulk edit",
        option: {
          name: "Use new graphs in library",
          bio: "This can add a little amount of slow-down in some cases but with the benefit of awesome graphs."
        }
      },
      changelog: {
        name: "What\u2019s New?",
        subtitle: "from {u}",
        type: {
          major: "Major release",
          minor: "Minor release",
          general: "General improvements",
          fix: "Bug fix"
        },
        latest: "Latest",
        view_major: "View latest major release"
      },
      auth_menu: {
        dev: "Prze\u0142\u0105cz tryb deweloperski",
        configure_bleh: "Skonfiguruj bleh",
        library: "Library",
        shouts: "Wiadomo\u015Bci",
        obsessions: "Obsessions",
        labs: "Labs",
        bookmarks: "Bookmarks",
        settings: "Settings",
        logout: "Logout"
      },
      music: {
        submit_lastfm_correction: "Submit correction to Last.fm",
        search_variations: {
          name: "Search",
          tooltip: "Search for variations of this title"
        },
        search_genius: "Search lyrics",
        fetch_plays: {
          name: "Tracklist",
          info: "Sourced from your own plays as an official tracklist is unavailable",
          loading: "Fetching your plays on this album",
          fail: "You do not have any plays on this album",
          open_as_track: "Open album title as a track"
        },
        from_the_album: "From the album: {album}",
        listens: {
          count_listens: "{c} listens",
          loading_listens: "listens",
          other_listeners: "{c} others",
          custom: {
            tooltip: "Pick a user",
            name: "View listens from another user"
          }
        },
        wiki: "About",
        wiki_edit: "edit wiki",
        wiki_read: "read more",
        refresh: "Refresh",
        refresh_tracks: "Refresh tracks",
        menu: "Extra options",
        obsession: "Obsess",
        obsession_first: "First to claim this obsession!",
        compare: {
          name: "Compare",
          header: "Compare plays"
        },
        about: "About",
        about_guests: "Others featured",
        view_profile: "View profile"
      },
      error: {
        name: "This page is missing...",
        go_back: "Go back",
        visit_profile: "Visit profile",
        try_again: "Try again"
      },
      statistics: {
        scrobbles: {
          name: "Twoje scrobble"
        },
        plays: {
          name: "odtworze\u0144"
        }
      },
      profile: {
        name: "Profile",
        on_ignore_list: "Jeste\u015B na li\u015Bcie ignorowanych tego u\u017Cytkownika.",
        friends: {
          name: "Friends"
        },
        display_name: {
          aka: "aka.",
          pronouns: "pronouns"
        },
        created: {
          name: "created",
          replace: "\u2022 scrobbling since "
        },
        edit: "Edit profile",
        obsess: "Obsess",
        message: "Private message",
        shortcut: {
          add: "Add as shortcut",
          remove: "Your profiles are linked!"
        },
        scrobbles: "Scrobbles",
        artists: "Artists",
        loved: "Loved tracks",
        taste: "Taste similarity",
        taste_meter: {
          level: {
            super: "Super",
            very_high: "Very High",
            high: "High",
            medium: "Medium",
            low: "Low",
            very_low: "Very Low",
            unknown: "Unknown"
          },
          you_share_1: "You share {artist}",
          you_share_2: "You share {artist1} and {artist2}",
          you_share_3: "You share {artist1}, {artist2}, and {artist3}"
        },
        open_avatar: "Open in a new tab",
        settings: "Configure",
        events: "Events",
        top_badge: "Top Badge",
        progress: {
          to_go: "{s} scrobbles to go",
          tier: "Tier {t}",
          explain: "For each tier, you unlock a new badge"
        }
      },
      event: {
        name: "Event",
        going: "{c} going",
        maybe: "{c} interested",
        you_know: "Who you know",
        all_time: "All time",
        total: "{c} total"
      },
      messaging: {
        update: "bleh has updated to version {v}!"
      },
      wiki: {
        latest: "View latest version",
        syntax: {
          name: "Use fancy syntax when editing",
          links_to: "Links to {link}"
        },
        presets: {
          name: "Symbol presets"
        }
      },
      settings: {
        name: "Settings",
        save: "Zapisz",
        cancel: "Anuluj",
        close: "Zamknij",
        clear: "Wyczy\u015B\u0107",
        create: "Create",
        add: "Add",
        remove: "Remove",
        done: "Gotowe",
        finish: "Finish",
        continue: "Kontynuuj",
        reset: "Przywr\xF3\u0107 domy\u015Blne",
        go: "Go",
        skip: "Skip",
        back: "Back",
        right_click: "Right-click for more options",
        reload: {
          name: "Refresh pending",
          body: "A setting you changed requires a page refresh to take effect."
        },
        new: "New",
        beta: "Beta",
        configure: "Configure",
        pages: {
          overview: "Profile",
          privacy: "Privacy",
          account_overview: "Account",
          website: "Website",
          subscription_overview: "Pro",
          applications_overview: "Applications"
        },
        examples: {
          button: "Przycisk przyk\u0142adowy"
        },
        skip_to: {
          name: "Skip to"
        },
        home: {
          name: "Strona g\u0142\xF3wna",
          brand: "bleh",
          version: "Wersja {v}",
          recommended: "Zalecane ustawienia",
          issues: {
            name: "Problemy",
            bio: "Zg\u0142o\u015B b\u0142\u0119dy"
          },
          update: {
            name: "Updates",
            css: "Update style",
            bio: "Check now",
            notice: "There are updates available!",
            ignore: "Ignore temporarily",
            update_now: "Update now",
            update_to_v: "Update to {v}"
          },
          setup: {
            name: "Setup",
            bio: "Re-enter setup"
          },
          colours: {
            name: "Kolory",
            bio: "Wybierz sw\xF3j ulubiony!"
          },
          thanks: "Welcome {m}, you are running bleh version {v}.",
          sponsor: {
            name: "Sponsor",
            header: "Sponsor the development of bleh and bwaa",
            bio: "If you feel my work on these projects is worthy of donations you are welcome to sponsor me on GitHub. This is of course optional and bleh will forever be open-source and free.",
            thanks: "Thank you for sponsoring {m}, you are running bleh version {v}.",
            status: {
              yes: "You are a sponsor, thank you!",
              no: "Become a sponsor to get a custom badge",
              badge: "To configure your custom badge, get in touch with me.",
              one_time: "A custom badge is available only when selecting monthly."
            },
            manage: "Manage sponsorship",
            check: "Refresh badges",
            download: "Sponsorship and badge data downloaded!",
            version: "You have version {v} of the sponsorship/badge data downloaded."
          }
        },
        appearance: {
          name: "Appearance"
        },
        themes: {
          name: "Motywy",
          bio: "Wybierz od jasnego do ciemnego.",
          dark: {
            name: "Ciemny",
            bio: "Domy\u015Blna wersja bleh"
          },
          darker: {
            name: "Ciemniejszy",
            bio: "Co\u015B pomi\u0119dzy"
          },
          oled: {
            name: "P\xF3\u0142nocny",
            bio: "Ca\u0142kowita ciemno\u015B\u0107"
          },
          light: {
            name: "Jasny",
            bio: "Ma\u0142o koloru i du\u017Co \u015Bwiat\u0142a"
          },
          classic: {
            name: "Classic",
            bio: "Re-live early computing"
          }
        },
        music: {
          name: "Music",
          header: "Music configuration",
          bio: "Configure your music-related settings for profiles, artists, albums, and tracks.",
          profile_shortcut: {
            name: "Profile shortcut",
            bio: "Quickly access a user's plays on an artist, album, or track page.",
            placeholder: "Profile",
            header: "Enter username",
            saved: "Profile shortcut is valid",
            failed: "Profile does not exist or failed to load"
          },
          show_bulk_edit_album: {
            name: "Show album in chartlists",
            bio: "This is disabled by default as hovering over tracks reveals the album title in all areas",
            require: "Only applicable with the \u2018Last.fm Bulk Edit\u2019 extension"
          },
          grid_glow: {
            name: "Show a glow around grid items"
          }
        },
        accessibility: {
          name: "Accessibility",
          shout_preview: 'jakikolwiek losowy tekst, kt\xF3ry <a href="https://cutensilly.org">nic nie znaczy</a>',
          accessible_name_colours: {
            name: "Preferowane kolory dost\u0119pnej nazwy",
            bio: "U\u017Cyj domy\u015Blnego koloru tekstu nag\u0142\xF3wka zamiast koloru akcentowego."
          },
          underline_links: {
            name: "Zawsze podkre\u015Blaj linki",
            bio: "Podkre\u015Blaj linki do element\xF3w interaktywnych."
          },
          reduced_motion: {
            name: "Reduce animations around interfaces",
            bio: "Will in most cases either slowly fade or hard-cut, no scaling."
          },
          toggle_icon: {
            name: "Add indicator icon to toggles",
            bio: "Display a checkmark or a cross depending on toggle state."
          }
        },
        layout: {
          name: "Layout",
          header: "Manage header layout",
          avatar_action: {
            name: "Default avatar action",
            bio: "What do you want to happen when you click avatars?",
            gallery: "View photos (or featured album for tracks)",
            album: "View featured album"
          },
          quick_artist_button: {
            name: "Quick artist button",
            bio: "Control the right-side button on artist profiles.",
            shouts: "View shouts",
            wiki: "View biography",
            listens: "View listeners"
          }
        },
        customise: {
          name: "Dostosuj",
          colours: {
            name: "Kolory",
            presets: "Ustawienia wst\u0119pne",
            manual: "R\u0119cznie",
            custom: "Stw\xF3rz niestandardowy kolor",
            default_with_season: "Default colour for {season}",
            default: "Default colour",
            modals: {
              custom_colour: {
                preface: "Kolory s\u0105 kontrolowane przez trzy warto\u015Bci: odcie\u0144 (hue), nasycenie (saturation) i jasno\u015B\u0107 (lightness). Przesu\u0144 suwaki, aby dostosowa\u0107 kolor.",
                hue: "Kolor akcentu (hue)",
                sat: "Nasycenie (saturation)",
                lit: "Jasno\u015B\u0107 (lightness)",
                seasonal_alert: "The current season is overriding your accent colour, adjust sliders to disable."
              }
            }
          },
          high_contrast: {
            name: "Enable high contrast mode"
          },
          seasonal: {
            name: "Seasonal",
            timeline: "Seasonal timeline",
            bio: "During seasonal events, bleh can automatically change the default accent colour, add particles, and add overlays to various interface elements.",
            info: "Seasonal events try to match your timezone, for reference we calculated {offset}",
            started: "Started",
            ends_in: "Ends in",
            listing: {
              none: "No active season",
              easter: "Easter",
              pride: "Pride",
              halloween: "Halloween",
              pre_fall: "Pre-Fall",
              fall: "Fall",
              christmas: "Christmas",
              new_years: "New Years"
            },
            option: {
              name: "Enable seasonal event system"
            },
            marker: {
              current: "The current season is {season} for {time}.",
              started: "started {time}",
              none: "There is no active season currently.",
              disabled: "You have seasons disabled, enable to view current event."
            },
            particles: {
              name: "Display particles during select seasons",
              bio: "During winter seasons you get snowflakes!"
            },
            show_less_particles: {
              name: "Display a reduced number of particles"
            },
            fps_particles: {
              name: "Display particles without fancy effects",
              bio: "This might be more demanding on some systems"
            },
            overlays: {
              name: "Display additional seasonal effects",
              bio: "During winter seasons this is used for ice effects, otherwise mainly just gradients."
            },
            announce: "It is now {s}!",
            nonsense: "A Nonsense Christmas",
            fruitcake: "fruitcake",
            mistletoe: "Mistletoe",
            festival: "Christmas Eve",
            exclusive_for_season: 'Exclusive for <span class="season-name">{season}</span>',
            exclusive_for_season_and_more: 'Exclusive for <span class="season-name">{season}</span> and 1 more',
            view: "Open seasonal tab"
          },
          artwork: {
            name: "Ok\u0142adka"
          },
          hue_from_album: {
            name: "Automatically colour album pages",
            bio: "Picks the primary colour from an album cover to paint the page."
          },
          gloss: {
            name: "Nak\u0142adka b\u0142yszcz\u0105ca",
            bio: "Dodaj odblasku do wszystkich ok\u0142adek."
          },
          display: {
            name: "Wy\u015Bwietlacz"
          },
          colourful_counts: {
            name: "U\u017Cyj gradientu kolor\xF3w dla wszystkich czas\xF3w ranking\xF3w",
            bio: "Kolor jest przypisywany na podstawie twojej pozycji w wszechczasowych statystykach artyst\xF3w."
          },
          colourful_tracks: {
            name: "Colour actively scrobbling tracks based on album art",
            bio: "Picks the primary colour from the associated cover to paint the track."
          },
          gendered_tags: {
            name: "Ukryj tagi zwi\u0105zane z p\u0142ci\u0105",
            bio: "Domy\u015Blnie tagi zwi\u0105zane z p\u0142ci\u0105 s\u0105 ukryte w bleh ze wzgl\u0119du na ich nieuporz\u0105dkowan\u0105 i problematyczn\u0105 nature."
          },
          rain: {
            name: "Niech pada!",
            bio: "deszcz :3c (mo\u017Ce wp\u0142ywa\u0107 na wydajno\u015B\u0107!! mo\u017Ce te\u017C wygl\u0105da\u0107 \u017Ale!!)"
          },
          show_your_progress: {
            name: "Show your weekly progress",
            bio: "too many numbers ~w~"
          },
          profile_header: {
            name: "Display profile backgrounds",
            see_type: "Source from avatar instead of top artist",
            view_on: "View backgrounds on",
            for_own: "My own profile",
            for_others: "Other profiles"
          },
          sat_bg: {
            name: "Card background saturation",
            bio: "Control the colour of backgrounds in addition to main accent"
          }
        },
        activities: {
          name: "Activities",
          bio: "Track your most recent activities locally on your profile.",
          toggle: {
            name: "Enable activity tracking",
            bio: "Events will only be registered and displayed while enabled."
          },
          types: {
            shout: "Shouts",
            image: "Image uploads and interactions",
            obsess: "Track obsessions",
            love: "Track love",
            install: "Installing and updating",
            wiki: "Wiki editing"
          }
        },
        performance: {
          name: "Wydajno\u015B\u0107",
          bio: "Napotykasz problemy z \u0142adowaniem motywu? Wypr\xF3buj te ustawienia.",
          dev: {
            name: "Wy\u0142\u0105cz wbudowane \u0142adowanie motywu",
            bio: "Pozwala to na \u0142adowanie wbudowanego motywu za pomoc\u0105 rozszerzenia Stylus, co mo\u017Ce by\u0107 bardziej wydajne.",
            modals: {
              prompt: {
                alert: "Po od\u015Bwie\u017Ceniu strony wbudowany motyw bleh zostanie wy\u0142\u0105czony (chyba \u017Ce ponownie wy\u0142\u0105czysz t\u0119 opcj\u0119).",
                stylus: "Je\u015Bli nie masz jeszcze rozszerzenia <strong>Stylus</strong>, wybierz swoj\u0105 przegl\u0105dark\u0119 poni\u017Cej:",
                browsers: {
                  chrome: {
                    name: "Chrome",
                    bio: "dla Chrome, Edge, Brave, Opera"
                  },
                  firefox: {
                    name: "Firefox",
                    bio: "tylko dla Firefox"
                  }
                }
              },
              continue: {
                next_step: 'Gdy ju\u017C zainstalujesz rozszerzenie, kliknij "Zainstaluj styl" na nowej karcie, kt\xF3ra si\u0119 otworzy.'
              },
              finish: {
                alert: "Gotowe! Od teraz motyw b\u0119dzie obs\u0142ugiwany za pomoc\u0105 Stylus."
              }
            }
          },
          bug: {
            name: "Something wrong?",
            bio: "Report a bug in the bleh repo to get it fixed."
          }
        },
        profiles: {
          name: "Profil",
          bio: "Zarz\u0105dzaj swoimi danymi i danymi zapisanych na innych profilach.",
          notes: {
            name: "Notatki",
            header: "Notatka",
            placeholder: "Wprowad\u017A lokaln\u0105 notatk\u0119 dla tego u\u017Cytkownika",
            edit: "Edytuj notatk\u0119",
            delete: "Usu\u0144 notatk\u0119",
            edit_user: "Edytuj notatk\u0119 dla {u}",
            delete_user: "Usu\u0144 notatk\u0119 dla {u}"
          },
          you: "You"
        },
        redirects: {
          name: "Redirects",
          bio: "Manage last.fm's (not) handy redirection system as best as possible.",
          travis: {
            name: "Hide redirect messages on music pages",
            bio: "No, I didn't mean Travi$ Scott"
          },
          autocorrect: {
            name: "Scrobble auto-correction",
            bio: "By default, last.fm will 'auto-correct' some of your scrobbles using this system. This will make your scrobbles appear as <i>Travis Scott</i> rather than <i>Travi$ Scott</i>, however the redirection system is not fully disabled.",
            action: "Open Settings"
          }
        },
        corrections: {
          name: "Corrections",
          bio: "Manage bleh's in-built correction system for artist, album, and track titles.",
          toggle: {
            name: "Enable the correction system"
          },
          view: {
            name: "View current corrections",
            bio: "Lists all active in your install"
          },
          formatting: "Smart music titles",
          format_guest_features: {
            name: "Formatuj wyst\u0119py i tagi utwor\xF3w",
            bio: "Mniej eksponuje wyst\u0119py i tagi utwor\xF3w (np. Remix, Deluxe Edition, itp.)"
          },
          show_guest_features: {
            name: "Display guest features in title and artist",
            bio: "Turning off will remove from title and prefer artist field."
          },
          stacked_chartlist_info: {
            name: "Stack track name and title",
            bio: "Both matches streaming services and increases max length of each."
          },
          show_remaster_tags: {
            name: "Show remaster tags",
            bio: "Nobody likes remasters (or the tags), if you'd prefer to still listen but remove the annoyance hide them!"
          },
          submit: {
            name: "Submit new correction",
            bio: "Have an artist, album, or track name that you feel is capitalised wrong?",
            action: "Submit"
          },
          listing: {
            artists: "Artists",
            albums_tracks: "Albums and tracks"
          }
        },
        language: {
          name: "Language",
          supported: "Supported by bleh",
          by: "by {users}",
          submit: {
            name: "Are you fluent in another language?",
            bio: "Translations are purely community-contributed.",
            action: "Submit translation"
          }
        },
        text: {
          name: "Text",
          shout_preview_md: 'jakikolwiek <strong>losowy</strong> tekst,<br>kt\xF3ry <a href="https://cutensilly.org">nic nie znaczy</a>',
          shout_preview: "jakikolwiek losowy tekst, kt\xF3ry nic nie znaczy",
          markdown: {
            name: "Use markdown formatting",
            bio: "Enables line-breaks, bold, italics, and links.",
            shouts: "In shouts",
            profile: "In profile bios"
          },
          font: {
            name: "Font settings",
            placeholder: "Font name(s), separated by commas"
          },
          font_weight: {
            name: "Font weight",
            bio: "Used for most regular text"
          },
          font_weight_medium: {
            name: "Medium font weight",
            bio: "Used for bold text"
          },
          font_weight_bold: {
            name: "Bold font weight",
            bio: "Used for larger text such as headers"
          },
          font_emoji: {
            name: "Use compatibility emoji font",
            bio: "On Windows systems prior to 11, the emoji font is majorly outdated unless this option is used. (such as \u{1F3F3}\uFE0F\u200D\u26A7\uFE0F)"
          }
        },
        inbuilt: {
          profile: {
            name: "Profil",
            subtitle: {
              name: "Podtytu\u0142",
              aka: "aka.",
              pronouns: "zaimki"
            },
            pronoun_tip: 'Je\u015Bli zaimki s\u0105 umieszczone jako pierwsze, "aka." zmieni si\u0119 na "zaimki".',
            country: "Kraj",
            website: "Strona internetowa",
            about: "O mnie",
            toggle_preview: {
              name: "Prze\u0142\u0105cz podgl\u0105d",
              bio: "Podgl\u0105d, jak tw\xF3j profil wygl\u0105da dla innych",
              note: "Uwaga: Nowe linie, linki itp. s\u0105 widoczne tylko dla innych u\u017Cytkownik\xF3w bleh, zwykli u\u017Cytkownicy Last.fm widz\u0105 nowe linie jako spacje."
            },
            banner_tip: "Images can be embedded using ![](link). You can also set a custom profile banner with ![banner](link).",
            avatar: {
              name: "Edytuj awatar",
              upload: "Prze\u015Blij plik",
              delete: "Usu\u0144 awatar"
            }
          },
          charts: {
            name: "Rankingi",
            recent: {
              count: {
                name: "Liczba utwor\xF3w do wy\u015Bwietlenia"
              },
              artwork: {
                name: "Wy\u015Bwietl ok\u0142adki album\xF3w"
              },
              realtime: {
                name: "Aktualizuj utwory w czasie rzeczywistym"
              }
            },
            artists: {
              timeframe: {
                name: "Domy\u015Blny przedzia\u0142 czasowy"
              },
              style: {
                name: "Styl rankingu"
              },
              length: {
                name: "Chart size"
              }
            },
            albums: {
              timeframe: {
                name: "Domy\u015Blny przedzia\u0142 czasowy"
              },
              style: {
                name: "Styl rankingu"
              },
              length: {
                name: "Chart size"
              }
            },
            tracks: {
              count: {
                name: "Liczba utwor\xF3w do wy\u015Bwietlenia"
              },
              timeframe: {
                name: "Domy\u015Blny przedzia\u0142 czasowy"
              }
            }
          },
          ignore: {
            name: "Communication",
            consider: {
              name: "To consider",
              good: [
                "You will not see previous or new shouts globally",
                "They cannot direct message you",
                "They cannot leave a shout on your profile or under your shouts anywhere"
              ],
              bad: [
                "You cannot delete pre-existing shouts from your profile",
                "They can still view your profile"
              ]
            },
            view: "View {c} more",
            count: "You have {c} users hidden"
          },
          privacy: {
            name: "Prywatno\u015B\u0107",
            recent_listening: {
              name: "Ukryj histori\u0119 ostatnich ods\u0142uch\xF3w",
              bio: "Zachowaj tajemnic\u0119 swoich ostatnich ods\u0142uch\xF3w o.O"
            },
            receiving_msgs: {
              name: "Kontroluj kto mo\u017Ce si\u0119 z Tob\u0105 zkontaktowa\u0107",
              bio: "To ustawienie kontroluje kto mo\u017Ce wysy\u0142a\u0107 wiadomosci i prywatne wiadomo\u015Bci do ciebie.",
              settings: {
                everyone: {
                  name: "Ka\u017Cdy",
                  bio: "Ka\u017Cdy opr\xF3cz os\xF3b kt\xF3re zosta\u0142y przez ciebie zignorowane"
                },
                neighbours: {
                  name: "Osoby kt\xF3rych obserwujesz i s\u0105siaduj\u0105cy",
                  bio: "Wszyscy kt\xF3rych obserwujesz oraz Twoi s\u0105siedzi na Last.fm"
                },
                follow: {
                  name: "Tylko osoby kt\xF3re obserwujesz",
                  bio: "Tylko u\u017Cytkownicy kt\xF3rych obserwujesz"
                }
              }
            },
            disable_shoutbox: {
              name: "Ukryj sw\xF3j shoutbox",
              bio: "Tw\xF3j shoutbox zostanie ukryty dla ciebie i dla innych u\u017Cytkownik\xF3w."
            }
          }
        },
        actions: {
          import: {
            name: "Importuj",
            modals: {
              initial: {
                name: "Importuj ustawienia z poprzedniej instalacji",
                alert: "Wszystko co zaimportujesz zast\u0105pi twoje bie\u017C\u0105ce ustawienia. Importuj\u0105c ustawienia z internetu upewnij si\u0119 \u017Ce \u017Ar\xF3d\u0142o jest zaufane."
              },
              failed: {
                name: "Import nie powi\xF3d\u0142 si\u0119",
                alert: "Nie uda\u0142o si\u0119 przetworzy\u0107 importowanych ustawie\u0144. \u017Badne zmiany nie zosta\u0142y wprowadzone."
              }
            }
          },
          export: {
            name: "Eksportuj",
            modals: {
              initial: {
                name: "Eksportuj swoje bie\u017C\u0105ce ustawienia",
                alert: "Twoje bie\u017C\u0105ce ustawienia s\u0105 w polu tekstowym poni\u017Cej, gotowe do skopiowania."
              }
            }
          },
          reset: {
            name: "Resetuj",
            modals: {
              initial: {
                name: "Resetuj ustawienia do domy\u015Blnych",
                alert: "Twoje ustawienia zostan\u0105 <strong>zresetowane do domy\u015Blnych</strong> bez mo\u017Cliwo\u015Bci cofni\u0119cia. Czy na pewno chcesz kontynuowa\u0107?",
                confirm: "Tak, resetuj moje ustawienia",
                export: "Eksportuj najpierw"
              }
            }
          }
        }
      },
      gallery: {
        tabs: {
          overview: "Zdj\u0119cia",
          bookmarks: "Zapisane"
        },
        bookmarks: {
          name: "Zapisane",
          bio: "Zdj\u0119cia galerii mo\u017Cna zapisa\u0107 na przysz\u0142o\u015B\u0107.",
          no_data: "brak zapisanych zdj\u0119\u0107 (\u30FB\u30FB )",
          link: "View all saved photos",
          button: {
            image_is_bookmarked: {
              name: "Masz to zdj\u0119cie zapisane"
            },
            bookmark_this_image: {
              name: "Zapisz to zdj\u0119cie",
              bio: "Zapisz to zdj\u0119cie na p\xF3\u017Aniej"
            },
            unbookmark_this_image: {
              name: "Usu\u0144 zapis tego zdj\u0119cia",
              bio: "Usu\u0144 zapis tego zdj\u0119cia"
            }
          }
        },
        empty: {
          title: "No title",
          description: "No description"
        },
        prefer: {
          name: "Star"
        },
        report: {
          name: "Report"
        },
        open: {
          name: "Expand",
          tooltip: "Expand image to full resolution"
        },
        up: "Up votes:",
        down: "Down votes:",
        vote: "This is the sum of votes used for ordering."
      },
      activities: {
        name: "Recent Activity",
        test: "TEST {involved}",
        shout: "You left a shout for {i}",
        image_upload: "You uploaded an image for {i}",
        image_star: "You starred an image for {i}",
        obsess: "You\u2019re obsessed with {i}",
        unobsess: "You\u2019re no longer obsessed with {i}",
        love: "You love {i}",
        unlove: "You no longer love {i}",
        install_bwaa: "You installed bwaa",
        update_bwaa: "You updated bwaa to {i}",
        install_bleh: "You installed bleh",
        update_bleh: "You updated bleh to {i}",
        bookmark: "You bookmarked {i}",
        unbookmark: "You removed {i}\u2019s bookmark",
        wiki: "You edited on {i}"
      },
      artist: {
        name: "Artist",
        plural: "Artists",
        tooltip: "Multiple artists are combined into this profile."
      },
      album: {
        name: "Album",
        plural: "Albums"
      },
      track: {
        name: "Track",
        plural: "Tracks"
      },
      tag: {
        name: "Tag"
      },
      search: {
        name: "Search",
        results_for: "Results for {v}"
      },
      inbox: {
        name: "Inbox",
        overview: "Messages",
        sent_overview: "Messages",
        compose: "Messages",
        message_overview: "Messages",
        sent_message: "Messages",
        notifications: "Notifications"
      },
      charts: {
        name: "Charts",
        overview: "Real time",
        weekly: "Weekly",
        charts_for: "Charts for {date}",
        view: "View the charts",
        scroll: {
          name: "Simulate horizontal scrolling",
          bio: "Disable if you can scroll easily on a laptop for example."
        }
      },
      bookmarks: {
        name: "Bookmarks"
      },
      home: {
        name: "Home",
        welcome: "Welcome back {m}"
      }
    }
  };
  moment.updateLocale("de", {
    relativeTime: {
      future: "in %s",
      past: "vor %s",
      s: "ein paar Sekunden",
      ss: "%d Sekunden",
      m: "eine Minute",
      mm: "%d Minuten",
      h: "eine Stunde",
      hh: "%d Stunden",
      d: "ein Tag",
      dd: "%d Tagen",
      w: "eine Woche",
      ww: "%d Wochen",
      M: "im Monat",
      MM: "%d Monate",
      y: "ein Jahr",
      yy: "%d Jahre"
    }
  });
  function tl(key) {
    if (!key) {
      log("your key is undefined", "trans");
      return "NO_TRANSLATION_FOUND";
    }
    if (key[lang])
      return key[lang];
    log(`no translation found for ${JSON.stringify(key)}`, "trans");
    return key.en;
  }
  function lookup_lang() {
    const troot = document.querySelector(".masthead-logo a");
    console.log(troot);
    if (!troot) {
      handle_error_500();
      return;
    }
    console.log(troot.getAttribute("href"));
    setRoot(troot.getAttribute("href"));
    let previous_avi = auth.avatar;
    if (auth_link.state) {
      auth.avatar = auth_link.state.querySelector("img").getAttribute("src");
      if (auth.avatar != previous_avi) {
        let avatar = auth_link.state.querySelector("img");
        avatar.setAttribute("crossorigin", "anonymous");
        try {
          avatar.addEventListener("load", function() {
            let thief = new ColorThief();
            let colour = thief.getColor(avatar);
            let hsl = rgb_to_hsl(colour[0], colour[1], colour[2]);
            auth.sets.hue = hsl.h;
            auth.sets.sat = clamp_sat(hsl.s / 100 * 3);
            auth.sets.lit = 1;
          });
        } catch (e) {
        }
      }
    }
    lang = document.documentElement.getAttribute("lang");
    non_override_lang = lang;
    if (!valid_langs.includes(lang)) {
      log(`language fallback from ${lang} to en - not supported`, "trans");
      lang = "en";
    }
    moment.locale(lang);
  }

  // src/build/seasonal.js
  var seasonal_timer = {
    state: void 0
  };
  var stored_season = {
    id: "none",
    new_years_eve: false
  };
  var seasonal_events = [
    {
      id: "new_years",
      start: "y0-01-01T00:00:00{offset}",
      end: "y0-01-14T23:59:59{offset}",
      snowflakes: {
        state: true,
        count: 90
      }
    },
    {
      id: "easter",
      start: "y0-04-02T00:00:00{offset}",
      end: "y0-04-30T23:59:59{offset}",
      snowflakes: {
        state: false
      }
    },
    {
      id: "pride",
      start: "y0-05-31T00:00:00{offset}",
      end: "y0-07-07T23:59:59{offset}",
      snowflakes: {
        state: false
      }
    },
    {
      id: "halloween",
      start: "y0-09-22T00:00:00{offset}",
      end: "y0-11-01T11:59:59{offset}",
      snowflakes: {
        state: false
      }
    },
    {
      id: "pre_fall",
      start: "y0-11-01T12:00:00{offset}",
      end: "y0-11-12T23:59:59{offset}",
      snowflakes: {
        state: true,
        count: 12
      }
    },
    {
      id: "fall",
      start: "y0-11-13T00:00:00{offset}",
      end: "y0-11-22T23:59:59{offset}",
      snowflakes: {
        state: true,
        count: 40
      }
    },
    {
      id: "christmas",
      start: "y0-11-23T00:00:00{offset}",
      end: "y0-12-31T23:59:59{offset}",
      snowflakes: {
        state: true,
        count: 160
      }
    }
  ];

  // src/build/sponsor.js
  var cute = ["cutensilly", "stellasaur", "kateshapedbox"];
  var sponsor_list = {};

  // src/components/dialog.js
  function load_dialogs() {
    let dialogs2 = document.createElement("div");
    dialogs2.classList.add("bleh-modals");
    document.body.appendChild(dialogs2);
    page.structure.dialogs = dialogs2;
  }
  function dialog({
    id = "",
    title = null,
    subtitle = null,
    body = document.createElement("div").innerHTML,
    dismiss = true,
    type = "",
    has_overlays = true,
    replace = false,
    replace_if_possible = false,
    replace_id = "",
    allow_scroll = false
  }) {
    log(`creating ${id}`, "window", "info", {
      id,
      title,
      subtitle,
      body,
      dismiss,
      type,
      has_overlays,
      replace,
      replace_id,
      allow_scroll
    });
    let modal;
    if (replace_if_possible && Object.keys(dialogs).length > 0) {
      replace = true;
      for (let dialog2 in dialogs) {
        replace_id = dialog2;
        break;
      }
    }
    if (!replace || replace && !dialogs.hasOwnProperty(replace_id)) {
      modal = document.createElement("div");
      modal.classList.add("bleh-modal");
    } else {
      log(`window set to replace ${replace_id}`, "window");
      modal = dialogs[replace_id].instance;
      delete dialogs[replace_id];
      modal.innerHTML = "";
    }
    modal.setAttribute("data-modal-id", id);
    modal.setAttribute("data-modal-has-overlays", has_overlays);
    if (type != "")
      modal.setAttribute("data-modal-type", type);
    if (title != null) {
      let modal_title = document.createElement("div");
      modal_title.classList.add("bleh-modal-title");
      modal_title.innerHTML = `
            <h1>${title}</h1>
            ${subtitle != null ? `<p class="bleh-modal-subtitle">${subtitle}</p>` : ""}
        `;
      modal.appendChild(modal_title);
    }
    if (dismiss) {
      let modal_close = document.createElement("button");
      modal_close.classList.add("modal-close-button");
      modal_close.setAttribute("onclick", `_dialog_rm({id: "${id}"})`);
      modal.appendChild(modal_close);
      page.structure.dialogs.setAttribute("onclick", "_dialog_rm({all: true, modal_bg: true})");
    } else {
      page.structure.dialogs.removeAttribute("onclick");
    }
    let modal_body = document.createElement("div");
    modal_body.classList.add("bleh-modal-body");
    modal_body.setAttribute("data-allow-scroll", allow_scroll);
    modal_body.innerHTML = body;
    modal.appendChild(modal_body);
    dialogs[id] = {
      instance: modal
    };
    page.structure.dialogs.appendChild(modal);
    page.structure.dialogs.classList.add("has-dialog");
    return modal;
  }
  unsafeWindow._dialog_rm = function({
    id = null,
    all = false,
    modal_bg = false
  }) {
    dialog_rm({
      id,
      all,
      modal_bg
    });
  };
  function dialog_rm({
    id = null,
    all = false,
    modal_bg = false
  }) {
    if (all) {
      if (modal_bg) {
        console.log(event);
        if (event.target.classList[0] != "bleh-modals")
          return;
      }
      log("requested kill all", "window");
      console.info(dialogs);
      for (let dialog2 in dialogs) {
        dialog_rm({
          id: dialog2
        });
      }
      return;
    }
    if (id == null)
      return;
    if (page.structure.dialogs == null)
      return;
    if (dialogs.hasOwnProperty(id)) {
      let dialog2 = dialogs[id];
      if (!page.structure.dialogs.contains(dialog2.instance))
        return;
      log(`queuing ${id} to kill`, "window");
      dialog2.instance.classList.add("to-remove");
      setTimeout(function() {
        page.structure.dialogs.removeChild(dialog2.instance);
      }, 400);
      delete dialogs[id];
      if (JSON.stringify(dialogs) == "{}") {
        page.structure.dialogs.classList.remove("has-dialog");
      }
    }
  }
  function dialog_legacy(id, title, inner_content, dismiss = false, classname = "", allow_scroll = false) {
    log(`created ${id} - '${title}'`, "window", "info", { content: [inner_content], dismiss, classname });
    let background = document.createElement("div");
    background.classList.add("popup_background");
    background.setAttribute("id", `bleh--window-${id}--background`);
    background.style = "opacity: 0.8; visibility: visible; background-color: rgb(0, 0, 0); position: fixed; inset: 0px;";
    background.setAttribute("data-kate-processed", "true");
    let wrapper = document.createElement("div");
    wrapper.classList.add("popup_wrapper", "popup_wrapper_visible");
    wrapper.setAttribute("id", `bleh--window-${id}--wrapper`);
    wrapper.style = "opacity: 1; visibility: visible; position: fixed; overflow: auto; width: 100%; height: 100%; top: 0px; left: 0px; text-align: center;";
    wrapper.setAttribute("data-kate-processed", "true");
    let dialog2 = document.createElement("div");
    dialog2.classList.add("modal-dialog");
    dialog2.setAttribute("id", `bleh--window-${id}--dialog`);
    dialog2.style = "opacity: 1; visibility: visible; pointer-events: auto; display: inline-block; outline: none; text-align: left; position: relative; vertical-align: middle;";
    dialog2.setAttribute("data-kate-processed", "true");
    if (classname != "")
      dialog2.classList.add(`modal-dialog--${classname}`);
    let content = document.createElement("div");
    content.classList.add("modal-content");
    content.setAttribute("id", `bleh--window-${id}--content`);
    content.setAttribute("data-kate-processed", "true");
    if (dismiss) {
      let actions = document.createElement("div");
      actions.classList.add("modal-actions");
      actions.setAttribute("id", `bleh--window-${id}--actions`);
      actions.setAttribute("data-kate-processed", "true");
      background.setAttribute("onclick", `_kill_window('${id}')`);
      actions.innerHTML = `
            <div class="modal-buttons">
                <button class="modal-action-button modal-dismiss" onclick="_kill_window('${id}')">
                    ${trans_legacy[lang].settings.close}
                </button>
            </div>
        `;
      content.insertBefore(actions, content.firstElementChild);
    }
    let share = document.createElement("div");
    share.classList.add("modal-share-content");
    share.setAttribute("id", `bleh--window-${id}--share`);
    share.setAttribute("data-kate-processed", "true");
    let body = document.createElement("div");
    body.classList.add("modal-body");
    body.setAttribute("id", `bleh--window-${id}--body`);
    body.setAttribute("data-kate-processed", "true");
    if (classname != "")
      body.classList.add(`modal--${classname}`);
    let header = document.createElement("h2");
    header.classList.add("modal-title");
    header.innerHTML = title;
    header.setAttribute("data-kate-processed", "true");
    let inner_content_em = document.createElement("div");
    inner_content_em.classList.add("modal-inner-content");
    inner_content_em.innerHTML = inner_content;
    inner_content_em.setAttribute("data-kate-processed", "true");
    if (allow_scroll)
      inner_content_em.classList.add("allow-scroll");
    let align = document.createElement("div");
    align.classList.add("popup_align");
    align.setAttribute("id", `bleh--window-${id}--align`);
    align.style = "display: inline-block; vertical-align: middle; height: 100%;";
    align.setAttribute("data-kate-processed", "true");
    body.appendChild(header);
    body.appendChild(inner_content_em);
    share.appendChild(body);
    content.appendChild(share);
    dialog2.appendChild(content);
    wrapper.appendChild(dialog2);
    wrapper.appendChild(align);
    document.body.appendChild(background);
    document.body.appendChild(wrapper);
    return wrapper;
  }
  function kill_window(id, replacing = false) {
    try {
      if (replacing) {
        log(`killed ${id}`, "window");
        document.body.removeChild(document.getElementById(`bleh--window-${id}--background`));
        document.body.removeChild(document.getElementById(`bleh--window-${id}--wrapper`));
      } else {
        log(`queuing ${id} to kill`, "window");
        let background = document.getElementById(`bleh--window-${id}--background`);
        let window2 = document.getElementById(`bleh--window-${id}--wrapper`);
        background.classList.add("window-removing");
        window2.classList.add("window-removing");
        setTimeout(function() {
          document.body.removeChild(background);
          document.body.removeChild(window2);
        }, 270);
      }
    } catch (e) {
      log(`kill failed, ${id} does not exist`, "window");
    }
  }
  unsafeWindow._kill_window = function(id) {
    kill_window(id);
  };

  // src/components/notify.js
  function load_notifications() {
    let prev_notif = document.getElementById("bleh-notifications");
    if (prev_notif == null) {
      let notifs = document.createElement("div");
      notifs.classList.add("bleh-notifications");
      page.structure.notifications = notifs;
      document.body.appendChild(notifs);
    }
  }
  function deliver_notif(content, persist = false, has_icon = false, append_class = "", action = "") {
    let notif = document.createElement("button");
    notif.classList.add("bleh-notification");
    notif.setAttribute("onclick", "_kill_notif(this)");
    notif.textContent = content;
    page.structure.notifications.appendChild(notif);
    if (has_icon)
      notif.classList.add("btn--has-icon");
    if (append_class != "")
      notif.classList.add(append_class);
    if (action != "")
      notif.setAttribute("onclick", action);
    if (persist)
      return;
    setTimeout(function() {
      kill_notif(notif);
    }, 3500);
  }
  unsafeWindow._notify = function({
    title = null,
    body = null,
    icon = null,
    classname = null,
    action = null,
    persist = false,
    type = type
  }) {
    notify({
      title,
      body,
      icon,
      classname,
      action,
      persist,
      type
    });
  };
  function notify({
    id = null,
    title = null,
    body = null,
    icon = null,
    classname = null,
    action = null,
    persist = false,
    type = "generic"
  }) {
    log(`creating ${title}`, "notification", "info", {
      id,
      title,
      body,
      icon,
      classname,
      action,
      persist,
      type
    });
    let notif = document.createElement("button");
    notif.classList.add("bleh-notification");
    notif.setAttribute("data-type", type);
    notif.setAttribute("onclick", "_notify_rm(this)");
    if (!body) {
      notif.innerHTML = `
            <div class="notification-title margin-below">${title}</div>
        `;
    } else {
      notif.innerHTML = `
            <div class="notification-title">${title}</div>
            <div class="notification-body margin-below">${body}</div>
        `;
    }
    page.structure.notifications.appendChild(notif);
    if (type == "error")
      icon = "icon-16-x";
    if (!icon)
      icon = "icon-16-info";
    if (icon) {
      notif.classList.add("icon");
      notif.style.setProperty("--mask", `var(--${icon})`);
    }
    if (classname)
      notif.classList.add(classname);
    if (action)
      notif.setAttribute("onclick", action);
    if (persist)
      return;
    let bar = document.createElement("div");
    bar.classList.add("notification-progress");
    notif.appendChild(bar);
    setTimeout(function() {
      bar.style.setProperty("left", "100%");
    }, 1);
    setTimeout(function() {
      notify_rm(notif);
    }, 1e4);
  }
  unsafeWindow._notify_rm = function(notif) {
    notify_rm(notif);
  };
  function notify_rm(notif) {
    notif.classList.add("fade-out");
    setTimeout(function() {
      page.structure.notifications.removeChild(notif);
    }, 400);
  }
  unsafeWindow._kill_notif = function(notif) {
    kill_notif(notif);
  };
  function kill_notif(notif) {
    notify_rm(notif);
  }

  // src/sku.js
  function ff(flag) {
    log(`parsing ${flag}`, "flag", "log", {
      setting: settings.feature_flags[flag],
      sku: version.feature_flags[flag]
    });
    if (settings.feature_flags[flag] != null)
      return settings.feature_flags[flag];
    if (version.feature_flags[flag] != null)
      return version.feature_flags[flag].default;
  }

  // src/pages/glacier.js
  function bleh_user_library() {
    let date_items = page.structure.side.querySelectorAll(":scope > :is(div, figure)");
    let date_panel = document.createElement("section");
    date_panel.classList.add("date-panel");
    date_panel.setAttribute("data-glacier-graphs", settings.glacier_library_graphs);
    date_items.forEach((item, index) => {
      date_panel.appendChild(item);
      if (index == 0)
        page.structure.glacier.selector = item;
    });
    page.structure.side.appendChild(date_panel);
    page.structure.glacier.date_panel = date_panel;
    if (!ff("glacier_library"))
      return;
    if (settings.glacier_library_graphs) {
      let chart_view_selector = document.createElement("div");
      chart_view_selector.classList.add("view-buttons", "chart-view-selector", "view-buttons-middle");
      chart_view_selector.innerHTML = `
            <button class="btn view-item" id="toggle-chart_view-line" data-toggle="chart_view" data-toggle-value="line" onclick="_update_item('chart_view', 'line')">
                ${trans_legacy[lang].glacier.view.line}
            </button>
            <button class="btn view-item" id="toggle-chart_view-pie" data-toggle="chart_view" data-toggle-value="pie" onclick="_update_item('chart_view', 'pie')">
                ${trans_legacy[lang].glacier.view.pie}
            </button>
            <button class="btn view-item" id="toggle-chart_view-bar" data-toggle="chart_view" data-toggle-value="bar" onclick="_update_item('chart_view', 'bar')">
                ${trans_legacy[lang].glacier.view.bar}
            </button>
        `;
      page.structure.glacier.selector.after(chart_view_selector);
      let chart_axis_selector = document.createElement("div");
      chart_axis_selector.classList.add("view-buttons", "chart-axis-selector", "view-buttons-middle");
      chart_axis_selector.innerHTML = `
            <button class="btn view-item" id="toggle-chart_bar_axis-horizontal" data-toggle="chart_bar_axis" data-toggle-value="horizontal" onclick="_update_item('chart_bar_axis', 'horizontal')">
                ${trans_legacy[lang].glacier.axis.horizontal}
            </button>
            <button class="btn view-item" id="toggle-chart_bar_axis-vertical" data-toggle="chart_bar_axis" data-toggle-value="vertical" onclick="_update_item('chart_bar_axis', 'vertical')">
                ${trans_legacy[lang].glacier.axis.vertical}
            </button>
        `;
      chart_view_selector.after(chart_axis_selector);
      refresh_all(page.structure.glacier.date_panel);
    }
    bleh_glacier_library_date();
    if (page.subpage == "library_overview") {
      bleh_glacier_library_top(true);
      page.state.glacier.insights = {
        artist: {
          display: false,
          values: [],
          labels: [],
          highest: {
            value: 0,
            label: "",
            link: "",
            img: ""
          }
        },
        album: {
          display: false,
          values: [],
          labels: [],
          highest: {
            value: 0,
            label: "",
            link: "",
            img: ""
          }
        },
        track: {
          display: false,
          values: [],
          labels: [],
          highest: {
            value: 0,
            label: "",
            link: "",
            img: ""
          }
        }
      };
    }
    if (page.subpage == "library_overview" || page.subpage.startsWith("library_artist_") || page.subpage.startsWith("library_album_") || page.subpage.startsWith("library_track_")) {
      log("refresh is now marked true", "glacier library");
      page.structure.glacier.refresh = true;
      bleh_glacier_date_graph(true);
    }
    if (page.subpage.startsWith("library_artist_") || page.subpage.startsWith("library_album_") || page.subpage.startsWith("library_track_")) {
      bleh_glacier_library_focused();
    }
  }
  function bleh_glacier_library_date() {
    let picker_content = page.structure.glacier.date_panel.querySelector(".date-range-picker-content:not([data-glacier-library-date])");
    if (picker_content == null)
      return;
    picker_content.setAttribute("data-glacier-library-date", "true");
    let picker_presets = picker_content.querySelector(".date-range-picker-presets-wrap");
    let picker_col_2 = picker_content.querySelector(".date-range-picker-presets--col-2");
    let new_wrap = document.createElement("div");
    new_wrap.classList.add("date-range-picker-presets-wrap");
    let new_presets = document.createElement("ul");
    new_presets.classList.add("date-range-picker-presets");
    let params = new URLSearchParams(document.location.search);
    page.requested.from = params.get("from");
    page.requested.to = params.get("to");
    page.requested.rangetype = params.get("rangetype");
    let current_year = (/* @__PURE__ */ new Date()).getFullYear();
    let previous_year = current_year - 1;
    if (current_year >= 2025) {
      new_presets.classList.add("date-range-picker-presets-2");
      let last_year = document.createElement("div");
      last_year.classList.add("date-range-picker-preset", "date-range-picker-preset-custom", "date-range-picker-preset-last-year");
      last_year.innerHTML = `
            <a href="${window.location.href.replace(window.location.search, "")}?from=${previous_year}-01-01&rangetype=year">
                ${previous_year}
            </a>
        `;
      new_presets.appendChild(last_year);
      let this_year = document.createElement("div");
      this_year.classList.add("date-range-picker-preset", "date-range-picker-preset-custom", "date-range-picker-preset-this-year");
      this_year.innerHTML = `
            <a href="${window.location.href.replace(window.location.search, "")}?from=${current_year}-01-01&rangetype=year">
                ${current_year}
            </a>
        `;
      new_presets.appendChild(this_year);
      if (page.requested.from == `${current_year}-01-01` && (page.requested.to == `${current_year}-12-31` || page.requested.rangetype == "year"))
        this_year.classList.add("date-range-picker-preset--selected");
      else if (page.requested.from == `${previous_year}-01-01` && (page.requested.to == `${previous_year}-12-31` || page.requested.rangetype == "year"))
        last_year.classList.add("date-range-picker-preset--selected");
    } else {
      new_presets.classList.add("date-range-picker-presets-wide");
      let this_year = document.createElement("div");
      this_year.classList.add("date-range-picker-preset", "date-range-picker-preset-custom", "date-range-picker-preset-this-year");
      this_year.innerHTML = `
            <a href="${window.location.href.replace(window.location.search, "")}?from=${current_year}-01-01&rangetype=year">
                ${current_year}<span class="new-badge">${trans_legacy[lang].settings.new}</span>
            </a>
        `;
      new_presets.appendChild(this_year);
      if (page.requested.from == `${current_year}-01-01` && (page.requested.to == `${current_year}-12-31` || page.requested.rangetype == "year"))
        this_year.classList.add("date-range-picker-preset--selected");
    }
    new_wrap.appendChild(new_presets);
    picker_presets.after(new_wrap);
  }
  function bleh_glacier_library() {
    bleh_glacier_library_table();
    bleh_glacier_library_top();
    bleh_glacier_date_graph();
  }
  function bleh_glacier_library_table() {
    if (!ff("glacier_library"))
      return;
    let table = page.structure.glacier.date_panel.querySelector(".highcharts-root");
    if (table == null)
      return;
    console.log("glacier library", table);
    log("refresh is now marked false (table log)", "glacier library");
    page.structure.glacier.refresh = false;
    let current_view = page.structure.glacier.date_panel.querySelector(".date-range-picker-button-inner");
    if (current_view == null) {
      console.log("glacier library current view", page.structure.glacier.date_panel.innerHTML);
      log("returned as current view is null", "glacier library");
      log("refresh is now marked true", "glacier library");
      page.structure.glacier.refresh = true;
      return;
    }
    if (table.hasAttribute("data-glacier-library-table"))
      return;
    table.setAttribute("data-glacier-library-table", "true");
    page.structure.glacier.table = table;
    log("refresh is now marked true (table found)", "glacier library");
    page.structure.glacier.refresh = true;
    log("pending refresh", "glacier library");
  }
  function bleh_glacier_library_top(static_page = false) {
    if (!ff("glacier_library"))
      return;
    let legacy_top_header;
    if (!static_page)
      legacy_top_header = page.structure.main.querySelector(".library-top");
    else
      legacy_top_header = page.structure.main.querySelector(".metadata-list");
    if (legacy_top_header == null)
      return;
    legacy_top_header.classList.add("glacier-legacy-top-header");
    if (!static_page) {
      if (legacy_top_header.style.getPropertyValue("display")) {
        legacy_top_header.removeAttribute("data-glacier-library-top");
        return;
      }
      if (legacy_top_header.hasAttribute("data-glacier-library-top"))
        return;
      legacy_top_header.setAttribute("data-glacier-library-top", "true");
    }
    log("loading top", "glacier library");
    let metadata = legacy_top_header.querySelectorAll(".metadata-item");
    let first_run = false;
    let glacier_top = page.structure.glacier.top;
    if (glacier_top == null || !page.structure.main.contains(glacier_top))
      first_run = true;
    if (first_run) {
      glacier_top = document.createElement("section");
      glacier_top.classList.add("glacier-library-top");
    }
    let glacier_meta;
    if (first_run) {
      glacier_meta = document.createElement("div");
      glacier_meta.classList.add("glacier-library-metadata");
    } else {
      glacier_meta = page.structure.glacier.top.querySelector(".glacier-library-metadata");
      glacier_meta.innerHTML = "";
    }
    metadata.forEach((meta, index) => {
      let text = meta.querySelector(".metadata-title").textContent;
      if (page.subpage == "library_overview") {
        if (index == 1)
          text = trans_legacy[lang].glacier.meta.average;
      } else if (page.subpage == "library_artists") {
        text = trans_legacy[lang].glacier.meta.artists;
      } else if (page.subpage == "library_albums") {
        text = trans_legacy[lang].glacier.meta.albums;
      } else if (page.subpage == "library_tracks") {
        text = trans_legacy[lang].glacier.meta.tracks;
      }
      let glacier_meta_item = document.createElement("div");
      glacier_meta_item.classList.add("glacier-library-metadata-item");
      glacier_meta_item.innerHTML = `
            <div class="sub-text">${text}</div>
            <div class="glacier-library-metadata-item-value">${meta.querySelector(".metadata-display").textContent}</div>
        `;
      glacier_meta.appendChild(glacier_meta_item);
    });
    if (first_run)
      glacier_top.appendChild(glacier_meta);
    if (!first_run)
      return;
    let top_wrap = page.structure.main.querySelector(".library-top-wrap");
    let view_buttons = document.createElement("div");
    view_buttons.classList.add("view-buttons", "glacier-library-buttons");
    let add_divider = false;
    let sort = legacy_top_header.querySelector(".library-sort");
    if (!static_page) {
      let sort_button;
      if (sort != null) {
        sort_button = sort.querySelector(".dropdown-menu-clickable-button");
        add_divider = true;
        if (sort_button != null) {
          sort_button.classList.add("btn", "view-item", "glacier-library-button");
          let sort_menu = sort.querySelector(".dropdown-menu-clickable");
          view_buttons.appendChild(sort_button);
          view_buttons.appendChild(sort_menu);
        }
      }
    }
    if (!static_page && page.subpage != "library_tracks") {
      let format_button = document.createElement("button");
      format_button.classList.add("btn", "view-item", "glacier-library-button", "glacier-view-button");
      format_button.setAttribute("onclick", "_update_glacier_view()");
      page.structure.glacier.format = format_button;
      add_divider = true;
      if (top_wrap.getAttribute("data-current-format") == "grid") {
        format_button.setAttribute("data-glacier-view", "grid");
        format_button.textContent = trans_legacy[lang].glacier.view.grid;
      } else {
        format_button.setAttribute("data-glacier-view", "list");
        format_button.textContent = trans_legacy[lang].glacier.view.list;
      }
      view_buttons.appendChild(format_button);
    }
    if (!static_page && add_divider) {
      let listen_divider = document.createElement("div");
      listen_divider.classList.add("listen-divider");
      view_buttons.appendChild(listen_divider);
    }
    let configure_button = document.createElement("button");
    configure_button.classList.add("btn", "view-item", "glacier-library-button", "glacier-configure-button", "panel-settings-button");
    configure_button.textContent = trans_legacy[lang].settings.configure;
    tippy(configure_button, {
      content: trans_legacy[lang].settings.configure
    });
    tippy(configure_button, {
      theme: "window",
      content: `
            <div class="dialog-settings">
                <div class="toggle-container" id="container-format_guest_features" onclick="_update_item('format_guest_features')">
                    <button class="btn reset" onclick="_reset_item('format_guest_features')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.format_guest_features.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.format_guest_features.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-format_guest_features" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container hide-if-format-guest-disabled" id="container-show_guest_features" onclick="_update_item('show_guest_features')">
                    <button class="btn reset" onclick="_reset_item('show_guest_features')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.show_guest_features.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.show_guest_features.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-show_guest_features" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-stacked_chartlist_info" onclick="_update_item('stacked_chartlist_info')">
                    <button class="btn reset" onclick="_reset_item('stacked_chartlist_info')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.stacked_chartlist_info.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.stacked_chartlist_info.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-stacked_chartlist_info" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="toggle-container" id="container-grid_glow" onclick="_update_item('grid_glow')">
                    <button class="btn reset" onclick="_reset_item('grid_glow')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.music.grid_glow.name}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-grid_glow" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-glacier_library_graphs" onclick="_update_item('glacier_library_graphs')">
                    <button class="btn reset" onclick="_reset_item('glacier_library_graphs')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].glacier.option.name}</h5>
                        <p>${trans_legacy[lang].glacier.option.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-glacier_library_graphs" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
        `,
      allowHTML: true,
      placement: "bottom",
      interactive: true,
      interactiveBorder: 10,
      trigger: "click",
      onShow(instance) {
        refresh_all(instance.popper);
      }
    });
    view_buttons.appendChild(configure_button);
    glacier_top.appendChild(view_buttons);
    page.structure.glacier.top = glacier_top;
    page.structure.main.insertBefore(glacier_top, page.structure.main.firstElementChild);
  }
  unsafeWindow._update_glacier_view = function() {
    let format = page.structure.main.querySelector(".library-view-button");
    if (format == null)
      return;
    format.click();
    if (format.getAttribute("href") && format.getAttribute("href").endsWith("reset")) {
      page.structure.glacier.format.setAttribute("data-glacier-view", "list");
      page.structure.glacier.format.textContent = trans_legacy[lang].glacier.view.list;
    } else {
      page.structure.glacier.format.setAttribute("data-glacier-view", "grid");
      page.structure.glacier.format.textContent = trans_legacy[lang].glacier.view.grid;
    }
  };
  function bleh_glacier_date_graph(static_page = false, own_table = null) {
    if (!page.structure.glacier.refresh)
      return;
    if (!settings.glacier_library_graphs)
      return;
    log("reviewing graph situation", "glacier library");
    if (own_table != null) {
      log("table has been passed to function (from network request presumably?)", "glacier library", "info", own_table);
    } else {
      log("no table has been passed, must source ourselves", "glacier library");
    }
    bleh_glacier_library_date();
    let current_view = page.structure.glacier.date_panel.querySelector(".date-range-picker-button-inner");
    if (!current_view)
      return;
    current_view = current_view.textContent.trim();
    let tab_matches;
    if ((page.subpage == "library_overview" || page.subpage == "library_artists" || page.subpage == "library_albums" || page.subpage == "library_tracks") && (page.state.glacier.current_tab == "library_overview" || page.state.glacier.current_tab == "library_artists" || page.state.glacier.current_tab == "library_albums" || page.state.glacier.current_tab == "library_tracks"))
      tab_matches = true;
    if (page.state.glacier.current_view == current_view && own_table == null && tab_matches) {
      bleh_glacier_date_graph_generate();
      log("refresh is now marked false", "glacier library");
      page.structure.glacier.refresh = false;
      log(`returned as view (${current_view}) matches ${page.state.glacier.current_view}. last tab was ${page.state.glacier.current_tab} and current tab is ${page.subpage}`, "glacier library");
      return;
    }
    page.state.glacier.current_view = current_view;
    let scrobble_chart_content = page.structure.side.querySelector("#scrobble-chart-content");
    if (scrobble_chart_content.getAttribute("data-highcharts-chart") && scrobble_chart_content.getAttribute("data-highcharts-chart") == "0") {
      log("highchart registered", "glacier library");
      log("refresh is now marked false", "glacier library");
      page.structure.glacier.refresh = false;
      return;
    }
    let scrobble_chart_wrap = page.structure.side.querySelector(".scrobble-table");
    if (scrobble_chart_wrap == null)
      return;
    let scrobble_table;
    if (own_table != null)
      scrobble_table = own_table;
    else
      scrobble_table = scrobble_chart_wrap.querySelector(".table");
    if (scrobble_table == null) {
      let request_url;
      if (window.location.search == "")
        request_url = `${window.location.href}/chart?ajax=1`;
      else
        request_url = window.location.href.replace(window.location.search, `/chart${window.location.search}&ajax=1`);
      bleh_glacier_library_request(request_url);
      return;
    }
    let chart_type = scrobble_table.getAttribute("data-bucket-size");
    let entries = scrobble_table.querySelectorAll("tbody tr");
    page.state.glacier.labels = [];
    page.state.glacier.links = [];
    page.state.glacier.values = [];
    let values_not_empty = 0;
    entries.forEach((entry) => {
      let period = entry.querySelector(".js-period a");
      let value = entry.querySelector(".js-scrobbles").textContent.trim();
      page.state.glacier.labels.push(period.textContent.trim());
      page.state.glacier.links.push(period.getAttribute("href"));
      page.state.glacier.values.push(value);
      if (value != "0")
        values_not_empty += 1;
    });
    if (values_not_empty == 0) {
      log("graph cancelled as all values are 0", "glacier library");
      page.structure.glacier.refresh = false;
      return;
    }
    scrobble_table.innerHTML = "";
    bleh_glacier_date_graph_generate();
    log("refresh is now marked false (finished generating)", "glacier library");
    page.structure.glacier.refresh = false;
  }
  function bleh_glacier_insights(insights = null) {
    if (insights != null) {
      if (page.subpage == "library_artists") {
        page.state.glacier.insights.album.display = false;
        page.state.glacier.insights.track.display = false;
      }
      if (page.subpage == "library_albums") {
        page.state.glacier.insights.artist.display = false;
        page.state.glacier.insights.track.display = false;
      }
      if (page.subpage == "library_tracks") {
        page.state.glacier.insights.artist.display = false;
        page.state.glacier.insights.album.display = false;
      }
      for (let item in insights) {
        log(`checking insights status of item ${item} - display of ${insights[item].display}`, "glacier library", "info", { checking: insights[item], global: page.state.glacier.insights[item] });
        if (insights[item].display && JSON.stringify(insights[item]) != JSON.stringify(page.state.glacier.insights[item])) {
          log(`confirmed insights status of item ${item} - is different`, "glacier library");
          page.state.glacier.insights[item] = insights[item];
          bleh_glacier_insights_generate(item, page.state.glacier.insights[item]);
        }
      }
    } else {
      for (let item in page.state.glacier.insights) {
        if (page.state.glacier.insights[item].display)
          bleh_glacier_insights_generate(item, page.state.glacier.insights[item]);
      }
    }
  }
  function bleh_glacier_insights_generate(type, item) {
    if (item.highest.value == 0)
      return;
    log(`requesting insights generator for ${type}`, "glacier library", "info", item);
    let new_run = false;
    let scrobble_insights_panel = page.structure.side.querySelector(`.scrobble-insights-panel[data-type="${type}"]`);
    if (scrobble_insights_panel == null) {
      scrobble_insights_panel = document.createElement("section");
      scrobble_insights_panel.classList.add("scrobble-insights-panel");
      scrobble_insights_panel.setAttribute("data-type", type);
      new_run = true;
    }
    scrobble_insights_panel.innerHTML = `<h2>${trans_legacy[lang][type].plural}</h2>`;
    let scrobble_canvas_container = document.createElement("div");
    scrobble_canvas_container.classList.add("scrobble-insights-canvas-container");
    let scrobble_canvas = document.createElement("canvas");
    scrobble_canvas.classList.add("scrobble-insights-canvas");
    Chart.defaults.color = page.state.chart_colours.text_col;
    Chart.defaults.font.family = "Ubuntu Sans";
    if (settings.chart_insights_view == "line") {
      let gradient = scrobble_canvas.getContext("2d").createLinearGradient(0, 0, 0, 160);
      try {
        gradient.addColorStop(0, page.state.chart_colours.link_bg_col);
        gradient.addColorStop(1, page.state.chart_colours.link_bg_col_2);
      } catch (e) {
        gradient = page.state.chart_colours.link_bg_col;
      }
      let scrobble_chart = new Chart(scrobble_canvas.getContext("2d"), {
        type: "line",
        data: {
          labels: item.labels,
          datasets: [{
            data: item.values,
            borderWidth: 2,
            backgroundColor: gradient,
            borderColor: page.state.chart_colours.link_col,
            fill: true,
            pointRadius: 0,
            pointHitRadius: 20,
            tension: 0.1
          }]
        },
        options: page.state.chart_library_line_options_no_click
      });
    } else if (settings.chart_insights_view == "pie") {
      let scrobble_chart = new Chart(scrobble_canvas.getContext("2d"), {
        type: "pie",
        data: {
          labels: item.labels,
          datasets: [{
            data: item.values,
            borderWidth: 2,
            backgroundColor: [
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "360")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "340")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "320")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "300")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "280")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "270")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "255")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "235")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "220")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "208")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "200")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "180")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "160")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "140")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "120")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "100")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "80")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "60")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "40")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "20")})`
            ],
            borderColor: page.state.chart_colours.bg_col,
            pointRadius: 0,
            pointHitRadius: 20,
            tension: 0.1
          }]
        },
        options: page.state.chart_library_pie_options_no_click
      });
    } else if (settings.chart_insights_view == "bar") {
      let scrobble_chart = new Chart(scrobble_canvas.getContext("2d"), {
        type: "bar",
        data: {
          labels: item.labels,
          datasets: [{
            data: item.values,
            borderWidth: 0,
            backgroundColor: [
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "360")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "340")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "320")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "300")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "280")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "270")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "255")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "235")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "220")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "208")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "200")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "180")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "160")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "140")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "120")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "100")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "80")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "60")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "40")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "20")})`
            ],
            borderColor: page.state.chart_colours.bg_col,
            pointRadius: 0,
            pointHitRadius: 20,
            tension: 0.1,
            borderRadius: 9
          }]
        },
        options: page.state.chart_library_bar_options_no_click
      });
    }
    scrobble_canvas_container.appendChild(scrobble_canvas);
    scrobble_insights_panel.appendChild(scrobble_canvas_container);
    if (new_run)
      page.structure.side.appendChild(scrobble_insights_panel);
  }
  function bleh_glacier_library_open_index(index) {
    window.location.href = page.state.glacier.links[index];
  }
  function bleh_glacier_library_request(request_url) {
    log(`making our own request with ${request_url}`, "glacier library");
    console.info(page.structure.glacier.refresh);
    page.structure.glacier.refresh = false;
    page.structure.glacier.date_panel.classList.add("data-is-loading");
    fetch(request_url).then(function(response) {
      console.log("glacier library returned", response, response.text, response.status);
      if (response.status != 200)
        throw new Error();
      return response.text();
    }).then(function(html) {
      let doc = new DOMParser().parseFromString(html, "text/html");
      console.log("glacier library DOC", doc, doc.querySelector(".table"));
      log("received response", "glacier library");
      log("refresh is now marked true", "glacier library");
      page.structure.glacier.refresh = true;
      let table = doc.querySelector(".table");
      if (table != null) {
        bleh_glacier_date_graph(false, table);
      } else {
        log("table is null?", "glacier library", "error");
        console.info("glacier library", doc.body.innerHTML);
        console.info("glacier library", new DOMParser().parseFromString(doc.body.innerHTML, "text/html"));
        throw new Error();
      }
      page.structure.glacier.date_panel.classList.remove("data-is-loading");
    });
  }
  function bleh_glacier_date_graph_generate() {
    page.state.glacier.current_tab = page.subpage;
    log("generating", "glacier library", "info", {
      labels: page.state.glacier.labels,
      links: page.state.glacier.links,
      values: page.state.glacier.values
    });
    prep_chart_colours();
    let new_run = false;
    let scrobble_canvas_container = page.structure.glacier.date_panel.querySelector(".scrobble-canvas-container");
    if (scrobble_canvas_container == null) {
      scrobble_canvas_container = document.createElement("div");
      scrobble_canvas_container.classList.add("scrobble-canvas-container");
      new_run = true;
    } else {
      scrobble_canvas_container.innerHTML = "";
    }
    let scrobble_canvas = document.createElement("canvas");
    scrobble_canvas.classList.add("scrobble-canvas");
    Chart.defaults.color = page.state.chart_colours.text_col;
    Chart.defaults.font.family = "Ubuntu Sans";
    if (settings.chart_view == "line") {
      let gradient = scrobble_canvas.getContext("2d").createLinearGradient(0, 0, 0, 160);
      try {
        gradient.addColorStop(0, page.state.chart_colours.link_bg_col);
        gradient.addColorStop(1, page.state.chart_colours.link_bg_col_2);
      } catch (e) {
        gradient = page.state.chart_colours.link_bg_col;
      }
      let scrobble_chart = new Chart(scrobble_canvas.getContext("2d"), {
        type: "line",
        data: {
          labels: page.state.glacier.labels,
          datasets: [{
            data: page.state.glacier.values,
            borderWidth: 2,
            backgroundColor: gradient,
            borderColor: page.state.chart_colours.link_col,
            fill: true,
            pointRadius: 0,
            pointHitRadius: 20,
            tension: 0.1
          }]
        },
        options: page.state.chart_library_line_options
      });
    } else if (settings.chart_view == "pie") {
      let scrobble_chart = new Chart(scrobble_canvas.getContext("2d"), {
        type: "pie",
        data: {
          labels: page.state.glacier.labels,
          datasets: [{
            data: page.state.glacier.values,
            borderWidth: 2,
            backgroundColor: [
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "360")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "340")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "320")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "300")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "280")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "270")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "255")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "235")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "220")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "208")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "200")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "180")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "160")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "140")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "120")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "100")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "80")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "60")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "40")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "20")})`
            ],
            borderColor: page.state.chart_colours.bg_col,
            pointRadius: 0,
            pointHitRadius: 20,
            tension: 0.1
          }]
        },
        options: page.state.chart_library_pie_options
      });
    } else if (settings.chart_view == "bar") {
      let scrobble_chart = new Chart(scrobble_canvas.getContext("2d"), {
        type: "bar",
        data: {
          labels: page.state.glacier.labels,
          datasets: [{
            data: page.state.glacier.values,
            borderWidth: 0,
            backgroundColor: [
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "360")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "340")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "320")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "300")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "280")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "270")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "255")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "235")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "220")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "208")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "200")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "180")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "160")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "140")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "120")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "100")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "80")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "60")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "40")})`,
              `hsl(${page.state.chart_colours.link_h_col.replace(page.state.chart_colours.hue, "20")})`
            ],
            borderColor: page.state.chart_colours.bg_col,
            pointRadius: 0,
            pointHitRadius: 20,
            tension: 0.1,
            borderRadius: 9
          }]
        },
        options: settings.chart_bar_axis == "horizontal" ? page.state.chart_library_bar_options : page.state.chart_library_bar_v_options
      });
    }
    scrobble_canvas_container.appendChild(scrobble_canvas);
    if (new_run)
      page.structure.glacier.date_panel.appendChild(scrobble_canvas_container);
  }
  function bleh_glacier_library_focused() {
    page.state.glacier.insights.artist = {
      display: false,
      values: [],
      labels: [],
      highest: {
        value: 0,
        label: "",
        link: "",
        img: ""
      }
    };
    let legacy_header = page.structure.main.querySelector(".library-header");
    let type;
    if (page.subpage.startsWith("library_artist"))
      type = "artist";
    else if (page.subpage.startsWith("library_album"))
      type = "album";
    else if (page.subpage.startsWith("library_track"))
      type = "track";
    let header_title = legacy_header.querySelector(".library-header-crumb");
    if (header_title == null)
      header_title = legacy_header.querySelector(".library-header-title");
    let duration = header_title.querySelector(".library-header-title-duration");
    if (duration != null)
      header_title.removeChild(duration);
    header_title = header_title.textContent.trim();
    let artist = legacy_header.querySelector(".text-colour-link");
    if (artist != null)
      artist = artist.textContent.trim();
    let image = legacy_header.querySelector(".library-header-image img");
    let link = `${root}music/${sanitise(header_title)}`;
    if (type == "album")
      link = `${root}music/${sanitise(artist)}/${sanitise(header_title)}`;
    else if (type == "track")
      link = `${root}music/${sanitise(artist)}/_/${sanitise(header_title)}`;
    let header = document.createElement("section");
    header.classList.add("glacier-library-top", "glacier-library-focused-header");
    let upper_wrap = document.createElement("div");
    upper_wrap.classList.add("glacier-library-top-upper");
    let current_suffix = window.location.search;
    let metadata = document.createElement("div");
    metadata.classList.add("glacier-library-metadata");
    metadata.innerHTML = `
        <div class="glacier-library-metadata-avatar">
            ${image.outerHTML}
        </div>
        <div class="glacier-library-metadata-item">
            <div class="sub-text">
                ${trans_legacy[lang][type].name}
            </div>
            <div class="glacier-library-metadata-item-value glacier-library-metadata-focus" data-type="${type}">
                <a href="${link}">${type == "artist" ? correct_artist(header_title) : correct_item_by_artist(header_title, artist)}</a>${duration != null ? ` <span class="glacier-library-track-duration">${duration.textContent}</span>` : ""}${type != "artist" ? trans_legacy[lang].glacier.by_artist.replace("{a}", `<a href="${root}user/${page.name}/library/music/+noredirect/${sanitise(artist)}${current_suffix}">${correct_artist(artist)}</a>`) : ""}
            </div>
        </div>
    `;
    upper_wrap.appendChild(metadata);
    header.appendChild(upper_wrap);
    let view_buttons = document.createElement("div");
    view_buttons.classList.add("view-buttons", "glacier-library-buttons");
    let cta = legacy_header.querySelector(".library-header-ctas");
    let love_form = legacy_header.querySelector(".library-header-love-form:not(:has(button))");
    if (love_form) {
      let state = love_form.querySelector(":scope > .love-button-toggle").getAttribute("data-ajax-form-state");
      if (state == "loved")
        state = 0;
      else
        state = 1;
      let love_form_items = love_form.querySelectorAll(":scope > div > div");
      love_form_items.forEach((item, index) => {
        if (state != index)
          item.classList.add("hide");
        cta.appendChild(item);
      });
    }
    if (cta) {
      let wrappers = cta.querySelectorAll(":scope > *");
      wrappers.forEach((wrapper) => {
        let button;
        console.info("wrapper", wrapper);
        if (wrapper.classList[0] == "library-header-cta-item")
          button = wrapper;
        else
          button = wrapper.querySelector("button");
        if (!button)
          button = wrapper.querySelector("span");
        if (!button)
          return;
        console.info("libraryyy", wrapper, button);
        button.classList.add("btn", "view-item", "glacier-library-button");
        let tooltips = wrapper.querySelectorAll(".user-library-controls-tooltip");
        tooltips.forEach((tooltip) => {
          tooltip.parentElement.removeChild(tooltip);
        });
        view_buttons.appendChild(wrapper);
        let action = button.getAttribute("data-analytics-action");
        if (action) {
          if (action == "EditScrobbleOpen") {
            button.textContent = trans_legacy[lang].glacier.edit;
          } else if (action == "UnloveTrack" || action == "LoveTrack") {
            let listen_divider = document.createElement("div");
            listen_divider.classList.add("listen-divider");
            view_buttons.appendChild(listen_divider);
            button = wrapper.querySelector("button:not(.btn)");
            if (button != null)
              button.classList.add("btn", "view-item", "glacier-library-button");
          }
        } else {
          if (button.classList.contains("delete-icon")) {
            button.textContent = trans_legacy[lang].glacier.delete;
          }
        }
      });
      if (wrappers.length > 0) {
        let listen_divider = document.createElement("div");
        listen_divider.classList.add("listen-divider");
        view_buttons.appendChild(listen_divider);
      }
    }
    let configure_button = document.createElement("button");
    configure_button.classList.add("btn", "view-item", "glacier-library-button", "glacier-configure-button", "panel-settings-button");
    configure_button.textContent = trans_legacy[lang].settings.configure;
    tippy(configure_button, {
      content: trans_legacy[lang].settings.configure
    });
    tippy(configure_button, {
      theme: "window",
      content: `
            <div class="dialog-settings">
                <div class="toggle-container" id="container-format_guest_features" onclick="_update_item('format_guest_features')">
                    <button class="btn reset" onclick="_reset_item('format_guest_features')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.format_guest_features.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.format_guest_features.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-format_guest_features" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container hide-if-format-guest-disabled" id="container-show_guest_features" onclick="_update_item('show_guest_features')">
                    <button class="btn reset" onclick="_reset_item('show_guest_features')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.show_guest_features.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.show_guest_features.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-show_guest_features" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-stacked_chartlist_info" onclick="_update_item('stacked_chartlist_info')">
                    <button class="btn reset" onclick="_reset_item('stacked_chartlist_info')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.stacked_chartlist_info.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.stacked_chartlist_info.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-stacked_chartlist_info" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="toggle-container" id="container-glacier_library_graphs" onclick="_update_item('glacier_library_graphs')">
                    <button class="btn reset" onclick="_reset_item('glacier_library_graphs')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].glacier.option.name}</h5>
                        <p>${trans_legacy[lang].glacier.option.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-glacier_library_graphs" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
        `,
      allowHTML: true,
      placement: "bottom",
      interactive: true,
      interactiveBorder: 10,
      trigger: "click",
      onShow(instance) {
        refresh_all(instance.popper);
      }
    });
    view_buttons.appendChild(configure_button);
    upper_wrap.appendChild(view_buttons);
    let lower_wrap = document.createElement("div");
    lower_wrap.classList.add("glacier-library-top-lower");
    let lower_metadata = document.createElement("div");
    lower_metadata.classList.add("glacier-library-metadata");
    let legacy_meta_wrap = page.structure.main.querySelector(".metadata-list");
    if (legacy_meta_wrap != null) {
      let metadatas = legacy_meta_wrap.querySelectorAll(".metadata-item:not(.library-header-ctas__wrapper)");
      metadatas.forEach((meta) => {
        let glacier_meta_item = document.createElement("div");
        glacier_meta_item.classList.add("glacier-library-metadata-item");
        glacier_meta_item.innerHTML = `
                <div class="sub-text">${meta.querySelector(".metadata-title").textContent}</div>
                <div class="glacier-library-metadata-item-value">${meta.querySelector(".metadata-display").textContent}</div>
            `;
        lower_metadata.appendChild(glacier_meta_item);
      });
    }
    lower_wrap.appendChild(lower_metadata);
    header.appendChild(lower_wrap);
    page.structure.main.insertBefore(header, page.structure.main.firstElementChild);
    let overview_header = page.structure.main.querySelector(":scope > .library-overview-header");
    if (overview_header == null)
      return;
    overview_header.nextElementSibling.insertBefore(overview_header, overview_header.nextElementSibling.firstElementChild);
  }
  function bleh_glacier_library_bulk_edit() {
    let library_header = page.structure.main.querySelector(".library-header");
    let bulk_edit = library_header.querySelector('[href="javascript:void(0)"]');
    if (bulk_edit == null)
      return;
    let view_buttons = page.structure.main.querySelector(".glacier-library-buttons");
    if (view_buttons == null)
      return;
    let edit_form = view_buttons.querySelector(":scope > .library-header-edit-form");
    let delete_button = view_buttons.querySelector(":scope > .delete-icon");
    if (delete_button == null)
      return;
    bulk_edit.classList.add("btn", "view-item", "glacier-library-button", "bulk-edit-button");
    bulk_edit.textContent = trans_legacy[lang].glacier.bulk_edit;
    if (edit_form == null)
      view_buttons.insertBefore(bulk_edit, delete_button);
    else
      view_buttons.insertBefore(bulk_edit, edit_form);
  }

  // src/chart.js
  function prep_chart_colours() {
    if (page.state.chart_colours.link_col == "hsl()")
      load_chart_colours();
  }
  function load_chart_colours() {
    let link_col = `hsl(${getComputedStyle(document.body).getPropertyValue("--l3-c")})`;
    let link_h_col = getComputedStyle(document.body).getPropertyValue("--h3-s");
    let link_bg_col = `hsla(${getComputedStyle(document.body).getPropertyValue("--h4")}, 30%)`;
    let link_bg_col_2 = `hsla(${getComputedStyle(document.body).getPropertyValue("--h4")}, 2%)`;
    let text_col = `hsl(${getComputedStyle(document.body).getPropertyValue("--c3")})`;
    let axis_col = `hsla(${getComputedStyle(document.body).getPropertyValue("--b4")}, 40%)`;
    let text_primary_col = `hsl(${getComputedStyle(document.body).getPropertyValue("--c2")})`;
    let bg_col = `hsl(${getComputedStyle(document.body).getPropertyValue("--b5")})`;
    let root_bg_col = `hsla(${getComputedStyle(document.body).getPropertyValue("--b6")}, 92%)`;
    let hue = getComputedStyle(document.body).getPropertyValue("--hue");
    page.state.chart_colours = {
      link_col,
      link_h_col,
      link_bg_col,
      link_bg_col_2,
      text_col,
      axis_col,
      text_primary_col,
      bg_col,
      root_bg_col,
      hue
    };
    console.log("chart colours", page.state.chart_colours);
    page.state.chart_line_options = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: root_bg_col,
          titleColor: text_primary_col,
          bodyColor: text_primary_col,
          multiKeyBackground: root_bg_col,
          boxPadding: 6,
          padding: 9,
          cornerRadius: 9,
          caretSize: 0
        }
      },
      scales: {
        x: {
          type: "time",
          time: {
            unit: "month",
            displayFormats: {
              month: "MMM"
            },
            tooltipFormat: "dddd, MMMM Do YYYY"
          },
          grid: {
            color: axis_col,
            display: false
          }
        },
        y: {
          display: false,
          grid: {
            display: false
          },
          suggestedMax: 10
        }
      }
    };
    page.state.chart_library_line_options = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: root_bg_col,
          titleColor: text_primary_col,
          bodyColor: text_primary_col,
          multiKeyBackground: root_bg_col,
          boxPadding: 6,
          padding: 9,
          cornerRadius: 9,
          caretSize: 0
        }
      },
      scales: {
        x: {
          grid: {
            color: axis_col,
            display: false
          }
        },
        y: {
          grid: {
            display: false
          },
          suggestedMax: 10
        }
      },
      onClick: (e, active, chart) => {
        bleh_glacier_library_open_index(active[0].index);
      }
    };
    page.state.chart_library_line_options_no_click = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: root_bg_col,
          titleColor: text_primary_col,
          bodyColor: text_primary_col,
          multiKeyBackground: root_bg_col,
          boxPadding: 6,
          padding: 9,
          cornerRadius: 9,
          caretSize: 0
        }
      },
      scales: {
        x: {
          grid: {
            color: axis_col,
            display: false
          }
        },
        y: {
          grid: {
            display: false
          },
          suggestedMax: 10
        }
      }
    };
    page.state.chart_library_pie_options = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: root_bg_col,
          titleColor: text_primary_col,
          bodyColor: text_primary_col,
          multiKeyBackground: root_bg_col,
          boxPadding: 6,
          padding: 9,
          cornerRadius: 9,
          caretSize: 0
        }
      },
      onClick: (e, active, chart) => {
        bleh_glacier_library_open_index(active[0].index);
      }
    };
    page.state.chart_library_pie_options_no_click = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: root_bg_col,
          titleColor: text_primary_col,
          bodyColor: text_primary_col,
          padding: 7,
          cornerRadius: 10,
          caretSize: 0
        }
      }
    };
    page.state.chart_library_bar_options = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: root_bg_col,
          titleColor: text_primary_col,
          bodyColor: text_primary_col,
          multiKeyBackground: root_bg_col,
          boxPadding: 6,
          padding: 9,
          cornerRadius: 9,
          caretSize: 0
        }
      },
      onClick: (e, active, chart) => {
        bleh_glacier_library_open_index(active[0].index);
      }
    };
    page.state.chart_library_bar_v_options = {
      indexAxis: "y",
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: root_bg_col,
          titleColor: text_primary_col,
          bodyColor: text_primary_col,
          multiKeyBackground: root_bg_col,
          boxPadding: 6,
          padding: 9,
          cornerRadius: 9,
          caretSize: 0
        }
      },
      onClick: (e, active, chart) => {
        bleh_glacier_library_open_index(active[0].index);
      }
    };
    page.state.chart_library_bar_options_no_click = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: root_bg_col,
          titleColor: text_primary_col,
          bodyColor: text_primary_col,
          multiKeyBackground: root_bg_col,
          boxPadding: 6,
          padding: 9,
          cornerRadius: 9,
          caretSize: 0
        }
      }
    };
  }

  // src/components/badge.js
  function load_badges(user, solo = false) {
    if (sponsor_list == null)
      return;
    if (!sponsor_list.badges.hasOwnProperty(user))
      return;
    let badges = [];
    if (!Array.isArray(sponsor_list.badges[user])) {
      log("1 badge found", "sponsor", "info", sponsor_list.badges[user]);
      badges.push(sponsor_list.badges[user]);
    } else {
      log("multiple badges found", "sponsor", "info", sponsor_list.badges[user]);
      if (solo)
        badges.push(sponsor_list.badges[user][Object.keys(sponsor_list.badges[user]).length - 1]);
      else
        badges = sponsor_list.badges[user];
    }
    badges.forEach((badge) => {
      if (!badge.name)
        badge.name = tl(trans.badges[badge.type].name);
      if (badge.reason)
        return;
      if (badge.type == "sponsor" || badge.type == "contributor" || badge.type == "translation")
        badge.reason = badge.type;
      else if (badge.type == "cute" || badge.type == "queen")
        badge.reason = "cute";
      else
        badge.reason = "reserved";
    });
    log("final badge list", "sponsor", "info", badges);
    return badges;
  }

  // src/avatar.js
  function patch_avatar(avatar, name, type = "") {
    if (avatar.hasAttribute("data-bleh-avatar"))
      return;
    avatar.setAttribute("data-bleh-avatar", "true");
    let avatar_img = avatar.querySelector("img");
    if (avatar_img == null)
      return;
    avatar_img.setAttribute("src", avatar_img.getAttribute("src").replace("/64s/", "/avatar70s/"));
    let badges = load_badges(name, true);
    if (badges) {
      let pre_existing_badge = avatar.querySelector(".avatar-status-dot");
      if (pre_existing_badge !== null)
        avatar.removeChild(pre_existing_badge);
      avatar.setAttribute("title", "");
      let this_badge = sponsor_list.badges[name];
      if (!Array.isArray(sponsor_list.badges[name])) {
        log(`@${name} 1 badge:`, "shout", "info", sponsor_list.badges[name]);
      } else {
        log(`@${name} multiple badges:`, "shout", "info", sponsor_list.badges[name]);
        let badges_length = Object.keys(sponsor_list.badges[name]).length - 1;
        this_badge = sponsor_list.badges[name][badges_length];
        log(`@${name} using badge ${badges_length} as primary`, "shout", "info", this_badge);
      }
      let badge = document.createElement("span");
      badge.classList.add("avatar-status-dot", `user-status--bleh-${this_badge.type}`, `user-status--bleh-user-${name}`);
      avatar.appendChild(badge);
      avatar.classList.add("avatar-can-hoverbox");
      tippy(avatar, {
        theme: "user",
        content: `
                <div class="image-info">
                    <div class="inner-image">
                        ${avatar_img.outerHTML}
                    </div>
                    <div class="info">
                        <h5 class="title">${name}</h5>
                        <p class="descriptor">${trans_legacy[lang].profile.top_badge}</p>
                        <p class="badge user-status--bleh-${this_badge.type} user-status--bleh-user-${name}" data-badge-type="${this_badge.type}" data-badge-user="${name}">${this_badge.name}</p>
                    </div>
                    <a href="${root}user/${name}" class="link-over"></a>
                </div>
                <div class="user-buttons view-buttons">
                    <a class="btn view-item user-button view-library-btn" href="${root}user/${name}/library">${trans_legacy[lang].actions.view_library}</a>
                    <a class="btn view-item user-button leave-shout-btn" href="${root}user/${name}/shoutbox">${trans_legacy[lang].actions.leave_a_shout}</a>
                </div>
            `,
        allowHTML: true,
        placement: "right",
        interactive: true,
        delay: [200, 0]
      });
      return this_badge;
    } else {
      let pre_existing_badge = avatar.querySelector(".avatar-status-dot");
      if (pre_existing_badge == null) {
        avatar.classList.add("avatar-can-hoverbox");
        tippy(avatar, {
          theme: "user",
          content: `
                    <div class="image-info">
                        <div class="inner-image">
                            ${avatar_img.outerHTML}
                        </div>
                        <div class="info">
                            <h5 class="title">${name}</h5>
                        </div>
                        <a href="${root}user/${name}" class="link-over"></a>
                    </div>
                    <div class="user-buttons view-buttons">
                        <a class="btn view-item user-button view-library-btn" href="${root}user/${name}/library">${trans_legacy[lang].actions.view_library}</a>
                        <a class="btn view-item user-button leave-shout-btn" href="${root}user/${name}/shoutbox">${trans_legacy[lang].actions.leave_a_shout}</a>
                    </div>
                `,
          allowHTML: true,
          placement: "right",
          interactive: true,
          delay: [200, 0]
        });
        return {};
      } else {
        avatar.classList.add("avatar-can-hoverbox");
        tippy(avatar, {
          theme: "user",
          content: `
                    <div class="image-info">
                        <div class="inner-image">
                            ${avatar_img.outerHTML}
                        </div>
                        <div class="info">
                            <h5 class="title">${name}</h5>
                            <p class="descriptor">${trans_legacy[lang].profile.top_badge}</p>
                            <p class="badge ${pre_existing_badge.classList[1]}">${avatar.getAttribute("title")}</p>
                        </div>
                        <a href="${root}user/${name}" class="link-over"></a>
                    </div>
                    <div class="user-buttons view-buttons">
                        <a class="btn view-item user-button view-library-btn" href="${root}user/${name}/library">${trans_legacy[lang].actions.view_library}</a>
                        <a class="btn view-item user-button leave-shout-btn" href="${root}user/${name}/shoutbox">${trans_legacy[lang].actions.leave_a_shout}</a>
                    </div>
                `,
          allowHTML: true,
          placement: "right",
          interactive: true,
          delay: [200, 0]
        });
        avatar.setAttribute("title", "");
        return {
          type: pre_existing_badge.classList[1]
        };
      }
    }
  }
  function return_name_from_avatar(avatar) {
    if (!avatar)
      return;
    if (!avatar.hasAttribute("alt"))
      return;
    if (avatar.getAttribute("alt") == trans_legacy[lang].avatar_for_me)
      return auth;
    return avatar.getAttribute("alt").replace(trans_legacy[lang].avatar_for_user, "");
  }
  unsafeWindow._expand_avatar = function(src) {
    expand_avatar(src);
  };
  function expand_avatar(src) {
    dialog({
      id: "avatar",
      body: `
            <div class="full-avatar-wrapper">
                <div class="full-avatar">
                    <img src="${src}">
                </div>
                <div class="modal-footer">
                    <a class="btn primary open" href="${src}" target="_blank">
                        ${trans_legacy[lang].profile.open_avatar}
                    </a>
                </div>
            </div>
        `,
      type: "avatar",
      has_overlays: false
    });
  }

  // src/components/menu.js
  function register_menu(element, menu) {
    element.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      menu.setProps({
        getReferenceClientRect: () => ({
          width: 0,
          height: 0,
          top: e.clientY,
          bottom: e.clientY,
          left: e.clientX,
          right: e.clientX
        })
      });
      menu.show();
    });
  }

  // src/pages/gallery.js
  function bleh_gallery() {
    if (page.subpage != "image")
      return;
    log("focusing on image", "gallery");
    let image_sidebar = page.structure.side.querySelector(".js-gallery-image-details > div");
    if (image_sidebar == null)
      return;
    if (image_sidebar.hasAttribute("data-bleh-gallery"))
      return;
    image_sidebar.setAttribute("data-bleh-gallery", "true");
    if (!ff("new_gallery_experience")) {
      patch_gallery_focused_image(image_sidebar, page.structure.container.querySelector(".gallery-image-buttons"));
      return;
    }
    let image_details;
    let gallery_section;
    try {
      gallery_section = page.structure.main.querySelector(".gallery-section");
      if (gallery_section != null) {
        page.structure.nav.after(gallery_section);
        image_details = document.createElement("section");
        image_details.classList.add("image-details");
      } else {
        image_details = page.structure.main.querySelector(".image-details");
        image_details.innerHTML = "";
      }
    } catch (e) {
      gallery_section = page.structure.container.querySelector(".gallery-section");
      image_details = page.structure.main.querySelector(".image-details");
      image_details.innerHTML = "";
    }
    image_details.appendChild(image_sidebar);
    let image_title = image_details.querySelector(".gallery-image-title");
    let image_date = image_details.querySelector(".gallery-image-uploaded-by");
    if (image_title.textContent.trim() == "") {
      image_title.classList.add("gallery-image-title-empty");
      image_title.textContent = trans_legacy[lang].gallery.empty.title;
    }
    let breadcrumbs = document.body.querySelector(".content-top-lower-row");
    let breadcrumb_root = breadcrumbs.querySelector("a");
    let breadcrumb_name = breadcrumbs.querySelector(".subpage-title");
    let image_title_container = document.createElement("div");
    image_title_container.classList.add("image-title-container");
    image_title_container.innerHTML = `
        <div class="sub-text">
            <div class="breadcrumb">
                ${breadcrumb_root.outerHTML}
                <div class="breadcrumb-name">
                    ${breadcrumb_name.textContent}
                </div>
            </div>
            ${image_date.outerHTML}
        </div>
        <div class="title-layer">
            ${image_title.outerHTML}
            <div class="vote-number" data-side="pos">+0</div>
        </div>
    `;
    image_details.insertBefore(image_title_container, image_sidebar);
    breadcrumbs.style.setProperty("display", "none");
    page.structure.main.insertBefore(image_details, page.structure.main.firstElementChild);
    let description = image_details.querySelector(".gallery-image-description");
    if (description == null) {
      description = document.createElement("p");
      description.classList.add("gallery-image-description", "gallery-image-description-empty");
      description.textContent = trans_legacy[lang].gallery.empty.description;
      image_details.querySelector("[data-image-url]").appendChild(description);
    }
    let buttons = image_details.querySelector(".gallery-image-buttons");
    let button_container = document.createElement("div");
    button_container.classList.add("button-container-wrapper");
    button_container.appendChild(buttons);
    let vote_buttons = buttons.querySelector(".gallery-image-vote-buttons");
    vote_buttons.after(create_divider());
    let positive_btn = vote_buttons.querySelector(':is([data-ajax-form-state=""] .gallery-image-vote-up-off, [data-ajax-form-state="up-voted"] .gallery-image-vote-up-on, [data-ajax-form-state="down-voted"] .gallery-image-vote-up-off)').cloneNode(true);
    let negative_btn = vote_buttons.querySelector(':is([data-ajax-form-state=""] .gallery-image-vote-down-off, [data-ajax-form-state="up-voted"] .gallery-image-vote-down-off, [data-ajax-form-state="down-voted"] .gallery-image-vote-down-on)').cloneNode(true);
    let positive = parseInt(positive_btn.textContent.replace(trans_legacy[lang].gallery.up, ""));
    let negative = parseInt(negative_btn.textContent.replace(trans_legacy[lang].gallery.down, ""));
    let number = positive - negative;
    let is_negative = number < 0;
    console.info(positive_btn, positive, negative_btn, negative, number);
    let vote_badge = image_title_container.querySelector(".vote-number");
    vote_badge.textContent = `${is_negative ? "" : "+"}${number}`;
    vote_badge.setAttribute("data-side", is_negative ? "neg" : "pos");
    tippy(vote_badge, {
      content: trans_legacy[lang].gallery.vote
    });
    let buttons_extra = document.createElement("div");
    buttons_extra.classList.add("gallery-image-buttons", "gallery-image-buttons-extra");
    button_container.appendChild(buttons_extra);
    image_details.appendChild(button_container);
    let open_button = document.createElement("button");
    open_button.classList.add("image-open-button");
    tippy(open_button, {
      content: trans_legacy[lang].gallery.open.tooltip
    });
    open_button.textContent = trans_legacy[lang].gallery.open.name;
    open_button.setAttribute("onclick", `_expand_gallery_image()`);
    buttons_extra.appendChild(open_button);
    open_button.after(create_divider());
    let delete_button = image_details.querySelector(".gallery-image-delete");
    if (delete_button != null)
      buttons_extra.appendChild(delete_button);
    let report_button = image_details.querySelector(".gallery-image-report-form");
    let report_text = report_button.querySelector("button");
    tippy(report_text, {
      content: report_text.textContent
    });
    report_text.textContent = trans_legacy[lang].gallery.report.name;
    buttons_extra.appendChild(report_button);
    let star_buttons = image_details.querySelectorAll(".gallery-image-preferred-button :is(button, a)");
    star_buttons.forEach((star_button) => {
      star_button.removeAttribute("title");
      let text = star_button.querySelector(".gallery-image-preferred-states");
      text.textContent = trans_legacy[lang].gallery.prefer.name;
    });
    let view_all_container = page.structure.main.querySelector(".more-link-fullwidth-right-flush-top");
    if (view_all_container != null) {
      let view_all = view_all_container.querySelector("a");
      view_all.classList.add("btn", "view-all-button", "back");
      let view_all_panel = document.createElement("section");
      view_all_panel.classList.add("view-all-panel");
      view_all_panel.appendChild(view_all);
      page.structure.side.insertBefore(view_all_panel, page.structure.side.firstElementChild);
      page.structure.main.removeChild(view_all_container);
      if (page.type == "artist" || ff("display_album_bookmark")) {
        let all_saved_panel = document.createElement("section");
        all_saved_panel.classList.add("view-all-panel");
        all_saved_panel.innerHTML = `
                <a class="btn view-all-button back all-saved-button" href="${view_all.getAttribute("href")}?tab=saved">
                    ${trans_legacy[lang].gallery.bookmarks.link}
                </a>
            `;
        view_all_panel.after(all_saved_panel);
      }
    }
    if (page.type == "artist" || ff("display_album_bookmark"))
      patch_gallery_focused_image(image_sidebar, buttons);
  }
  unsafeWindow._expand_gallery_image = function() {
    expand_gallery_image();
  };
  function expand_gallery_image() {
    let image_src = page.structure.container.querySelector(".active-slide .js-gallery-image").getAttribute("src").replace("770x0", "ar0");
    expand_avatar(image_src);
  }
  function create_divider() {
    let divider = document.createElement("div");
    divider.classList.add("listen-divider");
    return divider;
  }
  function bleh_gallery_upload() {
    let gallery_section = document.createElement("section");
    gallery_section.classList.add("gallery-section", "gallery--initialised");
    let image_container = document.createElement("div");
    image_container.classList.add("gallery-image-container");
    let slides = document.createElement("div");
    slides.classList.add("gallery-slides");
    let image = document.createElement("div");
    image.classList.add("gallery-image", "gallery-slide", "image-preview", "active-slide");
    image.innerHTML = `
        <img class="image-preview-hook">
    `;
    slides.appendChild(image);
    image_container.appendChild(slides);
    gallery_section.appendChild(image_container);
    page.structure.nav.after(gallery_section);
    let content_top2 = document.body.querySelector(".page-content");
    content_top2.innerHTML = "";
    let form = page.structure.main.querySelector(".form-horizontal");
    form.classList.add("panel-form");
    let upload_rules_group = form.querySelector(".form-group--description + .form-group");
    let rules = upload_rules_group.querySelector(".gallery-upload-rules");
    let rules_panel = document.createElement("section");
    rules_panel.classList.add("rules-panel");
    rules_panel.innerHTML = rules.innerHTML;
    page.structure.side.appendChild(rules_panel);
    form.removeChild(upload_rules_group);
  }
  function bleh_gallery_upload_check() {
    if (page.subpage != "images_image-upload")
      return;
    let image_preview = page.structure.main.querySelector(".form-image-preview");
    if (image_preview == null)
      return;
    let image_preview_container = page.structure.container.querySelector(".image-preview-hook");
    image_preview_container.setAttribute("src", image_preview.getAttribute("src"));
  }
  function bleh_gallery_list() {
    let upload_btn = page.structure.main.querySelector(".btn-add");
    if (upload_btn != null) {
      upload_btn.classList = "btn view-all-button back upload-button";
      let upload_panel = document.createElement("section");
      upload_panel.classList.add("view-all-panel", "upload-panel");
      upload_panel.appendChild(upload_btn);
      page.structure.side.insertBefore(upload_panel, page.structure.side.firstElementChild);
    }
  }
  function patch_gallery_page() {
    let header = document.body.querySelector("header");
    if (header == void 0)
      return;
    if (header.classList.contains("header-new--album"))
      return;
    let image_list = document.body.querySelector(".image-list");
    if (image_list != void 0) {
      patch_gallery_image_listing(image_list);
    }
  }
  function patch_gallery_image_listing(image_list) {
    if (image_list.hasAttribute("data-kate-processed"))
      return;
    image_list.setAttribute("data-kate-processed", "true");
    let bookmarked_images = JSON.parse(localStorage.getItem("bleh_bookmarked_images")) || {};
    if (page.requested.tab != "saved" || page.requested.page != null)
      page.structure.container.setAttribute("data-bleh--gallery-tab", "overview");
    else
      page.structure.container.setAttribute("data-bleh--gallery-tab", "bookmarks");
    let bookmark_nav = document.createElement("div");
    bookmark_nav.classList.add("bleh--nav-wrap", "bleh--nav-wrap--bookmarks");
    bookmark_nav.innerHTML = `
        <nav class="navlist secondary-nav">
            <ul class="navlist-items">
                <li class="navlist-item secondary-nav-item secondary-nav-item--gallery-overview">
                    <a class="secondary-nav-item-link" onclick="_set_gallery_page('overview')">
                        ${trans_legacy[lang].gallery.tabs.overview}
                    </a>
                </li>
                <li class="navlist-item secondary-nav-item secondary-nav-item--gallery-bookmarks">
                    <a class="secondary-nav-item-link" onclick="_set_gallery_page('bookmarks')">
                        ${trans_legacy[lang].gallery.tabs.bookmarks}
                    </a>
                </li>
            </ul>
        </nav>
    `;
    page.structure.content_top.after(bookmark_nav);
    let bookmarks_content = document.createElement("div");
    bookmarks_content.classList.add("col-main", "bleh--bookmarks", "not-a-panel");
    bookmarks_content.innerHTML = `
        <section class="bookmarks-panel">
            <ul class="image-list" id="bleh--bookmarked-images" data-kate-processed="true"></ul>
        </section>
    `;
    page.structure.main.classList.add("bleh--gallery");
    page.structure.main.after(bookmarks_content);
    let sort_button = page.structure.main.querySelector(".dropdown-menu-clickable-button");
    let sort_menu = page.structure.main.querySelector(".dropdown-menu-clickable");
    let sort_wrap = document.createElement("div");
    sort_wrap.classList.add("dropdown-top-wrap");
    sort_wrap.appendChild(sort_button);
    sort_wrap.appendChild(sort_menu);
    page.structure.main.insertBefore(sort_wrap, page.structure.main.firstElementChild);
    if (bookmarked_images.hasOwnProperty(page.name)) {
      bookmarked_images[page.name].forEach((image) => {
        console.info(image);
        let image_element = document.createElement("li");
        image_element.classList.add("image-list-item-wrapper");
        image_element.setAttribute("data-image-id", image);
        image_element.innerHTML = `
                <a class="image-list-item" href="${root}music/+noredirect/${page.name}/+images/${image}">
                    <img src="https://lastfm.freetls.fastly.net/i/u/avatar170s/${image}" loading="lazy">
                </a>
            `;
        document.getElementById("bleh--bookmarked-images").appendChild(image_element);
        if (ff("remove_bookmark")) {
          let menu = tippy(image_element, {
            theme: "context-menu",
            content: `
                        <button class="dropdown-menu-clickable-item" onclick="_update_image_bookmark(this, '${image}', false)" data-menu-item="remove-bookmark" data-bleh--image-is-bookmarked="true">
                            ${trans_legacy[lang].gallery.bookmarks.button.unbookmark_this_image.name}
                        </button>
                    `,
            allowHTML: true,
            placement: "right-start",
            trigger: "manual",
            interactive: true,
            interactiveBorder: 10,
            offset: [0, 0],
            onShow(instance) {
              instance.popper.addEventListener("click", (event2) => {
                instance.hide();
              });
            }
          });
          register_menu(image_element, menu);
        }
      });
      let image_list2 = page.structure.main.querySelectorAll(".image-list-item");
      image_list2.forEach((image_list_item) => {
        let image_id_split = image_list_item.getAttribute("href").split("/");
        let image_id_length = image_id_split.length;
        let image_id = image_id_split[image_id_length - 1];
        if (bookmarked_images[page.name].includes(image_id)) {
          image_list_item.classList.add("image-list-item-bookmarked");
        }
      });
    } else {
      document.getElementById("bleh--bookmarked-images").outerHTML = `
            <div class="no-data-message bleh--no-image-bookmarks">
                <p>${trans_legacy[lang].gallery.bookmarks.no_data}</p>
            </div>
        `;
    }
  }
  unsafeWindow._set_gallery_page = function(id) {
    set_gallery_page(id);
  };
  function set_gallery_page(id) {
    page.structure.container.setAttribute("data-bleh--gallery-tab", id);
  }
  function patch_gallery_focused_image(focused_image_details, gallery_interactions) {
    let focused_image_id_split = focused_image_details.getAttribute("data-image-url").split("/");
    let focused_image_id_length = focused_image_id_split.length - 1;
    let focused_image_id = focused_image_id_split[focused_image_id_length];
    let bookmarked_images = JSON.parse(localStorage.getItem("bleh_bookmarked_images")) || {};
    let image_is_bookmarked = false;
    if (bookmarked_images.hasOwnProperty(page.name)) {
      if (bookmarked_images[page.name].includes(focused_image_id)) {
        image_is_bookmarked = true;
        log("focused is bookmarked", "gallery");
      }
    }
    let gallery_bookmark_button = document.createElement("button");
    gallery_bookmark_button.classList.add("bleh--gallery-bookmark-image-btn", "btn--has-icon");
    gallery_bookmark_button.setAttribute("data-bleh--image-is-bookmarked", image_is_bookmarked);
    gallery_bookmark_button.setAttribute("onclick", `_update_image_bookmark(this, '${focused_image_id}')`);
    gallery_bookmark_button.textContent = trans_legacy[lang].gallery.bookmarks.button.bookmark_this_image.name;
    unsafeWindow.bookmark_tooltip = tippy(gallery_bookmark_button, {
      content: image_is_bookmarked ? trans_legacy[lang].gallery.bookmarks.button.unbookmark_this_image.bio : trans_legacy[lang].gallery.bookmarks.button.bookmark_this_image.bio
    });
    gallery_interactions.appendChild(gallery_bookmark_button);
  }
  unsafeWindow._update_image_bookmark = function(button, id, tooltip = true) {
    update_image_bookmark(button, id, tooltip);
  };
  function update_image_bookmark(button, id, tooltip = true) {
    let bookmarked_images = JSON.parse(localStorage.getItem("bleh_bookmarked_images")) || {};
    let is_bookmarked = button.getAttribute("data-bleh--image-is-bookmarked") === "true";
    if (tooltip) {
      unsafeWindow.bookmark_tooltip.setContent(
        !is_bookmarked ? trans_legacy[lang].gallery.bookmarks.button.unbookmark_this_image.bio : trans_legacy[lang].gallery.bookmarks.button.bookmark_this_image.bio
      );
    } else {
      button = page.structure.container.querySelector(`[data-image-id="${id}"]`);
    }
    if (!bookmarked_images.hasOwnProperty(page.name))
      bookmarked_images[page.name] = [];
    if (is_bookmarked) {
      button.setAttribute("data-bleh--image-is-bookmarked", "false");
      let new_artist_bookmarks = [];
      for (let image in bookmarked_images[page.name]) {
        if (bookmarked_images[page.name][image] != id) {
          new_artist_bookmarks.push(bookmarked_images[page.name][image]);
        }
      }
      bookmarked_images[page.name] = new_artist_bookmarks;
      log(`image ${id} from ${page.name} removed from bookmarks`, "gallery");
    } else {
      button.setAttribute("data-bleh--image-is-bookmarked", "true");
      bookmarked_images[page.name].push(id);
      log(`image ${id} from ${page.name} added to bookmarks`, "gallery");
    }
    localStorage.setItem("bleh_bookmarked_images", JSON.stringify(bookmarked_images));
  }

  // src/components/colourful_counts.js
  function patch_artist_ranks_in_list_view(track) {
    let count_bar = track.querySelector(".chartlist-count-bar");
    if (count_bar == void 0)
      return;
    let count_bar_link = count_bar.querySelector(".chartlist-count-bar-link");
    if (count_bar_link.getAttribute("href").includes("?from=") || count_bar_link.getAttribute("href").includes("?date_preset=") && !count_bar_link.getAttribute("href").endsWith("?date_preset=ALL") && !count_bar_link.getAttribute("href").endsWith("?date_preset=null"))
      return;
    let count = clean_number(count_bar.querySelector(".chartlist-count-bar-value").textContent.trim().replace(" scrobbles", ""));
    if (!count_bar.hasAttribute("data-kate-processed")) {
      count_bar.setAttribute("data-kate-processed", "true");
      let parsed_scrobble_as_rank = parse_scrobbles_as_rank(count);
      count_bar.setAttribute("data-bleh--scrobble-milestone", parsed_scrobble_as_rank.milestone);
      count_bar.style.setProperty("--hue-over", parsed_scrobble_as_rank.hue);
      count_bar.style.setProperty("--sat-over", parsed_scrobble_as_rank.sat);
      count_bar.style.setProperty("--lit-over", parsed_scrobble_as_rank.lit);
    }
  }
  function parse_scrobbles_as_rank(scrobbles) {
    let scrobble_milestone = 0;
    let scrobble_proximity = 1;
    let max_rank = 15;
    for (let rank = max_rank; rank >= 0; rank--) {
      if (scrobbles > ranks[rank].start) {
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
    if (scrobble_milestone != max_rank) {
      let next_milestone_hue = ranks[scrobble_milestone + 1].hue;
      let next_milestone_sat = ranks[scrobble_milestone + 1].sat;
      let next_milestone_lit = ranks[scrobble_milestone + 1].lit;
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
    }
    log(`milestone for ${scrobbles} is ${scrobble_milestone} within ${scrobble_proximity} proximity`, "colourful counts", "info", { hue: milestone_hue, sat: milestone_sat, lit: milestone_lit });
    return {
      milestone: scrobble_milestone,
      proximity: scrobble_proximity,
      hue: milestone_hue,
      sat: milestone_sat,
      lit: milestone_lit
    };
  }

  // src/components/profile_shortcut.js
  unsafeWindow._open_profile_shortcut_window = function() {
    dialog_legacy("profile_shortcut", trans_legacy[lang].settings.music.profile_shortcut.name, `
        <div class="text-container" id="container-profile_shortcut">
            <button class="btn reset" onclick="_reset_item('profile_shortcut')">${trans_legacy[lang].settings.reset}</button>
            <div class="avatar-container">
                <div class="avatar-inner" id="avatar-profile_shortcut">
                    <img id="avatar_src-profile_shortcut" src="${localStorage.getItem("bleh_profile_shortcut_avi") || ""}">
                </div>
            </div>
            <div class="heading content-form">
                <h5>${trans_legacy[lang].settings.music.profile_shortcut.placeholder}</h5>
                <div class="input-container">
                    <input type="text" maxlength="40" id="text-profile_shortcut" value="${settings.profile_shortcut}" placeholder="${trans_legacy[lang].settings.music.profile_shortcut.header}">
                    <button class="bleh--btn primary save" onclick="_save_profile_shortcut()">${trans_legacy[lang].settings.save}</button>
                </div>
            </div>
        </div>
    `, true);
  };
  unsafeWindow._other_listener = function(id) {
    other_listener(id);
  };
  function other_listener(id) {
    dialog({
      id: "other_listener",
      title: trans_legacy[lang].music.listens.custom.name,
      body: `
        <div class="text-container">
            <div class="avatar-container">
                <div class="avatar-inner avatar--bleh-missing">
                    <img>
                </div>
            </div>
            <div class="heading content-form">
                <h5>${trans_legacy[lang].settings.music.profile_shortcut.placeholder}</h5>
                <div class="input-container">
                    <input type="text" maxlength="40" id="text-profile" placeholder="${trans_legacy[lang].settings.music.profile_shortcut.header}">
                    <button class="bleh--btn primary save" onclick="_send_other_listener('${id}')">${trans_legacy[lang].settings.done}</button>
                </div>
            </div>
        </div>
        `
    });
  }
  unsafeWindow._send_other_listener = function(link) {
    let name = dialogs["other_listener"].instance.querySelector("#text-profile").value;
    dialog_rm({
      id: "other_listener"
    });
    window.location.href = `${root}user/${name}/library/music/${link}`;
  };
  unsafeWindow._set_profile_as_shortcut = function(button, profile_name) {
    let avatar_src = document.body.querySelector(".header-avatar-inner-wrap img").getAttribute("src");
    localStorage.setItem("bleh_profile_shortcut_avi", avatar_src);
    deliver_notif(trans_legacy[lang].settings.music.profile_shortcut.saved);
    button.setAttribute("data-is-shortcut", "true");
    button.removeAttribute("onclick");
    if (button.classList.contains("icon"))
      button.textContent = trans_legacy[lang].profile.shortcut.remove;
    settings.profile_shortcut = profile_name;
    localStorage.setItem("bleh", JSON.stringify(settings));
  };
  unsafeWindow._save_profile_shortcut = function() {
    let profile_name = document.getElementById("text-profile_shortcut").value;
    let profile_img = document.getElementById("avatar-profile_shortcut");
    if (profile_name == "" || profile_name == auth.name) {
      localStorage.removeItem("bleh_profile_shortcut_avi");
      document.getElementById("avatar_src-profile_shortcut").setAttribute("src", "");
      settings.profile_shortcut = "";
      localStorage.setItem("bleh", JSON.stringify(settings));
      return;
    }
    profile_img.classList.add("requesting");
    fetch(`${root}user/${profile_name}/tags`).then(function(response) {
      console.log("returned", response, response.text);
      return response.text();
    }).then(function(html) {
      let doc = new DOMParser().parseFromString(html, "text/html");
      console.log("DOC", doc);
      profile_img.classList.remove("requesting");
      try {
        let avatar_src = doc.querySelector(".header-avatar-inner-wrap img").getAttribute("src");
        localStorage.setItem("bleh_profile_shortcut_avi", avatar_src);
        document.getElementById("avatar_src-profile_shortcut").setAttribute("src", avatar_src);
        notify({
          id: "profile_shortcut_saved",
          title: trans_legacy[lang].settings.music.profile_shortcut.name,
          body: trans_legacy[lang].settings.music.profile_shortcut.saved,
          icon: "icon-16-profile-shortcut"
        });
        settings.profile_shortcut = profile_name;
        localStorage.setItem("bleh", JSON.stringify(settings));
      } catch (e) {
        notify({
          id: "profile_shortcut_saved",
          title: trans_legacy[lang].settings.music.profile_shortcut.name,
          body: trans_legacy[lang].settings.music.profile_shortcut.failed,
          type: "error"
        });
        localStorage.removeItem("bleh_profile_shortcut_avi");
        document.getElementById("avatar_src-profile_shortcut").setAttribute("src", "");
      }
    });
  };

  // src/components/music.js
  unsafeWindow._other_listener = function(id) {
    other_listener(id);
  };
  function show_your_scrobbles() {
    let katsune = ff("katsune");
    show_numbers_on_side(page.type);
    let col_main = page.structure.container.querySelector(".top-overview-panel");
    if (col_main == null)
      col_main = document.body.querySelector(".col-main");
    if (page.type == "track") {
      let new_panel = document.createElement("section");
      new_panel.classList.add("track-info-panel");
      new_panel.innerHTML = col_main.innerHTML;
      page.structure.main.insertBefore(new_panel, page.structure.main.firstElementChild);
      col_main.style.setProperty("display", "none");
      console.info(col_main, new_panel);
      col_main = new_panel;
    }
    let top_container = document.createElement("div");
    top_container.classList.add("top-container");
    if (katsune)
      top_container.classList.add("katsune-button-row");
    let listen_container = document.createElement("div");
    if (!katsune)
      listen_container.classList.add("listen-container", "view-buttons");
    let page_url = window.location.href;
    let page_url_split = page_url.split("/");
    let page_url_length = page_url_split.length - 1;
    let scrobble_page = page_url_split[page_url_length];
    if (page.type == "album") {
      scrobble_page = page_url_split[page_url_length - 1] + "/" + page_url_split[page_url_length];
    } else if (page.type == "track") {
      scrobble_page = page_url_split[page_url_length - 2] + "/_/" + page_url_split[page_url_length];
    }
    let your_listens = {
      name: auth.name,
      listens: 0,
      link: scrobble_page,
      avi: auth.avatar,
      katsune
    };
    let scrobble_button = col_main.querySelector(".personal-stats-item--scrobbles .hidden-xs a");
    if (scrobble_button != null) {
      your_listens.listens = clean_number(scrobble_button.textContent.trim());
    }
    create_listen_item(listen_container, your_listens, page.type);
    if (settings.profile_shortcut != "") {
      let shortcut_listens = {
        name: settings.profile_shortcut,
        listens: -1,
        link: scrobble_page,
        avi: localStorage.getItem("bleh_profile_shortcut_avi"),
        katsune
      };
      create_listen_item(listen_container, shortcut_listens);
      fetch(`${root}user/${shortcut_listens.name}/library/music/${scrobble_page}`).then(function(response) {
        console.log("returned", response, response.text);
        return response.text();
      }).then(function(html) {
        let doc = new DOMParser().parseFromString(html, "text/html");
        console.log("DOC", doc);
        let first_metadata_item = doc.querySelector(".metadata-item .metadata-display");
        let listens = 0;
        let listen_item = document.getElementById(`listen-item--${shortcut_listens.name}`);
        if (first_metadata_item != null)
          listens = clean_number(first_metadata_item.textContent.trim());
        listen_item.setAttribute("data-listens", listens);
        listen_item.innerHTML = `
                <img class="view-item-avatar" src="${shortcut_listens.avi}" alt="${shortcut_listens.name}">${trans_legacy[lang].music.listens.count_listens.replace("{c}", listens.toLocaleString(lang))}
            `;
        if (settings.colourful_counts && page.type == "artist") {
          let parsed_scrobble_as_rank = parse_scrobbles_as_rank(listens);
          listen_item.setAttribute("data-bleh--scrobble-milestone", parsed_scrobble_as_rank.milestone);
          listen_item.style.setProperty("--hue-over", parsed_scrobble_as_rank.hue);
          listen_item.style.setProperty("--sat-over", parsed_scrobble_as_rank.sat);
          listen_item.style.setProperty("--lit-over", parsed_scrobble_as_rank.lit);
        }
      });
    }
    create_listen_item(listen_container, {
      name: "other",
      listens: -3,
      link: scrobble_page,
      button: true,
      katsune
    }, page.type);
    top_container.appendChild(listen_container);
    if (!katsune)
      col_main.insertBefore(top_container, col_main.firstElementChild);
    else
      page.structure.container.querySelector(".bleh-background").after(top_container);
    if (page.type == "artist") {
      let other_container = col_main.querySelector(".personal-stats-item--listeners");
      if (other_container != null) {
        let listen_divider = document.createElement("div");
        listen_divider.classList.add("listen-divider");
        listen_container.appendChild(listen_divider);
        let avatars = other_container.querySelectorAll(".personal-stats-listener-avatar img");
        let count = other_container.querySelector(".header-metadata-display a");
        let other_listeners = {
          name: "others",
          listens: -2,
          link: scrobble_page,
          avi: avatars,
          count: count != null ? clean_number(count.textContent.trim()) : 5,
          katsune
        };
        create_listen_item(listen_container, other_listeners, page.type);
      }
    }
    let interact_container = document.createElement("div");
    if (!katsune)
      interact_container.classList.add("interact-container", "view-buttons");
    let text = document.body.querySelector(".header-new-title").textContent.replaceAll(" ", "+").replaceAll("&", "%26");
    let artist = document.body.querySelector(".header-new-crumb");
    if (artist != void 0)
      text = `${text}+${artist.textContent.replaceAll(" ", "+").replaceAll("&", "%26")}`;
    let header_actions = document.body.querySelector(".header-new-actions");
    interact_container.innerHTML = header_actions.innerHTML;
    let buttons = interact_container.querySelectorAll("button");
    buttons.forEach((button) => {
      if (button.classList[0] != "header-new-playlink")
        button.classList.add("btn", "view-item", "interact-item", katsune ? "icon" : "");
      else
        button.classList.add("dropdown-menu-clickable-item");
      if (button.classList[0] == "header-new-more-button")
        interact_container.removeChild(button.parentElement);
    });
    let links = interact_container.querySelectorAll("a");
    links.forEach((button) => {
      if (button.classList[0] != "header-new-playlink")
        button.classList.add("btn", "view-item", "interact-item");
      else
        button.classList.add("dropdown-menu-clickable-item");
    });
    let bookmark_btn = interact_container.querySelector('[data-toggle-button-current-state*="bookmark"]');
    bookmark_btn.after(create_divider());
    let obsession_form = header_actions.querySelector('form[action$="obsessions"]');
    if (obsession_form != null) {
      let obsession_btn = obsession_form.querySelector("button");
      obsession_btn.classList = "btn view-item interact-item obsession-btn";
      tippy(obsession_btn, {
        content: obsession_btn.textContent
      });
      obsession_btn.textContent = trans_legacy[lang].music.obsession;
      interact_container.appendChild(obsession_form);
    }
    if (katsune && page.type == "artist") {
      let artist_btn = document.createElement("a");
      artist_btn.classList.add("btn", "view-item", "interact-item", "artist-btn", "icon");
      if (settings.quick_artist_button == "gallery") {
        artist_btn.setAttribute("data-artist-btn-type", "gallery");
        artist_btn.setAttribute("href", `${window.location.href}/+images`);
        artist_btn.textContent = trans_legacy[lang].gallery.view;
      } else if (settings.quick_artist_button == "shouts") {
        artist_btn.setAttribute("data-artist-btn-type", "shouts");
        artist_btn.setAttribute("href", `${window.location.href}/+shoutbox`);
        artist_btn.textContent = trans_legacy[lang].settings.layout.quick_artist_button.shouts;
      } else if (settings.quick_artist_button == "wiki") {
        artist_btn.setAttribute("data-artist-btn-type", "wiki");
        artist_btn.setAttribute("href", `${window.location.href}/+wiki`);
        artist_btn.textContent = trans_legacy[lang].settings.layout.quick_artist_button.wiki;
      } else if (settings.quick_artist_button == "listens") {
        artist_btn.setAttribute("data-artist-btn-type", "gallery");
        artist_btn.setAttribute("href", `${window.location.href}/+listeners/you-know`);
        artist_btn.textContent = trans_legacy[lang].settings.layout.quick_artist_button.listens;
      }
      interact_container.appendChild(artist_btn);
      let view_menu = tippy(artist_btn, {
        theme: "context-menu",
        content: `
                <a class="dropdown-menu-clickable-item" href="${root}bleh?tab=customise" data-menu-item="settings">
                    ${trans_legacy[lang].settings.configure}
                </a>
            `,
        allowHTML: true,
        placement: "right-start",
        trigger: "manual",
        interactive: true,
        interactiveBorder: 10,
        offset: [0, 0],
        onShow(instance) {
          instance.popper.addEventListener("click", (event2) => {
            instance.hide();
          });
        }
      });
      register_menu(artist_btn, view_menu);
    }
    let search_btn = document.createElement("a");
    search_btn.classList.add("btn", "view-item", "interact-item", "search-similar-btn", katsune ? "icon" : "");
    search_btn.textContent = trans_legacy[lang].music.search_variations.name;
    search_btn.href = `${root}search/${page.type}s?q=${text}`;
    search_btn.target = "_blank";
    tippy(search_btn, {
      content: trans_legacy[lang].music.search_variations.tooltip
    });
    interact_container.appendChild(search_btn);
    let search_lyrics = null;
    if (page.type == "track") {
      search_lyrics = document.createElement("a");
      search_lyrics.classList.add("dropdown-menu-clickable-item", "search-genius-btn");
      search_lyrics.textContent = trans_legacy[lang].music.search_genius;
      search_lyrics.href = `https://genius.com/search?q=${text}`;
      search_lyrics.target = "_blank";
    }
    let lotus_btn = null;
    if (settings.corrections) {
      lotus_btn = document.createElement("a");
      lotus_btn.classList.add("dropdown-menu-clickable-item", "lotus", "lotus-btn");
      lotus_btn.textContent = trans_legacy[lang].lotus.correct.name;
      lotus_btn.href = "https://github.com/katelyynn/lotus/issues/new/choose";
      lotus_btn.target = "_blank";
      if (page.corrected)
        lotus_btn.classList.add("active");
    }
    let menu_btn = document.createElement("button");
    menu_btn.classList.add("btn", "view-item", "interact-item", "menu-btn", katsune ? "icon" : "");
    menu_btn.textContent = trans_legacy[lang].music.menu;
    let play_btn = interact_container.querySelector(".header-new-playlink");
    let music_menu = tippy(menu_btn, {
      theme: "select-menu",
      content: `
            ${search_lyrics != null ? search_lyrics.outerHTML : ""}
            ${lotus_btn != null ? lotus_btn.outerHTML : ""}
            ${play_btn != null ? play_btn.outerHTML : ""}
        `,
      allowHTML: true,
      placement: "bottom",
      interactive: true,
      interactiveBorder: 10,
      trigger: "click",
      onShow(instance) {
      }
    });
    if (play_btn != null)
      interact_container.removeChild(play_btn);
    interact_container.appendChild(menu_btn);
    top_container.appendChild(interact_container);
  }
  function create_listen_item(parent, { name, listens, link, avi, count = 0, button = false, katsune = false }, header_type) {
    log(`creating listen item of ${name}, ${count}, ${listens}`, "artist", "info", { avi, link });
    let listen_item = document.createElement(!button ? "a" : "button");
    listen_item.classList.add("btn", "listen-item", "view-item");
    listen_item.setAttribute("href", `${root}user/${name}/library/music/${link}`);
    listen_item.setAttribute("data-listens", listens);
    listen_item.setAttribute("id", `listen-item--${name}`);
    if (listens > -1) {
      listen_item.innerHTML = `
            <img class="view-item-avatar" src="${avi}" alt="${name}">${trans_legacy[lang].music.listens.count_listens.replace("{c}", listens.toLocaleString(lang))}
        `;
      let menu = tippy(listen_item, {
        theme: "context-menu",
        content: `
                <a class="dropdown-menu-clickable-item" href="${root}user/${name}" data-menu-item="view_profile">
                    ${trans_legacy[lang].music.view_profile}
                </a>
            `,
        allowHTML: true,
        placement: "right-start",
        trigger: "manual",
        interactive: true,
        interactiveBorder: 10,
        offset: [0, 0],
        onShow(instance) {
          instance.popper.addEventListener("click", (event2) => {
            instance.hide();
          });
        }
      });
      register_menu(listen_item, menu);
    } else if (listens > -2) {
      listen_item.innerHTML = `
            <img class="view-item-avatar" src="${avi}" alt="${name}">${trans_legacy[lang].music.listens.loading_listens}
        `;
      let menu = tippy(listen_item, {
        theme: "context-menu",
        content: `
                <a class="dropdown-menu-clickable-item" href="${root}user/${name}" data-menu-item="view_profile">
                    ${trans_legacy[lang].music.view_profile}
                </a>
                <div class="sep"></div>
                <button class="dropdown-menu-clickable-item" onclick="_open_profile_shortcut_window()" data-menu-item="settings">
                    ${trans_legacy[lang].settings.configure}
                </button>
            `,
        allowHTML: true,
        placement: "right-start",
        trigger: "manual",
        interactive: true,
        interactiveBorder: 10,
        offset: [0, 0],
        onShow(instance) {
          instance.popper.addEventListener("click", (event2) => {
            instance.hide();
          });
        }
      });
      register_menu(listen_item, menu);
    } else if (listens == -3) {
      listen_item.classList.add("listen-item-other");
      listen_item.removeAttribute("href");
      listen_item.setAttribute("onclick", `_other_listener('${link}')`);
      tippy(listen_item, {
        content: trans_legacy[lang].music.listens.custom.tooltip
      });
    } else {
      listen_item.innerHTML = `
            ${avi[0] != null ? `<img class="view-item-avatar" src="${avi[0].getAttribute("src")}">` : ""}
            ${avi[1] != null ? `<img class="view-item-avatar" src="${avi[1].getAttribute("src")}">` : ""}
            ${avi[2] != null ? `<img class="view-item-avatar" src="${avi[2].getAttribute("src")}">` : ""}
            ${trans_legacy[lang].music.listens.other_listeners.replace("{c}", count)}
        `;
      listen_item.setAttribute("href", `${window.location.href}/+listeners/you-know`);
    }
    if (settings.colourful_counts && listens > -1 && header_type == "artist") {
      let parsed_scrobble_as_rank = parse_scrobbles_as_rank(listens);
      listen_item.setAttribute("data-bleh--scrobble-milestone", parsed_scrobble_as_rank.milestone);
      listen_item.style.setProperty("--hue-user", parsed_scrobble_as_rank.hue);
      listen_item.style.setProperty("--sat-user", parsed_scrobble_as_rank.sat);
      listen_item.style.setProperty("--lit-user", parsed_scrobble_as_rank.lit);
    }
    if (katsune) {
      listen_item.classList.add("icon");
    }
    parent.appendChild(listen_item);
    if (listens < -1)
      return;
    tippy(listen_item, {
      content: name
    });
  }
  function show_numbers_on_side(header_type) {
    let metadata = document.body.querySelectorAll(".header-metadata-tnew-item");
    let listeners = {};
    let scrobbles = {};
    let metascore = {};
    metadata.forEach((item, index) => {
      let text = item.querySelector(".header-metadata-tnew-title").textContent.trim();
      let value = item.querySelector(".header-metadata-tnew-display abbr");
      if (index == 0) {
        listeners.text = text;
        listeners.value = clean_number(value.getAttribute("title"));
        listeners.abbr = value.textContent.trim();
      } else if (index == 1) {
        scrobbles.text = text;
        scrobbles.value = clean_number(value.getAttribute("title"));
        scrobbles.abbr = value.textContent.trim();
      } else if (index == 2) {
        let link = item.querySelector("a");
        if (link == null)
          return;
        metascore.text = text;
        metascore.abbr = value.textContent.trim();
        metascore.link = link.getAttribute("href");
      }
    });
    let panel = page.structure.side.querySelector("section.section-with-separator:has(.listener-trend)");
    if (panel == null) {
      panel = document.createElement("section");
      panel.classList.add("section-with-separator");
      page.structure.side.insertBefore(panel, page.structure.side.firstElementChild);
    }
    panel.classList.add("listen-panel");
    let row = document.createElement("div");
    row.classList.add("listener-row");
    row.innerHTML = `
        <div class="listener-side" id="listeners">
            <h3>${listeners.text}</h3>
            <p>${listeners.abbr}</p>
        </div>
        <div class="scrobble-side" id="scrobbles">
            <h3>${scrobbles.text}</h3>
            <p>${scrobbles.abbr}</p>
        </div>
        ${metascore.text != void 0 ? `
        <div class="metascore-side">
            <h3>${metascore.text}</h3>
            <p><a href="${metascore.link}" target="_blank">${metascore.abbr}</a></p>
        </div>
        ` : ""}
    `;
    panel.insertBefore(row, panel.firstElementChild);
    tippy(document.getElementById("listeners"), {
      content: listeners.value.toLocaleString(lang)
    });
    tippy(document.getElementById("scrobbles"), {
      content: scrobbles.value.toLocaleString(lang)
    });
    if (page.type == "album") {
      let album_artwork = document.body.querySelector(".artwork-and-metadata-row");
      if (album_artwork)
        page.structure.side.insertBefore(album_artwork, page.structure.side.firstElementChild);
    }
    if (page.type == "album" || page.type == "artist") {
      let upper = document.body.querySelector(".col-main");
      upper.classList.add("upper-overview-to-hide");
      let new_upper = document.createElement("section");
      new_upper.classList.add("top-overview-panel");
      new_upper.setAttribute("data-page-type", page.type);
      new_upper.innerHTML = upper.innerHTML;
      page.structure.main.insertBefore(new_upper, page.structure.main.firstElementChild);
    }
    if (page.type == "track") {
      let video_col = document.body.querySelector(".track-overview-video-column.col-sidebar");
      video_col.classList.remove("col-sidebar");
      page.structure.side.insertBefore(video_col, page.structure.side.firstElementChild);
      let video = video_col.querySelector(".video-preview");
      if (video) {
        video_col.classList.remove("col-sidebar");
        page.structure.side.insertBefore(video_col, page.structure.side.firstElementChild);
        let container = document.createElement("div");
        container.classList.add("video-overlay-container");
        let view_buttons = document.createElement("div");
        view_buttons.classList.add("view-buttons");
        let playlink = video.querySelector(".video-preview-playlink a");
        let replace = video_col.querySelector(".video-preview-replace a");
        playlink.classList = "btn view-item video-item video-item--play";
        replace.classList = "btn view-item video-item video-item--edit";
        view_buttons.appendChild(playlink);
        view_buttons.appendChild(replace);
        container.appendChild(view_buttons);
        video.appendChild(container);
        tippy(playlink, {
          content: playlink.getAttribute("title")
        });
        playlink.removeAttribute("title");
        tippy(replace, {
          content: replace.textContent
        });
      } else {
        let cta = video_col.querySelector(".video-preview-upload-cta");
        if (cta)
          return;
        page.structure.side.removeChild(video_col);
        let video_placeholder = document.createElement("section");
        video_placeholder.classList.add("video-placeholder");
        video_placeholder.innerHTML = `
                <div class="bleh-icon" style="--icon: var(--icon-16-video-broken)"></div>
                Video removed by Last.fm
            `;
        page.structure.side.insertBefore(video_placeholder, page.structure.side.firstElementChild);
        let links = page.structure.side.querySelector(".external-links-section .play-this-track-playlinks");
        if (links)
          links.classList.add("video-unavailable");
      }
    }
  }
  function bleh_music_page_charts() {
    if (!ff("music_page_charts"))
      return;
    log("beginning replacement", "music charts");
    let panel = document.body.querySelector(".listen-panel");
    let trend = panel.querySelector(".listener-trend");
    if (trend == null)
      return;
    prep_chart_colours();
    let previous_chart = panel.querySelector(".scrobble-canvas-container");
    if (previous_chart != null)
      panel.removeChild(previous_chart);
    let table = trend.querySelector("tbody");
    let days = table.querySelectorAll("tr");
    let labels = [];
    let values = [];
    let has_seen_more_than_0 = false;
    days.forEach((day, index) => {
      if (!day)
        null;
      let label = moment(day.querySelector("time").getAttribute("datetime"));
      let value = day.querySelector(".js-value");
      console.log("day", index, label, day, day.innerHTML);
      if (!value.getAttribute("data-value"))
        value = 0;
      else
        value = value.getAttribute("data-value");
      if (value == "0" && index < 120 && !has_seen_more_than_0)
        return;
      has_seen_more_than_0 = true;
      labels.push(label);
      values.push(value);
    });
    prep_chart_colours();
    let scrobble_canvas_container = document.createElement("div");
    scrobble_canvas_container.classList.add("scrobble-canvas-container");
    let scrobble_canvas = document.createElement("canvas");
    scrobble_canvas.classList.add("scrobble-canvas");
    let gradient = scrobble_canvas.getContext("2d").createLinearGradient(0, 0, 0, 160);
    try {
      gradient.addColorStop(0, page.state.chart_colours.link_bg_col);
      gradient.addColorStop(1, page.state.chart_colours.link_bg_col_2);
    } catch (e) {
      gradient = page.state.chart_colours.link_bg_col;
    }
    Chart.defaults.color = page.state.chart_colours.text_col;
    Chart.defaults.font.family = "Ubuntu Sans";
    let scrobble_chart = new Chart(scrobble_canvas.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [{
          data: values,
          borderWidth: 2,
          backgroundColor: gradient,
          borderColor: page.state.chart_colours.link_col,
          fill: true,
          pointRadius: 0,
          pointHitRadius: 20,
          tension: 0.1
        }]
      },
      options: page.state.chart_line_options
    });
    scrobble_canvas_container.appendChild(scrobble_canvas);
    panel.appendChild(scrobble_canvas_container);
    trend.style.setProperty("display", "none");
    log("finished", "music charts");
  }
  function bleh_top_listeners() {
    if (!ff("unify_top_listeners"))
      return;
    let panel = page.structure.main.querySelector(":scope > .buffer-standard");
    let view_buttons = document.createElement("div");
    view_buttons.classList.add("view-buttons-wrapper");
    view_buttons.innerHTML = `
        <div class="view-buttons">
            <button class="btn view-item" id="toggle-list_view-1" data-toggle="list_view" data-toggle-value="1" onclick="_update_item('list_view', 1)">
                ${trans_legacy[lang].glacier.view.grid}
            </button>
            <button class="btn view-item" id="toggle-list_view-0" data-toggle="list_view" data-toggle-value="0" onclick="_update_item('list_view', 0)">
                ${trans_legacy[lang].glacier.view.list}
            </button>
        </div>
    `;
    panel.insertBefore(view_buttons, panel.firstElementChild);
    refresh_all();
    let legacy_top_listeners_container = panel.querySelector(".top-listeners");
    let legacy_top_listeners = legacy_top_listeners_container.querySelectorAll(".top-listeners-item");
    let new_container = document.createElement("ul");
    new_container.classList.add("user-list", "top-listeners-list");
    legacy_top_listeners.forEach((listener, index) => {
      let new_listener = document.createElement("li");
      new_listener.classList.add("user-list-item", "listener-list-item");
      let position = index + 1;
      if (page.requested.page != null && page.requested.page != "1") {
        position += (parseInt(page.requested.page) - 1) * 30;
      }
      let name_wrap = listener.querySelector(".top-listeners-item-name a");
      let name = name_wrap.textContent;
      let track_wrap = listener.querySelector(".top-listeners-track");
      let avatar = listener.querySelector(".top-listeners-item-image");
      let follow = listener.querySelector(".class");
      new_listener.innerHTML = `
            <div class="user-list-inner-wrap">
                <span class="listener-list-position">
                    ${position}
                </span>
                <h4 class="user-list-name">
                    <a class="user-list-link link-block-target" href="${name_wrap.getAttribute("href")}">
                        ${name}
                    </a>
                </h4>
                <span class="avatar user-list-avatar">
                    ${avatar.innerHTML}
                </span>
                ${follow ? follow.outerHTML : ""}
                <div class="user-list-description">
                    <p class="user-list-about-me">
                        ${track_wrap.innerHTML}
                    </p>
                </div>
            </div>
        `;
      patch_avatar(new_listener.querySelector(".user-list-avatar"), name, "listener");
      let track_link = new_listener.querySelector(".user-list-about-me a");
      let artist = return_artist_from_track(track_link.getAttribute("href"), false);
      let track = correct_item_by_artist(track_link.textContent.trim(), artist);
      track_link.textContent = track;
      new_container.appendChild(new_listener);
    });
    view_buttons.after(new_container);
    panel.removeChild(legacy_top_listeners_container);
  }

  // src/config.js
  function create_settings_template() {
    localStorage.setItem("bleh", JSON.stringify(settings_template));
    return settings_template;
  }
  function load_settings(skip = false) {
    if (!skip) {
      for (var member in settings) delete settings[member];
      Object.assign(settings, JSON.parse(localStorage.getItem("bleh")) || create_settings_template());
    }
    for (let setting in settings_template)
      if (settings[setting] == void 0)
        settings[setting] = settings_template[setting];
    if (settings.dev == 1)
      settings.dev = true;
    for (let setting in settings) {
      if ((setting == "hue" || setting == "sat" || setting == "lit") && settings.hue == settings_base.hue.value && settings.sat == settings_base.sat.value && settings.lit == settings_base.lit.value) continue;
      try {
        document.body.style.setProperty(`--${settings_base[setting].css}`, `${settings[setting]}${settings_base[setting].unit}`);
      } catch (e) {
        console.log("bleh - setting base entry for", setting, "is not accessible");
      }
      document.documentElement.setAttribute(`data-bleh--${setting}`, `${settings[setting]}`);
    }
    load_skus();
    localStorage.setItem("bleh", JSON.stringify(settings));
    if (document.body.classList.contains("user-dashboard-layout")) {
      document.documentElement.setAttribute("data-bleh--theme", "oled");
      page.state.settings_reload = true;
    }
    load_chart_colours();
  }
  unsafeWindow.toggle_theme = function() {
    if (page.subpage.startsWith("listening-report"))
      return;
    let current_theme = settings.theme;
    if (current_theme == "dark")
      current_theme = "darker";
    else if (current_theme == "darker")
      current_theme = "oled";
    else if (current_theme == "oled" || current_theme == "classic")
      current_theme = "light";
    else if (current_theme == "light")
      current_theme = "dark";
    show_theme_change_in_menu(current_theme);
    settings.theme = current_theme;
    document.documentElement.setAttribute(`data-bleh--theme`, `${current_theme}`);
    localStorage.setItem("bleh", JSON.stringify(settings));
    load_chart_colours();
    if ((page.type == "artist" || page.type == "album" || page.type == "track") && page.subpage == "overview")
      bleh_music_page_charts();
    if (page.type == "user" && page.subpage.startsWith("library")) {
      bleh_glacier_date_graph_generate();
      bleh_glacier_insights();
    }
  };
  unsafeWindow.change_theme_from_settings = function(theme) {
    settings.theme = theme;
    document.documentElement.setAttribute(`data-bleh--theme`, `${theme}`);
    show_theme_change_in_settings(theme);
    show_theme_change_in_menu(theme);
    localStorage.setItem("bleh", JSON.stringify(settings));
  };
  unsafeWindow.change_theme_from_menu = function(theme) {
    if (page.subpage.startsWith("listening-report"))
      return;
    settings.theme = theme;
    document.documentElement.setAttribute(`data-bleh--theme`, `${theme}`);
    show_theme_change_in_menu(theme);
    localStorage.setItem("bleh", JSON.stringify(settings));
    load_chart_colours();
    if ((page.type == "artist" || page.type == "album" || page.type == "track") && page.subpage == "overview")
      bleh_music_page_charts();
    if (page.type == "user" && page.subpage.startsWith("library")) {
      bleh_glacier_date_graph_generate();
      bleh_glacier_insights();
    }
  };
  function reset_all() {
    for (let item in settings_base)
      reset_item(item);
  }
  function refresh_all(search = document) {
    for (let item in settings_base)
      update_item(item, settings[item], false, search);
  }
  function reset_item(item) {
    update_item(item, settings_base[item].value);
  }
  function update_params(params = {}) {
    for (let item in params) {
      update_item(item, params[item]);
    }
  }
  unsafeWindow._reset_all = function() {
    reset_all();
  };
  unsafeWindow._reset_item = function(item) {
    reset_item(item);
  };
  unsafeWindow._update_params = function(params = {}) {
    update_params(params);
  };
  unsafeWindow._update_item = function(item, value) {
    update_item(item, value);
  };
  function update_item(item, value, modify = true, search = document) {
    let container = search.querySelector(`#container-${item}`);
    if (container)
      console.info(container);
    else if (settings_base[item].type != "slider" && settings_base[item].type != "options")
      return;
    try {
      let new_value = false;
      if (value != settings[item])
        new_value = true;
      if (settings_base[item].require_reload && new_value)
        request_reload();
      if (settings_base[item].type == "slider" && modify)
        settings[item] = value;
      if (!modify)
        console.info(item, value, modify);
      if (settings_base[item].type == "slider") {
        try {
          let slider = search.querySelector(`#slider-${item}`);
          search.querySelector(`#value-${item}`).textContent = `${settings[item]}${settings_base[item].unit}`;
          slider.value = settings[item];
          search.querySelector(`#slider-track-${item}`).style.setProperty("--percent", `${settings[item] / slider.getAttribute("max") * 100}%`);
        } catch (e) {
        }
        document.body.style.setProperty(`--${settings_base[item].css}`, `${value}${settings_base[item].unit}`);
        document.documentElement.setAttribute(`data-bleh--${item}`, `${value}`);
        if (item == "hue" || item == "sat" || item == "lit") {
          if (settings.hue == settings_base.hue.value && settings.sat == settings_base.sat.value && settings.lit == settings_base.lit.value && settings.seasonal && stored_season.id != "none") {
            document.body.style.removeProperty(`--${settings_base.hue.css}`);
            document.body.style.removeProperty(`--${settings_base.sat.css}`);
            document.body.style.removeProperty(`--${settings_base.lit.css}`);
            document.documentElement.setAttribute("data-bleh--hsl-override", "true");
          } else {
            document.documentElement.setAttribute("data-bleh--hsl-override", "false");
          }
        }
      } else if (settings_base[item].type == "toggle") {
        if (settings[item] == settings_base[item].values[0] && modify) {
          settings[item] = settings_base[item].values[1];
          search.querySelector(`#toggle-${item}`).setAttribute("aria-checked", false);
          document.body.style.setProperty(`--${item}`, settings_base[item].values[1]);
          document.documentElement.setAttribute(`data-bleh--${item}`, `${settings_base[item].values[1]}`);
        } else if (modify) {
          settings[item] = settings_base[item].values[0];
          console.log(`toggle-${item}`);
          search.querySelector(`#toggle-${item}`).setAttribute("aria-checked", true);
          if (item == "dev") {
            dialog_legacy("prompt_dev", trans_legacy[lang].settings.performance.dev.name, `
                    <p class="alert alert-info">${trans_legacy[lang].settings.performance.dev.modals.prompt.alert}</p>
                    <br>
                    ${trans_legacy[lang].settings.performance.dev.modals.prompt.stylus}
                    <br>
                    <div class="browser-choices">
                        <button class="btn browser" onclick="_chosen_chrome()">
                            <img class="browser-icon" src="https://cutensilly.org/img/chrome.png">
                            <p>${trans_legacy[lang].settings.performance.dev.modals.prompt.browsers.chrome.name}</p>
                            <p class="caption">${trans_legacy[lang].settings.performance.dev.modals.prompt.browsers.chrome.bio}</p>
                        </button>
                        <button class="btn browser" onclick="_chosen_firefox()">
                            <img class="browser-icon" src="https://cutensilly.org/img/firefox.png">
                            <p>${trans_legacy[lang].settings.performance.dev.modals.prompt.browsers.firefox.name}</p>
                            <p class="caption">${trans_legacy[lang].settings.performance.dev.modals.prompt.browsers.firefox.bio}</p>
                        </button>
                    </div>
                `, true);
          }
          document.body.style.setProperty(`--${item}`, settings_base[item].values[0]);
          document.documentElement.setAttribute(`data-bleh--${item}`, `${settings_base[item].values[0]}`);
        } else {
          if (settings[item] == settings_base[item].values[0]) {
            search.querySelector(`#toggle-${item}`).setAttribute("aria-checked", true);
          } else {
            search.querySelector(`#toggle-${item}`).setAttribute("aria-checked", false);
          }
        }
      } else if (settings_base[item].type == "options") {
        if (modify) {
          settings[item] = value;
          document.body.style.setProperty(`--${item}`, value);
          document.documentElement.setAttribute(`data-bleh--${item}`, value);
          let toggle = document.getElementById(`toggle-${item}-${value}`);
          if (toggle)
            toggle.setAttribute("aria-checked", true);
          let other_toggles = search.querySelectorAll(`[data-toggle="${item}"]`);
          other_toggles.forEach((toggle2) => {
            let other_value = toggle2.getAttribute("data-toggle-value");
            if (other_value == value)
              return;
            else
              toggle2.setAttribute("aria-checked", false);
          });
          if ((item == "chart_view" || item == "chart_bar_axis") && page.type == "user" && page.subpage.startsWith("library"))
            bleh_glacier_date_graph_generate();
        } else {
          if (settings[item] == value) {
            document.getElementById(`toggle-${item}-${value}`).setAttribute("aria-checked", true);
          } else {
            document.getElementById(`toggle-${item}-${value}`).setAttribute("aria-checked", false);
          }
        }
      }
      if (modify)
        log(`updated ${item} to ${settings[item]}`, "settings");
      localStorage.setItem("bleh", JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
    if (container) {
      if (settings[item] != settings_base[item].value)
        container.classList.add("modified");
      else
        container.classList.remove("modified");
    }
    if (item == "hue" || item == "sat" || item == "lit") {
      update_colour_swatches();
      load_chart_colours();
    }
  }
  function request_reload() {
    if (page.type == "bleh_setup")
      return;
    log("requesting reload", "settings");
    reload_pending.state = true;
    notify({
      title: trans_legacy[lang].settings.reload.name,
      body: trans_legacy[lang].settings.reload.body,
      icon: "icon-16-refresh",
      persist: true,
      action: "_invoke_reload()"
    });
  }
  unsafeWindow._invoke_reload = function() {
    invoke_reload();
  };
  function invoke_reload() {
    window.location.reload();
  }
  function update_colour_swatches() {
    let found = false;
    let custom = null;
    let seasonal = null;
    let swatches = document.querySelectorAll(".swatch");
    swatches.forEach((swatch) => {
      let h = swatch.style.getPropertyValue("--hue-over");
      let s = swatch.style.getPropertyValue("--sat-over");
      let l = swatch.style.getPropertyValue("--lit-over");
      if (h == settings.hue && s == settings.sat && l == settings.lit || swatch.getAttribute("data-swatch-type") == "default" && settings.hue == 255 && settings.sat == 1 && settings.lit == 1) {
        swatch.setAttribute("aria-checked", "true");
        if (swatch.classList[0] != "dropdown-menu-clickable-item")
          found = true;
      } else {
        swatch.setAttribute("aria-checked", "false");
      }
      if (!custom && swatch.getAttribute("data-swatch-type") == "custom")
        custom = swatch;
      if (!seasonal && swatch.getAttribute("data-swatch-type") == "seasonal")
        seasonal = swatch;
    });
    if (found)
      return;
    if (custom && settings.accent_type != "season")
      custom.setAttribute("aria-checked", "true");
    else if (seasonal)
      seasonal.setAttribute("aria-checked", "true");
  }
  unsafeWindow._reset_inbuilt_item = function(item) {
    reset_inbuilt_item(item);
  };
  unsafeWindow._update_inbuilt_params = function(params = {}) {
    update_inbuilt_params(params);
  };
  unsafeWindow._update_inbuilt_item = function(item, value) {
    update_inbuilt_item(item, value);
  };
  function update_inbuilt_item(item, value, modify = true, element = document.body) {
    console.warn("update item", item, value, "modify", modify);
    let test_if_valid = element.querySelector(`#toggle-${item}`);
    console.warn(test_if_valid, `toggle-${item}`);
    if (test_if_valid == void 0)
      return;
    if (inbuilt_settings[item].type == "toggle") {
      if (modify) {
        value = document.getElementById(`toggle-${item}`).getAttribute("aria-checked") === "true";
        log(`updated (inbuilt) ${item} to ${!value}`, "settings");
      }
      if (value == inbuilt_settings[item].values[0] && modify) {
        element.querySelector(`#inbuilt-companion-checkbox-${item}`).checked = false;
        element.querySelector(`#toggle-${item}`).setAttribute("aria-checked", false);
        document.documentElement.setAttribute(`data-bleh--inbuilt-${item}`, inbuilt_settings[item].values[1]);
      } else if (modify) {
        element.querySelector(`#inbuilt-companion-checkbox-${item}`).checked = true;
        element.querySelector(`#toggle-${item}`).setAttribute("aria-checked", true);
        document.documentElement.setAttribute(`data-bleh--inbuilt-${item}`, inbuilt_settings[item].values[0]);
      } else {
        console.warn(item, value, value == true, value == false, typeof value, "boolean");
        if (value == true) {
          console.warn(item, value, "TRUE");
          element.querySelector(`#inbuilt-companion-checkbox-${item}`).checked = true;
          element.querySelector(`#toggle-${item}`).setAttribute("aria-checked", true);
          document.documentElement.setAttribute(`data-bleh--inbuilt-${item}`, true);
        } else if (value == false) {
          console.warn(item, value, "FALSE");
          element.querySelector(`#inbuilt-companion-checkbox-${item}`).checked = false;
          element.querySelector(`#toggle-${item}`).setAttribute("aria-checked", false);
          document.documentElement.setAttribute(`data-bleh--inbuilt-${item}`, false);
        }
      }
    }
  }
  unsafeWindow._chosen_chrome = function() {
    open("https://chromewebstore.google.com/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne");
    continue_dev();
  };
  unsafeWindow._chosen_firefox = function() {
    open("https://addons.mozilla.org/en-US/firefox/addon/styl-us/");
    continue_dev();
  };
  function continue_dev() {
    kill_window("prompt_dev");
    dialog_legacy("continue_dev", trans_legacy[lang].settings.performance.dev.name, `
        ${trans_legacy[lang].settings.performance.dev.modals.continue.next_step}
        <div class="modal-footer">
            <button class="btn primary continue" onclick="_finish_dev()">
                ${trans_legacy[lang].settings.continue}
            </button>
        </div>
    `);
  }
  unsafeWindow._finish_dev = function() {
    open("https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.css");
    kill_window("continue_dev");
    dialog_legacy("finish_dev", trans_legacy[lang].settings.performance.dev.name, `
        <p class="alert alert-success">${trans_legacy[lang].settings.performance.dev.modals.finish.alert}</p>
        <div class="modal-footer">
            <button class="btn primary done" onclick="_kill_window('finish_dev')">
                ${trans_legacy[lang].settings.done}
            </button>
        </div>
    `);
  };

  // src/seasonal.js
  function set_season() {
    if (!settings.seasonal)
      return;
    let last_season_seen = localStorage.getItem("bleh_last_season_seen") || "";
    let now = /* @__PURE__ */ new Date();
    log(`it is now ${now}`, "season", "log");
    stored_season.offset = calculate_offset(now);
    log(`calculated offset as ${stored_season.offset}`, "season");
    let current_year = now.getFullYear();
    seasonal_events.forEach((season, index) => {
      log(`running thru, ${season.id} - ${new Date(season.start.replace("y0", current_year).replace("{offset}", stored_season.offset))} ${new Date(season.end.replace("y0", current_year).replace("{offset}", stored_season.offset))}`, "season", "log");
      log(`${now >= new Date(season.start.replace("y0", current_year).replace("{offset}", stored_season.offset))} ${now <= new Date(season.end.replace("y0", current_year).replace("{offset}", stored_season.offset))}`, "season", "log");
      if (now >= new Date(season.start.replace("y0", current_year).replace("{offset}", stored_season.offset)) && now <= new Date(season.end.replace("y0", current_year).replace("{offset}", stored_season.offset))) {
        stored_season.now = now;
        stored_season.year = current_year;
        update_season_nav();
        if (stored_season.id == season.id)
          return;
        stored_season.id = season.id;
        stored_season.start = season.start;
        stored_season.end = season.end;
        stored_season.snowflakes = season.snowflakes;
        if (now.getDate() == 31) {
          stored_season.new_years_eve = true;
          stored_season.seasonal_timer = setInterval(update_season_nav, 1e3);
        } else if (stored_season.seasonal_timer) {
          clearInterval(stored_season.seasonal_timer);
        }
        if (seasonal_events[index + 1] == null) {
          stored_season.next_id = seasonal_events[0].id;
          stored_season.next_start = seasonal_events[0].start;
          stored_season.next_is_new_year = true;
        } else {
          stored_season.next_id = seasonal_events[index + 1].id;
          stored_season.next_start = seasonal_events[index + 1].start;
          stored_season.next_is_new_year = false;
        }
        log(`${season.id} from ${season.start} to ${season.end}`, "season");
        log(`next will be ${stored_season.next_id} from ${stored_season.next_start} (is new year? ${stored_season.next_is_new_year})`, "season");
        document.documentElement.setAttribute("data-bleh--season", season.id);
        if (season.snowflakes.state && settings.seasonal_particles) {
          log("let the snow start!", "season");
          prep_snow();
          let snowflakes_enabled = true;
          let snowflakes_count = season.snowflakes.count;
          if (settings.seasonal_particles_reduced && snowflakes_count > 10)
            snowflakes_count = snowflakes_count * 0.45;
          begin_snowflakes(snowflakes_enabled, snowflakes_count);
        }
        if (last_season_seen != "" && last_season_seen != season.id)
          deliver_notif(trans_legacy[lang].settings.customise.seasonal.announce.replace("{s}", trans_legacy[lang].settings.customise.seasonal.listing[stored_season.id]));
        localStorage.setItem("bleh_last_season_seen", season.id);
        load_chart_colours();
        return;
      }
    });
  }
  function calculate_offset(now) {
    let offset = now.getTimezoneOffset();
    if (offset == 0)
      return "+0000";
    if (offset < 0) {
      offset = Math.abs(offset);
      offset /= 60;
      if (offset < 10)
        offset = `0${offset}`;
      offset = `+${offset}`;
    } else {
      offset = -Math.abs(offset);
      offset /= 60;
      if (offset > -10)
        offset = offset.toString().replace("-", "-0");
    }
    return `${offset}00`;
  }
  function seasonal_timer_start(bypass = false) {
    if (stored_season.new_years_eve && !bypass)
      return;
    if (seasonal_timer.state != null)
      return;
    seasonal_timer.state = setInterval(set_season, 1e3);
    log("started interval", "season", "info");
    if (page.header.season_tooltip == null)
      return;
    page.header.season_tooltip.setContent(`
        <span class="season-colour-name">${trans_legacy[lang].settings.customise.seasonal.listing[stored_season.id]}</span>
        <span class="season-exclusive">${trans_legacy[lang].auth_menu.seasonal_live}</span>
    `);
    page.header.season.classList.add("live");
  }
  function seasonal_timer_end() {
    if (stored_season.new_years_eve)
      return;
    if (seasonal_timer.state == null)
      return;
    clearInterval(seasonal_timer.state);
    seasonal_timer.state = null;
    log("ended interval", "season", "info");
    if (page.header.season_tooltip == null)
      return;
    page.header.season_tooltip.setContent(`
        <span class="season-colour-name">${trans_legacy[lang].settings.customise.seasonal.listing[stored_season.id]}</span>
        <span class="season-exclusive">${trans_legacy[lang].auth_menu.seasonal_notice}</span>
    `);
    page.header.season.classList.remove("live");
  }
  function update_season_nav() {
    if (page.header.season == null)
      return;
    page.header.season.setAttribute("data-season", stored_season.id);
    if (!stored_season.new_years_eve) {
      page.header.season.textContent = moment(stored_season.end.replace("y0", stored_season.year).replace("{offset}", stored_season.offset)).to(stored_season.now, true);
    } else {
      let next = stored_season.next_start.replace("y0", stored_season.year).replace("{offset}", stored_season.offset);
      if (stored_season.next_is_new_year)
        next = stored_season.next_start.replace("y0", stored_season.year + 1).replace("{offset}", stored_season.offset);
      let time_until = new Date(next) - /* @__PURE__ */ new Date();
      page.header.season.textContent = countdown_to(time_until);
      page.header.season_tooltip.setContent(`
            <span class="season-colour-name">${trans_legacy[lang].settings.customise.seasonal.listing[stored_season.id]}</span>
            <span class="season-exclusive">${trans_legacy[lang].auth_menu.seasonal_live}</span>
        `);
    }
  }
  function countdown_to(time_until) {
    let days = Math.floor(time_until / (1e3 * 60 * 60 * 24));
    let hours = Math.floor(time_until % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60));
    let minutes = Math.floor(time_until % (1e3 * 60 * 60) / (1e3 * 60));
    let seconds = Math.floor(time_until % (1e3 * 60) / 1e3);
    console.info(time_until, hours, minutes, seconds);
    if (hours < 10)
      hours = "0" + hours;
    if (minutes < 10)
      minutes = "0" + minutes;
    if (seconds < 10)
      seconds = "0" + seconds;
    if (days != 0)
      return moment(stored_season.end.replace("y0", stored_season.year).replace("{offset}", stored_season.offset)).to(stored_season.now, true);
    if (hours == "00" && minutes == "00" && seconds == "00")
      set_season();
    if (hours == "00")
      return `${hours}:${minutes}:${seconds}`;
    else
      return `${hours}:${minutes}:${seconds}`;
  }
  function prep_snow() {
    let prev_container = document.getElementById("snowflakes");
    if (prev_container != null)
      return;
    let container = document.createElement("div");
    container.classList.add("snow-container");
    container.setAttribute("id", "snowflakes");
    container.innerHTML = `
        <span class="snow snowflake"></span>
    `;
    document.documentElement.appendChild(container);
  }
  function begin_snowflakes(enabled, count) {
    if (!enabled)
      return;
    let dynamic_css = "";
    var snow_html = "";
    for (let i = 1; i < count; i++) {
      snow_html += '<i class="snow"></i>';
      let rndX = snow_rand(0, 1e6) * 1e-4, rndO = snow_rand(-1e5, 1e5) * 1e-4, rndT = (snow_rand(3, 8) * 10).toFixed(2), rndS = (snow_rand(0, 1e4) * 1e-4).toFixed(2);
      dynamic_css += ".snow:nth-child(" + i + "){opacity:" + (snow_rand(1, 1e4) * 1e-4).toFixed(2) + ";transform:translate(" + rndX.toFixed(2) + "vw,-10px) scale(" + rndS + ");animation:fall-" + i + " " + snow_rand(10, 30) + "s -" + snow_rand(0, 30) + "s linear infinite}@keyframes fall-" + i + "{" + rndT + "%{transform:translate(" + (rndX + rndO).toFixed(2) + "vw," + rndT + "vh) scale(" + rndS + ")}to{transform:translate(" + (rndX + rndO / 2).toFixed(2) + "vw, 105vh) scale(" + rndS + ")}}";
    }
    document.getElementById("snowflakes").innerHTML = "<style>" + dynamic_css + "</style>" + snow_html;
  }
  function snow_rand(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  // src/components/select.js
  unsafeWindow._update_inbuilt_select = function(id, value) {
    update_inbuilt_select(id, value);
  };
  function update_inbuilt_select(id, value) {
    document.documentElement.setAttribute(`data-bleh--inbuilt-${id}`, value);
  }
  function custom_select(select, element_to_append) {
    console.info(select);
    let id = select.getAttribute("id");
    let value = select.value;
    let value_objects = select.querySelectorAll("option");
    let menu_list = document.createElement("div");
    value_objects.forEach((object) => {
      let object_value = object.getAttribute("value");
      let object_text = object.textContent;
      let item = document.createElement("button");
      item.classList.add("btn", "dropdown-menu-clickable-item", "select-item");
      item.setAttribute("onclick", `_set_custom_select_value('${id}', '${object_value}')`);
      item.setAttribute("data-value", object_value);
      item.setAttribute("type", "button");
      item.textContent = object_text;
      menu_list.appendChild(item);
    });
    let button = document.createElement("button");
    button.classList.add("select-button");
    button.setAttribute("id", `select-${id}`);
    button.setAttribute("type", "button");
    button.textContent = menu_list.querySelector(`[data-value="${value}"]`).textContent;
    let theme_menu_item = tippy(button, {
      theme: "select-menu",
      content: `
            ${menu_list.innerHTML}
        `,
      allowHTML: true,
      placement: "bottom",
      interactive: true,
      interactiveBorder: 10,
      trigger: "click",
      onShow(instance) {
        update_custom_select(instance.popper, select.value);
      }
    });
    element_to_append.appendChild(button);
  }
  unsafeWindow._set_custom_select_value = function(select_id, value) {
    let select = document.getElementById(select_id);
    select.value = value;
    console.info(select, `#select-${select_id}`);
    update_custom_select(document.getElementById(`select-${select_id}`)._tippy.popper, value, select_id);
    document.documentElement.setAttribute(`data-bleh--inbuilt-${select_id}`, value);
  };
  function update_custom_select(element = document.body, value = "", select_id = "") {
    let btns = element.querySelectorAll(".dropdown-menu-clickable-item");
    btns.forEach((btn) => {
      if (btn.getAttribute("data-value") != value) {
        btn.classList.remove("active");
      } else {
        btn.classList.add("active");
        let sel_button = document.body.querySelector(`#select-${select_id}`);
        console.log(sel_button);
        if (sel_button == null)
          return;
        sel_button.textContent = btn.textContent;
      }
    });
  }

  // src/pages/moderation.js
  var blocklists = /* @__PURE__ */ new Map();
  unsafeWindow.blocklists = blocklists;
  function bleh_moderation() {
    let container = page.structure.main.querySelector(".block-list-selector");
    let selector = container.querySelector("select");
    custom_select(selector, container);
    reload();
  }
  function load_moderation() {
    if (localStorage.getItem("bleh_moderation") == null) {
      localStorage.setItem("bleh_moderation", JSON.stringify([
        {
          url: "https://files.sad.ovh/public/bleh/b0_racist.txt",
          type: "strings"
        },
        {
          url: "https://files.sad.ovh/public/bleh/b4_sexual.txt",
          type: "strings"
        }
      ]));
    }
    const blocklist = JSON.parse(localStorage.getItem("bleh_moderation"));
    blocklist.forEach(async (z) => {
      if (!blocklists.has(z.url)) {
        let body;
        try {
          const req = await fetch(z.url);
          body = await req.text();
          log("successfully loaded " + z.url, "moderation");
        } catch (e) {
          console.error(e);
          log("failed to load blocklist " + z.url, "moderation");
        }
        let parsed;
        if (z.type == "strings") {
          parsed = body.split("\n");
        } else if (z.type == "regex") {
          parsed = body.split("\n").map((z2) => new RegExp(z2));
        }
        blocklists.set(z.url, {
          type: z.type,
          blocklist: parsed
        });
      }
    });
  }
  function reload() {
    const blocklistElement = document.getElementById("block-lists");
    blocklistElement.innerHTML = "";
    const blocklist = JSON.parse(localStorage.getItem("bleh_moderation"));
    blocklist.forEach(async (z, i) => {
      const elem = document.createElement("div");
      elem.className = "generic-table-list-entry";
      elem.innerHTML = `
        <div class="text">
            <h5><a href="${z.url}" target="_blank">${z.url}</a></h5>
        </div>
        <div class="text-2">
            <p>${z.type.substring(0, 1).toUpperCase() + z.type.slice(1)}</p>
        </div>
        <div class="actions">
            <button class="delete icon delete-user-button danger-subtle" onclick="_remove_block_index(${i})">${tl(trans.remove)}</button>
        </div>
        `;
      blocklistElement.appendChild(elem);
    });
    load_moderation();
  }
  unsafeWindow._remove_block_index = (i) => {
    const blocklist = JSON.parse(localStorage.getItem("bleh_moderation"));
    const removed = blocklist.splice(i, 1)[0];
    localStorage.setItem("bleh_moderation", JSON.stringify(blocklist));
    blocklists.delete(removed.url);
    reload();
  };
  unsafeWindow._add_block = () => {
    const input = document.getElementById("block-list-input");
    const type = document.getElementById("block-list-type");
    if (!input.value.trim()) return;
    try {
      new URL(input.value.trim());
    } catch (_) {
      return;
    }
    const blocklist = JSON.parse(localStorage.getItem("bleh_moderation"));
    blocklist.push({ url: input.value.trim(), type: type.value });
    localStorage.setItem("bleh_moderation", JSON.stringify(blocklist));
    reload();
    input.value = "";
  };

  // src/pages/bleh_config.js
  function bleh_settings() {
    page.type = "bleh_settings";
    page.subpage = "";
    update_page();
    page.structure.row.removeChild(page.structure.row.firstElementChild);
    page.structure.row.removeChild(page.structure.row.firstElementChild);
    let params = new URLSearchParams(document.location.search);
    page.requested.tab = params.get("tab");
    page.requested.setting = params.get("setting");
    let nav = document.createElement("nav");
    nav.classList.add("navlist", "secondary-nav", "navlist--more", "redesigned-navigation", "bleh-settings-navigation");
    nav.innerHTML = `
        <ul class="navlist-items">
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="home" onclick="_change_settings_page('home')">
                    ${tl(trans.home)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="themes" onclick="_change_settings_page('themes')">
                    ${tl(trans.appearance)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="customise" onclick="_change_settings_page('customise')">
                    ${tl(trans.layout)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="music" onclick="_change_settings_page('music')">
                    ${tl(trans.music)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="profiles" onclick="_change_settings_page('profiles')">
                    ${trans_legacy[lang].settings.profiles.name}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="seasonal" data-season="${stored_season.id}" onclick="_change_settings_page('seasonal')">
                    ${tl(trans.seasonal.name)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="moderation" onclick="_change_settings_page('moderation')">
                    ${tl(trans.moderation)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="text" onclick="_change_settings_page('text')">
                    ${trans_legacy[lang].settings.text.name}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="accessibility" onclick="_change_settings_page('accessibility')">
                    ${tl(trans.accessibility)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="performance" onclick="_change_settings_page('performance')">
                    ${tl(trans.troubleshooting)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item">
                <a class="secondary-nav-item-link bleh--nav" data-bleh-page="sku" onclick="_change_settings_page('sku')">
                    shhh...
                </a>
            </li>
        </ul>
    `;
    page.structure.side.innerHTML = `
        <div class="bleh--panel">
            ${!ff("bleh_settings_tabs") ? `
            <div class="btns">
                <button class="btn bleh--btn" data-bleh-page="home" onclick="_change_settings_page('home')">
                    ${tl(trans.home)}
                </button>
                <button class="btn bleh--btn" data-bleh-page="themes" onclick="_change_settings_page('themes')">
                    ${tl(trans.appearance)}
                </button>
                <button class="btn bleh--btn" data-bleh-page="customise" onclick="_change_settings_page('customise')">
                    ${tl(trans.layout)}
                </button>
                <button class="btn bleh--btn" data-bleh-page="music" onclick="_change_settings_page('music')">
                    ${tl(trans.music)}
                </button>
                <button class="btn bleh--btn" data-bleh-page="accessibility" onclick="_change_settings_page('accessibility')">
                    ${tl(trans.accessibility)}
                </button>
                <button class="btn bleh--btn" data-bleh-page="seasonal" data-season="${stored_season.id}" onclick="_change_settings_page('seasonal')">
                    ${tl(trans.seasonal.name)}
                </button>
            </div>
            <div class="btns sep">
                <button class="btn bleh--btn" data-bleh-page="text" onclick="_change_settings_page('text')">
                    ${trans_legacy[lang].settings.text.name}
                </button>
                <button class="btn bleh--btn" data-bleh-page="sku" onclick="_change_settings_page('sku')">
                    shhh...
                </button>
            </div>
            <div class="btns sep">
                <button class="btn" data-bleh-action="import" onclick="_import_settings()">
                    ${tl(trans.import)}
                </button>
                <button class="btn" data-bleh-action="export" onclick="_export_settings()">
                    ${tl(trans.export)}
                </button>
            </div>
            <div class="btns sep">
                <button class="btn bleh--btn" data-bleh-page="profiles" onclick="_change_settings_page('profiles')">
                    ${trans_legacy[lang].settings.profiles.name}
                </button>
                <button class="btn bleh--btn" data-bleh-page="performance" onclick="_change_settings_page('performance')">
                    ${tl(trans.troubleshooting)}
                </button>
                <button class="btn" data-bleh-action="reset" onclick="_reset_settings()">
                    ${tl(trans.reset)}
                </button>
            </div>
            ` : `
            ${ff("skip_to_setting") ? `
            <h4>${trans_legacy[lang].settings.skip_to.name}</h4>
            <div class="skip-to-list"></div>
            ` : ""}
            ${ff("skip_to_setting") ? '<div class="btns sep">' : '<div class="btns">'}
                <button class="btn" data-bleh-action="import" onclick="_import_settings()">
                    ${tl(trans.import)}
                </button>
                <button class="btn" data-bleh-action="export" onclick="_export_settings()">
                    ${tl(trans.export)}
                </button>
                <button class="btn" data-bleh-action="reset" onclick="_reset_settings()">
                    ${tl(trans.reset)}
                </button>
            </div>
            `}
            ${settings.feature_flags.changelogs != false ? `
            <div class="btns">
                <button class="btn bleh--btn primary" data-bleh-page="changelog" onclick="_query_changelog()">
                    ${tl(trans.changelog)}
                </button>
            </div>
            ` : ""}
        </div>
    `;
    page.structure.container.insertBefore(nav, page.structure.row);
    if (page.requested.tab == null)
      change_settings_page("themes");
    else
      change_settings_page(page.requested.tab);
    if (page.requested.setting != null) {
      scroll_to_setting(page.requested.setting);
    }
  }
  function render_setting_page(page_id) {
    if (page_id == "home") {
      register_skip_to([]);
      let sponsoring = false;
      if (sponsor_list)
        sponsoring = sponsor_list.sponsors.includes(auth.name);
      return `
        <div class="bleh--panel">
            <h4 class="top-header">${tl(trans.home)}</h4>
            <div class="user-top-panel" data-sponsoring="${sponsoring}">
                <div class="user-top-avatar user-top-avatar-side-left"></div>
                <img class="user-top-avatar user-top-avatar-main" src="${auth.avatar.replace("avatar42s", "avatar300s")}" alt="${auth.name}">
                <div class="user-top-avatar user-top-avatar-side-right"></div>
            </div>
            ${sponsoring ? `
            <h4>${trans_legacy[lang].settings.home.sponsor.thanks.replace("{m}", `<a class="mention" href="${root}user/${auth.name}">@${auth.name}</a>`).replace("{v}", `<span class="version-link" onclick="_change_settings_page('sku')">${version.build}.${version.sku}</span>`)}</h4>
            ` : `
            <h4>${trans_legacy[lang].settings.home.thanks.replace("{m}", `<a class="mention" href="${root}user/${auth.name}">@${auth.name}</a>`).replace("{v}", `<span class="version-link" onclick="_change_settings_page('sku')">${version.build}.${version.sku}</span>`)}</h4>
            `}
            <div class="screen-row actions-only">
                <div class="actions">
                    <button class="btn primary update icon" onclick="_force_refresh_theme()">
                        ${trans_legacy[lang].settings.home.update.update_now}
                    </button>
                    ${settings.dev ? `
                    <a class="btn primary update icon" href="https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.css">
                        ${trans_legacy[lang].settings.home.update.css}
                    </a>
                    ` : ""}
                    ${ff("sponsor") ? `
                    <button class="btn primary sponsor" onclick="_sponsor()">
                        ${trans_legacy[lang].settings.home.sponsor.name}<div class="new-badge">${trans_legacy[lang].settings.new}</div>
                    </button>
                    ` : ""}
                    <a class="btn action bleh--issues" href="https://github.com/katelyynn/bleh/issues" target="_blank">
                        ${trans_legacy[lang].settings.home.issues.name}
                    </a>
                </div>
            </div>
            <div class="sep"></div>
            <h4>${tl(trans.seasonal.name)}</h4>
            <div class="current-season-box no-margin" data-season="${stored_season.id}">
                <div class="current-season-info">
                    <div class="bleh-icon bleh-seasonal-icon" data-season="${stored_season.id}"></div>
                    <h4>${trans_legacy[lang].settings.customise.seasonal.listing[stored_season.id]}</h4>
                </div>
                <div class="glacier-library-top season-top">
                    <div class="glacier-library-metadata">
                        ${stored_season.id != "none" && stored_season.start && stored_season.end ? `
                        <div class="glacier-library-metadata-item">
                            <div class="sub-text">${trans_legacy[lang].settings.customise.seasonal.started}</div>
                            <div class="glacier-library-metadata-item-value" id="current_season">${moment(stored_season.start.replace("y0", stored_season.year).replace("{offset}", stored_season.offset)).from(stored_season.now)}</div>
                        </div>
                        <div class="glacier-library-metadata-item">
                            <div class="sub-text">${trans_legacy[lang].settings.customise.seasonal.ends_in}</div>
                            <div class="glacier-library-metadata-item-value" id="current_season_start">${moment(stored_season.end.replace("y0", stored_season.year).replace("{offset}", stored_season.offset)).to(stored_season.now, true)}</div>
                        </div>
                        ` : ""}
                    </div>
                </div>
            </div>
            <button class="btn continue" onclick="_change_settings_page('seasonal')">
                ${trans_legacy[lang].settings.customise.seasonal.view}
            </button>
            <h4>${trans_legacy[lang].settings.home.recommended}</h4>
            <div class="setting-items full">
                <div class="side-right full">
                    <button class="btn setting-item bleh--themes" onclick="_change_settings_page('themes')">
                        <div class="text">
                            <h5>${tl(trans.themes.name)}</h5>
                            <p>${trans_legacy[lang].settings.themes.bio}</p>
                        </div>
                    </button>
                    <button class="btn setting-item bleh--palette" onclick="_change_settings_page('themes')">
                        <div class="text">
                            <h5>${trans_legacy[lang].settings.home.colours.name}</h5>
                            <p>${trans_legacy[lang].settings.home.colours.bio}</p>
                        </div>
                    </button>
                    <button class="btn setting-item bleh--corrections" onclick="_change_settings_page('music', 'corrections')">
                        <div class="text">
                            <h5>${trans_legacy[lang].settings.corrections.name}</h5>
                            <p>${trans_legacy[lang].settings.corrections.bio}</p>
                        </div>
                    </button>
                    <button class="btn setting-item bleh--motion" onclick="_change_settings_page('accessibility')">
                        <div class="text">
                            <h5>${trans_legacy[lang].settings.accessibility.reduced_motion.name}</h5>
                            <p>${trans_legacy[lang].settings.accessibility.reduced_motion.bio}</p>
                        </div>
                    </button>
                    <button class="btn setting-item bleh--link" onclick="_change_settings_page('accessibility')">
                        <div class="text">
                            <h5>${trans_legacy[lang].settings.accessibility.underline_links.name}</h5>
                            <p>${trans_legacy[lang].settings.accessibility.underline_links.bio}</p>
                        </div>
                    </button>
                </div>
            </div>
            <div class="sep"></div>
            <h4>Try out the latest</h4>
            <div class="setting-items">
                <div class="side-left">
                    <a class="btn setting-item has-image bleh--bwaa" href="https://cutensilly.org/bwaa/fm" target="_blank">
                        <div class="image"></div>
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
        `;
    } else if (page_id == "themes") {
      register_skip_to([
        {
          id: "hue_from_album",
          name: tl(trans.hue_from_album.name)
        },
        {
          id: "colourful_tracks",
          name: tl(trans.colourful_tracks.name)
        },
        {
          id: "colourful_counts",
          name: trans_legacy[lang].settings.customise.colourful_counts.name
        }
      ]);
      let preview_bar = "background: linear-gradient(90deg";
      let preview_bar_text = "";
      let global_sat = getComputedStyle(document.body).getPropertyValue("--sat");
      let global_lit = getComputedStyle(document.body).getPropertyValue("--lit");
      let h3_sat = getComputedStyle(document.body).getPropertyValue("--h3-sat");
      let h3_lit = getComputedStyle(document.body).getPropertyValue("--h3-lit");
      let maximum = 16e3;
      let max_rank = 11;
      for (let rank = 0; rank <= max_rank; rank++) {
        let this_rank = ranks[parseInt(rank)];
        let percent = this_rank.start / maximum * 100;
        preview_bar = `${preview_bar}, hsl(${this_rank.hue}, ${h3_sat.replace(global_sat, this_rank.sat)}, ${h3_lit.replace(global_lit, this_rank.lit)}) ${percent}%`;
        if ((this_rank.start > 500 || this_rank.start == 0) && this_rank.start != 1500) {
          let text = `${this_rank.start}`;
          preview_bar_text = `${preview_bar_text}<div class="preview-bar-text-entry" style="left: ${percent}%">${text.replaceAll("_", ",")}</div>`;
        }
      }
      preview_bar = `${preview_bar});`;
      return `
            <div class="bleh--panel">
                <h4 class="top-header">${tl(trans.appearance)}</h4>
                <h4>${tl(trans.themes.name)}</h4>
                <!--<h4>${trans_legacy[lang].settings.themes.dark.name}</h4>-->
                <div class="setting-items full">
                    <div class="side-left full even-more">
                        <button class="btn theme-item" data-bleh-theme="light" onclick="change_theme_from_settings('light')">
                            <div class="preview" data-bleh--theme="light">
                                ${theme_preview}
                            </div>
                            <div class="text">
                                <h5>${tl(trans.themes.light)}</h5>
                            </div>
                        </button>
                        <button class="btn theme-item" data-bleh-theme="dark" onclick="change_theme_from_settings('dark')">
                            <div class="preview" data-bleh--theme="dark">
                                ${theme_preview}
                            </div>
                            <div class="text">
                                <h5>${tl(trans.themes.dark)}</h5>
                            </div>
                        </button>
                        <button class="btn theme-item" data-bleh-theme="darker" onclick="change_theme_from_settings('darker')">
                            <div class="preview" data-bleh--theme="darker">
                                ${theme_preview}
                            </div>
                            <div class="text">
                                <h5>${tl(trans.themes.darker)}</h5>
                            </div>
                        </button>
                        <button class="btn theme-item" data-bleh-theme="oled" onclick="change_theme_from_settings('oled')">
                            <div class="preview" data-bleh--theme="oled">
                                ${theme_preview}
                            </div>
                            <div class="text">
                                <h5>${tl(trans.themes.oled)}</h5>
                            </div>
                        </button>
                    </div>
                </div>
                ${ff("high_contrast") ? `
                <div class="toggle-container" id="container-high_contrast" onclick="_update_item('high_contrast')">
                    <button class="btn reset" onclick="_reset_item('high_contrast')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.high_contrast.name}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-high_contrast" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                ` : ""}
                <div class="sep"></div>
                <h4>${tl(trans.colours)}</h4>
                <div class="inner-preview pad">
                    <div class="palette">
                        <div class="swatch" style="--col: hsl(var(--l2-c))"></div>
                        <div class="swatch" style="--col: hsl(var(--l3-c))"></div>
                        <div class="swatch" style="--col: hsl(var(--l4-c))"></div>
                        <div class="swatch" style="--col: hsl(var(--l2))"></div>
                        <div class="swatch" style="--col: hsl(var(--l3))"></div>
                        <div class="swatch" style="--col: hsl(var(--l4))"></div>
                    </div>
                    <table class="chartlist chartlist--with-image chartlist--with-loved chartlist--with-artist" style="margin: var(--card-gap) 0 !important">
                        <tbody>
                            <tr class="chartlist-row chartlist-row--now-scrobbling chartlist-row--with-artist" style="transition: none !important">
                                <td class="chartlist-image">
                                    <a class="cover-art"><img src="${auth.avatar.replace("/avatar42s/", "/avatar170s/")}" loading="lazy"></a>
                                </td>
                                <td class="chartlist-loved">
                                    <button class="chartlist-love-button" data-toggle-button-current-state="unloved"></button>
                                </td>
                                <td class="chartlist-name">
                                    <a>Song title</a>
                                </td>
                                <td class="chartlist-artist">
                                    <a>${auth.name}</a>
                                </td>
                                <td class="chartlist-timestamp chartlist-timestamp--lang-en">
                                    <span class="chartlist-now-scrobbling">
                                        <a>Scrobbling now</a>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="btn-row">
                        <button class="btn">${trans_legacy[lang].settings.examples.button}</button>
                        <button class="btn primary">${trans_legacy[lang].settings.examples.button}</button>
                        <div class="chartlist-count-bar">
                            <a class="chartlist-count-bar-link">
                                <span class="chartlist-count-bar-slug" style="width: 60%"></span>
                                <span class="chartlist-count-bar-value">44,551</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="view-buttons colour-buttons view-buttons-middle" id="colour_custom"></div>
                <div class="swatch-group">
                    <div id="colour_red" class="palette options colours"></div>
                    <div id="colour_orange" class="palette options colours"></div>
                    <div id="colour_yellow" class="palette options colours"></div>
                    <div id="colour_green" class="palette options colours"></div>
                    <div id="colour_lime" class="palette options colours"></div>
                    <div id="colour_aqua" class="palette options colours"></div>
                    <div id="colour_blue" class="palette options colours"></div>
                    <div id="colour_purple" class="palette options colours"></div>
                    <div id="colour_pink" class="palette options colours"></div>
                </div>
                <div class="toggle-container" id="container-hue_from_album" onclick="_update_item('hue_from_album')">
                    <button class="btn reset" onclick="_reset_item('hue_from_album')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${tl(trans.hue_from_album.name)}</h5>
                        <p>${tl(trans.hue_from_album.body)}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-hue_from_album" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-colourful_tracks" onclick="_update_item('colourful_tracks')">
                    <button class="btn reset" onclick="_reset_item('colourful_tracks')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${tl(trans.colourful_tracks.name)}</h5>
                        <p>${tl(trans.colourful_tracks.body)}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-colourful_tracks" aria-checked="true">
                            <div class="dot"></div>
                        </button>
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
                                <div class="fill not-colourful-example" style="width: 100%"></div>
                                <div class="fill colourful-example" style="width: 100%; --hue: -16.888749999999998; --sat: 1.5; --lit: 0.875"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="bar">
                                <div class="fill not-colourful-example" style="width: 85%"></div>
                                <div class="fill colourful-example" style="width: 85%; --hue: 0.21863999999999972; --sat: 1.399218; --lit: 0.891406"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="bar">
                                <div class="fill not-colourful-example" style="width: 60%"></div>
                                <div class="fill colourful-example" style="width: 60%; --hue: 18.77; --sat: 1.425; --lit: 0.9175833333333334"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="bar">
                                <div class="fill not-colourful-example" style="width: 30%"></div>
                                <div class="fill colourful-example" style="width: 30%; --hue: 50.769767441860466; --sat: 1.361813953488372; --lit: 0.943406976744186"></div>
                            </div>
                        </div>
                        <div class="track">
                            <div class="cover"></div>
                            <div class="title"></div>
                            <div class="bar">
                                <div class="fill not-colourful-example" style="width: 5%"></div>
                                <div class="fill colourful-example" style="width: 5%; --hue: 92.42; --sat: 1.35; --lit: 0.925"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="toggle-container" id="container-colourful_counts" onclick="_update_item('colourful_counts')">
                    <button class="btn reset" onclick="_reset_item('colourful_counts')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.colourful_counts.name}</h5>
                        <p>${trans_legacy[lang].settings.customise.colourful_counts.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-colourful_counts" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            `;
    } else if (page_id == "customise") {
      register_skip_to([
        {
          id: "profile_avi_background",
          name: trans_legacy[lang].settings.customise.profile_header.see_type
        },
        {
          id: "profile_header_own",
          name: trans_legacy[lang].settings.customise.profile_header.view_on
        },
        {
          id: "show_your_progress",
          name: trans_legacy[lang].settings.customise.show_your_progress.name
        }
      ]);
      return `
            <div class="bleh--panel check-artist-hover">
                <h4 class="top-header">${tl(trans.layout)}</h4>
                <h4>${trans_legacy[lang].settings.layout.header}</h4>
                <div class="inner-preview pad">
                    <div class="profile-mockup artist">
                        <div class="mockup-header">
                            <div class="mockup-avatar-wrap">
                                <img class="mockup-avatar" src="https://lastfm.freetls.fastly.net/i/u/avatar170s/383d6c03304e720075d0050e8a6a4644">
                            </div>
                            <div class="mockup-info">
                                <div class="mockup-subtext"></div>
                                <div class="mockup-name"></div>
                            </div>
                            <div class="mockup-actions">
                                <div class="mockup-big-button">
                                    <div class="mockup-text"></div>
                                </div>
                            </div>
                        </div>
                        <div class="mockup-container">
                            <div class="mockup-col-main">
                                <div class="mockup-panel"></div>
                                <div class="mockup-panel main"></div>
                            </div>
                            <div class="mockup-col-sidebar">
                                <div class="mockup-panel"></div>
                                <div class="mockup-panel main"></div>
                            </div>
                        </div>
                        <div class="profile-mockup-background" style="background-image: url(https://lastfm.freetls.fastly.net/i/u/avatar170s/383d6c03304e720075d0050e8a6a4644);"></div>
                    </div>
                </div>
                <h4>${trans_legacy[lang].settings.layout.avatar_action.name}</h4>
                <p>${trans_legacy[lang].settings.layout.avatar_action.bio}</p>
                <div class="primary-selections artist-hover-image">
                    <div class="btn primary-selection" id="toggle-default_avatar_action-expand" data-toggle="default_avatar_action" data-toggle-value="expand" onclick="_update_item('default_avatar_action', 'expand')">
                        <h5>${trans_legacy[lang].gallery.open.name}</h5>
                    </div>
                    <div class="btn primary-selection" id="toggle-default_avatar_action-gallery" data-toggle="default_avatar_action" data-toggle-value="gallery" onclick="_update_item('default_avatar_action', 'gallery')">
                        <h5>${trans_legacy[lang].settings.layout.avatar_action.gallery}</h5>
                    </div>
                </div>
                <h4>${trans_legacy[lang].settings.layout.quick_artist_button.name}</h4>
                <p>${trans_legacy[lang].settings.layout.quick_artist_button.bio}</p>
                <div class="primary-selections artist-hover-button">
                    <div class="btn primary-selection" id="toggle-quick_artist_button-gallery" data-toggle="quick_artist_button" data-toggle-value="gallery" onclick="_update_item('quick_artist_button', 'gallery')">
                        <h5>${trans_legacy[lang].gallery.view}</h5>
                    </div>
                    <div class="btn primary-selection" id="toggle-quick_artist_button-shouts" data-toggle="quick_artist_button" data-toggle-value="shouts" onclick="_update_item('quick_artist_button', 'shouts')">
                        <h5>${trans_legacy[lang].settings.layout.quick_artist_button.shouts}</h5>
                    </div>
                    <div class="btn primary-selection" id="toggle-quick_artist_button-wiki" data-toggle="quick_artist_button" data-toggle-value="wiki" onclick="_update_item('quick_artist_button', 'wiki')">
                        <h5>${trans_legacy[lang].settings.layout.quick_artist_button.wiki}</h5>
                    </div>
                    <div class="btn primary-selection" id="toggle-quick_artist_button-listens" data-toggle="quick_artist_button" data-toggle-value="listens" onclick="_update_item('quick_artist_button', 'listens')">
                        <h5>${trans_legacy[lang].settings.layout.quick_artist_button.listens}</h5>
                    </div>
                </div>
            </div>
            <div class="bleh--panel">
                <h4>${trans_legacy[lang].settings.customise.profile_header.name}</h4>
                <div class="inner-preview pad">
                    <div class="profile-mockup">
                        <div class="mockup-header">
                            <img class="mockup-avatar" src="${auth.avatar}">
                            <div class="mockup-info">
                                <div class="mockup-subtext"></div>
                                <div class="mockup-name"></div>
                            </div>
                        </div>
                        <div class="mockup-container">
                            <div class="mockup-col-main">
                                <div class="mockup-panel main"></div>
                            </div>
                            <div class="mockup-col-sidebar">
                                <div class="mockup-panel mockup-obsession-panel">
                                    <img class="mockup-obsession-art" src="https://lastfm.freetls.fastly.net/i/u/64s/510546e3b6df7504392274c528c77780.jpg">
                                    <div class="mockup-obsession-name"></div>
                                </div>
                                <div class="mockup-panel main"></div>
                            </div>
                        </div>
                        <div class="profile-mockup-background from-avatar" style="background-image: url(${auth.avatar});"></div>
                        <div class="profile-mockup-background from-track" style="background-image: url(https://lastfm.freetls.fastly.net/i/u/avatar170s/df927f4f88034b7f9a651636b965c9d7);"></div>
                    </div>
                </div>
                <div class="toggle-container" id="container-profile_avi_background" onclick="_update_item('profile_avi_background')">
                    <button class="btn reset" onclick="_reset_item('profile_avi_background')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.profile_header.see_type}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-profile_avi_background" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <h4>${trans_legacy[lang].settings.customise.profile_header.view_on}</h4>
                <div class="toggle-container" id="container-profile_header_own" onclick="_update_item('profile_header_own')">
                    <button class="btn reset" onclick="_reset_item('profile_header_own')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.profile_header.for_own}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-profile_header_own" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-profile_header_others" onclick="_update_item('profile_header_others')">
                    <button class="btn reset" onclick="_reset_item('profile_header_others')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.profile_header.for_others}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-profile_header_others" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="toggle-container" id="container-show_your_progress" onclick="_update_item('show_your_progress')">
                    <button class="btn reset" onclick="_reset_item('show_your_progress')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.show_your_progress.name}</h5>
                        <p>${trans_legacy[lang].settings.customise.show_your_progress.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-show_your_progress" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="toggle-container" id="container-rain" onclick="_update_item('rain')">
                    <button class="btn reset" onclick="_reset_item('rain')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.rain.name}</h5>
                        <p>${trans_legacy[lang].settings.customise.rain.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-rain" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            `;
    } else if (page_id == "seasonal") {
      register_skip_to([]);
      return `
            <div class="bleh--panel">
                <div class="seasonal-inner">
                    <div class="sub-text">${trans_legacy[lang].settings.customise.seasonal.timeline}</div>
                    <h4>${moment(stored_season.now).format("MMMM Do YYYY")}</h4>
                    <div class="current-season-box" data-season="${stored_season.id}">
                        <div class="current-season-info">
                            <div class="bleh-icon bleh-seasonal-icon" data-season="${stored_season.id}"></div>
                            <h4>${trans_legacy[lang].settings.customise.seasonal.listing[stored_season.id]}</h4>
                        </div>
                        <div class="glacier-library-top season-top">
                            <div class="glacier-library-metadata">
                                ${stored_season.id != "none" && stored_season.start && stored_season.end ? `
                                <div class="glacier-library-metadata-item">
                                    <div class="sub-text">${trans_legacy[lang].settings.customise.seasonal.started}</div>
                                    <div class="glacier-library-metadata-item-value" id="current_season_start">${moment(stored_season.start.replace("y0", stored_season.year).replace("{offset}", stored_season.offset)).from(stored_season.now)}</div>
                                </div>
                                <div class="glacier-library-metadata-item">
                                    <div class="sub-text">${trans_legacy[lang].settings.customise.seasonal.ends_in}</div>
                                    <div class="glacier-library-metadata-item-value" id="current_season">${moment(stored_season.end.replace("y0", stored_season.year).replace("{offset}", stored_season.offset)).to(stored_season.now, true)}</div>
                                </div>
                                ` : ""}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="info-box no-padding">
                    <div class="bleh-icon bleh-info-icon"></div>
                    ${trans_legacy[lang].settings.customise.seasonal.info.replace("{offset}", `<code>${stored_season.offset}</code>`)}
                </div>
                <!--<p>${trans_legacy[lang].settings.customise.seasonal.bio}</p>
                <div class="inner-preview pad click-thru">
                    <div class="current-season-container">
                        <div class="current-season" data-season="${stored_season.id}" id="current_season">
                            ${stored_season.id != "none" ? trans_legacy[lang].settings.customise.seasonal.marker.current.replace("{season}", trans_legacy[lang].settings.customise.seasonal.listing[stored_season.id]) : settings.seasonal ? trans_legacy[lang].settings.customise.seasonal.marker.none : trans_legacy[lang].settings.customise.seasonal.marker.disabled}
                        </div>
                        <div class="current-season-started" id="current_season_start">
                            ${stored_season.id != "none" ? trans_legacy[lang].settings.customise.seasonal.marker.started : ""}
                        </div>
                    </div>
                </div>-->
                <h4>${trans_legacy[lang].settings.configure}</h4>
                <div class="toggle-container" id="container-seasonal" onclick="_update_item('seasonal')">
                    <button class="btn reset" onclick="_reset_item('seasonal')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.seasonal.option.name}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-seasonal" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="toggle-container hide-if-seasonal-disabled" id="container-seasonal_particles" onclick="_update_item('seasonal_particles')">
                    <button class="btn reset" onclick="_reset_item('seasonal_particles')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.seasonal.particles.name}</h5>
                        <p>${trans_legacy[lang].settings.customise.seasonal.particles.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-seasonal_particles" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container hide-if-seasonal-disabled" id="container-seasonal_particles_reduced" onclick="_update_item('seasonal_particles_reduced')">
                    <button class="btn reset" onclick="_reset_item('seasonal_particles_reduced')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.seasonal.show_less_particles.name}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-seasonal_particles_reduced" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container hide-if-seasonal-disabled" id="container-seasonal_particles_fps" onclick="_update_item('seasonal_particles_fps')">
                    <button class="btn reset" onclick="_reset_item('seasonal_particles_fps')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.seasonal.fps_particles.name}</h5>
                        <p>${trans_legacy[lang].settings.customise.seasonal.fps_particles.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-seasonal_particles_fps" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="toggle-container hide-if-seasonal-disabled" id="container-seasonal_overlays" onclick="_update_item('seasonal_overlays')">
                    <button class="btn reset" onclick="_reset_item('seasonal_overlays')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.seasonal.overlays.name}</h5>
                        <p>${trans_legacy[lang].settings.customise.seasonal.overlays.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-seasonal_overlays" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else if (page_id == "performance") {
      register_skip_to([]);
      return `
            <div class="bleh--panel">
                <h4 class="top-header">${tl(trans.troubleshooting)}</h4>
                <p>${trans_legacy[lang].settings.performance.bio}</p>
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
                    <button class="btn reset" onclick="_reset_item('dev')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.performance.dev.name}</h5>
                        <p>${trans_legacy[lang].settings.performance.dev.bio}</p>
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
                        <h5>${trans_legacy[lang].settings.performance.bug.name}</h5>
                        <p>${trans_legacy[lang].settings.performance.bug.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <a class="btn bleh--btn primary" href="https://github.com/katelyynn/bleh/issues/new/choose" target="_blank">${trans_legacy[lang].settings.go}</a>
                    </div>
                </div>
                <div class="sep"></div>
                <h4>Debug information</h4>
                <ul>
                    <li>Theme loading is currently ${!settings.dev}</li>
                    <li><span class="lotus lotus-name lotus-name-small">lotus</span> is currently ${settings.corrections}</li>
                    <br>
                    <li>Theme will expire at <span class="time">${moment(localStorage.getItem("bleh_cached_style_timeout")).format("HH:mm:ss Z")}</span></li>
                    <li><span class="lotus lotus-name lotus-name-small">lotus</span> (artist) will expire at <span class="time">${moment(localStorage.getItem("lotus_artist_expire")).format("HH:mm:ss Z")}</span></li>
                    <li><span class="lotus lotus-name lotus-name-small">lotus</span> (album_track) will expire at <span class="time">${moment(localStorage.getItem("lotus_album_track_expire")).format("HH:mm:ss Z")}</span></li>
                    <br>
                    <li>It is currently <span class="time">${moment().format("HH:mm:ss Z")}</span></li>
                    <br>
                    <li>Has the timeout expired? ${new Date(localStorage.getItem("bleh_cached_style_timeout")) < /* @__PURE__ */ new Date()}</li>
                </ul>
                <div class="sep"></div>
                <h4>Debugging interactions</h4>
                <button class="continue" onclick="_notify({
                id: 'test',
                title: 'testing!',
                body: 'haaaiaiii test bodyyy.......'
                })">Deliver notification</button>
                <button class="continue" onclick="_notify({
                id: 'test',
                title: 'testing!',
                body: 'haaaiaiii test bodyyy.......',
                persist: true
                })">Deliver persistent notification</button>
                <div class="sep"></div>
                <h4>Manage flags</h4>
                <button class="continue" onclick="_change_settings_page('sku')">Open sku page</button>
            </div>
            `;
    } else if (page_id == "profiles") {
      register_skip_to([
        {
          id: "profile_shortcut",
          type: "text",
          name: trans_legacy[lang].settings.music.profile_shortcut.name
        },
        {
          id: "activities",
          name: trans_legacy[lang].settings.activities.toggle.name
        }
      ]);
      let sponsoring = false;
      if (sponsor_list)
        sponsoring = sponsor_list.sponsors.includes(auth.name);
      return `
            <div class="bleh--panel sponsor-badge-panel" data-sponsoring="${sponsoring}">
                <div class="profile-container">
                    <div class="avatar-side small">
                        <div class="avatar">
                            <img src="${auth.avatar.replace("/avatar42s/", "/avatar170s/")}" alt="Your avatar" loading="lazy">
                        </div>
                    </div>
                    <div class="info-side">
                        <div class="header-info">
                            <div class="sub-text">${trans_legacy[lang].settings.profiles.you}</div>
                            <div class="header standalone title-container">
                                <h1>${auth.name}</h1>
                                ${auth.pro ? `
                                <span class="label user-status-subscriber">${tl(trans.badges["user-status-subscriber"].name)}</span>
                                ` : ""}
                            </div>
                        </div>
                    </div>
                </div>
                ${ff("api") ? `
                <h4>${trans_legacy[lang].settings.profiles.api.name}</h4>
                <div class="alert alert-info">${trans_legacy[lang].settings.profiles.api.bio}</div>
                <div class="text-container" id="container-api_key">
                    <button class="btn reset" onclick="_reset_item('api_key')">${tl(trans.reset)}</button>
                    <div class="heading content-form">
                        <div class="input-container">
                            <input type="password" maxlength="120" id="text-api_key" value="${settings.api_key}" placeholder="${trans_legacy[lang].settings.profiles.api.placeholder}">
                            <button class="btn primary save" onclick="_save_api_key()">${trans_legacy[lang].settings.save}</button>
                            <a class="btn-add" href="${root}api/account/create" target="_blank">${trans_legacy[lang].settings.create}</a>
                        </div>
                    </div>
                </div>
                ` : ""}
                <div class="sep"></div>
                ${sponsoring ? `
                <h4>${trans_legacy[lang].settings.home.sponsor.status.yes}</h4>
                <div class="alert alert-info">${trans_legacy[lang].settings.home.sponsor.version.replace("{v}", `<span class="version-link sponsor-related">${sponsor_list.latest}</span>`)}</div>
                <div class="screen-row actions-only">
                    <div class="actions">
                        <button class="btn primary sponsor" onclick="_sponsor_manage()">
                            ${trans_legacy[lang].settings.home.sponsor.manage}<div class="new-badge">${trans_legacy[lang].settings.new}</div>
                        </button>
                        <button class="btn refresh icon" onclick="_sponsor_check()">
                            ${trans_legacy[lang].settings.home.sponsor.check}
                        </button>
                    </div>
                </div>
                ` : `
                <h4>${trans_legacy[lang].settings.home.sponsor.status.no}</h4>
                <div class="alert alert-info">${trans_legacy[lang].settings.home.sponsor.version.replace("{v}", `<span class="version-link sponsor-related">${sponsor_list.latest}</span>`)}</div>
                <div class="screen-row actions-only">
                    <div class="actions">
                        <button class="btn primary sponsor" onclick="_sponsor()">
                            ${trans_legacy[lang].settings.home.sponsor.name}<div class="new-badge">${trans_legacy[lang].settings.new}</div>
                        </button>
                        <button class="btn refresh icon" onclick="_sponsor_check()">
                            ${trans_legacy[lang].settings.home.sponsor.check}
                        </button>
                    </div>
                </div>
                `}
            </div>
            <div class="bleh--panel">
                <div class="slider-container" id="container-avatar_radius">
                    <button class="btn reset" onclick="_reset_item('avatar_radius')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.profiles.avatar_radius.name}</h5>
                    </div>
                    <div class="slider">
                        <div class="slider-track" id="slider-track-avatar_radius"><div class="slider-fill"></div><div class="slider-nub"></div></div>
                        <input type="range" min="0" max="50" value="0" step="1" id="slider-avatar_radius" oninput="_update_item('avatar_radius', this.value)">
                        <p id="value-avatar_radius">0</p>
                    </div>
                </div>
                <h4>${trans_legacy[lang].settings.music.profile_shortcut.name}</h4>
                <p>${trans_legacy[lang].settings.music.profile_shortcut.bio}</p>
                <div class="text-container" id="container-profile_shortcut">
                    <button class="btn reset" onclick="_reset_item('profile_shortcut')">${tl(trans.reset)}</button>
                    <div class="avatar-container">
                        <div class="avatar-inner" id="avatar-profile_shortcut">
                            <img id="avatar_src-profile_shortcut" src="${localStorage.getItem("bleh_profile_shortcut_avi") || ""}">
                        </div>
                    </div>
                    <div class="heading content-form">
                        <h5>${trans_legacy[lang].settings.music.profile_shortcut.placeholder}</h5>
                        <div class="input-container">
                            <input type="text" maxlength="40" id="text-profile_shortcut" value="${settings.profile_shortcut}" placeholder="${trans_legacy[lang].settings.music.profile_shortcut.header}">
                            <button class="bleh--btn primary save" onclick="_save_profile_shortcut()">${trans_legacy[lang].settings.save}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bleh--panel">
                <h4>${trans_legacy[lang].settings.activities.name}</h4>
                <p>${trans_legacy[lang].settings.activities.bio}</p>
                <div class="toggle-container" id="container-activities" onclick="_update_item('activities')">
                    <button class="btn reset" onclick="_reset_item('activities')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.activities.toggle.name}</h5>
                        <p>${trans_legacy[lang].settings.activities.toggle.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-activities" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="toggle-container" id="container-activity_shout" onclick="_update_item('activity_shout')">
                    <button class="btn reset" onclick="_reset_item('activity_shout')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-shoutbox)"></div>
                    </div>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.activities.types.shout}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-activity_shout" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-activity_image" onclick="_update_item('activity_image')">
                    <button class="btn reset" onclick="_reset_item('activity_image')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-gallery-vertical)"></div>
                    </div>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.activities.types.image}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-activity_image" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-activity_obsess" onclick="_update_item('activity_obsess')">
                    <button class="btn reset" onclick="_reset_item('activity_obsess')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-obsession)"></div>
                    </div>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.activities.types.obsess}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-activity_obsess" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-activity_love" onclick="_update_item('activity_love')">
                    <button class="btn reset" onclick="_reset_item('activity_love')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-heart)"></div>
                    </div>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.activities.types.love}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-activity_love" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-activity_wiki" onclick="_update_item('activity_wiki')">
                    <button class="btn reset" onclick="_reset_item('activity_wiki')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-bio)"></div>
                    </div>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.activities.types.wiki}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-activity_wiki" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-activity_install" onclick="_update_item('activity_install')">
                    <button class="btn reset" onclick="_reset_item('activity_install')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-download)"></div>
                    </div>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.activities.types.install}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-activity_install" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            <div class="bleh--panel">
                <h4>${trans_legacy[lang].settings.profiles.notes.name}</h4>
                <div class="profile-notes" id="profile-notes"></div>
            </div>
            `;
    } else if (page_id == "accessibility") {
      register_skip_to([]);
      return `
            <div class="bleh--panel">
                <h4 class="top-header">${tl(trans.accessibility)}</h4>
                <div class="toggle-container" id="container-reduced_motion" onclick="_update_item('reduced_motion')">
                    <button class="btn reset" onclick="_reset_item('reduced_motion')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.accessibility.reduced_motion.name}</h5>
                        <p>${trans_legacy[lang].settings.accessibility.reduced_motion.bio}</p>
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
                            <a>${auth.name}</a>
                        </h3>
                        <span class="avatar shout-user-avatar">
                            <img src="${auth.avatar.replace("/avatar42s/", "/avatar170s/")}" alt="Your avatar" loading="lazy">
                        </span>
                        <a class="shout-permalink shout-timestamp">
                            <time datetime="2024-06-05T02:33:39+01:00" title="Wednesday 5 Jun 2024, 2:33am">
                                5 Jun 2:33am
                            </time>
                        </a>
                        <div class="shout-body">
                            <p>${trans_legacy[lang].settings.accessibility.shout_preview}</p>
                        </div>
                    </div>
                </div>
                <div class="toggle-container" id="container-accessible_name_colours" onclick="_update_item('accessible_name_colours')">
                    <button class="btn reset" onclick="_reset_item('accessible_name_colours')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.accessibility.accessible_name_colours.name}</h5>
                        <p>${trans_legacy[lang].settings.accessibility.accessible_name_colours.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-accessible_name_colours" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-underline_links" onclick="_update_item('underline_links')">
                    <button class="btn reset" onclick="_reset_item('underline_links')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.accessibility.underline_links.name}</h5>
                        <p>${trans_legacy[lang].settings.accessibility.underline_links.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-underline_links" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-toggle_icon" onclick="_update_item('toggle_icon')">
                    <button class="btn reset" onclick="_reset_item('toggle_icon')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.accessibility.toggle_icon.name}</h5>
                        <p>${trans_legacy[lang].settings.accessibility.toggle_icon.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-toggle_icon" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            `;
    } else if (page_id == "text") {
      register_skip_to([]);
      return `
            <div class="bleh--panel">
                <h4 class="top-header">${trans_legacy[lang].settings.text.name}</h4>
                <h4>${trans_legacy[lang].settings.text.font.name}</h4>
                <div class="text-container" id="container-font">
                    <button class="btn reset" onclick="_reset_item('font')">${tl(trans.reset)}</button>
                    <div class="heading content-form">
                        <div class="input-container">
                            <input type="text" maxlength="120" id="text-font" value="${settings.font}" placeholder="${trans_legacy[lang].settings.text.font.placeholder}">
                            <button class="bleh--btn primary save" onclick="_save_font()">${trans_legacy[lang].settings.save}</button>
                        </div>
                    </div>
                </div>
                <div class="slider-container" id="container-font_weight">
                    <button class="btn reset" onclick="_reset_item('font_weight')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.text.font_weight.name}</h5>
                        <p>${trans_legacy[lang].settings.text.font_weight.bio}</p>
                    </div>
                    <div class="slider">
                        <div class="slider-track" id="slider-track-font_weight"><div class="slider-fill"></div><div class="slider-nub"></div></div>
                        <input type="range" min="0" max="900" value="0" step="10" id="slider-font_weight" oninput="_update_item('font_weight', this.value)">
                        <p id="value-font_weight">0</p>
                    </div>
                </div>
                <div class="slider-container" id="container-font_weight_medium">
                    <button class="btn reset" onclick="_reset_item('font_weight_medium')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.text.font_weight_medium.name}</h5>
                        <p>${trans_legacy[lang].settings.text.font_weight_medium.bio}</p>
                    </div>
                    <div class="slider">
                        <div class="slider-track" id="slider-track-font_weight_medium"><div class="slider-fill"></div><div class="slider-nub"></div></div>
                        <input type="range" min="0" max="900" value="0" step="10" id="slider-font_weight_medium" oninput="_update_item('font_weight_medium', this.value)">
                        <p id="value-font_weight_medium">0</p>
                    </div>
                </div>
                <div class="slider-container" id="container-font_weight_bold">
                    <button class="btn reset" onclick="_reset_item('font_weight_bold')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.text.font_weight_bold.name}</h5>
                        <p>${trans_legacy[lang].settings.text.font_weight_bold.bio}</p>
                    </div>
                    <div class="slider">
                        <div class="slider-track" id="slider-track-font_weight_bold"><div class="slider-fill"></div><div class="slider-nub"></div></div>
                        <input type="range" min="0" max="900" value="0" step="10" id="slider-font_weight_bold" oninput="_update_item('font_weight_bold', this.value)">
                        <p id="value-font_weight_bold">0</p>
                    </div>
                </div>
                <div class="toggle-container" id="container-font_emoji" onclick="_update_item('font_emoji')">
                    <button class="btn reset" onclick="_reset_item('font_emoji')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.text.font_emoji.name}</h5>
                        <p>${trans_legacy[lang].settings.text.font_emoji.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-font_emoji" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="inner-preview pad flex">
                    <div class="shout js-shout js-link-block" data-kate-processed="true">
                        <h3 class="shout-user">
                            <a>${auth.name}</a>
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
                            <p>${trans_legacy[lang].settings.text.shout_preview_md}</p>
                        </div>
                        <div class="shout-body if-markdown-off">
                            <p>${trans_legacy[lang].settings.text.shout_preview}</p>
                        </div>
                    </div>
                </div>
                <h4>${trans_legacy[lang].settings.text.markdown.name}</h4>
                <p>${trans_legacy[lang].settings.text.markdown.bio}</p>
                <div class="toggle-container" id="container-shout_markdown" onclick="_update_item('shout_markdown')">
                    <button class="btn reset" onclick="_reset_item('shout_markdown')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.text.markdown.shouts}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-shout_markdown" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-bio_markdown" onclick="_update_item('bio_markdown')">
                    <button class="btn reset" onclick="_reset_item('bio_markdown')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.text.markdown.profile}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-bio_markdown" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            <div class="bleh--panel">
                <h4 class="top-header">${trans_legacy[lang].settings.language.name}</h4>
                ${!valid_langs.includes(document.documentElement.getAttribute("lang")) ? `
                <div class="alert alert-error">Selected language is not currently supported in bleh, sorry for the inconvenience.</div>
                ` : ""}
                <h4>${trans_legacy[lang].settings.language.supported}</h4>
                <div class="languages" id="languages"></div>
                <div class="sep"></div>
                <div class="alert alert-warning">This page is still under construction! A wiki page dedicated to submitting a language is not available currently.</div>
                <div class="toggle-container">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.language.submit.name}</h5>
                        <p>${trans_legacy[lang].settings.language.submit.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <a class="btn bleh--btn primary" href="https://github.com/katelyynn/bleh/wiki" target="_blank">${trans_legacy[lang].settings.language.submit.action}</a>
                    </div>
                </div>
            </div>
            `;
    } else if (page_id == "sku") {
      register_skip_to([]);
      return `
            <div class="bleh--panel shh">
                <div class="sub-text">${version.build}.${version.sku}</div>
                \u2606\u2312(>w<)
            </div>
            <div class="bleh--panel">
                <h4>Manage active flags</h4>
                <div class="alert alert-danger">Be careful! Only manage these if you know what you are doing.</div>
                <div class="feature-flags" id="feature-flags"></div>
            </div>
            `;
    } else if (page_id == "music") {
      register_skip_to([
        {
          id: "format_guest_features",
          name: trans_legacy[lang].settings.corrections.format_guest_features.name
        },
        {
          id: "corrections",
          name: trans_legacy[lang].settings.corrections.toggle.name
        },
        {
          id: "stacked_chartlist_info",
          name: trans_legacy[lang].settings.corrections.stacked_chartlist_info.name
        },
        {
          id: "travis",
          name: trans_legacy[lang].settings.redirects.name
        },
        {
          id: "gloss",
          type: "slider",
          name: trans_legacy[lang].settings.customise.gloss.name
        },
        {
          id: "grid_glow",
          name: trans_legacy[lang].settings.music.grid_glow.name
        },
        {
          id: "gendered_tags",
          name: trans_legacy[lang].settings.customise.gendered_tags.name
        }
      ]);
      console.info(artist_corrections, album_track_corrections);
      return `
            <div class="bleh--panel">
                <h4>${trans_legacy[lang].settings.corrections.formatting}</h4>
                <div class="inner-preview pad flex">
                    <section class="redesigned-header mockup redesigned-track-header no-top-margin">
                        <div class="avatar-side">
                            <img src="https://lastfm.freetls.fastly.net/i/u/avatar170s/8bd696cbd4aa4d4eb6d35393232f55e4.jpg">
                        </div>
                        <div class="info-side">
                            <div class="sub-text">${trans_legacy[lang].track.name}</div>
                            <div class="title-container">
                                <h1 class="bleh--name-with-features">
                                    <div class="title">California Love</div>
                                    <div class="feat" data-bleh--tag-type="ft." data-bleh--tag-group="guests">ft. Dr. Dre, Roger Troutman</div>
                                    <div class="feat" data-bleh--tag-type="- remix" data-bleh--tag-group="mixes">Remix</div>
                                </h1>
                                <h1 class="bleh--name-without-features">
                                    California Love (ft. Dr. Dre, Roger Troutman) - Remix
                                </h1>
                            </div>
                            <h2>
                                <a class="header-new-crumb">2Pac</a><span class="bleh--name-with-features">, </span>
                                <a class="header-new-crumb bleh--name-with-features">Dr. Dre</a><span class="bleh--name-with-features">, </span>
                                <a class="header-new-crumb bleh--name-with-features">Roger Troutman</a>
                            </h2>
                        </div>
                    </section>
                </div>
                <div class="toggle-container" id="container-format_guest_features" onclick="_update_item('format_guest_features')">
                    <button class="btn reset" onclick="_reset_item('format_guest_features')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.format_guest_features.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.format_guest_features.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-format_guest_features" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container hide-if-format-guest-disabled" id="container-show_guest_features" onclick="_update_item('show_guest_features')">
                    <button class="btn reset" onclick="_reset_item('show_guest_features')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.show_guest_features.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.show_guest_features.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-show_guest_features" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="inner-preview pad flex">
                    <section class="redesigned-header mockup redesigned-album-header no-top-margin">
                        <div class="avatar-side">
                            <img src="https://lastfm.freetls.fastly.net/i/u/avatar170s/def68d94aae8e52ef2d1c0c9d3e16ff4.jpg">
                        </div>
                        <div class="info-side">
                            <div class="sub-text">${trans_legacy[lang].album.name}</div>
                            <div class="title-container">
                                <h1>
                                    <div class="title">my anti-aircraft friend</div>
                                    <div class="feat" data-bleh--tag-type="(remaster" data-bleh--tag-group="remasters">Remastered</div>
                                </h1>
                            </div>
                            <h2>
                                <a class="header-new-crumb">julie</a>
                            </h2>
                        </div>
                    </section>
                </div>
                <div class="toggle-container hide-if-format-guest-disabled" id="container-show_remaster_tags" onclick="_update_item('show_remaster_tags')">
                    <button class="btn reset" onclick="_reset_item('show_remaster_tags')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.show_remaster_tags.name} <div class="new-badge">${trans_legacy[lang].settings.beta}</div></h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-show_remaster_tags" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            <div class="bleh--panel lotus">
                <h4>${trans_legacy[lang].lotus.version.replace("lotus", `<a class="lotus lotus-name" href="https://github.com/katelyynn/lotus" target="_blank" id="lotus_hover">lotus</a>`).replace("{v}", `<span class="version-link lotus">${artist_corrections.version >= album_track_corrections.version ? artist_corrections.version : album_track_corrections.version}</span>`)}</h4>
                <p>${trans_legacy[lang].settings.corrections.bio}</p>
                <!--<div class="screen-row actions-only">
                    <div class="actions">
                        <a class="btn action" href="https://github.com/katelyynn/bleh/issues/new/choose" target="_blank">
                            <div class="icon bleh--correction"></div>
                            <span class="text">
                                <h5>${trans_legacy[lang].settings.corrections.submit.name}</h5>
                            </span>
                        </a>
                        <button class="btn action" onclick="_open_correction_modal()">
                            <div class="icon bleh--correction_modal"></div>
                            <span class="text">
                                <h5>${trans_legacy[lang].settings.corrections.view.name}</h5>
                            </span>
                        </button>
                    </div>
                </div>-->
                <div class="screen-row actions-only">
                    <div class="actions">
                        <a class="btn primary external lotus" href="https://github.com/katelyynn/lotus/issues/new/choose" target="_blank">
                            ${trans_legacy[lang].settings.corrections.submit.name}
                        </a>
                        <button class="btn continue" onclick="_open_correction_modal()">
                            ${trans_legacy[lang].settings.corrections.view.name}
                        </button>
                        <button class="btn continue" onclick="_lotus_check()">
                            ${trans_legacy[lang].lotus.check}
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-corrections" onclick="_update_item('corrections')">
                    <button class="btn reset" onclick="_reset_item('corrections')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.toggle.name}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle lotus" id="toggle-corrections" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            <div class="bleh--panel">
                <h4 class="top-header">${tl(trans.music)}</h4>
                <h4>${trans_legacy[lang].settings.music.header}</h4>
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
                    <button class="btn reset" onclick="_reset_item('stacked_chartlist_info')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.stacked_chartlist_info.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.stacked_chartlist_info.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-stacked_chartlist_info" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container hide-if-no-bulk-edit" id="container-show_bulk_edit_album" onclick="_update_item('show_bulk_edit_album')">
                    <button class="btn reset" onclick="_reset_item('show_bulk_edit_album')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.music.show_bulk_edit_album.name}</h5>
                        <p>${trans_legacy[lang].settings.music.show_bulk_edit_album.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-show_bulk_edit_album" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <h4>${trans_legacy[lang].glacier.name}</h4>
                <div class="toggle-container" id="container-glacier_library_graphs" onclick="_update_item('glacier_library_graphs')">
                    <button class="btn reset" onclick="_reset_item('glacier_library_graphs')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].glacier.option.name}</h5>
                        <p>${trans_legacy[lang].glacier.option.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-glacier_library_graphs" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            <div class="bleh--panel">
                <h4>${trans_legacy[lang].settings.redirects.name}</h4>
                <p>${trans_legacy[lang].settings.redirects.bio}</p>
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
                    <button class="btn reset" onclick="_reset_item('travis')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.redirects.travis.name}</h5>
                        <p>${trans_legacy[lang].settings.redirects.travis.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-travis" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.redirects.autocorrect.name}</h5>
                        <p>${trans_legacy[lang].settings.redirects.autocorrect.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <a class="btn bleh--btn primary" href="${root}settings/website" target="_blank">${trans_legacy[lang].settings.redirects.autocorrect.action}</a>
                    </div>
                </div>
            </div>
            <div class="bleh--panel">
                <h4>${trans_legacy[lang].settings.customise.artwork.name}</h4>
                <div class="inner-preview pad">
                    <div class="palette albums" style="height: fit-content">
                        <div class="album-cover swatch" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/1569198c4cf0a3b2ff8728975e8359fa.jpg')"></div>
                        <div class="album-cover swatch" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/b897255bf422baa93a42536af293f9f8.jpg')"></div>
                        <div class="album-cover swatch" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/def68d94aae8e52ef2d1c0c9d3e16ff4.jpg')"></div>
                        <div class="album-cover swatch" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/510546e3b6df7504392274c528c77780.jpg')"></div>
                        <div class="album-cover swatch" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/49cc807f69d59746b6b04be3434e6637.jpg')"></div>
                        <div class="album-cover swatch" style="background-image: url('https://lastfm.freetls.fastly.net/i/u/770x0/dd76702cea38c838a3090dd9496d92d9.jpg')"></div>
                    </div>
                </div>
                <div class="slider-container" id="container-gloss">
                    <button class="btn reset" onclick="_reset_item('gloss')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.gloss.name}</h5>
                        <p>${trans_legacy[lang].settings.customise.gloss.bio}</p>
                    </div>
                    <div class="slider">
                        <div class="slider-track" id="slider-track-gloss"><div class="slider-fill"></div><div class="slider-nub"></div></div>
                        <input type="range" min="0" max="1" value="0" step="0.05" id="slider-gloss" oninput="_update_item('gloss', this.value)">
                        <p id="value-gloss">0</p>
                    </div>
                </div>
                <div class="toggle-container" id="container-grid_glow" onclick="_update_item('grid_glow')">
                    <button class="btn reset" onclick="_reset_item('grid_glow')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.music.grid_glow.name}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-grid_glow" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            <div class="bleh--panel">
                <h4>${trans_legacy[lang].settings.customise.display.name}</h4>
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
                    <button class="btn reset" onclick="_reset_item('gendered_tags')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.gendered_tags.name}</h5>
                        <p>${trans_legacy[lang].settings.customise.gendered_tags.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-gendered_tags" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            `;
    } else if (page_id == "moderation") {
      register_skip_to([]);
      return `
            <div class="bleh--panel">
                <h4>${tl(trans.moderation)}</h4>
                <p>Decide the way hateful terms across the site are treated.</p>
                <div class="user-top-panel">
                    <div class="user-top-avatar user-top-avatar-side-left"><div class="bleh-icon"></div></div>
                    <img class="user-top-avatar user-top-avatar-main" src="${auth.avatar.replace("avatar42s", "avatar300s")}" alt="${auth.name}">
                    <div class="user-top-avatar user-top-avatar-side-right"><div class="bleh-icon"></div></div>
                </div>
                <div class="toggle-container" id="container-enable_moderation" onclick="_update_item('enable_moderation')">
                    <button class="btn reset" onclick="_reset_item('enable_moderation')">${tl(trans.reset)}</button>
                    <div class="heading">
                        <h5>Enable moderation</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-enable_moderation" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <h4>Method</h4>
                <div class="primary-selections">
                    <div class="btn primary-selection" id="toggle-removal_method-remove" data-toggle="removal_method" data-toggle-value="remove" onclick="_update_item('removal_method', 'remove')">
                        <h5>Remove</h5>
                        <p>Any matching words will be completely hidden.</p>
                    </div>
                    <div class="btn primary-selection" id="toggle-removal_method-censor" data-toggle="removal_method" data-toggle-value="censor" onclick="_update_item('removal_method', 'censor')">
                        <h5>Censor</h5>
                        <p>Any matching words will be replaced by hearts.</p>
                    </div>
                </div>
            </div>
            <div class="bleh--panel">
                <h4>Manage block lists</h4>
                <p>Enter a URL pointing to a CORS-enabled block list.</p>
                <div class="text-container" id="container-block_list">
                    <div class="heading content-form">
                        <div class="input-container">
                            <input type="url" id="block-list-input" placeholder="https://example.com">
                            <div class="custom-selector block-list-selector">
                                <select id="block-list-type">
                                    <option value="strings">Strings (per line)</option>
                                    <option value="regex">Regex expressions</option>
                                </select>
                            </div>
                            <button class="btn-add primary" onclick="_add_block()">Add</button>
                        </div>
                    </div>
                </div>
                <div class="generic-table-list" id="block-lists"></div>
            </div>
            <div class="bleh--panel">
                <h4>Moderate where?</h4>
                <h5>User-generated</h5>
                <div class="toggle-container" id="container-moderate_shouts" onclick="_update_item('moderate_shouts')">
                    <button class="btn reset" onclick="_reset_item('moderate_shouts')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-shoutbox)"></div>
                    </div>
                    <div class="heading">
                        <h5>Shouts</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-moderate_shouts" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-censor_bios" onclick="_update_item('censor_bios')">
                    <button class="btn reset" onclick="_reset_item('censor_bios')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-user)"></div>
                    </div>
                    <div class="heading">
                        <h5>Profile biographies</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-censor_bios" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="sep"></div>
                <h5>Music</h5>
                <div class="toggle-container" id="container-censor_artist_names" onclick="_update_item('censor_artist_names')">
                    <button class="btn reset" onclick="_reset_item('censor_artist_names')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-artist)"></div>
                    </div>
                    <div class="heading">
                        <h5>Artist names</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-censor_artist_names" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-censor_album_titles" onclick="_update_item('censor_album_titles')">
                    <button class="btn reset" onclick="_reset_item('censor_album_titles')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-album)"></div>
                    </div>
                    <div class="heading">
                        <h5>Album names</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-censor_album_titles" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-censor_track_titles" onclick="_update_item('censor_track_titles')">
                    <button class="btn reset" onclick="_reset_item('censor_track_titles')">${tl(trans.reset)}</button>
                    <div class="icon">
                        <div class="bleh-icon" style="--icon: var(--icon-16-track)"></div>
                    </div>
                    <div class="heading">
                        <h5>Track names</h5>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-censor_track_titles" aria-checked="false">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
            `;
    }
  }
  function register_skip_to(list = null) {
    if (!ff("skip_to_setting"))
      return;
    if (list == null)
      return;
    let panel = page.structure.side.querySelector(".skip-to-list");
    panel.innerHTML = "";
    list.forEach((item) => {
      let button = document.createElement("button");
      button.classList.add("skip-to-item");
      button.setAttribute("onclick", `_scroll_to_setting('${item.id}')`);
      button.textContent = item.name;
      if (item.type != null)
        button.setAttribute("data-type", item.type);
      panel.appendChild(button);
    });
  }
  unsafeWindow._scroll_to_setting = function(id) {
    scroll_to_setting(id);
  };
  function scroll_to_setting(id) {
    let setting = document.body.querySelector(`#container-${id}`);
    if (setting != null) {
      let y = setting.getBoundingClientRect().top + window.scrollY - 300;
      window.scroll({
        top: y,
        behavior: "smooth"
      });
    }
  }
  unsafeWindow._change_settings_page = function(page2, setting = null) {
    change_settings_page(page2, setting);
  };
  function change_settings_page(page_id, setting = null) {
    page.structure.main.innerHTML = "";
    if (ff("bleh_settings_tabs")) {
      let btns = document.querySelectorAll(".bleh--nav");
      btns.forEach((btn) => {
        console.log(btn.getAttribute("data-bleh-page"), page_id);
        if (btn.getAttribute("data-bleh-page") != page_id) {
          btn.classList.remove("secondary-nav-item-link--active");
        } else {
          btn.classList.add("secondary-nav-item-link--active");
        }
      });
    } else {
      let btns = document.querySelectorAll(".bleh--btn");
      btns.forEach((btn) => {
        console.log(btn.getAttribute("data-bleh-page"), page_id);
        if (btn.getAttribute("data-bleh-page") != page_id) {
          btn.classList.remove("active");
        } else {
          btn.classList.add("active");
        }
      });
    }
    if (page_id == "home" || page_id == "seasonal")
      seasonal_timer_start();
    else
      seasonal_timer_end();
    page.structure.main.innerHTML = render_setting_page(page_id);
    if (page_id == "themes") {
      show_theme_change_in_settings();
      display_colour_presets();
      refresh_all();
    } else if (page_id == "customise" || page_id == "performance" || page_id == "accessibility" || page_id == "text" || page_id == "seasonal" || page_id == "music" || page_id == "activities") {
      refresh_all();
    } else if (page_id == "profiles") {
      init_profile_notes();
      init_profile_page();
      refresh_all();
    } else if (page_id == "sku") {
      bleh_sku_page();
    } else if (page_id == "moderation") {
      bleh_moderation();
      refresh_all();
    }
    if (page_id == "text")
      prepare_language_page();
    if (page_id == "music") {
      tippy(document.getElementById("lotus_hover"), {
        content: trans_legacy[lang].lotus.tooltip.replace("lotus", '<span class="lotus lotus-name lotus-name-small">lotus</span>'),
        allowHTML: true
      });
      tippy(document.getElementById("container-show_bulk_edit_album"), {
        content: trans_legacy[lang].settings.music.show_bulk_edit_album.require
      });
    }
    if ((page_id == "seasonal" || page_id == "home") && settings.seasonal && stored_season.id != "none" && stored_season.start && stored_season.end) {
      tippy(document.getElementById("current_season"), {
        content: new Date(stored_season.end.replace("y0", stored_season.year).replace("{offset}", stored_season.offset)).toLocaleString(lang)
      });
      tippy(document.getElementById("current_season_start"), {
        content: new Date(stored_season.start.replace("y0", stored_season.year).replace("{offset}", stored_season.offset)).toLocaleString(lang)
      });
    }
    if (setting != null) {
      let setting_container = document.body.querySelector(`#container-${setting}`);
      if (setting_container != null) {
        let y = setting_container.getBoundingClientRect().top + window.scrollY - 300;
        window.scroll({
          top: y,
          behavior: "smooth"
        });
      }
    }
  }
  function show_theme_change_in_settings(theme = "") {
    if (theme != "")
      settings.theme = theme;
    let btns = document.querySelectorAll(".theme-item");
    btns.forEach((btn) => {
      console.log(btn.getAttribute("data-bleh-theme"), settings.theme);
      if (btn.getAttribute("data-bleh-theme") != settings.theme) {
        btn.classList.remove("active");
      } else {
        btn.classList.add("active");
      }
    });
  }
  function show_theme_change_in_menu(theme = "", element = document.body) {
    if (theme != "")
      settings.theme = theme;
    let btns = element.querySelectorAll(".theme-item-in-menu");
    btns.forEach((btn) => {
      console.log(btn.getAttribute("data-bleh-theme"), settings.theme);
      if (btn.getAttribute("data-bleh-theme") != settings.theme) {
        btn.classList.remove("active");
      } else {
        btn.classList.add("active");
      }
    });
  }
  function load_skus() {
    for (let flag in version.feature_flags) {
      let current_state = version.feature_flags[flag].default;
      if (settings.feature_flags[flag] != null)
        current_state = settings.feature_flags[flag];
      document.documentElement.setAttribute(`data-ff--${flag}`, current_state);
    }
  }
  function bleh_sku_page() {
    let flags_container = document.getElementById("feature-flags");
    for (let flag in version.feature_flags) {
      let current_state = version.feature_flags[flag].default;
      if (settings.feature_flags[flag] != void 0)
        current_state = settings.feature_flags[flag];
      let feature_flag_element = document.createElement("div");
      feature_flag_element.classList.add("toggle-container");
      feature_flag_element.setAttribute("onclick", `_update_flag_toggle('${flag}', this)`);
      feature_flag_element.innerHTML = `
            <div class="heading">
                <h5>${version.feature_flags[flag].name}</h5>
                ${version.feature_flags[flag].notice ? `<p>${version.feature_flags[flag].notice}</p>` : ""}
                <div class="info-row">
                    <div class="new-badge flag-${version.feature_flags[flag].default}">${version.feature_flags[flag].default}</div><p class="date">${version.feature_flags[flag].date}</p><p>${flag}</p>
                </div>
            </div>
            <div class="toggle-wrap">
                <button id="feature-flag-toggle-${flag}" class="toggle" aria-checked="${current_state}">
                    <div class="dot"></div>
                </button>
            </div>
        `;
      flags_container.appendChild(feature_flag_element);
      document.documentElement.setAttribute(`data-ff--${flag}`, current_state);
    }
  }
  unsafeWindow._update_flag_toggle = function(flag, container) {
    update_flag_toggle(flag, container);
  };
  function update_flag_toggle(flag, container) {
    let button = container.querySelector(".toggle");
    if (!button)
      return;
    let current_state = version.feature_flags[flag].default;
    if (settings.feature_flags[flag] != void 0) current_state = settings.feature_flags[flag];
    if (current_state == true) {
      button.setAttribute("aria-checked", "false");
      settings.feature_flags[flag] = false;
      document.documentElement.setAttribute(`data-ff--${flag}`, false);
    } else {
      button.setAttribute("aria-checked", "true");
      settings.feature_flags[flag] = true;
      document.documentElement.setAttribute(`data-ff--${flag}`, true);
    }
    localStorage.setItem("bleh", JSON.stringify(settings));
  }
  function display_colour_presets() {
    let colours = {
      custom: [
        {
          type: "default",
          sets: {
            hue: 255,
            sat: 1,
            lit: 1
          },
          displays: {
            hue: "var(--hue-seasonal, 255)",
            sat: "var(--sat-seasonal, 1)",
            lit: "var(--lit-seasonal, 1)"
          }
        },
        {
          type: "avatar",
          sets: {
            hue: auth.sets.hue,
            sat: auth.sets.sat,
            lit: auth.sets.lit
          },
          requires_flag: "colour_based_on_avatar"
        },
        {
          type: "seasonal"
        },
        {
          type: "customise"
        }
      ],
      red: [
        { sets: {
          hue: 360,
          sat: 1.425,
          lit: 0.725
        } },
        { sets: {
          hue: 360,
          sat: 1.4,
          lit: 0.775
        } },
        { sets: {
          hue: 360,
          sat: 1.325,
          lit: 0.825
        } },
        { sets: {
          hue: 360,
          sat: 1.225,
          lit: 0.875
        } },
        { sets: {
          hue: 360,
          sat: 1.1,
          lit: 0.925
        } },
        { sets: {
          hue: 360,
          sat: 1.05,
          lit: 1
        } }
      ],
      orange: [
        { sets: {
          hue: 10,
          sat: 1.425,
          lit: 0.725
        } },
        { sets: {
          hue: 13,
          sat: 1.4,
          lit: 0.75
        } },
        { sets: {
          hue: 16,
          sat: 1.325,
          lit: 0.8
        } },
        { sets: {
          hue: 20,
          sat: 1.225,
          lit: 0.825
        } },
        { sets: {
          hue: 21,
          sat: 1.275,
          lit: 0.85
        } },
        { sets: {
          hue: 26,
          sat: 1.35,
          lit: 0.9
        } }
      ],
      yellow: [
        { sets: {
          hue: 32,
          sat: 1.25,
          lit: 0.825
        } },
        { sets: {
          hue: 35,
          sat: 1.2,
          lit: 0.85
        } },
        { sets: {
          hue: 40,
          sat: 1.16,
          lit: 0.875
        } },
        { sets: {
          hue: 43,
          sat: 1.1,
          lit: 0.9
        } },
        { sets: {
          hue: 44,
          sat: 1,
          lit: 0.975
        } },
        { sets: {
          hue: 46,
          sat: 1.05,
          lit: 1
        } }
      ],
      green: [
        { sets: {
          hue: 85,
          sat: 1.425,
          lit: 0.725
        } },
        { sets: {
          hue: 90,
          sat: 1.4,
          lit: 0.775
        } },
        { sets: {
          hue: 94,
          sat: 1.325,
          lit: 0.825
        } },
        { sets: {
          hue: 99,
          sat: 1.25,
          lit: 0.85
        } },
        { sets: {
          hue: 105,
          sat: 1.15,
          lit: 0.9
        } },
        { sets: {
          hue: 108,
          sat: 1.075,
          lit: 0.95
        } }
      ],
      lime: [
        { sets: {
          hue: 115,
          sat: 1.15,
          lit: 0.725
        } },
        { sets: {
          hue: 121,
          sat: 1.09,
          lit: 0.775
        } },
        { sets: {
          hue: 127,
          sat: 1.05,
          lit: 0.825
        } },
        { sets: {
          hue: 135,
          sat: 1.03,
          lit: 0.85
        } },
        { sets: {
          hue: 141,
          sat: 1,
          lit: 0.9
        } },
        { sets: {
          hue: 148,
          sat: 1,
          lit: 0.975
        } }
      ],
      aqua: [
        { sets: {
          hue: 165,
          sat: 1.5,
          lit: 0.725
        } },
        { sets: {
          hue: 172,
          sat: 1.425,
          lit: 0.775
        } },
        { sets: {
          hue: 180,
          sat: 1.35,
          lit: 0.825
        } },
        { sets: {
          hue: 188,
          sat: 1.275,
          lit: 0.875
        } },
        { sets: {
          hue: 194,
          sat: 1.2,
          lit: 0.95
        } },
        { sets: {
          hue: 200,
          sat: 1.125,
          lit: 1
        } }
      ],
      blue: [
        { sets: {
          hue: 233,
          sat: 1.4,
          lit: 0.75
        } },
        { sets: {
          hue: 230,
          sat: 1.3,
          lit: 0.8
        } },
        { sets: {
          hue: 225,
          sat: 1.25,
          lit: 0.825
        } },
        { sets: {
          hue: 219,
          sat: 1.2,
          lit: 0.85
        } },
        { sets: {
          hue: 214,
          sat: 1.15,
          lit: 0.9
        } },
        { sets: {
          hue: 208,
          sat: 1.025,
          lit: 0.95
        } }
      ],
      purple: [
        { sets: {
          hue: 246,
          sat: 1.32,
          lit: 0.825
        } },
        { sets: {
          hue: 244,
          sat: 1.2,
          lit: 0.85
        } },
        { sets: {
          hue: 246,
          sat: 1.12,
          lit: 0.875
        } },
        { sets: {
          hue: 249,
          sat: 1.11,
          lit: 0.925
        } },
        { sets: {
          hue: 253,
          sat: 1.07,
          lit: 0.97
        } },
        { sets: {
          hue: 255,
          sat: 1.01,
          lit: 1.01
        } }
      ],
      pink: [
        { sets: {
          hue: 346,
          sat: 1.35,
          lit: 0.75
        } },
        { sets: {
          hue: 340,
          sat: 1.275,
          lit: 0.8
        } },
        { sets: {
          hue: 333,
          sat: 1.225,
          lit: 0.85
        } },
        { sets: {
          hue: 320,
          sat: 1.15,
          lit: 0.925
        } },
        { sets: {
          hue: 312,
          sat: 1.05,
          lit: 0.975
        } },
        { sets: {
          hue: 304,
          sat: 1,
          lit: 1
        } }
      ]
    };
    for (let type in colours) {
      let swatch_group = document.body.querySelector(`#colour_${type}`);
      if (!swatch_group)
        return;
      colours[type].forEach((colour) => {
        if (colour.requires_flag && version.feature_flags.hasOwnProperty(colour.requires_flag)) {
          if (!ff(colour.requires_flag))
            return;
        }
        if (!colour.type)
          colour.type = "colour";
        if (!colour.displays && colour.sets)
          colour.displays = colour.sets;
        let swatch = document.createElement("button");
        swatch.classList.add("swatch", "btn");
        swatch.setAttribute("data-swatch-type", colour.type);
        if (type == "custom")
          swatch.classList.add("view-item", "colour-btn");
        if (type == "custom")
          swatch.textContent = tl(trans[colour.type]);
        if (colour.type == "seasonal") {
          swatch.textContent = tl(trans.seasonal.name);
          if (stored_season.id == "none")
            return;
          tippy(swatch, {
            theme: "menu",
            content: "",
            allowHTML: true,
            placement: "bottom",
            interactive: true,
            interactiveBorder: 10,
            trigger: "click",
            onShow(instance) {
              let content = instance.popper.querySelector(".tippy-content");
              display_seasonal_exclusives(content);
            }
          });
        }
        if (colour.type == "customise") {
          tippy(swatch, {
            theme: "window",
            content: `
                        <div class="dialog-settings">
                            <div class="alert alert-info seasonal-hsl-alert">
                                ${trans_legacy[lang].settings.customise.colours.modals.custom_colour.seasonal_alert}
                            </div>
                            <div class="slider-container dim-using-hue-gradient dim-during-seasonal" id="container-hue">
                                <button class="btn reset" onclick="_reset_item('hue')">${tl(trans.reset)}</button>
                                <div class="heading">
                                    <h5>${tl(trans.hue)}</h5>
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
                                <button class="btn reset" onclick="_reset_item('sat')">${tl(trans.reset)}</button>
                                <div class="heading">
                                    <h5>${tl(trans.sat)}</h5>
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
                                <button class="btn reset" onclick="_reset_item('lit')">${tl(trans.reset)}</button>
                                <div class="heading">
                                    <h5>${tl(trans.lit)}</h5>
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
                            ${ff("card_saturation") ? `
                            <div class="slider-container hide-if-light-theme" id="container-sat_bg">
                                <button class="btn reset" onclick="_reset_item('sat_bg')">${tl(trans.reset)}</button>
                                <div class="heading">
                                    <h5>${tl(trans.card_background_saturation.name)}</h5>
                                    <p>${tl(trans.card_background_saturation.body)}</p>
                                </div>
                                <div class="slider">
                                    <div class="slider-track" id="slider-track-sat_bg"><div class="slider-fill"></div><div class="slider-nub"></div></div>
                                    <input type="range" min="0" max="3" value="0" step="0.1" id="slider-sat_bg" oninput="_update_item('sat_bg', this.value)">
                                    <p id="value-sat_bg">0</p>
                                </div>
                            </div>
                            ` : ""}
                        </div>
                    `,
            allowHTML: true,
            placement: "bottom",
            interactive: true,
            interactiveBorder: 10,
            trigger: "click",
            onShow(instance) {
              refresh_all(instance.popper);
            }
          });
        }
        if (colour.sets) {
          colour.sets.accent_type = colour.type;
          swatch.setAttribute("onclick", `_update_params(${JSON.stringify(colour.sets)})`);
          swatch.style.setProperty("--hue-over", colour.displays.hue);
          swatch.style.setProperty("--sat-over", colour.displays.sat);
          swatch.style.setProperty("--lit-over", colour.displays.lit);
          tippy(swatch, {
            theme: "key_value",
            content: `
                        <span class="key">hue<span class="value">${colour.sets.hue}</span></span>
                        <span class="key">sat<span class="value">${colour.sets.sat}</span></span>
                        <span class="key">lit<span class="value">${colour.sets.lit}</span></span>
                    `,
            allowHTML: true,
            delay: [250, 0]
          });
        }
        swatch_group.appendChild(swatch);
      });
    }
  }
  unsafeWindow._create_a_custom_colour = function() {
    notify({
      title: "Under construction",
      body: "This dialog is being moved!",
      icon: "icon-16-x",
      persist: true
    });
  };
  function display_seasonal_exclusives(instance) {
    let exclusives = {
      christmas: [
        {
          type: "season",
          name: trans_legacy[lang].settings.customise.seasonal.nonsense,
          sets: {
            hue: 352,
            sat: 1.8,
            lit: 0.925
          }
        },
        {
          type: "season",
          name: trans_legacy[lang].settings.customise.seasonal.fruitcake,
          sets: {
            hue: 24,
            sat: 0.93,
            lit: 1
          }
        },
        {
          type: "season",
          name: trans_legacy[lang].settings.customise.seasonal.mistletoe,
          sets: {
            hue: 130,
            sat: 0.45,
            lit: 0.75
          }
        },
        {
          type: "season",
          name: trans_legacy[lang].settings.customise.seasonal.festival,
          sets: {
            hue: 240,
            sat: 1.4,
            lit: 0.875
          }
        }
      ]
    };
    exclusives.new_years = exclusives.christmas;
    if (!exclusives.hasOwnProperty(stored_season.id)) {
      instance.innerHTML = `
            <div class="alert alert-info">${trans_legacy[lang].settings.customise.seasonal.none}</div>
        `;
      return;
    }
    instance.innerHTML = "";
    exclusives[stored_season.id].forEach((colour) => {
      colour.sets = { accent_type: colour.type, ...colour.sets };
      colour.displays = colour.sets;
      let item = document.createElement("button");
      item.classList.add("dropdown-menu-clickable-item", "swatch");
      item.setAttribute("data-swatch-type", colour.type);
      item.textContent = colour.name;
      item.setAttribute("onclick", `_update_params(${JSON.stringify(colour.sets)})`);
      item.style.setProperty("--hue-over", colour.displays.hue);
      item.style.setProperty("--sat-over", colour.displays.sat);
      item.style.setProperty("--lit-over", colour.displays.lit);
      if (colour.displays.hue == settings.hue && colour.displays.sat == settings.sat && colour.displays.lit)
        item.setAttribute("aria-checked", "true");
      instance.appendChild(item);
    });
  }
  function init_profile_page() {
    let profile_name_obj = document.body.querySelector(".title-container");
    if (sponsor_list && sponsor_list.badges.hasOwnProperty(auth.name)) {
      if (!Array.isArray(sponsor_list.badges[auth.name])) {
        log(`1 badge:`, "profile", "info", sponsor_list.badges[auth.name]);
        let this_badge = sponsor_list.badges[auth.name];
        let badge = document.createElement("span");
        badge.classList.add("label", `user-status--bleh-${this_badge.type}`, `user-status--bleh-user-${auth.name}`);
        badge.textContent = this_badge.name != null ? this_badge.name : tl(trans.badges[this_badge.type].name);
        profile_name_obj.appendChild(badge);
      } else {
        log(`multiple badges:`, "profile", "info", sponsor_list.badges[auth.name]);
        for (let badge_entry in sponsor_list.badges[auth.name]) {
          let this_badge = sponsor_list.badges[auth.name][badge_entry];
          let badge = document.createElement("span");
          badge.classList.add("label", `user-status--bleh-${this_badge.type}`, `user-status--bleh-user-${auth.name}`);
          badge.textContent = this_badge.name != null ? this_badge.name : tl(trans.badges[this_badge.type].name);
          profile_name_obj.appendChild(badge);
        }
      }
    } else {
      let badge = document.createElement("span");
      badge.classList.add("label", "user-status--bleh-missing");
      badge.textContent = tl(trans.badges.missing.name);
      profile_name_obj.appendChild(badge);
    }
  }
  function init_profile_notes() {
    let profile_notes = JSON.parse(localStorage.getItem("bleh_profile_notes")) || {};
    let profile_notes_table = document.getElementById("profile-notes");
    for (let user in profile_notes) {
      let profile_note = document.createElement("div");
      profile_note.classList.add("profile-note-row");
      profile_note.setAttribute("id", `profile-note-row--${user}`);
      profile_note.innerHTML = `
        <div class="name">
            <h5><a class="mention" href="${root}user/${user}">@${user}</a></h5>
        </div>
        <div class="note-preview">
            <p id="profile-note-row-preview--${user}">${profile_notes[user]}</p>
        </div>
        <div class="actions">
            <button class="btn bleh--edit-note" id="profile-note-row-edit--${user}" onclick="_edit_profile_note('${user}')">
                ${trans_legacy[lang].settings.profiles.notes.edit}
            </button>
            <button class="btn bleh--delete-note" id="profile-note-row-delete--${user}" onclick="_delete_profile_note('${user}')">
                ${trans_legacy[lang].settings.profiles.notes.delete}
            </button>
        </div>
        `;
      profile_notes_table.appendChild(profile_note);
      tippy(document.getElementById(`profile-note-row-edit--${user}`), {
        content: trans_legacy[lang].settings.profiles.notes.edit_user.replace("{u}", user)
      });
      tippy(document.getElementById(`profile-note-row-delete--${user}`), {
        content: trans_legacy[lang].settings.profiles.notes.delete_user.replace("{u}", user)
      });
    }
  }
  unsafeWindow._delete_profile_note = function(username) {
    let profile_notes = JSON.parse(localStorage.getItem("bleh_profile_notes")) || {};
    delete profile_notes[username];
    document.getElementById(`profile-note-row--${username}`).style.setProperty("display", "none");
    localStorage.setItem("bleh_profile_notes", JSON.stringify(profile_notes));
  };
  unsafeWindow._edit_profile_note = function(username) {
    let profile_notes = JSON.parse(localStorage.getItem("bleh_profile_notes")) || {};
    dialog_legacy("edit_profile_note", trans_legacy[lang].settings.profiles.notes.edit_user.replace("{u}", username), `
    <textarea id="bleh--profile-note" placeholder="Enter a local note for this user">${profile_notes[username]}</textarea>
    <div class="modal-footer">
        <button class="btn primary save" onclick="_save_profile_note_in_window('${username}')">
            ${trans_legacy[lang].settings.save}
        </button>
        <button class="btn cancel" onclick="_kill_window('edit_profile_note')">
            ${trans_legacy[lang].settings.cancel}
        </button>
    </div>
    `, true);
    profile_notes[username] = document.getElementById("bleh--profile-note").value;
    localStorage.setItem("bleh_profile_notes", JSON.stringify(profile_notes));
  };
  unsafeWindow._save_profile_note_in_window = function(username) {
    let profile_notes = JSON.parse(localStorage.getItem("bleh_profile_notes")) || {};
    let value_to_save = document.getElementById("bleh--profile-note").value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    profile_notes[username] = value_to_save;
    document.getElementById(`profile-note-row-preview--${username}`).textContent = value_to_save;
    localStorage.setItem("bleh_profile_notes", JSON.stringify(profile_notes));
    kill_window("edit_profile_note");
  };
  function prepare_corrections_page() {
    let corrections_table_artist = document.getElementById("corrections-artist");
    for (let artist in artist_corrections) {
      if (artist == "version")
        continue;
      let correction = document.createElement("div");
      correction.classList.add("correction-row");
      correction.innerHTML = `
        <div class="primary-name pre-transition">
            <h5>${artist}</h5>
        </div>
        <div class="arrow-divider"></div>
        <div class="primary-name post-transition">
            <h5>${artist_corrections[artist]}</h5>
        </div>
        `;
      corrections_table_artist.appendChild(correction);
    }
    let corrections_table_albums_tracks = document.getElementById("corrections-albums_tracks");
    for (let artist in album_track_corrections) {
      if (artist == "version")
        continue;
      let artist_row = document.createElement("div");
      artist_row.classList.add("artist-row");
      artist_row.innerHTML = `
            <h5>${artist}</h5>
        `;
      corrections_table_albums_tracks.appendChild(artist_row);
      for (let media in album_track_corrections[artist]) {
        let correction = document.createElement("div");
        correction.classList.add("correction-row");
        correction.innerHTML = `
            <div class="primary-name pre-transition">
                <h5>${media}</h5>
            </div>
            <div class="arrow-divider"></div>
            <div class="primary-name post-transition">
                <h5>${album_track_corrections[artist][media]}</h5>
            </div>
            `;
        corrections_table_albums_tracks.appendChild(correction);
      }
    }
  }
  function prepare_language_page() {
    let languages_table = document.getElementById("languages");
    for (let language in lang_info) {
      let lang_row = document.createElement("div");
      lang_row.classList.add("language-row");
      if (non_override_lang == language)
        lang_row.classList.add("active");
      let users = "";
      for (let user in lang_info[language].by)
        users = `${users}<a class="mention" href="${root}user/${lang_info[language].by[user]}" target="_blank">@${lang_info[language].by[user]}</a> `;
      lang_row.innerHTML = `
        <div class="flag-container">
            <img src="https://katelyynn.github.io/bleh/fm/flags/${language}.svg" alt="flag for ${language}">
        </div>
        <div class="name">
            <h5>${lang_info[language].name}</h5>
            <p>${trans_legacy[lang].settings.language.by.replace("{users}", users)}</p>
        </div>
        ${lang_info[language].new ? `
        <div class="badges">
            <div class="new-badge">${trans_legacy[lang].settings.new}</div>
        </div>
        ` : '<div class="badges"></div>'}
        <div class="date">
            <p>${lang_info[language].last_updated != "latest" ? moment(lang_info[language].last_updated).fromNow() : lang_info[language].last_updated}</p>
        </div>
        `;
      languages_table.appendChild(lang_row);
    }
  }
  unsafeWindow._import_settings = function() {
    dialog({
      id: "import_settings",
      title: trans_legacy[lang].settings.actions.import.modals.initial.name,
      body: `
            <p class="alert alert-warning">${trans_legacy[lang].settings.actions.import.modals.initial.alert}</p>
            <br>
            <textarea id="import_area"></textarea>
            <div class="modal-footer">
                <button class="btn primary download" onclick="_confirm_import()">
                    ${tl(trans.import)}
                </button>
                <button class="btn cancel" onclick="_dialog_rm({id: 'import_settings'})">
                    ${trans_legacy[lang].settings.cancel}
                </button>
            </div>
        `
    });
  };
  unsafeWindow._confirm_import = function() {
    let requesting_setting = document.getElementById("import_area").value;
    try {
      let try_parse = JSON.parse(requesting_setting);
      localStorage.setItem("bleh", requesting_setting);
      load_settings();
      dialog_rm({
        id: "import_settings"
      });
    } catch (e) {
      dialog_rm({
        id: "import_settings"
      });
      dialog({
        id: "import_failed",
        title: trans_legacy[lang].settings.actions.import.modals.failed.name,
        body: `
                <p class="alert alert-error">${trans_legacy[lang].settings.actions.import.modals.failed.alert}</p>
                <div class="modal-footer">
                    <button class="btn primary done" onclick="_dialog_rm({id: 'import_failed'})">
                        ${trans_legacy[lang].settings.done}
                    </button>
                </div>
            `
      });
    }
  };
  function export_settings() {
    dialog({
      id: "export_settings",
      title: trans_legacy[lang].settings.actions.export.modals.initial.name,
      body: `
            <p class="alert alert-success">${trans_legacy[lang].settings.actions.export.modals.initial.alert}</p>
            <br>
            <textarea>${JSON.stringify(settings)}</textarea>
            <div class="modal-footer">
                <button class="btn primary done" onclick="_dialog_rm({id: 'export_settings'})">
                    ${trans_legacy[lang].settings.done}
                </button>
            </div>
        `
    });
  }
  unsafeWindow._export_settings = function() {
    export_settings();
  };
  unsafeWindow._reset_settings = function() {
    dialog({
      id: "reset_settings",
      title: trans_legacy[lang].settings.actions.reset.modals.initial.name,
      body: `
            <p class="alert alert-error">${trans_legacy[lang].settings.actions.reset.modals.initial.alert}</p>
            <div class="modal-footer">
                <button class="btn done danger" onclick="_confirm_reset()">
                    ${trans_legacy[lang].settings.actions.reset.modals.initial.confirm}
                </button>
                <button class="btn upload" onclick="_export_first()">
                    ${trans_legacy[lang].settings.actions.reset.modals.initial.export}
                </button>
                <button class="btn primary cancel" onclick="_dialog_rm({id: 'reset_settings'})">
                    ${trans_legacy[lang].settings.cancel}
                </button>
            </div>
        `
    });
  };
  unsafeWindow._confirm_reset = function() {
    for (var member in settings) delete settings[member];
    Object.assign(settings, create_settings_template());
    load_settings(true);
    dialog_rm({
      id: "reset_settings"
    });
  };
  unsafeWindow._export_first = function() {
    dialog_rm({
      id: "reset_settings"
    });
    export_settings();
  };
  unsafeWindow._save_font = function() {
    let font = document.getElementById("text-font").value;
    document.body.style.setProperty(`--${settings_base.font.css}`, font);
    document.documentElement.setAttribute(`data-bleh--font`, font);
    settings.font = font;
    localStorage.setItem("bleh", JSON.stringify(settings));
  };

  // src/components/lotus.js
  function lotus(force = false) {
    if (!settings.corrections)
      return;
    let lotus_artist = localStorage.getItem("lotus_artist");
    let lotus_artist_expire = new Date(localStorage.getItem("lotus_artist_expire"));
    let lotus_album_track = localStorage.getItem("lotus_album_track");
    let lotus_album_track_expire = new Date(localStorage.getItem("lotus_album_track_expire"));
    let current_time = /* @__PURE__ */ new Date();
    if (lotus_artist == null) {
      console.info("lotus - artist list is not cached, fetching");
      lotus_request("artist", true);
    } else {
      Object.assign(artist_corrections, JSON.parse(lotus_artist));
      if (lotus_artist_expire < current_time && !force) {
        lotus_request();
      } else if (force) {
        lotus_request("artist", true);
      }
    }
    if (lotus_album_track == null) {
      console.info("lotus - album_track list is not cached, fetching");
      lotus_request("album_track", true);
    } else {
      Object.assign(album_track_corrections, JSON.parse(lotus_album_track));
      if (lotus_album_track_expire < current_time && !force) {
        lotus_request("album_track");
      } else if (force) {
        lotus_request("album_track", true);
      }
    }
  }
  function lotus_request(type = "artist", send_notify = false) {
    let button = document.body.querySelector('[onclick="_lotus_check()"]');
    if (button != null)
      button.setAttribute("disabled", "");
    let xhr = new XMLHttpRequest();
    let url = `https://katelyynn.github.io/lotus/${type}.json?${Math.random()}`;
    xhr.open("GET", url, true);
    xhr.onload = function() {
      log(`${type} list responded with ${xhr.status}`, "lotus");
      if (xhr.status != 200) {
        log("request has been cancelled, will request again in 1h", "lotus");
        api_expire.setHours(api_expire.getHours() + 1);
      }
      let api_expire = /* @__PURE__ */ new Date();
      if (xhr.status == 200) {
        if (type == "artist") {
          Object.assign(artist_corrections, JSON.parse(this.response));
        } else {
          Object.assign(album_track_corrections, JSON.parse(this.response));
        }
        if (send_notify) {
          notify({
            title: trans_legacy[lang].lotus[type],
            icon: "icon-16-lotus",
            classname: "lotus"
          });
        }
        localStorage.setItem(`lotus_${type}`, this.response);
        api_expire.setHours(api_expire.getHours() + 4);
        log(`${type} list cached until ${api_expire}`, "lotus");
      }
      localStorage.setItem(`lotus_${type}_expire`, api_expire);
      if (button != null)
        button.removeAttribute("disabled");
    };
    xhr.send();
  }
  unsafeWindow._lotus_check = function() {
    lotus(true);
  };
  unsafeWindow._open_correction_modal = function() {
    dialog({
      id: "corrections",
      title: trans_legacy[lang].settings.corrections.name,
      body: `
            <h4>${trans_legacy[lang].settings.corrections.listing.artists}</h4>
            <div class="corrections artist" id="corrections-artist"></div>
            <h4>${trans_legacy[lang].settings.corrections.listing.albums_tracks}</h4>
            <div class="corrections album_tracks" id="corrections-albums_tracks"></div>
        `,
      has_close: true,
      type: "corrections",
      allow_scroll: true
    });
    prepare_corrections_page();
  };
  function correct_generic_combo(parent) {
    let albums = document.body.querySelectorAll(`.${parent}`);
    if (albums == void 0)
      return;
    if (!settings.corrections)
      return;
    albums.forEach((album) => {
      if (!album.hasAttribute("data-kate-processed")) {
        album.setAttribute("data-kate-processed", "true");
        let album_name = album.querySelector(`.${parent.replace("-details", "")}-name a`);
        if (album_name == null)
          return;
        let artist_name = album.querySelector(`.${parent.replace("-details", "")}-artist a`);
        if (artist_name == void 0)
          return;
        let corrected_album_name = correct_item_by_artist(album_name.textContent, artist_name.textContent);
        let corrected_artist_name = correct_artist(artist_name.textContent);
        album_name.textContent = corrected_album_name;
        artist_name.textContent = corrected_artist_name;
      }
    });
  }
  function correct_generic_combo_no_artist(parent) {
    let albums = document.body.querySelectorAll(`.${parent}`);
    if (albums == null)
      return;
    albums.forEach((album) => {
      if (!album.hasAttribute("data-kate-processed")) {
        album.setAttribute("data-kate-processed", "true");
        let album_name = album.querySelector(`.${parent.replace("-details", "")}-name a`);
        if (album_name == null)
          return;
        let artist_name = return_artist_from_generic(album_name.getAttribute("href"));
        let corrected_album_name = correct_item_by_artist(album_name.textContent, artist_name);
        album_name.textContent = corrected_album_name;
      }
    });
  }
  function correct_item_by_artist(item, artist) {
    if (!settings.corrections)
      return item;
    artist = artist.toLowerCase();
    try {
      if (album_track_corrections.hasOwnProperty(artist)) {
        if (album_track_corrections[artist].hasOwnProperty(item)) {
          log(`corrected ${item} by ${artist} as ${album_track_corrections[artist][item]}`, "lotus");
          return album_track_corrections[artist][item];
        } else {
          return item;
        }
      } else {
        return item;
      }
    } catch (e) {
      log(`correcting ${item} by ${artist}`, "lotus");
      console.error(e);
      return item;
    }
  }
  function correct_artist(artist, broadcast = false) {
    if (!settings.corrections)
      return artist;
    try {
      if (artist_corrections.hasOwnProperty(artist)) {
        log(`corrected ${artist} as ${artist_corrections[artist]}`, "lotus");
        if (broadcast)
          page.corrected = true;
        return artist_corrections[artist];
      } else {
        if (broadcast)
          page.corrected = false;
        return artist;
      }
    } catch (e) {
      log(`correcting ${artist}`, "lotus");
      console.error(e);
      return artist;
    }
  }
  function name_includes(original_title, original_artist) {
    console.log(original_title, original_artist);
    let formatted_title = original_title;
    let original_title_corrected = false;
    if (album_track_corrections.hasOwnProperty(original_artist.toLowerCase()) && settings.corrections) {
      if (album_track_corrections[original_artist.toLowerCase()].hasOwnProperty(formatted_title)) {
        formatted_title = album_track_corrections[original_artist.toLowerCase()][formatted_title];
        log(`corrected ${original_title} by ${original_artist} as ${formatted_title}`, "lotus");
        original_title_corrected = true;
      }
    }
    formatted_title = formatted_title.replaceAll(" & feat. ", ";").replaceAll(" & with ", ";");
    let lowercase_title = formatted_title.toLowerCase();
    console.log("lowercase", lowercase_title);
    let extras = [];
    console.log(formatted_title, lowercase_title);
    for (let group in includes) {
      for (let possible_match in includes[group]) {
        if (lowercase_title.includes(includes[group][possible_match])) {
          let chr = lowercase_title.indexOf(`${includes[group][possible_match]}`);
          if (chr < 1)
            continue;
          console.log(group, group == "remasters", lowercase_title.includes(" remaster"));
          if (group == "remasters" && !lowercase_title.includes(" remaster") && !lowercase_title.includes("(remaster")) {
            continue;
          } else {
            extras.push({
              type: includes[group][possible_match],
              group,
              chr
            });
          }
        }
      }
    }
    extras.sort((a, b) => a.chr - b.chr);
    for (let extra in extras) {
      formatted_title = formatted_title.slice(0, extras[extra].chr - 1);
      break;
    }
    let song_guests = [];
    console.log(extras);
    for (let extra in extras) {
      console.log(extras[extra]);
      if (parseInt(extra) + 1 < extras.length) {
        let chr = extras[extra].chr;
        let next_chr = extras[parseInt(extra) + 1].chr;
        extras[extra].text = original_title.slice(chr, next_chr - 1).replaceAll("(", "").replaceAll(")", "").replaceAll("[", "").replaceAll("]", "").replaceAll("- ", "");
      } else {
        let chr = extras[extra].chr;
        extras[extra].text = original_title.slice(chr).replaceAll("(", "").replaceAll(")", "").replaceAll("[", "").replaceAll("]", "").replaceAll("- ", "");
      }
      let field_group = extras[extra].group;
      let field_text = extras[extra].text.replace(" feat. ", "").replace("feat. ", "").replace("featuring ", "").replace("Feat. ", "").replace("ft. ", "").replace("FEAT. ", "").replace("Ft. ", "").replace("WITH", "with").replace("w/ ", "").replace("with ", "").replace("With ", "").replaceAll(" & ", ";").replaceAll(", ", ";").replaceAll(" and ", ";").replaceAll(" with ", ";").replaceAll("- ", "").replaceAll(",; ", ";").replaceAll("Tyler;the", "Tyler, the").replaceAll("Tyler;The", "Tyler, The");
      console.log("pre-split", field_text);
      if (field_group == "guests") {
        song_guests = field_text.split(";");
        for (let guest in song_guests)
          song_guests[guest] = correct_artist(song_guests[guest]);
      }
    }
    if (artist_corrections.hasOwnProperty(original_artist) && settings.corrections)
      original_artist = correct_artist(artist_corrections[original_artist]);
    if (extras.length > 0)
      log(`parsed ${original_title} as ${formatted_title} by ${original_artist} with`, "guest features", "info", { extras, song_guests });
    return [formatted_title, extras, original_artist, song_guests, original_title_corrected];
  }
  function artist_title() {
    let title = document.body.querySelector(".header-new-title");
    let title_text = title.textContent.trim();
    let has_multi = false;
    if (title_text.includes(", ") || title_text.includes(" & "))
      has_multi = true;
    page.multi = false;
    if (!has_multi) {
      if (!settings.corrections)
        return;
      title.textContent = correct_artist(title_text, true);
    } else {
      title_text = title_text.replaceAll(" & ", ";").replaceAll(", ", ";").replace("Tyler;the", "Tyler, The").replace("Tyler;The", "Tyler, The").replaceAll(";;", ";");
      page.multi = true;
      title.innerHTML = "";
      let split = title_text.split(";");
      if (split.length < 2) {
        page.multi = false;
        if (!settings.corrections)
          return;
        title.textContent = correct_artist(title_text, true);
        return;
      }
      split.forEach((artist, index) => {
        if (index > 0)
          title.innerHTML += ",";
        let part = document.createElement("a");
        part.classList.add("multi-artist-part");
        part.setAttribute("href", `${root}music/${sanitise(artist)}`);
        if (settings.corrections)
          part.textContent = correct_artist(artist);
        else
          part.textContent = artist;
        title.appendChild(part);
      });
    }
  }
  function patch_header_title() {
    if (!settings.corrections && !settings.format_guest_features && !multi)
      return;
    page.corrected = false;
    let track_title = document.body.querySelector(".header-new-title");
    let track_artist = document.body.querySelector(".header-new-crumb span");
    if (!track_title)
      return;
    if (track_artist == null) {
      if (artist_corrections.hasOwnProperty(track_title.textContent)) {
        let corrected_artist = artist_corrections[track_title.textContent];
        log(`corrected ${track_title.textContent} as ${corrected_artist}`, "lotus");
        track_title.textContent = corrected_artist;
        page.corrected = true;
      }
    } else {
      if (artist_corrections.hasOwnProperty(track_artist.textContent)) {
        let corrected_artist = artist_corrections[track_artist.textContent];
        log(`corrected ${track_artist.textContent} as ${corrected_artist}`, "lotus");
        track_artist.textContent = corrected_artist;
      }
    }
    if (track_artist == null)
      return;
    if (settings.format_guest_features) {
      try {
        if (!track_title.hasAttribute("data-kate-processed")) {
          track_title.setAttribute("data-kate-processed", "true");
          let formatted_title = name_includes(track_title.textContent, track_artist.textContent);
          let song_title = formatted_title[0];
          let song_tags = formatted_title[1];
          page.corrected = formatted_title[4];
          let song_tags_text = "";
          for (let song_tag in song_tags) {
            song_tags_text = `${song_tags_text}<div class="feat" data-bleh--tag-type="${song_tags[song_tag].type}" data-bleh--tag-group="${song_tags[song_tag].group}">${song_tags[song_tag].text}</div>`;
          }
          track_title.innerHTML = `<div class="title">${sanitise_text(song_title)}</div>${song_tags_text}`;
          let song_artist_element = document.body.querySelector('span[itemprop="byArtist"]');
          let song_guests = formatted_title[3];
          page.sister_others = formatted_title[3];
          for (let guest in song_guests) {
            song_artist_element.innerHTML = `${song_artist_element.innerHTML},`;
            let guest_element = document.createElement("a");
            guest_element.classList.add("header-new-crumb");
            guest_element.setAttribute("href", `${root}music/${sanitise(song_guests[guest])}`);
            guest_element.setAttribute("title", sanitise_text(song_guests[guest]));
            guest_element.textContent = song_guests[guest];
            song_artist_element.appendChild(guest_element);
          }
        }
      } catch (e) {
      }
    } else {
      if (!track_title.hasAttribute("data-kate-processed")) {
        track_title.setAttribute("data-kate-processed", "true");
        let corrected_title = correct_item_by_artist(track_title.textContent, track_artist.textContent);
        log(`corrected ${track_title.textContent} by ${track_artist.textContent} as ${corrected_title}`, "lotus");
        if (corrected_title != track_title.textContent)
          page.corrected = true;
        track_title.textContent = corrected_title;
      }
    }
  }

  // src/activity.js
  function subscribe_to_events() {
    if (!settings.activities)
      return;
    let love_track = document.body.querySelectorAll(`form[action$="${auth.name}/loved"]:not([data-bleh-subscribed])`);
    love_track.forEach((form) => {
      form.setAttribute("data-bleh-subscribed", "true");
      let track = form.querySelector('[name="track"]').getAttribute("value");
      let artist = form.querySelector('[name="artist"]').getAttribute("value");
      artist = correct_artist(artist);
      track = correct_item_by_artist(track, artist);
      let btn = form.querySelector("button");
      btn.addEventListener("click", (event2) => {
        log("heard", "event", "info", event2);
        let action = btn.getAttribute("data-analytics-action");
        register_activity(action == "LoveTrack" ? "love" : "unlove", [{ name: track, type: "track", sister: artist }], `${root}music/${sanitise(artist)}/_/${sanitise(track)}`);
      }, false);
    });
    let bookmark_item = document.body.querySelectorAll(`form[action="/music/+bookmarks"]:not([data-bleh-subscribed])`);
    bookmark_item.forEach((form) => {
      form.setAttribute("data-bleh-subscribed", "true");
      let btn = form.querySelector("button");
      btn.addEventListener("click", (event2) => {
        log("heard", "event", "info", event2);
        let action = btn.getAttribute("data-analytics-action");
        register_activity(action.startsWith("Bookmark") ? "bookmark" : "unbookmark", [{ name: page.name, type: page.type, sister: page.sister }], window.location.href);
      }, false);
    });
    let obsess = document.body.querySelectorAll(`.modal-body form[action$="${auth.name}/obsessions"]:not([data-bleh-subscribed])`);
    obsess.forEach((form) => {
      form.setAttribute("data-bleh-subscribed", "true");
      let track = form.querySelector('[name="name"]').getAttribute("value");
      let artist = form.querySelector('[name="artist_name"]').getAttribute("value");
      artist = correct_artist(artist);
      track = correct_item_by_artist(track, artist);
      let btn = form.querySelector("button");
      btn.addEventListener("click", (event2) => {
        log("heard", "event", "info", event2);
        register_activity("obsess", [{ name: track, type: "track", sister: artist }], window.location.href);
      }, false);
    });
    let post_shouts_btn = document.body.querySelector(".btn-post-shout:not([data-bleh-subscribed])");
    if (post_shouts_btn != null) {
      post_shouts_btn.setAttribute("data-bleh-subscribed", "true");
      post_shouts_btn.addEventListener("click", (event2) => {
        log("heard", "event", "info", event2);
        window.setTimeout(function() {
          let actual_btn = event2.target.parentElement;
          let is_loading = actual_btn.classList.contains("btn--loading");
          console.log("is button loading", is_loading, actual_btn, event2.target);
          if (!is_loading)
            return;
          register_activity("shout", [{ name: page.name, type: page.type, sister: page.sister }], window.location.href);
        }, 150);
      }, false);
    }
    let save_wiki_form = document.body.querySelector(".wiki-edit-form:not([data-bleh-subscribed])");
    if (save_wiki_form != null) {
      save_wiki_form.setAttribute("data-bleh-subscribed", "true");
      let btn = save_wiki_form.querySelector(".form-submit button");
      btn.addEventListener("click", (event2) => {
        log("heard", "event", "info", event2);
        register_activity("wiki", [{ name: page.name, type: page.type, sister: page.sister }], window.location.href);
      }, false);
    }
    let upload_img_form = document.body.querySelector('form[action$="/+images/upload"]:not([data-bleh-subscribed])');
    if (upload_img_form != null) {
      upload_img_form.setAttribute("data-bleh-subscribed", "true");
      let btn = upload_img_form.querySelector(".form-submit button");
      btn.addEventListener("click", (event2) => {
        log("heard", "event", "info", event2);
        register_activity("image_upload", [{ name: page.name, type: page.type, sister: page.sister }], window.location.href);
      }, false);
    }
  }
  function load_activities() {
    if (!settings.activities)
      return;
    recent_activity_list.length = 0;
    recent_activity_list.push(...JSON.parse(localStorage.getItem("bwaa_recent_activity")) || []);
    log("loaded", "activity", "info", recent_activity_list);
    check_activities_length();
    log("saved", "activity", "info", recent_activity_list);
    localStorage.setItem("bwaa_recent_activity", JSON.stringify(recent_activity_list));
  }
  function check_activities_length() {
    if (recent_activity_list.length > 10) {
      let to_delete = recent_activity_list.length - 10;
      recent_activity_list.splice(0, to_delete);
      log(`reached maximum of 10, removed leftovers`, "activity");
    }
    return recent_activity_list;
  }
  function register_activity(type, involved, context, date = /* @__PURE__ */ new Date()) {
    if (!settings.activities)
      return;
    if (type == "shout") {
      if (!settings.activity_shout)
        return;
    } else if (type == "image_upload" || type == "image_star" || type == "bookmark" || type == "unbookmark") {
      if (!settings.activity_image)
        return;
    } else if (type == "obsess" || type == "unobsess") {
      if (!settings.activity_obsess)
        return;
    } else if (type == "love" || type == "unlove") {
      if (!settings.activity_love)
        return;
    } else if (type == "install_bwaa" || type == "update_bwaa" || type == "install_bleh" || type == "update_bleh") {
      if (!settings.activity_install)
        return;
    } else if (type == "wiki") {
      if (!settings.wiki)
        return;
    }
    recent_activity_list.length = 0;
    recent_activity_list.push(...JSON.parse(localStorage.getItem("bwaa_recent_activity")) || []);
    log("loaded", "activity", "info", recent_activity_list);
    recent_activity_list.push({
      type,
      involved,
      context,
      date
    });
    log("registered new", "activity", "info", {
      type,
      involved,
      context,
      date
    });
    check_activities_length();
    log("saved", "activity", "info", recent_activity_list);
    localStorage.setItem("bwaa_recent_activity", JSON.stringify(recent_activity_list));
  }

  // src/components/auto_edit.js
  function bleh_auto_edits() {
    let corrections_panel = document.body.querySelector("#subscription-corrections");
    page.structure.main.appendChild(corrections_panel);
    let nav = page.structure.nav.querySelector("ul");
    let back_nav = document.createElement("li");
    back_nav.classList.add("navlist-item", "secondary-nav-item", "secondary-nav-item--back");
    back_nav.innerHTML = `
        <a class="secondary-nav-item-link" href="${root}settings/subscription">
            ${trans_legacy[lang].settings.back}
        </a>
    `;
    nav.insertBefore(back_nav, nav.firstElementChild);
  }
  function auto_edit_modal() {
    let modal = document.querySelector(".automatic-edit-modal-body-v2");
    if (modal == null)
      return;
    if (modal.hasAttribute("data-bwaa-edit"))
      return;
    modal.setAttribute("data-bwaa-edit", "true");
    log("auto edit v2", "modal");
    let checkboxes = modal.querySelectorAll(".checkbox");
    checkboxes.forEach((checkbox) => {
      let id = checkbox.querySelector("input").getAttribute("name");
      let text = checkbox.textContent.trim();
      checkbox.classList = "toggle-container";
      checkbox.setAttribute("onclick", `_update_inbuilt_item('${id}')`);
      checkbox.innerHTML = `
            <div class="heading">
                <h5>${text}</h5>
            </div>
            <div class="toggle-wrap">
                <input class="companion-checkbox" type="checkbox" name="${id}" id="inbuilt-companion-checkbox-${id}">
                <span class="btn toggle" id="toggle-${id}" aria-checked="false">
                    <div class="dot"></div>
                </span>
            </div>
        `;
    });
  }

  // src/components/music_grid.js
  function music_grids() {
    if (page.structure.main == null)
      return;
    let insights = {
      artist: {
        display: false,
        values: [],
        labels: [],
        highest: {
          value: 0,
          label: "",
          link: "",
          img: ""
        }
      },
      album: {
        display: false,
        values: [],
        labels: [],
        highest: {
          value: 0,
          label: "",
          link: "",
          img: ""
        }
      },
      track: {
        display: false,
        values: [],
        labels: [],
        highest: {
          value: 0,
          label: "",
          link: "",
          img: ""
        }
      }
    };
    let grids = page.structure.main.querySelectorAll(".grid-items-item:not([data-bleh-music-grids])");
    grids.forEach((grid) => {
      let is_loading = grid.querySelector(".grid-items-empty-inner") != null;
      if (is_loading)
        return;
      grid.setAttribute("data-bleh-music-grids", "true");
      let is_album;
      if (page.type == "search") {
        is_album = grid.querySelector(".stat-name") == null;
      } else {
        is_album = grid.querySelector(".grid-items-item-aux-block") != null;
      }
      let image_wrap = grid.querySelector(".grid-items-cover-image-image");
      let image = image_wrap.querySelector("img");
      if (image != null && !image_wrap.classList.contains("grid-items-cover-default")) {
        let grid_colour = document.createElement("div");
        grid_colour.classList.add("grid-item-colour-bg");
        image_wrap.appendChild(grid_colour);
        image.setAttribute("crossorigin", "anonymous");
        try {
          image.addEventListener("load", function() {
            let thief = new ColorThief();
            let colour = thief.getColor(image);
            let hsl = rgb_to_hsl(colour[0], colour[1], colour[2]);
            grid_colour.style.setProperty("background", `rgb(${colour})`);
            grid.classList.add("grid-items-item-has-colour");
            grid.style.setProperty("--hue-over", hsl.h);
            grid.style.setProperty("--sat-over", clamp_sat(hsl.s / 100 * 3));
            grid.style.setProperty("--lit-over", 1);
          });
        } catch (e) {
        }
      }
      let plays_elem;
      if (page.type == "search") {
        if (!is_album) {
          let aux_text = grid.querySelector(".grid-items-item-aux-text");
          let stat_name = aux_text.querySelector(".stat-name");
          aux_text.removeChild(stat_name);
          plays_elem = aux_text;
        }
      } else if (page.type == "tag") {
        let aux_text = grid.querySelector(".grid-items-item-aux-text");
        let stat_name = aux_text.querySelector(".stat-name");
        if (stat_name == null)
          return;
        aux_text.removeChild(stat_name);
        plays_elem = aux_text;
        if (is_album) {
          let artist = grid.querySelector(".grid-items-item-aux-block");
          aux_text.removeChild(artist);
          plays_elem = document.createElement("a");
          plays_elem.textContent = aux_text.textContent;
          aux_text.textContent = "";
          aux_text.appendChild(artist);
          aux_text.appendChild(plays_elem);
        }
      } else {
        plays_elem = grid.querySelector(".grid-items-item-aux-text a:last-child");
      }
      if (plays_elem != null && !grid.classList.contains("obsessions-item")) {
        let plays = clean_number(plays_elem.textContent.trim().replace(` ${trans_legacy[lang].statistics.plays.name}`, ""));
        plays_elem.classList.add("grid-item-plays");
        if (is_album)
          plays_elem.textContent = plays.toLocaleString(lang);
        if (!is_album) {
          insights.artist.display = true;
          insights.artist.values.push(plays);
          if (plays > insights.artist.highest.value)
            insights.artist.highest.value = plays;
        } else {
          insights.album.display = true;
          insights.album.values.push(plays);
          if (plays > insights.album.highest.value)
            insights.album.highest.value = plays;
        }
        if (page.type == "search" || page.type == "tag")
          plays_elem.classList.add("grid-item-listeners");
        if (!is_album && settings.colourful_counts && page.type == "user") {
          if (!plays_elem.getAttribute("href").includes("?from=") && (!plays_elem.getAttribute("href").includes("?date_preset=") || plays_elem.getAttribute("href").endsWith("?date_preset=ALL") || plays_elem.getAttribute("href").endsWith("?date_preset=null"))) {
            let parsed_scrobble_as_rank = parse_scrobbles_as_rank(plays);
            plays_elem.setAttribute("data-bleh--scrobble-milestone", parsed_scrobble_as_rank.milestone);
            plays_elem.style.setProperty("--hue-over", parsed_scrobble_as_rank.hue);
            plays_elem.style.setProperty("--sat-over", parsed_scrobble_as_rank.sat);
            plays_elem.style.setProperty("--lit-over", parsed_scrobble_as_rank.lit);
          }
        }
      }
      let name = grid.querySelector(".grid-items-item-main-text a");
      if (!is_album) {
        name.textContent = correct_artist(name.textContent.trim());
        insights.artist.labels.push(name.textContent);
      } else {
        let artist = grid.querySelector(".grid-items-item-aux-block");
        if (artist == null)
          return;
        artist.textContent = correct_artist(artist.textContent.trim());
        name.textContent = correct_item_by_artist(name.textContent.trim(), artist.textContent.trim());
        insights.album.labels.push(name.textContent);
      }
    });
    if (page.subpage.startsWith("library"))
      bleh_glacier_insights(insights);
  }

  // src/components/nag_bar.js
  function nag_bar() {
    let nags = page.structure.wrapper.querySelectorAll(".nag-bar");
    nags.forEach((active_nag) => {
      let type = active_nag.classList[1];
      if (type == "nag-bar--corrections") {
        if (!settings.travis) {
          notify({
            id: "corrections",
            title: trans_legacy[lang].nag_bar.corrections.title,
            body: active_nag.querySelector("strong").innerHTML,
            icon: "icon-16-refresh"
          });
        }
      } else {
        return;
      }
      active_nag.parentElement.removeChild(active_nag);
    });
  }

  // src/components/track.js
  function patch_titles() {
    if (page.subpage == "tags_overview")
      return;
    if (page.structure.main == null)
      return;
    let tracklists = page.structure.main.querySelectorAll(".chartlist:not(.chartlist__placeholder)");
    let insights = {
      artist: {
        display: false,
        values: [],
        labels: [],
        highest: {
          value: 0,
          label: "",
          link: "",
          img: ""
        }
      },
      album: {
        display: false,
        values: [],
        labels: [],
        highest: {
          value: 0,
          label: "",
          link: "",
          img: ""
        }
      },
      track: {
        display: false,
        values: [],
        labels: [],
        highest: {
          value: 0,
          label: "",
          link: "",
          img: ""
        }
      }
    };
    tracklists.forEach((tracklist) => {
      if (tracklist == null)
        return;
      console.log("tracklist found", tracklist);
      if (tracklist.querySelector("tbody > .chartlist-row:first-child > .kate-placeholder") != null)
        return;
      console.log("tracklist has not been run thru", tracklist);
      let tracks = tracklist.querySelectorAll(".chartlist-row:not(.chartlist__placeholder-row)");
      let is_library_track_page = page.subpage == "library_track_overview";
      tracks.forEach((track) => {
        console.log("track", track);
        if (track.getAttribute("data-track-type"))
          return;
        let bla = document.createElement("div");
        bla.classList.add("kate-placeholder");
        track.appendChild(bla);
        let track_title = track.querySelector(".chartlist-name a:not(.offset-section-anchor)");
        if (track_title == null)
          return;
        let is_user = track.querySelector(".chartlist-image .avatar") != null;
        let is_artist = false;
        if (is_user) {
          let link = track_title.getAttribute("href");
          if (link.startsWith(`${root}music/`)) {
            is_user = false;
            is_artist = true;
          }
        }
        if (is_user) {
          track.setAttribute("data-track-type", "user");
          if (settings.colourful_counts)
            patch_artist_ranks_in_list_view(track);
          return;
        }
        if (is_artist) {
          track.setAttribute("data-track-type", "artist");
          if (settings.colourful_counts)
            patch_artist_ranks_in_list_view(track);
          if (settings.corrections)
            track_title.textContent = correct_artist(track_title.getAttribute("title"));
          insights.artist.display = true;
          let bar2 = track.querySelector(".chartlist-count-bar-slug");
          let value = parseInt(bar2.getAttribute("data-stat-value"));
          insights.artist.values.push(value);
          if (value > insights.artist.highest.value)
            insights.artist.highest.value = value;
          log(`pushed insight artist label of ${track_title.textContent}`, "glacier library", "log");
          insights.artist.labels.push(track_title.textContent);
          return;
        }
        let is_album = track.hasAttribute("data-album-row");
        if (is_album)
          track.classList.add("bleh--is-album");
        let track_artist = return_artist_from_track(track_title.getAttribute("href"), is_album);
        track.classList.add("chartlist-row--with-artist");
        let bar = track.querySelector(".chartlist-count-bar-slug");
        if (bar) {
          let value = parseInt(bar.getAttribute("data-stat-value"));
          if (is_album) {
            insights.album.display = true;
            insights.album.values.push(value);
            if (value > insights.album.highest.value)
              insights.album.highest.value = value;
          } else {
            insights.track.display = true;
            insights.track.values.push(value);
            if (value > insights.track.highest.value)
              insights.track.highest.value = value;
          }
        }
        let track_legacy_menu = track.querySelector(".chartlist-more-menu");
        if (settings.format_guest_features) {
          let formatted_title = name_includes(track_title.getAttribute("title"), track_artist);
          console.log("formatted", formatted_title);
          let song_title = track_title.getAttribute("title");
          let song_tags = {};
          if (formatted_title != void 0) {
            song_title = formatted_title[0];
            song_tags = formatted_title[1];
          }
          track_title.setAttribute("title", correct_item_by_artist(track_title.getAttribute("title"), track_artist));
          let song_tags_text = "";
          for (let song_tag in song_tags) {
            song_tags_text = `${song_tags_text}<div class="feat" data-bleh--tag-type="${song_tags[song_tag].type}" data-bleh--tag-group="${song_tags[song_tag].group}">${sanitise_text(song_tags[song_tag].text)}</div>`;
          }
          track_title.innerHTML = `<div class="title">${sanitise_text(song_title)}</div>${song_tags_text}`;
          let song_artist_element = track.querySelector(".chartlist-artist");
          if (song_artist_element == null && !is_user) {
            song_artist_element = document.createElement("td");
            song_artist_element.classList.add("chartlist-artist");
            track.appendChild(song_artist_element);
          }
          if (song_artist_element.textContent.replaceAll("+", " ").trim() == track_artist || song_artist_element.textContent.trim() == "") {
            song_artist_element.innerHTML = `<a href="${root}music/${sanitise(formatted_title[2])}" title="${sanitise_text(formatted_title[2])}">${sanitise_text(formatted_title[2])}</a>`;
            let song_guests = formatted_title[3];
            for (let guest in song_guests) {
              song_artist_element.innerHTML = `${song_artist_element.innerHTML},`;
              let guest_element = document.createElement("a");
              guest_element.setAttribute("href", `${root}music/${sanitise(song_guests[guest])}`);
              guest_element.setAttribute("title", song_guests[guest]);
              guest_element.textContent = song_guests[guest];
              song_artist_element.appendChild(guest_element);
            }
          }
          let track_timestamp = track.querySelector(".chartlist-timestamp span");
          let track_timestamp_contents;
          if (track_timestamp != null) {
            track_timestamp_contents = track_timestamp.getAttribute("title");
            track_timestamp.setAttribute("title", "");
          }
          let image = track.querySelector(".chartlist-image img");
          if (image == null && page.type == "user")
            is_library_track_page = true;
          if (track_legacy_menu) {
            let track_preview = document.createElement("div");
            track_preview.classList.add("track-preview");
            track_preview.innerHTML = `
                        <div class="image">
                            <div class="inner-image">
                                ${image != null ? image.outerHTML : '<img class="missing-track">'}
                            </div>
                        </div>
                        <div class="info">
                            <h5 class="title">${song_title}</h5>
                            <p class="artist">${song_artist_element.innerHTML}</p>
                            <div class="tags">${song_tags_text}</div>
                            ${!is_library_track_page ? is_album ? "" : `<p class="album">${image != null ? correct_item_by_artist(sanitise_text(image.getAttribute("alt")), track_artist) : page.name}</p>` : ""}
                            ${track_timestamp != null && track_timestamp_contents != null ? `<p class="timestamp">${track_timestamp_contents}</p>` : ""}
                        </div>
                    `;
            track_legacy_menu.insertBefore(track_preview, track_legacy_menu.firstElementChild);
          }
        } else if (settings.corrections) {
          let song_artist_element = track.querySelector(".chartlist-artist a");
          if (song_artist_element != null) {
            let corrected_title = correct_item_by_artist(track_title.textContent, song_artist_element.textContent);
            track_title.textContent = corrected_title;
            track_title.setAttribute("title", corrected_title);
            let corrected_artist = correct_artist(song_artist_element.textContent);
            song_artist_element.textContent = corrected_artist;
            song_artist_element.setAttribute("title", corrected_artist);
          } else {
            let corrected_title = correct_item_by_artist(track_title.textContent, track_artist);
            track_title.textContent = corrected_title;
            track_title.setAttribute("title", corrected_title);
          }
          let track_timestamp = track.querySelector(".chartlist-timestamp span");
          let track_timestamp_contents;
          if (track_timestamp != null) {
            track_timestamp_contents = track_timestamp.getAttribute("title");
            track_timestamp.setAttribute("title", "");
            tippy(track_timestamp, {
              content: track_timestamp_contents
            });
          }
        } else {
          let track_timestamp = track.querySelector(".chartlist-timestamp span");
          let track_timestamp_contents;
          if (track_timestamp != null) {
            track_timestamp_contents = track_timestamp.getAttribute("title");
            track_timestamp.setAttribute("title", "");
            tippy(track_timestamp, {
              content: track_timestamp_contents
            });
          }
        }
        if (track_legacy_menu) {
          let menu = tippy(track, {
            theme: "context-menu",
            content: `
                        ${track_legacy_menu.innerHTML}
                    `,
            allowHTML: true,
            placement: "right-start",
            trigger: "manual",
            interactive: true,
            interactiveBorder: 10,
            offset: [0, 0],
            onShow(instance) {
              instance.popper.addEventListener("click", (event2) => {
                instance.hide();
              });
            }
          });
          register_menu(track, menu);
        }
        if (is_album) {
          log(`pushed insight album label of ${track_title.getAttribute("title")}`, "glacier library", "log");
          insights.album.labels.push(track_title.getAttribute("title"));
        } else {
          log(`pushed insight track label of ${track_title.getAttribute("title")}`, "glacier library", "log");
          insights.track.labels.push(track_title.getAttribute("title"));
        }
        if (!settings.colourful_tracks)
          return;
        if (!is_album && track.classList.contains("chartlist-row--now-scrobbling")) {
          let image_wrap = track.querySelector(".chartlist-image");
          let link = image_wrap.querySelector(".cover-art");
          let image = link.querySelector("img");
          if (!settings.album_text) {
            let alt = image.getAttribute("alt");
            let album_text = document.createElement("td");
            album_text.classList.add("chartlist-album", "custom-album-text");
            album_text.innerHTML = `
                        <a href="${link.getAttribute("href")}">${alt}</a>
                    `;
            track.appendChild(album_text);
          }
          image.setAttribute("crossorigin", "anonymous");
          try {
            image.addEventListener("load", function() {
              let thief = new ColorThief();
              let colour = thief.getColor(image);
              let hsl = rgb_to_hsl(colour[0], colour[1], colour[2]);
              track.style.setProperty("--hue-over", hsl.h);
              track.style.setProperty("--sat-over", clamp_sat(hsl.s / 100 * 3));
              track.style.setProperty("--lit-over", 1);
            });
          } catch (e) {
          }
        }
      });
    });
    if (page.subpage.startsWith("library"))
      bleh_glacier_insights(insights);
  }

  // src/navigation.js
  function patch_masthead(element) {
    let masthead_logo = element.querySelector(".masthead-logo");
    if (!masthead_logo)
      return;
    if (!masthead_logo.hasAttribute("data-kate-processed")) {
      masthead_logo.setAttribute("data-kate-processed", "true");
      let link = document.createElement("a");
      link.classList.add("home-link");
      link.setAttribute("href", `${root}music`);
      link.innerHTML = `<div class="bleh-logo">${version.brand}</div>`;
      masthead_logo.appendChild(link);
      let version_text = document.createElement("a");
      version_text.classList.add("bleh--version");
      version_text.setAttribute("href", `${root}bleh`);
      version_text.textContent = `${version.build}.${version.sku}${settings.dev ? ` (dev)` : ""}`;
      masthead_logo.appendChild(version_text);
    }
  }
  function append_nav() {
    if (ff("developer") && !page.structure.indicator) {
      let page_indicator2 = document.createElement("div");
      page_indicator2.classList.add("page-indicator");
      document.documentElement.appendChild(page_indicator2);
      page.structure.indicator = page_indicator2;
    }
    let auth_link2 = document.body.querySelector(".auth-link");
    if (!auth_link2)
      return;
    if (auth_link2.hasAttribute("data-bleh"))
      return;
    auth_link2.setAttribute("data-bleh", "true");
    let text = document.createElement("p");
    text.textContent = auth.name;
    auth_link2.appendChild(text);
    if (document.body.querySelector(".masthead .masthead-pro-wrap") != null)
      auth.pro = true;
    else
      auth.pro = false;
    let badges = load_badges(auth.name, true);
    if (badges) {
      let badge = document.createElement("span");
      badge.classList.add("label", `user-status--bleh-${badges[0].type}`, `user-status--bleh-user-${auth.name}`, "auth-badge");
      badge.textContent = badges[0].name;
      auth_link2.appendChild(badge);
      auth_link2.classList.add(`user-status--bleh-${badges[0].type}`, `user-status--bleh-user-${auth.name}`);
      auth_link2.setAttribute("data-has-colour", "true");
    } else if (auth.pro) {
      let pro_badge = document.createElement("p");
      pro_badge.classList.add("label", "user-status-subscriber", "auth-badge");
      pro_badge.textContent = "Pro";
      auth_link2.appendChild(pro_badge);
      auth_link2.classList.add("user-status-subscriber");
      auth_link2.setAttribute("data-has-colour", "true");
    }
    let notif_btn = document.body.querySelector('.masthead-nav-control[data-analytics-label="notifications"]');
    let notif_count = notif_btn.querySelector(".notification-count-badge");
    if (notif_count) {
      notif_count = notif_count.textContent;
      tippy(notif_btn, {
        content: tl(trans.notifications.count).replace("{count}", notif_count)
      });
      notif_btn.setAttribute("data-count", notif_count);
    } else {
      tippy(notif_btn, {
        content: tl(trans.notifications.none)
      });
    }
    let inbox_btn = document.body.querySelector('.masthead-nav-control[data-analytics-label="inbox"]');
    let inbox_count = inbox_btn.querySelector(".notification-count-badge");
    if (inbox_count) {
      inbox_count = inbox_count.textContent;
      tippy(inbox_btn, {
        content: tl(trans.inbox.count).replace("{count}", inbox_count)
      });
      inbox_btn.setAttribute("data-count", inbox_count);
    } else {
      tippy(inbox_btn, {
        content: tl(trans.inbox.none)
      });
    }
    let inbox_container = document.body.querySelector('.masthead-nav-item:has([data-analytics-label="inbox"])');
    let changelog_container = document.createElement("li");
    changelog_container.classList.add("masthead-nav-item");
    changelog_container.innerHTML = `
        <a class="masthead-nav-control" onclick="_query_changelog()" data-bleh--label="changelog">
            ${trans_legacy[lang].changelog.name}
        </a>
    `;
    tippy(changelog_container, {
      content: trans_legacy[lang].changelog.name
    });
    inbox_container.after(changelog_container);
    let bleh_container = document.createElement("li");
    bleh_container.classList.add("masthead-nav-item");
    bleh_container.innerHTML = `
        <a class="masthead-nav-control" href="${root}bleh${stored_season.id != "none" ? "?tab=seasonal" : ""}" data-bleh--label="bleh" data-season="${stored_season.id}" data-season-active="${stored_season.id != "none" ? "true" : "false"}">
            ${stored_season.id == "none" ? trans_legacy[lang].auth_menu.configure_bleh : moment(stored_season.end.replace("y0", stored_season.year).replace("{offset}", stored_season.offset)).to(stored_season.now, true)}
        </a>
    `;
    if (stored_season.id == "none") {
      tippy(bleh_container, {
        content: trans_legacy[lang].auth_menu.configure_bleh
      });
    } else {
      page.header.season_tooltip = tippy(bleh_container, {
        theme: "seasonal-swatch",
        content: `
                <span class="season-colour-name">${trans_legacy[lang].settings.customise.seasonal.listing[stored_season.id]}</span>
                <span class="season-exclusive">${trans_legacy[lang].auth_menu.seasonal_notice}</span>
            `,
        allowHTML: true
      });
    }
    changelog_container.after(bleh_container);
    page.header.season = bleh_container.querySelector("a");
    let site_auth = document.body.querySelector(".site-auth");
    let legacy_auth_menu = site_auth.querySelector(".auth-dropdown-menu");
    let token = legacy_auth_menu.querySelector('[name="csrfmiddlewaretoken"]').getAttribute("value");
    let auth_menu = tippy(auth_link2, {
      theme: "auth-menu",
      content: `
            <a class="dropdown-menu-clickable-item" data-menu-item="profile" href="${root}user/${auth.name}">
                ${auth.name}
            </a>
            <a class="dropdown-menu-clickable-item" data-menu-item="profile-shortcut" href="${root}user/${settings.profile_shortcut}" data-profile-shortcut="${settings.profile_shortcut}">
                ${settings.profile_shortcut}
            </a>
            <div class="sep"></div>
            <a class="dropdown-menu-clickable-item" data-menu-item="library" href="${root}user/${auth.name}/library">
                ${tl(trans.library)}
            </a>
            <a class="dropdown-menu-clickable-item" data-menu-item="shouts" href="${root}user/${auth.name}/shoutbox">
                ${tl(trans.shouts)}
            </a>
            ${settings.auth_menu_obsessions ? `
            <a class="dropdown-menu-clickable-item" data-menu-item="obsessions" href="${root}user/${auth.name}/obsessions">
                ${trans_legacy[lang].auth_menu.obsessions}
            </a>
            ` : ""}
            <button class="dropdown-menu-clickable-item" data-menu-item="themes" onclick="toggle_theme()">
                <span class="auth-dropdown-item-row">
                    <span class="auth-dropdown-item-left">${tl(trans.themes.name)}</span>
                    <span class="auth-dropdown-item-right" id="theme-value">${tl(trans.themes[settings.theme])}</span>
                </span>
            </button>
            ${ff("dev") ? `
            <button class="dropdown-menu-clickable-item" data-menu-item="developer" onclick="_update_flag_toggle('dev', this)">
                ${trans_legacy[lang].auth_menu.dev}
            </button>
            ` : ""}
            <a class="dropdown-menu-clickable-item" data-menu-item="bleh" href="${root}bleh">
                ${tl(trans.configure_bleh)}
            </a>
            <div class="sep"></div>
            <a class="dropdown-menu-clickable-item" data-menu-item="labs" href="${root}labs">
                ${trans_legacy[lang].auth_menu.labs}
            </a>
            <a class="dropdown-menu-clickable-item" data-menu-item="bookmarks" href="${root}music/+bookmarks">
                ${tl(trans.bookmarks)}
            </a>
            <a class="dropdown-menu-clickable-item" data-menu-item="settings" href="${root}settings">
                ${tl(trans.settings)}
            </a>
            <form>
                <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
                <a class="dropdown-menu-clickable-item" data-menu-item="logout" href="${root}logout">
                    ${trans_legacy[lang].auth_menu.logout}
                </a>
            </form>
        `,
      allowHTML: true,
      placement: "top",
      interactive: true,
      interactiveBorder: 10,
      onShow(instance) {
        instance.popper.style.setProperty("--url", `url(${auth.avatar.replace("avatar42s", "avatar170s")})`);
        let shortcut_item = instance.popper.querySelector('[data-menu-item="profile-shortcut"]');
        if (shortcut_item.getAttribute("data-profile-shortcut") != settings.profile_shortcut) {
          shortcut_item.setAttribute("data-profile-shortcut", settings.profile_shortcut);
          shortcut_item.setAttribute("href", `${root}user/${settings.profile_shortcut}`);
          shortcut_item.textContent = settings.profile_shortcut;
        }
        instance.popper.querySelector("#theme-value").textContent = tl(trans.themes[settings.theme]);
        let theme_menu_item = tippy(instance.popper.querySelector('[data-menu-item="themes"]:not([aria-expanded])'), {
          theme: "menu",
          content: `
                    <button class="dropdown-menu-clickable-item theme-item-in-menu" data-bleh-theme="light" onclick="change_theme_from_menu('light')">
                        ${tl(trans.themes.light)}
                    </button>
                    <button class="dropdown-menu-clickable-item theme-item-in-menu" data-bleh-theme="dark" onclick="change_theme_from_menu('dark')">
                        ${tl(trans.themes.dark)}
                    </button>
                    <button class="dropdown-menu-clickable-item theme-item-in-menu" data-bleh-theme="darker" onclick="change_theme_from_menu('darker')">
                        ${tl(trans.themes.darker)}
                    </button>
                    <button class="dropdown-menu-clickable-item theme-item-in-menu" data-bleh-theme="oled" onclick="change_theme_from_menu('oled')">
                        ${tl(trans.themes.oled)}
                    </button>
                `,
          allowHTML: true,
          placement: "left",
          hideOnClick: false,
          interactive: true,
          interactiveBorder: 10,
          onShow(instance_2) {
            show_theme_change_in_menu("", instance_2.popper);
          }
        });
      }
    });
    site_auth.removeChild(site_auth.querySelector(".auth-dropdown-menu-wrap"));
    let selected_language = document.querySelector(".footer-language--active strong")?.textContent;
    let language_options = document.querySelectorAll(".footer-language-form");
    let language_menu = document.createElement("div");
    language_menu.classList.add("language-menu");
    let sel_button = document.createElement("button");
    sel_button.classList.add("dropdown-menu-clickable-item", "lang-item", "active");
    sel_button.setAttribute("data-lang", non_override_lang);
    sel_button.style.setProperty("--flag-url", `url('https://katelyynn.github.io/bleh/fm/flags/${non_override_lang}.svg')`);
    sel_button.textContent = selected_language;
    language_menu.appendChild(sel_button);
    language_options.forEach((language_option) => {
      let button = language_option.querySelector("button");
      button.classList.remove("mimic-link");
      button.classList.add("dropdown-menu-clickable-item", "lang-item");
      button.setAttribute("data-lang", button.getAttribute("name"));
      button.style.setProperty("--flag-url", `url('https://katelyynn.github.io/bleh/fm/flags/${button.getAttribute("name")}.svg')`);
      language_menu.appendChild(language_option);
    });
    let language_nav = document.createElement("a");
    language_nav.classList.add("language-nav");
    language_nav.innerHTML = `
        <span data-lang="${non_override_lang}" style="--flag-url: url('https://katelyynn.github.io/bleh/fm/flags/${non_override_lang}.svg');">${selected_language}</span>
    `;
    tippy(language_nav, {
      theme: "language-menu",
      content: `
            ${language_menu.innerHTML}
        `,
      allowHTML: true,
      delay: [100, 50],
      placement: "bottom",
      //trigger: 'click',
      interactive: true
    });
    let inner = document.body.querySelector(".masthead-nav-wrap");
    let auth_container = inner.querySelector(".site-auth");
    inner.insertBefore(language_nav, auth_container);
  }

  // src/components/about_artist.js
  function bleh_about_artist() {
    let legacy_container = page.structure.main.querySelector(".about-artist");
    if (legacy_container == null)
      return;
    let avatar = legacy_container.querySelector(".gallery-preview-image--0 img");
    let listeners = legacy_container.querySelector(".about-artist-listeners");
    let tags = legacy_container.querySelector(".about-artist-tags");
    let wiki = legacy_container.querySelector(".wiki-block.visible-lg");
    if (wiki != null)
      wiki.classList.remove("visible-lg");
    let about_artist_container = legacy_container.parentElement;
    about_artist_container.classList.add("about-artist-container");
    about_artist_container.innerHTML = `
        <div class="about-artist-panel">
            <div class="avatar-side">
                ${avatar != null ? `<img src="${avatar.getAttribute("src")}"><a onclick="_expand_avatar('${avatar.getAttribute("src").replace("/300x300/", "/ar0/")}')" class="bleh--avatar-clickable-link"></a>` : '<img class="missing-artist">'}
            </div>
            <div class="info-side">
                <div class="sub-text">${trans_legacy[lang].music.about}</div>
                <h1><a href="${root}music/${sanitise(page.sister)}">${sanitise_text(page.sister)}</a></h1>
                ${listeners != null ? listeners.outerHTML : ""}
                ${tags != null ? tags.outerHTML : ""}
                ${wiki != null ? wiki.outerHTML : ""}
            </div>
        </div>
        ${page.sister_others.length > 0 ? `<div class="sep"></div><div class="sub-text">${trans_legacy[lang].music.about_guests}</div>` : ""}
    `;
    if (page.sister_others.length > 0) {
      let guest_feature_panel = document.createElement("div");
      guest_feature_panel.classList.add("about-guest-features-panel");
      for (let guest in page.sister_others) {
        let guest_element = document.createElement("a");
        guest_element.classList.add("about-guest-feature");
        guest_element.setAttribute("href", `${root}music/${sanitise(page.sister_others[guest])}`);
        guest_element.textContent = page.sister_others[guest];
        guest_feature_panel.appendChild(guest_element);
      }
      about_artist_container.appendChild(guest_feature_panel);
    }
  }

  // src/components/structure.js
  function checkup_page_structure(is_subpage = false, header = null) {
    if (document.body.style.getPropertyValue("--hue-album")) {
      document.body.style.removeProperty("--hue-album");
      document.body.style.removeProperty("--sat-album");
      load_chart_colours();
    }
    let params = new URLSearchParams(document.location.search);
    page.requested.tab = params.get("tab");
    page.requested.page = params.get("page");
    if (!page.structure.container || !document.body.contains(page.structure.container)) {
      log("page missing container, creating", "page structure");
      page.structure.container = document.createElement("div");
      page.structure.container.classList.add("page-content", "container");
      let container_full_width = document.body.querySelector(".container--full-width");
      if (container_full_width)
        container_full_width.insertBefore(page.structure.container, container_full_width.firstElementChild);
      else
        document.body.querySelector(".adaptive-skin-container").appendChild(page.structure.container);
    }
    page.structure.container.setAttribute("data-assigned", "true");
    let other_container = document.body.querySelector(".page-content.container:not([data-assigned])");
    if (other_container) other_container.style.setProperty("display", "none");
    if (!page.structure.row || !document.body.contains(page.structure.row)) {
      log("page missing row, creating", "page structure");
      page.structure.row = document.createElement("div");
      page.structure.row.classList.add("row");
      page.structure.container.insertBefore(page.structure.row, page.structure.container.firstElementChild);
    }
    if (page.structure.row.classList.contains("buffer-4"))
      page.structure.row.classList = "row col-main-is-primary";
    if (!page.structure.main || !document.body.contains(page.structure.main)) {
      log("page missing main, creating", "page structure");
      page.structure.main = document.createElement("div");
      page.structure.main.classList.add("col-main");
      page.structure.row.appendChild(page.structure.main);
    }
    page.structure.main.setAttribute("data-assigned", "true");
    let other_main = page.structure.row.querySelector(".col-main.hidden-xs:not([data-assigned])");
    if (other_main) other_main.style.setProperty("display", "none");
    if (!page.structure.side || !document.body.contains(page.structure.side)) {
      log("page missing side", "page structure");
      page.structure.side = page.structure.row.querySelector(".col-sidebar");
      if (!page.structure.side) {
        log("page missing side, creating", "page structure");
        page.structure.side = document.createElement("div");
        page.structure.side.classList.add("col-sidebar");
        page.structure.row.appendChild(page.structure.side);
      }
    }
    log("finished", "page structure");
    if (ff("refreshed_music_nav") && header) {
      let navlist = header.querySelector(".navlist");
      if (navlist) {
        navlist.classList.add("redesigned-navigation");
        page.structure.container.insertBefore(navlist, page.structure.container.firstElementChild);
        page.structure.nav = navlist;
      }
      if (is_subpage) {
        let content_top2 = document.body.querySelector(".content-top");
        if (content_top2) {
          content_top2.classList.add("redesigned-content-top");
          page.structure.content_top = content_top2;
          navlist.after(content_top2);
          if (content_top2.querySelector(".content-top-back-link"))
            content_top2.style.setProperty("display", "none");
        } else {
          let subpage_title = page.structure.main.querySelector(":scope > .subpage-title");
          if (!subpage_title)
            subpage_title = page.structure.main.querySelector(":scope > .section-controls > .subpage-title");
          if (!subpage_title)
            subpage_title = page.structure.main.querySelector(":scope > section:first-child .section-controls > .subpage-title");
          if (subpage_title) {
            content_top2 = document.createElement("div");
            content_top2.classList.add("content-top", "redesigned-content-top");
            content_top2.innerHTML = `
                        <div class="content-top-inner-wrap">
                            <div class="container content-top-lower">
                                <h1 class="content-top-header">${subpage_title.textContent.trim()}</h1>
                            </div>
                        </div>
                    `;
            page.structure.content_top = content_top2;
            navlist.after(content_top2);
            try {
              page.structure.main.removeChild(subpage_title);
            } catch (e) {
            }
          }
          navlist = page.structure.main.querySelector(".navlist");
          if (navlist) {
            navlist.classList.add("redesigned-navigation");
            if (page.structure.content_top)
              page.structure.content_top.after(navlist);
            else
              page.structure.container.insertBefore(navlist, page.structure.row);
          }
          let btn_add = page.structure.main.querySelector(":scope > .btn-add");
          if (!btn_add) btn_add = page.structure.main.querySelector(":scope > section:first-child .btn-add");
          if (btn_add) {
            btn_add.classList = "btn view-all-button back add-button";
            let add_panel = document.createElement("section");
            add_panel.classList.add("view-all-panel");
            add_panel.appendChild(btn_add);
            page.structure.side.insertBefore(add_panel, page.structure.side.firstElementChild);
          }
          let playlink = page.structure.main.querySelector(":scope > .section-controls > .section-playlink");
          if (playlink) {
            playlink.classList.add("btn", "view-all-button", "back", "play-button");
            let playlink_panel = document.createElement("section");
            playlink_panel.classList.add("view-all-panel");
            playlink_panel.appendChild(playlink);
            page.structure.side.insertBefore(playlink_panel, page.structure.side.firstElementChild);
          }
        }
      } else {
        let content_top2 = document.body.querySelector(".content-top");
        if (content_top2) content_top2.classList.add("legacy-content-top");
      }
    }
  }

  // src/pages/wiki.js
  function bleh_wiki() {
    let wiki_panel = document.createElement("section");
    wiki_panel.classList.add("wiki-panel");
    wiki_panel.innerHTML = page.structure.main.innerHTML;
    page.structure.main.innerHTML = "";
    page.structure.main.appendChild(wiki_panel);
    page.structure.main.classList.add("not-a-panel");
    let original_edit_button = page.structure.main.querySelector(".qa-wiki-edit");
    let original_version_history = page.structure.main.querySelector(".wiki-history-link--desktop a");
    let new_edit_panel;
    if (original_edit_button != null) {
      new_edit_panel = document.createElement("section");
      new_edit_panel.classList.add("view-all-panel");
      new_edit_panel.innerHTML = `
            <a class="btn view-all-button back wiki-edit-button" href="${original_edit_button.getAttribute("href")}">
                ${original_edit_button.textContent}
            </a>
        `;
      page.structure.side.insertBefore(new_edit_panel, page.structure.side.firstElementChild);
    }
    if (original_version_history != null) {
      let new_version_panel = document.createElement("section");
      new_version_panel.classList.add("view-all-panel");
      new_version_panel.innerHTML = `
            <a class="btn view-all-button back wiki-history-button" href="${original_version_history.getAttribute("href")}">
                ${original_version_history.textContent}
            </a>
        `;
      if (original_edit_button != null)
        new_edit_panel.after(new_version_panel);
      else
        page.structure.side.insertBefore(new_version_panel, page.structure.side.firstElementChild);
    }
    let wiki_author = wiki_panel.querySelector(".wiki-author");
    if (wiki_author != null) {
      let h2 = wiki_panel.querySelector("h2.text-18");
      let sub_text = document.createElement("div");
      sub_text.classList.add("sub-text", "space-below");
      sub_text.innerHTML = `
            <div class="breadcrumb-origin prominent">
                ${h2 != null ? h2.innerHTML : page.structure.container.querySelector(".content-top-header").textContent}
            </div>
            <div class="wiki-author-side">
                ${wiki_author.innerHTML}
            </div>
        `;
      wiki_panel.insertBefore(sub_text, wiki_panel.firstElementChild);
      if (h2 != null)
        wiki_panel.removeChild(h2);
    }
    let wiki = wiki_panel.querySelector(".wiki");
    if (wiki == null)
      return;
    patch_wiki_contents(wiki);
  }
  function bleh_wiki_history() {
    let breadcrumb_root = page.structure.container.querySelector(".subpage-breadcrumb");
    let breadcrumb_name = page.structure.container.querySelector(".subpage-title");
    if (breadcrumb_root == null) {
      breadcrumb_root = page.structure.container.querySelector(".content-top-back-link");
      breadcrumb_name = page.structure.container.querySelector(".content-top-header");
    }
    let sub_text = document.createElement("div");
    sub_text.classList.add("sub-text", "space-below");
    sub_text.innerHTML = `
        <div class="breadcrumb">
            ${breadcrumb_root.querySelector("a").outerHTML}
            <div class="breadcrumb-name prominent">
                ${breadcrumb_name.textContent}
            </div>
        </div>
    `;
    breadcrumb_root.style.setProperty("display", "none");
    breadcrumb_name.style.setProperty("display", "none");
    let buffer_container = page.structure.container.querySelector(".row ~ .buffer-4");
    if (buffer_container == null)
      buffer_container = page.structure.container.querySelector(".wiki-history");
    let wiki_history_table = buffer_container.querySelector(".wiki-history-table");
    let pagination = buffer_container.querySelector(".pagination");
    let wiki_panel = document.createElement("section");
    wiki_panel.classList.add("wiki-history-panel");
    wiki_panel.appendChild(sub_text);
    wiki_panel.appendChild(wiki_history_table);
    page.structure.main.appendChild(wiki_panel);
    buffer_container.style.setProperty("display", "none");
    if (pagination != null)
      wiki_panel.appendChild(pagination);
    let latest_version_panel = document.createElement("section");
    latest_version_panel.classList.add("view-all-panel");
    latest_version_panel.innerHTML = `
        <a class="btn view-all-button back wiki-latest-button" href="${sub_text.querySelector("a").getAttribute("href")}">
            ${trans_legacy[lang].wiki.latest}
        </a>
    `;
    page.structure.side.appendChild(latest_version_panel);
    let entries = page.structure.main.querySelectorAll(".wiki-history-entry");
    entries.forEach((entry) => {
      let author = entry.querySelector(".wiki-history-author");
      let avatar = author.querySelector(".wiki-history-author-avatar");
      let name = author.querySelector(".link-block-target");
      if (name != null && avatar != null) {
        let badge = patch_avatar(avatar, name.textContent, "wiki");
        if (badge.type == "avatar-status-dot--staff")
          entry.classList.add("staff-shout");
      }
    });
  }
  function bleh_wiki_editor() {
    let wiki_edit_panel = document.createElement("section");
    wiki_edit_panel.classList.add("wiki-edit-panel");
    wiki_edit_panel.innerHTML = page.structure.main.innerHTML;
    page.structure.main.innerHTML = "";
    page.structure.main.appendChild(wiki_edit_panel);
    page.structure.main.classList.add("not-a-panel");
    let breadcrumb_root = page.structure.container.querySelector(".subpage-breadcrumb");
    let breadcrumb_name = page.structure.container.querySelector(".subpage-title");
    if (breadcrumb_name == null) {
      breadcrumb_name = page.structure.content_top.querySelector(".content-top-header");
      if (breadcrumb_name != null) {
        page.structure.content_top.style.setProperty("display", "none");
      }
    }
    if (breadcrumb_root == null) {
      breadcrumb_root = page.structure.container.querySelector(".content-top-back-link");
      breadcrumb_name = page.structure.container.querySelector(".content-top-header");
    }
    let sub_text = document.createElement("div");
    sub_text.classList.add("sub-text", "space-below");
    sub_text.innerHTML = `
        <div class="breadcrumb">
            ${breadcrumb_root.querySelector("a").outerHTML}
            <div class="breadcrumb-name prominent">
                ${breadcrumb_name.textContent}
            </div>
        </div>
    `;
    breadcrumb_root.style.setProperty("display", "none");
    breadcrumb_name.style.setProperty("display", "none");
    wiki_edit_panel.insertBefore(sub_text, wiki_edit_panel.firstElementChild);
    let wiki_syntax = document.createElement("section");
    wiki_syntax.classList.add("bleh--blank-panel", "wiki-syntax-panel");
    wiki_syntax.innerHTML = `
        <h3 class="text-18">${trans_legacy[lang].wiki.syntax.name}</h3>
        <div class="syntax-listing">
            <div class="syntax-listing-item">
                <div class="code-side">[artist]julie[/artist]</div>
                <div class="detail-side">${trans_legacy[lang].wiki.syntax.links_to.replace("{link}", `<a href="${root}music/julie" target="_blank">julie</a>`)}</div>
            </div>
            <div class="syntax-listing-item">
                <div class="code-side">[album artist=julie]pushing daisies[/album]</div>
                <div class="detail-side">${trans_legacy[lang].wiki.syntax.links_to.replace("{link}", `<a href="${root}music/julie/pushing+daisies" target="_blank">pushing daisies</a>`)}</div>
            </div>
            <div class="syntax-listing-item">
                <div class="code-side">[track artist=julie]very little effort[/track]</div>
                <div class="detail-side">${trans_legacy[lang].wiki.syntax.links_to.replace("{link}", `<a href="${root}music/julie/_/very+little+effort" target="_blank">very little effort</a>`)}</div>
            </div>
        </div>
        <div class="sep"></div>
        <div class="syntax-listing">
            <div class="syntax-listing-item">
                <div class="code-side">[url]https://cutensilly.org/bleh/fm[/url]</div>
                <div class="detail-side">${trans_legacy[lang].wiki.syntax.links_to.replace("{link}", `<a href="https://cutensilly.org/bleh/fm" target="_blank">https://cutensilly.org/bleh/fm</a>`)}</div>
            </div>
            <div class="syntax-listing-item">
                <div class="code-side">[url=https://cutensilly.org/bleh/fm]blehhh[/url]</div>
                <div class="detail-side">${trans_legacy[lang].wiki.syntax.links_to.replace("{link}", `<a href="https://cutensilly.org/bleh/fm" target="_blank">blehhh</a>`)}</div>
            </div>
        </div>
        <div class="sep"></div>
        <div class="syntax-listing">
            <div class="syntax-listing-item">
                <div class="code-side">[tag]grunge[/tag]</div>
                <div class="detail-side">${trans_legacy[lang].wiki.syntax.links_to.replace("{link}", `<a href="${root}tag/grunge" target="_blank">grunge</a>`)}</div>
            </div>
            <div class="syntax-listing-item">
                <div class="code-side">[user]${auth.name}[/user]</div>
                <div class="detail-side">${trans_legacy[lang].wiki.syntax.links_to.replace("{link}", `<a class="mention" href="${root}user/${auth.name}" target="_blank">@${auth.name}</a>`)}</div>
            </div>
        </div>
    `;
    page.structure.side.innerHTML = "";
    let latest_version_panel = document.createElement("section");
    latest_version_panel.classList.add("view-all-panel");
    latest_version_panel.innerHTML = `
        <a class="btn view-all-button back wiki-latest-button" href="${sub_text.querySelector("a").getAttribute("href")}">
            ${trans_legacy[lang].wiki.latest}
        </a>
    `;
    page.structure.side.appendChild(latest_version_panel);
    let wiki_presets_panel = document.createElement("section");
    wiki_presets_panel.classList.add("wiki-presets-panel");
    wiki_presets_panel.innerHTML = `
        <h3 class="text-18">${trans_legacy[lang].wiki.presets.name}</h3>
        <div class="presets">
            <div class="preset">\u201C</div>
            <div class="preset">\u201D</div>
            <div class="preset">\u2014</div>
            <div class="preset">\u2018</div>
            <div class="preset">\u2019</div>
            <div class="preset">-</div>
        </div>
    `;
    page.structure.side.appendChild(wiki_presets_panel);
    page.structure.side.appendChild(wiki_syntax);
    let rules = page.structure.main.querySelector(".wiki-style-rules");
    let rules_panel = document.createElement("section");
    rules_panel.classList.add("rules-panel");
    rules_panel.innerHTML = rules.innerHTML;
    page.structure.side.appendChild(rules_panel);
  }
  function patch_wiki() {
    if (ff("show_wiki_label")) {
      let wiki_col = page.structure.main.querySelector(".wiki-column");
      let wiki_empty = false;
      if (!wiki_col)
        return;
      let wiki_block = wiki_col.querySelector(".wiki-block.visible-lg .wiki-block-inner-2");
      if (wiki_block == null) {
        wiki_block = wiki_col.querySelector(".wiki-block-cta");
        wiki_empty = true;
      }
      let read_more = wiki_block.querySelector("a:last-child");
      if (read_more) {
        read_more.classList.add("read-more");
        read_more.textContent = trans_legacy[lang].music.wiki_read;
      }
      let wiki_header = document.createElement("div");
      wiki_header.classList.add("sub-text");
      wiki_header.innerHTML = `
            <p>${trans_legacy[lang].music.wiki.replace("{a}", page.name)}</p>
            <span class="right-links">
                <p><a class="wiki-edit-small" href="${document.location.href}/+wiki/edit">${trans_legacy[lang].music.wiki_edit}</a></p>
                ${!wiki_empty ? `<p>${read_more.outerHTML}</p>` : ""}
            </span>
        `;
      wiki_col.insertBefore(wiki_header, wiki_col.firstElementChild);
      if (!wiki_empty) {
        patch_wiki_contents(wiki_block);
      }
    }
  }
  function patch_wiki_contents(wiki_block) {
    let links = wiki_block.querySelectorAll("a");
    links.forEach((link) => {
      let href = link.getAttribute("href");
      let type;
      let name = link.textContent.trim();
      let sister;
      if (!href.startsWith(root)) {
        tippy(link, {
          content: link.getAttribute("href")
        });
        return;
      }
      if (href.endsWith("/+wiki"))
        return;
      href = href.replace(root, "").replace("music/", "");
      if (href.startsWith("tag/")) {
        type = "tag";
      } else {
        let split = href.split("/");
        if (split.length == 1) {
          type = "artist";
        } else if (split.length == 2) {
          type = "album";
          name = desanitise(split[1]);
          sister = desanitise(split[0]);
        } else if (split.length == 3) {
          type = "track";
          name = desanitise(split[2]);
          sister = desanitise(split[0]);
        }
      }
      if (sister != void 0)
        tippy(link, {
          content: `${sister} - ${name}`
        });
      link.setAttribute("data-link-type", type);
    });
  }

  // src/pages/tag.js
  function bleh_tags() {
    let tag_header = document.body.querySelector(".header--tag");
    if (tag_header == void 0)
      return;
    if (tag_header.hasAttribute("data-bwaa"))
      return;
    tag_header.setAttribute("data-bwaa", "true");
    patch_header_title();
    page.name = tag_header.querySelector(".header-title").textContent.trim();
    let is_subpage = tag_header.classList.contains("header--sub-page");
    page.structure.container = document.body.querySelector(".page-content");
    page.structure.row = page.structure.container.querySelector(".row");
    try {
      page.structure.main = page.structure.row.querySelector(".col-main");
      page.structure.side = page.structure.row.querySelector(".col-sidebar");
    } catch (e) {
      log("unable to find elements", "page structure");
    }
    checkup_page_structure(is_subpage, tag_header);
    if (ff("refreshed_music_nav")) {
      let split = window.location.href.split("/");
      let index = 4;
      if (split[3] != "tag")
        index = 5;
      let title = desanitise(split[index]);
      let redesigned_tag_header = document.createElement("section");
      redesigned_tag_header.classList.add("redesigned-header", "redesigned-tag-header", "no-background");
      redesigned_tag_header.innerHTML = `
            <div class="tag-side">
                <div class="tag-icon"></div>
            </div>
            <div class="info-side">
                <div class="sub-text">${trans_legacy[lang].tag.name}</div>
                <h1>${title}</h1>
            </div>
        `;
      let background = document.body.querySelector(".header-background--has-image");
      if (background != null)
        register_background(background.style.getPropertyValue("background-image").replace('url("', "").replace('")', ""));
      page.structure.container.insertBefore(redesigned_tag_header, page.structure.container.firstElementChild);
      tag_header.classList.add("legacy-header");
    }
    if (!is_subpage) {
    } else {
      if (page.subpage == "wiki_overview")
        bleh_wiki();
      else if (page.subpage == "wiki_history")
        bleh_wiki_history();
      else if (page.subpage == "wiki_edit")
        bleh_wiki_editor();
    }
    log("status is", "page", "info", page);
    update_page();
  }
  function bleh_tags_mini() {
    let tag_user_avatar = page.structure.main.querySelector(".tags-user-avatar");
    if (!tag_user_avatar)
      return;
    let tags_list = tag_user_avatar.nextElementSibling;
    let tags = tags_list.querySelectorAll(".tag a");
    tags.forEach((tag) => {
      tag.classList.add("user-created-tag");
    });
  }

  // src/pages/album.js
  function bleh_albums() {
    let album_header = document.body.querySelector(".header-new--album");
    if (album_header == void 0)
      return;
    if (album_header.hasAttribute("data-bwaa"))
      return;
    album_header.setAttribute("data-bwaa", "true");
    patch_header_title();
    page.sister = album_header.querySelector(".header-new-crumb span").textContent;
    page.name = correct_item_by_artist(document.body.querySelector("[data-page-resource-name]").getAttribute("data-page-resource-name"), page.sister);
    let is_subpage = album_header.classList.contains("header-new--subpage");
    if (auth.pro) {
      page.structure.container = document.body.querySelector(".page-content:not(:has(.content-top-lower-row, a + .js-gallery-heading))");
    } else {
      if (!is_subpage) {
        page.structure.container = document.body.querySelector(".full-bleed-ad-container + .page-content:not(.visible-xs)");
        if (!page.structure.container)
          page.structure.container = document.body.querySelector(".page-content");
      } else {
        page.structure.container = document.body.querySelector(".page-content:not(:has(.content-top-lower-row, a + .js-gallery-heading))");
      }
    }
    page.structure.row = page.structure.container.querySelector(".row");
    try {
      page.structure.main = page.structure.row.querySelector(".col-main:not(.visible-xs, .hidden-xs, .upper-overview)");
      if (!is_subpage)
        page.structure.side = page.structure.row.querySelector(".col-sidebar.hidden-xs.masonry-right-bottom");
      else
        page.structure.side = page.structure.row.querySelector(".col-sidebar.hidden-xs");
    } catch (e) {
      log("unable to find elements", "page structure");
    }
    checkup_page_structure(is_subpage, album_header);
    if (ff("refreshed_music_nav")) {
      let avatar = album_header.querySelector(".header-new-background-image");
      let title = album_header.querySelector(".header-new-title");
      let artist = album_header.querySelector('[itemprop="byArtist"]');
      let position = album_header.querySelector(".header-new-chart-position-number");
      let redesigned_album_header = document.createElement("section");
      redesigned_album_header.classList.add("redesigned-header", "redesigned-album-header", "no-background");
      redesigned_album_header.innerHTML = `
            ${is_subpage || ff("show_album_cover_always") ? `
            <div class="avatar-side">
                ${avatar != null ? `
                <img src="${avatar.getAttribute("content").replace("/ar0/", "/avatar170s/")}">
                <a class="bleh--avatar-clickable-link"></a>
                ` : '<img class="missing-album">'}
            </div>
            ` : ""}
            <div class="info-side">
                <div class="sub-text">${trans_legacy[lang].album.name}</div>
                <div class="title-container">
                    <h1>${title.innerHTML}</h1>
                    ${position != null ? position.outerHTML : ""}
                </div>
                <h2>${artist.innerHTML}</h2>
            </div>
        `;
      let bg;
      if (avatar)
        bg = register_background(avatar.getAttribute("content"));
      else
        bg = register_background(null);
      page.structure.container.insertBefore(redesigned_album_header, page.structure.container.firstElementChild);
      album_header.classList.add("legacy-header");
      let avatar_side = redesigned_album_header.querySelector(".avatar-side");
      let avatar_link = avatar_side.querySelector("a");
      if (avatar != null && avatar_link != null) {
        let expand_link;
        if (avatar != null)
          expand_link = `_expand_avatar('${avatar.getAttribute("content")}')`;
        if (settings.default_avatar_action == "expand" && avatar != null)
          avatar_link.setAttribute("onclick", expand_link);
        else if (settings.default_avatar_action == "gallery")
          avatar_link.href = `${root}music/${sanitise(page.sister)}/${sanitise(page.name)}/+images`;
        let menu = tippy(avatar_side, {
          theme: "context-menu",
          content: `
                    ${avatar != null ? `
                    <button class="dropdown-menu-clickable-item" onclick="${expand_link}" data-menu-item="expand">
                        ${trans_legacy[lang].gallery.open.name}
                    </button>
                    ` : ""}
                    <a class="dropdown-menu-clickable-item" href="${root}music/${sanitise(page.sister)}/${sanitise(page.name)}/+images" data-menu-item="gallery">
                        ${trans_legacy[lang].gallery.view}
                    </a>
                    <div class="sep"></div>
                    <a class="dropdown-menu-clickable-item" href="${root}bleh?tab=customise" data-menu-item="settings">
                        ${trans_legacy[lang].settings.configure}
                    </a>
                `,
          allowHTML: true,
          placement: "right-start",
          trigger: "manual",
          interactive: true,
          interactiveBorder: 10,
          offset: [0, 0],
          onShow(instance) {
            instance.popper.addEventListener("click", (event2) => {
              instance.hide();
            });
          }
        });
        register_menu(avatar_side, menu);
      }
    }
    if (settings.hue_from_album) {
      let header_inner = album_header.querySelector(".header-new-inner");
      try {
        let bg = header_inner.getAttribute("style").replace("background: #", "");
        let hsl = hex_to_hsl(bg);
        document.body.style.setProperty("--hue-album", hsl.h);
        document.body.style.setProperty("--sat-album", clamp_sat(hsl.s / 100 * 3));
        log(`sourced hsl of (${hsl.h}, ${hsl.s}, ${hsl.l}) - using final value of (${hsl.h}, ${clamp_sat(hsl.s / 100 * 3)}, ${hsl.l})`, "hue from album");
        load_chart_colours();
      } catch (e) {
        log("no cover present", "hue from album");
      }
    }
    if (!is_subpage) {
      show_your_scrobbles();
      bleh_music_page_charts();
      album_missing_a_tracklist();
      bleh_about_artist();
      bleh_tags_mini();
      let similar_albums = page.structure.main.querySelector(".similar-albums");
      if (similar_albums) {
        let similar_panel = similar_albums.parentElement;
        similar_panel.classList.add("similar-panel");
      }
      let button_row = page.structure.side.querySelector(".album-overview-cover-art-action-row");
      if (button_row) {
        let buttons = button_row.querySelectorAll("a");
        buttons.forEach((button) => {
          button.classList.add("btn");
          tippy(button, {
            content: button.textContent
          });
        });
      }
      let upload_container = page.structure.side.querySelector(".album-overview-cover-art-upload-action");
      let avatar = album_header.querySelector(".header-new-background-image");
      let katsune = ff("katsune");
      if (avatar && !katsune) {
        let expand_container = document.createElement("span");
        expand_container.classList.add("album-overview-cover-art-expand-action");
        let expand_link = document.createElement("a");
        expand_link.classList.add("btn");
        expand_link.setAttribute("onclick", `_expand_avatar('${avatar.getAttribute("content")}')`);
        expand_link.textContent = trans_legacy[lang].gallery.open.name;
        tippy(expand_link, {
          content: trans_legacy[lang].gallery.open.name
        });
        expand_container.appendChild(expand_link);
        upload_container.after(expand_container);
      }
      if (katsune) {
        let row = page.structure.side.querySelector(".album-overview-cover-art-actions");
        if (row)
          page.structure.container.querySelector(".avatar-side").appendChild(row);
      }
    } else {
      let btn_add = page.structure.side.querySelector(".add-button");
      if (btn_add != null)
        btn_add.setAttribute("data-page-subpage", page.subpage);
      if (page.subpage == "images_image-upload")
        bleh_gallery_upload();
      else if (page.subpage == "images_overview")
        bleh_gallery_list();
      else if (page.subpage == "wiki_overview")
        bleh_wiki();
      else if (page.subpage == "wiki_history")
        bleh_wiki_history();
      else if (page.subpage == "wiki_edit")
        bleh_wiki_editor();
    }
    log("status is", "page", "info", page);
    update_page();
  }
  function album_missing_a_tracklist() {
    let tracklist = document.getElementById("tracklist");
    if (tracklist == null) {
      let top_overview = document.querySelector(".top-overview-panel");
      if (top_overview == null) {
        return;
      }
      tracklist = document.createElement("section");
      tracklist.innerHTML = `
            <h3 class="text-18">${trans_legacy[lang].music.fetch_plays.name}</h3>
            <div class="loading-data-container">
                <p class="loading-data-text">${trans_legacy[lang].music.fetch_plays.loading}</p>
            </div>
        `;
      top_overview.after(tracklist);
      let url = document.querySelector(".header-metadata-display a");
      if (url == void 0) {
        let url_split = window.location.href.split("/");
        let album_url = `${url_split[url_split.length - 2]}/${url_split[url_split.length - 1]}`;
        let album_as_track_url = window.location.href.replace(album_url, `${url_split[url_split.length - 2]}/_/${url_split[url_split.length - 1]}`);
        tracklist.innerHTML = `
                <h3 class="text-18">${trans_legacy[lang].music.fetch_plays.name}</h3>
                <div class="loading-data-container">
                    <p class="loading-data-text failed">${trans_legacy[lang].music.fetch_plays.fail}</p>
                    <a class="btn" href="${album_as_track_url}">${trans_legacy[lang].music.fetch_plays.open_as_track}</a>
                </div>
            `;
        return;
      }
      url = url.getAttribute("href");
      fetch(url).then(function(response) {
        console.error("returned", response, response.text);
        return response.text();
      }).then(function(html) {
        let doc = new DOMParser().parseFromString(html, "text/html");
        console.error("DOC", doc);
        let inner_tracklist = doc.querySelector('#top-tracks-section [v-else=""] .chartlist');
        if (inner_tracklist == null) {
          let url_split = window.location.href.split("/");
          let album_url = `${url_split[url_split.length - 2]}/${url_split[url_split.length - 1]}`;
          let album_as_track_url = window.location.href.replace(album_url, `${url_split[url_split.length - 2]}/_/${url_split[url_split.length - 1]}`);
          tracklist.innerHTML = `
                        <h3 class="text-18">${trans_legacy[lang].music.fetch_plays.name}</h3>
                        <div class="loading-data-container">
                            <p class="loading-data-text failed">${trans_legacy[lang].music.fetch_plays.fail}</p>
                            <a class="btn" href="${album_as_track_url}">${trans_legacy[lang].music.fetch_plays.open_as_track}</a>
                        </div>
                    `;
          return;
        }
        inner_tracklist.classList.remove("chartlist--with-image");
        tracklist.innerHTML = `
                    <h3 class="text-18">${trans_legacy[lang].music.fetch_plays.name}</h3>
                    <div class="alert alert-info">${trans_legacy[lang].music.fetch_plays.info}</div>
                    ${inner_tracklist.outerHTML}
                `;
      });
    }
  }

  // src/pages/artist.js
  function bleh_artists() {
    let artist_header = document.body.querySelector(".header-new--artist");
    if (artist_header == void 0)
      return;
    if (artist_header.hasAttribute("data-bwaa"))
      return;
    artist_header.setAttribute("data-bwaa", "true");
    artist_title();
    page.name = artist_header.querySelector(".header-new-title").textContent;
    page.sister = "";
    let is_subpage = artist_header.classList.contains("header-new--subpage");
    if (auth.pro) {
      page.structure.container = document.body.querySelector(".page-content:not(.visible-xs, :has(.content-top-lower-row, a + .js-gallery-heading))");
    } else {
      if (!is_subpage) {
        page.structure.container = document.body.querySelector(".full-bleed-ad-container + .page-content:not(.visible-xs)");
        if (!page.structure.container)
          page.structure.container = document.body.querySelector(".page-content");
      } else {
        page.structure.container = document.body.querySelector(".page-content:not(.visible-xs, :has(.content-top-lower-row, a + .js-gallery-heading))");
      }
    }
    try {
      page.structure.row = page.structure.container.querySelector(".row");
      if (!is_subpage)
        page.structure.main = page.structure.row.querySelector(".col-main.buffer-standard");
      else
        page.structure.main = page.structure.row.querySelector(".col-main");
      if (auth.pro) {
        page.structure.side = page.structure.row.querySelector(".col-sidebar:not(.masonry-right)");
      } else {
        page.structure.side = page.structure.row.querySelector(".col-sidebar:not(.section-with-separator--col)");
      }
    } catch (e) {
      log("unable to find elements", "page structure");
    }
    checkup_page_structure(is_subpage, artist_header);
    let katsune = ff("katsune");
    let featured_items = artist_header.querySelector(".artist-header-featured-items");
    if (ff("refreshed_music_nav")) {
      let avatar = artist_header.querySelector(".header-new-background-image");
      let title = artist_header.querySelector(".header-new-title");
      let on_tour = artist_header.querySelector(".header-new-on-tour");
      let position = artist_header.querySelector(".header-new-chart-position-number");
      let redesigned_artist_header = document.createElement("section");
      redesigned_artist_header.classList.add("redesigned-header", "redesigned-artist-header", "no-background");
      redesigned_artist_header.innerHTML = `
            <div class="avatar-side">
                ${avatar != null ? `
                <img src="${avatar.getAttribute("content").replace("/ar0/", "/avatar300s/")}">
                <a class="bleh--avatar-clickable-link"></a>
                ` : '<img class="missing-artist">'}
            </div>
            <div class="info-side">
                ${page.multi ? `
                <div class="sub-text">${trans_legacy[lang].artist.plural}<div class="info-tip"><div class="bleh-icon bleh-info-icon"></div></div></div>
                ` : `
                <div class="sub-text">${trans_legacy[lang].artist.name}</div>
                `}
                <div class="title-container" data-multi="${page.multi}">
                    <h1>${title.innerHTML}</h1>
                    ${position != null ? position.outerHTML : ""}
                    ${on_tour != null ? on_tour.outerHTML : ""}
                </div>
                ${featured_items != null && !katsune ? featured_items.outerHTML : ""}
            </div>
            ${!is_subpage && !katsune ? `
            <div class="gallery-side">
                <section class="view-all-panel">
                    ${settings.quick_artist_button == "gallery" ? `
                    <a class="btn view-all-button back top-gallery-button" href="${window.location.href}/+images">
                        ${trans_legacy[lang].gallery.view}
                    </a>
                    ` : settings.quick_artist_button == "shouts" ? `
                    <a class="btn view-all-button back top-shout-button" href="${window.location.href}/+shoutbox">
                        ${trans_legacy[lang].settings.layout.quick_artist_button.shouts}
                    </a>
                    ` : settings.quick_artist_button == "wiki" ? `
                    <a class="btn view-all-button back top-wiki-button" href="${window.location.href}/+wiki">
                        ${trans_legacy[lang].settings.layout.quick_artist_button.wiki}
                    </a>
                    ` : settings.quick_artist_button == "listens" ? `
                    <a class="btn view-all-button back top-listens-button" href="${window.location.href}/+listeners/you-know">
                        ${trans_legacy[lang].settings.layout.quick_artist_button.listens}
                    </a>
                    ` : ""}
                </section>
            </div>
            ` : ""}
        `;
      let multi_info_box = redesigned_artist_header.querySelector(".info-tip");
      if (multi_info_box) {
        tippy(multi_info_box, {
          content: trans_legacy[lang].artist.tooltip
        });
      }
      position = redesigned_artist_header.querySelector(".header-new-chart-position-number");
      if (position != null) {
        tippy(position, {
          content: trans_legacy[lang].charts.view
        });
      }
      let bg;
      if (avatar)
        bg = register_background(avatar.getAttribute("content"));
      else
        bg = register_background(null);
      page.structure.container.insertBefore(redesigned_artist_header, page.structure.container.firstElementChild);
      artist_header.classList.add("legacy-header");
      let avatar_side = redesigned_artist_header.querySelector(".avatar-side");
      let avatar_link = avatar_side.querySelector("a");
      if (avatar != null && avatar_link != null) {
        let expand_link;
        if (avatar != null)
          expand_link = `_expand_avatar('${avatar.getAttribute("content")}')`;
        if (settings.default_avatar_action == "expand" && avatar != null)
          avatar_link.setAttribute("onclick", expand_link);
        else if (settings.default_avatar_action == "gallery")
          avatar_link.href = `${root}music/${sanitise(page.name)}/+images`;
        let menu = tippy(avatar_side, {
          theme: "context-menu",
          content: `
                    ${avatar != null ? `
                    <button class="dropdown-menu-clickable-item" onclick="${expand_link}" data-menu-item="expand">
                        ${trans_legacy[lang].gallery.open.name}
                    </button>
                    ` : ""}
                    <a class="dropdown-menu-clickable-item" href="${root}music/${sanitise(page.name)}/+images" data-menu-item="gallery">
                        ${trans_legacy[lang].gallery.view}
                    </a>
                    <div class="sep"></div>
                    <a class="dropdown-menu-clickable-item" href="${root}bleh?tab=customise" data-menu-item="settings">
                        ${trans_legacy[lang].settings.configure}
                    </a>
                `,
          allowHTML: true,
          placement: "right-start",
          trigger: "manual",
          interactive: true,
          interactiveBorder: 10,
          offset: [0, 0],
          onShow(instance) {
            instance.popper.addEventListener("click", (event2) => {
              instance.hide();
            });
          }
        });
        register_menu(avatar_side, menu);
      }
      if (!is_subpage) {
        let view_button = redesigned_artist_header.querySelector(".view-all-button");
        if (view_button) {
          let view_menu = tippy(view_button, {
            theme: "context-menu",
            content: `
                        <a class="dropdown-menu-clickable-item" href="${root}bleh?tab=customise" data-menu-item="settings">
                            ${trans_legacy[lang].settings.configure}
                        </a>
                    `,
            allowHTML: true,
            placement: "right-start",
            trigger: "manual",
            interactive: true,
            interactiveBorder: 10,
            offset: [0, 0],
            onShow(instance) {
              instance.popper.addEventListener("click", (event2) => {
                instance.hide();
              });
            }
          });
          register_menu(view_button, view_menu);
        }
      }
    }
    if (!is_subpage) {
      show_your_scrobbles();
      bleh_music_page_charts();
      bleh_tags_mini();
      if (katsune && featured_items) {
        let featured_panel = document.createElement("section");
        featured_panel.classList.add("featured-items-panel");
        featured_panel.innerHTML = featured_items.innerHTML;
        let listen_panel = page.structure.side.querySelector(".listen-panel");
        if (listen_panel)
          listen_panel.after(featured_panel);
        else
          page.structure.side.insertBefore(featured_panel, page.structure.side.firstElementChild);
      }
    } else {
      let btn_add = page.structure.side.querySelector(".add-button");
      if (btn_add != null)
        btn_add.setAttribute("data-page-subpage", page.subpage);
      if (page.subpage == "images_image-upload")
        bleh_gallery_upload();
      else if (page.subpage == "images_overview")
        bleh_gallery_list();
      else if (page.subpage == "wiki_overview")
        bleh_wiki();
      else if (page.subpage == "wiki_history")
        bleh_wiki_history();
      else if (page.subpage == "wiki_edit")
        bleh_wiki_editor();
      else if (page.subpage == "listeners_overview")
        bleh_top_listeners();
    }
    log("status is", "page", "info", page);
    update_page();
  }

  // src/changelog.js
  unsafeWindow._query_changelog = function() {
    if (!ff("changelogs")) {
      deliver_notif("not just yet..");
      return;
    }
    let changelog = localStorage.getItem("bleh_changelog");
    let changelog_expire = new Date(localStorage.getItem("bleh_changelog_expire"));
    let current_time = /* @__PURE__ */ new Date();
    if (changelog == null) {
      log("not cached, fetching", "changelog");
      request_changelog();
    } else {
      if (changelog_expire < current_time)
        request_changelog();
      else
        open_changelog(JSON.parse(changelog));
    }
  };
  function request_changelog(open_after = true) {
    let button = document.body.querySelector('[data-bleh-page="changelog"]');
    if (button != null)
      button.setAttribute("disabled", "");
    let xhr = new XMLHttpRequest();
    let url = `https://katelyynn.github.io/bleh/fm/changelog/changelog.json?${Math.random()}`;
    xhr.open("GET", url, true);
    xhr.onload = function() {
      log(`responded with ${xhr.status}`, "changelog");
      if (xhr.status != 200) {
        log("request has been cancelled, will request again in 1h", "changelog");
        api_expire.setHours(api_expire.getHours() + 1);
      }
      let api_expire = /* @__PURE__ */ new Date();
      if (xhr.status == 200) {
        if (open_after) {
          try {
            open_changelog(JSON.parse(this.response));
            localStorage.setItem("bleh_changelog", this.response);
            api_expire.setHours(api_expire.getHours() + 2);
            log(`cached until ${api_expire}`, "changelog");
            localStorage.setItem("bleh_changelog_expire", api_expire);
          } catch (e) {
            deliver_notif("The changelog is currently unavailable due to errors, try again later.", true);
            console.error(e);
          }
        }
      }
      if (button != null)
        button.removeAttribute("disabled");
    };
    xhr.send();
  }
  function open_changelog(changelog) {
    let window2 = dialog({
      id: "changelog",
      title: trans_legacy[lang].changelog.name,
      subtitle: trans_legacy[lang].changelog.subtitle.replace("{u}", `<a class="mention" href="${root}user/cutensilly">@cutensilly</a>`),
      body: `
            <div class="changelog-list"></div>
            <div class="modal-footer">
                <a class="btn primary skip" href="#latest_major_release">
                    ${trans_legacy[lang].changelog.view_major}
                </a>
            </div>
        `,
      type: "changelog",
      allow_scroll: true
    });
    let changelog_list = window2.querySelector(".changelog-list");
    let index = 0;
    for (let version2 in changelog) {
      if (version2 == "updated" || version2 == "latest")
        continue;
      let version_item = document.createElement("div");
      version_item.classList.add("changelog-version-item");
      version_item.setAttribute("data-changelog-type", changelog[version2].type);
      version_item.setAttribute("data-changelog-latest", index == 0 ? "true" : "false");
      version_item.setAttribute("data-changelog-version", version2);
      version_item.innerHTML = `
            <div class="version-item-header">
                <div class="sub-text">
                    <div class="breadcrumb">
                        <div class="breadcrumb-origin">
                            ${version2}
                        </div>
                        <div class="breadcrumb-name">
                            ${trans_legacy[lang].changelog.type[changelog[version2].type]}
                        </div>
                    </div>
                    ${index == 0 ? `
                    <!--<div class="latest-line">
                        <div>${trans_legacy[lang].changelog.latest}</div>
                    </div>-->
                    ` : ""}
                </div>
                <h3>${changelog[version2].name}</h3>
                ${version2 == "2025.0113" ? `<h4 class="header-over">${changelog[version2].name}</h4>` : ""}
            </div>
        `;
      if (changelog[version2].type == "major")
        version_item.setAttribute("id", "latest_major_release");
      let body = document.createElement("div");
      body.classList.add("version-item-body", "markdown-body");
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
      let parsed_text = converter.makeHtml(changelog[version2].bio.replace(/([@])([a-zA-Z0-9_]+)/g, `[$1$2](${root}user/$2)`).replace(/\[artist\]([a-zA-Z0-9]+)\[\/artist\]/g, `[$1](${root}music/$1)`).replace(/\[album artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/album\]/g, `[$2](${root}music/$1/$2)`).replace(/\[track artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/track\]/g, `[$2](${root}music/$1/_/$2)`).replace(/https:\/\/open\.spotify\.com\/user\/([A-Za-z0-9]+)\?si=([A-Za-z0-9]+)/g, "[@$1](https://open.spotify.com/user/$1)").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"));
      body.innerHTML = parsed_text;
      version_item.appendChild(body);
      changelog_list.appendChild(version_item);
      index += 1;
    }
  }
  unsafeWindow._update_local_changelog_cache = function(json) {
    localStorage.setItem("bleh_changelog", JSON.stringify(json));
  };

  // src/pages/bleh_setup.js
  function bleh_setup() {
    document.body.style.removeProperty("--hue-album");
    document.body.style.removeProperty("--sat-album");
    console.info("bleh - loading first-time setup");
    let adaptive_skin_container = document.querySelector(".adaptive-skin-container:not([data-bleh])");
    if (adaptive_skin_container == null)
      return;
    adaptive_skin_container.setAttribute("data-bleh", "true");
    adaptive_skin_container.innerHTML = "";
    if (!ff("page_title"))
      document.title = "bleh setup | Last.fm";
    log("internal bleh setup", "page");
    page.type = "bleh_setup";
    page.subpage = "";
    adaptive_skin_container.innerHTML = `
        <div class="bleh--page-outer">
            <div class="bleh--page-inner bleh-setup-container"></div>
        </div>
    `;
    document.body.classList.add("bleh-setup");
    document.body.style.setProperty("background-image", `url(${auth.avatar})`);
    document.body.style.setProperty("background-size", "cover");
    let masthead = document.body.querySelector(".masthead");
    masthead.classList.add("in-setup");
    bleh_setup_start();
  }
  unsafeWindow._setup = function() {
    bleh_setup_start();
  };
  function bleh_setup_start() {
    let modal = dialog({
      id: "bleh_setup_start",
      body: `
            <div class="setup-sides">
                <div class="setup-preview">
                    <div class="setup-icon setup-icon-main setup-icon-home"></div>
                </div>
                <div class="setup-body">
                    <div class="setup-body-main">
                        <h1>${trans_legacy[lang].setup.start.name.replace("{m}", `<a class="mention" href="${root}user/${auth.name}">@${auth.name}</a>`)}</h1>
                        <h4>${trans_legacy[lang].setup.start.pick_theme}</h4>
                        <div class="primary-selections">
                            <div class="btn primary-selection" id="toggle-theme-light" data-toggle="theme" data-toggle-value="light" onclick="_update_item('theme', 'light')">
                                <h5>${trans_legacy[lang].settings.themes.light.name}</h5>
                            </div>
                            <div class="btn primary-selection" id="toggle-theme-dark" data-toggle="theme" data-toggle-value="dark" onclick="_update_item('theme', 'dark')">
                                <h5>${trans_legacy[lang].settings.themes.dark.name}</h5>
                            </div>
                            <div class="btn primary-selection" id="toggle-theme-darker" data-toggle="theme" data-toggle-value="darker" onclick="_update_item('theme', 'darker')">
                                <h5>${trans_legacy[lang].settings.themes.darker.name}</h5>
                            </div>
                            <div class="btn primary-selection" id="toggle-theme-oled" data-toggle="theme" data-toggle-value="oled" onclick="_update_item('theme', 'oled')">
                                <h5>${trans_legacy[lang].settings.themes.oled.name}</h5>
                            </div>
                        </div>
                        <div class="alert alert-info">${trans_legacy[lang].setup.start.change_later}</div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn skip" onclick="_setup_skip()">
                            ${trans_legacy[lang].settings.skip}
                        </button>
                        <button class="btn primary continue" onclick="_setup_appearance()">
                            ${trans_legacy[lang].settings.continue}
                        </button>
                    </div>
                </div>
            </div>
        `,
      dismiss: false,
      type: "setup",
      replace_if_possible: true
    });
    refresh_all(modal);
  }
  unsafeWindow._setup_accessibility = function() {
    dialog({
      id: "bleh_setup_accessibility",
      body: `
            <div class="setup-sides">
                <div class="setup-preview">
                    <div class="setup-icon setup-icon-main setup-icon-accessibility"></div>
                </div>
                <div class="setup-body">
                    <div class="setup-body-main">
                        <h1>${trans_legacy[lang].settings.accessibility.name}</h1>
                        <div class="toggle-container" id="container-reduced_motion">
                            <button class="btn reset" onclick="_reset_item('reduced_motion')">${trans_legacy[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans_legacy[lang].settings.accessibility.reduced_motion.name}</h5>
                                <p>${trans_legacy[lang].settings.accessibility.reduced_motion.bio}</p>
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
                                    <a>${auth.name}</a>
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
                                    <p>${trans_legacy[lang].settings.accessibility.shout_preview}</p>
                                </div>
                            </div>
                        </div>
                        <div class="toggle-container" id="container-accessible_name_colours">
                            <button class="btn reset" onclick="_reset_item('accessible_name_colours')">${trans_legacy[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans_legacy[lang].settings.accessibility.accessible_name_colours.name}</h5>
                                <p>${trans_legacy[lang].settings.accessibility.accessible_name_colours.bio}</p>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-accessible_name_colours" onclick="_update_item('accessible_name_colours')" aria-checked="false">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                        <div class="toggle-container" id="container-underline_links">
                            <button class="btn reset" onclick="_reset_item('underline_links')">${trans_legacy[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans_legacy[lang].settings.accessibility.underline_links.name}</h5>
                                <p>${trans_legacy[lang].settings.accessibility.underline_links.bio}</p>
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
                            ${trans_legacy[lang].settings.back}
                        </button>
                        <div class="btn-fill"></div>
                        <button class="btn primary continue" onclick="_setup_skip()">
                            ${trans_legacy[lang].settings.finish}
                        </button>
                    </div>
                </div>
            </div>
        `,
      dismiss: false,
      type: "setup",
      replace_if_possible: true
    });
    refresh_all();
  };
  unsafeWindow._setup_appearance = function() {
    dialog({
      id: "bleh_setup_appearance",
      body: `
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
                        <h1>${trans_legacy[lang].settings.appearance.name}</h1>
                        <h4>${trans_legacy[lang].settings.customise.colours.name}</h4>
                        <div class="inner-preview pad">
                            <table class="chartlist chartlist--with-image chartlist--with-loved chartlist--with-artist" style="margin: var(--card-gap) 0 !important">
                                <tbody>
                                    <tr class="chartlist-row chartlist-row--now-scrobbling chartlist-row--with-artist" style="transition: none !important">
                                        <td class="chartlist-image">
                                            <a class="cover-art"><img src="${auth.avatar}" loading="lazy"></a>
                                        </td>
                                        <td class="chartlist-loved">
                                            <button class="chartlist-love-button" data-toggle-button-current-state="unloved"></button>
                                        </td>
                                        <td class="chartlist-name">
                                            <a>Song title</a>
                                        </td>
                                        <td class="chartlist-artist">
                                            <a>${auth.name}</a>
                                        </td>
                                        <td class="chartlist-timestamp chartlist-timestamp--lang-en">
                                            <span class="chartlist-now-scrobbling">
                                                <a>Scrobbling now</a>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="btn-row">
                                <button class="btn">${trans_legacy[lang].settings.examples.button}</button>
                                <button class="btn primary">${trans_legacy[lang].settings.examples.button}</button>
                                <div class="chartlist-count-bar">
                                    <a class="chartlist-count-bar-link">
                                        <span class="chartlist-count-bar-slug" style="width: 60%"></span>
                                        <span class="chartlist-count-bar-value">44,551</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="view-buttons colour-buttons view-buttons-middle" id="colour_custom"></div>
                        <div class="swatch-group">
                            <div id="colour_red" class="palette options colours"></div>
                            <div id="colour_orange" class="palette options colours"></div>
                            <div id="colour_yellow" class="palette options colours"></div>
                            <div id="colour_green" class="palette options colours"></div>
                            <div id="colour_lime" class="palette options colours"></div>
                            <div id="colour_aqua" class="palette options colours"></div>
                            <div id="colour_blue" class="palette options colours"></div>
                            <div id="colour_purple" class="palette options colours"></div>
                            <div id="colour_pink" class="palette options colours"></div>
                        </div>
                    </div>
                    <div class="alert alert-info">${trans_legacy[lang].setup.music.change_later}</div>
                    <div class="modal-footer">
                        <button class="btn back" onclick="_setup()">
                            ${trans_legacy[lang].settings.back}
                        </button>
                        <div class="btn-fill"></div>
                        <button class="btn skip" onclick="_setup_skip()">
                            ${trans_legacy[lang].settings.skip}
                        </button>
                        <button class="btn primary continue" onclick="_setup_corrections()">
                            ${trans_legacy[lang].settings.continue}
                        </button>
                    </div>
                </div>
            </div>
        `,
      dismiss: false,
      type: "setup",
      replace_if_possible: true
    });
    display_colour_presets();
    refresh_all();
  };
  unsafeWindow._setup_corrections = function() {
    dialog({
      id: "bleh_setup_corrections",
      body: `
            <div class="setup-sides">
                <div class="setup-preview">
                    <div class="setup-icon setup-icon-main setup-icon-corrections"></div>
                </div>
                <div class="setup-body">
                    <div class="setup-body-main">
                        <h1>${trans_legacy[lang].settings.music.name}</h1>
                        <p>${trans_legacy[lang].settings.corrections.bio}</p>
                        <div class="alert alert-info">${trans_legacy[lang].setup.music.change_later}</div>
                        <h4>${trans_legacy[lang].settings.corrections.formatting}</h4>
                        <div class="toggle-container" id="container-format_guest_features" onclick="_update_item('format_guest_features')">
                            <button class="btn reset" onclick="_reset_item('format_guest_features')">${trans_legacy[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans_legacy[lang].settings.corrections.format_guest_features.name}</h5>
                                <p>${trans_legacy[lang].settings.corrections.format_guest_features.bio}</p>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-format_guest_features" aria-checked="true">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                        <div class="toggle-container hide-if-format-guest-disabled" id="container-show_guest_features" onclick="_update_item('show_guest_features')">
                            <button class="btn reset" onclick="_reset_item('show_guest_features')">${trans_legacy[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans_legacy[lang].settings.corrections.show_guest_features.name}</h5>
                                <p>${trans_legacy[lang].settings.corrections.show_guest_features.bio}</p>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-show_guest_features" aria-checked="true">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                        <div class="toggle-container" id="container-corrections" onclick="_update_item('corrections')">
                            <button class="btn reset" onclick="_reset_item('corrections')">${trans_legacy[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans_legacy[lang].settings.corrections.toggle.name}</h5>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-corrections" aria-checked="true">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                        <h4>${trans_legacy[lang].settings.music.header}</h4>
                        <div class="toggle-container" id="container-stacked_chartlist_info" onclick="_update_item('stacked_chartlist_info')">
                            <button class="btn reset" onclick="_reset_item('stacked_chartlist_info')">${trans_legacy[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans_legacy[lang].settings.corrections.stacked_chartlist_info.name}</h5>
                                <p>${trans_legacy[lang].settings.corrections.stacked_chartlist_info.bio}</p>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-stacked_chartlist_info" aria-checked="true">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                        <div class="toggle-container hide-if-no-bulk-edit" id="container-show_bulk_edit_album" onclick="_update_item('show_bulk_edit_album')">
                            <button class="btn reset" onclick="_reset_item('show_bulk_edit_album')">${trans_legacy[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans_legacy[lang].settings.music.show_bulk_edit_album.name}</h5>
                                <p>${trans_legacy[lang].settings.music.show_bulk_edit_album.bio}</p>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-show_bulk_edit_album" aria-checked="false">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn back" onclick="_setup_appearance()">
                            ${trans_legacy[lang].settings.back}
                        </button>
                        <div class="btn-fill"></div>
                        <button class="btn skip" onclick="_setup_skip()">
                            ${trans_legacy[lang].settings.skip}
                        </button>
                        <button class="btn primary continue" onclick="_setup_seasons()">
                            ${trans_legacy[lang].settings.continue}
                        </button>
                    </div>
                </div>
            </div>
        `,
      dismiss: false,
      type: "setup",
      replace_if_possible: true
    });
    refresh_all();
  };
  unsafeWindow._setup_seasons = function() {
    dialog({
      id: "bleh_setup_seasons",
      body: `
            <div class="setup-sides">
                <div class="setup-preview">
                    <div class="setup-icon setup-icon-main setup-icon-seasons"></div>
                </div>
                <div class="setup-body">
                    <div class="setup-body-main">
                        <h1>${trans_legacy[lang].settings.customise.seasonal.name}</h1>
                        <div class="seasonal-inner">
                            <div class="current-season-box" data-season="${stored_season.id}">
                                <div class="current-season-info">
                                    <div class="bleh-icon bleh-seasonal-icon" data-season="${stored_season.id}"></div>
                                    <h4>${trans_legacy[lang].settings.customise.seasonal.listing[stored_season.id]}</h4>
                                </div>
                                <div class="glacier-library-top season-top">
                                    <div class="glacier-library-metadata">
                                        ${stored_season.id != "none" && stored_season.start && stored_season.end ? `
                                        <div class="glacier-library-metadata-item">
                                            <div class="sub-text">${trans_legacy[lang].settings.customise.seasonal.started}</div>
                                            <div class="glacier-library-metadata-item-value" id="current_season_start">${moment(stored_season.start.replace("y0", stored_season.year).replace("{offset}", stored_season.offset)).from(stored_season.now)}</div>
                                        </div>
                                        <div class="glacier-library-metadata-item">
                                            <div class="sub-text">${trans_legacy[lang].settings.customise.seasonal.ends_in}</div>
                                            <div class="glacier-library-metadata-item-value" id="current_season">${moment(stored_season.end.replace("y0", stored_season.year).replace("{offset}", stored_season.offset)).to(stored_season.now, true)}</div>
                                        </div>
                                        ` : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="info-box no-padding">
                            <div class="bleh-icon bleh-info-icon"></div>
                            ${trans_legacy[lang].settings.customise.seasonal.info}
                        </div>
                        <!--<p>${trans_legacy[lang].settings.customise.seasonal.bio}</p>
                        <div class="inner-preview pad click-thru">
                            <div class="current-season-container">
                                <div class="current-season" data-season="${stored_season.id}" id="current_season">
                                    ${stored_season.id != "none" ? trans_legacy[lang].settings.customise.seasonal.marker.current.replace("{season}", trans_legacy[lang].settings.customise.seasonal.listing[stored_season.id]) : settings.seasonal ? trans_legacy[lang].settings.customise.seasonal.marker.none : trans_legacy[lang].settings.customise.seasonal.marker.disabled}
                                </div>
                                <div class="current-season-started" id="current_season_start">
                                    ${stored_season.id != "none" ? trans_legacy[lang].settings.customise.seasonal.marker.started : ""}
                                </div>
                            </div>
                        </div>-->
                        <h4>${trans_legacy[lang].settings.configure}</h4>
                        <div class="toggle-container" id="container-seasonal" onclick="_update_item('seasonal')">
                            <button class="btn reset" onclick="_reset_item('seasonal')">${trans_legacy[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans_legacy[lang].settings.customise.seasonal.option.name}</h5>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-seasonal" aria-checked="true">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                        <div class="sep"></div>
                        <div class="toggle-container hide-if-seasonal-disabled" id="container-seasonal_particles" onclick="_update_item('seasonal_particles')">
                            <button class="btn reset" onclick="_reset_item('seasonal_particles')">${trans_legacy[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans_legacy[lang].settings.customise.seasonal.particles.name}</h5>
                                <p>${trans_legacy[lang].settings.customise.seasonal.particles.bio}</p>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-seasonal_particles" aria-checked="true">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                        <div class="toggle-container hide-if-seasonal-disabled" id="container-seasonal_particles_reduced" onclick="_update_item('seasonal_particles_reduced')">
                            <button class="btn reset" onclick="_reset_item('seasonal_particles_reduced')">${trans_legacy[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans_legacy[lang].settings.customise.seasonal.show_less_particles.name}</h5>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-seasonal_particles_reduced" aria-checked="true">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                        <div class="toggle-container hide-if-seasonal-disabled" id="container-seasonal_particles_fps" onclick="_update_item('seasonal_particles_fps')">
                            <button class="btn reset" onclick="_reset_item('seasonal_particles_fps')">${trans_legacy[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans_legacy[lang].settings.customise.seasonal.fps_particles.name}</h5>
                                <p>${trans_legacy[lang].settings.customise.seasonal.fps_particles.bio}</p>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-seasonal_particles_fps" aria-checked="true">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                        <div class="sep"></div>
                        <div class="toggle-container hide-if-seasonal-disabled" id="container-seasonal_overlays" onclick="_update_item('seasonal_overlays')">
                            <button class="btn reset" onclick="_reset_item('seasonal_overlays')">${trans_legacy[lang].settings.reset}</button>
                            <div class="heading">
                                <h5>${trans_legacy[lang].settings.customise.seasonal.overlays.name}</h5>
                                <p>${trans_legacy[lang].settings.customise.seasonal.overlays.bio}</p>
                            </div>
                            <div class="toggle-wrap">
                                <button class="toggle" id="toggle-seasonal_overlays" aria-checked="true">
                                    <div class="dot"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn back" onclick="_setup_corrections()">
                            ${trans_legacy[lang].settings.back}
                        </button>
                        <div class="btn-fill"></div>
                        <button class="btn skip" onclick="_setup_skip()">
                            ${trans_legacy[lang].settings.skip}
                        </button>
                        <button class="btn primary continue" onclick="_setup_accessibility()">
                            ${trans_legacy[lang].settings.continue}
                        </button>
                    </div>
                </div>
            </div>
        `,
      dismiss: false,
      type: "setup",
      replace_if_possible: true
    });
    refresh_all();
  };
  unsafeWindow._setup_skip = function() {
    dialog_rm({
      all: true
    });
    document.location.href = `${root}user/${auth.name}`;
  };
  function notify_if_new_update() {
    let last_version_used = localStorage.getItem("bleh_last_version_used") || "";
    if (last_version_used == "") {
      window.location.href = `${root}bleh/setup`;
      localStorage.setItem("bleh_last_version_used", version.build);
      register_activity("install_bleh", [], `${root}bleh`);
      return;
    }
    if (last_version_used != version.build) {
      notify({
        title: trans_legacy[lang].messaging.update.replace("{v}", `${version.build}.${version.sku}`),
        persist: true,
        icon: "icon-16-download"
      });
      register_activity("update_bleh", [{ name: version.build, type: "bleh" }], `${root}bleh`);
      localStorage.setItem("bleh_last_version_used", version.build);
      request_changelog();
    }
  }

  // src/pages/error.js
  function bleh_error() {
    page.state.error = false;
    let page_content = document.body.querySelector(".page-content");
    if (page_content == null)
      return;
    let error_marvin = page_content.querySelector(".error-page-marvin:not([data-bleh])");
    if (error_marvin == null)
      return;
    page.state.error = true;
    error_marvin.setAttribute("data-bleh", "true");
    let error_content = page_content.querySelector("h1");
    let back_link = page_content.querySelector("a");
    page_content.classList.add("has-error");
    page_content.innerHTML = `
        <div class="error-page">
            <h3>${trans_legacy[lang].error.name}</h3>
            <h4>${error_content.textContent}</h4>
            <div class="button-footer">
                <a class="btn back" href="${back_link.getAttribute("href")}">
                    ${trans_legacy[lang].error.go_back}
                </a>
                <a class="btn continue primary" href="${root}user/${auth.name}">
                    ${trans_legacy[lang].error.visit_profile}
                </a>
            </div>
        </div>
    `;
  }

  // src/pages/event.js
  function bleh_events() {
    let is_subpage = page.subpage != "event_overview" && page.subpage != "festival_overview";
    if (auth.pro) {
      page.structure.container = document.body.querySelector(".page-content");
    } else {
      if (!is_subpage)
        page.structure.container = document.body.querySelector(".page-content:not(header + .page-content)");
      else
        page.structure.container = document.body.querySelector(".page-content");
    }
    page.structure.row = page.structure.container.querySelector(".row");
    try {
      page.structure.main = page.structure.row.querySelector(".col-main");
      page.structure.side = page.structure.row.querySelector(".col-sidebar");
    } catch (e) {
      log("unable to find elements", "page structure");
    }
    let event_header = document.body.querySelector("header");
    checkup_page_structure(is_subpage, event_header);
    if (page.subpage.startsWith("event_edit")) {
      bleh_events_edit();
      return;
    } else if (page.subpage.startsWith("add")) {
      bleh_events_create();
      return;
    }
    page.name = "";
    page.sister = event_header.querySelector(".header-title").textContent.trim();
    let event_description = event_header.querySelector(".header-title-secondary");
    if (settings.corrections) {
      let links = event_description.querySelectorAll("a");
      links.forEach((link) => {
        link.textContent = correct_artist(link.textContent);
      });
    }
    let redesigned_event_header = document.createElement("section");
    redesigned_event_header.classList.add("redesigned-header", "redesigned-event-header", "no-background");
    redesigned_event_header.innerHTML = `
        <div class="calendar-side">
            <div class="calendar">
                ${event_header.querySelector(".calendar-icon").innerHTML}
            </div>
        </div>
        <div class="info-side">
            <div class="sub-text">${trans_legacy[lang].event.name}</div>
            <h1>${page.sister}</h1>
            <p class="sub-info">${event_description.innerHTML}</p>
        </div>
    `;
    let background = document.body.querySelector(".header-background--has-image");
    if (background != null)
      register_background(background.style.getPropertyValue("background-image").replace('url("', "").replace('")', ""));
    page.structure.container.insertBefore(redesigned_event_header, page.structure.container.firstElementChild);
    document.body.querySelector(".header").classList.add("legacy-header");
    if (!is_subpage) {
      let header_meta = document.body.querySelector(".header-metadata");
      header_meta.classList.add("profile-header-metadata-legacy");
      let metadata = header_meta.querySelectorAll(".header-metadata-display");
      let going = 0;
      let maybe = 0;
      metadata.forEach((item, index) => {
        let para = item.querySelector("p");
        if (index == 0) {
          going = clean_number(para.textContent.trim());
        } else if (index == 1) {
          maybe = clean_number(item.textContent.trim());
        }
      });
      let event_top_header = document.createElement("div");
      event_top_header.classList.add("view-buttons", "event-top-header");
      let form = document.body.querySelector(".attendance-control");
      let buttons = form.querySelectorAll("button");
      buttons.forEach((button) => {
        button.classList.add("btn", "event-top-item", "view-item");
      });
      event_top_header.appendChild(form);
      let main_panel = page.structure.main.querySelector(".event-summary-with-poster");
      if (main_panel == null)
        main_panel = page.structure.main.querySelector(".event-details");
      main_panel.insertBefore(event_top_header, main_panel.firstElementChild);
      console.info("event top header", event_top_header);
      let poster = main_panel.querySelector(".event-poster-preview");
      let poster_panel;
      if (poster != null) {
        poster_panel = document.createElement("section");
        poster_panel.classList.add("poster-panel", "view-all-panel");
        poster_panel.innerHTML = `${poster.outerHTML}<a onclick="_expand_avatar('${poster.getAttribute("src").replace("/arXL/", "/ar0/")}')" class="bleh--avatar-clickable-link"></a>`;
        page.structure.side.insertBefore(poster_panel, page.structure.side.firstElementChild);
      }
      let edit_button = main_panel.querySelector(".event-metadata + .event-metadata a");
      if (edit_button != null) {
        edit_button.classList.add("btn", "view-all-button", "back", "edit-event-button");
        let edit_panel = document.createElement("section");
        edit_panel.classList.add("view-all-panel");
        edit_panel.appendChild(edit_button);
        if (poster != null)
          poster_panel.after(edit_panel);
        else
          page.structure.side.insertBefore(edit_panel, page.structure.side.firstElementChild);
      }
      let users = page.structure.main.querySelectorAll(".attendee-summary-user-inner-wrap");
      users.forEach((user) => {
        let avatar = user.querySelector(".attendee-summary-user-avatar");
        let name = user.querySelector(".attendee-summary-user-link").textContent;
        patch_avatar(avatar, name, "event");
      });
    } else {
      if (page.subpage == "event_attendance_going" || page.subpage == "event_attendance_interested") {
        let view_buttons = document.createElement("div");
        view_buttons.classList.add("view-buttons-wrapper");
        view_buttons.innerHTML = `
                <div class="view-buttons">
                    <button class="btn view-item" id="toggle-list_view-1" data-toggle="list_view" data-toggle-value="1" onclick="_update_item('list_view', 1)">
                        ${trans_legacy[lang].glacier.view.grid}
                    </button>
                    <button class="btn view-item" id="toggle-list_view-0" data-toggle="list_view" data-toggle-value="0" onclick="_update_item('list_view', 0)">
                        ${trans_legacy[lang].glacier.view.list}
                    </button>
                </div>
            `;
        page.structure.row.classList.add("force-col-main-primary");
        page.structure.main.classList.add("primary-column");
        page.structure.main.insertBefore(view_buttons, page.structure.main.firstChild);
        refresh_all();
        let users = page.structure.main.querySelectorAll(".user-list-inner-wrap");
        users.forEach((user) => {
          let avatar = user.querySelector(".user-list-avatar");
          let name = user.querySelector(".user-list-link").textContent;
          let badge = patch_avatar(avatar, name, "follow");
          if (badge.type == "avatar-status-dot--staff")
            user.classList.add("staff-user");
        });
      }
    }
    log("status is", "page", "info", page);
    update_page();
  }
  function bleh_events_manage() {
    register_background(auth.avatar);
    page.structure.container = document.body.querySelector(".page-content");
    try {
      page.structure.row = page.structure.container.querySelector(".row");
      page.structure.main = page.structure.row.querySelector(".col-main");
      page.structure.side = page.structure.row.querySelector(".col-sidebar");
    } catch (e) {
      log("unable to find elements", "page structure");
    }
    let content_top2 = document.body.querySelector(".content-top");
    let header_text2 = content_top2.querySelector(".content-top-header").textContent;
    checkup_page_structure(false, content_top2);
    log("status is", "page", "info", page);
    update_page();
    page.structure.nav.classList.add("navlist--more");
    let edit_header = document.createElement("section");
    edit_header.classList.add("redesigned-header", "event-manage-header", "no-background");
    edit_header.innerHTML = `
        <div class="tag-side">
            <div class="tag-icon event-icon"></div>
        </div>
        <div class="info-side">
            <div class="sub-text">${trans_legacy[lang].event.name}</div>
            <h1>${header_text2}</h1>
        </div>
    `;
    page.structure.container.insertBefore(edit_header, page.structure.container.firstElementChild);
  }
  function bleh_events_create() {
    bleh_events_manage();
  }
  function bleh_events_edit() {
    bleh_events_manage();
    let back = document.body.querySelector(".content-top-back-link a");
    let nav = page.structure.nav.querySelector("ul");
    let back_nav = document.createElement("li");
    back_nav.classList.add("navlist-item", "secondary-nav-item", "secondary-nav-item--back");
    back_nav.innerHTML = `
        <a class="secondary-nav-item-link" href="${back.getAttribute("href")}">
            ${trans_legacy[lang].settings.back}
        </a>
    `;
    nav.insertBefore(back_nav, nav.firstElementChild);
  }

  // src/pages/chart.js
  function bleh_charts() {
    if (page.subpage != "overview")
      return;
    let charts = page.structure.main.querySelector(".charts");
    charts.classList.add("legacy-charts");
    let chart_rows = charts.querySelectorAll(".charts-col:not(.charts-col--mobile-ad)");
    let new_panel = document.createElement("section");
    new_panel.classList.add("charts-panel");
    let out_now = page.structure.side.querySelector(".more-link-fullwidth-right a");
    if (out_now != null) {
      out_now.classList.add("btn", "out-now-btn");
    }
    let header = document.createElement("div");
    header.classList.add("charts-header", "top-header");
    header.innerHTML = `
        <div class="left">

        </div>
        <div class="middle">
            <h2>${trans_legacy[lang].charts.charts_for.replace("{date}", moment(/* @__PURE__ */ new Date()).format("MMMM Do YYYY"))}</h2>
            ${out_now != null ? out_now.outerHTML : ""}
        </div>
        <div class="right">
            <div class="view-buttons">
                <button class="btn view-item glacier-configure-button panel-settings-button">
                    ${trans_legacy[lang].settings.configure}
                </button>
            </div>
        </div>
    `;
    new_panel.appendChild(header);
    let settings_btn = header.querySelector(".panel-settings-button");
    tippy(settings_btn, {
      theme: "window",
      content: `
            <div class="dialog-settings">
                <div class="toggle-container" id="container-simulate_scroll" onclick="_update_item('simulate_scroll')">
                    <button class="btn reset" onclick="_reset_item('simulate_scroll')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].charts.scroll.name}</h5>
                        <p>${trans_legacy[lang].charts.scroll.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-simulate_scroll" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
            </div>
        `,
      allowHTML: true,
      placement: "bottom",
      interactive: true,
      interactiveBorder: 10,
      trigger: "click",
      onShow(instance) {
        refresh_all(instance.popper);
      }
    });
    chart_rows.forEach((row, index) => {
      let chart_row = document.createElement("div");
      chart_row.classList.add("charts-new-row");
      chart_row.setAttribute("data-index", index);
      let header2 = row.querySelector("h2");
      chart_row.appendChild(header2);
      let list = document.createElement("ol");
      list.classList.add("music-bookmarks-artists", "charts-list");
      if (settings.simulate_scroll) {
        list.addEventListener("wheel", (e) => {
          e.preventDefault();
          if (e.deltaY > 0) {
            list.scrollBy({
              top: 0,
              left: 600,
              behavior: "smooth"
            });
          } else {
            list.scrollBy({
              top: 0,
              left: -600,
              behavior: "smooth"
            });
          }
        });
      }
      let items = row.querySelectorAll(".globalchart-item");
      items.forEach((item, item_index) => {
        let list_item = document.createElement("li");
        let image = item.querySelector(".globalchart-image img");
        let rank = item.querySelector(".globalchart-rank");
        let name = item.querySelector(".globalchart-name a");
        let link = name.getAttribute("href");
        image.setAttribute("src", image.getAttribute("src").replace("/avatar70s/", "/avatar300s/"));
        if (index == 1) {
          name.textContent = correct_artist(name.textContent);
          list_item.classList.add("music-bookmarks-artists-item-wrap", "charts-list-item");
          list_item.innerHTML = `
                    <div class="music-bookmarks-artists-item charts-list-item-inner">
                        <div class="charts-list-rank">${rank.textContent.trim()}</div>
                        <h3 class="music-bookmarks-artists-item-name">
                            ${name.outerHTML}
                        </h3>
                        <div class="media-item">
                            <span class="music-bookmarks-albums-item-image cover-art">
                                ${image.outerHTML}
                            </span>
                            <div class="charts-list-rank-overlay-wrap">
                                <div class="charts-list-rank-overlay">${rank.textContent}</div>
                            </div>
                        </div>
                        <a class="link-block-cover-link" href="${link}"></a>
                    </div>
                `;
        } else {
          let artist = item.querySelector(".globalchart-track-artist-name a");
          artist.textContent = correct_artist(artist.textContent);
          name.textContent = correct_item_by_artist(name.textContent, artist.textContent);
          list_item.classList.add("music-bookmarks-albums-item-wrap", "charts-list-item");
          list_item.innerHTML = `
                    <div class="music-bookmarks-albums-item charts-list-item-inner">
                        <div class="charts-list-rank">${rank.textContent.trim()}</div>
                        <h3 class="music-bookmarks-albums-item-name">
                            ${name.outerHTML}
                        </h3>
                        <p class="music-bookmarks-albums-item-artist">
                            ${artist.outerHTML}
                        </p>
                        <div class="media-item">
                            <span class="music-bookmarks-albums-item-image cover-art">
                                ${image.outerHTML}
                            </span>
                            <div class="charts-list-rank-overlay-wrap">
                                <div class="charts-list-rank-overlay">${rank.textContent}</div>
                            </div>
                        </div>
                        <a class="link-block-cover-link" href="${link}"></a>
                    </div>
                `;
        }
        list.appendChild(list_item);
      });
      chart_row.appendChild(list);
      new_panel.appendChild(chart_row);
    });
    page.structure.main.insertBefore(new_panel, page.structure.main.firstElementChild);
  }

  // src/components/markdown.js
  function markdown(text) {
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
    let parsed_body = converter.makeHtml(text.replace(/([@])([a-zA-Z0-9_]+)/g, `[$1$2](${root}user/$2)`).replace(/\[artist\]([a-zA-Z0-9]+)\[\/artist\]/g, `[$1](${root}music/$1)`).replace(/\[album artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/album\]/g, `[$2](${root}music/$1/$2)`).replace(/\[track artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/track\]/g, `[$2](${root}music/$1/_/$2)`).replace(/https:\/\/open\.spotify\.com\/user\/([A-Za-z0-9]+)\?si=([A-Za-z0-9]+)/g, "[@$1](https://open.spotify.com/user/$1)").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"));
    return parsed_body;
  }

  // src/pages/lastfm_settings.js
  function bleh_native_settings() {
    if (page.subpage == "overview") {
      patch_settings_profile_tab();
    } else if (page.subpage == "privacy") {
      patch_settings_privacy_tab();
    } else if (page.subpage == "subscription_overview") {
      let panel = page.structure.container.querySelector(".row + div");
      let subscription = panel.querySelector("#current-subscription");
      let edits = panel.querySelector("#automatic-edits");
      let merch_h = panel.querySelector(":scope > h2");
      let merch = panel.querySelector("#mechandise-discount");
      let history = panel.querySelector("#pro-history");
      merch.insertBefore(merch_h, merch.firstElementChild);
      page.structure.main.appendChild(subscription);
      page.structure.main.appendChild(edits);
      page.structure.main.appendChild(merch);
      page.structure.main.appendChild(history);
      let button = subscription.querySelector(".btn-primary");
      if (button) button.classList.add("subscription-button", "icon", "primary");
      let more_link_wrap = edits.querySelector(".more-link");
      if (more_link_wrap) {
        more_link_wrap.classList = "";
        let edit_buttons = more_link_wrap.querySelectorAll("a");
        edit_buttons.forEach((edit_button, index) => {
          edit_button.classList.add("btn", "edit-lead-button", "icon", "primary");
          if (index == 0)
            edit_button.classList.add("edit-album");
          else
            edit_button.classList.add("edit-track");
        });
      }
    } else if (page.subpage.startsWith("subscription_automatic-edits")) {
      bleh_auto_edits();
      let header = content_top.querySelector(".content-top-header");
      header_text = header.textContent.trim();
    }
    if (ff("katsune"))
      return;
    let edit_header = document.createElement("section");
    edit_header.classList.add("redesigned-header", "edit-header", "no-background");
    edit_header.innerHTML = `
        <div class="tag-side">
            <div class="tag-icon cog-icon"></div>
        </div>
        <div class="info-side">
            <div class="sub-text">${trans_legacy[lang].settings.name}</div>
            <h1>${header_text}</h1>
        </div>
    `;
    page.structure.container.insertBefore(edit_header, page.structure.container.firstElementChild);
  }
  function patch_settings_profile_tab() {
    let update_picture = document.getElementById("update-picture");
    if (update_picture == void 0)
      return;
    let token = document.body.querySelector('[name="csrfmiddlewaretoken"]').getAttribute("value");
    patch_settings_profile_panel(token, update_picture);
    patch_settings_charts_panel(token);
  }
  function patch_settings_charts_panel(token) {
    let charts_panel = document.getElementById("update-chart");
    if (charts_panel.hasAttribute("data-kate-processed"))
      return;
    charts_panel.setAttribute("data-kate-processed", "true");
    charts_panel.classList.add("bleh--panel");
    let original_chart_settings = {
      recent: {
        recent_artwork: document.getElementById("id_show_recent_tracks_artwork").checked,
        count: document.getElementById("id_chart_length_recent_tracks").outerHTML,
        recent_realtime: document.getElementById("id_auto_refresh_recent_tracks").checked
      },
      artists: {
        timeframe: document.getElementById("id_chart_range_top_artists").outerHTML,
        style: document.getElementById("id_chart_style_and_length_top_artists").outerHTML
      },
      albums: {
        timeframe: document.getElementById("id_chart_range_top_albums").outerHTML,
        style: document.getElementById("id_chart_style_and_length_top_albums").outerHTML
      },
      tracks: {
        count: document.getElementById("id_chart_length_top_tracks").outerHTML,
        timeframe: document.getElementById("id_chart_range_top_tracks").outerHTML
      }
    };
    charts_panel.innerHTML = `
        <h4>${trans_legacy[lang].settings.inbuilt.charts.name}</h4>
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
                    <h5>${trans_legacy[lang].settings.inbuilt.charts.recent.count.name}</h5>
                </div>
                <div class="select-wrap custom-selector" id="id_chart_length_recent_tracks_select">
                    ${original_chart_settings.recent.count}
                </div>
            </div>
            <div class="toggle-container" id="container-recent_artwork">
                <button class="btn reset" onclick="_reset_inbuilt_item('recent_artwork')">Reset to default</button>
                <div class="heading">
                    <h5>${trans_legacy[lang].settings.inbuilt.charts.recent.artwork.name}</h5>
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
                    <h5>${trans_legacy[lang].settings.inbuilt.charts.recent.realtime.name}</h5>
                    <p>${trans_legacy[lang].settings.inbuilt.charts.recent.realtime.bio}</p>
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
                    <h5>${trans_legacy[lang].settings.inbuilt.charts.artists.timeframe.name}</h5>
                </div>
                <div class="select-wrap custom-selector" id="id_chart_range_top_artists_select">
                    ${original_chart_settings.artists.timeframe}
                </div>
            </div>
            <div class="select-container">
                <div class="heading">
                    <h5>${trans_legacy[lang].settings.inbuilt.charts.artists.style.name}</h5>
                </div>
                <div class="select-wrap custom-selector" id="id_chart_style_and_length_top_artists_select">
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
                    <h5>${trans_legacy[lang].settings.inbuilt.charts.albums.timeframe.name}</h5>
                </div>
                <div class="select-wrap custom-selector" id="id_chart_range_top_albums_select">
                    ${original_chart_settings.albums.timeframe}
                </div>
            </div>
            <div class="select-container">
                <div class="heading">
                    <h5>${trans_legacy[lang].settings.inbuilt.charts.albums.style.name}</h5>
                </div>
                <div class="select-wrap custom-selector" id="id_chart_style_and_length_top_albums_select">
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
                    <h5>${trans_legacy[lang].settings.inbuilt.charts.tracks.timeframe.name}</h5>
                </div>
                <div class="select-wrap custom-selector" id="id_chart_range_top_tracks_select">
                    ${original_chart_settings.tracks.timeframe}
                </div>
            </div>
            <div class="select-container">
                <div class="heading">
                    <h5>${trans_legacy[lang].settings.inbuilt.charts.tracks.count.name}</h5>
                </div>
                <div class="select-wrap custom-selector" id="id_chart_length_top_tracks_select">
                    ${original_chart_settings.tracks.count}
                </div>
            </div>
            <div class="settings-footer">
                <button type="submit" class="btn-primary save">
                    ${trans_legacy[lang].settings.save}
                </button>
                <input type="hidden" value="chart" name="submit">
            </div>
        </form>
    `;
    custom_select(charts_panel.querySelector("#id_chart_length_recent_tracks"), charts_panel.querySelector("#id_chart_length_recent_tracks_select"));
    custom_select(charts_panel.querySelector("#id_chart_range_top_artists"), charts_panel.querySelector("#id_chart_range_top_artists_select"));
    custom_select(charts_panel.querySelector("#id_chart_style_and_length_top_artists"), charts_panel.querySelector("#id_chart_style_and_length_top_artists_select"));
    custom_select(charts_panel.querySelector("#id_chart_range_top_albums"), charts_panel.querySelector("#id_chart_range_top_albums_select"));
    custom_select(charts_panel.querySelector("#id_chart_style_and_length_top_albums"), charts_panel.querySelector("#id_chart_style_and_length_top_albums_select"));
    custom_select(charts_panel.querySelector("#id_chart_range_top_tracks"), charts_panel.querySelector("#id_chart_range_top_tracks_select"));
    custom_select(charts_panel.querySelector("#id_chart_length_top_tracks"), charts_panel.querySelector("#id_chart_length_top_tracks_select"));
    for (let category in original_chart_settings) {
      for (let setting in original_chart_settings[category]) {
        update_inbuilt_item(setting, original_chart_settings[category][setting], false);
      }
    }
    let selects = document.body.querySelectorAll("select");
    selects.forEach((select) => {
      select.setAttribute("onchange", `_update_inbuilt_select('${select.getAttribute("id")}', this.value)`);
      update_inbuilt_select(select.getAttribute("id"), select.value);
    });
  }
  function patch_settings_profile_panel(token, update_picture) {
    if (update_picture.hasAttribute("data-kate-processed"))
      return;
    update_picture.setAttribute("data-kate-processed", "true");
    update_picture.classList.add("bleh--panel");
    let avatar_url = document.body.querySelector(".image-upload-preview img").getAttribute("src");
    let form_display_name = document.getElementById("id_full_name").value;
    let form_website = document.getElementById("id_homepage").value;
    let form_country = document.getElementById("id_country").outerHTML;
    let form_about_me = document.getElementById("id_about_me").textContent;
    document.getElementById("update-profile").outerHTML = "";
    let new_sidebar = document.createElement("section");
    new_sidebar.classList.add("bleh--panel", "about-me-preview");
    new_sidebar.innerHTML = `
        <h4>${tl(trans.about_me_preview)}</h4>
        <span class="bleh--about-me-preview" id="about_me_preview"></span>
    `;
    page.structure.side.appendChild(new_sidebar);
    update_picture.innerHTML = `
        <h4>${trans_legacy[lang].settings.inbuilt.profile.name}</h4>
        <div class="banner-preview"></div>
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
                        <h1>${auth.name}</h1>
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
                                ${trans_legacy[lang].settings.inbuilt.profile.subtitle.name}
                            </div>
                            <div class="input">
                                <input type="text" name="full_name" value="${form_display_name}" maxlength="36" id="id_full_name" oninput="_update_display_name(this.value)" data-form-type="other">
                                <div class="tip">${trans_legacy[lang].settings.inbuilt.profile.pronoun_tip}</div>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="title">
                                ${trans_legacy[lang].settings.inbuilt.profile.country}
                            </div>
                            <div class="input custom-selector" id="country_select">
                                ${form_country}
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="title">
                                ${trans_legacy[lang].settings.inbuilt.profile.website}
                            </div>
                            <div class="input">
                                <input type="url" name="homepage" value="${form_website}" id="id_homepage" data-form-type="website">
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="title">
                                ${trans_legacy[lang].settings.inbuilt.profile.about}
                            </div>
                            <div class="input about-me" data-bleh--show-preview="false" id="about_me">
                                <textarea name="about_me" cols="40" rows="10" class="textarea--s" maxlength="500" id="id_about_me" oninput="_update_about_me_preview(this.value)" data-form-type="other">${form_about_me}</textarea>
                                <div class="tip">${tl(trans.markdown_tip)}</div>
                            </div>
                        </div>
                        <div class="save-row">
                            <div class="form-submit">
                                <button type="submit" class="btn-primary save" data-form-type="action">
                                    ${trans_legacy[lang].settings.save}
                                </button>
                                <input type="hidden" value="profile" name="submit">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    custom_select(update_picture.querySelector("#id_country"), update_picture.querySelector("#country_select"));
    let about_me_box = document.getElementById("id_about_me");
    update_about_me_preview(about_me_box.value);
    update_display_name(form_display_name);
    tippy(document.getElementById("btn--toggle-about-me-preview"), {
      content: trans_legacy[lang].settings.inbuilt.profile.toggle_preview.bio
    });
  }
  unsafeWindow._toggle_about_me_preview = function() {
    toggle_about_me_preview();
  };
  function toggle_about_me_preview() {
    let about_me = document.getElementById("about_me");
    if (about_me.getAttribute("data-bleh--show-preview") == "false")
      about_me.setAttribute("data-bleh--show-preview", "true");
    else
      about_me.setAttribute("data-bleh--show-preview", "false");
  }
  unsafeWindow._update_display_name = function(value) {
    update_display_name(value);
  };
  function update_display_name(value) {
    document.getElementById("header-title-display-name").textContent = value;
    let pronouns = use_pronouns(value);
    document.getElementById("header-title-display-name--pre").textContent = pronouns ? trans_legacy[lang].profile.display_name.pronouns : trans_legacy[lang].profile.display_name.aka;
  }
  function use_pronouns(value) {
    value = value.replaceAll(" ", "");
    if (value.startsWith("she/") || value.startsWith("he/") || value.startsWith("they/") || value.startsWith("it/") || value.startsWith("xe/") || value.startsWith("any/")) return true;
    return false;
  }
  unsafeWindow._open_avatar_changer = function(token) {
    open_avatar_changer(token);
  };
  function open_avatar_changer(token) {
    dialog_legacy("edit_avatar", trans_legacy[lang].settings.inbuilt.profile.avatar.name, `
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
                    ${trans_legacy[lang].settings.inbuilt.profile.avatar.upload}
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn-primary save" onclick="_save_avatar_changer()">
                        ${trans_legacy[lang].settings.save}
                    </button>
                    <input type="hidden" value="avatar" name="submit">
                </div>
            </form>
            <form class="image-remove-form bleh--upload-avatar-form" action="${root}settings/avatar/delete" method="post">
                <input type="hidden" name="csrfmiddlewaretoken" value="${token}">
                <div class="form-group">
                    <button class="mimic-link image-upload-remove" type="submit" value="delete-avatar" name="delete-avatar">Delete picture</button>
                    ${trans_legacy[lang].settings.inbuilt.profile.avatar.delete}
                </div>
                <div class="modal-footer">
                    <button class="btn cancel" onclick="_kill_window('edit_avatar')" type="button">${trans_legacy[lang].settings.cancel}</button>
                </div>
            </form>
        </div>
        `, true, "upload-avatar");
  }
  unsafeWindow._save_avatar_changer = function() {
    document.getElementById("bleh--window-edit_avatar--body").classList.add("modal-processing");
    setTimeout(function() {
      kill_window("edit_avatar");
      auth.avatar = auth_link.state.querySelector("img").getAttribute("src");
      document.querySelector(".auth-dropdown-menu").style.setProperty("--url", `url(${auth.avatar.replace("avatar42s", "avatar170s")})`);
    }, 5e3);
  };
  unsafeWindow._update_about_me_preview = function(value) {
    update_about_me_preview(value);
  };
  function update_about_me_preview(value) {
    let result = markdown(value);
    let about_me = page.structure.side.querySelector("#about_me_preview");
    about_me.innerHTML = result;
    let banner = about_me.querySelector('img[alt="banner"]');
    let banner_img = page.structure.main.querySelector(".banner-preview");
    if (!banner)
      banner_img.removeAttribute("style");
    else
      banner_img.style.setProperty("background-image", `url(${banner.getAttribute("src")})`);
  }
  function patch_settings_privacy_tab() {
    let privacy_panel = document.getElementById("privacy");
    let token = document.body.querySelector('[name="csrfmiddlewaretoken"]').getAttribute("value");
    bleh_communication_panel(token);
    patch_settings_privacy_panel(token, privacy_panel);
  }
  function bleh_communication_panel(token) {
    let panel = page.structure.main.querySelector("#ignorelist");
    panel.classList.add("bleh--panel");
    let label = panel.querySelector(".control-label").textContent;
    let input = panel.querySelector("#id_user").outerHTML;
    let button_text = panel.querySelector(".btn-primary").textContent;
    let current = panel.querySelector("form + .form-horizontal .control-label").textContent;
    let list = panel.querySelectorAll(".ignore-list tr");
    let new_list = document.createElement("div");
    new_list.classList.add("generic-table-list", "user-vertical-list");
    let exceeded = false;
    let exceed_amount = 10;
    let amount = 0;
    list.forEach((item, index) => {
      let entry = document.createElement("div");
      entry.classList.add("generic-table-list-entry", "user-vertical-list-item");
      let name = item.querySelector("td").textContent.trim();
      let form2 = item.querySelector("form");
      let button = form2.querySelector("button");
      button.classList.add("icon", "delete-user-button", "danger-subtle");
      entry.innerHTML = `
            <span class="text">
                <a class="mention" href="${root}user/${name}" target="_blank">@${name}</a>
            </span>
            <span class="actions">
                ${form2.outerHTML}
            </span>
        `;
      if (index > exceed_amount && !exceeded)
        exceeded = true;
      if (exceeded)
        entry.classList.add("entry-is-exceeded");
      new_list.appendChild(entry);
      amount += 1;
    });
    if (exceeded) {
      let remainder = amount - exceed_amount;
      new_list.classList.add("list-is-exceeded");
      new_list.setAttribute("data-expanded", "false");
      let expand = document.createElement("button");
      expand.classList.add("expand-button", "icon");
      expand.textContent = trans_legacy[lang].settings.inbuilt.ignore.view.replace("{c}", remainder);
      expand.setAttribute("onclick", "_expand_list(this)");
      new_list.appendChild(expand);
    }
    let form = page.structure.main.querySelector('[name="ignorelist"]');
    if (page.token == "")
      page.token = form.querySelector('[name="csrfmiddlewaretoken"]').getAttribute("value");
    panel.innerHTML = `
        <h4>${trans_legacy[lang].settings.inbuilt.ignore.name}</h4>
        <div class="user-top-panel">
            <div class="user-top-avatar user-top-avatar-side-left"><div class="bleh-icon"></div></div>
            <img class="user-top-avatar user-top-avatar-main" src="${auth.avatar.replace("avatar42s", "avatar300s")}" alt="${auth.name}">
            <div class="user-top-avatar user-top-avatar-side-right"><div class="bleh-icon"></div></div>
        </div>
        <h5>${trans_legacy[lang].settings.inbuilt.ignore.consider.name}</h5>
        <div class="to-consider">
            <ul class="to-consider-good">
                <li>${trans_legacy[lang].settings.inbuilt.ignore.consider.good[0]}</li>
                <li>${trans_legacy[lang].settings.inbuilt.ignore.consider.good[1]}</li>
                <li>${trans_legacy[lang].settings.inbuilt.ignore.consider.good[2]}</li>
            </ul>
            <ul class="to-consider-bad">
                <li>${trans_legacy[lang].settings.inbuilt.ignore.consider.bad[0]}</li>
                <li>${trans_legacy[lang].settings.inbuilt.ignore.consider.bad[1]}</li>
            </ul>
        </div>
        <div class="text-container">
            <div class="heading">
                <h5>${trans_legacy[lang].settings.music.profile_shortcut.placeholder}</h5>
                <form action="${root}settings/privacy#ignorelist" name="ignorelist" method="post">
                    <input type="hidden" name="csrfmiddlewaretoken" value="${page.token}">
                    <div class="input-container">
                        <input type="text" maxlength="80" id="id_user" name="user" placeholder="${trans_legacy[lang].settings.music.profile_shortcut.header}">
                        <input type="hidden" name="listaction" value="add">
                        <input type="hidden" name="submit" value="ignorelist">
                        <button class="bleh--btn primary icon add" type="submit">${trans_legacy[lang].settings.add}</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="alert alert-info">
            ${trans_legacy[lang].settings.inbuilt.ignore.count.replace("{c}", amount)}
        </div>
    `;
    panel.appendChild(new_list);
  }
  function patch_settings_privacy_panel(token, privacy_panel) {
    privacy_panel.classList.add("bleh--panel");
    let original_privacy_settings = {
      recent_listening: document.getElementById("id_hide_realtime").checked,
      receiving_msgs: document.getElementById("id_message_privacy").outerHTML,
      disable_shoutbox: document.getElementById("id_shoutbox_disabled").checked
    };
    privacy_panel.innerHTML = `
        <h4>${trans_legacy[lang].settings.inbuilt.privacy.name}</h4>
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
                    <h5>${trans_legacy[lang].settings.inbuilt.privacy.recent_listening.name}</h5>
                    <p>${trans_legacy[lang].settings.inbuilt.privacy.recent_listening.bio}</p>
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
                    <h5>${trans_legacy[lang].settings.inbuilt.privacy.receiving_msgs.settings.everyone.name}</h5>
                </div>
                <div class="btn primary-selection" id="primary-selection-receiving_msgs-neighbours" onclick="_update_inbuilt_selection('id_message_privacy', 1)">
                    <h5>${trans_legacy[lang].settings.inbuilt.privacy.receiving_msgs.settings.neighbours.name}</h5>
                </div>
                <div class="btn primary-selection" id="primary-selection-receiving_msgs-follow" onclick="_update_inbuilt_selection('id_message_privacy', 2)">
                    <h5>${trans_legacy[lang].settings.inbuilt.privacy.receiving_msgs.settings.follow.name}</h5>
                </div>
            </div>
            <div class="sep"></div>
            <div class="inner-preview pad">
                <div class="shouts">
                    <div class="shout-preview">
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
                    <div class="shout-preview">
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
                    <div class="shout-preview">
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
                    <h5>${trans_legacy[lang].settings.inbuilt.privacy.disable_shoutbox.name}</h5>
                    <p>${trans_legacy[lang].settings.inbuilt.privacy.disable_shoutbox.bio}</p>
                </div>
                <div class="toggle-wrap">
                    <input class="companion-checkbox" type="checkbox" name="shoutbox_disabled" id="inbuilt-companion-checkbox-disable_shoutbox">
                    <span class="btn toggle" id="toggle-disable_shoutbox" onclick="_update_inbuilt_item('disable_shoutbox')" aria-checked="false">
                        <div class="dot"></div>
                    </span>
                </div>
            </div>
            <div class="settings-footer">
                <button type="submit" class="btn-primary save">
                    ${trans_legacy[lang].settings.save}
                </button>
                <input type="hidden" value="privacy" name="submit">
            </div>
        </form>
    `;
    for (let setting in original_privacy_settings) {
      update_inbuilt_item(setting, original_privacy_settings[setting], false);
    }
    let selects = document.body.querySelectorAll("select");
    selects.forEach((select) => {
      select.setAttribute("onchange", `_update_inbuilt_select('${select.getAttribute("id")}', this.value)`);
      update_inbuilt_select(select.getAttribute("id"), select.value);
    });
  }

  // src/pages/home.js
  function bleh_home() {
    page.structure.container = document.body.querySelector(".page-content");
    try {
      page.structure.row = page.structure.container.querySelector(".row");
      page.structure.main = page.structure.row.querySelector(".col-main");
      page.structure.side = page.structure.row.querySelector(".col-sidebar");
    } catch (e) {
      log("unable to find elements", "page structure");
    }
    let content_top2 = document.body.querySelector(".content-top");
    checkup_page_structure(false, content_top2);
    log("status is", "page", "info", page);
    update_page();
    register_background(auth.avatar.replace("/avatar42s/", "/ar0/"));
    let banner = document.createElement("div");
    banner.classList.add("top-banner", "home-banner", "colourful");
    let sponsoring = false;
    if (sponsor_list)
      sponsoring = sponsor_list.sponsors.includes(auth.name);
    banner.innerHTML = `
        <a class="home-avatar" href="${root}user/${auth.name}">
            <img src="${auth.avatar.replace("/avatar42s/", "/avatar170s/")}">
        </a>
        ${sponsoring ? `
        <div class="subtext sponsor-message colourful">
            <div class="bleh-icon-container"><div class="bleh-icon" style="--icon: var(--icon-16-heart-solid); --icon-size: 14px"></div></div>
            Thank you for sponsoring!
        </div>
        ` : ""}
        <h1>${trans_legacy[lang].home.welcome.replace("{m}", `<a class="mention" href="${root}user/${auth.name}">@${auth.name}</a>`)}</h1>
    `;
    page.structure.container.insertBefore(banner, page.structure.container.firstElementChild);
    let nav = document.createElement("nav");
    nav.classList.add("navlist", "secondary-nav", "navlist--more", "redesigned-navigation");
    nav.innerHTML = `
        <ul class="navlist-items">
            <li class="navlist-item secondary-nav-item secondary-nav-item--home">
                <a href="${root}music" class="secondary-nav-item-link ${page.subpage == "music" ? "secondary-nav-item-link--active" : ""}">
                    ${tl(trans.home)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item secondary-nav-item--recommendations">
                <a href="${root}music/+recommended" class="secondary-nav-item-link ${page.type == "recommended" ? "secondary-nav-item-link--active" : ""}">
                    ${tl(trans.recommendations)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item secondary-nav-item--releases">
                <a href="${root}music/+releases/out-now" class="secondary-nav-item-link ${page.type == "releases" ? "secondary-nav-item-link--active" : ""}">
                    ${tl(trans.releases)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item secondary-nav-item--bookmarks">
                <a href="${root}music/+bookmarks" class="secondary-nav-item-link ${page.type == "bookmarks" ? "secondary-nav-item-link--active" : ""}">
                    ${tl(trans.bookmarks)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item secondary-nav-item--charts">
                <a href="${root}charts" class="secondary-nav-item-link ${page.type == "charts" ? "secondary-nav-item-link--active" : ""}">
                    ${tl(trans.charts)}
                </a>
            </li>
            <li class="fill"></li>
            <li class="navlist-item secondary-nav-item secondary-nav-item--settings">
                <a href="${root}settings" class="secondary-nav-item-link ${page.type == "settings" ? "secondary-nav-item-link--active" : ""}">
                    ${tl(trans.settings)}
                </a>
            </li>
            <li class="navlist-item secondary-nav-item secondary-nav-item--bleh">
                <a href="${root}bleh" class="secondary-nav-item-link ${page.type == "error" ? "secondary-nav-item-link--active" : ""}">
                    bleh
                </a>
            </li>
            <li class="navlist-item secondary-nav-item secondary-nav-item--more">
                <a class="secondary-nav-item-link no-text">
                    ${tl(trans.more)}
                </a>
            </li>
        </ul>
    `;
    page.structure.nav = nav;
    banner.after(nav);
    if (page.type == "charts")
      bleh_charts();
    if (page.type == "settings")
      bleh_native_settings();
    let menu_button = nav.querySelector(".secondary-nav-item--more a");
    tippy(menu_button, {
      theme: "menu",
      content: `
            <button class="dropdown-menu-clickable-item update" onclick="_force_refresh_theme()">
                ${trans_legacy[lang].settings.home.update.update_now}
            </button>
            ${settings.dev ? `
            <a class="dropdown-menu-clickable-item update" href="https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.css">
                ${trans_legacy[lang].settings.home.update.css}
            </a>
            ` : ""}
            <button class="dropdown-menu-clickable-item sponsor" onclick="_sponsor()">
                ${trans_legacy[lang].settings.home.sponsor.name}<div class="new-badge">${trans_legacy[lang].settings.new}</div>
            </button>
            <a class="dropdown-menu-clickable-item issues" href="https://github.com/katelyynn/bleh/issues" target="_blank">
                ${trans_legacy[lang].settings.home.issues.name}
            </a>
        `,
      allowHTML: true,
      placement: "bottom",
      interactive: true,
      interactiveBorder: 10,
      trigger: "click"
    });
    if (page.subpage == "music") {
      let beret = document.createElement("section");
      beret.classList.add("beret-music", "bleh--panel");
      beret.innerHTML = `
            <div class="panel-side panel-side-main">
                <h4>Recent listening</h4>
                <div class="recent-listening-container">
                    <div class="loading-data-container">
                        <p class="loading-data-text">Finding your tracks</p>
                    </div>
                </div>
            </div>
            <div class="panel-side panel-side-alt">
                <h4>Recent activities</h4>
            </div>
        `;
      let track_list = beret.querySelector(".recent-listening-container");
      fetch(`${root}user/${auth.name}/partial/recenttracks?ajax=1`).then(function(response) {
        console.log("returned", response, response.text);
        return response.text();
      }).then(function(html) {
        let doc = new DOMParser().parseFromString(html, "text/html");
        console.log("DOC", doc);
        let tracklist_panel = doc.querySelector(".chartlist");
        if (tracklist_panel)
          track_list.outerHTML = tracklist_panel.outerHTML;
      });
      let activity_list = beret.querySelector(".panel-side-alt");
      load_activities();
      let recent_activity_list_r = recent_activity_list;
      recent_activity_list_r.reverse();
      recent_activity_list_r.forEach((activity) => {
        let activity_item = document.createElement("a");
        activity_item.classList.add("activity-item", `activity--${activity.type}`);
        activity_item.setAttribute("href", activity.context);
        let involved_text = "";
        let tooltip_name;
        let tooltip_sister;
        activity.involved.forEach((involved) => {
          let involved_link;
          if (involved.type == "user")
            involved_link = `${root}user/${involved.name}`;
          else if (involved.type == "artist")
            involved_link = `${root}music/${sanitise(involved.name)}`;
          else if (involved.type == "album")
            involved_link = `${root}music/${sanitise(involved.sister)}/${sanitise(involved.name)}`;
          else if (involved.type == "track")
            involved_link = `${root}music/${sanitise(involved.sister)}/_/${sanitise(involved.name)}`;
          else if (involved.type == "tag")
            involved_link = `${root}tag/${sanitise(involved.name)}`;
          else if (involved.type == "bwaa")
            involved_link = `${root}bwaa`;
          else if (involved.type == "bleh")
            involved_link = `${root}bleh`;
          if (involved.type != "artist" && involved.type != "user" && involved.type != "tag" && involved.type != "bwaa" && involved.type != "bleh") {
            tooltip_name = involved.name;
            tooltip_sister = involved.sister;
          }
          if (involved_text != "")
            involved_text = `${involved_text}, <a class="involved--${involved.type}" href="${involved_link}">${involved.name}</a>`;
          else
            involved_text = `${involved_text}<a class="involved--${involved.type}" href="${involved_link}">${involved.name}</a>`;
        });
        activity_item.innerHTML = `
                <div class="type">${trans_legacy[lang].activities[activity.type]}<div class="date">${moment(activity.date).fromNow(true)}</div></div>
                <div class="title">${involved_text}</div>
            `;
        activity_list.appendChild(activity_item);
        if (tooltip_name != void 0)
          tippy(activity_item.querySelector(".title a"), {
            content: `${tooltip_sister} - ${tooltip_name}`
          });
      });
      page.structure.main.appendChild(beret);
      let music_sections = document.body.querySelectorAll(".music-section");
      music_sections.forEach((music_section) => {
        page.structure.main.appendChild(music_section);
      });
      let items = page.structure.main.querySelectorAll(".music-featured-item");
      items.forEach((item) => {
        let bg = item.querySelector(".music-featured-item-background");
        if (!bg) return;
        let style = bg.style.getPropertyValue("background-image");
        let cover_substr = style.indexOf("url");
        let cover = style.substring(cover_substr);
        bg.style.setProperty("background", cover);
      });
    }
  }
  function bleh_home_legacy() {
    window.location.href = `${root}music`;
  }

  // src/pages/inbox.js
  function bleh_inbox() {
    page.structure.container = document.body.querySelector(".page-content");
    try {
      page.structure.row = page.structure.container.querySelector(".row");
      page.structure.main = page.structure.row.querySelector(".col-main");
      page.structure.side = page.structure.row.querySelector(".col-sidebar");
    } catch (e) {
      log("unable to find elements", "page structure");
    }
    let content_top2 = document.body.querySelector(".content-top");
    checkup_page_structure(false, content_top2);
    log("status is", "page", "info", page);
    update_page();
    if (page.subpage == "notifications") {
      let form = page.structure.container.querySelector("form");
      let notifications = page.structure.container.querySelector(".inbox-notifications");
      let pagination = page.structure.container.querySelector(".pagination");
      let panel = document.createElement("section");
      panel.classList.add("inbox-panel", "notifications-panel");
      if (form)
        panel.appendChild(form);
      if (notifications)
        panel.appendChild(notifications);
      if (pagination)
        panel.appendChild(pagination);
      page.structure.main.appendChild(panel);
      if (!notifications)
        return;
      let notif_links = notifications.querySelectorAll(".inbox-notifications__item-link");
      notif_links.forEach((notification) => {
        let link = notification.getAttribute("href");
        if (link.endsWith("/obsessions/set") || link.endsWith("/listening-report/month")) return;
        let avatar = notification.querySelector(".avatar");
        let name = notification.querySelector(".inbox-notifications__item-description strong");
        if (!name) return;
        let name_text = sanitise(return_name_from_avatar(avatar.querySelector("img")));
        let badge = patch_avatar(avatar, name_text);
        name.classList.add("notification-user-name", `user-status--bleh-${badge.type}`, `user-status--bleh-user-${name_text}`);
        if (notification.classList.contains("inbox-notifications__item--highlight"))
          notification.classList.add("notification-user-name", `user-status--bleh-${badge.type}`, `user-status--bleh-user-${name_text}`);
      });
    } else if (page.subpage == "message_overview" || page.subpage == "sent_message") {
      let inbox = page.structure.container.querySelector(".inbox-message-view");
      page.structure.main.appendChild(inbox);
      let sender_panel = inbox.querySelector(".inbox-message-sender-avatar");
      let sender_name = inbox.querySelector(".inbox-message-sender-name");
      let sender_time = inbox.querySelector(".inbox-message-timestamp");
      sender_panel.appendChild(sender_name);
      sender_panel.appendChild(sender_time);
      let avatar = sender_panel.querySelector(".avatar");
      let name_text = sanitise(sender_name.textContent.trim());
      let badge = patch_avatar(avatar, name_text);
      sender_panel.classList.add(`user-status--bleh-${badge.type}`, `user-status--bleh-user-${name_text}`);
    } else if (page.subpage == "compose") {
      let inbox = page.structure.container.querySelector(".inbox-compose-view");
      page.structure.main.appendChild(inbox);
    } else {
      let inbox = page.structure.container.querySelector(".inbox");
      page.structure.main.appendChild(inbox);
    }
  }

  // src/components/profile_header.js
  unsafeWindow._toggle_profile_header = function(button) {
    let current = settings.profile_header_expand;
    settings.profile_header_expand = !current;
    button.setAttribute("aria-expanded", !current);
    document.documentElement.setAttribute("data-bleh--profile_header_expand", !current);
    localStorage.setItem("bleh", JSON.stringify(settings));
  };
  function redesign_profile_header(is_own_profile, is_following) {
    let base_header = document.body.querySelector(".header-info-secondary");
    if (base_header == null)
      return;
    let katsune = ff("katsune");
    let header_meta = base_header.querySelector(".header-metadata");
    header_meta.classList.add("profile-header-metadata-legacy");
    let scrobbles = 0;
    let average = 0;
    let artists = 0;
    let loved = 0;
    if (!katsune) {
      let metadata = header_meta.querySelectorAll(".header-metadata-display");
      metadata.forEach((item, index) => {
        if (index == 0) {
          let para = item.querySelector("p");
          scrobbles = clean_number(para.textContent.trim());
          average = para.getAttribute("title");
        } else if (index == 1) {
          artists = clean_number(item.textContent.trim());
        } else if (index == 2) {
          loved = clean_number(item.textContent.trim());
        }
      });
    }
    let taste = "";
    let taste_percentage = "";
    let taste_artists = [];
    let profile_avi = "";
    if (!is_own_profile && page.name != sponsor_list.sponsor_account) {
      let taste_meter = base_header.querySelector(".tasteometer");
      taste = taste_meter.classList[1].replace("tasteometer-compat-", "");
      let artists2 = taste_meter.querySelectorAll("a");
      artists2.forEach((artist) => {
        taste_artists.push(correct_artist(artist.getAttribute("title")));
      });
      profile_avi = document.body.querySelector(".header-avatar img");
      if (profile_avi != null)
        profile_avi = profile_avi.getAttribute("src");
      else
        profile_avi = "";
      taste_percentage = taste_meter.querySelector(".tasteometer-viz").getAttribute("title");
      if (taste_percentage == "99%")
        taste_percentage = "100%";
    }
    let profile_header;
    if (katsune) {
      profile_header = document.createElement("section");
      profile_header.classList.add("profile-top-header", "katsune-button-row");
    } else {
      profile_header = document.createElement("div");
      profile_header.classList.add("profile-top-header", "view-buttons");
    }
    if (!is_own_profile) {
      let follow_wrap = document.body.querySelector(".header-avatar .class > div");
      if (follow_wrap != null) {
        let follow_btn = follow_wrap.querySelector("button");
        follow_btn.classList.add("btn", "profile-top-item", "profile-top-item--follow", "view-item", katsune ? "icon" : "");
        follow_btn.classList.remove("toggle-button", "header-follower-btn");
        follow_btn.setAttribute("data-following", is_following);
        profile_header.appendChild(follow_wrap);
        if (!katsune)
          tippy(follow_btn, {
            content: follow_btn.textContent
          });
        follow_btn.addEventListener("click", () => {
          window.setTimeout(() => {
            follow_btn._tippy.setContent(follow_btn.textContent);
          }, 50);
        });
      } else {
        let follow_placeholder = document.createElement("button");
        follow_placeholder.classList.add("btn", "profile-top-item", "profile-top-item--follow", "view-item", katsune ? "icon" : "");
        follow_placeholder.textContent = trans_legacy[lang].profile.on_ignore_list;
        follow_placeholder.setAttribute("disabled", "true");
        follow_placeholder.setAttribute("data-ignored", "true");
        if (!katsune)
          tippy(follow_placeholder, {
            content: trans_legacy[lang].profile.on_ignore_list
          });
        profile_header.appendChild(follow_placeholder);
      }
      if (page.name == "cutensilly") {
        create_profile_top_item(profile_header, {
          name: page.name,
          type: "sponsor",
          link: "_sponsor()",
          full: true,
          action: "button",
          primary: true,
          katsune
        });
      }
      let msg_button = document.body.querySelector(".header-message-user");
      if (msg_button != null) {
        if (page.name != sponsor_list.sponsor_account) {
          create_profile_top_item(profile_header, {
            name: page.name,
            type: "message",
            link: msg_button.getAttribute("href"),
            katsune
          });
        } else {
          create_profile_top_item(profile_header, {
            name: page.name,
            type: "sponsor",
            link: "_sponsor()",
            full: true,
            action: "button",
            primary: true,
            katsune
          });
          create_profile_top_item(profile_header, {
            name: page.name,
            type: "message_sponsor",
            link: msg_button.getAttribute("href"),
            full: true,
            primary: true,
            katsune
          });
        }
      }
      if (page.name != sponsor_list.sponsor_account) {
        create_profile_top_item(profile_header, {
          name: page.name,
          type: "shortcut",
          link: `_set_profile_as_shortcut(this, '${page.name}')`,
          action: "button",
          katsune
        });
      }
    } else {
      create_profile_top_item(profile_header, {
        name: page.name,
        type: "edit",
        link: `${root}settings`,
        katsune
      });
      create_profile_top_item(profile_header, {
        name: page.name,
        type: "obsess",
        link: `${root}user/${page.name}/obsessions/set`,
        katsune
      });
    }
    if (katsune) {
      let sep = document.createElement("div");
      sep.classList.add("btn-gap");
      profile_header.appendChild(sep);
    }
    if (!is_own_profile && page.name != sponsor_list.sponsor_account && katsune) {
      let taste_wrap = document.createElement("div");
      taste_wrap.classList.add("katsune-taste");
      taste_wrap.innerHTML = `
            <div class="taste-info">
                <div class="taste-value">
                    ${taste_artists.length == 1 ? trans_legacy[lang].profile.taste_meter.you_share_1.replace("{artist}", taste_artists[0]) : ""}
                    ${taste_artists.length == 2 ? trans_legacy[lang].profile.taste_meter.you_share_2.replace("{artist1}", taste_artists[0]).replace("{artist2}", taste_artists[1]) : ""}
                    ${taste_artists.length == 3 ? trans_legacy[lang].profile.taste_meter.you_share_3.replace("{artist1}", taste_artists[0]).replace("{artist2}", taste_artists[1]).replace("{artist3}", taste_artists[2]) : ""}
                </div>
                <div class="taste-bar colourful" data-taste="${taste}">
                    <div class="taste-bar-fill" style="width: ${taste_percentage}"></div>
                </div>
            </div>
            <div class="katsune-taste-badge">
                <div class="taste-icon colourful" data-taste="${taste}"></div>
                <div class="taste-percent">${taste_percentage.replace("%", "")}</div>
            </div>
        `;
      tippy(taste_wrap, {
        theme: "stack",
        content: `
            <span>
                ${trans_legacy[lang].profile.taste}
                <!--<div class="taste-badge spacing">
                    <span>${trans_legacy[lang].profile.taste_meter.level[taste]}</span>
                    <span>${taste_percentage}</span>
                </div>-->
            </span>
            <div class="hint">${trans_legacy[lang].settings.right_click}</div>
            `,
        allowHTML: true
      });
      profile_header.appendChild(taste_wrap);
      if (taste_artists.length > 1) {
        let menu = tippy(taste_wrap, {
          theme: "context-menu",
          content: `
                    <h4 class="menu-header">${trans_legacy[lang].music.compare.header}</h4>
                    <a class="dropdown-menu-clickable-item" href="${root}user/${page.name}/library/music/${sanitise(taste_artists[0])}" data-menu-item="shared-artist">
                        <img class="view-item-avatar" src="${profile_avi}" alt="${page.name}">${taste_artists[0]}
                    </a>
                    <a class="dropdown-menu-clickable-item" href="${root}user/${auth.name}/library/music/${sanitise(taste_artists[0])}" data-menu-item="shared-artist">
                        <img class="view-item-avatar" src="${auth.avatar}" alt="${auth.name}">${taste_artists[0]}
                    </a>
                    ${taste_artists.length >= 2 ? `
                    <div class="sep"></div>
                    <a class="dropdown-menu-clickable-item" href="${root}user/${page.name}/library/music/${sanitise(taste_artists[1])}" data-menu-item="shared-artist">
                        <img class="view-item-avatar" src="${profile_avi}" alt="${page.name}">${taste_artists[1]}
                    </a>
                    <a class="dropdown-menu-clickable-item" href="${root}user/${auth.name}/library/music/${sanitise(taste_artists[1])}" data-menu-item="shared-artist">
                        <img class="view-item-avatar" src="${auth.avatar}" alt="${auth.name}">${taste_artists[1]}
                    </a>
                    ` : ""}
                    ${taste_artists.length >= 3 ? `
                    <div class="sep"></div>
                    <a class="dropdown-menu-clickable-item" href="${root}user/${page.name}/library/music/${sanitise(taste_artists[2])}" data-menu-item="shared-artist">
                        <img class="view-item-avatar" src="${profile_avi}" alt="${page.name}">${taste_artists[2]}
                    </a>
                    <a class="dropdown-menu-clickable-item" href="${root}user/${auth.name}/library/music/${sanitise(taste_artists[2])}" data-menu-item="shared-artist">
                        <img class="view-item-avatar" src="${auth.avatar}" alt="${auth.name}">${taste_artists[2]}
                    </a>
                    ` : ""}
                `,
          allowHTML: true,
          placement: "right-start",
          trigger: "manual",
          interactive: true,
          interactiveBorder: 10,
          offset: [0, 0]
        });
        register_menu(taste_wrap, menu);
      }
    }
    if (page.name != sponsor_list.sponsor_account && katsune) {
      let progress = document.createElement("div");
      progress.classList.add("katsune-scrobble-progress", "colourful");
      let metadata = header_meta.querySelector(".header-metadata-display");
      scrobbles = clean_number(metadata.querySelector("p").textContent.trim());
      let tier = 0;
      if (scrobbles > 1e5) {
        tier = Math.floor(scrobbles / 1e5);
        scrobbles -= tier * 1e5;
      }
      if (tier > 4)
        tier = 4;
      progress.setAttribute("data-tier", tier);
      let left = 1e5 - scrobbles;
      let percent = scrobbles / 1e5 * 100;
      progress.innerHTML = `
            <div class="progress-info">
                <div class="progress-value">${trans_legacy[lang].profile.progress.to_go.replace("{s}", left.toLocaleString(lang))}</div>
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${percent}%"></div>
                </div>
            </div>
            <div class="progress-badge">
                <div class="progress-icon"></div>
                <div class="progress-percent">${Math.round(percent)}</div>
            </div>
        `;
      profile_header.appendChild(progress);
      tippy(progress, {
        theme: "progress-badges",
        content: `
                <span class="progress-badges-title">${trans_legacy[lang].profile.progress.explain}</span>
                <div class="progress-badges-list">
                    <div class="progress-badges-item colourful ${tier == 0 ? "active" : ""}" data-tier="0">
                        <div class="bleh-icon" style="--icon: var(--icon-16-progress-tier-0)"></div>
                        <span class="tier-name">${trans_legacy[lang].profile.progress.tier.replace("{t}", "0")}</span>
                    </div>
                    <div class="progress-badges-item colourful ${tier == 1 ? "active" : ""}" data-tier="1">
                        <div class="bleh-icon" style="--icon: var(--icon-16-progress-tier-1)"></div>
                        <span class="tier-name">${trans_legacy[lang].profile.progress.tier.replace("{t}", "1")}</span>
                    </div>
                    <div class="progress-badges-item colourful ${tier == 2 ? "active" : ""}" data-tier="2">
                        <div class="bleh-icon" style="--icon: var(--icon-16-progress-tier-2)"></div>
                        <span class="tier-name">${trans_legacy[lang].profile.progress.tier.replace("{t}", "2")}</span>
                    </div>
                    <div class="progress-badges-item colourful ${tier == 3 ? "active" : ""}" data-tier="3">
                        <div class="bleh-icon" style="--icon: var(--icon-16-progress-tier-3)"></div>
                        <span class="tier-name">${trans_legacy[lang].profile.progress.tier.replace("{t}", "3")}</span>
                    </div>
                    <div class="progress-badges-item colourful ${tier == 4 ? "active" : ""}" data-tier="4">
                        <div class="bleh-icon" style="--icon: var(--icon-16-progress-tier-4)"></div>
                        <span class="tier-name">${trans_legacy[lang].profile.progress.tier.replace("{t}", "4")}</span>
                    </div>
                </div>
            `,
        allowHTML: true
      });
    }
    if (page.name != sponsor_list.sponsor_account && !katsune) {
      let listen_divider = document.createElement("div");
      listen_divider.classList.add("listen-divider");
      profile_header.appendChild(listen_divider);
      create_profile_top_item(profile_header, {
        name: page.name,
        text: scrobbles,
        type: "scrobbles",
        link: `${root}user/${page.name}/library`,
        tooltip: average
      });
      create_profile_top_item(profile_header, {
        name: page.name,
        text: artists,
        type: "artists",
        link: `${root}user/${page.name}/library/artists`
      });
      create_profile_top_item(profile_header, {
        name: page.name,
        text: loved,
        type: "loved",
        link: `${root}user/${page.name}/loved`
      });
      if (!is_own_profile) {
        create_profile_top_item(profile_header, {
          name: page.name,
          type: "taste",
          link: `${root}user/${page.name}/library/artists?date_preset=LAST_30_DAYS&page=1`,
          taste,
          artists: taste_artists,
          avi: profile_avi,
          percent: taste_percentage,
          tooltip: `
                    <span>
                        ${trans_legacy[lang].profile.taste}
                        <!--<div class="taste-badge spacing">
                            <span>${trans_legacy[lang].profile.taste_meter.level[taste]}</span>
                            <span>${taste_percentage}</span>
                        </div>-->
                    </span>
                    <div class="hint">${trans_legacy[lang].settings.right_click}</div>
                `,
          allow_html: true,
          tooltip_theme: "stack"
        });
      }
    }
    if (katsune) {
      page.structure.container.querySelector(".redesigned-profile-header").after(profile_header);
    } else {
      if (ff("refreshed_nav"))
        page.structure.container.querySelector(".redesigned-profile-header .info-side").appendChild(profile_header);
      else
        base_header.appendChild(profile_header);
    }
  }
  function create_profile_top_item(parent, { name, link, text = "", type, taste = "", artists = [], avi = "", percent = "", action = "", tooltip = "", allow_html = false, tooltip_theme = "", full = false, primary = false, katsune = false }) {
    log(`creating top item of ${name}, ${link}, ${text}`, "profile");
    let listen_item = document.createElement(action != "button" ? "a" : "button");
    listen_item.classList.add("btn", "profile-top-item", `profile-top-item--${type}`, "view-item");
    if (action != "button" && type != "going" && type != "maybe" && type != "total") {
      listen_item.setAttribute("href", link);
    } else if (type != "going" && type != "maybe" && type != "total") {
      listen_item.setAttribute("onclick", link);
    }
    if (primary)
      listen_item.classList.add("primary");
    if (type != "taste") {
      text = text.toLocaleString(lang);
      listen_item.innerHTML = text;
    } else {
      listen_item.setAttribute("data-taste", taste);
      listen_item.style.setProperty("--data-taste-percent", percent);
      listen_item.innerHTML = `
            <img class="view-item-avatar" src="${avi}" alt="${name}">
            <img class="view-item-avatar" src="${auth.avatar}" alt="${auth.name}">
            <!--<div class="taste-badge">${trans_legacy[lang].profile.taste_meter.level[taste]}</div>-->
            <div class="taste-badge">${percent}</div>
            ${artists.length == 1 ? trans_legacy[lang].profile.taste_meter.you_share_1.replace("{artist}", artists[0]) : ""}
            ${artists.length == 2 ? trans_legacy[lang].profile.taste_meter.you_share_2.replace("{artist1}", artists[0]).replace("{artist2}", artists[1]) : ""}
            ${artists.length == 3 ? trans_legacy[lang].profile.taste_meter.you_share_3.replace("{artist1}", artists[0]).replace("{artist2}", artists[1]).replace("{artist3}", artists[2]) : ""}
        `;
    }
    if (katsune) {
      full = true;
      listen_item.classList.add("icon");
    }
    if (full) {
      listen_item.classList.add("profile-top-item-full");
      listen_item.textContent = trans_legacy[lang].profile[type];
    }
    parent.appendChild(listen_item);
    if (type == "shortcut") {
      if (name == settings.profile_shortcut) {
        listen_item.setAttribute("data-is-shortcut", "true");
        listen_item.removeAttribute("onclick");
        if (katsune)
          listen_item.textContent = trans_legacy[lang].profile.shortcut.remove;
        else
          tippy(listen_item, {
            content: trans_legacy[lang].profile.shortcut.remove
          });
      } else {
        listen_item.setAttribute("data-is-shortcut", "false");
        if (katsune)
          listen_item.textContent = trans_legacy[lang].profile.shortcut.add;
        else
          tippy(listen_item, {
            content: trans_legacy[lang].profile.shortcut.add
          });
      }
      let menu = tippy(listen_item, {
        theme: "context-menu",
        content: `
                <button class="dropdown-menu-clickable-item" onclick="_open_profile_shortcut_window()" data-menu-item="settings">
                    ${trans_legacy[lang].settings.configure}
                </button>
            `,
        allowHTML: true,
        placement: "right-start",
        trigger: "manual",
        interactive: true,
        interactiveBorder: 10,
        offset: [0, 0],
        onShow(instance) {
          instance.popper.addEventListener("click", (event2) => {
            instance.hide();
          });
        }
      });
      register_menu(listen_item, menu);
      return;
    }
    if (type == "taste" && artists.length >= 1) {
      let menu = tippy(listen_item, {
        theme: "context-menu",
        content: `
                <h4 class="menu-header">${trans_legacy[lang].music.compare.header}</h4>
                <a class="dropdown-menu-clickable-item" href="${root}user/${name}/library/music/${sanitise(artists[0])}" data-menu-item="shared-artist">
                    <img class="view-item-avatar" src="${avi}" alt="${name}">${artists[0]}
                </a>
                <a class="dropdown-menu-clickable-item" href="${root}user/${auth.name}/library/music/${sanitise(artists[0])}" data-menu-item="shared-artist">
                    <img class="view-item-avatar" src="${auth.avatar}" alt="${auth.name}">${artists[0]}
                </a>
                ${artists.length >= 2 ? `
                <div class="sep"></div>
                <a class="dropdown-menu-clickable-item" href="${root}user/${name}/library/music/${sanitise(artists[1])}" data-menu-item="shared-artist">
                    <img class="view-item-avatar" src="${avi}" alt="${name}">${artists[1]}
                </a>
                <a class="dropdown-menu-clickable-item" href="${root}user/${auth.name}/library/music/${sanitise(artists[1])}" data-menu-item="shared-artist">
                    <img class="view-item-avatar" src="${auth.avatar}" alt="${auth.name}">${artists[1]}
                </a>
                ` : ""}
                ${artists.length >= 3 ? `
                <div class="sep"></div>
                <a class="dropdown-menu-clickable-item" href="${root}user/${name}/library/music/${sanitise(artists[2])}" data-menu-item="shared-artist">
                    <img class="view-item-avatar" src="${avi}" alt="${name}">${artists[2]}
                </a>
                <a class="dropdown-menu-clickable-item" href="${root}user/${auth.name}/library/music/${sanitise(artists[2])}" data-menu-item="shared-artist">
                    <img class="view-item-avatar" src="${auth.avatar}" alt="${auth.name}">${artists[2]}
                </a>
                ` : ""}
            `,
        allowHTML: true,
        placement: "right-start",
        trigger: "manual",
        interactive: true,
        interactiveBorder: 10,
        offset: [0, 0]
      });
      register_menu(listen_item, menu);
    }
    if (katsune)
      return;
    if (tooltip == "")
      tippy(listen_item, {
        content: trans_legacy[lang].profile[type]
      });
    else
      tippy(listen_item, {
        content: tooltip,
        allowHTML: allow_html,
        theme: tooltip_theme
      });
  }

  // src/pages/obsession.js
  function patch_obsession_view() {
    let obsession_container = document.querySelector(".obsession-container");
    if (!obsession_container)
      return;
    let page_content = obsession_container.querySelector(".page-content");
    page_content.classList.add("obsession-content", "ignore-katsune");
    let obsession_author = document.querySelector(".obsession-details-intro a").textContent;
    let obsession_avatar = document.querySelector(".obsession-details-intro-avatar-wrap .avatar");
    patch_avatar(obsession_avatar, obsession_author);
    let obsession_reason = document.querySelector(".obsession-reason");
    if (!obsession_reason)
      return;
    let obsession_reason_text = obsession_reason.textContent;
    obsession_reason.textContent = obsession_reason_text.trim().substr(1).slice(0, -1);
  }

  // src/pages/profile.js
  function bleh_profiles() {
    if (page.subpage == "obsessions_obsession") {
      patch_obsession_view();
      return;
    }
    let profile_header = document.body.querySelector(".header--user");
    if (!profile_header)
      return;
    page.name = profile_header.querySelector(".header-title a").textContent;
    let is_subpage = page.subpage != "overview";
    page.structure.container = document.body.querySelector(".page-content:not(.profile-cards-container, .report-box-container .page-content)");
    try {
      page.structure.row = page.structure.container.querySelector(".row:not(._buffer)");
      page.structure.main = page.structure.row.querySelector(".col-main");
      page.structure.side = page.structure.row.querySelector(".col-sidebar");
    } catch (e) {
      log("unable to find elements", "page structure");
    }
    checkup_page_structure(is_subpage, profile_header);
    let new_account = false;
    let katsune = ff("katsune");
    if (ff("refreshed_nav")) {
      let avatar = profile_header.querySelector(".avatar");
      let title_wrap = profile_header.querySelector(".header-title-label-wrap");
      let sub_wrap = profile_header.querySelector(".header-title-secondary");
      if (avatar == null) {
        avatar = profile_header.querySelector(".header-avatar-add");
        new_account = true;
      }
      if (cute.includes(page.name)) {
        title_wrap.querySelector(".header-title a").classList.add("bleh--name-is-cute");
      }
      let scrobbles = 0;
      let average = 0;
      let artists = 0;
      let loved = 0;
      if (katsune) {
        let metadata = profile_header.querySelectorAll(".header-metadata-display");
        metadata.forEach((item, index) => {
          if (index == 0) {
            let para = item.querySelector("p");
            scrobbles = clean_number(para.textContent.trim()).toLocaleString(lang);
            average = para.getAttribute("title");
          } else if (index == 1) {
            artists = clean_number(item.textContent.trim()).toLocaleString(lang);
          } else if (index == 2) {
            loved = clean_number(item.textContent.trim()).toLocaleString(lang);
          }
        });
      }
      let redesigned_profile_header = document.createElement("section");
      redesigned_profile_header.classList.add("redesigned-header", "redesigned-profile-header", "no-background");
      redesigned_profile_header.innerHTML = `
            <div class="avatar-side">
                ${avatar.innerHTML}
            </div>
            <div class="info-side">
                <div class="sub-text">${trans_legacy[lang].profile.name}</div>
                ${title_wrap != null ? `<div class="title-container">${title_wrap.innerHTML}</div>` : ""}
                ${sub_wrap != null ? sub_wrap.outerHTML : ""}
            </div>
            ${katsune ? `
            ${!is_subpage ? `
            <div class="stat-side glacier-library-top">
                <div class="glacier-library-metadata">
                    <div class="glacier-library-metadata-item">
                        <div class="sub-text">${trans_legacy[lang].profile.scrobbles}</div>
                        <div class="glacier-library-metadata-item-value" id="scrobbles_tooltip">${scrobbles}</div>
                    </div>
                    <div class="glacier-library-metadata-item">
                        <div class="sub-text">${trans_legacy[lang].profile.artists}</div>
                        <div class="glacier-library-metadata-item-value">${artists}</div>
                    </div>
                    <div class="glacier-library-metadata-item">
                        <div class="sub-text">${trans_legacy[lang].profile.loved}</div>
                        <div class="glacier-library-metadata-item-value">${loved}</div>
                    </div>
                </div>
            </div>
            ` : ""}
            <div class="expand-side">
                <button class="header-expand-button icon" onclick="_toggle_profile_header(this)" aria-expanded="${settings.profile_header_expand}">${trans_legacy[lang].gallery.open.name}</button>
            </div>
            ` : ""}
        `;
      tippy(redesigned_profile_header.querySelector("#scrobbles_tooltip"), {
        content: average
      });
      let is_staff = title_wrap.querySelector(".user-status-staff") != null;
      if (is_staff) {
        redesigned_profile_header.classList.add("staff-profile");
      }
      if (page.name == auth.name && !settings.profile_header_own) {
        register_background(null, "hidden");
      } else if (page.name != auth.name && !settings.profile_header_others) {
        register_background(null, "hidden");
      } else {
        if (settings.profile_avi_background) {
          if (avatar != null)
            register_background(avatar.querySelector("img").getAttribute("src").replace("/avatar170s/", "/ar0/"), "avatar");
          else
            register_background(null, "none");
        } else {
          let background = document.body.querySelector(".header-background--has-image");
          if (background != null)
            register_background(background.style.getPropertyValue("background-image").replace('url("', "").replace('")', ""), "artist");
          else
            register_background(null, "none");
        }
      }
      page.structure.container.insertBefore(redesigned_profile_header, page.structure.container.firstElementChild);
      profile_header.classList.add("legacy-header");
      let header_avatar;
      if (ff("refreshed_nav"))
        header_avatar = page.structure.container.querySelector(".redesigned-profile-header .avatar-side");
      else
        header_avatar = document.querySelector(".header-avatar .avatar");
      if (!new_account) {
        let src = header_avatar.querySelector("img").getAttribute("src");
        let avatar_link = document.createElement("a");
        avatar_link.classList.add("bleh--avatar-clickable-link");
        avatar_link.setAttribute("onclick", `_expand_avatar('${src.replace("avatar170s", "ar0")}')`);
        header_avatar.appendChild(avatar_link);
      }
    }
    let current_year = (/* @__PURE__ */ new Date()).getFullYear();
    if (current_year < 2025 && ff("glacier_library")) {
      let tab = page.structure.nav.querySelector(".secondary-nav-item--library a");
      let beta = document.createElement("span");
      beta.classList.add("new-badge", "beta-badge");
      beta.textContent = trans_legacy[lang].settings.new;
      tab.appendChild(beta);
    }
    let library_tab = page.structure.nav.querySelector(".secondary-nav-item--library a");
    library_tab.textContent = trans_legacy[lang].auth_menu.library;
    let is_own_profile = page.name == auth.name;
    if (is_own_profile)
      profile_header.setAttribute("data-is-own-profile", "true");
    if (!is_subpage) {
      let is_following = false;
      if (profile_header.querySelector(".label.user-follow"))
        is_following = true;
      if (ff("redesigned_profile_header"))
        redesign_profile_header(is_own_profile, is_following);
      profile_recents();
      profile_artists();
      profile_albums();
      profile_tracks();
      if (is_own_profile && settings.activities) {
        let recent_activity_section = document.createElement("section");
        recent_activity_section.classList.add("recent-activity-section");
        recent_activity_section.innerHTML = `
                <h2>${trans_legacy[lang].activities.name}</h2>
            `;
        load_activities();
        let recent_activity_list_r = recent_activity_list;
        recent_activity_list_r.reverse();
        recent_activity_list_r.forEach((activity) => {
          let activity_item = document.createElement("a");
          activity_item.classList.add("activity-item", `activity--${activity.type}`);
          activity_item.setAttribute("href", activity.context);
          let involved_text = "";
          let tooltip_name;
          let tooltip_sister;
          activity.involved.forEach((involved) => {
            let involved_link;
            if (involved.type == "user")
              involved_link = `${root}user/${involved.name}`;
            else if (involved.type == "artist")
              involved_link = `${root}music/${sanitise(involved.name)}`;
            else if (involved.type == "album")
              involved_link = `${root}music/${sanitise(involved.sister)}/${sanitise(involved.name)}`;
            else if (involved.type == "track")
              involved_link = `${root}music/${sanitise(involved.sister)}/_/${sanitise(involved.name)}`;
            else if (involved.type == "tag")
              involved_link = `${root}tag/${sanitise(involved.name)}`;
            else if (involved.type == "bwaa")
              involved_link = `${root}bwaa`;
            else if (involved.type == "bleh")
              involved_link = `${root}bleh`;
            if (involved.type != "artist" && involved.type != "user" && involved.type != "tag" && involved.type != "bwaa" && involved.type != "bleh") {
              tooltip_name = involved.name;
              tooltip_sister = involved.sister;
            }
            if (involved_text != "")
              involved_text = `${involved_text}, <a class="involved--${involved.type}" href="${involved_link}">${involved.name}</a>`;
            else
              involved_text = `${involved_text}<a class="involved--${involved.type}" href="${involved_link}">${involved.name}</a>`;
          });
          activity_item.innerHTML = `
                    <div class="type">${trans_legacy[lang].activities[activity.type]}<div class="date">${moment(activity.date).fromNow(true)}</div></div>
                    <div class="title">${involved_text}</div>
                `;
          recent_activity_section.appendChild(activity_item);
          if (tooltip_name != void 0)
            tippy(activity_item.querySelector(".title a"), {
              content: `${tooltip_sister} - ${tooltip_name}`
            });
          let reports = page.structure.side.querySelector(".promo-v3");
          if (reports)
            reports.after(recent_activity_section);
        });
      }
      if (page.name == sponsor_list.sponsor_account && !is_own_profile) {
        page.structure.container.removeChild(page.structure.nav);
        page.structure.main.innerHTML = "";
        page.structure.side.innerHTML = "";
        let alert = document.createElement("div");
        alert.classList.add("alert", "alert-info");
        alert.textContent = "This is a special bleh account used for managing sponsors.";
        page.structure.container.appendChild(alert);
      }
      let featured_track_panel = profile_header.querySelector(".header-featured-track");
      if (featured_track_panel != null)
        bleh_featured_profile_track(featured_track_panel);
    } else {
      load_banner_from_cache();
      let btn_add = page.structure.side.querySelector(".add-button");
      if (btn_add != null)
        btn_add.setAttribute("data-page-subpage", page.subpage);
      if (page.subpage.startsWith("library")) {
        bleh_user_library();
      } else if (page.subpage == "events") {
        let selected_tab = page.structure.content_top.querySelector(".secondary-nav-item-link--active");
        let value_panel = document.createElement("section");
        value_panel.classList.add("value-panel");
        value_panel.innerHTML = `
                <h2 class="text-18">${selected_tab != null ? selected_tab.textContent : trans_legacy[lang].profile.events}</h2>
            `;
        let values = page.structure.main.querySelectorAll(".metadata-display");
        let value_header = document.createElement("div");
        value_header.classList.add("event-value-top-header", "view-buttons");
        values.forEach((value, index) => {
          let type = "going";
          if (index == 1)
            type = "maybe";
          create_profile_top_item(value_header, {
            name: page.name,
            text: value.textContent,
            type,
            tooltip: trans_legacy[lang].event[type].replace("{c}", value.textContent)
          });
        });
        value_panel.appendChild(value_header);
        let total_value = page.structure.side.querySelector(".metadata-display");
        if (total_value != null) {
          let total_text = document.createElement("h2");
          total_text.classList.add("text-18");
          total_text.textContent = trans_legacy[lang].event.all_time;
          value_panel.appendChild(total_text);
          let total_header = document.createElement("div");
          total_header.classList.add("event-value-top-header", "view-buttons");
          create_profile_top_item(total_header, {
            name: page.name,
            text: total_value.textContent,
            type: "total",
            tooltip: trans_legacy[lang].event.total.replace("{c}", total_value.textContent)
          });
          value_panel.appendChild(total_header);
        }
        let legacy_metadata = page.structure.main.querySelector(".metadata-list");
        if (legacy_metadata)
          page.structure.main.removeChild(legacy_metadata);
        page.structure.side.innerHTML = "";
        page.structure.side.appendChild(value_panel);
      } else if (page.subpage.startsWith("listening-report")) {
        document.documentElement.setAttribute("data-bleh--theme", "oled");
        page.structure.content_top.classList.add("listening-report-navlist");
        let report_box_container = document.body.querySelector(".report-box-container--overview");
        if (report_box_container != null) {
          if (report_box_container != null)
            page.structure.content_top.after(report_box_container);
        } else {
          let dashboard = page.structure.container.querySelector(".user-dashboard");
          if (dashboard == null)
            return;
          dialog({
            id: "listening_report_v2",
            title: "Listening reports v2",
            body: `
                        <div class="alert alert-error">Unfortunately, legacy listening reports are not yet supported in bleh3.</div>
                        <br>
                        <p>To view this page properly it's recommended to temporarily disable bleh :3</p>
                        <p>Don't worry, they will be looked at eventually. Sorry for the inconvenience !!</p>
                    `
          });
          return;
        }
      } else if (page.subpage == "obsessions_overview") {
        let section_controls = page.structure.container.querySelector(".section-controls");
        let buttons;
        if (section_controls != null) {
          section_controls.classList.add("legacy-section-controls");
          buttons = section_controls.querySelectorAll(":is(button, a)");
          let header = page.structure.container.querySelector(".content-top-header");
          page.structure.content_top.innerHTML = `
                    <div class="content-top-inner-wrap">
                        <div class="container content-top-lower">
                            <h1 class="content-top-header">${header.textContent.trim()}</h1>
                        </div>
                    </div>
                `;
        }
        let new_panel = document.createElement("section");
        new_panel.classList.add("obsessions-panel");
        let wrap = document.createElement("div");
        wrap.classList.add("view-buttons-wrapper");
        let button_header = document.createElement("div");
        button_header.classList.add("view-buttons", "obsession-buttons");
        buttons.forEach((button) => {
          if (button.classList.contains("btn-sm")) {
            button.classList = [];
            button.classList.add("obsession-btn");
            tippy(button, {
              content: button.textContent
            });
            button.textContent = trans_legacy[lang].music.obsession;
          }
          button.classList.add("btn", "view-item", "interact-item", "obsession-top-item");
          button_header.appendChild(button);
        });
        wrap.appendChild(button_header);
        new_panel.appendChild(wrap);
        page.structure.main.appendChild(new_panel);
        let grid = document.createElement("ol");
        grid.classList.add("grid-items", "grid-items--numbered", "obsessions-grid");
        let items = page.structure.container.querySelectorAll(".obsession-history-item");
        items.forEach((item) => {
          let bg = item.querySelector(".obsession-history-item-background").style.getPropertyValue("background-image").trim();
          let cover_substr = bg.indexOf("url");
          let cover = bg.substring(cover_substr).replace('url("', "").replace('")', "").trim();
          let link = item.querySelector(".obsession-history-item-heading-link");
          let artist = item.querySelector(".obsession-history-item-artist a");
          let artist_link = artist.getAttribute("href");
          artist = artist.textContent.trim();
          let title = link.textContent.trim();
          link = link.getAttribute("href");
          let date = item.querySelector(".obsession-history-item-date").textContent.trim();
          let obsession_is_first = item.querySelector(".obsession-first") != null;
          let grid_item = document.createElement("li");
          grid_item.classList.add("grid-items-item", "obsessions-item");
          grid_item.innerHTML = `
                    <div class="grid-items-cover-image">
                        <div class="grid-items-cover-image-image ${cover.endsWith("4128a6eb29f94943c9d206c08e625904.jpg") ? "grid-items-cover-default" : ""}">
                            <img src="${cover}" alt="${title}" loading="lazy">
                        </div>
                        <div class="grid-items-item-details">
                            <p class="grid-items-item-main-text">
                                <a class="link-block-target" href="${link}" title="${title}">
                                    ${title}
                                </a>
                            </p>
                            <p class="grid-items-item-aux-text obsessions-item-aux">
                                <a class="grid-items-item-aux-block" href="${artist_link}">
                                    ${artist}
                                </a>
                                <a class="obsessions-item-date" href="${link}">
                                    ${date}
                                </a>
                            </p>
                        </div>
                        <a class="link-block-cover-link" href="${link}" tabindex="-1" aria-hidden="true"></a>
                    </div>
                    ${obsession_is_first ? `<div class="new-badge first-obsession">#1</div>` : ""}
                `;
          if (obsession_is_first) {
            tippy(grid_item, {
              content: trans_legacy[lang].music.obsession_first
            });
          }
          grid.appendChild(grid_item);
        });
        new_panel.appendChild(grid);
        let no_data = page.structure.container.querySelector(".no-data-message--obsession-history");
        if (no_data != null) {
          wrap.after(no_data);
        }
      }
    }
    log("status is", "page", "info", page);
    update_page();
    patch_profile_following();
    let profile_notes = JSON.parse(localStorage.getItem("bleh_profile_notes")) || {};
    let profile_note = profile_notes[page.name];
    let profile_has_note = false;
    if (profile_note != void 0)
      profile_has_note = true;
    log(`querying badges for ${page.name}`, "profile");
    let profile_name_obj;
    if (ff("refreshed_nav"))
      profile_name_obj = page.structure.container.querySelector(".redesigned-profile-header .title-container");
    else
      profile_name_obj = profile_header.querySelector(".header-title-label-wrap");
    if (ff("badges")) {
      let stock_badges = profile_name_obj.querySelectorAll(".label");
      stock_badges.forEach((badge) => {
        if (badge.classList[1] == "user-status-None")
          return;
        badge.classList.add("no-hover");
        tippy(badge, {
          theme: "badge",
          placement: "bottom",
          content: `
                    <div class="badge-name">${badge.textContent}</div>
                    <div class="badge-reason">${tl(trans.badges[badge.classList[1]].reason)}</div>
                `,
          allowHTML: true
        });
      });
    }
    let badges = load_badges(page.name);
    if (badges) {
      badges.forEach((this_badge) => {
        let badge = document.createElement("span");
        badge.classList.add("label", `user-status--bleh-${this_badge.type}`, `user-status--bleh-user-${page.name}`);
        badge.textContent = this_badge.name;
        profile_name_obj.appendChild(badge);
        if (ff("badges")) {
          badge.classList.add("no-hover");
          tippy(badge, {
            theme: "badge",
            placement: "bottom",
            content: `
                        <div class="badge-name">${this_badge.name}</div>
                        <div class="badge-reason">${tl(trans.badges[this_badge.reason].reason)}</div>
                    `,
            allowHTML: true
          });
        }
        if (this_badge.type == "sponsor")
          badge.setAttribute("onclick", "_sponsor()");
      });
    }
    let profile_sub_text;
    if (ff("refreshed_nav"))
      profile_sub_text = page.structure.container.querySelector(".redesigned-profile-header .header-title-secondary");
    else
      profile_sub_text = document.body.querySelector(".header-title-secondary");
    if (profile_sub_text == null)
      return;
    let display_name = profile_sub_text.querySelector(".header-title-display-name");
    let scrobble_since = profile_sub_text.querySelector(".header-scrobble-since");
    scrobble_since.textContent = scrobble_since.textContent.replace(trans_legacy[lang].profile.created.replace, "");
    let pronouns = use_pronouns(display_name.textContent);
    let display_name_pre = document.createElement("span");
    display_name_pre.classList.add("header-title-secondary--pre");
    display_name_pre.textContent = pronouns ? trans_legacy[lang].profile.display_name.pronouns : trans_legacy[lang].profile.display_name.aka;
    profile_sub_text.insertBefore(display_name_pre, display_name);
    let scrobble_since_pre = document.createElement("span");
    scrobble_since_pre.classList.add("header-title-secondary--pre");
    scrobble_since_pre.textContent = trans_legacy[lang].profile.created.name;
    profile_sub_text.insertBefore(scrobble_since_pre, scrobble_since);
    let about_me_sidebar = document.body.querySelector(".about-me-sidebar");
    if (!about_me_sidebar) {
      if (settings.bio_markdown)
        save_banner_to_cache("none");
      return;
    }
    if (!about_me_sidebar.hasAttribute("data-kate-processed")) {
      about_me_sidebar.setAttribute("data-kate-processed", "true");
      if (settings.bio_markdown) {
        let about_me_text = about_me_sidebar.querySelector("p");
        let result = bio_parse(about_me_text, true);
        about_me_text.innerHTML = result;
      }
      let buttons = document.createElement("div");
      buttons.classList.add("user-about-buttons");
      if (!profile_has_note) {
        let add_note_button = document.createElement("button");
        add_note_button.classList.add("btn", "icon");
        add_note_button.setAttribute("data-action-type", "note");
        add_note_button.setAttribute("id", "bleh--add-note");
        add_note_button.textContent = trans_legacy[lang].settings.profiles.notes.edit_user.replace("{u}", page.name);
        add_note_button.setAttribute("onclick", `_add_profile_note('${page.name}',${profile_has_note})`);
        tippy(add_note_button, {
          content: trans_legacy[lang].settings.profiles.notes.edit_user.replace("{u}", page.name)
        });
        buttons.appendChild(add_note_button);
      } else {
        create_profile_note_panel(page.name, true);
      }
      let about_more = document.createElement("button");
      about_more.classList.add("btn", "icon");
      about_more.setAttribute("data-action-type", "configure");
      about_more.textContent = trans_legacy[lang].settings.configure;
      tippy(about_more, {
        content: trans_legacy[lang].settings.configure
      });
      tippy(about_more, {
        theme: "window",
        content: `
                <div class="dialog-settings">
                    <h4>${trans_legacy[lang].settings.text.markdown.name}</h4>
                    <div class="toggle-container" id="container-bio_markdown" onclick="_update_item('bio_markdown')">
                        <button class="btn reset" onclick="_reset_item('bio_markdown')">${trans_legacy[lang].settings.reset}</button>
                        <div class="heading">
                            <h5>${trans_legacy[lang].settings.text.markdown.profile}</h5>
                        </div>
                        <div class="toggle-wrap">
                            <button class="toggle" id="toggle-bio_markdown" aria-checked="false">
                                <div class="dot"></div>
                            </button>
                        </div>
                    </div>
                </div>
            `,
        allowHTML: true,
        placement: "bottom",
        interactive: true,
        interactiveBorder: 10,
        trigger: "click",
        onShow(instance) {
          refresh_all(instance.popper);
        }
      });
      buttons.appendChild(about_more);
      let about_me_header = about_me_sidebar.querySelector("h2");
      about_me_header.appendChild(buttons);
    }
  }
  unsafeWindow._add_profile_note = function(username, has_note) {
    add_profile_note(username, has_note);
  };
  function add_profile_note(username, has_note) {
    document.getElementById("bleh--add-note").style.setProperty("display", "none");
    create_profile_note_panel(username, has_note);
  }
  function create_profile_note_panel(username, has_note) {
    let note_panel = document.createElement("section");
    note_panel.classList.add("bleh--panel", "bleh--profile-note-panel");
    if (has_note) {
      note_panel.innerHTML = `
        <h2>${trans_legacy[lang].settings.profiles.notes.header}</h2>
        <div class="content-form">
            <textarea id="bleh--profile-note" placeholder="${trans_legacy[lang].settings.profiles.notes.placeholder}">${JSON.parse(localStorage.getItem("bleh_profile_notes"))[username]}</textarea>
        </div>
        <div class="actions">
            <button class="btn" onclick="_clear_profile_note('${username}')">${trans_legacy[lang].settings.clear}</button>
            <button class="btn primary" onclick="_save_profile_note('${username}')">${trans_legacy[lang].settings.save}</button>
        </div>
        `;
    } else {
      note_panel.innerHTML = `
        <h2>Your notes</h2>
        <div class="content-form">
            <textarea id="bleh--profile-note" placeholder="${trans_legacy[lang].settings.profiles.notes.placeholder}"></textarea>
        </div>
        <div class="actions">
            <button class="btn" onclick="_clear_profile_note('${username}')">${trans_legacy[lang].settings.clear}</button>
            <button class="btn primary" onclick="_save_profile_note('${username}')">${trans_legacy[lang].settings.save}</button>
        </div>
        `;
    }
    let about_me_sidebar = document.body.querySelector(".about-me-sidebar");
    about_me_sidebar.after(note_panel);
  }
  unsafeWindow._clear_profile_note = function(username) {
    let profile_notes = JSON.parse(localStorage.getItem("bleh_profile_notes")) || {};
    delete profile_notes[username];
    document.getElementById("bleh--profile-note").value = "";
    localStorage.setItem("bleh_profile_notes", JSON.stringify(profile_notes));
  };
  unsafeWindow._save_profile_note = function(username) {
    save_profile_note(username);
  };
  function save_profile_note(username) {
    let profile_notes = JSON.parse(localStorage.getItem("bleh_profile_notes")) || {};
    profile_notes[username] = document.getElementById("bleh--profile-note").value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    localStorage.setItem("bleh_profile_notes", JSON.stringify(profile_notes));
  }
  function patch_profile_following() {
    let following_tab = page.structure.nav.querySelector(".secondary-nav-item--following");
    let following_tab_html = following_tab.outerHTML;
    if (following_tab == void 0)
      return;
    if (following_tab.hasAttribute("data-kate-processed"))
      return;
    following_tab.setAttribute("data-kate-processed", "true");
    following_tab.querySelector("a").textContent = trans_legacy[lang].profile.friends.name;
    if (page.subpage != "following" && page.subpage != "followers" && page.subpage != "neighbours")
      return;
    let followers_tab = page.structure.nav.querySelector(".secondary-nav-item--followers");
    let followers_tab_html = followers_tab.outerHTML;
    let neighbours_tab = page.structure.nav.querySelector(".secondary-nav-item--neighbours");
    let neighbours_tab_html = neighbours_tab.outerHTML;
    let tab = void 0;
    if (page.subpage == "followers")
      tab = followers_tab;
    else if (page.subpage == "following")
      tab = following_tab;
    else
      tab = neighbours_tab;
    tab.querySelector("a").textContent = trans_legacy[lang].profile.friends.name;
    let follow_nav = document.createElement("div");
    follow_nav.classList.add("bleh--nav-wrap", "bleh--friends-nav");
    follow_nav.innerHTML = `
        <nav class="navlist secondary-nav redesigned-navigation">
            <ul class="navlist-items bleh--navlist-items">
                ${following_tab_html}
                ${followers_tab_html}
                ${neighbours_tab_html}
            </ul>
        </nav>
    `;
    page.structure.content_top.after(follow_nav);
    page.structure.row.classList.add("col-main-is-primary");
    if (ff("katsune") && page.subpage != "neighbours") {
      let count_text = page.structure.content_top.querySelector("h1").textContent.trim();
      let chr = count_text.indexOf("(");
      let count = 0;
      if (chr != -1)
        count = count_text.substring(chr).replace("(", "").replace(")", "");
      let count_badge = document.createElement("div");
      count_badge.classList.add("new-badge", "count-badge");
      count_badge.textContent = count;
      follow_nav.querySelector(".secondary-nav-item-link--active").appendChild(count_badge);
    }
    let view_buttons = document.createElement("div");
    view_buttons.classList.add("view-buttons-wrapper");
    view_buttons.innerHTML = `
        <div class="view-buttons">
            <button class="btn view-item" id="toggle-list_view-1" data-toggle="list_view" data-toggle-value="1" onclick="_update_item('list_view', 1)">
                ${trans_legacy[lang].glacier.view.grid}
            </button>
            <button class="btn view-item" id="toggle-list_view-0" data-toggle="list_view" data-toggle-value="0" onclick="_update_item('list_view', 0)">
                ${trans_legacy[lang].glacier.view.list}
            </button>
        </div>
    `;
    page.structure.main.insertBefore(view_buttons, page.structure.main.firstElementChild);
    refresh_all();
    let users = page.structure.main.querySelectorAll(".user-list-inner-wrap");
    users.forEach((user) => {
      let avatar = user.querySelector(".user-list-avatar");
      let name = user.querySelector(".user-list-link").textContent;
      let badge = patch_avatar(avatar, name, "follow");
      if (badge.type == "avatar-status-dot--staff")
        user.classList.add("staff-user");
    });
  }
  unsafeWindow._refresh_tracks = function(button) {
    refresh_tracks(button);
  };
  function refresh_tracks(button) {
    let panel = page.structure.main.querySelector("#recent-tracks-section");
    panel.classList.remove("has-refreshed");
    button.setAttribute("disabled", "");
    fetch(`${root}user/${page.name}/partial/recenttracks?ajax=1`).then(function(response) {
      console.log("returned", response, response.text);
      return response.text();
    }).then(function(html) {
      let doc = new DOMParser().parseFromString(html, "text/html");
      console.log("DOC", doc);
      let tracklist_panel = doc.querySelector(".chartlist");
      button.removeAttribute("disabled");
      if (!tracklist_panel) {
        notify({
          title: "Recent tracks failed to load",
          icon: "icon-16-refresh",
          type: "error"
        });
        return;
      }
      notify({
        title: "Recent tracks refreshed",
        icon: "icon-16-refresh"
      });
      panel.classList.add("has-refreshed");
      page.structure.main.querySelector("#recent-tracks-section .chartlist").outerHTML = tracklist_panel.outerHTML;
    });
  }
  function bleh_featured_profile_track(object) {
    let art = object.querySelector(".featured-item-art");
    let details = object.querySelector(".featured-item-details");
    let form = document.body.querySelector(".header-info-primary form");
    let heading = details.querySelector(".featured-item-heading");
    let heading_link = heading.outerHTML;
    details.removeChild(heading);
    if (settings.corrections) {
      let name_elem = object.querySelector(".featured-item-name");
      let artist_elem = object.querySelector(".featured-item-artist");
      let name = correct_item_by_artist(name_elem.textContent.trim(), artist_elem.textContent.trim());
      let artist = correct_artist(artist_elem.textContent.trim());
      name_elem.textContent = name;
      artist_elem.textContent = artist;
    }
    if (form) {
      let button = form.querySelector("button");
      button.classList = "featured-item-manage";
      button.textContent = trans_legacy[lang].settings.remove;
    }
    let panel = document.createElement("section");
    panel.classList.add("featured-item-panel");
    panel.innerHTML = `
        <div class="sub-text">${heading_link}${form != null ? form.outerHTML : ""}</div>
        <div class="track-template">
            ${art.outerHTML}
            ${details.outerHTML}
        </div>
    `;
    let about_me = page.structure.side.querySelector(".about-me-sidebar");
    if (about_me != null)
      about_me.after(panel);
    else
      page.structure.side.insertBefore(panel, page.structure.side.firstElementChild);
  }
  function profile_recents() {
    let panel = page.structure.main.querySelector("#recent-tracks-section");
    if (panel == null)
      return;
    let more_link = panel.nextElementSibling;
    panel.appendChild(more_link);
    let form = panel.querySelector("#recent-tracks-settings");
    let link = panel.querySelector('[aria-controls="recent-tracks-settings"]');
    let tooltip;
    let view_buttons = document.createElement("div");
    view_buttons.classList.add("view-buttons");
    let header = document.createElement("div");
    header.classList.add("top-container");
    let header_text2 = panel.querySelector("h2");
    header.appendChild(header_text2);
    let refresh_btn = document.createElement("button");
    refresh_btn.classList.add("btn", "view-item", "interact-item", "refresh-tracklist-btn");
    refresh_btn.textContent = trans_legacy[lang].music.refresh;
    refresh_btn.setAttribute("onclick", "_refresh_tracks(this)");
    tippy(refresh_btn, {
      content: trans_legacy[lang].music.refresh_tracks
    });
    view_buttons.appendChild(refresh_btn);
    header.appendChild(view_buttons);
    panel.insertBefore(header, panel.firstElementChild);
    if (form == null)
      return;
    if (page.token == "")
      page.token = form.querySelector('[name="csrfmiddlewaretoken"]').getAttribute("value");
    let original_chart_settings = {};
    let new_button = document.createElement("button");
    new_button.classList.add("panel-settings-button", "btn", "view-item", "interact-item");
    new_button.textContent = trans_legacy[lang].profile.settings;
    form.classList = "";
    tooltip = tippy(new_button, {
      theme: "window",
      content: form.outerHTML,
      allowHTML: true,
      placement: "bottom",
      interactive: true,
      interactiveBorder: 10,
      trigger: "click",
      onShow(instance) {
        let form2 = instance.popper.querySelector("form");
        form2.innerHTML = `
                <input type="hidden" name="csrfmiddlewaretoken" value="${page.token}">
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.recent.count.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_length_recent_tracks_select">
                        ${original_chart_settings.count}
                    </div>
                </div>
                <div class="toggle-container" id="container-recent_artwork" onclick="_update_inbuilt_item('recent_artwork')">
                    <button class="btn reset" onclick="_reset_inbuilt_item('recent_artwork')">Reset to default</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.recent.artwork.name}</h5>
                    </div>
                    <div class="toggle-wrap">
                        <input class="companion-checkbox" type="checkbox" name="show_recent_tracks_artwork" id="inbuilt-companion-checkbox-recent_artwork">
                        <span class="btn toggle" id="toggle-recent_artwork" aria-checked="false">
                            <div class="dot"></div>
                        </span>
                    </div>
                </div>
                <div class="toggle-container" id="container-recent_realtime" onclick="_update_inbuilt_item('recent_realtime')">
                    <button class="btn reset" onclick="_reset_inbuilt_item('recent_realtime')">Reset to default</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.recent.realtime.name}</h5>
                        <p>${trans_legacy[lang].settings.inbuilt.charts.recent.realtime.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <input class="companion-checkbox" type="checkbox" name="auto_refresh_recent_tracks" id="inbuilt-companion-checkbox-recent_realtime">
                        <span class="btn toggle" id="toggle-recent_realtime" aria-checked="false" type="button">
                            <div class="dot"></div>
                        </span>
                    </div>
                </div>
                <div class="sep"></div>
                <div class="toggle-container" id="container-format_guest_features" onclick="_update_item('format_guest_features')">
                    <button class="btn reset" onclick="_reset_item('format_guest_features')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.format_guest_features.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.format_guest_features.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-format_guest_features" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container hide-if-format-guest-disabled" id="container-show_guest_features" onclick="_update_item('show_guest_features')">
                    <button class="btn reset" onclick="_reset_item('show_guest_features')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.show_guest_features.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.show_guest_features.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-show_guest_features" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-stacked_chartlist_info" onclick="_update_item('stacked_chartlist_info')">
                    <button class="btn reset" onclick="_reset_item('stacked_chartlist_info')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.stacked_chartlist_info.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.stacked_chartlist_info.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-stacked_chartlist_info" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container" id="container-colourful_tracks" onclick="_update_item('colourful_tracks')">
                    <button class="btn reset" onclick="_reset_item('colourful_tracks')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.customise.colourful_tracks.name}</h5>
                        <p>${trans_legacy[lang].settings.customise.colourful_tracks.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-colourful_tracks" aria-checked="true">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="settings-footer">
                    <button type="submit" class="btn-primary save">
                        ${trans_legacy[lang].settings.save}
                    </button>
                    <a class="btn icon settings not-a-view-button" href="${root}bleh">
                        ${trans_legacy[lang].settings.configure}
                    </a>
                </div>
            `;
        custom_select(form2.querySelector("#id_chart_length_recent_tracks"), form2.querySelector("#id_chart_length_recent_tracks_select"));
        let selects = form2.querySelectorAll("select");
        selects.forEach((select) => {
          select.setAttribute("onchange", `_update_inbuilt_select('${select.getAttribute("id")}', this.value)`);
          update_inbuilt_select(select.getAttribute("id"), select.value);
        });
        for (let setting in original_chart_settings) {
          update_inbuilt_item(setting, original_chart_settings[setting], false, form2);
        }
        refresh_all(instance.popper);
      }
    });
    view_buttons.appendChild(new_button);
    original_chart_settings = {
      recent_artwork: form.querySelector("#id_show_recent_tracks_artwork").checked,
      count: form.querySelector("#id_chart_length_recent_tracks").outerHTML,
      recent_realtime: form.querySelector("#id_auto_refresh_recent_tracks").checked
    };
    form.innerHTML = "";
  }
  function profile_artists() {
    let panel = page.structure.main.querySelector("#top-artists");
    if (panel == null)
      return;
    panel.classList.remove("section-with-settings");
    let form = panel.querySelector("#artist-chart-settings");
    let link = panel.querySelector('[aria-controls="artist-chart-settings"]');
    let tooltip;
    let view_buttons = document.createElement("div");
    view_buttons.classList.add("view-buttons");
    let header = document.createElement("div");
    header.classList.add("top-container");
    let header_text2 = panel.querySelector("h2");
    header.appendChild(header_text2);
    let select_btn = panel.querySelector(".dropdown-menu-clickable-button");
    select_btn.classList.add("btn", "view-item", "interact-item");
    select_btn.classList.remove("section-control");
    view_buttons.appendChild(select_btn);
    header.appendChild(view_buttons);
    panel.insertBefore(header, panel.firstElementChild);
    if (form == null)
      return;
    if (page.token == "")
      page.token = form.querySelector('[name="csrfmiddlewaretoken"]').getAttribute("value");
    let original_chart_settings = {};
    let new_button = document.createElement("button");
    new_button.classList.add("panel-settings-button", "btn", "view-item", "interact-item");
    new_button.textContent = trans_legacy[lang].profile.settings;
    form.classList = "";
    tooltip = tippy(new_button, {
      theme: "window",
      content: form.outerHTML,
      allowHTML: true,
      placement: "bottom",
      interactive: true,
      interactiveBorder: 10,
      trigger: "click",
      onShow(instance) {
        let form2 = instance.popper.querySelector("form");
        form2.innerHTML = `
                <input type="hidden" name="csrfmiddlewaretoken" value="${page.token}">
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.artists.timeframe.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_range_top_artists_select">
                        ${original_chart_settings.timeframe}
                    </div>
                </div>
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.artists.style.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_style_top_artists_select">
                        ${original_chart_settings.style}
                    </div>
                </div>
                <div class="select-container hide-if-artist-list">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.artists.length.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_artists_image_grid_length_select">
                        ${original_chart_settings.length}
                    </div>
                </div>
                <div class="select-container hide-if-artist-grid">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.artists.length.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_artists_chartlist_length_select">
                        ${original_chart_settings.length_list}
                    </div>
                </div>
                <div class="settings-footer">
                    <button type="submit" class="btn-primary save">
                        ${trans_legacy[lang].settings.save}
                    </button>
                </div>
            `;
        custom_select(form2.querySelector("#id_chart_range_top_artists"), form2.querySelector("#id_chart_range_top_artists_select"));
        custom_select(form2.querySelector("#id_chart_style_top_artists"), form2.querySelector("#id_chart_style_top_artists_select"));
        custom_select(form2.querySelector("#id_artists_image_grid_length"), form2.querySelector("#id_artists_image_grid_length_select"));
        custom_select(form2.querySelector("#id_artists_chartlist_length"), form2.querySelector("#id_artists_chartlist_length_select"));
        let selects = form2.querySelectorAll("select");
        selects.forEach((select) => {
          select.setAttribute("onchange", `_update_inbuilt_select('${select.getAttribute("id")}', this.value)`);
          update_inbuilt_select(select.getAttribute("id"), select.value);
        });
      }
    });
    view_buttons.appendChild(new_button);
    original_chart_settings = {
      timeframe: form.querySelector("#id_chart_range_top_artists").outerHTML,
      style: form.querySelector("#id_chart_style_top_artists").outerHTML,
      length: form.querySelector("#id_artists_image_grid_length").outerHTML,
      length_list: form.querySelector("#id_artists_chartlist_length").outerHTML
    };
    form.innerHTML = "";
  }
  function profile_albums() {
    let panel = page.structure.main.querySelector("#top-albums");
    if (panel == null)
      return;
    panel.classList.remove("section-with-settings");
    let form = panel.querySelector("#albums-chart-settings");
    let link = panel.querySelector('[aria-controls="albums-chart-settings"]');
    let tooltip;
    let view_buttons = document.createElement("div");
    view_buttons.classList.add("view-buttons");
    let header = document.createElement("div");
    header.classList.add("top-container");
    let header_text2 = panel.querySelector("h2");
    header.appendChild(header_text2);
    let select_btn = panel.querySelector(".dropdown-menu-clickable-button");
    select_btn.classList.add("btn", "view-item", "interact-item");
    select_btn.classList.remove("section-control");
    view_buttons.appendChild(select_btn);
    header.appendChild(view_buttons);
    panel.insertBefore(header, panel.firstElementChild);
    if (form == null)
      return;
    if (page.token == "")
      page.token = form.querySelector('[name="csrfmiddlewaretoken"]').getAttribute("value");
    let original_chart_settings = {};
    let new_button = document.createElement("button");
    new_button.classList.add("panel-settings-button", "btn", "view-item", "interact-item");
    new_button.textContent = trans_legacy[lang].profile.settings;
    form.classList = "";
    tooltip = tippy(new_button, {
      theme: "window",
      content: form.outerHTML,
      allowHTML: true,
      placement: "bottom",
      interactive: true,
      interactiveBorder: 10,
      trigger: "click",
      onShow(instance) {
        let form2 = instance.popper.querySelector("form");
        form2.innerHTML = `
                <input type="hidden" name="csrfmiddlewaretoken" value="${page.token}">
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.albums.timeframe.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_range_top_albums_select">
                        ${original_chart_settings.timeframe}
                    </div>
                </div>
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.albums.style.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_style_top_albums_select">
                        ${original_chart_settings.style}
                    </div>
                </div>
                <div class="select-container hide-if-album-list">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.albums.length.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_albums_image_grid_length_select">
                        ${original_chart_settings.length}
                    </div>
                </div>
                <div class="select-container hide-if-album-grid">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.albums.length.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_albums_chartlist_length_select">
                        ${original_chart_settings.length_list}
                    </div>
                </div>
                <div class="settings-footer">
                    <button type="submit" class="btn-primary save">
                        ${trans_legacy[lang].settings.save}
                    </button>
                </div>
            `;
        custom_select(form2.querySelector("#id_chart_range_top_albums"), form2.querySelector("#id_chart_range_top_albums_select"));
        custom_select(form2.querySelector("#id_chart_style_top_albums"), form2.querySelector("#id_chart_style_top_albums_select"));
        custom_select(form2.querySelector("#id_albums_image_grid_length"), form2.querySelector("#id_albums_image_grid_length_select"));
        custom_select(form2.querySelector("#id_albums_chartlist_length"), form2.querySelector("#id_albums_chartlist_length_select"));
        let selects = form2.querySelectorAll("select");
        selects.forEach((select) => {
          select.setAttribute("onchange", `_update_inbuilt_select('${select.getAttribute("id")}', this.value)`);
          update_inbuilt_select(select.getAttribute("id"), select.value);
        });
      }
    });
    view_buttons.appendChild(new_button);
    original_chart_settings = {
      timeframe: form.querySelector("#id_chart_range_top_albums").outerHTML,
      style: form.querySelector("#id_chart_style_top_albums").outerHTML,
      length: form.querySelector("#id_albums_image_grid_length").outerHTML,
      length_list: form.querySelector("#id_albums_chartlist_length").outerHTML
    };
    form.innerHTML = "";
  }
  function profile_tracks() {
    let panel = page.structure.main.querySelector("#top-tracks");
    if (panel == null)
      return;
    panel.classList.remove("section-with-settings");
    let form = panel.querySelector("#track-chart-settings");
    let link = panel.querySelector('[aria-controls="track-chart-settings"]');
    let tooltip;
    let view_buttons = document.createElement("div");
    view_buttons.classList.add("view-buttons");
    let header = document.createElement("div");
    header.classList.add("top-container");
    let header_text2 = panel.querySelector("h2");
    header.appendChild(header_text2);
    let select_btn = panel.querySelector(".dropdown-menu-clickable-button");
    select_btn.classList.add("btn", "view-item", "interact-item");
    select_btn.classList.remove("section-control");
    view_buttons.appendChild(select_btn);
    header.appendChild(view_buttons);
    panel.insertBefore(header, panel.firstElementChild);
    if (form == null)
      return;
    if (page.token == "")
      page.token = form.querySelector('[name="csrfmiddlewaretoken"]').getAttribute("value");
    let original_chart_settings = {};
    let new_button = document.createElement("button");
    new_button.classList.add("panel-settings-button", "btn", "view-item", "interact-item");
    new_button.textContent = trans_legacy[lang].profile.settings;
    form.classList = "";
    tooltip = tippy(new_button, {
      theme: "window",
      content: form.outerHTML,
      allowHTML: true,
      placement: "bottom",
      interactive: true,
      interactiveBorder: 10,
      trigger: "click",
      onShow(instance) {
        let form2 = instance.popper.querySelector("form");
        form2.innerHTML = `
                <input type="hidden" name="csrfmiddlewaretoken" value="${page.token}">
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.tracks.timeframe.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_range_top_tracks_select">
                        ${original_chart_settings.timeframe}
                    </div>
                </div>
                <div class="select-container">
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.inbuilt.charts.tracks.count.name}</h5>
                    </div>
                    <div class="select-wrap custom-selector" id="id_chart_length_top_tracks_select">
                        ${original_chart_settings.count}
                    </div>
                </div>
                <div class="sep"></div>
                <div class="toggle-container" id="container-format_guest_features" onclick="_update_item('format_guest_features')">
                    <button class="btn reset" onclick="_reset_item('format_guest_features')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.format_guest_features.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.format_guest_features.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-format_guest_features" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="toggle-container hide-if-format-guest-disabled" id="container-show_guest_features" onclick="_update_item('show_guest_features')">
                    <button class="btn reset" onclick="_reset_item('show_guest_features')">${trans_legacy[lang].settings.reset}</button>
                    <div class="heading">
                        <h5>${trans_legacy[lang].settings.corrections.show_guest_features.name}</h5>
                        <p>${trans_legacy[lang].settings.corrections.show_guest_features.bio}</p>
                    </div>
                    <div class="toggle-wrap">
                        <button class="toggle" id="toggle-show_guest_features" aria-checked="true" type="button">
                            <div class="dot"></div>
                        </button>
                    </div>
                </div>
                <div class="settings-footer">
                    <button type="submit" class="btn-primary save">
                        ${trans_legacy[lang].settings.save}
                    </button>
                    <a class="btn icon settings not-a-view-button" href="${root}bleh">
                        ${trans_legacy[lang].settings.configure}
                    </a>
                </div>
            `;
        custom_select(form2.querySelector("#id_chart_range_top_tracks"), form2.querySelector("#id_chart_range_top_tracks_select"));
        custom_select(form2.querySelector("#id_chart_length_top_tracks"), form2.querySelector("#id_chart_length_top_tracks_select"));
        let selects = form2.querySelectorAll("select");
        selects.forEach((select) => {
          select.setAttribute("onchange", `_update_inbuilt_select('${select.getAttribute("id")}', this.value)`);
          update_inbuilt_select(select.getAttribute("id"), select.value);
        });
        refresh_all(instance.popper);
      }
    });
    view_buttons.appendChild(new_button);
    original_chart_settings = {
      timeframe: form.querySelector("#id_chart_range_top_tracks").outerHTML,
      count: form.querySelector("#id_chart_length_top_tracks").outerHTML
    };
    form.innerHTML = "";
  }
  function bio_parse(text, cache = false) {
    let result = markdown(text.textContent);
    let temp = document.createElement("div");
    temp.innerHTML = result;
    use_banner(temp, cache);
    return result;
  }
  function use_banner(temp, cache) {
    if (page.name == auth.name && !settings.profile_header_own || page.name != auth.name && !settings.profile_header_others)
      return;
    let banner = temp.querySelector('img[alt="banner"]');
    if (banner) {
      set_profile_banner(banner, cache);
    } else {
      save_banner_to_cache("none");
    }
  }
  function set_profile_banner(img, cache) {
    let src = img.getAttribute("src");
    register_background(src, "bio");
    if (cache)
      save_banner_to_cache(src);
  }
  function load_banner_from_cache() {
    let banners = JSON.parse(localStorage.getItem("bleh_profile_banners")) || {};
    if (banners[page.name]) {
      if (banners[page.name] == "none")
        return;
      register_background(banners[page.name], "bio");
    } else {
      request_banner();
    }
  }
  function request_banner() {
    fetch(`${root}user/${page.name}`).then(function(response) {
      console.log("returned", response, response.text);
      return response.text();
    }).then(function(html) {
      let doc = new DOMParser().parseFromString(html, "text/html");
      console.log("DOC", doc);
      let about_me_sidebar = doc.querySelector(".about-me-sidebar");
      if (about_me_sidebar) {
        let about_me_text = about_me_sidebar.querySelector("p");
        let result = bio_parse(about_me_text, true);
      } else {
        save_banner_to_cache("none");
      }
    });
  }
  function save_banner_to_cache(img) {
    let banners = JSON.parse(localStorage.getItem("bleh_profile_banners")) || {};
    banners[page.name] = img;
    let banners_o = Object.keys(banners);
    if (banners_o.length > 150) {
      let values = banners_o.splice(150, banners_o.length);
      values.forEach((value) => {
        delete banners[value];
      });
    }
    localStorage.setItem("bleh_profile_banners", JSON.stringify(banners));
  }

  // src/pages/search.js
  function bleh_search() {
    page.structure.container = document.body.querySelector(".page-content");
    try {
      page.structure.row = page.structure.container.querySelector(".row");
      page.structure.main = page.structure.row.querySelector(".col-main");
      page.structure.side = page.structure.row.querySelector(".col-sidebar");
    } catch (e) {
      log("unable to find elements", "page structure");
    }
    let content_top2 = document.body.querySelector(".content-top");
    let search_form = page.structure.main.querySelector(".search-form");
    let search = search_form.querySelector("#site-search");
    let value = search.getAttribute("value");
    let site_search = document.body.querySelector("#masthead-search-field");
    site_search.setAttribute("value", value);
    site_search.focus();
    page.structure.main.removeChild(search_form);
    page.name = value != "" ? value : "empty..";
    checkup_page_structure(false, content_top2);
    log("status is", "page", "info", page);
    update_page();
    if (page.subpage != "overview") {
      let new_panel = document.createElement("section");
      new_panel.classList.add("search-results-panel");
      let elements = page.structure.main.querySelectorAll(":scope > *:not(form)");
      elements.forEach((element) => {
        new_panel.appendChild(element);
      });
      page.structure.main.appendChild(new_panel);
    }
    if (page.subpage == "overview" || page.subpage == "tracks") {
      patch_titles();
    }
    if (page.subpage == "artists" && settings.corrections) {
      let artists = page.structure.main.querySelectorAll(".artist-result-heading a");
      artists.forEach((artist) => {
        artist.textContent = correct_artist(artist.textContent);
      });
    }
    if (page.subpage == "albums") {
      let results = page.structure.main.querySelectorAll(".album-result-inner");
      results.forEach((result) => {
        let heading = result.querySelector(".album-result-heading a");
        let artist_parent = result.querySelector(".album-result-artist");
        let artist = artist_parent.querySelector("a");
        artist.textContent = correct_artist(artist.textContent);
        heading.textContent = correct_item_by_artist(heading.textContent, artist.textContent);
        let image = result.querySelector(".album-result-image");
        let image_parent = document.createElement("span");
        image_parent.classList.add("avatar", "album-result-image");
        image_parent.appendChild(image);
        image.classList = [];
        artist_parent.after(image_parent);
      });
    }
  }

  // src/pages/track.js
  function bleh_tracks() {
    let track_header = document.body.querySelector(".header-new--track");
    if (track_header == void 0)
      return;
    if (track_header.hasAttribute("data-bwaa"))
      return;
    track_header.setAttribute("data-bwaa", "true");
    patch_header_title();
    page.sister = track_header.querySelector(".header-new-crumb span").textContent;
    page.name = correct_item_by_artist(document.body.querySelector("[data-page-resource-name]").getAttribute("data-page-resource-name"), page.sister);
    let is_subpage = track_header.classList.contains("header-new--subpage");
    if (auth.pro) {
      page.structure.container = document.body.querySelector(".page-content");
    } else {
      if (!is_subpage) {
        page.structure.container = document.body.querySelector(".full-bleed-ad-container + .page-content:not(.visible-xs)");
        if (!page.structure.container)
          page.structure.container = document.body.querySelector(".page-content");
      } else {
        page.structure.container = document.body.querySelector(".page-content");
      }
    }
    page.structure.row = page.structure.container.querySelector(".row");
    try {
      if (!is_subpage) {
        page.structure.main = page.structure.row.querySelector(".col-main.buffer-standard");
        if (page.structure.main.classList[2])
          page.structure.main = page.structure.row.querySelector(".col-main.buffer-standard:not(:first-child)");
      } else {
        page.structure.main = page.structure.row.querySelector(".col-main");
      }
      page.structure.side = page.structure.row.querySelector(".col-sidebar:not(.track-overview-video-column)");
    } catch (e) {
      log("unable to find elements", "page structure");
    }
    console.info("bleee", page.structure.row, page.structure.main);
    checkup_page_structure(is_subpage, track_header);
    if (ff("refreshed_music_nav")) {
      let artist_avatar = track_header.querySelector(".header-new-background-image");
      let title = track_header.querySelector(".header-new-title");
      let artist = track_header.querySelector('[itemprop="byArtist"]');
      let position = track_header.querySelector(".header-new-chart-position-number");
      let source_album = page.structure.main.querySelector(".source-album");
      let album_avatar;
      if (source_album != null)
        album_avatar = source_album.querySelector(".source-album-art img");
      let redesigned_track_header = document.createElement("section");
      redesigned_track_header.classList.add("redesigned-header", "redesigned-track-header", "no-background");
      redesigned_track_header.innerHTML = `
            <div class="avatar-side">
                ${album_avatar != null ? `
                <img src="${album_avatar.getAttribute("src").replace("300x300", "avatar300s")}">
                <a class="bleh--avatar-clickable-link"></a>
                ` : artist_avatar != null ? `
                <img src="${artist_avatar.getAttribute("content").replace("/ar0/", "/avatar170s/")}">
                <a class="bleh--avatar-clickable-link"></a>
                ` : '<img class="missing-track">'}
            </div>
            <div class="info-side">
                <div class="sub-text">${trans_legacy[lang].track.name}</div>
                <div class="title-container">
                    <h1>${title.innerHTML}</h1>
                    ${position ? position.outerHTML : ""}
                </div>
                <h2>${artist.innerHTML}</h2>
            </div>
        `;
      let bg;
      if (album_avatar && !album_avatar.getAttribute("src").endsWith("c6f59c1e5e7240a4c0d427abd71f3dbb.jpg"))
        bg = register_background(album_avatar.getAttribute("src").replace("/300x300/", "/ar0/"));
      else if (artist_avatar)
        bg = register_background(artist_avatar.getAttribute("content"));
      else
        bg = register_background(null);
      page.structure.container.insertBefore(redesigned_track_header, page.structure.container.firstElementChild);
      track_header.classList.add("legacy-header");
      let avatar_side = redesigned_track_header.querySelector(".avatar-side");
      let avatar_link = avatar_side.querySelector("a");
      let expand_link;
      if (album_avatar)
        expand_link = `_expand_avatar('${album_avatar.getAttribute("src").replace("300x300", "ar0")}')`;
      else if (artist_avatar)
        expand_link = `_expand_avatar('${artist_avatar.getAttribute("content")}')`;
      if (settings.default_avatar_action == "expand" && (album_avatar != null || artist_avatar != null))
        avatar_link.setAttribute("onclick", expand_link);
      else if (settings.default_avatar_action == "gallery" && album_avatar != null)
        avatar_link.href = source_album.querySelector(".link-block-cover-link").getAttribute("href");
      let menu = tippy(avatar_side, {
        theme: "context-menu",
        content: `
                ${album_avatar != null || artist_avatar != null ? `
                <button class="dropdown-menu-clickable-item" onclick="${expand_link}" data-menu-item="expand">
                    ${trans_legacy[lang].gallery.open.name}
                </button>
                ` : ""}
                ${album_avatar != null ? `
                <a class="dropdown-menu-clickable-item" href="${source_album.querySelector(".link-block-cover-link").getAttribute("href")}" data-menu-item="album">
                    ${trans_legacy[lang].settings.layout.avatar_action.album}
                </a>
                ` : ""}
                <div class="sep"></div>
                <a class="dropdown-menu-clickable-item" href="${root}bleh?tab=customise" data-menu-item="settings">
                    ${trans_legacy[lang].settings.configure}
                </a>
            `,
        allowHTML: true,
        placement: "right-start",
        trigger: "manual",
        interactive: true,
        interactiveBorder: 10,
        offset: [0, 0],
        onShow(instance) {
          instance.popper.addEventListener("click", (event2) => {
            instance.hide();
          });
        }
      });
      register_menu(avatar_side, menu);
    }
    if (!is_subpage) {
      show_your_scrobbles();
      bleh_music_page_charts();
      bleh_about_artist();
      bleh_tags_mini();
      let similar_tracks = page.structure.main.querySelector(".track-similar-tracks");
      if (similar_tracks) {
        let similar_panel = similar_tracks.parentElement;
        similar_panel.classList.add("similar-panel");
      }
    } else {
      let btn_add = page.structure.side.querySelector(".add-button");
      if (btn_add != null)
        btn_add.setAttribute("data-page-subpage", page.subpage);
      if (page.subpage == "wiki_overview")
        bleh_wiki();
      else if (page.subpage == "wiki_history")
        bleh_wiki_history();
      else if (page.subpage == "wiki_edit")
        bleh_wiki_editor();
    }
    log("status is", "page", "info", page);
    update_page();
  }

  // src/rain.js
  function rain() {
    let rain_container_old = document.getElementById("rain-container");
    if (rain_container_old != void 0)
      document.body.removeChild(rain_container_old);
    let rain_container = document.createElement("div");
    rain_container.classList.add("rain-container");
    rain_container.setAttribute("id", "rain-container");
    rain_container.innerHTML = `
        <div class="rain" id="rain"></div>
        <div class="rain rain-back" id="rain-back"></div>
    `;
    document.body.appendChild(rain_container);
    let increment = 0;
    let drops = "";
    let subtle_drops = "";
    let rain_main = document.getElementById("rain");
    let rain_back = document.getElementById("rain-back");
    while (increment < 60) {
      let randoms = [
        Math.floor(Math.random() * (98 - 1 + 1) + 1),
        Math.floor(Math.random() * (5 - 2 + 1) + 2)
      ];
      increment += randoms[1];
      drops += '<div class="drop" style="left: ' + increment + "%; bottom: " + (randoms[1] + randoms[1] - 1 + 280) + "%; animation-delay: 0." + randoms[0] + "s; animation-duration: 0.5" + randoms[0] + 's;"><div class="stem" style="animation-delay: 0.' + randoms[0] + "s; animation-duration: 0.5" + randoms[0] + 's;"></div><div class="splat" style="animation-delay: 0.' + randoms[0] + "s; animation-duration: 0.5" + randoms[0] + 's;"></div></div>';
      subtle_drops += '<div class="drop" style="right: ' + increment + "%; bottom: " + (randoms[1] + randoms[1] - 1 + 280) + "%; animation-delay: 0." + randoms[0] + "s; animation-duration: 0.5" + randoms[0] + 's;"><div class="stem" style="animation-delay: 0.' + randoms[0] + "s; animation-duration: 0.5" + randoms[0] + 's;"></div><div class="splat" style="animation-delay: 0.' + randoms[0] + "s; animation-duration: 0.5" + randoms[0] + 's;"></div></div>';
      rain_main.innerHTML = drops;
      rain_back.innerHTML = subtle_drops;
    }
  }
  function start_rain() {
    if (settings.rain)
      rain();
  }

  // src/shout.js
  function patch_shouts() {
    if (page.structure.main == null)
      return;
    let shouts = page.structure.main.querySelectorAll(".shout:not([data-kate-processed])");
    shouts.forEach((shout) => {
      try {
        shout.setAttribute("data-kate-processed", "true");
        let shout_name = shout.querySelector(".shout-user a");
        if (!shout_name)
          return;
        let shout_name_text = shout_name.textContent;
        let shout_avatar = shout.querySelector(".shout-user-avatar");
        let badge = patch_avatar(shout_avatar, shout_name_text, "shout");
        if (badge.type) {
          if (badge.type == "avatar-status-dot--staff")
            shout.classList.add("staff-shout");
          shout_avatar.setAttribute("data-avatar-themed", "true");
          shout_avatar.classList.add(`user-status--bleh-${badge.type}`, `user-status--bleh-user-${shout_name_text}`);
          shout_name.classList.add(`user-status--bleh-${badge.type}`, `user-status--bleh-user-${shout_name_text}`);
        }
        if (settings.shout_markdown) {
          let shout_body = shout.querySelector(".shout-body p");
          shout_parse_queue.push({
            element: shout_body
          });
        }
        let shout_timestamp = shout.querySelector(".shout-timestamp time");
        if (shout_timestamp != null) {
          tippy(shout_timestamp, {
            content: shout_timestamp.getAttribute("title")
          });
          shout_timestamp.removeAttribute("title");
        }
        let send_button = shout.querySelector(".form-group--submit");
        shout_send(send_button);
      } catch (e) {
        deliver_notif("a shout on this page failed to be modified :(");
        console.error("bleh - a shout failed to patch", e);
      }
    });
    let shout_forms = document.querySelectorAll(".shout-form:not([data-kate-processed])");
    shout_forms.forEach((shout_form) => {
      shout_form.setAttribute("data-kate-processed", "true");
      let shout_avatar = shout_form.querySelector(".shout-user-avatar");
      patch_avatar(shout_avatar, auth.name);
      let send_button = shout_form.querySelector(".form-group--submit");
      shout_send(send_button);
      shout_form.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.keyCode == 13) {
          e.preventDefault();
          send_button.querySelector(".btn-post-shout").click();
          notify({
            id: "shout",
            title: trans_legacy[lang].shout.name,
            body: trans_legacy[lang].shout.sent,
            icon: "icon-16-send"
          });
        }
      });
    });
  }
  function shout_send(send_button) {
    if (!send_button) return;
    let button = send_button.querySelector(".btn-post-shout");
    if (!button) return;
    button.classList.add("btn-send-shout-generic");
    button.textContent = trans_legacy[lang].settings.send;
    tippy(button, {
      content: trans_legacy[lang].settings.send_quickly.replace("{kbd}", "<kbd>ctrl+\u21B5</kbd>"),
      delay: [500, 0],
      allowHTML: true
    });
  }
  function parse_shout_queue() {
    let response = parse_shout(0);
    if (response == 0)
      return;
    setTimeout(function() {
      parse_shout(0);
    }, 100);
  }
  function parse_shout(index) {
    if (shout_parse_queue.length <= 0)
      return 0;
    let shout = shout_parse_queue[index];
    console.info(index, shout_parse_queue, shout);
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
    let parsed_body = converter.makeHtml(shout.element.textContent.replace(/([@])([a-zA-Z0-9_]+)/g, `[$1$2](${root}user/$2)`).replace(/\[artist\]([a-zA-Z0-9]+)\[\/artist\]/g, `[$1](${root}music/$1)`).replace(/\[album artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/album\]/g, `[$2](${root}music/$1/$2)`).replace(/\[track artist=([a-zA-Z0-9]+)\]([a-zA-Z0-9\s]+)\[\/track\]/g, `[$2](${root}music/$1/_/$2)`).replace(/https:\/\/open\.spotify\.com\/user\/([A-Za-z0-9]+)\?si=([A-Za-z0-9]+)/g, "[@$1](https://open.spotify.com/user/$1)").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"));
    shout.element.innerHTML = parsed_body;
    log(`parsed index ${index}`, "shout", "log");
    shout_parse_queue.splice(index, 1);
    return 1;
  }
  unsafeWindow._show_hidden_shout = function(shout_id) {
    document.getElementById(`bleh--shout-${shout_id}`).setAttribute("data-bleh--shout-expanded", "true");
  };

  // src/sponsor.js
  function sponsors(force = false) {
    if (!ff("sponsor"))
      return;
    let sponsor_data = localStorage.getItem("kat_sponsors");
    let sponsor_expire = new Date(localStorage.getItem("kat_sponsors_expire"));
    let current_time = /* @__PURE__ */ new Date();
    if (sponsor_data == null) {
      log("not cached, fetching", "sponsor");
      sponsor_request(true);
    } else {
      for (var member in sponsor_list) delete sponsor_list[member];
      Object.assign(sponsor_list, JSON.parse(sponsor_data));
      if (sponsor_expire < current_time && !force) {
        sponsor_request();
      } else if (force) {
        sponsor_request(true);
      }
    }
  }
  function sponsor_request(notify2 = false) {
    let button = document.body.querySelector('[onclick="_sponsor_check()"]');
    if (button != null)
      button.setAttribute("disabled", "");
    let xhr = new XMLHttpRequest();
    let url = `https://katelyynn.github.io/bleh/fm/badges/badges.json?${Math.random()}`;
    xhr.open("GET", url, true);
    xhr.onload = function() {
      log(`list responded with ${xhr.status}`, "sponsor");
      if (xhr.status != 200) {
        log("request has been cancelled, will request again in 1h", "sponsor");
        api_expire.setHours(api_expire.getHours() + 1);
      }
      let api_expire = /* @__PURE__ */ new Date();
      if (xhr.status == 200) {
        for (var member in sponsor_list) delete sponsor_list[member];
        Object.assign(sponsor_list, JSON.parse(this.response));
        if (notify2)
          deliver_notif(trans_legacy[lang].settings.home.sponsor.download, false, true, "sponsor");
        localStorage.setItem("kat_sponsors", this.response);
        api_expire.setHours(api_expire.getHours() + 4);
        log(`list cached until ${api_expire}`, "sponsor");
      }
      localStorage.setItem("kat_sponsors_expire", api_expire);
      if (button != null)
        button.removeAttribute("disabled");
    };
    xhr.send();
  }
  unsafeWindow._sponsor_check = function() {
    sponsors(true);
  };
  unsafeWindow._sponsor = function() {
    sponsor();
  };
  function sponsor() {
    dialog({
      id: "sponsor",
      title: trans_legacy[lang].settings.home.sponsor.header,
      body: `
            <div class="modal-vertical-inner support-inner">
                <div class="bleh-icon sponsor-heart"></div>
                <h1>${trans_legacy[lang].settings.home.sponsor.header}</h1>
                <p>${trans_legacy[lang].settings.home.sponsor.bio}</p>
            </div>
            <div class="modal-footer">
                <a class="btn primary sponsor" href="${sponsor_list.sponsor_link}" target="_blank">
                    ${trans_legacy[lang].settings.home.sponsor.name}
                </a>
            </div>
        `,
      type: "sponsor"
    });
  }
  unsafeWindow._sponsor_manage = function() {
    sponsor_manage();
  };
  function sponsor_manage() {
    if (sponsor_list.sponsors_one_time && sponsor_list.sponsors_one_time.includes(auth.name)) {
      dialog({
        id: "sponsor_manage",
        title: trans_legacy[lang].settings.home.sponsor.header,
        body: `
                <div class="modal-vertical-inner support-inner">
                    <div class="bleh-icon sponsor-heart"></div>
                    <h1>${trans_legacy[lang].settings.home.sponsor.status.yes}</h1>
                    <p>${trans_legacy[lang].settings.home.sponsor.status.one_time}</p>
                </div>
            `,
        type: "sponsor"
      });
    } else {
      dialog({
        id: "sponsor_manage",
        title: trans_legacy[lang].settings.home.sponsor.header,
        body: `
                <div class="modal-vertical-inner support-inner">
                    <div class="bleh-icon sponsor-heart"></div>
                    <h1>${trans_legacy[lang].settings.home.sponsor.status.yes}</h1>
                    <p>${trans_legacy[lang].settings.home.sponsor.status.badge}</p>
                </div>
                <div class="modal-footer">
                    <a class="btn primary sponsor" href="${root}user/${sponsor_list.sponsor_account}" target="_blank">
                        ${trans_legacy[lang].settings.home.sponsor.manage}
                    </a>
                </div>
            `,
        type: "sponsor"
      });
    }
  }
  function bleh_sponsor_page() {
    document.body.style.removeProperty("--hue-album");
    document.body.style.removeProperty("--sat-album");
    let adaptive_skin_container = document.querySelector(".adaptive-skin-container:not([data-bleh])");
    if (adaptive_skin_container == null)
      return;
    adaptive_skin_container.setAttribute("data-bleh", "true");
    adaptive_skin_container.innerHTML = "";
    log("internal bleh sponsor", "page");
    page.type = "bleh_sponsor";
    page.subpage = "";
    sponsor();
  }

  // src/style.js
  function append_style() {
    document.documentElement.classList.add("bleh-supports-loading");
    for (var member in settings) delete settings[member];
    Object.assign(settings, JSON.parse(localStorage.getItem("bleh")) || create_settings_template());
    let cached_style = localStorage.getItem("bleh_cached_style") || "";
    let url = window.location.href;
    let url_split = url.split("/");
    let url_length = url_split.length - 1;
    if (url_split[url_length] == "playback" || url_split[url_length - 1] == "labs")
      return;
    document.documentElement.setAttribute("data-bleh--theme", settings.theme);
    if (settings.dev) {
      log("dev mode is on, will fetch for version only", "style");
      check_style_info();
      return;
    }
    if (cached_style == "") {
      log("never cached, fetching", "style");
      fetch_new_style();
    } else {
      log("requesting cache", "style");
      load_cached_style(cached_style);
    }
  }
  function load_cached_style(cached_style) {
    let style_cache = document.createElement("style");
    style_cache.setAttribute("id", "bleh--cached-style");
    style_cache.textContent = cached_style;
    document.documentElement.appendChild(style_cache);
    log("loaded cache", "style");
    setTimeout(function() {
      document.body.classList.add("bleh");
      theme_version.state = getComputedStyle(document.body).getPropertyValue("--version-build").replaceAll("'", "").replaceAll('"', "");
      log(`theme version reporting as ${theme_version.state}`, "style");
      load_chart_colours();
      if ((page.type == "artist" || page.type == "album" || page.type == "track") && page.subpage == "overview")
        bleh_music_page_charts();
      if (page.type == "user" && page.subpage.startsWith("library")) {
        bleh_glacier_date_graph_generate();
        bleh_glacier_insights();
      }
      log("checking timeout", "style");
      check_if_style_cache_is_valid();
    }, 200);
  }
  function check_if_style_cache_is_valid() {
    let cached_style_timeout = new Date(localStorage.getItem("bleh_cached_style_timeout"));
    let current_time = /* @__PURE__ */ new Date();
    if (cached_style_timeout < current_time) {
      if (theme_version.state != version.build && theme_version.state != "") {
        log(`version mismatch! running ${version.build}, downloaded theme ${theme_version.state}`, "update");
        prompt_for_update2();
        return;
      }
      log("fetching new, expired timeout", "style");
      fetch_new_style();
    } else {
      log(`timeout valid until ${cached_style_timeout}`, "style");
    }
  }
  function check_style_info() {
    let cached_style_timeout = new Date(localStorage.getItem("bleh_cached_style_timeout"));
    let current_time = /* @__PURE__ */ new Date();
    if (cached_style_timeout < current_time) {
      fetch_style_info();
    }
  }
  unsafeWindow._prompt_for_update = function() {
    prompt_for_update2();
  };
  function prompt_for_update2() {
    dialog({
      id: "bleh_update",
      title: trans_legacy[lang].settings.home.update.update_to_v.replace("{v}", theme_version.state),
      body: `
            <div class="bleh--update-checker-container">
                <div class="form">
                    <div class="form-group">
                        <button class="big-btn ignore" onclick="_ignore_update()"></button>
                        ${trans_legacy[lang].settings.home.update.ignore}
                        <div class="small-alert red">${version.build}</div>
                    </div>
                </div>
                <div class="form">
                    <div class="form-group">
                        <button class="big-btn primary update" onclick="_start_update()"></button>
                        ${trans_legacy[lang].settings.home.update.update_now}
                        <div class="small-alert green">${theme_version.state}</div>
                    </div>
                </div>
            </div>
        `,
      dismiss: false,
      type: "update",
      replace_id: "bleh_update",
      replace: true
    });
  }
  unsafeWindow._ignore_update = function() {
    dialog_rm({
      id: "bleh_update"
    });
    let api_expire = /* @__PURE__ */ new Date();
    api_expire.setHours(api_expire.getHours() + 1);
    localStorage.setItem("bleh_cached_style_timeout", api_expire);
    log(`cached until ${api_expire}`, "style");
  };
  unsafeWindow._start_update = function() {
    open("https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.js");
    dialog_rm({
      id: "bleh_update"
    });
    if (!settings.dev) {
      _final_update();
    } else {
      dialog({
        id: "bleh_update",
        title: trans_legacy[lang].settings.home.update.update_to_v.replace("{v}", theme_version.state),
        body: `
                <div class="bleh--update-checker-container">
                    <div class="form">
                        <div class="form-group">
                            <button class="big-btn primary update" onclick="_start_css_update()"></button>
                            ${trans_legacy[lang].settings.home.update.css}
                            <div class="small-alert green">${theme_version.state}</div>
                        </div>
                    </div>
                </div>
            `,
        dismiss: false,
        type: "update"
      });
    }
  };
  unsafeWindow._start_css_update = function() {
    open("https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.css");
    dialog_rm({
      id: "bleh_update"
    });
    _final_update();
  };
  unsafeWindow._final_update = function() {
    dialog({
      id: "bleh_update",
      title: trans_legacy[lang].settings.home.update.update_to_v.replace("{v}", theme_version.state),
      body: `
            <div class="bleh--update-checker-container">
                <div class="form">
                    <div class="form-group">
                        <button class="big-btn primary finish" onclick="_finish_update()"></button>
                        ${trans_legacy[lang].settings.finish}
                    </div>
                </div>
            </div>
        `,
      dismiss: false,
      type: "update"
    });
  };
  unsafeWindow._finish_update = function() {
    dialog_rm({
      id: "bleh_update"
    });
    if (!settings.dev) {
      dialog({
        id: "bleh_wait",
        title: trans_legacy[lang].settings.home.update.name,
        type: "wait",
        dismiss: false
      });
      fetch_new_style(false, true);
    } else {
      invoke_reload();
    }
  };
  function fetch_new_style(delete_old_style = false, reload_on_finish = false) {
    let xhr = new XMLHttpRequest();
    let url = `https://katelyynn.github.io/bleh/fm/bleh.css?${Math.random()}`;
    xhr.open("GET", url, true);
    xhr.onload = function() {
      log(`style responded ${xhr.status}`, "style");
      let style = document.createElement("style");
      style.textContent = this.response;
      document.documentElement.appendChild(style);
      if (delete_old_style)
        document.documentElement.removeChild(document.getElementById("bleh--cached-style"));
      localStorage.setItem("bleh_cached_style", this.response);
      let api_expire = /* @__PURE__ */ new Date();
      api_expire.setHours(api_expire.getHours() + 1);
      localStorage.setItem("bleh_cached_style_timeout", api_expire);
      log(`cached until ${api_expire}`, "style");
      if (reload_on_finish)
        invoke_reload();
      setTimeout(function() {
        document.body.classList.add("bleh");
        theme_version.state = getComputedStyle(document.body).getPropertyValue("--version-build").replaceAll("'", "").replaceAll('"', "");
        load_chart_colours();
        if ((page.type == "artist" || page.type == "album" || page.type == "track") && page.subpage == "overview")
          bleh_music_page_charts();
        if (page.type == "user" && page.subpage.startsWith("library")) {
          bleh_glacier_date_graph_generate();
          bleh_glacier_insights();
        }
        if (theme_version.state != version.build && theme_version.state != "") {
          log(`version mismatch! running ${version.build}, downloaded theme ${theme_version.state}`, "update");
          prompt_for_update2();
          return;
        }
      }, 200);
    };
    xhr.send();
  }
  function fetch_style_info(delete_old_style = false, reload_on_finish = false) {
    let xhr = new XMLHttpRequest();
    let url = "https://katelyynn.github.io/bleh/fm/bleh.css";
    xhr.open("GET", url, true);
    xhr.onload = function() {
      log(`style responded ${xhr.status}`, "style");
      let style = document.createElement("style");
      style.textContent = this.response;
      document.documentElement.appendChild(style);
      localStorage.setItem("bleh_cached_style", this.response);
      let api_expire = /* @__PURE__ */ new Date();
      api_expire.setHours(api_expire.getHours() + 1);
      localStorage.setItem("bleh_cached_style_timeout", api_expire);
      log(`cached until ${api_expire}`, "style");
      setTimeout(function() {
        theme_version.state = getComputedStyle(document.body).getPropertyValue("--version-build").replaceAll("'", "").replaceAll('"', "");
        document.documentElement.removeChild(style);
        if (theme_version.state != version.build && theme_version.state != "") {
          log(`version mismatch! running ${version.build}, downloaded theme ${theme_version.state}`, "update");
          prompt_for_update2();
          return;
        }
      }, 200);
    };
    xhr.send();
  }
  unsafeWindow._force_refresh_theme = function() {
    localStorage.removeItem("bleh_cached_style");
    localStorage.removeItem("bleh_cached_style_timeout");
    window.setTimeout(invoke_reload, 400);
  };

  // src/page.js
  function bleh() {
    let head_observer = new MutationObserver((mutations) => {
      if (document.head) {
        append_style();
        head_observer.disconnect();
      }
    });
    head_observer.observe(document.documentElement, {
      childList: true
    });
    let pre_observer = new MutationObserver((mutations) => {
      if (document.body && document.body.querySelector(".masthead-logo")) {
        bleh_main();
        pre_observer.disconnect();
      }
    });
    pre_observer.observe(document.documentElement, {
      childList: true
    });
  }
  function bleh_main() {
    let performance_start = performance.now();
    auth_link.state = document.querySelector("a.auth-link");
    if (auth_link.state)
      auth.name = auth_link.state.querySelector("img").getAttribute("alt");
    load_settings();
    load_dialogs();
    theme_version.state = getComputedStyle(document.body).getPropertyValue("--version-build").replaceAll("'", "").replaceAll('"', "");
    lookup_lang();
    patch_masthead(document.body);
    load_notifications();
    set_season();
    start_rain();
    if (!auth.name) {
      notify({
        title: "No account added",
        body: "Please sign in to an account to access bleh features.",
        icon: "icon-16-user",
        persist: true
      });
      document.body.classList.add("bleh-loaded");
      return;
    }
    load_activities();
    notify_if_new_update();
    lotus();
    sponsors();
    append_nav();
    load_moderation();
    try {
      main_flow();
      const observer = new MutationObserver((mutations) => {
        lookup_lang();
        patch_masthead(document.body);
        theme_version.state = getComputedStyle(document.body).getPropertyValue("--version-build").replaceAll("'", "").replaceAll('"', "");
        if (theme_version.state != version.build && theme_version.state != "" && !has_prompted_for_update.state) {
          log(`version mismatch! running ${version.build}, downloaded theme ${theme_version.state}`, "update");
          prompt_for_update();
          has_prompted_for_update.state = true;
        }
        main_flow();
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      let performance_end = performance.now();
      log(`finished in ${performance_end - performance_start}`, "load");
    } catch (e) {
      handle_error(e);
    }
  }
  function handle_error(e = null) {
    dialog({
      id: "error",
      title: "An error has occured",
      body: `
            <div class="modal-vertical-inner error-inner">
                <div class="bleh-icon" style="--icon: var(--icon-error)"></div>
                <h1>oops.. something broke</h1>
                <p>An error has prevented bleh from loading correctly, please report this issue on Github.</p>
                <pre class="error-info">${e ? `<span class="error-type">${e.name}</span>: ${e.message}` : ""}<br>on: ${page.type}/${page.subpage}</pre>
                <p>Please include this error and the steps you took in the report!</p>
            </div>
            <div class="modal-footer">
                <a class="btn primary report-bug continue" href="https://github.com/katelyynn/bleh/issues/new/choose" target="_blank">
                    Report bug now
                </a>
            </div>
        `,
      type: "error"
    });
    if (e != null) {
      log("fatal failure", "load");
      console.error(e);
    }
    log("current page", "page", "info", page);
  }
  function handle_error_500() {
    document.body.classList.add("bleh-loaded");
    log("halted as root is inaccessible", "load");
  }
  function main_flow() {
    assign_page();
    if (page.type == "artist" || page.type == "album") {
      bleh_gallery();
      bleh_gallery_upload_check();
    }
    if (page.type == "user" || page.type == "search" || page.type == "tag")
      music_grids();
    if (page.type == "user" || page.type == "artist" || page.type == "album" || page.type == "track" || page.type == "events" || page.type == "festival" || page.type == "tag") {
      patch_shouts();
      if (shout_parse_queue.length > 0)
        parse_shout_queue();
    }
    patch_gallery_page();
    if (page.type == "user" && page.subpage.startsWith("library") && (page.subpage != "library_overview" && !page.subpage.startsWith("library_artist_") && !page.subpage.startsWith("library_album_") && !page.subpage.startsWith("library_track_")))
      bleh_glacier_library();
    if (auth.pro && page.type == "user" && page.name == auth.name && page.subpage == "library_artist_overview" || page.subpage == "library_album_overview" || page.subpage == "library_track_overview") {
      bleh_glacier_library_bulk_edit();
    }
    if (page.type == "user" || page.type == "artist" || page.type == "album" || page.type == "events" || page.type == "festival" || page.type == "tag" || page.type == "overview") {
      patch_titles();
    }
    if (page.type == "user" || page.type == "artist" || page.type == "album" || page.type == "track") {
      nag_bar();
    }
    if (settings.corrections) {
      correct_generic_combo_no_artist("artist-header-featured-items-item");
      correct_generic_combo_no_artist("artist-top-albums-item");
      correct_generic_combo("source-album-details");
      correct_generic_combo("resource-list--release-list-item");
      correct_generic_combo("similar-albums-item");
      correct_generic_combo("track-similar-tracks-item");
      correct_generic_combo("similar-items-sidebar-item");
    }
    subscribe_to_events();
    auto_edit_modal();
  }
  function assign_page() {
    document.documentElement.classList.add("bleh-supports-loading");
    if (!page.structure.wrapper)
      page.structure.wrapper = document.body.querySelector(".main-content");
    let main_content = page.structure.wrapper.querySelector(":scope > :last-child:not([data-bleh])");
    if (main_content) {
      assign_page_type();
      load_page();
      main_content.setAttribute("data-bleh", "true");
    } else {
      assign_page_subpage();
    }
    document.body.classList.add("bleh-loaded");
  }
  function assign_page_type() {
    let page_classes = document.body.classList;
    page_classes.forEach((page_class, index) => {
      if (page_class.startsWith("namespace")) {
        page.initial = page_class.replace("namespace--", "");
        let page_split = page.initial.split("_");
        page.type = page_split[0];
        if (page.type == "music") {
          page.type = page_split[1];
        }
        if (page.type != last_page_type.state) {
          last_page_type.state = page.type;
          log(page.type, "page");
        }
        console.log(page);
        assign_page_subpage();
        return;
      }
      if (index > 4)
        return;
    });
  }
  function assign_page_subpage() {
    page.subpage = page.initial.replace(page.type, "").replace("_", "").replace("music_", "");
    if (last_page_subpage.state != page.subpage) {
      last_page_subpage.state = page.subpage;
      log(`subpage of ${page.subpage}`, "page");
      load_settings();
      if (page.state.settings_reload) {
        page.state.settings_reload = false;
      }
      if (page.structure.indicator)
        page_indicator();
    }
  }
  function load_page() {
    append_nav();
    set_season();
    seasonal_timer_end();
    let masthead = document.body.querySelector(".masthead");
    window.addEventListener("scroll", (e) => {
      let scroll = window.scrollY;
      if (scroll > 30)
        masthead.classList.add("scrolled");
      else
        masthead.classList.remove("scrolled");
    });
    if (window.location.href.startsWith(setup_url.replace("{root}", root))) {
      bleh_setup();
    } else if (window.location.href.startsWith(sponsor_url.replace("{root}", root))) {
      bleh_sponsor_page();
    } else if (window.location.href.startsWith(bleh_url.replace("{root}", root))) {
      bleh_home();
      bleh_settings();
    } else {
      bleh_error();
      if (page.state.error)
        return;
      if (page.type == "user")
        bleh_profiles();
      else if (page.type == "artist")
        bleh_artists();
      else if (page.type == "album")
        bleh_albums();
      else if (page.type == "track")
        bleh_tracks();
      else if (page.type == "events" || page.type == "festival")
        bleh_events();
      else if (page.type == "tag")
        bleh_tags();
      else if (page.type == "search")
        bleh_search();
      else if (page.type == "inbox")
        bleh_inbox();
      else if (page.type == "home")
        bleh_home_legacy();
      else if (page.type == "overview" || page.type == "recommended" || page.type == "releases" || page.type == "bookmarks" || page.type == "charts" || page.type == "settings")
        bleh_home();
      if ((page.type == "artist" || page.type == "album" || page.type == "track") && page.subpage == "overview")
        patch_wiki();
    }
    if (ff("page_title")) {
      try {
        document.title = `${trans_legacy[lang].pages[page.type][page.subpage].replace("{name}", page.name).replace("{sister}", page.sister)} | ${version.brand} ${version.build}.${version.sku}`;
      } catch (e) {
        log(`translation key for this page could not be found`, "page", "info", page);
      }
    }
    page_title();
    if (page.structure.indicator)
      page_indicator();
  }
  function page_title() {
    if (!ff("katsune"))
      return;
    if (!page.structure.container)
      return;
    let title = page.structure.container.querySelector(".page-title");
    if (!title) {
      title = document.createElement("section");
      title.classList.add("page-header");
      page.structure.container.insertBefore(title, page.structure.container.firstElementChild);
    }
    let name = page.type;
    if (trans_legacy[lang].hasOwnProperty(page.type))
      name = trans_legacy[lang][page.type].name;
    else if (page.type == "user")
      name = trans_legacy[lang].profile.name;
    else if (page.type == "bleh_settings")
      name = trans_legacy[lang].settings.name;
    else if (page.type == "events" || page.type == "festival")
      name = trans_legacy[lang].event.name;
    title.setAttribute("data-page-type", page.type);
    title.innerHTML = `
        <div class="bleh-icon page-header-icon"></div>
        <div class="page-header-title">
            ${name}
        </div>
    `;
  }
  function page_indicator() {
    page.structure.indicator.innerHTML = `
        <div class="bleh">
            <strong>version</strong>
            <span>${version.brand}</span>
            <span>${version.build}</span>
            <span>${version.sku}</span>
        </div>
        <div class="page">
            <strong>auth</strong>
            <span>${auth.name}</span>
            <span>${lang} (${non_override_lang})</span>
        </div>
        <div class="page">
            <strong>page</strong>
            <span>${page.type}</span>
            <span>${page.subpage}</span>
        </div>
        <div class="page">
            <strong></strong>
            <span>${page.name}</span>
            <span>${page.sister}</span>
        </div>
        <div class="page">
            <strong>season</strong>
            <span>${stored_season.id}</span>
            <span>${stored_season.year}</span>
            <span>${stored_season.offset}</span>
        </div>
    `;
  }
  function update_page() {
    page.structure.container.setAttribute("data-page-type", page.type);
    page.structure.container.setAttribute("data-page-subpage", page.subpage);
  }
  function register_background(url, origin = null) {
    let flag = ff("katsune");
    let background;
    if (flag) {
      background = page.structure.container.querySelector(".bleh-background");
      if (!background) {
        background = document.createElement("div");
        background.classList.add("bleh-background", "katsune-bleh-background");
        let border = document.createElement("div");
        border.classList.add("katsune-bleh-background-border");
        background.appendChild(border);
        page.structure.container.insertBefore(background, page.structure.container.firstElementChild);
      }
    } else {
      background = document.body.querySelector(".bleh-background");
      if (!background) {
        background = document.createElement("div");
        background.classList.add("bleh-background");
        document.body.appendChild(background);
      }
    }
    if (page.type == "user" && origin) {
      let buttons = background.querySelector(".bleh-background-buttons");
      if (!buttons) {
        buttons = document.createElement("div");
        buttons.classList.add("view-buttons", "bleh-background-buttons");
      } else {
        buttons.innerHTML = "";
      }
      let origin_button = document.createElement("button");
      origin_button.classList.add("btn", "view-item", "origin-button");
      buttons.appendChild(origin_button);
      if (origin == "bio") {
        tippy(origin_button, {
          theme: "badge",
          content: `
                    <div class="badge-name">${trans_legacy[lang].profile.banner.origin.bio[0]}</div>
                    <div class="badge-reason">${trans_legacy[lang].profile.banner.origin.bio[1].replace("{b}", "<code>![banner](url)</code>")}</div>
                `,
          allowHTML: true,
          placement: "bottom"
        });
      } else {
        tippy(origin_button, {
          content: trans_legacy[lang].profile.banner.origin[origin],
          placement: "bottom"
        });
      }
      background.appendChild(buttons);
    }
    background.setAttribute("data-page-type", page.type);
    background.setAttribute("data-background-origin", origin);
    if (url)
      background.style.setProperty("background-image", `url(${url})`);
    else
      background.style.removeProperty("background-image");
    if (page.type == "user") {
      if (page.name == auth.name) {
        background.setAttribute("data-page-user-is-self", "true");
      } else {
        background.setAttribute("data-page-user-is-self", "false");
      }
    }
    return background;
  }

  // src/build/build.json
  var build_default = {
    brand: "bleh",
    build: "2025.0402",
    sku: "beret",
    bio: "bleh!!! ^-^",
    author: "kate",
    url: "https://github.com/katelyynn/bleh/raw/uwu/fm/bleh.user.js",
    feature_flags: {
      bleh_settings_tabs: {
        default: true,
        name: "Utilise new bleh settings tabs",
        date: "2024-07-09"
      },
      high_contrast: {
        default: false,
        name: "Enable visibility of high contrast (experimental)",
        date: "2024-10-04"
      },
      redesigned_profile_header: {
        default: true,
        name: "Redesigned profile header info",
        date: "2024-10-09"
      },
      show_wiki_label: {
        default: true,
        name: "Show 'About' label above wikis",
        date: "2024-10-11"
      },
      music_page_charts: {
        default: true,
        name: "Music page charts",
        date: "2024-11-05"
      },
      chartlist_highlight_shadow: {
        default: false,
        name: "Chartlist row highlight side shadow",
        date: "2024-11-05"
      },
      new_gallery_experience: {
        default: true,
        name: "New gallery experience",
        date: "2024-11-06"
      },
      display_album_bookmark: {
        default: false,
        name: "Display album bookmark button in gallery refresh",
        date: "2024-11-06"
      },
      changelogs: {
        default: true,
        name: "Enable changelog system",
        date: "2024-11-07"
      },
      refreshed_nav: {
        default: true,
        name: "Refreshed nav structure, reducing a lot of jank",
        date: "2024-11-09"
      },
      refreshed_music_nav: {
        default: true,
        name: "Refreshed music nav structure",
        date: "2024-11-10"
      },
      card_saturation: {
        default: true,
        name: "Enable card saturation slider",
        date: "2024-11-10"
      },
      show_album_cover_always: {
        default: true,
        name: "Show album cover in header overview",
        date: "2024-11-11"
      },
      new_auth_menu: {
        default: true,
        name: "New custom-built auth menu to reduce lag",
        date: "2024-11-11"
      },
      unify_top_listeners: {
        default: true,
        name: "Unify top listeners",
        date: "2024-11-15"
      },
      hide_chartlist_more: {
        default: false,
        name: "Hide chartlist more button, accessible the same with right-clicking",
        date: "2024-12-03"
      },
      glacier_library: {
        default: true,
        name: "Glacier library (new library beta)",
        date: "2024-12-04"
      },
      shout_popover: {
        default: true,
        name: "Redesigned shout action popover",
        date: "2024-12-23"
      },
      sponsor: {
        default: true,
        name: "Sponsor link",
        date: "2024-12-24"
      },
      skip_to_setting: {
        default: true,
        name: "Skip to... in settings",
        date: "2024-12-24"
      },
      page_title: {
        default: true,
        name: "Dynamic tab title",
        date: "2024-12-26"
      },
      view_button_nav: {
        default: true,
        name: "Match view button colouring to new nav",
        date: "2024-12-28"
      },
      remove_bookmark: {
        default: true,
        name: "Context menu to remove inaccessible artist bookmark",
        date: "2024-12-28"
      },
      badges: {
        default: true,
        name: "New badge tooltip",
        date: "2024-12-28"
      },
      astra: {
        default: false,
        name: "astrablooms font",
        date: "2025-01-01",
        notice: "This is a test of a new 'default' font for bleh, it most likely will never take effect as changing a font takes a lot of getting used to, but yeah.<br>You should set your text settings to the following: 470, 540, 610"
      },
      developer: {
        default: false,
        name: "Developer mode",
        date: "2025-01-03",
        notice: "Enable developer-specific features used for debugging purposes"
      },
      api: {
        default: false,
        name: "Allow user to enter API key for newer features",
        date: "2025-01-19"
      },
      colour_based_on_avatar: {
        default: true,
        name: "Set colour based on avatar",
        date: "2025-01-23"
      },
      katsune: {
        default: true,
        name: "katsune redesign",
        date: "2025-01-25",
        notice: "This is very, very experimental ~w~"
      },
      beret: {
        default: false,
        name: "beret redesign",
        date: "2025-04-03",
        notice: "Removes individual card styles and instead styles the entire container, much like old bleh"
      }
    }
  };

  // src/main.js
  var version = build_default;
  var theme_version = {
    state: ""
  };
  log(`starting ${version.build}.${version.sku}`, "load");
  bleh();
})();
