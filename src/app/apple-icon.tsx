import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS rounds the corners itself, so the tile is square here.
export default async function AppleIcon() {
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
        color: "#f3f4f2",
        fontFamily: "Newsreader",
        fontSize: 138,
        lineHeight: 1,
        paddingBottom: 10,
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
