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

let output: vscode.OutputChannel;

function log(message: string): void {
  const ts = new Date().toISOString().substring(11, 19);
  output.appendLine(`[${ts}] ${message}`);
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

  const api = kbEditor.isActive ? kbEditor.exports : await kbEditor.activate();
  if (!api || !api.patternAPI) {
    log('Could not obtain patternAPI from KB Editor.');
    return;
  }

  registerProviders(api.patternAPI, context);
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
