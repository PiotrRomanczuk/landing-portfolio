import { getCliClient } from "sanity/cli";

type Row = { name: string; slug: string; description: string };

async function main() {
  const client = getCliClient();
  const tags = await client.fetch<Row[]>(
    `*[_type == "tag"] | order(name asc) { name, "slug": slug.current, description }`,
  );
  for (const t of tags) {
    const desc = t.description?.slice(0, 100) ?? "(no description)";
    console.log(`[${t.slug.padEnd(13)}] ${t.name}`);
    console.log(`  ${desc}${t.description?.length > 100 ? "..." : ""}`);
    console.log("");
  }
  console.log(`${tags.length} tags total.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
