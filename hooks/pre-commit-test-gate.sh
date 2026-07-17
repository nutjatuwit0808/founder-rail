#!/bin/sh
# PreToolUse hook (Bash): block `git commit` while the test suite fails.
# Exit 2 blocks the command and tells the agent why. POSIX sh, jq optional.

input=$(cat)

if command -v jq >/dev/null 2>&1; then
  cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty')
else
  cmd=$input
fi

printf '%s' "$cmd" | grep -qE '(^|[;&|[:space:]"])git[[:space:]]+([^;&|]*[[:space:]])?commit([[:space:]]|$)' || exit 0

# No JS project in cwd -> nothing to gate.
[ -f package.json ] && command -v npm >/dev/null 2>&1 || exit 0

# Only gate when a real test script exists.
if command -v jq >/dev/null 2>&1; then
  test_script=$(jq -r '.scripts.test // empty' package.json)
else
  test_script=$(grep -o '"test"[[:space:]]*:[[:space:]]*"[^"]*"' package.json | head -1 | sed 's/.*:[[:space:]]*"//; s/"$//')
fi
[ -z "$test_script" ] && exit 0
printf '%s' "$test_script" | grep -qi 'no test specified' && exit 0

out=$(npm test --silent 2>&1)
if [ $? -ne 0 ]; then
  echo "BLOCKED: tests are failing — commits are not allowed until the suite passes." >&2
  echo "Fix the failures, do not weaken or skip tests, then commit again. Output:" >&2
  echo "$out" | tail -50 >&2
  exit 2
fi
exit 0
