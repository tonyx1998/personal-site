import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "To Yin Yu, software developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const newsreader = await readFile(
    join(process.cwd(), "src/app/fonts/Newsreader-Medium.ttf")
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background: "#f3f4f2",
        color: "#17201f",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: "26px",
          color: "#106b4e",
          letterSpacing: "0.04em",
        }}
      >
        toyinyu.com
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            fontFamily: "Newsreader",
            fontSize: "104px",
            lineHeight: 1.02,
            letterSpacing: "-0.01em",
            display: "flex",
          }}
        >
          To Yin Yu
        </div>
        <div
          style={{
            fontSize: "42px",
            fontWeight: 500,
            color: "#4f5b58",
            display: "flex",
          }}
        >
          Software developer
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#4f5b58",
            maxWidth: "960px",
            lineHeight: 1.35,
            display: "flex",
          }}
        >
          How&apos;s My Job Fit?, SoloMock, SoloYap, Gasolytics, Amex Roofing,
          ReachSpan, and Throughline. All live, all built and run by one person.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: "24px",
          color: "#7d8885",
        }}
      >
        Seattle area · US citizen · open to a first full-time role
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Newsreader", data: newsreader, style: "normal" }],
    }
  );
}
