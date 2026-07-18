---
description: Report something broken in plain words — gets reproduced, tested, and fixed through the quality harness
---

Fix a bug the user describes:

1. Invoke the `founder-rail:fix-bug` skill with the user's description (command arguments or conversation).
2. If the description turns out to be a change request rather than a breakage ("it works as promised, but I want it different"), say so plainly and route to `/founder-rail:idea` (which handles updating an existing feature) instead — the user doesn't need to know the difference in advance.
