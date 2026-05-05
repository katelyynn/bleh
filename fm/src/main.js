//
// bleh, an extension for the music site Last.fm
// Copyright (c) 2025 katelyn and contributors
// Licensed under GPLv3
//

import { log } from "./build/log";
import { bleh } from "./page";

import version2 from "./build/build.json" with { type: "json" };

import { Chart, registerables } from "chart.js";
import "chartjs-adapter-luxon";

Chart.register(...registerables);

export { Chart };

export const version = version2;
export const theme_version = {
  state: "",
};

log(`starting ${version.build}.${version.sku}`, "load");
bleh();
