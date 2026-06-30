# KB Editor Pattern Extension — Starter

A minimal, ready-to-build template for extending **KB Editor** (the GeneXus visual editor
inside VS Code / VSCodium) so your **GeneXus pattern** gets a first-class editing
experience: dynamic dropdowns, custom node captions, and context commands.

This starter contains the wiring and **no example logic** — it is the blank canvas you
start from. For a complete, real-world implementation see the companion
**`kbbridge-editor-pattern-genexus-workwith`** project (a faithful port of the GeneXus *Work With*
pattern) and the documentation site.

> **New here? Read [`ai/START-HERE.md`](ai/START-HERE.md) first.** It explains the
> architecture, the SDK, and how to implement each extensibility mechanism.

## What you get

- `src/extension.ts` — activates, obtains the `PatternExtensionAPI` from KB Editor, and
  exposes a single `registerProviders()` hook with a `TODO`.
- `vendor/genexus-sdk/` — a vendored, compiled copy of `@kbbridge/genexus-sdk` (the API you
  code against). MIT licensed; safe to commit.
- `scripts/bundle-dependencies.js` — copies the vendored SDK into `node_modules` (for
  building) and `out/node_modules` (so the packaged `.vsix` runs standalone).
- `ai/` — the documentation set that teaches an AI assistant (or a developer) how to build
  the integration, including the C#→TypeScript transcription workflow.
- `reference/` — a **git-ignored** folder where you place your pattern's .NET sources to
  transcribe from. Nothing in it is published.

## Quick start

```bash
# 1. Rename the extension
#    Edit package.json: name, displayName, publisher.

# 2. Install tooling and link the vendored SDK
npm install

# 3. Build
npm run compile        # tsc → out/
npm run bundle         # vendored SDK → node_modules + out/node_modules

# 4. Implement your providers in src/ (see ai/START-HERE.md), then package
npm run package        # → my-pattern-extension-0.1.0.vsix
```

Install the resulting `.vsix` in the same VS Code / VSCodium where **KB Editor** is
installed, reload the window, and open a `.gxPattern` instance of your pattern type.

## The three mechanisms (where to implement them)

| Mechanism | Interface | You implement |
|---|---|---|
| Custom Types (dropdowns) | `IPatternCustomTypeSupport` / `IPatternCustomTypeEditor` | `getTypeEditor` → `getValues` |
| Captions (node labels) | `IPatternEditorHelper` | `customShowElement` |
| Custom Actions (commands) | `IPatternEditorHelper` + `PatternEditorCommandBase` | `getCommands` + a command's `exec` |

Register them from `registerProviders()` in `src/extension.ts`.

## Requirements

- KB Editor (`kbbridge.genexus-visual-editor`) installed in the host editor.
- Node.js 18+ and npm.

## License

MIT — see `LICENSE`. (Update the copyright holder to your organization.)
