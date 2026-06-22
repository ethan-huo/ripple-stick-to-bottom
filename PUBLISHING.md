# Publishing

This package is distributed from GitHub version tags. `main` is the source
branch. Release tags are consumable snapshots.

The release tag ships **compiled `dist/`**: each `.tsrx` is built to client +
server JS via `@tsrx/ripple` and routed by the `browser`/`worker` export
conditions. Source `.tsrx` cannot be consumed from node_modules by an SSR app
(Vite externalizes it and feeds raw `.tsrx` to rollup), so the package ships
compiled output like any normal dependency.

## Version Contract

`package.json#version` is the source of truth for release tags.

When `package.json` changes on `main`, `.github/workflows/release.yml`:

1. Reads `package.json#version`.
2. Resolves the release tag as `v${version}`.
3. Refuses non-semver versions.
4. Refuses versions not greater than the latest `vX.Y.Z` tag.
5. Typechecks and builds `dist/`.
6. Creates an annotated tag from a release-only tree.

The release tag contains only: `package.json` (without `scripts`/`devDependencies`),
`README.md`, `LICENSE`, and `dist/`. Source and repository-only files are excluded.

If the tag already exists, the workflow exits without creating a new tag.

## Releasing

1. Update `package.json#version`.
2. Commit and push to `main`.
3. Let CI create the matching tag.

Consumers depend on a version tag, not `main`:

```bash
bun add github:ethan-huo/ripple-stick-to-bottom#v0.2.0
```
