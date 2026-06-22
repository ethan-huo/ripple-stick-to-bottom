# ripple-stick-to-bottom

Stick-to-bottom scroll primitives for [Ripple](https://github.com/trueadm/ripple)
/ TSRX, for streaming content (chat, logs, live output). The viewport stays
pinned to the bottom as content grows, and releases the pin the moment the user
scrolls up.

Distributed as compiled JS from GitHub version tags (no npm package). Each
`.tsrx` is built to client + server variants via `@tsrx/ripple`; the
`browser`/`worker` export conditions route them per environment, so it works as
a normal dependency of a Ripple SSR app.

## Install

Depend on a version tag:

```bash
bun add github:ethan-huo/ripple-stick-to-bottom#v0.2.0
```

## Usage

```ts
import { StickToBottom } from "ripple-stick-to-bottom"
import { StickToBottomController } from "ripple-stick-to-bottom/controller"
```

| Export | Module |
| --- | --- |
| `.` | the `StickToBottom` component + `createStickToBottom` |
| `./controller` | imperative scroll controller |

## Peer dependencies

- `ripple >= 0.3.0`

## Releasing

See [PUBLISHING.md](./PUBLISHING.md). Bump `package.json#version`, push to
`main`, and CI tags `v${version}`.
