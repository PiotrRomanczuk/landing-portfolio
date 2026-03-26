import { NextResponse } from "next/server";

const FORMSPREE_URL = "https://formspree.io/f/mnjbeoje";

export async function POST(request: Request) {
  const body = await request.formData();

  const res = await fetch(FORMSPREE_URL, {
    method: "POST",
    body,
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to send" }, { status: res.status });
  }

  return NextResponse.json({ ok: true });
}
