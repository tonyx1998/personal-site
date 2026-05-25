import { ImageResponse } from "next/og";

export const alt = "To Yin Yu — Full-Stack Engineer & Applied AI Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #09090b 0%, #1e1b4b 60%, #4f46e5 100%)",
          color: "#fafafa",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontFamily: "ui-monospace, SFMono-Regular, monospace",
            color: "#a5b4fc",
            fontSize: "28px",
          }}
        >
          &lt;ToYinYu /&gt;
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "92px",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              display: "flex",
            }}
          >
            To Yin Yu
          </div>
          <div
            style={{
              fontSize: "44px",
              fontWeight: 500,
              color: "#c7d2fe",
              display: "flex",
            }}
          >
            Full-Stack Engineer · Applied AI Builder
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#a1a1aa",
              maxWidth: "900px",
              display: "flex",
            }}
          >
            Shipping applied AI products with Next.js, FastAPI, WebRTC, and the
            OpenAI Realtime API.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            fontFamily: "ui-monospace, SFMono-Regular, monospace",
            fontSize: "22px",
            color: "#71717a",
          }}
        >
          <span>toyinyu.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
