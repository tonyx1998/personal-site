# Resume fonts

PublicSans-Regular.ttf and PublicSans-Bold.ttf are static 400/700 instances of
Public Sans, used only by the PDF generator. They match the portfolio's existing
sans-serif family. The renderer embeds the glyphs used in the document.

Source: [Google Fonts publicsans directory](https://github.com/google/fonts/tree/main/ofl/publicsans),
retrieved October 5, 2026. Both files are distributed under the SIL Open Font
License 1.1; see [OFL.txt](OFL.txt). No reserved font name is specified.

The variable source file's SHA-256 was
`d75a7dc1a27eb9e336d5b33f55489d2ecb5621bf694d5c43b2415bce2ca830a8`.
The static instances were generated with fontTools 4.66.1:

```python
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

for weight, name in [(400, "PublicSans-Regular.ttf"), (700, "PublicSans-Bold.ttf")]:
    font = TTFont("PublicSans.ttf")
    instantiateVariableFont(font, {"wght": weight}, inplace=True).save(name)
```

Bundled SHA-256 hashes:

- Regular: `28e01ce8d34660888d49255587d54bd74895618d677f7073c97946d6a9695716`
- Bold: `3d4e36029d8708b3a62fa225ef97085d22394beddfa98a60a6801ab391f8884b`

Keep these static source fonts local so resume builds do not depend on network
access, platform font substitution, or runtime variable-font instancing. If
replacing them, recheck every profile's content, one-page layout, structure,
links, and PDF/UA machine-verifiable rules.
