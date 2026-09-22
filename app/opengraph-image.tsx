import { readFile } from "fs/promises";
import path from "path";
import { ImageResponse } from "next/og";

export const alt = "148 — Toda a criação louva";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const markPath = path.join(process.cwd(), "public/images/brand/148-mark-og.png");
  const markBuffer = await readFile(markPath);
  const markSrc = `data:image/png;base64,${markBuffer.toString("base64")}`;

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
        <img src={markSrc} style={{ width: 420, height: 420 }} alt="" />
        <div style={{ display: "flex", fontSize: 34, opacity: 0.75, marginTop: 4 }}>
          Toda a criação louva
        </div>
      </div>
    ),
    { ...size }
  );
}
