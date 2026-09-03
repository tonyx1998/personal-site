import { ImageResponse } from "next/og";

export const alt = "To Yin Yu, software developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background: "#f4f5f7",
        color: "#1c2128",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: "26px",
          color: "#1e5f7a",
          letterSpacing: "0.04em",
        }}
      >
        toyinyu.com
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            fontSize: "96px",
            fontWeight: 600,
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            display: "flex",
          }}
        >
          To Yin Yu
        </div>
        <div
          style={{
            fontSize: "42px",
            fontWeight: 500,
            color: "#4b5563",
            display: "flex",
          }}
        >
          Software developer
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#4b5563",
            maxWidth: "960px",
            lineHeight: 1.35,
            display: "flex",
          }}
        >
          Plugrade, How&apos;s My Job Fit?, SoloMock, SoloYap, Gasolytics, and
          Throughline. All live, all built and run by one person.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: "24px",
          color: "#7b8593",
        }}
      >
        Seattle area · US citizen · open to a first full-time role
      </div>
    </div>,
    { ...size }
  );
}
