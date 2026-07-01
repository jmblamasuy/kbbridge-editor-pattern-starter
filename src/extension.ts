/**
 * Starter extension that hooks into KB Editor's pattern extensibility API.
 *
 * This file is intentionally minimal: it activates, obtains the PatternExtensionAPI from
 * KB Editor (extension id `kbbridge.genexus-visual-editor`) and leaves a single, clearly
 * marked place where you register your providers.
 *
 * Replace "MyPattern" with your GeneXus pattern type (the value of the pattern instance's
 * type, e.g. "WorkWith", "PXWorkWith", ...) and implement the three mechanisms:
 *   1. Custom Types   → IPatternCustomTypeSupport   (dynamic dropdown values)
 *   2. Captions       → IPatternEditorHelper.customShowElement
 *   3. Custom Actions → IPatternEditorHelper.getCommands + PatternEditorCommandBase
 *
 * See ai/START-HERE.md for the full guide.
 */

import * as vscode from 'vscode';
import {
  PatternExtensionAPI,
  // The provider interfaces you will implement live here:
  // IPatternCustomTypeSupport,
  // IPatternEditorHelper,
  // IPatternVariableProvider,
} from '@kbbridge/genexus-sdk';

/** Shape of the object KB Editor exports from its own `activate()`. */
interface VisualEditorAPI {
  patternAPI: PatternExtensionAPI;
}

const KB_EDITOR_EXTENSION_ID = 'kbbridge.genexus-visual-editor';

// KB Editor and this extension both activate on startup. VS Code should activate KB Editor
// first (it is declared in `extensionDependencies`), but on some setups that ordering is not
// honored and this extension runs first — or KB Editor reports `isActive` before its
// `activate()` has populated the exported API. So we retry acquiring the API for a short
// window instead of giving up on the first attempt.
const ACQUIRE_TIMEOUT_MS = 15000;
const ACQUIRE_POLL_MS = 300;

let output: vscode.OutputChannel;

function log(message: string): void {
  const ts = new Date().toISOString().substring(11, 19);
  output.appendLine(`[${ts}] ${message}`);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Obtain KB Editor's `patternAPI`, tolerating activation-ordering races.
 *
 * `kbEditor.activate()` resolves with the extension's exports and also triggers KB Editor's
 * activation if it has not started yet; but when KB Editor is flagged active while its
 * activation is still in flight, the exports can momentarily be undefined. We therefore call
 * `activate()` and read `exports`, retrying every ACQUIRE_POLL_MS until the API surfaces or
 * the timeout elapses — so a slow or late KB Editor activation is waited out instead of
 * reported as "no pattern API".
 */
async function acquirePatternAPI(
  kbEditor: vscode.Extension<VisualEditorAPI>,
): Promise<PatternExtensionAPI | undefined> {
  const deadline = Date.now() + ACQUIRE_TIMEOUT_MS;
  for (;;) {
    let api: VisualEditorAPI | undefined;
    try {
      api = await kbEditor.activate();
    } catch (error) {
      log(`Error while activating KB Editor: ${error}`);
    }
    const resolved: VisualEditorAPI | undefined =
      api ?? (kbEditor.exports as VisualEditorAPI | undefined);
    if (resolved?.patternAPI) {
      return resolved.patternAPI;
    }
    if (Date.now() >= deadline) {
      return undefined;
    }
    await delay(ACQUIRE_POLL_MS);
  }
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  output = vscode.window.createOutputChannel('My Pattern Extension');
  context.subscriptions.push(output);
  log('Activating...');

  const kbEditor = vscode.extensions.getExtension<VisualEditorAPI>(KB_EDITOR_EXTENSION_ID);
  if (!kbEditor) {
    log(`KB Editor (${KB_EDITOR_EXTENSION_ID}) not found. Pattern features are unavailable.`);
    return;
  }

  const patternAPI = await acquirePatternAPI(kbEditor);
  if (!patternAPI) {
    log(
      `Could not obtain the pattern extensibility API from KB Editor after ` +
        `${ACQUIRE_TIMEOUT_MS / 1000}s. Reload the window, or install/enable/update KB Editor.`,
    );
    return;
  }

  registerProviders(patternAPI, context);
  log('Activated.');
}

/**
 * Register your pattern providers here.
 *
 * TODO: implement and register your providers. Minimal example:
 *
 *   const patternType = 'MyPattern';
 *
 *   const customTypes = new MyPatternCustomTypeSupport();   // IPatternCustomTypeSupport
 *   api.registerCustomTypeSupport(patternType, customTypes);
 *
 *   const editorHelper = new MyPatternEditorHelper();        // IPatternEditorHelper
 *   api.registerEditorHelper(patternType, editorHelper);
 *
 *   // Optional: variables for autocomplete in embedded code
 *   // const variables = new MyPatternVariableProvider();
 *   // api.registerVariableProvider(patternType, variables);
 *
 *   context.subscriptions.push({
 *     dispose: () => {
 *       api.unregisterCustomTypeSupport(patternType);
 *       api.unregisterEditorHelper(patternType);
 *       // api.unregisterVariableProvider(patternType);
 *     },
 *   });
 */
function registerProviders(api: PatternExtensionAPI, context: vscode.ExtensionContext): void {
  // Avoid "unused parameter" errors until you add your registrations.
  void api;
  void context;
  log('No providers registered yet. See registerProviders() and ai/START-HERE.md.');
}

export function deactivate(): void {
  // Disposables registered in context.subscriptions are cleaned up automatically.
}
