import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// A green tile with a serif T, matching the site's accent and wordmark.
export default async function Icon() {
  const newsreader = await readFile(
    join(process.cwd(), "src/app/fonts/Newsreader-Medium.ttf")
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#106b4e",
        borderRadius: 7,
        color: "#f3f4f2",
        fontFamily: "Newsreader",
        fontSize: 26,
        lineHeight: 1,
        paddingBottom: 2,
      }}
    >
      T
    </div>,
    {
      ...size,
      fonts: [{ name: "Newsreader", data: newsreader, style: "normal" }],
    }
  );
}
