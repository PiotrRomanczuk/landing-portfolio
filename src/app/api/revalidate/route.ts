import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { revalidateSecret } from "@/sanity/lib/env";

type WebhookPayload = {
  _type?: string;
  slug?: string;
  tagSlug?: string;
};

export async function POST(request: NextRequest) {
  if (!revalidateSecret) {
    return new Response("Webhook not configured", { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<WebhookPayload>(
    request,
    revalidateSecret,
  );

  if (!isValidSignature) {
    return new Response("Invalid signature", { status: 401 });
  }
  if (!body?._type) {
    return new Response("Missing _type", { status: 400 });
  }

  const tags = ["posts", "tags"];
  if (body._type === "post" && body.slug) {
    tags.push(`post:${body.slug}`);
  }
  if (body._type === "tag" && body.tagSlug) {
    tags.push(`tag:${body.tagSlug}`);
  }

  for (const tag of tags) {
    revalidateTag(tag, "default");
  }

  return Response.json({ revalidated: tags, now: Date.now() });
}
