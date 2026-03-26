import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Piotr Romanczuk — Software Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#f8fafc",
              lineHeight: 1.1,
            }}
          >
            Piotr Romanczuk
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: "#94a3b8",
              lineHeight: 1.4,
            }}
          >
            Software Developer — Warsaw, Poland
          </div>
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            {["TypeScript", "React", "Next.js", "Supabase", "Node.js"].map(
              (tech) => (
                <div
                  key={tech}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "999px",
                    border: "1px solid #334155",
                    color: "#cbd5e1",
                    fontSize: 20,
                  }}
                >
                  {tech}
                </div>
              )
            )}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "80px",
            fontSize: 22,
            color: "#64748b",
          }}
        >
          romanczuk.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
