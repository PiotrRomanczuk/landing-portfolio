import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { revalidateSecret } from "@/sanity/lib/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");

  if (!revalidateSecret || secret !== revalidateSecret) {
    return new Response("Invalid secret", { status: 401 });
  }
  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const exists = await client.fetch<string | null>(
    `*[_type == "post" && slug.current == $slug][0]._id`,
    { slug },
  );
  if (!exists) {
    return new Response("Post not found", { status: 404 });
  }

  const draft = await draftMode();
  draft.enable();
  redirect(`/blog/${slug}`);
}
