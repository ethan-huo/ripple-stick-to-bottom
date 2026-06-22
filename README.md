# ripple-stick-to-bottom

Stick-to-bottom scroll primitives for [Ripple](https://github.com/trueadm/ripple)
/ TSRX, for streaming content (chat, logs, live output). The viewport stays
pinned to the bottom as content grows, and releases the pin the moment the user
scrolls up.

Distributed as source from GitHub version tags — the consumer's Ripple vite
plugin compiles the `.tsrx`. There is no built `dist/` and no npm package.

## Install

Depend on a version tag:

```bash
bun add github:ethan-huo/ripple-stick-to-bottom#v0.1.0
```

## Usage

```ts
import { StickToBottom } from "ripple-stick-to-bottom"
import { StickToBottomController } from "ripple-stick-to-bottom/controller"
```

| Export | Module |
| --- | --- |
| `.` | `src/stick-to-bottom.tsrx` — the component |
| `./controller` | `src/controller.ts` — imperative scroll controller |

## Peer dependencies

- `ripple >= 0.3.0`

## Releasing

See [PUBLISHING.md](./PUBLISHING.md). Bump `package.json#version`, push to
`main`, and CI tags `v${version}`.
