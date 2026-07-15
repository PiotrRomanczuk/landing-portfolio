/**
 * Seed the home-ops / homelab post into Sanity AS A DRAFT.
 * Creates the `devops` tag if it doesn't exist yet.
 * Idempotent — re-running replaces the draft. Publish from Studio.
 *
 * Run with:
 *   npx sanity exec scripts/seed-homeops-post.ts --with-user-token
 */

import { randomUUID } from "node:crypto";
import { getCliClient } from "sanity/cli";

type Mark = "strong" | "em" | "code";

type Span = { _type: "span"; _key: string; text: string; marks: Mark[] };

type Block = {
  _type: "block";
  _key: string;
  style: "normal" | "h2" | "h3" | "blockquote";
  markDefs: never[];
  children: Span[];
};

type CodeBlock = {
  _type: "codeBlock";
  _key: string;
  language: string;
  filename?: string;
  code: string;
};

type Callout = {
  _type: "callout";
  _key: string;
  tone: "note" | "warning" | "tip";
  body: Block[];
};

type PullQuote = {
  _type: "pullQuote";
  _key: string;
  text: string;
  attribution?: string;
};

type BodyChild = Block | CodeBlock | Callout | PullQuote;

const k = () => randomUUID().replace(/-/g, "").slice(0, 12);

const span = (text: string, marks: Mark[] = []): Span => ({
  _type: "span",
  _key: k(),
  text,
  marks,
});

const block = (style: Block["style"], ...children: Span[]): Block => ({
  _type: "block",
  _key: k(),
  style,
  markDefs: [],
  children,
});

const p = (...children: Span[]): Block => block("normal", ...children);
const h2 = (text: string): Block => block("h2", span(text));

const code = (language: string, src: string, filename?: string): CodeBlock => ({
  _type: "codeBlock",
  _key: k(),
  language,
  ...(filename ? { filename } : {}),
  code: src,
});

const callout = (tone: Callout["tone"], ...children: Span[]): Callout => ({
  _type: "callout",
  _key: k(),
  tone,
  body: [block("normal", ...children)],
});

const pullQuote = (text: string, attribution?: string): PullQuote => ({
  _type: "pullQuote",
  _key: k(),
  text,
  ...(attribution ? { attribution } : {}),
});

