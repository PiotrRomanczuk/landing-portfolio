import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon for iOS ("Add to Home Screen"): monogram on the card's dark background. */
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
          background: "#0a0b0e",
          color: "#f5b453",
          fontSize: 92,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
          letterSpacing: -4,
        }}
      >
        PR
      </div>
    ),
    size,
  );
}
