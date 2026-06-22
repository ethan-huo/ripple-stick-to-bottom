/**
 * Build .tsrx/.ts source into distributable JS.
 *
 * Ripple components compile differently for client vs server, so each .tsrx
 * entry emits BOTH variants; package.json exports route them via the
 * `browser` / `worker` conditions (same scheme `ripple` itself uses). Plain
 * .ts modules are transpiled once (type-stripped, imports preserved).
 *
 * This exists because source-distributed .tsrx cannot be consumed from
 * node_modules by an SSR app — Vite externalizes the dep and feeds raw .tsrx
 * to rollup. Shipping compiled JS makes the package a first-class dependency.
 */
import { compile } from "@tsrx/ripple"
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"

const root = new URL("..", import.meta.url).pathname
const dist = root + "dist"

rmSync(dist, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })

/** Compile one .tsrx component into client + server JS plus a shared CSS file. */
function buildComponent(name: string, srcFile: string) {
  const source = readFileSync(root + "src/" + srcFile, "utf8")

  const client = compile(source, srcFile, { mode: "client" })
  const server = compile(source, srcFile, { mode: "server" })
  for (const r of [client, server]) {
    if (r.errors?.length) throw new Error(`${srcFile}: ${JSON.stringify(r.errors)}`)
  }

  let cssImport = ""
  if (client.css) {
    writeFileSync(`${dist}/${name}.css`, client.css)
    cssImport = `\nimport "./${name}.css";\n`
  }

  writeFileSync(`${dist}/${name}.client.js`, client.code + cssImport)
  writeFileSync(`${dist}/${name}.server.js`, server.code + cssImport)
}

/** Transpile a plain .ts module: strip types, keep imports as-is. */
function buildModule(name: string, srcFile: string) {
  const source = readFileSync(root + "src/" + srcFile, "utf8")
  const out = new Bun.Transpiler({ loader: "ts", target: "browser" }).transformSync(source)
  writeFileSync(`${dist}/${name}.js`, out)
}

buildModule("controller", "controller.ts")
buildComponent("stick-to-bottom", "stick-to-bottom.tsrx")

console.log("built dist/")
