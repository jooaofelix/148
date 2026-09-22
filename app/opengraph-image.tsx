import { ImageResponse } from "next/og";

export const alt = "148 — Toda a criação louva";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          color: "#f4f2ec",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 220, fontWeight: 700, letterSpacing: -4 }}>
          148
        </div>
        <div style={{ display: "flex", fontSize: 34, opacity: 0.7, marginTop: 8 }}>
          Toda a criação louva
        </div>
      </div>
    ),
    { ...size }
  );
}
