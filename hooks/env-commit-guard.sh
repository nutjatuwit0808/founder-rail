#!/bin/sh
# PreToolUse hook (Bash): block `git commit` while a .env-style file is staged.
# Exit 2 blocks the command and tells the agent why. POSIX sh, jq optional.
#
# Precision policy: this must never false-positive. It only fires when git
# itself reports a staged file whose basename is `.env` or `.env.<something>`,
# and explicitly allows the placeholder variants (.env.example / .env.sample /
# .env.template), which are meant to be committed.

input=$(cat)

if command -v jq >/dev/null 2>&1; then
  cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty')
else
  cmd=$input
fi

printf '%s' "$cmd" | grep -qE '(^|[;&|[:space:]"])git[[:space:]]+([^;&|]*[[:space:]])?commit([[:space:]]|$)' || exit 0

# Not a git repo -> nothing to guard.
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

staged=$(git diff --cached --name-only 2>/dev/null | grep -E '(^|/)\.env(\.[^/]+)?$' | grep -vE '\.env\.(example|sample|template)$')

if [ -n "$staged" ]; then
  echo "BLOCKED: a secrets file (.env) is staged for commit:" >&2
  echo "$staged" >&2
  echo "Real .env files must never enter the repository history. Unstage it (git restore --staged <file>), add it to .gitignore, and commit a .env.example with placeholder values instead if the variable names need documenting." >&2
  exit 2
fi
exit 0