const body: BodyChild[] = [
  p(
    span(
      "My “infrastructure” is four machines and a NAS: the laptop I work on, an Ubuntu mini-PC running my dev database stack behind a Cloudflare tunnel, a Windows tower serving LLMs off a consumer GPU, and a Raspberry Pi that watches all of them. A mesh VPN stitches the fleet together; the NAS takes nightly backups. None of it is a product. It's the platform under my projects — and the cheapest DevOps education I've found.",
    ),
  ),
  p(
    span(
      "Tutorials teach you commands. A fleet you can't afford to lose teaches you operations. These are the lessons that stuck.",
    ),
  ),

  h2("The monitoring host should be your most boring machine"),

  p(
    span("The Pi runs Uptime Kuma for service checks and Beszel for host metrics — and "),
    span("nothing else", ["em"]),
    span(
      ". That's a deliberate policy, learned the obvious way. The Ubuntu box hosts experiments and the database; the Windows box runs GPU workloads that occasionally need a hard reboot. If monitoring lived on either of them, every interesting failure would take down the thing that was supposed to report the failure.",
    ),
  ),

  callout(
    "note",
    span(
      "The moment your monitoring host becomes interesting, an outage takes out the outage detector. Uptime pages want to live on the dullest, most under-utilised hardware you own.",
    ),
  ),

  h2("The process that died when I closed my laptop"),

  p(
    span(
      "The incident that reorganised how I run anything long-lived: I kicked off a five-hour embeddings backfill on the Ubuntu box over SSH — ",
    ),
    span('ssh uwh "node backfill.js &"', ["code"]),
    span(
      " — saw it start, closed the laptop, went to bed. In the morning: no process, no error, a half-written table.",
    ),
  ),
  p(
    span("Nothing crashed. The process was parented to my SSH session; when the lid closed, the connection dropped and "),
    span("SIGHUP", ["code"]),
    span(
      " cascaded down and killed the child. The ampersand backgrounds a process — it does not detach it.",
    ),
  ),

  code(
    "bash",
    `# wrong: parented to the SSH session, dies when it drops
ssh uwh "node backfill.js &"

# survives disconnects: new session, no stdio, out of the job table
ssh uwh "cd ~/jobs && setsid nohup node backfill.js \\
  > backfill.log 2>&1 < /dev/null & disown"

# trust nothing — verify the parent is init
ssh uwh 'ps -o pid,ppid,comm -p $(pgrep -f backfill.js)'
# PPID must be 1. Anything else and it's still coupled to you.`,
    "detach or it didn't happen",
  ),

  p(
    span("There's a graduation rule hiding in there: "),
    span("nohup", ["code"]),
    span(" survives logout, not reboot. Anything that must survive both stops being a shell command and becomes a systemd user unit — "),
    span("systemctl --user enable --now backfill.service", ["code"]),
    span(" — with restart policy, journald logs, and a supervisor that isn't me."),
  ),
  p(
    span(
      "If a process matters, it deserves a supervisor. If it doesn't have one, you've just volunteered.",
      ["strong"],
    ),
  ),

  h2("Windows told me the key was installed"),

  p(
    span("Adding the Windows box to the fleet produced my favourite failure of the bunch. "),
    span("ssh-copy-id", ["code"]),
    span(
      " reported success. Password prompt on the next login anyway. Ran it again — success again, password again.",
    ),
  ),
  p(
    span("Windows OpenSSH reads keys for administrator accounts from "),
    span("C:\\ProgramData\\ssh\\administrators_authorized_keys", ["code"]),
    span(", not from the user's "),
    span("~/.ssh/authorized_keys", ["code"]),
    span(". "),
    span("ssh-copy-id", ["code"]),
    span(
      " happily writes the file Windows will never read and exits zero. The tool verified its write; nothing verified the outcome. I keep a small script now that writes the key to the right path and then proves it with a non-interactive round-trip login.",
    ),
  ),

  pullQuote("Verify the effect, not the exit code."),

  h2("Same LAN, slower path"),

  p(
    span(
      "Once every machine has a mesh-VPN address, the tailnet name becomes muscle memory — and at home, that habit quietly routes traffic through WireGuard encrypt/decrypt to reach a box two metres away on the same switch. For a health check, irrelevant. For streaming tokens from the GPU box, a real tax.",
    ),
  ),
  p(
    span("So the rule is: check which network you're on first, then pick the path. LAN IP at home, tailnet name everywhere else. The overlay is a "),
    span("fallback", ["em"]),
    span(", not a default. Knowing "),
    span("why", ["em"]),
    span(
      " — where the crypto happens, when NAT traversal falls back to a relay — is the part that transfers to any networking problem at work.",
    ),
  ),

  h2("What the fleet actually teaches"),

  p(
    span("The NAS takes nightly "),
    span("restic", ["code"]),
    span(
      " backups of everything that matters, and occasionally I restore one on purpose. A backup you've never restored is a hypothesis, not a backup.",
    ),
  ),
  p(
    span(
      "Add it up and the homelab compresses the whole ops feedback loop into one room: you're the developer, the platform team, and the pager. systemd, DNS, WireGuard, tunnels, exit codes versus effects — each one stops being an abstraction the first time it pages you. When the cloud equivalent breaks at work, it's the same failure wearing a uniform.",
    ),
  ),
  p(
    span(
      "You don't need Kubernetes to learn operations. You need one small fleet you can't afford to lose, and a pager that points at you.",
      ["strong"],
    ),
  ),
];

async function main() {
  const client = getCliClient();

  await client.createIfNotExists({
    _id: "tag-devops",
    _type: "tag",
    name: "DevOps",
    slug: { _type: "slug", current: "devops" },
    description:
      "Linux, systemd, networking, monitoring, and backups — operating real machines, and the habits that transfer to any platform.",
  });

  const tagSlugs = ["devops", "architecture"];
  const tags = await client.fetch<{ _id: string; slug: string }[]>(
    `*[_type == "tag" && slug.current in $slugs]{ _id, "slug": slug.current }`,
    { slugs: tagSlugs },
  );

  const missing = tagSlugs.filter((s) => !tags.find((t) => t.slug === s));
  if (missing.length > 0) {
    throw new Error(`Missing tags in Sanity: ${missing.join(", ")}`);
  }

  const post = {
    _id: "drafts.post-homeops-devops-classroom",
    _type: "post" as const,
    title: "Four boxes and a Pi: the homelab as a DevOps classroom",
    slug: {
      _type: "slug" as const,
      current: "four-boxes-and-a-pi-homelab-devops-classroom",
    },
    excerpt:
      "A Raspberry Pi monitoring hub, an Ubuntu box behind a Cloudflare tunnel, a Windows tower serving LLMs off a consumer GPU, and a NAS taking nightly backups — stitched together with a mesh VPN and systemd. What operating a five-machine fleet end-to-end teaches that tutorials can't.",
    publishedAt: "2026-07-15T12:00:00Z",
    tags: tags.map((t) => ({
      _type: "reference" as const,
      _ref: t._id,
      _key: k(),
    })),
    body,
  };

  await client.createOrReplace(post);
  console.log(`✓ Drafted ${post.title}`);
  console.log(`  (unpublished draft — review & publish in /studio)`);
  console.log(`  /blog/${post.slug.current}`);
  console.log(`  ${post.tags.length} tags · ${body.length} body blocks`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
