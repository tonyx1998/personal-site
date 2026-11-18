# Portfolio fonts

The pages load two Latin-subset variable WOFF2 files through `next/font/local`. Both are normal style. Newsreader retains its optical-size axis and weights 200–800. Public Sans supports weights 100–900. The build can run without contacting a font provider.

The files come from Fontsource packages `@fontsource-variable/newsreader` and `@fontsource-variable/public-sans`, both version 5.3.0, at commit `5a72889057f592bb0659629e38337359f94d53b2`. Both families use the SIL Open Font License 1.1.

| Local file                         | Upstream file                                                                                                                                                                              | License                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| `newsreader-latin-variable.woff2`  | [Newsreader Latin standard](https://github.com/fontsource/font-files/blob/5a72889057f592bb0659629e38337359f94d53b2/fonts/variable/newsreader/files/newsreader-latin-standard-normal.woff2) | [Newsreader license](./OFL.txt)             |
| `public-sans-latin-variable.woff2` | [Public Sans Latin weight](https://github.com/fontsource/font-files/blob/5a72889057f592bb0659629e38337359f94d53b2/fonts/variable/public-sans/files/public-sans-latin-wght-normal.woff2)    | [Public Sans license](./PublicSans-OFL.txt) |

The favicon, Apple touch icon and Open Graph card use the existing `Newsreader-Medium.ttf` static instance at weight 500 and optical size 72.
