
const { onCall } = require("firebase-functions/v2/on_call");
const { initializeApp } = require("firebase-admin/app");
const { genkit } = require("genkit");
const { googleAI } = require("@genkit-ai/googleai");
const { firebase } = require("@genkit-ai/firebase");

// Dynamically import ES module (ts-node)
let generateNewPuzzle, requestPuzzleHint;

const loadTsModules = async () => {
  // Guard against repeated loads
  if (generateNewPuzzle && requestPuzzleHint) return;

  const tsNode = await import('ts-node');
  // Configure ts-node to use CommonJS modules for this context
  tsNode.register({
    compilerOptions: {
      module: 'commonjs',
      target: 'es2017',
    }
  });
  const puzzleModule = require("../../src/ai/flows/generate-puzzle.ts");
  const hintModule = require("../../src/ai/flows/generate-hint.ts");
  generateNewPuzzle = puzzleModule.generateNewPuzzle;
  requestPuzzleHint = hintModule.requestPuzzleHint;
};

initializeApp();

genkit({
  plugins: [
    googleAI(),
    firebase(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

exports.generateNewPuzzle = onCall(async (request) => {
  await loadTsModules();
  const puzzle = await generateNewPuzzle(request.data);
  return puzzle;
});

exports.requestPuzzleHint = onCall(async (request) => {
  await loadTsModules();
  const hint = await requestPuzzleHint(request.data);
  return hint;
});
