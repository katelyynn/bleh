# [bleh for last.fm](https://bleh.katelyn.moe/)

bleh is my passion project and a take on a full [Last.fm](https://last.fm) redesign. It is still work-in-progress in some areas, but should be stable and consistent overall. If you're interested in what it has to offer along with more screenshots, head to the site above (which has a convenient download link too :3 !!) Community contributions are welcome, please see below!

![preview](https://bleh.katelyn.moe/appearance.webp)

## Support

If you feel my work on this and my other Last.fm projects is worthy of donations, you are welcome to sponsor me on GitHub. This is, of course, optional, and bleh will forever be open-source and free. Sponsors get a sweet profile badge.

## Development

When developing, there are two core components that make up bleh: the script and the stylesheet. To get yourself set up after forking the project (and making a new branch if you are contributing), here are some handy steps you can follow.

### Working with the script

Script files can be found in `src`. To combine all the separate files into a loadable bleh install, run `node index.js` in the `fm` directory to update the `bleh.user.js` file for use. For live reloading, use `node index.js dev` instead along with the **Violentmonkey** extension's "track external edits" option. This will automatically compile all script and stylesheet files into the same file.

### Translations

Please see [the wiki entry for more details](https://github.com/katelyynn/bleh/wiki/Translations)

## Licenses

This project includes the 'Overpass' font as woff2 files which is licensed under the SIL Open Font License 1.1. See fonts/LICENSE for details.

---

made with [♡](https://katelyn.moe/sponsor) by katelyn and contributors
