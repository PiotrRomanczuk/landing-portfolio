// Generates the printable QR code for the business card: public/qr-romanczuk-online.svg
// Usage: npm run qr
import { writeFile } from "node:fs/promises";
import QRCode from "qrcode";

const URL_TO_ENCODE = "https://romanczuk.online";
const OUT = new URL("../public/qr-romanczuk-online.svg", import.meta.url);

const svg = await QRCode.toString(URL_TO_ENCODE, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 2,
  color: { dark: "#0a0b0e", light: "#ffffff" },
});
await writeFile(OUT, svg);
console.log(`QR for ${URL_TO_ENCODE} → ${OUT.pathname}`);
