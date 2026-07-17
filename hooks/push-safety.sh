#!/bin/sh
# PreToolUse hook (Bash): block force-pushes and deleting main branches.
# Exit 2 blocks the command. POSIX sh, jq optional.

input=$(cat)

if command -v jq >/dev/null 2>&1; then
  cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty')
else
  cmd=$input
fi

printf '%s' "$cmd" | grep -qE '(^|[;&|[:space:]"])git[[:space:]]+([^;&|]*[[:space:]])?push([[:space:]]|$)' || exit 0

if printf '%s' "$cmd" | grep -qE 'push[^;&|]*(--force([^-]|$)|--force-with-lease|[[:space:]]-f([[:space:]]|$)|[[:space:]]\+[A-Za-z0-9])'; then
  echo "BLOCKED: force-pushing is not allowed — it can permanently erase saved history." >&2
  echo "If history truly needs rewriting, explain the situation to the user in plain language and let them decide." >&2
  exit 2
fi

if printf '%s' "$cmd" | grep -qE 'push[^;&|]*(--delete|[[:space:]]-d[[:space:]]|:)[[:space:]]*(main|master)([[:space:]]|$)'; then
  echo "BLOCKED: deleting the main branch is not allowed." >&2
  exit 2
fi

exit 0
