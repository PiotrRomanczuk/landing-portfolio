/**
 * Publish specific draft posts: copy each drafts.<id> to <id> and
 * delete the draft. Idempotent — already-published ids are skipped.
 *
 * Run with:
 *   npx sanity exec scripts/publish-drafts.ts --with-user-token
 */

import { getCliClient } from "sanity/cli";

const DRAFT_IDS = [
  "drafts.post-portfolio-live-stats",
  "drafts.post-homeops-devops-classroom",
];

async function main() {
  const client = getCliClient();

  for (const draftId of DRAFT_IDS) {
    const doc = await client.getDocument(draftId);
    if (!doc) {
      console.log(`  skip  ${draftId} (no draft found)`);
      continue;
    }
    const publishedId = draftId.replace(/^drafts\./, "");
    const { _rev, ...rest } = doc;
    void _rev; // _rev must not be carried into the new document
    await client
      .transaction()
      .createOrReplace({ ...rest, _id: publishedId })
      .delete(draftId)
      .commit();
    console.log(`✓ published ${publishedId} — "${doc.title}"`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
