# Verify: vercel-fullstack launch

A launch is not done until every check below passes against the **production URL**.

1. **Home page loads** — fetch the production URL; expect HTTP 200 and real page content (not a host error page).
2. **Health route responds** — fetch `<url>/api/health`; expect HTTP 200 (the route is scaffolded by the stack recipe).
3. **A core flow works** — pick the most important acceptance criterion from the newest `done` feature and exercise it against production (via browser or HTTP). A launch that "deployed successfully" but whose main flow errors is a failed launch.
4. **Report** — plain language, user's language: the URL, what was verified, and any ⚠️ still open (e.g. env var the user hasn't set yet — name it and where to set it).

If any check fails: do **not** leave it — either fix and relaunch, or restore the previous deployment (Vercel dashboard → Deployments → previous → Promote to Production) and report honestly what happened.
