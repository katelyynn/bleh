//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { html } from 'lighterhtml';
import { dialog, dialog_rm } from './dialog';
import { settings } from '../build/config';
import { request_changelog } from './news';
import { save_setting } from './settings';

export function load_dismissed() {}
