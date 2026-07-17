# Contributing

Contributions are welcome under the MIT license with a Developer Certificate of Origin (DCO) — no CLA.

Sign off every commit to certify you have the right to contribute the code:

```
git commit -s -m "your message"
```

which adds a `Signed-off-by: Your Name <you@example.com>` line. See https://developercertificate.org for the full text you are certifying.

## Ground rules for changes

- Every skill must obey the six non-negotiable principles in README.md — in particular: no technical questions to the user, and enforcement via hooks rather than prompt text.
- Hooks must stay POSIX sh (they run under Git Bash on Windows too) and must fail *closed* (block) on the conditions they guard.
- Keep skills concise; put user-visible wording rules (plain language, risk indicators) inside the skill so they survive context loss.
