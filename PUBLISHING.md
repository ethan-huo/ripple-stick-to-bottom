# Publishing

This package is distributed from GitHub version tags. `main` is the source
branch. Release tags are consumable snapshots.

This is a **source-distributed** package: the release tag ships the
`.tsrx`/`.ts` source (compiled by the consumer's Ripple vite plugin), not a
built `dist/`.

## Version Contract

`package.json#version` is the source of truth for release tags.

When `package.json` changes on `main`, `.github/workflows/release.yml`:

1. Reads `package.json#version`.
2. Resolves the release tag as `v${version}`.
3. Refuses non-semver versions.
4. Refuses versions not greater than the latest `vX.Y.Z` tag.
5. Typechecks.
6. Creates an annotated tag from a release-only tree.

The release tag contains only: `package.json` (without `scripts`/`devDependencies`),
`README.md`, `LICENSE`, and `src/`. Repository-only files (`.github/`, configs)
are excluded.

If the tag already exists, the workflow exits without creating a new tag.

## Releasing

1. Update `package.json#version`.
2. Commit and push to `main`.
3. Let CI create the matching tag.

Consumers depend on a version tag, not `main`:

```bash
bun add github:ethan-huo/ripple-stick-to-bottom#v0.1.0
```
