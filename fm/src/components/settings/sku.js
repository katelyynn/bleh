//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import {settings} from "./build/config";
import {log} from "./build/log";
import {version} from "./main";

export function ff(flag) {
    log(`parsing ${flag}`, 'flag', 'log', {
        setting: settings.feature_flags[flag],
        sku: version.feature_flags[flag]
    });

    if (settings.feature_flags[flag] != null)
        return settings.feature_flags[flag];

    if (version.feature_flags[flag] != null)
        return version.feature_flags[flag].default;
}
