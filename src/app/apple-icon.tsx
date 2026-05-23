import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #09090b 0%, #1e1b4b 60%, #4f46e5 100%)",
          color: "#a5b4fc",
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
          fontSize: 76,
          fontWeight: 800,
          letterSpacing: "-0.04em",
        }}
      >
        &lt;T/&gt;
      </div>
    ),
    { ...size },
  );
}
