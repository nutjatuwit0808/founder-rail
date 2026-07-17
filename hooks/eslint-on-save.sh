#!/bin/sh
# PostToolUse hook (Edit|Write): lint-fix any JS/TS file the agent just changed.
# Exit 2 feeds remaining problems back to the agent to fix. POSIX sh, jq optional.

input=$(cat)

if command -v jq >/dev/null 2>&1; then
  file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')
else
  file=$(printf '%s' "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*:[[:space:]]*"//; s/"$//')
fi

[ -z "$file" ] && exit 0
file=$(printf '%s' "$file" | sed 's|\\\\|/|g; s|\\|/|g')

case "$file" in
  *.js|*.jsx|*.ts|*.tsx) ;;
  *) exit 0 ;;
esac

# Nearest package.json upward from the file = project root
dir=$(dirname "$file")
root=""
while [ -n "$dir" ] && [ "$dir" != "/" ] && [ "$dir" != "." ]; do
  if [ -f "$dir/package.json" ]; then root="$dir"; break; fi
  parent=$(dirname "$dir")
  [ "$parent" = "$dir" ] && break
  dir=$parent
done
[ -z "$root" ] && exit 0

cd "$root" || exit 0
command -v npx >/dev/null 2>&1 || exit 0
if [ ! -f eslint.config.mjs ] && [ ! -f eslint.config.js ] && [ ! -f .eslintrc.json ] && [ ! -f .eslintrc.cjs ]; then
  exit 0
fi

out=$(npx --no-install eslint --fix "$file" 2>&1)
status=$?
if [ $status -ne 0 ]; then
  echo "Code standards check found problems in $file that could not be auto-fixed. Fix them now:" >&2
  echo "$out" >&2
  exit 2
fi
exit 0
