#!/bin/sh
# PreToolUse hook (Bash): block database commands that certainly destroy data.
# Exit 2 blocks the command and tells the agent why. POSIX sh, jq optional.
#
# Precision policy: zero false positives. Only commands that are destructive
# 100% of the time they run are blocked:
#   - prisma migrate reset            (wipes the entire database by design)
#   - prisma db push --accept-data-loss / --force-reset  (flag says it all)
#   - dropdb                          (drops a whole database)
#   - psql ... DROP DATABASE / TRUNCATE
# Everyday commands (prisma migrate dev, prisma db push, prisma migrate
# deploy) are deliberately NOT blocked — blocking daily work is a false
# positive. Follows the push-safety pattern: block always; if the user truly
# wants it, they run it themselves after a plain-language explanation.

input=$(cat)

if command -v jq >/dev/null 2>&1; then
  cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty')
else
  cmd=$input
fi

[ -z "$cmd" ] && exit 0

block() {
  echo "BLOCKED: this command permanently destroys database data ($1)." >&2
  echo "Explain to the user in plain language what would be lost. If they truly want it, they must run the command themselves — never run it on their behalf, and never look for a way around this block." >&2
  exit 2
}

# prisma migrate reset (any runner: npx / pnpm dlx / yarn / direct)
printf '%s' "$cmd" | grep -qE 'prisma[[:space:]]+migrate[[:space:]]+reset' && block "prisma migrate reset wipes every table"

# prisma db push with an explicit data-loss flag
printf '%s' "$cmd" | grep -qE 'prisma[[:space:]]+db[[:space:]]+push[^;|&]*--(accept-data-loss|force-reset)' && block "the flag explicitly accepts losing data"

# dropping a whole database
printf '%s' "$cmd" | grep -qE '(^|[;&|[:space:]"])dropdb([[:space:]]|$)' && block "dropdb deletes an entire database"
printf '%s' "$cmd" | grep -qiE 'psql[^;|&]*(DROP[[:space:]]+DATABASE|TRUNCATE[[:space:]])' && block "raw SQL that drops or truncates"

exit 0
