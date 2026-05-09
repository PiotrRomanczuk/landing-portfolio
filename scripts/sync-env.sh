#!/usr/bin/env bash
# Sync env vars from .env.local to Vercel (production + development + preview).
# Skips comment/empty lines and lines without a value.
# Removes existing var first so re-running doesn't conflict.

set -e

if [[ ! -f .env.local ]]; then
  echo "No .env.local found. Aborting."
  exit 1
fi

while IFS='=' read -r key value; do
  if [[ "$key" =~ ^[[:space:]]*# || -z "$key" || -z "$value" ]]; then
    continue
  fi
  # Strip leading/trailing whitespace
  key="${key// /}"
  echo ""
  echo "→ $key"
  for env in production development; do
    npx vercel env rm "$key" "$env" --yes >/dev/null 2>&1 || true
    if echo -n "$value" | npx vercel env add "$key" "$env" >/dev/null 2>&1; then
      echo "  ✓ $env"
    else
      echo "  ✗ $env (failed)"
    fi
  done
  # Preview without git-branch — applies to all preview branches
  npx vercel env rm "$key" preview --yes >/dev/null 2>&1 || true
  if echo -n "$value" | npx vercel env add "$key" preview >/dev/null 2>&1; then
    echo "  ✓ preview"
  else
    echo "  ✗ preview (failed)"
  fi
done < .env.local

echo ""
echo "Done."
