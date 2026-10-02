import type { MetadataRoute } from "next";

/** Lets the business card be added to the iPhone/Android home screen as a standalone app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Piotr Romańczuk",
    short_name: "Romańczuk",
    description: "Wizytówka: Vector Digital, portfolio, korepetycje z angielskiego, lekcje gitary.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0b0e",
    theme_color: "#0a0b0e",
    lang: "pl",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
