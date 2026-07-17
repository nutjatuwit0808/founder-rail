#!/bin/sh
# PreToolUse hook (Edit|Write): block file writes containing secret-looking content.
# Exit 2 blocks the write. POSIX sh, jq optional. Fails closed on real-looking keys.

input=$(cat)

if command -v jq >/dev/null 2>&1; then
  content=$(printf '%s' "$input" | jq -r '(.tool_input.content // "") + "\n" + (.tool_input.new_string // "")')
else
  content=$input
fi

[ -z "$content" ] && exit 0

PLACEHOLDERS='(XXXX|example|your[_-]|<[A-Za-z_ -]+>|\$\{|process\.env|import\.meta\.env)'

# check <grep-flags> <pattern> <label>
# Blocks only if a matching line is NOT an obvious placeholder line.
# Quote classes include backslash because in no-jq fallback mode we scan the
# raw JSON payload, where quotes arrive escaped as \".
check() {
  hits=$(printf '%s\n' "$content" | grep $1 -- "$2" | grep -vE "$PLACEHOLDERS")
  if [ -n "$hits" ]; then
    echo "BLOCKED: this write appears to contain a $3." >&2
    echo "Never hard-code secrets. Put the value in an environment variable (e.g. process.env.MY_KEY) and add it to .env, which must be gitignored." >&2
    exit 2
  fi
}

check -E 'AKIA[0-9A-Z]{16}' 'AWS access key'
check -E '-----BEGIN (RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----' 'private key block'
check -E 'sk-(ant-)?[A-Za-z0-9_-]{20,}' 'API secret key'
check -E '(ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{22,})' 'GitHub token'
check -E 'xox[baprs]-[A-Za-z0-9-]{10,}' 'Slack token'
check -iE '(api[_-]?key|secret|password|token)[\\"'"'"']*[[:space:]]*[:=][[:space:]]*[\\"'"'"']+[A-Za-z0-9+/_-]{16,}[\\"'"'"']' 'hard-coded credential'

exit 0
